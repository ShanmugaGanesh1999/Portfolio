# Design Payment System

> Reliable payment processing with ACID guarantees

---

## 📋 Problem Statement

Design a payment system that handles money transfers, payment processing, and financial transactions with high reliability.

---

## R - Requirements

### Functional Requirements

```
1. Process payments (credit card, debit, bank transfer)
2. Handle refunds and chargebacks
3. Wallet/balance management
4. Transaction history
5. Integration with payment providers (Stripe, PayPal)
6. Multi-currency support
```

### Non-Functional Requirements

```
1. ACID compliance (no double-spending, no lost money)
2. High availability (99.99%+)
3. Exactly-once processing (idempotency)
4. PCI-DSS compliance
5. Audit trail for all transactions
6. Low latency (<2 seconds for payment)
```

---

## E - Estimation

```
Transactions: 100M/day
Average transaction: $50
Peak: 10K transactions/second

Storage:
├── Transaction records: 100M × 1KB = 100GB/day
├── 5 years retention: ~180TB
├── Audit logs: 2× transaction data = 360TB

Availability requirement:
├── 99.99% = 52 minutes downtime/year
├── Must handle failures gracefully
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  API Gateway                         │   │
│   │              (Rate limiting, Auth)                   │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │               Payment Orchestrator                   │   │
│   │           (Saga pattern, State machine)             │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌──────────┬──────────────┼──────────────┬─────────────┐  │
│   ▼          ▼              ▼              ▼             ▼  │
│ ┌──────┐  ┌──────┐    ┌──────────┐  ┌──────────┐  ┌──────┐ │
│ │Wallet│  │Risk  │    │ Payment  │  │ Ledger   │  │Notif │ │
│ │ Svc  │  │ Svc  │    │ Gateway  │  │  Svc     │  │ Svc  │ │
│ └──┬───┘  └──────┘    └────┬─────┘  └────┬─────┘  └──────┘ │
│    │                       │              │                  │
│    ▼                       ▼              ▼                  │
│ ┌──────┐           ┌────────────┐   ┌──────────┐            │
│ │ DB   │           │  Stripe/   │   │ Ledger   │            │
│ │(PG)  │           │  PayPal    │   │   DB     │            │
│ └──────┘           └────────────┘   └──────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Idempotency (Critical!)

```
┌─────────────────────────────────────────────────────────────┐
│              Idempotency                                     │
│                                                              │
│   Problem: Network failure after payment processed          │
│   - Client retries                                          │
│   - Without protection: DOUBLE CHARGE!                      │
│                                                              │
│   Solution: Idempotency key                                  │
│                                                              │
│   Request:                                                   │
│   POST /v1/payments                                          │
│   Idempotency-Key: abc-123-def-456                          │
│   {                                                          │
│     "amount": 100,                                          │
│     "currency": "USD",                                      │
│     "source": "card_xxx"                                    │
│   }                                                          │
│                                                              │
│   Server behavior:                                           │
│   1. Check if idempotency key exists in DB                  │
│   2. If exists → return cached response                     │
│   3. If not → process payment, store response with key      │
│                                                              │
│   Implementation:                                            │
│   CREATE TABLE idempotency_keys (                           │
│     key           VARCHAR(255) PRIMARY KEY,                 │
│     response      JSONB,                                    │
│     created_at    TIMESTAMP,                                │
│     expires_at    TIMESTAMP  -- 24-48 hours                │
│   );                                                         │
│                                                              │
│   Key generation: Client creates unique key per operation   │
│   Example: {user_id}-{timestamp}-{random}                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Double-Entry Ledger

