# Sqrt(x)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 69 | Math + Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return floor of square root of x.

### Constraints & Clarifying Questions
1. **Non-negative x?** Yes.
2. **Return integer?** Yes, floor.
3. **x = 0?** Return 0.
4. **Large x?** Up to 2^31 - 1.

### Edge Cases
1. **x = 0:** 0
2. **x = 1:** 1
3. **Perfect square:** Exact root
4. **x = MAX_INT:** ~46340

---

## Phase 2: High-Level Approach

### Approach: Binary Search
Search for largest k where k² ≤ x.

**Core Insight:** Monotonic: if k² > x, answer < k.

---

## Phase 3: Python Code

```python
def solve(x: int) -> int:
    """
    Return floor of sqrt(x).
    
    Args:
        x: Non-negative integer
    
    Returns:
        Floor of sqrt(x)
    """
    if x < 2:
        return x
    
    left, right = 1, x // 2
    
    while left <= right:
        mid = (left + right) // 2
        squared = mid * mid
        
        if squared == x:
            return mid
        elif squared < x:
            left = mid + 1
        else:
            right = mid - 1
    
    return right


def solve_newton(x: int) -> int:
    """
    Newton's method (faster convergence).
    """
    if x < 2:
        return x
    
    # Initial guess
    r = x
    
    while r * r > x:
        r = (r + x // r) // 2
    
    return r


def solve_bit_manipulation(x: int) -> int:
    """
    Bit by bit construction.
    """
    if x < 2:
        return x
    
    # Find highest bit position
    bit = 1
    while bit * bit <= x:
        bit <<= 1
    bit >>= 1
    
    result = 0
    while bit > 0:
        if (result + bit) * (result + bit) <= x:
            result += bit
        bit >>= 1
    
    return result


def solve_math(x: int) -> int:
    """
    Using logarithm (may have precision issues).
    """
    if x < 2:
        return x
    
    import math
    
    # sqrt(x) = e^(0.5 * ln(x))
    approx = int(math.exp(0.5 * math.log(x)))
    
    # Adjust for precision errors
    if (approx + 1) * (approx + 1) <= x:
        return approx + 1
    return approx
```

---

## Phase 4: Dry Run

**Input:** x = 8

**Binary Search:**
- left=1, right=4

| left | right | mid | mid² | Compare | Action |
|------|-------|-----|------|---------|--------|
| 1 | 4 | 2 | 4 | 4<8 | left=3 |
| 3 | 4 | 3 | 9 | 9>8 | right=2 |
| 3 | 2 | - | - | left>right | Done |

**Result:** right = 2 ✓

**Newton's Method:** x = 8
- r = 8 → (8 + 8/8)/2 = 4
- r = 4 → (4 + 8/4)/2 = 3  
- r = 3 → (3 + 8/3)/2 = 2
- r = 2 → 2*2 = 4 ≤ 8 ✓

---

## Phase 5: Complexity Analysis

### Binary Search:
- **Time:** O(log X)
- **Space:** O(1)

### Newton's Method:
- **Time:** O(log X) - quadratic convergence
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Compute cube root?"**
   → Same binary search; compare mid³.

2. **"Return decimal precision?"**
   → Float binary search or Newton's method.

3. **"Sqrt with floating point input?"**
   → Newton's method more suitable.
