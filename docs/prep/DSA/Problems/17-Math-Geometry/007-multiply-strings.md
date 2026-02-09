# Multiply Strings

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 43 | Math + Simulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Multiply two numbers given as strings. No BigInteger.

### Constraints & Clarifying Questions
1. **Input valid non-negative?** Yes.
2. **Leading zeros in result?** Remove except "0".
3. **Can use int for intermediates?** For single digits, yes.
4. **Empty string?** No.

### Edge Cases
1. **"0" * anything:** "0"
2. **"1" * num:** num
3. **Large numbers:** 200 digits each

---

## Phase 2: High-Level Approach

### Approach: Grade School Multiplication
Multiply each digit pair, accumulate at correct position.
Result position for num1[i] × num2[j] is i + j + 1 (carry at i + j).

**Core Insight:** Product of m-digit × n-digit ≤ m+n digits.

---

## Phase 3: Python Code

```python
def solve(num1: str, num2: str) -> str:
    """
    Multiply two strings representing numbers.
    
    Args:
        num1: First number string
        num2: Second number string
    
    Returns:
        Product as string
    """
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    result = [0] * (m + n)
    
    # Multiply each digit pair
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            prod = int(num1[i]) * int(num2[j])
            
            # Position in result
            p1, p2 = i + j, i + j + 1
            
            # Add to existing value
            total = prod + result[p2]
            
            result[p2] = total % 10
            result[p1] += total // 10
    
    # Convert to string, skip leading zeros
    result_str = ''.join(map(str, result))
    return result_str.lstrip('0') or '0'


def solve_verbose(num1: str, num2: str) -> str:
    """
    More verbose with explanation.
    """
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    
    # Result can have at most m + n digits
    result = [0] * (m + n)
    
    # Reverse for easier indexing
    num1 = num1[::-1]
    num2 = num2[::-1]
    
    for i in range(m):
        for j in range(n):
            d1 = int(num1[i])
            d2 = int(num2[j])
            product = d1 * d2
            
            # Add to position i + j
            result[i + j] += product
            
            # Handle carry
            result[i + j + 1] += result[i + j] // 10
            result[i + j] %= 10
    
    # Remove leading zeros and convert
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    
    return ''.join(map(str, reversed(result)))


def solve_karatsuba(num1: str, num2: str) -> str:
    """
    Karatsuba algorithm for very large numbers.
    O(n^1.585) instead of O(n^2).
    """
    if len(num1) < 10 or len(num2) < 10:
        return str(int(num1) * int(num2))
    
    n = max(len(num1), len(num2))
    half = n // 2
    
    # Pad to equal length
    num1 = num1.zfill(n)
    num2 = num2.zfill(n)
    
    # Split
    a, b = num1[:-half], num1[-half:]
    c, d = num2[:-half], num2[-half:]
    
    # Recursive calls
    ac = solve_karatsuba(a, c)
    bd = solve_karatsuba(b, d)
    
    # (a+b)(c+d) = ac + ad + bc + bd
    ab_sum = str(int(a) + int(b))
    cd_sum = str(int(c) + int(d))
    abcd = solve_karatsuba(ab_sum, cd_sum)
    
    # ad + bc = (a+b)(c+d) - ac - bd
    ad_bc = str(int(abcd) - int(ac) - int(bd))
    
    # Result = ac * 10^(2*half) + (ad+bc) * 10^half + bd
    result = (
        int(ac) * (10 ** (2 * half)) +
        int(ad_bc) * (10 ** half) +
        int(bd)
    )
    
    return str(result)
```

---

## Phase 4: Dry Run

**Input:** num1 = "123", num2 = "45"

**Result array:** [0, 0, 0, 0, 0] (length 5)

| i | j | d1×d2 | pos | result |
|---|---|-------|-----|--------|
| 2 | 1 | 3×5=15 | 4 | [0,0,0,1,5] |
| 2 | 0 | 3×4=12 | 3 | [0,0,1,3,5] |
| 1 | 1 | 2×5=10 | 3 | [0,0,2,3,5] |
| 1 | 0 | 2×4=8 | 2 | [0,1,0,3,5] |
| 0 | 1 | 1×5=5 | 2 | [0,1,5,3,5] |
| 0 | 0 | 1×4=4 | 1 | [0,5,5,3,5] |

**Result:** "5535" ✓ (123 × 45 = 5535)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each digit pair multiplied once.

### Space Complexity: O(M + N)
Result array.

---

## Phase 6: Follow-Up Questions

1. **"Add two string numbers?"**
   → Similar approach with addition.

2. **"Divide string numbers?"**
   → Long division simulation.

3. **"Very large numbers (millions of digits)?"**
   → FFT-based multiplication O(n log n).
