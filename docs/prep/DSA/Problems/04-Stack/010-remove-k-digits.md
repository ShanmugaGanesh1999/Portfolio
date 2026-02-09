# Remove K Digits

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 402 | Monotonic Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Remove k digits from number string to get smallest possible number.

### Constraints & Clarifying Questions
1. **Leading zeros after removal?** Strip them.
2. **k can equal length?** Yes, return "0".
3. **Empty result?** Return "0".
4. **String contains only digits?** Yes.
5. **Input has no leading zeros?** Correct.

### Edge Cases
1. **Remove all:** `num = "123", k = 3` → "0"
2. **Decreasing digits:** `num = "987", k = 1` → "87"
3. **Leading zeros:** `num = "10200", k = 1` → "200"

---

## Phase 2: High-Level Approach

### Approach: Monotonic Stack (Greedy)
Maintain increasing stack; remove larger digits when smaller digit encountered.

**Core Insight:** A digit should be removed if a smaller digit follows it (greedy: smaller leftmost digit is better).

---

## Phase 3: Python Code

```python
def solve(num: str, k: int) -> str:
    """
    Remove k digits to get smallest number.
    
    Args:
        num: Number as string
        k: Number of digits to remove
    
    Returns:
        Smallest number after removal
    """
    stack = []  # Monotonically increasing stack
    
    for digit in num:  # O(N)
        # Remove larger digits when smaller digit found
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    
    # If k still > 0, remove from end (digits are increasing)
    while k > 0:
        stack.pop()
        k -= 1
    
    # Build result, strip leading zeros
    result = ''.join(stack).lstrip('0')
    
    return result if result else "0"


def solve_verbose(num: str, k: int) -> str:
    """
    More explicit version with comments.
    """
    stack = []
    to_remove = k
    
    for digit in num:
        # Greedily remove larger preceding digits
        while to_remove > 0 and stack and stack[-1] > digit:
            stack.pop()
            to_remove -= 1
        stack.append(digit)
    
    # Remove remaining digits from right
    final_stack = stack[:len(stack) - to_remove] if to_remove > 0 else stack
    
    # Handle leading zeros and empty result
    result = ''.join(final_stack).lstrip('0')
    return result or "0"
```

---

## Phase 4: Dry Run

**Input:** `num = "1432219", k = 3`

| i | digit | Stack | k | Action |
|---|-------|-------|---|--------|
| 0 | '1' | ['1'] | 3 | push |
| 1 | '4' | ['1','4'] | 3 | push (4 > 1) |
| 2 | '3' | ['1','3'] | 2 | pop 4, push 3 |
| 3 | '2' | ['1','2'] | 1 | pop 3, push 2 |
| 4 | '2' | ['1','2','2'] | 1 | push (2 = 2) |
| 5 | '1' | ['1','2','1'] | 0 | pop 2, push 1, k=0 |
| 6 | '9' | ['1','2','1','9'] | 0 | push (k=0) |

**Stack:** `['1','2','1','9']` → `"1219"`

**Result:** `"1219"`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each digit pushed and popped at most once.

### Space Complexity: O(N)
- Stack stores remaining digits.

---

## Phase 6: Follow-Up Questions

1. **"What if we want largest number?"**
   → Reverse logic: pop when smaller digit found (maintain decreasing stack).

2. **"What if digits can repeat infinitely (streaming)?"**
   → Need different approach; rolling window or segment trees.

3. **"What about negative numbers?"**
   → For magnitude, same logic; for value, removing digits makes it larger (less negative).
