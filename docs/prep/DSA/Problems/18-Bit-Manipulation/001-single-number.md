# Single Number

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 136 | Bit Manipulation (XOR) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the element that appears only once (all others appear twice).

### Constraints & Clarifying Questions
1. **Exactly one unique?** Yes.
2. **Others appear exactly twice?** Yes.
3. **Linear time, O(1) space?** Required.
4. **Negative numbers?** Valid.

### Edge Cases
1. **Single element array:** Return it
2. **All same except one:** Works
3. **Large numbers:** XOR handles

---

## Phase 2: High-Level Approach

### Approach: XOR All Elements
a ⊕ a = 0 and a ⊕ 0 = a.
XOR all elements; pairs cancel, leaving single number.

**Core Insight:** XOR is commutative, associative, self-inverse.

---

## Phase 3: Python Code

```python
from typing import List
from functools import reduce


def solve(nums: List[int]) -> int:
    """
    Find single number using XOR.
    
    Args:
        nums: Array with one unique element
    
    Returns:
        The single number
    """
    result = 0
    for num in nums:
        result ^= num
    return result


def solve_reduce(nums: List[int]) -> int:
    """
    Using reduce for functional style.
    """
    return reduce(lambda x, y: x ^ y, nums)


def solve_math(nums: List[int]) -> int:
    """
    Using set math (O(n) space though).
    2 * sum(set) - sum(array) = single
    """
    return 2 * sum(set(nums)) - sum(nums)


def solve_hashmap(nums: List[int]) -> int:
    """
    Count frequency (O(n) space).
    """
    from collections import Counter
    count = Counter(nums)
    for num, cnt in count.items():
        if cnt == 1:
            return num
```

---

## Phase 4: Dry Run

**Input:** [4, 1, 2, 1, 2]

| num | result (binary) | result |
|-----|-----------------|--------|
| 4 | 0 ⊕ 100 = 100 | 4 |
| 1 | 100 ⊕ 001 = 101 | 5 |
| 2 | 101 ⊕ 010 = 111 | 7 |
| 1 | 111 ⊕ 001 = 110 | 6 |
| 2 | 110 ⊕ 010 = 100 | 4 |

**Result:** 4 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array.

### Space Complexity: O(1)
Single variable.

---

## Phase 6: Follow-Up Questions

1. **"Two unique numbers?"**
   → Single Number III: XOR all, split by bit.

2. **"All others appear three times?"**
   → Single Number II: Count bits mod 3.

3. **"K unique numbers?"**
   → Counting sort or hash map.
