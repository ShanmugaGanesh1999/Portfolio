# Reliability

> Building systems that work correctly even when things go wrong

---

## 📖 What is Reliability?

**Reliability** is the probability that a system performs its intended function correctly over a specified period of time.

While **availability** asks "Is it up?", **reliability** asks "Does it work correctly?"

---

## 🎯 Reliability vs Availability

```
┌─────────────────────────────────────────────────────────────┐
│              High Availability, Low Reliability              │
│                                                              │
│   System is always up, but sometimes gives wrong answers     │
│   Example: Search returns wrong results 5% of the time       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│              Low Availability, High Reliability              │
│                                                              │
│   System is often down, but always correct when up           │
│   Example: Batch job runs correctly, but fails to start      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│              High Availability, High Reliability             │
│                                                              │
│   System is always up AND always correct - THE GOAL          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Measuring Reliability

### Mean Time Between Failures (MTBF)

```
                Total Operating Time
MTBF = ─────────────────────────────────
            Number of Failures
```

**Example**: System runs for 1000 hours with 4 failures
```
MTBF = 1000 / 4 = 250 hours
```

### Mean Time To Failure (MTTF)

Used for non-repairable systems:
```
                Total Operating Time
MTTF = ─────────────────────────────────
            Number of Failures
```

### Failure Rate

```
                1
Failure Rate = ────
               MTBF
```

### Error Rate

```
             Failed Requests
Error Rate = ────────────────
             Total Requests
```

---

## 🔧 Sources of Unreliability

### 1. Hardware Failures

```
Component       Typical MTTF
─────────────────────────────
Hard Drive      ~1 million hours
SSD             ~2 million hours
Server          ~10-50 years
Network Switch  ~5-10 years

At scale, failures are constant:
- 1000 servers × 5 year MTTF = ~200 failures/year
- That's one failure every 1-2 days!
```

### 2. Software Bugs

```
Types:
├── Logic errors (wrong calculation)
├── Edge cases (unhandled input)
├── Memory leaks (gradual degradation)
├── Race conditions (timing-dependent)
├── Resource exhaustion (disk, memory)
└── Dependency failures (external services)
```

### 3. Human Errors

```
Leading cause of outages!

Common mistakes:
├── Configuration errors
├── Wrong deployment
├── Accidental deletion
├── Incorrect commands
└── Misunderstanding requirements

Prevention:
├── Code review
├── Testing
├── Automation
├── Guardrails
└── Rollback capability
```

---

## 🛠️ Building Reliable Systems

### 1. Fault Tolerance

Make the system work despite component failures:

```python
# Retry with exponential backoff
def reliable_call(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except TransientError:
            wait = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait)
    raise MaxRetriesExceeded()
```

### 2. Data Integrity

Ensure data is never corrupted or lost:

```python
# Use transactions for consistency
def transfer_money(from_acc, to_acc, amount):
    with database.transaction():
        if get_balance(from_acc) < amount:
            raise InsufficientFunds()
        
        debit(from_acc, amount)
        credit(to_acc, amount)
        # Either both succeed or neither
```

### 3. Idempotency

Same operation, same result, no matter how many times:

```python
# Idempotent payment processing
def process_payment(payment_id, amount):
    # Check if already processed
    existing = db.get_payment(payment_id)
    if existing:
        return existing.result
    
    # Process and store result
    result = payment_gateway.charge(amount)
    db.save_payment(payment_id, result)
    return result
```

### 4. Validation

Catch errors early:

```python
def create_user(email, age, name):
    # Input validation
    if not is_valid_email(email):
        raise ValidationError("Invalid email")
    if age < 0 or age > 150:
        raise ValidationError("Invalid age")
    if len(name) < 1:
        raise ValidationError("Name required")
    
    # Only proceed if valid
    return db.create_user(email=email, age=age, name=name)
```

---

## 📈 Reliability Patterns

### 1. Checksums and Verification

```python
# Detect data corruption
def store_data(data):
    checksum = calculate_checksum(data)
    storage.save(data, checksum)

def retrieve_data(key):
    data, stored_checksum = storage.get(key)
    if calculate_checksum(data) != stored_checksum:
        raise DataCorrupted()
    return data
```

### 2. Write-Ahead Logging (WAL)

```python
# Ensure durability
def write(key, value):
    # 1. Log the operation first
    wal.append({"op": "write", "key": key, "value": value})
    wal.sync()  # Force to disk
    
    # 2. Then apply the change
    memory[key] = value
    
    return "OK"