```
┌─────────────────────────────────────────────────────────────┐
│              Double-Entry Bookkeeping                        │
│                                                              │
│   Every transaction has equal debit and credit              │
│   Sum of all entries = 0 (always balanced)                  │
│                                                              │
│   Example: User pays $100 to merchant                       │
│                                                              │
│   Entries:                                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Account          │ Debit  │ Credit │ Balance After  │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │ User Wallet      │ $100   │        │ $400 → $300    │   │
│   │ Merchant Wallet  │        │ $100   │ $500 → $600    │   │
│   │ Platform Fee     │        │ $3     │ (from merchant)│   │
│   │ Merchant Net     │ $3     │        │ $97 net        │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Ledger table:                                              │
│   CREATE TABLE ledger_entries (                             │
│     id              BIGINT PRIMARY KEY,                     │
│     transaction_id  UUID,                                   │
│     account_id      UUID,                                   │
│     entry_type      VARCHAR(10),  -- 'DEBIT' or 'CREDIT'  │
│     amount          DECIMAL(20, 4),                        │
│     currency        VARCHAR(3),                            │
│     created_at      TIMESTAMP                              │
│   );                                                         │
│                                                              │
│   Rules:                                                     │
│   - Entries are IMMUTABLE (append-only)                    │
│   - Corrections done via new offsetting entries            │
│   - Balances computed from sum of entries                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Payment State Machine

```
┌─────────────────────────────────────────────────────────────┐
│              Payment States                                  │
│                                                              │
│                    ┌─────────┐                              │
│                    │ CREATED │                              │
│                    └────┬────┘                              │
│                         │ validate                          │
│                         ▼                                   │
│                    ┌─────────┐                              │
│           ┌────────│VALIDATED│────────┐                     │
│           │        └────┬────┘        │                     │
│           │ fail        │ authorize   │ risk_reject         │
│           ▼             ▼             ▼                     │
│      ┌────────┐   ┌──────────┐   ┌────────┐                │
│      │ FAILED │   │AUTHORIZED│   │REJECTED│                │
│      └────────┘   └────┬─────┘   └────────┘                │
│                        │ capture                            │
│                        ▼                                    │
│                   ┌─────────┐                               │
│           ┌───────│CAPTURED │───────┐                       │
│           │       └────┬────┘       │                       │
│           │ refund     │ settle     │ dispute               │
│           ▼            ▼            ▼                       │
│      ┌────────┐   ┌─────────┐  ┌──────────┐                │
│      │REFUNDED│   │ SETTLED │  │ DISPUTED │                │
│      └────────┘   └─────────┘  └──────────┘                │
│                                                              │
│   State transitions logged for audit                        │
│   Each state change is atomic                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Saga Pattern for Distributed Transactions

```
┌─────────────────────────────────────────────────────────────┐
│              Payment Saga                                    │
│                                                              │
│   Steps (orchestrated):                                      │
│                                                              │
│   1. Reserve funds from wallet                              │
│      └── Compensation: Release reservation                  │
│                                                              │
│   2. Run fraud check                                        │
│      └── Compensation: None (read-only)                    │
│                                                              │
│   3. Authorize with payment provider                        │
│      └── Compensation: Void authorization                  │
│                                                              │
│   4. Capture payment                                        │
│      └── Compensation: Refund                              │
│                                                              │
│   5. Credit merchant                                        │
│      └── Compensation: Debit merchant                      │
│                                                              │
│   6. Send confirmation                                      │
│      └── Compensation: Send failure notification           │
│                                                              │
│   If any step fails:                                         │
│   - Execute compensations in reverse order                  │
│   - Ensure eventual consistency                             │
│                                                              │
│   Orchestrator tracks saga state:                           │
│   {                                                          │
│     "saga_id": "saga_123",                                  │
│     "payment_id": "pay_456",                                │
│     "current_step": "AUTHORIZE",                            │
│     "completed_steps": ["RESERVE", "FRAUD_CHECK"],         │
│     "status": "IN_PROGRESS"                                 │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Handling Failures

```
┌─────────────────────────────────────────────────────────────┐
│              Failure Handling                                │
│                                                              │
│   1. Network timeout to payment provider                    │
│      Problem: Did the charge go through?                    │
│      Solution: Check payment status after timeout           │
│                                                              │
│   2. Server crash mid-transaction                           │
│      Problem: Inconsistent state                            │
│      Solution: Saga with recovery on startup               │
│                                                              │
│   3. Payment provider down                                  │
│      Problem: Can't process payments                        │
│      Solution: Fallback to secondary provider              │
│                                                              │
│   4. Database failure                                        │
│      Problem: Can't record transaction                      │
│      Solution: Write-ahead log, replay on recovery         │
│                                                              │
│   Recovery process:                                          │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ On startup:                                          │   │
│   │ 1. Find incomplete sagas                            │   │
│   │ 2. Check external state (payment provider)          │   │
│   │ 3. Resume or compensate based on actual state       │   │
│   │ 4. Mark saga complete                               │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Reconciliation

