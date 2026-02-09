# Valid Parenthesis String

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 678 | Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if string with '(', ')', '*' can be valid. '*' can be '(', ')' or empty.

### Constraints & Clarifying Questions
1. **'*' can be empty?** Yes.
2. **Multiple '*'?** Yes.
3. **Empty string?** Valid.
4. **Only '*'?** Valid (all empty).

### Edge Cases
1. **Empty:** True
2. **Only '*'s:** True
3. **"*)(":** True ('*' = empty)

---

## Phase 2: High-Level Approach

### Approach: Greedy - Track Range
Track [min_open, max_open] - range of possible open parentheses.
- '(' increases both
- ')' decreases both
- '*' increases max, decreases min

**Core Insight:** Track all possible states simultaneously.

---

## Phase 3: Python Code

```python
def solve(s: str) -> bool:
    """
    Check if parenthesis string with wildcards is valid.
    
    Args:
        s: String with '(', ')', '*'
    
    Returns:
        True if can be valid
    """
    min_open = 0  # Minimum possible open parens
    max_open = 0  # Maximum possible open parens
    
    for c in s:
        if c == '(':
            min_open += 1
            max_open += 1
        elif c == ')':
            min_open -= 1
            max_open -= 1
        else:  # '*'
            min_open -= 1  # If * = ')'
            max_open += 1  # If * = '('
        
        # Too many ')' even with all '*' as '('
        if max_open < 0:
            return False
        
        # Can't have negative open count
        min_open = max(min_open, 0)
    
    # Must be able to close all '('
    return min_open == 0


def solve_two_pass(s: str) -> bool:
    """
    Two-pass approach: left-to-right and right-to-left.
    """
    # Left to right: can we balance with '*' as '('?
    balance = 0
    for c in s:
        if c in '(*':
            balance += 1
        else:
            balance -= 1
        
        if balance < 0:
            return False
    
    # Right to left: can we balance with '*' as ')'?
    balance = 0
    for c in reversed(s):
        if c in ')*':
            balance += 1
        else:
            balance -= 1
        
        if balance < 0:
            return False
    
    return True


def solve_dp(s: str) -> bool:
    """
    DP approach (less efficient but clearer).
    """
    n = len(s)
    # dp[i][j] = True if s[i:] can be valid with j open parens
    memo = {}
    
    def dp(i: int, open_count: int) -> bool:
        if open_count < 0:
            return False
        if i == n:
            return open_count == 0
        if (i, open_count) in memo:
            return memo[(i, open_count)]
        
        if s[i] == '(':
            result = dp(i + 1, open_count + 1)
        elif s[i] == ')':
            result = dp(i + 1, open_count - 1)
        else:  # '*'
            result = (dp(i + 1, open_count + 1) or  # '('
                     dp(i + 1, open_count - 1) or   # ')'
                     dp(i + 1, open_count))         # empty
        
        memo[(i, open_count)] = result
        return result
    
    return dp(0, 0)
```

---

## Phase 4: Dry Run

**Input:** `"(*))"`

| i | c | min_open | max_open | After adjust |
|---|---|----------|----------|--------------|
| 0 | ( | 1 | 1 | - |
| 1 | * | 0 | 2 | min=max(0,0)=0 |
| 2 | ) | -1 | 1 | min=max(-1,0)=0 |
| 3 | ) | -1 | 0 | min=max(-1,0)=0 |

**Final:** min_open=0, max_open≥0 ✓

**Interpretation:** '(' + '*' as empty + ')' + ')' = "()" valid

Wait, that's only 2 chars. Let's re-verify:
- s = "(*))": '(' '*' ')' ')'
- '*' = ')' makes "(())": wait that's 4 chars
- Actually '*' can be '(' to make "(())" which needs one more ')'
- '*' can be empty: "()" + ')' + ')' = "()" + "))" invalid
- '*' can be ')': "()" + ")" + ")" = "()" + "))" invalid
- '*' can be '(': "((" + ")" + ")" = "(())" valid ✓

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Two variables.

---

## Phase 6: Follow-Up Questions

1. **"Return one valid assignment?"**
   → Backtrack with choices.

2. **"Count valid assignments?"**
   → DP counting.

3. **"Multiple wildcard types?"**
   → Extend range tracking.