def recover():
    # Replay log to recover state
    for entry in wal.read():
        apply(entry)
```

### 3. Replication

```
Write → Primary
          │
    ┌─────┴─────┐
    ▼           ▼
 Replica 1   Replica 2

Synchronous: Wait for replicas (more reliable)
Asynchronous: Don't wait (faster but riskier)
```

### 4. Testing for Reliability

```
Testing Pyramid for Reliability:

        ╱╲
       ╱  ╲   Chaos Engineering
      ╱    ╲  (Production failures)
     ╱──────╲
    ╱        ╲  Integration Tests
   ╱          ╲ (Component interaction)
  ╱────────────╲
 ╱              ╲  Unit Tests
╱                ╲ (Individual functions)
──────────────────
```

---

## 🔄 Reliability Trade-offs

### Reliability vs Latency

```
More checks = More reliable = Slower

Example: Synchronous replication
┌─────────────────────────────────────────────┐
│ Write → Primary → Wait for Replica → ACK    │
│                                             │
│ More reliable (data on 2 nodes)             │
│ Higher latency (extra network round trip)   │
└─────────────────────────────────────────────┘
```

### Reliability vs Throughput

```
Verification takes resources

Example: Encryption + Checksums
┌─────────────────────────────────────────────┐
│ Encrypt → Calculate Checksum → Store        │
│                                             │
│ CPU time for encryption                     │
│ Storage space for checksums                 │
│ Lower throughput                            │
└─────────────────────────────────────────────┘
```

### Reliability vs Cost

```
Redundancy costs money

Example: 3x replication
┌─────────────────────────────────────────────┐
│ Store 1TB of data                           │
│                                             │
│ Without replication: 1TB storage cost       │
│ With 3x replication: 3TB storage cost       │
│                                             │
│ More reliable, 3x the storage bill          │
└─────────────────────────────────────────────┘
```

---

## 🚨 Common Reliability Issues

### 1. Data Loss

```
Causes:
├── Disk failure without backup
├── Accidental deletion
├── Software bug corrupting data
└── Ransomware

Prevention:
├── Multiple replicas
├── Regular backups
├── Point-in-time recovery
├── Soft deletes (mark as deleted)
└── Access controls
```

### 2. Silent Failures

```
Danger: System appears to work but produces wrong results

Example: 
- Calculation overflow (wrong total)
- Dropped events (missing data)
- Stale cache (outdated info)

Detection:
├── Assertions in code
├── Data quality monitoring
├── Reconciliation jobs
└── Anomaly detection
```

### 3. Partial Failures

```
Danger: Some operations succeed, others fail

Example: Multi-step process
1. Debit account A ✓
2. Credit account B ✗ (failure!)

Money disappeared!

Prevention:
├── Transactions (all or nothing)
├── Sagas (compensating actions)
├── Idempotent retries
└── Eventual consistency with reconciliation
```

---

## 📊 Reliability in Different Domains

| Domain | Reliability Need | Approach |
|--------|-----------------|----------|
| **Banking** | Data must never be lost | Synchronous replication, transactions |
| **Healthcare** | Incorrect data is dangerous | Validation, audit logs |
| **E-commerce** | Orders must not be lost | Durable queues, retries |
| **Social Media** | Occasional issues OK | Eventual consistency, best effort |
| **Aviation** | Lives at stake | Redundant systems, formal verification |

---

## 💡 Interview Tips

### When Discussing Reliability

1. **Identify failure modes**
   - What can go wrong?
   - What's the impact?

2. **Explain prevention strategies**
   - Validation
   - Transactions
   - Idempotency

3. **Discuss detection mechanisms**
   - Monitoring
   - Alerts
   - Data quality checks

4. **Describe recovery procedures**
   - Backups
   - Rollback
   - Disaster recovery

---

## ✅ Key Takeaways

1. **Reliability ≠ Availability** - System can be up but wrong
2. **Hardware fails constantly at scale** - Plan for it
3. **Human error is the top cause** - Automate and add guardrails
4. **Use transactions** - For operations that must be atomic
5. **Make operations idempotent** - Safe to retry
6. **Test failure scenarios** - Don't wait for production to find bugs
7. **Monitor data quality** - Detect silent failures
