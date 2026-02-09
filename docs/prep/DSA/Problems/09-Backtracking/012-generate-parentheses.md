# Generate Parentheses

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 22 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Generate all valid combinations of n pairs of parentheses.

### Constraints & Clarifying Questions
1. **n = 0?** Return `[""]` or `[]`.
2. **Order of result?** Any order.
3. **Valid definition?** Every prefix has ≥ open than close.
4. **n range?** 1-8 typically.

### Edge Cases
1. **n = 1:** `["()"]`
2. **n = 0:** Edge case handling
3. **n = 2:** `["(())", "()()"]`

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Constraints
Add '(' if open < n. Add ')' if close < open.

**Core Insight:** Can always add '(' if have remaining; can only add ')' if it won't invalidate.

---

## Phase 3: Python Code

```python
from typing import List


def solve(n: int) -> List[str]:
    """
    Generate all valid parentheses combinations.
    
    Args:
        n: Number of pairs
    
    Returns:
        All valid combinations
    """
    result = []
    
    def backtrack(current: List[str], open_count: int, close_count: int):
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        
        # Can add '(' if we haven't used all
        if open_count < n:
            current.append('(')
            backtrack(current, open_count + 1, close_count)
            current.pop()
        
        # Can add ')' if it won't make invalid
        if close_count < open_count:
            current.append(')')
            backtrack(current, open_count, close_count + 1)
            current.pop()
    
    backtrack([], 0, 0)
    return result


def solve_string(n: int) -> List[str]:
    """
    Using string concatenation (simpler, slightly slower).
    """
    result = []
    
    def backtrack(s: str, open_count: int, close_count: int):
        if len(s) == 2 * n:
            result.append(s)
            return
        
        if open_count < n:
            backtrack(s + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(s + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result
```

---

## Phase 4: Dry Run

**Input:** `n = 3`

**Backtracking Tree:**
```
                  ""
                  |
                 "("
               /     \
            "(("      "()"
           /    \        \
         "((("  "(()"    "()("
           |      |  \      \
        "((()" "(()(""(())" "()(("
           |      |    |       \
       "((())" "(()()""(())(""()(()""()(()"
           |      |    |       \      \
       "((()))" "(()())""(())()""()(())""()()()"
```

**Result:** `["((()))", "(()())", "(())()", "()(())", "()()()"]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(4^N / √N)
Catalan number of valid sequences.

### Space Complexity: O(N)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"Different bracket types?"**
   → Track each type separately; ensure proper nesting.

2. **"Check if valid?"**
   → Counter: increment for '(', decrement for ')'; never negative, end at 0.

3. **"kth valid combination?"**
   → Count combinations in left subtree; binary search approach.
