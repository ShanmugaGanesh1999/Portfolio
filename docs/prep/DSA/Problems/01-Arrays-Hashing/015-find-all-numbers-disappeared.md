# Find All Numbers Disappeared in an Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 448 | Index as Hash / In-place Marking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Given an array of n integers where each integer is in range [1, n], find all integers in [1, n] that don't appear.

### Constraints & Clarifying Questions
1. **Can we modify the input array?** Yes, for O(1) space solution.
2. **Are all values in range [1, n]?** Yes, guaranteed.
3. **Can there be duplicates?** Yes, some numbers appear twice.
4. **What is the expected complexity?** O(N) time, ideally O(1) extra space.
5. **What is the maximum array size?** Up to 10^5.

### Edge Cases
1. **No missing numbers:** `nums = [1, 2, 3]` → `[]`
2. **All same value:** `nums = [1, 1, 1]` → `[2, 3]`
3. **Single element:** `nums = [1]` → `[]`

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Set)
Put all numbers in a set, check which 1 to n are missing.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (In-place Marking)
Use array indices as presence markers. For each value x, mark index x-1 as "seen" by negating it. Then indices with positive values indicate missing numbers.

**Core Insight:** Since values are in [1, n] and array size is n, we can use the array itself as a hash table using sign as the presence flag.

### Why Optimal?
Achieves O(1) auxiliary space by repurposing input array for marking, eliminating need for separate hash set.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> list[int]:
    """
    Find all numbers in [1, n] missing from array.
    
    Args:
        numbers: Array of n integers, each in range [1, n]
    
    Returns:
        List of missing integers from range [1, n]
    """
    n = len(numbers)
    
    # Mark presence: for each value x, negate value at index (x-1)
    for i in range(n):  # O(N)
        # Use absolute value since number might already be negated
        target_index = abs(numbers[i]) - 1
        
        # Mark as seen by making negative (if not already)
        if numbers[target_index] > 0:
            numbers[target_index] = -numbers[target_index]  # O(1)
    
    # Collect indices where value is still positive (not seen)
    missing_numbers = []
    for i in range(n):  # O(N)
        if numbers[i] > 0:
            missing_numbers.append(i + 1)  # Index i means number i+1 is missing
    
    return missing_numbers


def solve_cyclic(numbers: list[int]) -> list[int]:
    """
    Alternative: Cyclic sort approach.
    Place each number at its correct index, then find mismatches.
    """
    n = len(numbers)
    
    # Place each number x at index x-1
    for i in range(n):
        while numbers[i] != numbers[numbers[i] - 1]:
            correct_idx = numbers[i] - 1
            numbers[i], numbers[correct_idx] = numbers[correct_idx], numbers[i]
    
    # Find positions where number doesn't match index+1
    return [i + 1 for i in range(n) if numbers[i] != i + 1]
```

---

## Phase 4: Dry Run

**Input:** `numbers = [4, 3, 2, 7, 8, 2, 3, 1]`

**Phase 1: Marking**

| i | numbers[i] | abs(val) | target_idx | Action | Array State |
|---|------------|----------|------------|--------|-------------|
| 0 | 4 | 4 | 3 | Negate nums[3] | [4,3,2,-7,8,2,3,1] |
| 1 | 3 | 3 | 2 | Negate nums[2] | [4,3,-2,-7,8,2,3,1] |
| 2 | -2 | 2 | 1 | Negate nums[1] | [4,-3,-2,-7,8,2,3,1] |
| 3 | -7 | 7 | 6 | Negate nums[6] | [4,-3,-2,-7,8,2,-3,1] |
| 4 | 8 | 8 | 7 | Negate nums[7] | [4,-3,-2,-7,8,2,-3,-1] |
| 5 | 2 | 2 | 1 | nums[1] already neg | No change |
| 6 | -3 | 3 | 2 | nums[2] already neg | No change |
| 7 | -1 | 1 | 0 | Negate nums[0] | [-4,-3,-2,-7,8,2,-3,-1] |

**Phase 2: Find Missing**

| i | numbers[i] | Positive? | Missing Number |
|---|------------|-----------|----------------|
| 0 | -4 | No | — |
| 1 | -3 | No | — |
| 2 | -2 | No | — |
| 3 | -7 | No | — |
| 4 | 8 | **Yes** | **5** |
| 5 | 2 | **Yes** | **6** |
| 6 | -3 | No | — |
| 7 | -1 | No | — |

**Result:** `[5, 6]`

**Verification:** Values 5 and 6 are indeed absent from input ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Two passes through the array: one for marking, one for collecting. Each is O(N).

### Space Complexity: O(1) auxiliary
Only uses loop variables. Output list is required and doesn't count as auxiliary.

---

## Phase 6: Follow-Up Questions

1. **"What if we cannot modify the input array?"**
   → Use O(N) space hash set, or O(N log N) sorting with O(1) space.

2. **"What if values could be outside range [1, n]?"**
   → Filter to valid range first, or use hash set for O(N) time/space.

3. **"What if we also need to find duplicates along with missing?"**
   → Same marking technique: when marking, if already negative, that value is a duplicate; positive indices at end indicate missing.
