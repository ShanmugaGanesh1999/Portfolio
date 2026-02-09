# Find Peak Element

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 162 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find any peak element (strictly greater than neighbors). Array boundaries are -∞.

### Constraints & Clarifying Questions
1. **Multiple peaks?** Return any one.
2. **No equal adjacent?** Yes, nums[i] ≠ nums[i+1].
3. **Boundaries?** nums[-1] = nums[n] = -∞.
4. **Expected time?** O(log N).
5. **Single element?** It's a peak.

### Edge Cases
1. **Single element:** `[5]` → 0
2. **Two elements:** `[1, 2]` → 1
3. **Strictly increasing:** Last element is peak.

---

## Phase 2: High-Level Approach

### Approach: Binary Search
Move toward higher neighbor; guaranteed to find peak.

**Core Insight:** If nums[mid] < nums[mid+1], peak exists on right (or mid+1 itself). Boundary is -∞, so we'll find one.

---

## Phase 3: Python Code

```python
def solve(nums: list[int]) -> int:
    """
    Find any peak element index.
    
    Args:
        nums: Array where adjacent elements are never equal
    
    Returns:
        Index of a peak element
    """
    left, right = 0, len(nums) - 1
    
    while left < right:  # O(log N)
        mid = left + (right - left) // 2
        
        if nums[mid] < nums[mid + 1]:
            # Peak is on right side
            left = mid + 1
        else:
            # Peak is on left side or at mid
            right = mid
    
    return left


def solve_with_neighbors(nums: list[int]) -> int:
    """
    Alternative checking both neighbors explicitly.
    """
    n = len(nums)
    
    if n == 1:
        return 0
    if nums[0] > nums[1]:
        return 0
    if nums[n-1] > nums[n-2]:
        return n - 1
    
    left, right = 1, n - 2
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] > nums[mid-1] and nums[mid] > nums[mid+1]:
            return mid  # Found peak
        elif nums[mid] < nums[mid+1]:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Should never reach for valid input
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 2, 3, 1]`

| left | right | mid | nums[mid] | nums[mid+1] | Action |
|------|-------|-----|-----------|-------------|--------|
| 0 | 3 | 1 | 2 | 3 | 2 < 3, left = 2 |
| 2 | 3 | 2 | 3 | 1 | 3 > 1, right = 2 |
| 2 | 2 | - | - | - | left = right, return 2 |

**Result:** `2` (nums[2] = 3 is peak)

**Input:** `nums = [1, 2, 1, 3, 5, 6, 4]`

| left | right | mid | nums[mid] | nums[mid+1] | Action |
|------|-------|-----|-----------|-------------|--------|
| 0 | 6 | 3 | 3 | 5 | 3 < 5, left = 4 |
| 4 | 6 | 5 | 6 | 4 | 6 > 4, right = 5 |
| 4 | 5 | 4 | 5 | 6 | 5 < 6, left = 5 |
| 5 | 5 | - | - | - | left = right, return 5 |

**Result:** `5` (nums[5] = 6 is peak)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Binary search halves search space each iteration.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"Why is there always a peak?"**
   → Boundaries are -∞; array must go up then down somewhere (or monotonic to boundary).

2. **"Find all peaks?"**
   → Must check each element: O(N).

3. **"What if adjacent elements can be equal?"**
   → Can't use binary search; need O(N) scan.
