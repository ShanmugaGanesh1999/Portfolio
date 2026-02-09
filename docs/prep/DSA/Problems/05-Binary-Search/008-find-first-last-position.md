# Find First and Last Position of Element

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 34 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find starting and ending position of target in sorted array.

### Constraints & Clarifying Questions
1. **Duplicates?** Yes, find range of duplicates.
2. **Not found?** Return [-1, -1].
3. **Expected time?** O(log N).
4. **Array sorted?** Yes, ascending.
5. **Empty array?** Return [-1, -1].

### Edge Cases
1. **Single occurrence:** `[1,2,3], target=2` → [1, 1]
2. **All same:** `[2,2,2], target=2` → [0, 2]
3. **Not found:** `[1,3,5], target=2` → [-1, -1]

---

## Phase 2: High-Level Approach

### Approach: Two Binary Searches
Find leftmost occurrence, then find rightmost occurrence.

**Core Insight:** Modify standard binary search to continue after finding target.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], target: int) -> list[int]:
    """
    Find first and last position of target in sorted array.
    
    Args:
        nums: Sorted array
        target: Value to find
    
    Returns:
        [first_index, last_index] or [-1, -1] if not found
    """
    def find_left(nums: list[int], target: int) -> int:
        """Find leftmost occurrence of target."""
        left, right = 0, len(nums) - 1
        result = -1
        
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                result = mid
                right = mid - 1  # Continue searching left
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result
    
    def find_right(nums: list[int], target: int) -> int:
        """Find rightmost occurrence of target."""
        left, right = 0, len(nums) - 1
        result = -1
        
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                result = mid
                left = mid + 1  # Continue searching right
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result
    
    left_idx = find_left(nums, target)  # O(log N)
    
    if left_idx == -1:
        return [-1, -1]
    
    right_idx = find_right(nums, target)  # O(log N)
    
    return [left_idx, right_idx]


def solve_bisect(nums: list[int], target: int) -> list[int]:
    """
    Using Python's bisect module.
    """
    import bisect
    
    left = bisect.bisect_left(nums, target)
    
    # Check if target exists
    if left >= len(nums) or nums[left] != target:
        return [-1, -1]
    
    right = bisect.bisect_right(nums, target) - 1
    
    return [left, right]
```

---

## Phase 4: Dry Run

**Input:** `nums = [5, 7, 7, 8, 8, 10], target = 8`

**find_left(8):**

| left | right | mid | nums[mid] | Action |
|------|-------|-----|-----------|--------|
| 0 | 5 | 2 | 7 | 7 < 8, left = 3 |
| 3 | 5 | 4 | 8 | Found! result=4, right=3 |
| 3 | 3 | 3 | 8 | Found! result=3, right=2 |
| 3 | 2 | - | - | left > right, return 3 |

**find_right(8):**

| left | right | mid | nums[mid] | Action |
|------|-------|-----|-----------|--------|
| 0 | 5 | 2 | 7 | 7 < 8, left = 3 |
| 3 | 5 | 4 | 8 | Found! result=4, left=5 |
| 5 | 5 | 5 | 10 | 10 > 8, right=4 |
| 5 | 4 | - | - | left > right, return 4 |

**Result:** `[3, 4]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Two binary searches, each O(log N).

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"How to count occurrences?"**
   → Count = right_idx - left_idx + 1 (if found).

2. **"What if we need all indices?"**
   → Find range, return list(range(left_idx, right_idx + 1)).

3. **"Single binary search approach?"**
   → Find left boundary first; if found, find right boundary starting from left_idx.
