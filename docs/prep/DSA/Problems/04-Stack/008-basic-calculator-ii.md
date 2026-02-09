# Basic Calculator II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 227 | Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Evaluate arithmetic expression with +, -, *, / without parentheses.

### Constraints & Clarifying Questions
1. **Operators?** +, -, *, / only.
2. **Parentheses?** No parentheses.
3. **Integer division?** Truncate toward zero.
4. **Spaces in input?** Yes, ignore them.
5. **Valid expression?** Yes, always valid.

### Edge Cases
1. **Single number:** `"42"` → 42
2. **Leading spaces:** `" 3+2"` → 5
3. **Division truncation:** `"14-3/2"` → 14-1=13

---

## Phase 2: High-Level Approach

### Approach: Stack with Operator Precedence
Process numbers with pending operator. Handle * and / immediately; push +/- terms to stack.

**Core Insight:** * and / have higher precedence; evaluate them immediately. + and - are evaluated at end by summing stack.

---

## Phase 3: Python Code

```python
def solve(s: str) -> int:
    """
    Evaluate arithmetic expression without parentheses.
    
    Args:
        s: Expression string with +, -, *, /
    
    Returns:
        Result of evaluation
    """
    stack = []
    current_num = 0
    operator = '+'  # Default operator for first number
    
    for i, char in enumerate(s):  # O(N)
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        
        # Process when we hit an operator or end of string
        if char in '+-*/' or i == len(s) - 1:
            if operator == '+':
                stack.append(current_num)
            elif operator == '-':
                stack.append(-current_num)
            elif operator == '*':
                stack.append(stack.pop() * current_num)
            elif operator == '/':
                # Truncate toward zero
                prev = stack.pop()
                stack.append(int(prev / current_num))
            
            operator = char
            current_num = 0
    
    return sum(stack)


def solve_no_stack(s: str) -> int:
    """
    O(1) space version tracking only last number.
    """
    result = 0      # Running sum of fully evaluated terms
    last_num = 0    # Last number (for * and / operations)
    current_num = 0
    operator = '+'
    
    for i, char in enumerate(s):
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        
        if char in '+-*/' or i == len(s) - 1:
            if operator == '+':
                result += last_num
                last_num = current_num
            elif operator == '-':
                result += last_num
                last_num = -current_num
            elif operator == '*':
                last_num *= current_num
            elif operator == '/':
                last_num = int(last_num / current_num)
            
            operator = char
            current_num = 0
    
    return result + last_num
```

---

## Phase 4: Dry Run

**Input:** `s = "3+2*2"`

| i | char | current_num | operator | Stack | Action |
|---|------|-------------|----------|-------|--------|
| 0 | '3' | 3 | + | [] | build number |
| 1 | '+' | 0 | + | [3] | push 3, op='+' |
| 2 | '2' | 2 | + | [3] | build number |
| 3 | '*' | 0 | * | [3, 2] | push 2, op='*' |
| 4 | '2' | 2 | * | [3, 2] | build number |
| end | - | 2 | * | [3, 4] | pop 2, push 2*2=4 |

**Result:** sum([3, 4]) = `7`

**Input:** `s = "3/2"`
- 3 / 2 = 1 (truncate toward zero)

**Input:** `s = "3+5/2"`
- 5 / 2 = 2, then 3 + 2 = 5

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through string.

### Space Complexity: O(N)
- Stack version: O(N) for terms.
- Optimized version: O(1).

---

## Phase 6: Follow-Up Questions

1. **"What about Basic Calculator I (with parentheses)?"**
   → Use recursion or additional stack for nested expressions.

2. **"How to handle negative numbers?"**
   → Treat leading minus as "0 - num"; or parse carefully.

3. **"What about exponentiation (^)?"**
   → Higher precedence than */; process before them; handle right associativity.
