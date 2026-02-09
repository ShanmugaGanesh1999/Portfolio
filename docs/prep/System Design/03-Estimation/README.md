# Back-of-the-Envelope Estimation

> Quickly estimating system resources and capacity

---

## 📚 Topics Covered

| # | Topic | Description |
|---|-------|-------------|
| 1 | [Numbers to Know](./01-numbers-to-know.md) | Essential numbers for estimation |
| 2 | [Resource Estimation Examples](./02-resource-estimation-examples.md) | Practical estimation examples |
| 3 | [Interview-Ready Examples](./03-interview-examples.md) | Full 45-min interview format examples |

---

## 🎯 Why Estimation Matters

In System Design interviews, you need to:
- Justify your design decisions with numbers
- Identify potential bottlenecks
- Size infrastructure appropriately
- Show you can think at scale

---

## 📊 Quick Reference

### Traffic Conversion

| Daily | Per Second |
|-------|------------|
| 1 Million | ~12 RPS |
| 10 Million | ~120 RPS |
| 100 Million | ~1,200 RPS |
| 1 Billion | ~12,000 RPS |

**Formula**: Daily requests ÷ 86,400 seconds

### Storage Units

| Unit | Size |
|------|------|
| 1 KB | 1,000 bytes |
| 1 MB | 1,000 KB = 10⁶ bytes |
| 1 GB | 1,000 MB = 10⁹ bytes |
| 1 TB | 1,000 GB = 10¹² bytes |
| 1 PB | 1,000 TB = 10¹⁵ bytes |

### Time Units

| Period | Seconds |
|--------|---------|
| 1 minute | 60 |
| 1 hour | 3,600 |
| 1 day | 86,400 |
| 1 month | ~2.5 million |
| 1 year | ~31.5 million |

---

## 🔢 The Estimation Framework

```
1. Clarify requirements
   └─► How many users? How much data?

2. Make assumptions
   └─► State them clearly

3. Calculate step by step
   └─► Show your work

4. Round appropriately
   └─► Estimates, not exact numbers

5. Sanity check
   └─► Does the result make sense?
```

---

## ⏱️ Estimated Study Time

- Numbers to Know: 30 minutes
- Resource Estimation Examples: 1 hour

**Total: ~1.5 hours**
