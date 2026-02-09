# Non-Functional Requirements

> Essential quality attributes for System Design

---

## 📚 Topics Covered

| # | Topic | Description |
|---|-------|-------------|
| 1 | [Availability](./01-availability.md) | System uptime and accessibility |
| 2 | [Reliability](./02-reliability.md) | Correct operation over time |
| 3 | [Scalability](./03-scalability.md) | Handling growth in load |
| 4 | [Maintainability](./04-maintainability.md) | Ease of modification and operation |
| 5 | [Fault Tolerance](./05-fault-tolerance.md) | Resilience to failures |

---

## 🎯 What are Non-Functional Requirements?

**Functional Requirements**: WHAT the system should do
- Users can post tweets
- Users can follow other users
- Users can see a timeline

**Non-Functional Requirements**: HOW the system should behave
- 99.9% availability
- < 200ms response time
- Support 100M daily active users
- Recover from failures within 1 minute

---

## 🔑 Key Non-Functional Requirements

```
┌─────────────────────────────────────────────────────────────┐
│                    System Quality                            │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│   │ Availability│  │ Reliability │  │ Scalability │         │
│   │   (Uptime)  │  │(Correctness)│  │  (Growth)   │         │
│   └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│   │Maintainab.  │  │Fault Toler. │  │ Performance │         │
│   │(Operability)│  │(Resilience) │  │  (Speed)    │         │
│   └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Quick Comparison

| Requirement | Question | Metric |
|-------------|----------|--------|
| **Availability** | Is the system accessible? | Uptime % (99.9%) |
| **Reliability** | Does it work correctly? | MTBF, error rate |
| **Scalability** | Can it handle more load? | RPS, users |
| **Maintainability** | Is it easy to change? | MTTR, deploy frequency |
| **Fault Tolerance** | Does it survive failures? | Recovery time |

---

## 💡 In System Design Interviews

### Always Clarify NFRs

**Ask these questions**:
1. How many users? (DAU, MAU)
2. What's the expected traffic? (RPS)
3. What's acceptable latency? (P50, P99)
4. What's the availability target? (99.9%?)
5. What's the data volume? (storage)
6. What's the read:write ratio?

### Common Targets

| System Type | Availability | Latency (P99) |
|-------------|--------------|---------------|
| Payment systems | 99.99% | < 500ms |
| Social media | 99.9% | < 200ms |
| Analytics | 99% | < 2s |
| Batch jobs | 95% | Hours |

---

## ⏱️ Estimated Study Time

- Availability: 45 minutes
- Reliability: 45 minutes
- Scalability: 1 hour
- Maintainability: 30 minutes
- Fault Tolerance: 1 hour

**Total: ~4 hours**
