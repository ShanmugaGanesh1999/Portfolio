# Evaluate Reverse Polish Notation

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 150 | Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Evaluate arithmetic expression in Reverse Polish Notation (postfix).

### Constraints & Clarifying Questions
1. **Valid operators?** `+`, `-`, `*`, `/`.
2. **Division behavior?** Truncate toward zero.
3. **Is input always valid RPN?** Yes.
4. **Number range?** -200 to 200.
5. **Can operands be negative?** Yes.

### Edge Cases
1. **Single number:** `["42"]` → 42
2. **Negative numbers:** `["-1", "2", "+"]` → 1
3. **Division truncation:** `["7", "-3", "/"]` → -2 (truncate toward zero)

---

## Phase 2: High-Level Approach

### Approach: Stack-Based Evaluation
Process tokens left to right; push numbers, apply operators to top two elements.

**Core Insight:** RPN eliminates need for parentheses and precedence rules; stack naturally handles operand-operator relationships.

---

## Phase 3: Python Code

```python
def solve(tokens: list[str]) -> int:
    """
    Evaluate expression in Reverse Polish Notation.
    
    Args:
        tokens: List of numbers and operators in RPN order
    
    Returns:
        Result of expression evaluation
    """
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:  # O(N)
        if token in operators:
            # Pop two operands (note: order matters for - and /)
            b = stack.pop()  # Second operand (top)
            a = stack.pop()  # First operand
            
            if token == '+':
                result = a + b
            elif token == '-':
                result = a - b
            elif token == '*':
                result = a * b
            else:  # token == '/'
                # Truncate toward zero
                result = int(a / b)  # Python 3: use int() for truncation
            
            stack.append(result)
        else:
            # Number - push to stack
            stack.append(int(token))
    
    return stack[0]


def solve_lambda(tokens: list[str]) -> int:
    """
    Cleaner version using lambda functions.
    """
    stack = []
    ops = {
        '+': lambda a, b: a + b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b,
        '/': lambda a, b: int(a / b),  # Truncate toward zero
    }
    
    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(ops[token](a, b))
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

## Phase 4: Dry Run

**Input:** `tokens = ["2", "1", "+", "3", "*"]`
Infix equivalent: (2 + 1) * 3 = 9

| i | token | Action | Stack |
|---|-------|--------|-------|
| 0 | "2" | push 2 | [2] |
| 1 | "1" | push 1 | [2, 1] |
| 2 | "+" | pop 1,2; push 2+1=3 | [3] |
| 3 | "3" | push 3 | [3, 3] |
| 4 | "*" | pop 3,3; push 3*3=9 | [9] |

**Result:** `9`

**Input:** `tokens = ["10", "6", "9", "3", "/", "-11", "*", "/", "*", "17", "+", "5", "+"]`

| Step | Operation | Stack after |
|------|-----------|-------------|
| ... | 9 / 3 = 3 | [..., 3] |
| ... | 3 * -11 = -33 | [..., -33] |
| ... | 6 / -33 = 0 | [..., 0] |
| ... | 10 * 0 = 0 | [0] |
| ... | 0 + 17 = 17 | [17] |
| ... | 17 + 5 = 22 | [22] |

**Result:** `22`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through tokens; each operation is O(1).

### Space Complexity: O(N)
Stack may hold up to N/2 numbers (when all numbers come before operators).

---

## Phase 6: Follow-Up Questions

1. **"How to convert infix to RPN?"**
   → Use Shunting-yard algorithm with operator precedence and associativity.

2. **"What about exponentiation and other operators?"**
   → Add to operators map; handle right associativity for exponentiation.

3. **"How to detect invalid RPN?"**
   → Check stack has exactly 1 element at end; check for underflow on pop.
