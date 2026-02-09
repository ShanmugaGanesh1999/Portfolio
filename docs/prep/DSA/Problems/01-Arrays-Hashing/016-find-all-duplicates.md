# Find All Duplicates in an Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 442 | Index as Hash / In-place Marking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all elements that appear exactly twice in an array where each integer is in range [1, n].

### Constraints & Clarifying Questions
1. **What values appear?** Each element is 1 ≤ x ≤ n.
2. **How many times can each appear?** Once or twice only.
3. **Can we modify the array?** Yes, for O(1) space.
4. **Expected complexity?** O(N) time, O(1) extra space.
5. **Maximum array size?** Up to 10^5.

### Edge Cases
1. **No duplicates:** `nums = [1, 2, 3, 4]` → `[]`
2. **All duplicates:** `nums = [1, 1, 2, 2]` → `[1, 2]`
3. **Single duplicate:** `nums = [4, 3, 2, 7, 8, 2, 3, 1]` → `[2, 3]`

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Map)
Count frequencies, return those with count 2.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (In-place Marking)
For each value x, negate the value at index x-1. If that position is already negative, x is a duplicate.

**Core Insight:** First occurrence of x makes index x-1 negative; second occurrence finds it already negative, revealing the duplicate.

### Why Optimal?
Uses the array itself as a presence tracker, achieving O(1) auxiliary space.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> list[int]:
    """
    Find all elements appearing exactly twice.
    
    Args:
        numbers: Array where each value is in [1, n]
    
    Returns:
        List of values that appear twice
    """
    duplicates = []
    
    for number in numbers:  # O(N)
        # Get the absolute value (might be negative from earlier marking)
        target_index = abs(number) - 1
        
        # If value at target index is negative, we've seen this number before
        if numbers[target_index] < 0:
            duplicates.append(abs(number))  # Found duplicate
        else:
            # First occurrence: mark by negating
            numbers[target_index] = -numbers[target_index]
    
    return duplicates


def solve_one_pass_alternative(numbers: list[int]) -> list[int]:
    """
    Alternative using addition instead of negation.
    Add n to mark presence.
    """
    n = len(numbers)
    duplicates = []
    
    for number in numbers:
        # Original value is number % n (handles previously modified values)
        original = (number - 1) % n
        
        # If value at index > 2n, it means we've added n twice (duplicate)
        if numbers[original] > 2 * n:
            duplicates.append(original + 1)
        else:
            numbers[original] += n
    
    # Collect all positions where value > 2n
    return [i + 1 for i in range(n) if numbers[i] > 2 * n]
```

---

## Phase 4: Dry Run

**Input:** `numbers = [4, 3, 2, 7, 8, 2, 3, 1]`

| Step | number | abs(number) | target_idx | numbers[target_idx] | Is Negative? | Action | duplicates |
|------|--------|-------------|------------|---------------------|--------------|--------|------------|
| 1 | 4 | 4 | 3 | 7 (positive) | No | Negate → -7 | [] |
| 2 | 3 | 3 | 2 | 2 (positive) | No | Negate → -2 | [] |
| 3 | -2 | 2 | 1 | 3 (positive) | No | Negate → -3 | [] |
| 4 | -7 | 7 | 6 | 3 (positive) | No | Negate → -3 | [] |
| 5 | 8 | 8 | 7 | 1 (positive) | No | Negate → -1 | [] |
| 6 | 2 | 2 | 1 | -3 (negative) | **Yes** | Add 2 | [2] |
| 7 | -3 | 3 | 2 | -2 (negative) | **Yes** | Add 3 | [2, 3] |
| 8 | -1 | 1 | 0 | 4 (positive) | No | Negate → -4 | [2, 3] |

**Result:** `[2, 3]`

**Verification:** 
- Value 2 appears at indices 2 and 5 ✓
- Value 3 appears at indices 1 and 6 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array with O(1) operations per element.

### Space Complexity: O(1) auxiliary
Only uses loop variables. Output list contains at most N/2 elements (each duplicate appears twice, so max duplicates is N/2).

---

## Phase 6: Follow-Up Questions

1. **"What if we cannot modify the input array?"**
   → Use hash set or Counter; O(N) space is required.

2. **"What if elements can appear more than twice?"**
   → The marking approach won't distinguish 2 vs 3+ occurrences; use counting approach or track state differently.

3. **"What if we need both missing and duplicate numbers?"**
   → Same technique: negative marking identifies duplicates, positive indices identify missing values at the end.
