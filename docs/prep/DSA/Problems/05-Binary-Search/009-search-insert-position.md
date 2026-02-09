# Search Insert Position

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 35 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find index where target exists or would be inserted in sorted array.

### Constraints & Clarifying Questions
1. **Duplicates?** No, all unique.
2. **Target larger than all?** Insert at end.
3. **Target smaller than all?** Insert at index 0.
4. **Expected time?** O(log N).
5. **Empty array?** Return 0.

### Edge Cases
1. **Target exists:** Return its index.
2. **Insert at beginning:** `[2,3], target=1` → 0
3. **Insert at end:** `[1,2], target=3` → 2

---

## Phase 2: High-Level Approach

### Approach: Binary Search for Lower Bound
Find leftmost position where target could be inserted.

**Core Insight:** This is the same as finding the leftmost element ≥ target.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], target: int) -> int:
    """
    Find index to insert target maintaining sorted order.
    
    Args:
        nums: Sorted array
        target: Value to find or insert
    
    Returns:
        Index where target is or should be inserted
    """
    left, right = 0, len(nums)
    
    while left < right:  # O(log N)
        mid = left + (right - left) // 2
        
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left


def solve_standard(nums: list[int], target: int) -> int:
    """
    Standard binary search with explicit result tracking.
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return left  # Insertion point
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 3, 5, 6], target = 5`

| left | right | mid | nums[mid] | Action |
|------|-------|-----|-----------|--------|
| 0 | 4 | 2 | 5 | 5 >= 5, right = 2 |
| 0 | 2 | 1 | 3 | 3 < 5, left = 2 |
| 2 | 2 | - | - | left = right, return 2 |

**Result:** `2` (target found at index 2)

**Input:** `nums = [1, 3, 5, 6], target = 2`

| left | right | mid | nums[mid] | Action |
|------|-------|-----|-----------|--------|
| 0 | 4 | 2 | 5 | 5 >= 2, right = 2 |
| 0 | 2 | 1 | 3 | 3 >= 2, right = 1 |
| 0 | 1 | 0 | 1 | 1 < 2, left = 1 |
| 1 | 1 | - | - | left = right, return 1 |

**Result:** `1` (insert 2 at index 1)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Binary search halves search space each iteration.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What if array has duplicates?"**
   → This finds leftmost valid position; for rightmost, modify condition.

2. **"How is this related to bisect_left?"**
   → This is exactly bisect_left implementation.

3. **"What about inserting multiple elements?"**
   → Find each insert position; note positions shift after each insert.
