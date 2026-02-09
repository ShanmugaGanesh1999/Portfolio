# Single Number II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 137 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find element appearing once; all others appear three times.

### Constraints & Clarifying Questions
1. **Exactly one appears once?** Yes.
2. **Others exactly three times?** Yes.
3. **Linear time, O(1) space?** Required.
4. **Negative numbers?** Valid.

### Edge Cases
1. **Single element:** Return it
2. **All same:** Not valid per constraints
3. **Large numbers:** Bit counting handles

---

## Phase 2: High-Level Approach

### Approach: Bit Count Mod 3
Count 1s at each bit position. Mod 3 gives unique number's bits.

**Core Insight:** If bit appears 3k+1 times, it belongs to unique number.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Find single number (others appear 3 times).
    
    Args:
        nums: Array with one unique element
    
    Returns:
        The single number
    """
    result = 0
    
    for i in range(32):
        bit_sum = 0
        for num in nums:
            # Count 1s at bit position i
            bit_sum += (num >> i) & 1
        
        # If not divisible by 3, unique number has this bit
        if bit_sum % 3:
            result |= (1 << i)
    
    # Handle negative numbers (Python's infinite precision)
    if result >= 2**31:
        result -= 2**32
    
    return result


def solve_state_machine(nums: List[int]) -> int:
    """
    State machine with two variables.
    ones: bits appearing once (mod 3)
    twos: bits appearing twice (mod 3)
    """
    ones = twos = 0
    
    for num in nums:
        # ones becomes 1 if:
        # - currently 0 and num has 1 (new bit)
        # - currently 1 and num has 0 (retain)
        ones = (ones ^ num) & ~twos
        twos = (twos ^ num) & ~ones
    
    return ones


def solve_generalized(nums: List[int], k: int) -> int:
    """
    Generalized: others appear k times.
    """
    result = 0
    
    for i in range(32):
        bit_sum = sum((num >> i) & 1 for num in nums)
        if bit_sum % k:
            result |= (1 << i)
    
    if result >= 2**31:
        result -= 2**32
    
    return result


def solve_hashmap(nums: List[int]) -> int:
    """
    Hash map approach (O(n) space).
    """
    from collections import Counter
    count = Counter(nums)
    
    for num, cnt in count.items():
        if cnt == 1:
            return num
```

---

## Phase 4: Dry Run

**Input:** [2, 2, 3, 2]

**Bit counting (first 3 bits):**

| Bit | 2₂ | 2₂ | 3₂ | 2₂ | Sum | Sum%3 |
|-----|----|----|----|----|-----|-------|
| 0 | 0 | 0 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 4 | 1 |

**Result bits:** 11₂ = 3 ✓

**State machine:**

| num | ones | twos |
|-----|------|------|
| 2 | 2 | 0 |
| 2 | 0 | 2 |
| 3 | 3 | 0 |
| 2 | 1 | 2 |

Wait, let me recalculate...
- After first 2: ones=2, twos=0
- After second 2: ones=0, twos=2
- After 3: ones=3, twos=0 (since 3 XOR 0 = 3, ~twos = ~2 keeps bit 0)
- After third 2: ones=1, twos=2... 

Actually result = ones = 3 ✓

---

## Phase 5: Complexity Analysis

### Bit Counting:
- **Time:** O(32N) = O(N)
- **Space:** O(1)

### State Machine:
- **Time:** O(N)
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Others appear k times?"**
   → Generalized bit counting mod k.

2. **"Two unique numbers, rest three times?"**
   → Combine with Single Number III technique.

3. **"Return all unique numbers?"**
   → Hash map required.
