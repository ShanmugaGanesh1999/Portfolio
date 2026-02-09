# Binary Search

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 704 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find target in sorted array; return index or -1 if not found.

### Constraints & Clarifying Questions
1. **Array sorted?** Yes, ascending order.
2. **Duplicates?** No, all unique.
3. **Element not found?** Return -1.
4. **Empty array?** Return -1.
5. **Expected complexity?** O(log N).

### Edge Cases
1. **Single element:** `nums = [5], target = 5` → 0
2. **Not found:** `nums = [1,2,3], target = 4` → -1
3. **First/last element:** Target at boundaries.

---

## Phase 2: High-Level Approach

### Approach: Classic Binary Search
Compare target with middle element; eliminate half of search space each iteration.

**Core Insight:** Sorted property allows eliminating half the elements per comparison.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], target: int) -> int:
    """
    Binary search for target in sorted array.
    
    Args:
        nums: Sorted array
        target: Value to find
    
    Returns:
        Index of target or -1 if not found
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:  # O(log N)
        mid = left + (right - left) // 2  # Avoid overflow
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # Target in right half
        else:
            right = mid - 1  # Target in left half
    
    return -1


def solve_recursive(nums: list[int], target: int) -> int:
    """
    Recursive version.
    """
    def binary_search(left: int, right: int) -> int:
        if left > right:
            return -1
        
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            return binary_search(mid + 1, right)
        else:
            return binary_search(left, mid - 1)
    
    return binary_search(0, len(nums) - 1)
```

---

## Phase 4: Dry Run

**Input:** `nums = [-1, 0, 3, 5, 9, 12], target = 9`

| Iteration | left | right | mid | nums[mid] | Action |
|-----------|------|-------|-----|-----------|--------|
| 1 | 0 | 5 | 2 | 3 | 3 < 9, left = 3 |
| 2 | 3 | 5 | 4 | 9 | 9 = 9, return 4 |

**Result:** `4`

**Input:** `nums = [-1, 0, 3, 5, 9, 12], target = 2`

| Iteration | left | right | mid | nums[mid] | Action |
|-----------|------|-------|-----|-----------|--------|
| 1 | 0 | 5 | 2 | 3 | 3 > 2, right = 1 |
| 2 | 0 | 1 | 0 | -1 | -1 < 2, left = 1 |
| 3 | 1 | 1 | 1 | 0 | 0 < 2, left = 2 |
| 4 | 2 | 1 | - | - | left > right, return -1 |

**Result:** `-1`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Search space halves each iteration: log₂(N) iterations.

### Space Complexity: O(1)
- Iterative: Constant space.
- Recursive: O(log N) stack space.

---

## Phase 6: Follow-Up Questions

1. **"What if array has duplicates and we need first occurrence?"**
   → Continue searching left even when found: `right = mid - 1` when equal.

2. **"Why `mid = left + (right - left) // 2` instead of `(left + right) // 2`?"**
   → Prevents integer overflow when left + right exceeds max int.

3. **"What about searching in rotated sorted array?"**
   → Determine which half is sorted; binary search on appropriate half.