```
┌─────────────────────────────────────────────────────────────┐
│              Reconciliation                                  │
│                                                              │
│   Daily process to ensure consistency                       │
│                                                              │
│   1. Fetch transactions from payment provider              │
│   2. Compare with internal records                         │
│   3. Identify discrepancies:                               │
│      ├── Missing internal records                          │
│      ├── Missing provider records                          │
│      ├── Amount mismatches                                 │
│      └── Status mismatches                                 │
│   4. Generate reconciliation report                        │
│   5. Alert on discrepancies                                │
│   6. Auto-fix known patterns                               │
│                                                              │
│   Example discrepancy:                                       │
│   - Internal: AUTHORIZED                                    │
│   - Provider: DECLINED                                      │
│   - Action: Update internal status, release funds          │
│                                                              │
│   Reconciliation table:                                      │
│   {                                                          │
│     "date": "2024-01-15",                                   │
│     "total_transactions": 1000000,                          │
│     "matched": 999950,                                      │
│     "discrepancies": 50,                                    │
│     "auto_fixed": 45,                                       │
│     "needs_review": 5                                       │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Fraud Detection

```
┌─────────────────────────────────────────────────────────────┐
│              Risk Service                                    │
│                                                              │
│   Real-time fraud scoring:                                   │
│                                                              │
│   Signals:                                                   │
│   ├── Transaction amount (unusual?)                        │
│   ├── Frequency (velocity check)                           │
│   ├── Location (new device/location?)                      │
│   ├── Time (unusual hour?)                                 │
│   ├── Card/account age                                     │
│   ├── Historical chargebacks                               │
│   └── ML model score                                       │
│                                                              │
│   Rules engine:                                              │
│   IF amount > $1000 AND new_device                         │
│      → REQUEST_2FA                                          │
│                                                              │
│   IF velocity(1h) > 10 transactions                         │
│      → BLOCK                                                │
│                                                              │
│   IF country != usual_country                               │
│      → FLAG_FOR_REVIEW                                      │
│                                                              │
│   Response:                                                  │
│   {                                                          │
│     "decision": "ALLOW",  // ALLOW, BLOCK, REVIEW, 2FA    │
│     "score": 0.15,                                         │
│     "reasons": ["low_amount", "known_device"]              │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 API Design

```
# Create payment
POST /v1/payments
Idempotency-Key: unique-key-123
{
    "amount": 10000,        # in cents
    "currency": "USD",
    "source": "card_xxx",
    "destination": "merchant_yyy",
    "metadata": {...}
}

# Response
{
    "id": "pay_123",
    "status": "AUTHORIZED",
    "amount": 10000,
    "currency": "USD",
    "created_at": "..."
}

# Capture payment
POST /v1/payments/{id}/capture

# Refund
POST /v1/payments/{id}/refund
{
    "amount": 5000  # partial refund
}

# Get transaction
GET /v1/payments/{id}

# List transactions
GET /v1/payments?status=SETTLED&from=2024-01-01
```

---

## 📊 Summary

```
Key Components:
├── Payment Orchestrator: Saga for distributed transactions
├── Ledger Service: Double-entry bookkeeping
├── Risk Service: Real-time fraud detection
├── Reconciliation: Daily consistency checks

Key Decisions:
├── Idempotency keys for exactly-once processing
├── Saga pattern for multi-step transactions
├── Append-only ledger for audit trail
├── State machine for payment lifecycle

Critical Properties:
├── ACID for financial data
├── Idempotency for safety
├── Reconciliation for consistency
├── Audit logging for compliance
```

---

## 📖 Next Steps

→ Continue to [Design Deployment System](./15-deployment-system.md)
