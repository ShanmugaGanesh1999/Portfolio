# Bitwise AND of Numbers Range

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 201 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Compute bitwise AND of all numbers in range [left, right].

### Constraints & Clarifying Questions
1. **Inclusive range?** Yes.
2. **left ≤ right?** Yes.
3. **Empty range?** No.
4. **Large range?** Need optimization.

### Edge Cases
1. **left == right:** Return left
2. **left = 0:** Result is 0
3. **Adjacent numbers:** Many bits differ

---

## Phase 2: High-Level Approach

### Approach: Find Common Prefix
AND of range = common prefix of left and right.
Any differing bit becomes 0 somewhere in range.

**Core Insight:** Find longest common bit prefix.

---

## Phase 3: Python Code

```python
def solve(left: int, right: int) -> int:
    """
    Bitwise AND of range [left, right].
    
    Args:
        left: Start of range
        right: End of range
    
    Returns:
        AND of all numbers in range
    """
    shift = 0
    
    # Find common prefix
    while left < right:
        left >>= 1
        right >>= 1
        shift += 1
    
    return left << shift


def solve_brian_kernighan(left: int, right: int) -> int:
    """
    Remove rightmost bits from right until right <= left.
    """
    while right > left:
        right = right & (right - 1)
    
    return right


def solve_bit_by_bit(left: int, right: int) -> int:
    """
    Check each bit position.
    """
    result = 0
    
    for i in range(31, -1, -1):
        left_bit = (left >> i) & 1
        right_bit = (right >> i) & 1
        
        if left_bit == right_bit:
            result |= left_bit << i
        else:
            # Once bits differ, all lower bits will be 0
            break
    
    return result


def solve_common_prefix(left: int, right: int) -> int:
    """
    Explicit common prefix finding.
    """
    # Find highest differing bit
    diff = left ^ right
    
    # Create mask for common prefix
    # Highest bit of diff tells where they diverge
    if diff == 0:
        return left
    
    # Find position of highest set bit in diff
    pos = diff.bit_length()
    
    # Mask: keep bits above position
    mask = ~((1 << pos) - 1)
    
    return left & mask
```

---

## Phase 4: Dry Run

**Input:** left = 5, right = 7

**Binary:**
- 5 = 101
- 6 = 110
- 7 = 111

**Common prefix method:**

| left | right | shift |
|------|-------|-------|
| 101 | 111 | 0 |
| 10 | 11 | 1 |
| 1 | 1 | 2 |

**Result:** 1 << 2 = 100 = 4 ✓

**Verification:** 5 & 6 & 7 = 101 & 110 & 111 = 100 = 4 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
At most 32 iterations for 32-bit integers.

### Space Complexity: O(1)
Constant space.

---

## Phase 6: Follow-Up Questions

1. **"OR of range instead?"**
   → Different; OR finds first differing bit and sets all lower.

2. **"XOR of range?"**
   → Different property; use prefix XOR.

3. **"Range updates in array?"**
   → Segment tree with lazy propagation.
