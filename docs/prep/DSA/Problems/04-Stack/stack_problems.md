# 📚 Stack - Complete Problem Set

## Problem 1: Baseball Game (Easy)
**LeetCode 682**

### Problem
Calculate sum of scores with operations: number adds to record, "+" adds sum of last two, "D" doubles last, "C" removes last.

### Intuition
Stack naturally handles "last" operations. Push scores, process operations.

### Solution
```python
def calPoints(operations: list[str]) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    stack = []
    
    for op in operations:
        if op == "+":
            stack.append(stack[-1] + stack[-2])
        elif op == "D":
            stack.append(stack[-1] * 2)
        elif op == "C":
            stack.pop()
        else:
            stack.append(int(op))
    
    return sum(stack)
```

---

## Problem 2: Valid Parentheses (Easy)
**LeetCode 20**

### Problem
Check if string has valid matching parentheses.

### Intuition
Push opening brackets, pop and match for closing brackets.

### Solution
```python
def isValid(s: str) -> bool:
    """
    Time: O(n)
    Space: O(n)
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

---

## Problem 3: Implement Stack Using Queues (Easy)
**LeetCode 225**

### Problem
Implement stack using only queue operations.

### Intuition
After each push, rotate queue to bring new element to front.

### Solution
```python
from collections import deque

class MyStack:
    """
    Push: O(n), Pop: O(1)
    Space: O(n)
    """
    def __init__(self):
        self.queue = deque()
    
    def push(self, x: int) -> None:
        self.queue.append(x)
        # Rotate to bring new element to front
        for _ in range(len(self.queue) - 1):
            self.queue.append(self.queue.popleft())
    
    def pop(self) -> int:
        return self.queue.popleft()
    
    def top(self) -> int:
        return self.queue[0]
    
    def empty(self) -> bool:
        return len(self.queue) == 0
```

---

## Problem 4: Min Stack (Medium)
**LeetCode 155**

### Problem
Design stack supporting push, pop, top, getMin in O(1).

### Intuition
Store (value, min_so_far) pairs. Each entry knows minimum up to that point.

### Solution
```python
class MinStack:
    """
    All operations: O(1)
    Space: O(n)
    """
    def __init__(self):
        self.stack = []  # (value, current_min)
    
    def push(self, val: int) -> None:
        if not self.stack:
            self.stack.append((val, val))
        else:
            current_min = min(val, self.stack[-1][1])
            self.stack.append((val, current_min))
    
    def pop(self) -> None:
        self.stack.pop()
    
    def top(self) -> int:
        return self.stack[-1][0]
    
    def getMin(self) -> int:
        return self.stack[-1][1]
```

---

## Problem 5: Evaluate Reverse Polish Notation (Medium)
**LeetCode 150**

### Problem
Evaluate expression in Reverse Polish Notation (postfix).

### Intuition
Push numbers, pop two operands when operator encountered.

### Solution
```python
def evalRPN(tokens: list[str]) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    stack = []
    operators = {'+', '-', '*', '/'}
    
    for token in tokens:
        if token in operators:
            b = stack.pop()  # Second operand
            a = stack.pop()  # First operand
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:  # Division truncates toward zero
                stack.append(int(a / b))
        else:
            stack.append(int(token))
    
    return stack[0]
```

---

## Problem 6: Generate Parentheses (Medium)
**LeetCode 22**

### Problem
Generate all valid combinations of n pairs of parentheses.

### Intuition
Backtracking with constraints: can add '(' if open < n, can add ')' if close < open.

### Solution
```python
def generateParenthesis(n: int) -> list[str]:
    """
    Time: O(4^n / √n) - Catalan number
    Space: O(n) for recursion
    """
    result = []
    
    def backtrack(current: str, open_count: int, close_count: int):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result
```

---

## Problem 7: Asteroid Collision (Medium)
**LeetCode 735**

### Problem
Asteroids moving right (+) or left (-). When collide, smaller explodes.

### Intuition
Stack for right-moving. Left-moving collides with stack top.

### Solution
```python
def asteroidCollision(asteroids: list[int]) -> list[int]:
    """
    Time: O(n)
    Space: O(n)
    """
    stack = []
    
    for asteroid in asteroids:
        # Process collisions: asteroid moving left, stack top moving right
        while stack and asteroid < 0 < stack[-1]:
            if stack[-1] < -asteroid:
                # Stack top explodes
                stack.pop()
                continue
            elif stack[-1] == -asteroid:
                # Both explode
                stack.pop()
            break  # Current asteroid explodes or no more collisions
        else:
            # No collision or asteroid survived
            stack.append(asteroid)
    
    return stack
