# Search in Rotated Sorted Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 33 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Search for target in rotated sorted array; return index or -1.

### Constraints & Clarifying Questions
1. **Duplicates?** No, all unique.
2. **Target not found?** Return -1.
3. **Expected time?** O(log N).
4. **Array rotated?** Yes, by some pivot.
5. **Empty array?** Return -1.

### Edge Cases
1. **Not rotated:** Normal binary search works.
2. **Single element:** Check if equals target.
3. **Target at rotation point:** Should still find it.

---

## Phase 2: High-Level Approach

### Approach: Modified Binary Search
At each step, one half is sorted. Determine which half and whether target is in sorted half.

**Core Insight:** One of two halves is always sorted; check if target is in sorted half.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], target: int) -> int:
    """
    Search target in rotated sorted array.
    
    Args:
        nums: Rotated sorted array with unique elements
        target: Value to find
    
    Returns:
        Index of target or -1
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:  # O(log N)
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Determine which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target in left half
            else:
                left = mid + 1   # Target in right half
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target in right half
            else:
                right = mid - 1  # Target in left half
    
    return -1


def solve_find_pivot_first(nums: list[int], target: int) -> int:
    """
    Alternative: Find minimum first, then binary search.
    """
    n = len(nums)
    
    # Find minimum (pivot point)
    left, right = 0, n - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    pivot = left
    
    # Binary search with rotation offset
    left, right = 0, n - 1
    while left <= right:
        mid = (left + right) // 2
        real_mid = (mid + pivot) % n
        
        if nums[real_mid] == target:
            return real_mid
        elif nums[real_mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

---

## Phase 4: Dry Run

**Input:** `nums = [4, 5, 6, 7, 0, 1, 2], target = 0`

| left | right | mid | nums[mid] | Sorted half | Target range | Action |
|------|-------|-----|-----------|-------------|--------------|--------|
| 0 | 6 | 3 | 7 | Left [4,5,6,7] | 0 not in [4,7) | left = 4 |
| 4 | 6 | 5 | 1 | Right [0,1,2] | 0 in (1,2]? No | right = 4 |
| 4 | 4 | 4 | 0 | - | Found! | return 4 |

**Result:** `4`

**Input:** `nums = [4, 5, 6, 7, 0, 1, 2], target = 3`

| left | right | mid | nums[mid] | Sorted half | Action |
|------|-------|-----|-----------|-------------|--------|
| 0 | 6 | 3 | 7 | Left | 3 not in [4,7), left = 4 |
| 4 | 6 | 5 | 1 | Right [0,1,2] | 3 not in (1,2], right = 4 |
| 4 | 4 | 4 | 0 | - | 0 ≠ 3, left = 5 |
| 5 | 4 | - | - | - | left > right, not found |

**Result:** `-1`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Binary search halves search space each iteration.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What if array has duplicates?"**
   → Can't always determine sorted half; worst case O(N). Handle nums[left] == nums[mid] == nums[right].

2. **"How to find all occurrences of target?"**
   → Find one, then linear search both directions; or find leftmost and rightmost.

3. **"What if rotated multiple times?"**
   → Rotation n times = original; algorithm still works.
