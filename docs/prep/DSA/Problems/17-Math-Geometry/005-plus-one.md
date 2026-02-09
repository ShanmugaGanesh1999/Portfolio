# Plus One

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 66 | Math + Array |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Add 1 to number represented as digit array.

### Constraints & Clarifying Questions
1. **Leading zeros?** No (except 0 itself).
2. **Empty array?** No.
3. **Negative numbers?** No.
4. **Overflow?** May need extra digit (99→100).

### Edge Cases
1. **[0]:** [1]
2. **[9]:** [1, 0]
3. **[9,9,9]:** [1, 0, 0, 0]

---

## Phase 2: High-Level Approach

### Approach: Right to Left with Carry
Add 1 to last digit. Propagate carry left.
If carry remains, prepend 1.

**Core Insight:** Only need to handle 9s (carry propagation).

---

## Phase 3: Python Code

```python
from typing import List


def solve(digits: List[int]) -> List[int]:
    """
    Add one to number represented as digits.
    
    Args:
        digits: Array of digits
    
    Returns:
        Digits plus one
    """
    n = len(digits)
    
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    
    # All 9s case
    return [1] + digits


def solve_with_carry(digits: List[int]) -> List[int]:
    """
    Explicit carry tracking.
    """
    carry = 1
    
    for i in range(len(digits) - 1, -1, -1):
        total = digits[i] + carry
        digits[i] = total % 10
        carry = total // 10
        
        if carry == 0:
            return digits
    
    if carry:
        return [1] + digits
    
    return digits


def solve_convert(digits: List[int]) -> List[int]:
    """
    Convert to int, add, convert back.
    Note: May overflow for very large numbers.
    """
    num = int(''.join(map(str, digits)))
    num += 1
    return [int(d) for d in str(num)]


def solve_optimized(digits: List[int]) -> List[int]:
    """
    Optimized for common case (no carry).
    """
    # If last digit isn't 9, simple increment
    if digits[-1] != 9:
        digits[-1] += 1
        return digits
    
    # Find first non-9 from right
    i = len(digits) - 1
    while i >= 0 and digits[i] == 9:
        digits[i] = 0
        i -= 1
    
    if i >= 0:
        digits[i] += 1
        return digits
    
    return [1] + digits
```

---

## Phase 4: Dry Run

**Input:** [1, 2, 9]

| i | digits[i] | Action |
|---|-----------|--------|
| 2 | 9 | Set to 0 |
| 1 | 2 < 9 | Increment to 3, return |

**Result:** [1, 3, 0]

**Input:** [9, 9]

| i | digits[i] | Action |
|---|-----------|--------|
| 1 | 9 | Set to 0 |
| 0 | 9 | Set to 0 |
| Done | All 9s | Prepend 1 |

**Result:** [1, 0, 0]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through digits.

### Space Complexity: O(1)
In-place modification (O(N) if new array needed).

---

## Phase 6: Follow-Up Questions

1. **"Add arbitrary number k?"**
   → Same approach with k as initial carry.

2. **"Subtract one?"**
   → Handle borrow instead of carry.

3. **"Add two digit arrays?"**
   → Add Strings / Add Two Numbers variant.
