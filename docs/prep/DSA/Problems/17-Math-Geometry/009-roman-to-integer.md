# Roman to Integer

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 13 | String + Math |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Convert Roman numeral string to integer.

### Constraints & Clarifying Questions
1. **Valid input?** Yes, guaranteed valid.
2. **Range?** 1 to 3999.
3. **Subtraction rule?** IV=4, IX=9, XL=40, etc.
4. **Case sensitive?** Uppercase only.

### Edge Cases
1. **Single digit:** "V" → 5
2. **Subtraction:** "IV" → 4
3. **Max value:** "MMMCMXCIX" → 3999

---

## Phase 2: High-Level Approach

### Approach: Left to Right with Subtraction Check
If current value < next value, subtract; else add.

**Core Insight:** Smaller before larger means subtract.

---

## Phase 3: Python Code

```python
def solve(s: str) -> int:
    """
    Convert Roman numeral to integer.
    
    Args:
        s: Roman numeral string
    
    Returns:
        Integer value
    """
    values = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    }
    
    result = 0
    
    for i in range(len(s)):
        if i + 1 < len(s) and values[s[i]] < values[s[i + 1]]:
            result -= values[s[i]]
        else:
            result += values[s[i]]
    
    return result


def solve_right_to_left(s: str) -> int:
    """
    Right to left approach.
    """
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    
    result = 0
    prev = 0
    
    for char in reversed(s):
        curr = values[char]
        if curr < prev:
            result -= curr
        else:
            result += curr
        prev = curr
    
    return result


def solve_replace(s: str) -> int:
    """
    Replace subtraction pairs first.
    """
    s = s.replace('IV', 'IIII').replace('IX', 'VIIII')
    s = s.replace('XL', 'XXXX').replace('XC', 'LXXXX')
    s = s.replace('CD', 'CCCC').replace('CM', 'DCCCC')
    
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    
    return sum(values[c] for c in s)


def solve_two_char_lookup(s: str) -> int:
    """
    Lookup two-character subtractions directly.
    """
    values = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000,
        'IV': 4, 'IX': 9, 'XL': 40, 'XC': 90, 'CD': 400, 'CM': 900
    }
    
    result = 0
    i = 0
    
    while i < len(s):
        if i + 1 < len(s) and s[i:i+2] in values:
            result += values[s[i:i+2]]
            i += 2
        else:
            result += values[s[i]]
            i += 1
    
    return result
```

---

## Phase 4: Dry Run

**Input:** "MCMXCIV"

| i | Char | Next | Compare | Action | Result |
|---|------|------|---------|--------|--------|
| 0 | M | C | 1000>100 | +1000 | 1000 |
| 1 | C | M | 100<1000 | -100 | 900 |
| 2 | M | X | 1000>10 | +1000 | 1900 |
| 3 | X | C | 10<100 | -10 | 1890 |
| 4 | C | I | 100>1 | +100 | 1990 |
| 5 | I | V | 1<5 | -1 | 1989 |
| 6 | V | - | - | +5 | 1994 |

**Result:** 1994 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through string.

### Space Complexity: O(1)
Fixed-size lookup table.

---

## Phase 6: Follow-Up Questions

1. **"Integer to Roman?"**
   → Greedy: largest value first.

2. **"Validate Roman numeral?"**
   → Check rules: max 3 consecutive, valid subtractions.

3. **"Extended Roman (beyond 3999)?"**
   → Add overline notation or new symbols.
