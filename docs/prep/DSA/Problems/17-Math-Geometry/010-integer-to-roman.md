# Integer to Roman

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 12 | Math + Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Convert integer to Roman numeral string.

### Constraints & Clarifying Questions
1. **Range?** 1 to 3999.
2. **Standard Roman?** Yes, with subtractions.
3. **Shortest representation?** Yes.
4. **Output format?** Uppercase.

### Edge Cases
1. **num = 1:** "I"
2. **num = 4:** "IV" (not "IIII")
3. **num = 3999:** "MMMCMXCIX"

---

## Phase 2: High-Level Approach

### Approach: Greedy with Value Table
Use largest value possible first. Include subtraction cases (4, 9, 40, 90, etc.).

**Core Insight:** Greedy: repeatedly subtract largest possible Roman value.

---

## Phase 3: Python Code

```python
def solve(num: int) -> str:
    """
    Convert integer to Roman numeral.
    
    Args:
        num: Integer (1-3999)
    
    Returns:
        Roman numeral string
    """
    values = [
        (1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
        (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
        (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')
    ]
    
    result = []
    
    for val, symbol in values:
        while num >= val:
            result.append(symbol)
            num -= val
    
    return ''.join(result)


def solve_divmod(num: int) -> str:
    """
    Using divmod for counting.
    """
    values = [
        (1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
        (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
        (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')
    ]
    
    result = []
    
    for val, symbol in values:
        count, num = divmod(num, val)
        result.append(symbol * count)
    
    return ''.join(result)


def solve_lookup(num: int) -> str:
    """
    Direct lookup for each digit position.
    """
    thousands = ['', 'M', 'MM', 'MMM']
    hundreds = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM']
    tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC']
    ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
    
    return (thousands[num // 1000] +
            hundreds[(num % 1000) // 100] +
            tens[(num % 100) // 10] +
            ones[num % 10])


def solve_recursive(num: int) -> str:
    """
    Recursive approach.
    """
    values = [
        (1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
        (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
        (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')
    ]
    
    def helper(n, idx):
        if n == 0:
            return ''
        
        val, symbol = values[idx]
        if n >= val:
            return symbol + helper(n - val, idx)
        return helper(n, idx + 1)
    
    return helper(num, 0)
```

---

## Phase 4: Dry Run

**Input:** num = 1994

| val | symbol | num >= val | Action | result |
|-----|--------|------------|--------|--------|
| 1000 | M | 1994≥1000 | Add M, num=994 | "M" |
| 900 | CM | 994≥900 | Add CM, num=94 | "MCM" |
| 500 | D | 94<500 | Skip | "MCM" |
| 400 | CD | 94<400 | Skip | "MCM" |
| 100 | C | 94<100 | Skip | "MCM" |
| 90 | XC | 94≥90 | Add XC, num=4 | "MCMXC" |
| ... | ... | ... | Skip 50,40,10,9,5 | "MCMXC" |
| 4 | IV | 4≥4 | Add IV, num=0 | "MCMXCIV" |

**Result:** "MCMXCIV" ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
Bounded number of iterations (max ~15).

### Space Complexity: O(1)
Result length bounded by ~15 characters.

---

## Phase 6: Follow-Up Questions

1. **"Roman to Integer?"**
   → Previous problem; compare neighbors.

2. **"Extended range beyond 3999?"**
   → Add overline notation (×1000).

3. **"Validate output?"**
   → Convert back and compare.
