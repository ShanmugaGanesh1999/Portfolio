# Find Minimum in Rotated Sorted Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 153 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum element in rotated sorted array (rotated 1 to n times).

### Constraints & Clarifying Questions
1. **Duplicates?** No, all unique.
2. **What's rotation?** `[1,2,3,4,5]` rotated 2 → `[4,5,1,2,3]`.
3. **Not rotated?** Could be rotated n times (back to original).
4. **Expected time?** O(log N).
5. **Array length?** At least 1.

### Edge Cases
1. **Not rotated:** `[1,2,3]` → 1
2. **Single element:** `[5]` → 5
3. **Fully rotated:** `[2,1]` → 1

---

## Phase 2: High-Level Approach

### Approach: Binary Search
Compare mid with right to determine which half contains minimum.

**Core Insight:** Minimum is where rotation occurred. Compare mid with rightmost to determine which half is "broken".

---

## Phase 3: Python Code

```python
def solve(nums: list[int]) -> int:
    """
    Find minimum in rotated sorted array.
    
    Args:
        nums: Rotated sorted array with unique elements
    
    Returns:
        Minimum element
    """
    left, right = 0, len(nums) - 1
    
    while left < right:  # O(log N)
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in right half (rotation point is there)
            left = mid + 1
        else:
            # Minimum is in left half or at mid
            right = mid
    
    return nums[left]


def solve_with_check(nums: list[int]) -> int:
    """
    Version with early termination for sorted array.
    """
    left, right = 0, len(nums) - 1
    
    # If array is sorted (not rotated or rotated n times)
    if nums[left] <= nums[right]:
        return nums[left]
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return nums[left]
```

---

## Phase 4: Dry Run

**Input:** `nums = [3, 4, 5, 1, 2]`

| left | right | mid | nums[mid] | nums[right] | Action |
|------|-------|-----|-----------|-------------|--------|
| 0 | 4 | 2 | 5 | 2 | 5 > 2, left = 3 |
| 3 | 4 | 3 | 1 | 2 | 1 < 2, right = 3 |
| 3 | 3 | - | - | - | left = right, done |

**Result:** `nums[3] = 1`

**Input:** `nums = [4, 5, 6, 7, 0, 1, 2]`

| left | right | mid | nums[mid] | nums[right] | Action |
|------|-------|-----|-----------|-------------|--------|
| 0 | 6 | 3 | 7 | 2 | 7 > 2, left = 4 |
| 4 | 6 | 5 | 1 | 2 | 1 < 2, right = 5 |
| 4 | 5 | 4 | 0 | 1 | 0 < 1, right = 4 |
| 4 | 4 | - | - | - | left = right, done |

**Result:** `nums[4] = 0`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Binary search halves search space each iteration.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What if array has duplicates?"**
   → Can't always halve; worst case O(N). When nums[mid] == nums[right], do right -= 1.

2. **"How to find the rotation count?"**
   → Index of minimum is the rotation count.

3. **"How to search for a target in rotated array?"**
   → Find minimum first, then binary search appropriate half; or combined approach.
