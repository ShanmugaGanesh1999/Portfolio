# Single Element in Sorted Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 540 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find single non-duplicate element in sorted array where every other element appears exactly twice.

### Constraints & Clarifying Questions
1. **Array sorted?** Yes.
2. **Exactly one single element?** Yes.
3. **Other elements appear twice?** Yes, consecutively.
4. **Expected time?** O(log N).
5. **Array length?** Always odd.

### Edge Cases
1. **Single element:** `[1]` → 1
2. **Single at start:** `[1, 2, 2]` → 1
3. **Single at end:** `[1, 1, 2]` → 2

---

## Phase 2: High-Level Approach

### Approach: Binary Search on Pairs
Before single element, pairs start at even indices. After, pairs start at odd indices.

**Core Insight:** Check if mid is part of a correctly positioned pair to determine which half contains the single element.

---

## Phase 3: Python Code

```python
def solve(nums: list[int]) -> int:
    """
    Find single non-duplicate element in sorted array.
    
    Args:
        nums: Sorted array with one single element
    
    Returns:
        The single element
    """
    left, right = 0, len(nums) - 1
    
    while left < right:  # O(log N)
        mid = left + (right - left) // 2
        
        # Ensure mid is even (start of a pair)
        if mid % 2 == 1:
            mid -= 1
        
        # Check if pair is intact
        if nums[mid] == nums[mid + 1]:
            # Pair intact, single is on right
            left = mid + 2
        else:
            # Pair broken, single is on left (or at mid)
            right = mid
    
    return nums[left]


def solve_alternative(nums: list[int]) -> int:
    """
    Alternative using XOR pattern analysis.
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        # XOR with 1: if mid is even → mid+1, if odd → mid-1
        # This gives us the expected pair partner index
        if nums[mid] == nums[mid ^ 1]:
            # Pair intact, single is after
            left = mid + 1
        else:
            # Pair broken, single is at or before mid
            right = mid
    
    return nums[left]
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 1, 2, 3, 3, 4, 4, 8, 8]`

| left | right | mid | adjusted mid | nums[mid] == nums[mid+1]? | Action |
|------|-------|-----|--------------|---------------------------|--------|
| 0 | 8 | 4 | 4 (even) | nums[4]=3, nums[5]=4, No | right = 4 |
| 0 | 4 | 2 | 2 (even) | nums[2]=2, nums[3]=3, No | right = 2 |
| 0 | 2 | 1 | 0 (adjust) | nums[0]=1, nums[1]=1, Yes | left = 2 |
| 2 | 2 | - | - | - | left = right, return nums[2] |

**Result:** `nums[2] = 2`

**Verification:**
- [1,1] pair at indices 0,1 ✓
- [2] single at index 2 ✓
- [3,3] pair at indices 3,4 ✓
- [4,4] pair at indices 5,6 ✓
- [8,8] pair at indices 7,8 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Binary search halves search space each iteration.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What if array isn't sorted?"**
   → XOR all elements: a ⊕ a = 0, so result is the single element. O(N).

2. **"What if two elements are single?"**
   → XOR gives their XOR; need additional technique to separate them.

3. **"Can we solve without the sorted property?"**
   → Yes, XOR approach works for unsorted too.
