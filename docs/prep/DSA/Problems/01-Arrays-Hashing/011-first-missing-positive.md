# First Missing Positive

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 41 | Cyclic Sort / Index as Hash |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the smallest positive integer that does not exist in the unsorted array.

### Constraints & Clarifying Questions
1. **What is the expected complexity?** O(N) time, O(1) space.
2. **Can array contain negatives and zeros?** Yes, ignore them.
3. **Can array contain duplicates?** Yes.
4. **What is the maximum array size?** Up to 10^5.
5. **What is the value range?** -2^31 to 2^31 - 1.

### Edge Cases
1. **Empty array:** `nums = []` → 1
2. **All negatives:** `nums = [-1, -2, -3]` → 1
3. **Continuous from 1:** `nums = [1, 2, 3]` → 4

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Set)
Put all positives in a set, then check 1, 2, 3, ... until missing found.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Index as Hash)
Use the array itself as a hash map: place each number x in position x-1 if 1 ≤ x ≤ n. Then scan for first position where nums[i] ≠ i+1.

**Core Insight:** Answer must be in range [1, n+1]. If all 1 to n present, answer is n+1. Use array indices to mark presence.

### Why Optimal?
Eliminates auxiliary space by repurposing input array as presence indicator, achieving O(1) extra space.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> int:
    """
    Find smallest missing positive integer.
    
    Args:
        numbers: Unsorted array of integers
    
    Returns:
        Smallest positive integer not in array
    """
    n = len(numbers)
    
    # Place each number in its "correct" position
    # Number x should be at index x-1 (if 1 <= x <= n)
    for i in range(n):  # O(N) total swaps across all iterations
        # Keep swapping until current position is "settled"
        while (1 <= numbers[i] <= n and 
               numbers[numbers[i] - 1] != numbers[i]):
            # Swap numbers[i] to its correct position
            correct_index = numbers[i] - 1
            numbers[i], numbers[correct_index] = numbers[correct_index], numbers[i]
    
    # Find first position where number doesn't match expected value
    for i in range(n):  # O(N)
        if numbers[i] != i + 1:
            return i + 1
    
    # All positions 1 to n are filled, answer is n+1
    return n + 1


def solve_marking(numbers: list[int]) -> int:
    """
    Alternative: Mark presence using negative signs.
    """
    n = len(numbers)
    
    # Step 1: Replace negatives and zeros with n+1 (out of range)
    for i in range(n):
        if numbers[i] <= 0:
            numbers[i] = n + 1
    
    # Step 2: Mark presence by negating value at index
    for i in range(n):
        val = abs(numbers[i])
        if val <= n:
            numbers[val - 1] = -abs(numbers[val - 1])
    
    # Step 3: First positive index indicates missing number
    for i in range(n):
        if numbers[i] > 0:
            return i + 1
    
    return n + 1
```

---

## Phase 4: Dry Run

**Input:** `numbers = [3, 4, -1, 1]`

**Phase 1: Cyclic Sort**

| i | numbers[i] | Valid range? | Target index | Action | Array State |
|---|------------|--------------|--------------|--------|-------------|
| 0 | 3 | Yes (1≤3≤4) | 2 | Swap nums[0]↔nums[2] | [-1,4,3,1] |
| 0 | -1 | No | — | Move on | [-1,4,3,1] |
| 1 | 4 | Yes (1≤4≤4) | 3 | Swap nums[1]↔nums[3] | [-1,1,3,4] |
| 1 | 1 | Yes (1≤1≤4) | 0 | Swap nums[1]↔nums[0] | [1,-1,3,4] |
| 1 | -1 | No | — | Move on | [1,-1,3,4] |
| 2 | 3 | Yes, but nums[2]=3 | — | Already correct | [1,-1,3,4] |
| 3 | 4 | Yes, but nums[3]=4 | — | Already correct | [1,-1,3,4] |

**Phase 2: Find Missing**

| i | Expected | Actual | Match? |
|---|----------|--------|--------|
| 0 | 1 | 1 | ✓ |
| 1 | 2 | -1 | ✗ → Return 2 |

**Result:** `2`

**Correctness:** Array contains [1, 3, 4]; missing is 2 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Cyclic sort: Each element moves to its final position at most once, so total swaps ≤ N
- Final scan: O(N)
- Total: O(N)

### Space Complexity: O(1)
Only uses loop variables and modifies input array in-place. No auxiliary data structures.

---

## Phase 6: Follow-Up Questions

1. **"What if we cannot modify the input array?"**
   → Must use O(N) space hash set or bit vector; cannot achieve O(1) space without modification.

2. **"How would you find the k-th missing positive?"**
   → Binary search: for each position, count how many positives are missing up to that point; find where count reaches k.

3. **"What if array could be very sparse with huge values?"**
   → Answer is still bounded by n+1; huge values beyond n can be ignored without affecting result.