```

---

## Problem 8: Daily Temperatures (Medium)
**LeetCode 739**

### Problem
For each day, find how many days until warmer temperature.

### Intuition
Monotonic decreasing stack of indices. When warmer found, pop and calculate distance.

### Solution
```python
def dailyTemperatures(temperatures: list[int]) -> list[int]:
    """
    Time: O(n)
    Space: O(n)
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices
    
    for i in range(n):
        # Pop all temperatures smaller than current
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        
        stack.append(i)
    
    return result
```

---

## Problem 9: Online Stock Span (Medium)
**LeetCode 901**

### Problem
Find how many consecutive days (including today) price was ≤ today's price.

### Intuition
Monotonic decreasing stack of (price, span). Pop smaller prices and add their spans.

### Solution
```python
class StockSpanner:
    """
    next(): Amortized O(1)
    Space: O(n)
    """
    def __init__(self):
        self.stack = []  # (price, span)
    
    def next(self, price: int) -> int:
        span = 1
        
        # Pop all smaller or equal prices
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        
        self.stack.append((price, span))
        return span
```

---

## Problem 10: Car Fleet (Medium)
**LeetCode 853**

### Problem
Cars at positions with speeds going to target. How many fleets arrive?

### Intuition
Sort by position (reverse). Calculate time to reach target. If car behind catches up, they merge.

### Solution
```python
def carFleet(target: int, position: list[int], speed: list[int]) -> int:
    """
    Time: O(n log n)
    Space: O(n)
    """
    # Pair and sort by position (descending)
    cars = sorted(zip(position, speed), reverse=True)
    
    stack = []  # Stack of times to reach target
    
    for pos, spd in cars:
        time = (target - pos) / spd
        
        # If this car takes longer than car ahead, new fleet
        if not stack or time > stack[-1]:
            stack.append(time)
        # Otherwise, catches up and merges (don't push)
    
    return len(stack)
```

---

## Problem 11: Remove K Digits (Medium)
**LeetCode 402**

### Problem
Remove k digits from number to make smallest possible.

### Intuition
Monotonic increasing stack. Remove larger digits on left when smaller digit comes.

### Solution
```python
def removeKdigits(num: str, k: int) -> str:
    """
    Time: O(n)
    Space: O(n)
    """
    stack = []
    
    for digit in num:
        # Remove larger digits when smaller comes
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    
    # If k remaining, remove from end
    stack = stack[:-k] if k else stack
    
    # Remove leading zeros and handle empty
    return ''.join(stack).lstrip('0') or '0'
```

---

## Problem 12: Decode String (Medium)
**LeetCode 394**

### Problem
Decode "3[a2[c]]" -> "accaccacc"

### Intuition
Use stack to handle nested patterns. Push count and current string when '[' encountered.

### Solution
```python
def decodeString(s: str) -> str:
    """
    Time: O(n * max_k)
    Space: O(n)
    """
    stack = []
    current_str = ""
    current_num = 0
    
    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Save current state
            stack.append((current_str, current_num))
            current_str = ""
            current_num = 0
        elif char == ']':
            # Pop and construct
            prev_str, num = stack.pop()
            current_str = prev_str + current_str * num
        else:
            current_str += char
    
    return current_str
```

---

## Problem 13: Simplify Path (Medium)
**LeetCode 71**

### Problem
Simplify Unix-style absolute path.

### Intuition
Split by '/', use stack for directories. ".." pops, "." and "" skip.

### Solution
```python
def simplifyPath(path: str) -> str:
    """
    Time: O(n)
    Space: O(n)
    """
    stack = []
    
    for part in path.split('/'):
        if part == '..':
            if stack:
                stack.pop()
        elif part and part != '.':
            stack.append(part)
    
    return '/' + '/'.join(stack)
```

---

## Problem 14: Largest Rectangle In Histogram (Hard)
**LeetCode 84**

### Problem
Find largest rectangle that can be formed in histogram.

### Intuition
Monotonic increasing stack. When smaller bar found, calculate area with popped bar as height.

### Solution
```python
def largestRectangleArea(heights: list[int]) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    stack = []  # Stack of indices
    max_area = 0
    
    for i, h in enumerate(heights):
        start = i
        
        # Pop taller bars
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx  # New bar can extend back
        
        stack.append((start, h))
    
    # Process remaining in stack
    for idx, height in stack:
        max_area = max(max_area, height * (len(heights) - idx))
    
    return max_area
```

### Alternative (with sentinel):
```python
def largestRectangleArea_v2(heights: list[int]) -> int:
    """Add 0 at end to force processing all bars"""
    heights.append(0)
    stack = [-1]  # Sentinel
    max_area = 0
    
    for i, h in enumerate(heights):
        while stack[-1] != -1 and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    
    heights.pop()  # Restore
    return max_area
```

---

## 📊 Stack Summary

| Problem | Difficulty | Stack Type | Key Technique |
|---------|------------|------------|---------------|
| Baseball Game | Easy | Regular | Process operations |
| Valid Parentheses | Easy | Regular | Match brackets |
| Stack Using Queues | Easy | Regular | Rotate after push |
| Min Stack | Medium | Auxiliary | Store (val, min) pairs |
| Eval RPN | Medium | Regular | Push nums, pop for ops |
| Generate Parentheses | Medium | Implicit (backtrack) | Count open/close |
| Asteroid Collision | Medium | Regular | Right-moving asteroids |
| Daily Temperatures | Medium | Monotonic Decreasing | Next greater element |
| Stock Span | Medium | Monotonic Decreasing | Previous greater |
| Car Fleet | Medium | Monotonic | Time to reach target |
| Remove K Digits | Medium | Monotonic Increasing | Remove larger left digits |
| Decode String | Medium | Regular | Handle nested brackets |
| Simplify Path | Medium | Regular | Directory navigation |
| Largest Rectangle | Hard | Monotonic Increasing | Area with popped height |

### Pattern Recognition:

**Monotonic Increasing Stack:**
- Elements stay in increasing order
- Used for: next smaller element, histograms

**Monotonic Decreasing Stack:**
- Elements stay in decreasing order
- Used for: next greater element, daily temperatures

**Regular Stack:**
- Matching brackets, undo operations
- Expression evaluation
- Nested structures (parentheses, directories)
