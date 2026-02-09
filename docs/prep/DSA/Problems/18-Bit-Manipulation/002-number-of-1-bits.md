# Number of 1 Bits

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 191 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count set bits (1s) in binary representation.

### Constraints & Clarifying Questions
1. **Unsigned integer?** Yes.
2. **32-bit?** Yes.
3. **Zero?** Return 0.
4. **Max value (all 1s)?** Return 32.

### Edge Cases
1. **n = 0:** 0
2. **n = 1:** 1
3. **n = 0xFFFFFFFF:** 32

---

## Phase 2: High-Level Approach

### Approach: Brian Kernighan's Algorithm
n & (n-1) removes rightmost set bit.
Count iterations until n = 0.

**Core Insight:** n & (n-1) flips rightmost 1 to 0.

---

## Phase 3: Python Code

```python
def solve(n: int) -> int:
    """
    Count number of 1 bits (Hamming weight).
    
    Args:
        n: Unsigned 32-bit integer
    
    Returns:
        Number of set bits
    """
    count = 0
    while n:
        n &= n - 1  # Remove rightmost 1 bit
        count += 1
    return count


def solve_shift(n: int) -> int:
    """
    Check each bit by shifting.
    """
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count


def solve_mask(n: int) -> int:
    """
    Using mask for each bit position.
    """
    count = 0
    mask = 1
    for _ in range(32):
        if n & mask:
            count += 1
        mask <<= 1
    return count


def solve_builtin(n: int) -> int:
    """
    Using Python built-in.
    """
    return bin(n).count('1')


def solve_lookup(n: int) -> int:
    """
    Lookup table for byte counting.
    """
    # Precompute popcount for all bytes
    table = [bin(i).count('1') for i in range(256)]
    
    count = 0
    for _ in range(4):  # 4 bytes for 32-bit
        count += table[n & 0xFF]
        n >>= 8
    return count
```

---

## Phase 4: Dry Run

**Input:** n = 11 (binary: 1011)

**Brian Kernighan's:**

| n (binary) | n-1 (binary) | n & (n-1) | count |
|------------|--------------|-----------|-------|
| 1011 | 1010 | 1010 | 1 |
| 1010 | 1001 | 1000 | 2 |
| 1000 | 0111 | 0000 | 3 |
| 0000 | - | Done | 3 |

**Result:** 3 ✓

---

## Phase 5: Complexity Analysis

### Brian Kernighan's:
- **Time:** O(number of 1 bits)
- **Space:** O(1)

### Shift Method:
- **Time:** O(32) = O(1)
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Called many times?"**
   → Precompute lookup table.

2. **"Count 0 bits?"**
   → 32 - count of 1 bits.

3. **"Hamming distance between two numbers?"**
   → Count 1s in a XOR b.
