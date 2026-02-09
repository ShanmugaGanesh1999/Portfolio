# 📅 Week 8: Sorting Algorithms & Interval Patterns

## 🎯 Overview

This week covers sorting algorithms (must-know for interviews) and interval-based problems which are very common in FAANG interviews.

---

## 📚 Topics Covered

### 1. Sorting Algorithms
- Quick Sort (in-place, divide & conquer)
- Merge Sort (stable, divide & conquer)
- Heap Sort (in-place, selection-based)
- Counting Sort & Radix Sort (non-comparison)

### 2. Interval Patterns
- Merge Intervals
- Insert Interval
- Non-overlapping Intervals
- Meeting Rooms I & II

---

## 📁 Folder Structure

```
Week-08-Sorting-Intervals/
├── README.md
├── 01-Sorting-Algorithms/
│   └── sorting_explained.md
└── 02-Interval-Patterns/
    └── intervals_explained.md
```

> 📝 **Note:** Practice problems for Intervals can be found in the main [Problems/16-Intervals/](../Problems/16-Intervals/) folder.

---

## 🎯 Learning Goals

By the end of this week, you should be able to:

1. ✅ Implement QuickSort and MergeSort from scratch
2. ✅ Understand time/space trade-offs between sorts
3. ✅ Merge overlapping intervals efficiently
4. ✅ Solve meeting room scheduling problems
5. ✅ Recognize interval patterns in disguise

---

## 📊 Sorting Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |

---

## 🔥 FAANG Interview Questions

| Problem | Difficulty | Company | Pattern |
|---------|------------|---------|---------|
| Sort Colors | Medium | All | Dutch National Flag |
| Merge Intervals | Medium | Meta, Google | Interval Merge |
| Insert Interval | Medium | Google, LinkedIn | Interval Insert |
| Non-overlapping Intervals | Medium | Amazon | Interval Greedy |
| Meeting Rooms II | Medium | Google, Meta | Interval Sweep Line |
| Minimum Platforms | Medium | Amazon | Interval Count |
| Task Scheduler | Medium | Meta | Greedy/Interval |

---

## ⏰ Time Commitment

- **Sorting Study**: 3-4 hours
- **Interval Patterns**: 3-4 hours
- **Problem Solving**: 4-5 hours
- **Total**: ~12 hours

---

## ✅ Progress Tracker

- [ ] Implement Quick Sort
- [ ] Implement Merge Sort
- [ ] Understand interval merging
- [ ] Learn sweep line technique
- [ ] Complete 8+ interval problems
