# Generate Parentheses

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 22 | Stack / Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Generate all valid combinations of n pairs of parentheses.

### Constraints & Clarifying Questions
1. **What's valid?** Every open paren has matching close in correct order.
2. **n range?** 1 to 8.
3. **Output order?** Any order acceptable.
4. **Need unique combinations?** Yes, all combinations are inherently unique.
5. **Only one type of bracket?** Yes, `()` only.

### Edge Cases
1. **n = 1:** `["()"]`
2. **n = 0:** `[""]` or `[]` depending on interpretation

---

## Phase 2: High-Level Approach

### Option 1: Backtracking
Build string character by character; prune invalid states.

**Core Insight:** 
- Can add `(` if open_count < n
- Can add `)` if close_count < open_count

### Why This Works?
Constraints ensure we never have more close than open at any point.

---

## Phase 3: Python Code

```python
def solve(n: int) -> list[str]:
    """
    Generate all valid combinations of n pairs of parentheses.
    
    Args:
        n: Number of pairs
    
    Returns:
        List of all valid parentheses strings
    """
    result = []
    
    def backtrack(current: str, open_count: int, close_count: int):
        """
        Build valid parentheses string using backtracking.
        
        Args:
            current: Current string being built
            open_count: Number of '(' used
            close_count: Number of ')' used
        """
        # Base case: complete valid string
        if len(current) == 2 * n:
            result.append(current)
            return
        
        # Can add '(' if we haven't used all n
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        # Can add ')' if it won't exceed open count
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result


def solve_iterative(n: int) -> list[str]:
    """
    Iterative approach using explicit stack.
    """
    result = []
    stack = [('', 0, 0)]  # (current_string, open_count, close_count)
    
    while stack:
        current, open_count, close_count = stack.pop()
        
        if len(current) == 2 * n:
            result.append(current)
            continue
        
        if open_count < n:
            stack.append((current + '(', open_count + 1, close_count))
        
        if close_count < open_count:
            stack.append((current + ')', open_count, close_count + 1))
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `n = 2`

```
backtrack("", 0, 0)
├── backtrack("(", 1, 0)
│   ├── backtrack("((", 2, 0)
│   │   └── backtrack("(()", 2, 1)
│   │       └── backtrack("(())", 2, 2) ✓ ADD
│   └── backtrack("()", 1, 1)
│       └── backtrack("()(", 2, 1)
│           └── backtrack("()()", 2, 2) ✓ ADD
```

**Result:** `["(())", "()()"]`

**For n = 3:**
```
["((()))", "(()())", "(())()", "()(())", "()()()"]
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(4^N / √N)
- Nth Catalan number Cn = (2n)! / ((n+1)! × n!)
- Each valid sequence has length 2n, so total work is O(n × Cn)
- Catalan numbers grow as O(4^n / n^(3/2))

### Space Complexity: O(N)
- Recursion depth is 2n (length of string).
- Not counting output space.

---

## Phase 6: Follow-Up Questions

1. **"How many valid combinations for n pairs?"**
   → Nth Catalan number: C(2n,n)/(n+1). For n=3: 5, n=4: 14, n=5: 42.

2. **"What if we have multiple bracket types?"**
   → Track counts for each type; ensure proper nesting (can't close `]` if `(` is open).

3. **"How to generate combinations lazily (iterator)?"**
   → Use generator with `yield`; stack-based approach with lazy evaluation.
