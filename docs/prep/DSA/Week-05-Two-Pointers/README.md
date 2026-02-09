# 📅 Week 5: Two Pointers Pattern

## 🎯 Week Overview

The **Two Pointers** pattern is one of the most versatile and frequently asked patterns in FAANG interviews. It involves using two pointers to traverse data structures, often reducing O(n²) solutions to O(n).

---

## 📚 Daily Schedule

| Day | Topic | Problems |
|-----|-------|----------|
| **Day 1** | Pattern Introduction & Intuition | 3 Easy |
| **Day 2** | Opposite Direction Pointers | 4 Medium |
| **Day 3** | Same Direction Pointers | 4 Medium |
| **Day 4** | Three Pointers (3Sum variant) | 3 Medium |
| **Day 5** | Two Pointers on Linked Lists | 4 Medium |
| **Day 6** | Review & Hard Problems | 4 Hard |

---

## 📁 Contents

```
Week-05-Two-Pointers/
├── README.md
└── 01-Pattern-Intuition/
    └── two_pointers_explained.md
```

> 📝 **Note:** Practice problems for Two Pointers can be found in the main [Problems/02-Two-Pointers/](../Problems/02-Two-Pointers/) folder.

---

## 🎯 Learning Objectives

By the end of this week, you should be able to:

- [ ] Recognize when to use two pointers
- [ ] Apply opposite direction pattern
- [ ] Apply same direction pattern
- [ ] Solve 3Sum and its variants
- [ ] Use two pointers on linked lists

---

## 📖 Pattern Variations

### 1. Opposite Direction (Converging)
Start from both ends, move toward center.
```
[1, 2, 3, 4, 5]
 ↑           ↑
 L           R
```
**Use for:** Palindrome, two sum (sorted), container with most water

### 2. Same Direction (Fast-Slow)
Both start from beginning, move at different speeds.
```
[1, 2, 2, 3, 3, 4]
 ↑  ↑
 S  F
```
**Use for:** Remove duplicates, cycle detection, find middle

### 3. Sliding Window (Two Pointers)
Expand/shrink window based on condition.
```
[a, b, c, d, e, f]
    ↑     ↑
    L     R
```
**Use for:** Substring problems, subarray sum

---

## ✅ Week 5 Checklist

- [ ] Master pattern intuition
- [ ] Solve 18+ two pointer problems
- [ ] Complete all FAANG frequent problems

---

**Previous:** [Week 4: Linked Lists](../Week-04-Linked-Lists/README.md)  
**Next:** [Week 6: Sliding Window](../Week-06-Sliding-Window/README.md)
