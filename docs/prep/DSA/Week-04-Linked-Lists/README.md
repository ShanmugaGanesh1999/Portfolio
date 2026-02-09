# 📅 Week 4: Linked Lists

## 🎯 Week Overview

Linked Lists are fundamental data structures frequently asked in FAANG interviews. This week covers:
1. **Singly Linked List** - Basic linked list
2. **Doubly Linked List** - Navigation in both directions
3. **Circular Linked List** - Tail connects to head
4. **Fast & Slow Pointers** - Powerful pattern for LL problems

---

## 📚 Daily Schedule

| Day | Topic | Problems |
|-----|-------|----------|
| **Day 1** | Singly Linked List Implementation | 3 Easy |
| **Day 2** | Singly LL Problems | 4 Easy-Medium |
| **Day 3** | Doubly Linked List | 3 Medium |
| **Day 4** | Circular Linked List | 3 Medium |
| **Day 5** | Fast & Slow Pointer Pattern | 4 Medium |
| **Day 6** | Review & Mixed Practice | 5 Mixed |

---

## 📁 Contents

```
Week-04-Linked-Lists/
├── README.md
├── 01-Singly-Linked-List/
│   └── singly_linked_list.py
├── 02-Doubly-Linked-List/
│   └── doubly_linked_list.py
└── 03-Circular-Linked-List/
    └── circular_linked_list.py
```

> 📝 **Note:** Practice problems for Linked Lists can be found in the main [Problems/06-Linked-List/](../Problems/06-Linked-List/) folder. The Fast & Slow pointer pattern is covered in the [Two-Pointers](../Week-05-Two-Pointers/01-Pattern-Intuition/) section.

---

## 🎯 Learning Objectives

By the end of this week, you should be able to:

- [ ] Implement all three types of linked lists
- [ ] Master the fast & slow pointer pattern
- [ ] Reverse a linked list (iterative & recursive)
- [ ] Detect and find cycles
- [ ] Merge sorted linked lists

---

## 📖 Key Concepts

### Linked List vs Array

| Feature | Array | Linked List |
|---------|-------|-------------|
| Access | O(1) | O(n) |
| Insert at beginning | O(n) | O(1) |
| Insert at end | O(1)* | O(n) or O(1)** |
| Insert in middle | O(n) | O(1)*** |
| Memory | Contiguous | Non-contiguous |
| Extra space | None | Node pointers |

*Amortized for dynamic array  
**O(1) if we maintain tail pointer  
***O(1) if we have reference to previous node

### Fast & Slow Pointer Pattern

Used for:
- Detecting cycles
- Finding middle element
- Finding kth element from end
- Checking palindrome

---

## ✅ Week 4 Checklist

- [ ] Implement Singly Linked List
- [ ] Implement Doubly Linked List
- [ ] Implement Circular Linked List
- [ ] Master Fast & Slow pointer pattern
- [ ] Solve all 18 problems

---

**Previous:** [Week 3: Stacks & Queues](../Week-03-Stacks-Queues/README.md)  
**Next:** [Week 5: Two Pointers Pattern](../Week-05-Two-Pointers/README.md)
