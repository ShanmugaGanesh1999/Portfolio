# Single Number III

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 260 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find two elements appearing once; all others appear twice.

### Constraints & Clarifying Questions
1. **Exactly two unique?** Yes.
2. **Linear time?** Yes.
3. **O(1) space?** Yes (excluding output).
4. **Order in result?** Any order.

### Edge Cases
1. **Two elements only:** Return both
2. **Different signs:** Works
3. **Large gap between values:** Works

---

## Phase 2: High-Level Approach

### Approach: XOR and Split by Bit
1. XOR all → get a ⊕ b
2. Find any set bit (where a and b differ)
3. Split numbers by that bit; XOR each group

**Core Insight:** a and b differ in at least one bit; use it to separate them.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> List[int]:
    """
    Find two single numbers.
    
    Args:
        nums: Array with two unique elements
    
    Returns:
        The two single numbers
    """
    # XOR all numbers → a XOR b
    xor = 0
    for num in nums:
        xor ^= num
    
    # Find rightmost set bit (where a and b differ)
    # Can use: diff_bit = xor & (-xor)
    diff_bit = xor & (-xor)
    
    # Split into two groups and XOR each
    a = b = 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]


def solve_verbose(nums: List[int]) -> List[int]:
    """
    More verbose explanation.
    """
    # Step 1: XOR everything to get a^b
    xor_result = 0
    for num in nums:
        xor_result ^= num
    
    # Step 2: Find any bit where a and b differ
    # Using x & -x gets the rightmost set bit
    # Alternatively, find first set bit manually
    diff_bit = 1
    while not (xor_result & diff_bit):
        diff_bit <<= 1
    
    # Step 3: Partition numbers by this bit
    group1 = group2 = 0
    for num in nums:
        if num & diff_bit:
            group1 ^= num
        else:
            group2 ^= num
    
    return [group1, group2]


def solve_any_set_bit(nums: List[int]) -> List[int]:
    """
    Alternative: use any set bit.
    """
    xor = 0
    for num in nums:
        xor ^= num
    
    # Find any set bit (using bit scan)
    import math
    bit_pos = int(math.log2(xor & -xor)) if xor else 0
    mask = 1 << bit_pos
    
    a = b = 0
    for num in nums:
        if num & mask:
            a ^= num
        else:
            b ^= num
    
    return [a, b]
```

---

## Phase 4: Dry Run

**Input:** [1, 2, 1, 3, 2, 5]

**Step 1:** XOR all
- 1^2^1^3^2^5 = 3^5 = 011^101 = 110 = 6

**Step 2:** Find diff bit
- 6 & -6 = 6 & (..1010) = 010 = 2

**Step 3:** Split by bit 1
- Bit 1 set: 2, 3, 2 → XOR = 3
- Bit 1 not set: 1, 1, 5 → XOR = 5

**Result:** [3, 5] ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Two passes through array.

### Space Complexity: O(1)
Constant variables (excluding output).

---

## Phase 6: Follow-Up Questions

1. **"Three unique numbers?"**
   → More complex; need different approach.

2. **"Find if two unique numbers exist?"**
   → XOR ≠ 0 and splitting gives two values.

3. **"Unique numbers appear k times, rest m times?"**
   → Generalized with bit counting.
