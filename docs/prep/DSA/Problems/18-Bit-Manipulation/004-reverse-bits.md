# Reverse Bits

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 190 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Reverse all 32 bits of unsigned integer.

### Constraints & Clarifying Questions
1. **32-bit unsigned?** Yes.
2. **Full 32 bits?** Yes, including leading zeros.
3. **n = 0?** Return 0.
4. **Multiple calls?** Consider optimization.

### Edge Cases
1. **n = 0:** 0
2. **n = 1:** 2^31
3. **Palindrome bits:** Same result

---

## Phase 2: High-Level Approach

### Approach: Bit by Bit Reversal
Extract each bit from right, place in result from left.

**Core Insight:** Build result by shifting left and adding bits.

---

## Phase 3: Python Code

```python
def solve(n: int) -> int:
    """
    Reverse bits of 32-bit unsigned integer.
    
    Args:
        n: 32-bit unsigned integer
    
    Returns:
        Bit-reversed integer
    """
    result = 0
    
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    
    return result


def solve_swap(n: int) -> int:
    """
    Divide and conquer: swap halves progressively.
    """
    # Swap adjacent bits
    n = ((n & 0x55555555) << 1) | ((n >> 1) & 0x55555555)
    # Swap pairs
    n = ((n & 0x33333333) << 2) | ((n >> 2) & 0x33333333)
    # Swap nibbles
    n = ((n & 0x0F0F0F0F) << 4) | ((n >> 4) & 0x0F0F0F0F)
    # Swap bytes
    n = ((n & 0x00FF00FF) << 8) | ((n >> 8) & 0x00FF00FF)
    # Swap 16-bit halves
    n = (n << 16) | (n >> 16)
    
    return n & 0xFFFFFFFF


def solve_cache(n: int) -> int:
    """
    Byte-level caching for multiple calls.
    """
    cache = {}
    
    def reverse_byte(byte):
        if byte not in cache:
            cache[byte] = int('{:08b}'.format(byte)[::-1], 2)
        return cache[byte]
    
    result = 0
    for i in range(4):
        result |= reverse_byte((n >> (i * 8)) & 0xFF) << ((3 - i) * 8)
    
    return result


def solve_string(n: int) -> int:
    """
    String manipulation (not optimal).
    """
    binary = bin(n)[2:].zfill(32)
    return int(binary[::-1], 2)
```

---

## Phase 4: Dry Run

**Input:** n = 43261596 (binary: 00000010100101000001111010011100)

**Bit by bit:**

| Step | n (last bit) | result |
|------|--------------|--------|
| 1 | 0 | 0 |
| 2 | 0 | 0 |
| 3 | 1 | 1 |
| 4 | 1 | 11 |
| 5 | 1 | 111 |
| ... | ... | ... |

**Reversed:** 00111001011110000010100101000000

**Result:** 964176192 ✓

---

## Phase 5: Complexity Analysis

### Bit by Bit:
- **Time:** O(32) = O(1)
- **Space:** O(1)

### Divide and Conquer:
- **Time:** O(1)
- **Space:** O(1)

### With Cache:
- **Time:** O(1) after warmup
- **Space:** O(256) for byte cache

---

## Phase 6: Follow-Up Questions

1. **"Optimize for many calls?"**
   → Cache reversed bytes.

2. **"Reverse only certain bits?"**
   → Mask relevant bits first.

3. **"64-bit integer?"**
   → Same approach, 64 iterations.
