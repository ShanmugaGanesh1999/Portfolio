# Sqrt(x)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 69 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Compute integer square root of x (floor of actual sqrt).

### Constraints & Clarifying Questions
1. **Return floor?** Yes, truncate decimal.
2. **x range?** 0 to 2^31 - 1.
3. **Can use math.sqrt?** Typically no, implement yourself.
4. **Expected time?** O(log X).
5. **Negative input?** No, x ≥ 0.

### Edge Cases
1. **x = 0:** Return 0
2. **x = 1:** Return 1
3. **Perfect square:** `x = 16` → 4

---

## Phase 2: High-Level Approach

### Approach: Binary Search
Search for largest integer k where k² ≤ x.

**Core Insight:** If k² ≤ x, answer is ≥ k. If k² > x, answer is < k.

---

## Phase 3: Python Code

```python
def solve(x: int) -> int:
    """
    Compute integer square root of x.
    
    Args:
        x: Non-negative integer
    
    Returns:
        Floor of square root of x
    """
    if x < 2:
        return x
    
    left, right = 1, x // 2
    
    while left <= right:  # O(log X)
        mid = left + (right - left) // 2
        square = mid * mid
        
        if square == x:
            return mid
        elif square < x:
            left = mid + 1
        else:
            right = mid - 1
    
    return right  # Largest k where k² ≤ x


def solve_newton(x: int) -> int:
    """
    Newton's method (faster convergence).
    """
    if x < 2:
        return x
    
    # Initial guess
    guess = x // 2
    
    while guess * guess > x:
        # Newton's iteration: next = (guess + x/guess) / 2
        guess = (guess + x // guess) // 2
    
    return guess
```

---

## Phase 4: Dry Run

**Input:** `x = 8`

| left | right | mid | mid² | Action |
|------|-------|-----|------|--------|
| 1 | 4 | 2 | 4 | 4 < 8, left = 3 |
| 3 | 4 | 3 | 9 | 9 > 8, right = 2 |
| 3 | 2 | - | - | left > right, return 2 |

**Result:** `2` (2² = 4 ≤ 8 < 9 = 3²)

**Input:** `x = 16`

| left | right | mid | mid² | Action |
|------|-------|-----|------|--------|
| 1 | 8 | 4 | 16 | 16 = 16, return 4 |

**Result:** `4`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log X)
- Binary search: O(log X)
- Newton's method: O(log log X) in practice

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"How to compute nth root?"**
   → Binary search for k where k^n ≤ x; or Newton's method generalized.

2. **"How to get decimal precision?"**
   → Continue binary search on decimals, or use Newton's method with floats.

3. **"Why start right at x/2?"**
   → For x ≥ 2, sqrt(x) ≤ x/2 (since sqrt(4) = 2 = 4/2, and ratio decreases).
