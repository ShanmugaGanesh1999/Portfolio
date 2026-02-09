# 📚 Stack Data Structure

## 🎯 What is a Stack?

A **Stack** is a linear data structure that follows the **Last-In-First-Out (LIFO)** principle. Think of it like a stack of plates - you can only add or remove from the top.

---

## 🧠 Core Operations

```
        ┌─────────┐
        │    4    │  ← Top (most recent)
        ├─────────┤
        │    3    │
        ├─────────┤
        │    2    │
        ├─────────┤
        │    1    │  ← Bottom (oldest)
        └─────────┘
        
Push(5): Add to top
Pop():   Remove from top (returns 4)
Peek():  Look at top (returns 4, doesn't remove)
```

---

## ⚡ Time Complexities

| Operation | Time | Space |
|-----------|------|-------|
| Push | O(1) | O(1) |
| Pop | O(1) | O(1) |
| Peek/Top | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
| Search | O(n) | O(1) |

---

## 🐍 Stack in Python

### Using List (Recommended)

```python
# Python list works perfectly as a stack
stack = []

# Push
stack.append(1)
stack.append(2)
stack.append(3)
print(stack)  # [1, 2, 3]

# Pop
top = stack.pop()  # Returns 3
print(stack)  # [1, 2]

# Peek
top = stack[-1]  # 2 (doesn't remove)

# isEmpty
is_empty = len(stack) == 0  # or: not stack

# Size
size = len(stack)
```

### Using collections.deque

```python
from collections import deque

stack = deque()

stack.append(1)  # Push
stack.append(2)
top = stack.pop()  # Pop
top = stack[-1]   # Peek
```

**Note:** For pure stack operations, `list` and `deque` have similar performance. Use `deque` when you also need efficient operations at both ends.

---

## 🔥 Common Stack Patterns

### 1. Parentheses Matching

```python
def is_valid_parentheses(s: str) -> bool:
    """
    Check if parentheses are balanced.
    
    Pattern: Push opening brackets, pop and match for closing.
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            # Closing bracket
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            # Opening bracket
            stack.append(char)
    
    return len(stack) == 0
```

### 2. Reverse String/List

```python
def reverse_string(s: str) -> str:
    """Use stack to reverse."""
    stack = list(s)
    result = []
    
    while stack:
        result.append(stack.pop())
    
    return ''.join(result)
```

### 3. Function Call Stack (Recursion)

Every recursive function uses an implicit stack:

```python
def factorial(n):
    """
    Call stack:
    factorial(5) → factorial(4) → factorial(3) → ... → factorial(1)
                                                             ↓
                                    5 * 4 * 3 * 2 * 1 = 120 ←┘
    """
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

### 4. Expression Evaluation

```python
def evaluate_postfix(tokens: list) -> int:
    """
    Evaluate postfix expression (Reverse Polish Notation).
    
    Example: ["2", "3", "+", "4", "*"] = (2+3)*4 = 20
    """
    stack = []
    
    for token in tokens:
        if token in '+-*/':
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(int(a / b))  # Truncate toward zero
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

## 🎯 Monotonic Stack Pattern

A **Monotonic Stack** maintains elements in sorted order (increasing or decreasing). It's powerful for "next greater/smaller element" problems.

### Next Greater Element

```python
def next_greater_element(nums: list) -> list:
    """
    Find next greater element for each position.
    
    Example:
    nums = [2, 1, 2, 4, 3]
    output = [4, 2, 4, -1, -1]
    
    Intuition:
    - Use decreasing monotonic stack
    - When we find a larger element, it's the "next greater" 
      for all smaller elements in stack
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # Stack of indices
    
    for i in range(n):
        # Pop elements smaller than current
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        
        stack.append(i)
    
    return result
```

### Daily Temperatures (LC 739)

```python
def daily_temperatures(temperatures: list) -> list:
    """
    Find days until warmer temperature.
    
    Classic monotonic stack problem!
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices
    
    for i in range(n):
        # Pop indices with lower temperature
        while stack and temperatures[stack[-1]] < temperatures[i]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        
        stack.append(i)
    
    return result
```

---

## 📚 Classic Stack Problems

| Problem | Pattern | Difficulty |
|---------|---------|------------|
| Valid Parentheses (LC 20) | Matching | Easy |
| Min Stack (LC 155) | Auxiliary stack | Medium |
| Daily Temperatures (LC 739) | Monotonic stack | Medium |
| Basic Calculator (LC 224) | Expression parsing | Hard |
| Largest Rectangle in Histogram (LC 84) | Monotonic stack | Hard |
| Trapping Rain Water (LC 42) | Two stacks | Hard |
| Remove K Digits (LC 402) | Monotonic stack | Medium |
| Decode String (LC 394) | Nested processing | Medium |

---

## 📝 Key Takeaways

1. **Stack = LIFO** - last in, first out
2. **O(1) operations** for push, pop, peek
3. **Use for**: matching pairs, reversing, expression evaluation
4. **Monotonic stack** solves "next greater/smaller" problems
5. **Python list** works great as a stack
