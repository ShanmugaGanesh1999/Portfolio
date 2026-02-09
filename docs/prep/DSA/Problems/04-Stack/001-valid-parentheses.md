# Valid Parentheses

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 20 | Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if string of brackets has valid matching: every open bracket has corresponding close bracket in correct order.

### Constraints & Clarifying Questions
1. **Which bracket types?** `()`, `{}`, `[]`.
2. **Empty string?** Return True (vacuously valid).
3. **Only brackets in input?** Yes.
4. **Can brackets be nested?** Yes, `{[()]}` is valid.
5. **Maximum length?** Up to 10^4.

### Edge Cases
1. **Empty string:** `s = ""` → True
2. **Single bracket:** `s = "("` → False
3. **Wrong order:** `s = "(]"` → False

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Replace Pairs)
Repeatedly remove adjacent matching pairs until empty or stuck.
- **Time:** O(N²)
- **Space:** O(N)

### Option 2: Optimal (Stack)
Push open brackets; pop and match for close brackets.

**Core Insight:** Last opened bracket must be first closed (LIFO = Stack).

---

## Phase 3: Python Code

```python
def solve(s: str) -> bool:
    """
    Check if bracket string has valid matching.
    
    Args:
        s: String containing only brackets
    
    Returns:
        True if all brackets properly matched and nested
    """
    stack = []
    matching = {')': '(', '}': '{', ']': '['}
    
    for char in s:  # O(N)
        if char in matching:
            # Close bracket - must match last open
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()  # O(1)
        else:
            # Open bracket - push to stack
            stack.append(char)  # O(1)
    
    return len(stack) == 0  # All brackets matched


def solve_verbose(s: str) -> bool:
    """
    More explicit version with separate open/close sets.
    """
    open_brackets = {'(', '{', '['}
    close_to_open = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for char in s:
        if char in open_brackets:
            stack.append(char)
        elif char in close_to_open:
            if not stack:
                return False  # No matching open
            if stack.pop() != close_to_open[char]:
                return False  # Wrong bracket type
    
    return not stack
```

---

## Phase 4: Dry Run

**Input:** `s = "{[()]}"`

| i | char | Action | Stack |
|---|------|--------|-------|
| 0 | { | push | [{] |
| 1 | [ | push | [{, [] |
| 2 | ( | push | [{, [, (] |
| 3 | ) | pop ( ✓ | [{, [] |
| 4 | ] | pop [ ✓ | [{] |
| 5 | } | pop { ✓ | [] |

**Result:** Stack empty → `True`

**Input:** `s = "([)]"`

| i | char | Action | Stack |
|---|------|--------|-------|
| 0 | ( | push | [(] |
| 1 | [ | push | [(, [] |
| 2 | ) | pop, expect ( | stack[-1] = [ ≠ ( |

**Result:** `False`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through string.

### Space Complexity: O(N)
Stack may hold all characters (e.g., all open brackets).

---

## Phase 6: Follow-Up Questions

1. **"What if we have other characters between brackets?"**
   → Skip non-bracket characters in the loop.

2. **"What if we need to find first invalid position?"**
   → Return index instead of False; track position of mismatched bracket.

3. **"How to handle very long strings?"**
   → Streaming approach with stack; memory bounded by nesting depth, not string length.
