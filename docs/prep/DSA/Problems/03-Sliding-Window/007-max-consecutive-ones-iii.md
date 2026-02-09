# Max Consecutive Ones III

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1004 | Sliding Window |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find longest contiguous subarray of 1s after flipping at most k 0s to 1s.

### Constraints & Clarifying Questions
1. **Array contains only 0s and 1s?** Yes.
2. **Must we flip exactly k zeros?** No, at most k.
3. **Can k be 0?** Yes, find longest consecutive 1s.
4. **Can k exceed number of 0s?** Yes, return array length.
5. **Empty array?** Return 0.

### Edge Cases
1. **All 1s:** `nums = [1,1,1], k = 2` → 3
2. **All 0s:** `nums = [0,0,0], k = 2` → 2
3. **k = 0:** Find max consecutive 1s without flipping.

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Windows)
For each starting point, count how many 0s flipped.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Sliding Window)
Maintain window with at most k zeros; shrink when exceeding k zeros.

**Core Insight:** Window is valid if it contains ≤ k zeros. Expand right, shrink left when zeros exceed k.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], k: int) -> int:
    """
    Find longest subarray of 1s after flipping at most k zeros.
    
    Args:
        nums: Binary array
        k: Maximum zeros we can flip
    
    Returns:
        Length of longest subarray with all 1s achievable
    """
    left = 0
    zeros = 0  # Count of zeros in current window
    max_length = 0
    
    for right in range(len(nums)):  # O(N)
        if nums[right] == 0:
            zeros += 1
        
        # Shrink window while too many zeros
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length


def solve_no_shrink(nums: list[int], k: int) -> int:
    """
    Optimized: Don't shrink window, just slide it.
    Window size never decreases (we want maximum).
    """
    left = 0
    zeros = 0
    
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        
        if zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
    
    return len(nums) - left
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 1, 0, 0, 1, 1, 1, 0, 1, 1], k = 2`

| right | nums[right] | zeros | left | Window | Length |
|-------|-------------|-------|------|--------|--------|
| 0 | 1 | 0 | 0 | [1] | 1 |
| 1 | 1 | 0 | 0 | [1,1] | 2 |
| 2 | 0 | 1 | 0 | [1,1,0] | 3 |
| 3 | 0 | 2 | 0 | [1,1,0,0] | 4 |
| 4 | 1 | 2 | 0 | [1,1,0,0,1] | 5 |
| 5 | 1 | 2 | 0 | [1,1,0,0,1,1] | 6 |
| 6 | 1 | 2 | 0 | [1,1,0,0,1,1,1] | 7 |
| 7 | 0 | 3→2 | 3 | [0,1,1,1,0] | 5 |
| 8 | 1 | 2 | 3 | [0,1,1,1,0,1] | 6 |
| 9 | 1 | 2 | 3 | [0,1,1,1,0,1,1] | 7 |

**Result:** `7` (flip zeros at indices 3 and 7)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Single pass; each element visited at most twice.

### Space Complexity: O(1)
- Only tracking zeros count and pointers.

---

## Phase 6: Follow-Up Questions

1. **"What if we have values 0, 1, 2 and can flip at most k non-ones?"**
   → Count non-one elements in window instead of just zeros.

2. **"What if we need the starting index?"**
   → Track `best_left` when updating max_length.

3. **"What if data is streaming?"**
   → Same sliding window works; maintain window state.
