# Letter Combinations of Phone Number

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 17 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return all possible letter combinations from phone digits (2-9).

### Constraints & Clarifying Questions
1. **Digit mapping?** Standard phone keypad.
2. **Empty input?** Return `[]`.
3. **0 or 1 in input?** Assume not (no letters).
4. **Order of result?** Any order.

### Edge Cases
1. **Empty string:** `[]`
2. **Single digit:** Letters for that digit
3. **All same digits:** Cross product of same letters

---

## Phase 2: High-Level Approach

### Option 1: Backtracking
Build combination digit by digit.

### Option 2: Iterative
BFS-style: start with [""], append each digit's letters.

**Core Insight:** Each digit adds 3-4 choices; total = product of choices.

---

## Phase 3: Python Code

```python
from typing import List


def solve(digits: str) -> List[str]:
    """
    Generate all letter combinations for phone digits.
    
    Args:
        digits: String of digits 2-9
    
    Returns:
        All letter combinations
    """
    if not digits:
        return []
    
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(idx: int, current: List[str]):
        if idx == len(digits):
            result.append(''.join(current))
            return
        
        for letter in mapping[digits[idx]]:
            current.append(letter)
            backtrack(idx + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result


def solve_iterative(digits: str) -> List[str]:
    """
    Iterative BFS-style approach.
    """
    if not digits:
        return []
    
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = ['']
    
    for digit in digits:
        new_result = []
        for combo in result:
            for letter in mapping[digit]:
                new_result.append(combo + letter)
        result = new_result
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `"23"`

**Mapping:** 2 → "abc", 3 → "def"

**Backtracking:**

| idx | current | Action |
|-----|---------|--------|
| 0 | [] | Try a,b,c |
| 1 | [a] | Try d,e,f |
| 2 | [a,d] | Found "ad" |
| 2 | [a,e] | Found "ae" |
| 2 | [a,f] | Found "af" |
| 1 | [b] | Try d,e,f |
| ... | ... | ... |

**Result:** `["ad","ae","af","bd","be","bf","cd","ce","cf"]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(4^N × N)
At most 4 letters per digit, N digits. Each combination takes O(N) to build.

### Space Complexity: O(N)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"What if we want words from dictionary only?"**
   → Filter results against dictionary, or use Trie during backtracking.

2. **"Most likely word?"**
   → Add frequency data; use Trie with weights.

3. **"T9 predictive text?"**
   → Given prefix, return matching dictionary words.
