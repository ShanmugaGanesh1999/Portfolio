# 📅 Week 7: Binary Search Patterns

## 🎯 Overview

Binary Search is one of the most fundamental algorithms with many variations. This week covers all patterns needed for FAANG interviews.

---

## 📚 Topics Covered

### 1. Classic Binary Search
- Standard binary search
- Search insert position
- Finding first/last occurrence

### 2. Binary Search Variations
- Search in rotated sorted array
- Find minimum in rotated array
- Peak element
- Search in 2D matrix

### 3. Binary Search on Answer Space
- Koko eating bananas
- Capacity to ship packages
- Split array largest sum

---

## 📁 Folder Structure

```
Week-07-Binary-Search/
├── README.md
└── 01-Pattern-Intuition/
    └── binary_search_explained.md
```

> 📝 **Note:** Practice problems for Binary Search can be found in the main [Problems/05-Binary-Search/](../Problems/05-Binary-Search/) folder.

---

## 🎯 Learning Goals

By the end of this week, you should be able to:

1. ✅ Implement binary search without bugs
2. ✅ Identify when to use `left < right` vs `left <= right`
3. ✅ Handle edge cases with rotated arrays
4. ✅ Apply binary search on answer space
5. ✅ Recognize hidden binary search problems

---

## 📊 Key Patterns

### Pattern 1: Standard Binary Search
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

### Pattern 2: Lower Bound (First Occurrence)
```python
def lower_bound(arr, target):
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

### Pattern 3: Upper Bound (Last Occurrence)
```python
def upper_bound(arr, target):
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return left - 1  # or left for "first greater"
```

---

## 🔥 FAANG Interview Questions

| Problem | Difficulty | Company | Pattern |
|---------|------------|---------|---------|
| Binary Search | Easy | All | Classic |
| Search Insert Position | Easy | Google, Amazon | Lower Bound |
| Search in Rotated Array | Medium | Meta, Google | Modified |
| Find Min in Rotated Array | Medium | Amazon, Apple | Modified |
| Find Peak Element | Medium | Meta, Google | Binary Answer |
| Search 2D Matrix | Medium | Amazon, Microsoft | 2D Binary |
| Koko Eating Bananas | Medium | Google | Answer Space |
| Split Array Largest Sum | Hard | Google | Answer Space |

---

## ⏰ Time Commitment

- **Pattern Study**: 2-3 hours
- **Problem Solving**: 4-5 hours
- **Review & Practice**: 2-3 hours
- **Total**: ~10 hours

---

## ✅ Progress Tracker

- [ ] Understand classic binary search
- [ ] Learn lower bound vs upper bound
- [ ] Practice rotated array problems
- [ ] Master binary search on answer space
- [ ] Complete 10+ problems

---

## ➡️ Next Week
[Week 8: Sorting & Intervals](../Week-08-Sorting-Intervals/)
