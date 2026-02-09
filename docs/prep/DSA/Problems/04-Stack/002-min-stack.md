# Min Stack

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 155 | Stack Design |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design stack supporting push, pop, top, and getMin all in O(1) time.

### Constraints & Clarifying Questions
1. **Can we call pop/top/getMin on empty stack?** No, guaranteed valid calls.
2. **What values can be pushed?** -2^31 to 2^31 - 1.
3. **How many operations?** Up to 3 × 10^4.
4. **Must all operations be O(1)?** Yes, including getMin.
5. **Can values be duplicated?** Yes.

### Edge Cases
1. **Single element:** Push, then getMin returns that element.
2. **Duplicate minimums:** Multiple same minimum values.
3. **Decreasing sequence:** Each new element becomes minimum.

---

## Phase 2: High-Level Approach

### Option 1: Two Stacks
Main stack for values; auxiliary stack for minimums.
- **Time:** O(1) all operations
- **Space:** O(N)

### Option 2: Single Stack with Pairs
Store (value, current_min) pairs.
- **Time:** O(1) all operations
- **Space:** O(N)

**Core Insight:** Track minimum at each stack state; when we pop, we know the previous minimum.

---

## Phase 3: Python Code

```python
class MinStack:
    """
    Stack with O(1) push, pop, top, and getMin operations.
    Uses auxiliary stack to track minimums.
    """
    
    def __init__(self):
        """Initialize empty stack."""
        self.stack = []      # Main stack
        self.min_stack = []  # Parallel stack tracking minimums
    
    def push(self, val: int) -> None:
        """
        Push value onto stack. O(1)
        
        Args:
            val: Value to push
        """
        self.stack.append(val)
        
        # Push current minimum (min of val and previous min)
        current_min = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(current_min)
    
    def pop(self) -> None:
        """Remove top element. O(1)"""
        self.stack.pop()
        self.min_stack.pop()
    
    def top(self) -> int:
        """Return top element without removing. O(1)"""
        return self.stack[-1]
    
    def getMin(self) -> int:
        """Return minimum element in stack. O(1)"""
        return self.min_stack[-1]


class MinStackOptimized:
    """
    Space-optimized: Only store min when it changes.
    """
    
    def __init__(self):
        self.stack = []
        self.min_stack = []  # Only stores when new minimum found
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        
        # Only push to min_stack if new minimum (or equal)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        val = self.stack.pop()
        
        # Only pop from min_stack if we're removing current minimum
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]
```

---

## Phase 4: Dry Run

**Operations:** push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()

| Operation | stack | min_stack | Return |
|-----------|-------|-----------|--------|
| push(-2) | [-2] | [-2] | - |
| push(0) | [-2, 0] | [-2, -2] | - |
| push(-3) | [-2, 0, -3] | [-2, -2, -3] | - |
| getMin() | [-2, 0, -3] | [-2, -2, -3] | -3 |
| pop() | [-2, 0] | [-2, -2] | - |
| top() | [-2, 0] | [-2, -2] | 0 |
| getMin() | [-2, 0] | [-2, -2] | -2 |

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
All operations (push, pop, top, getMin) are O(1).

### Space Complexity: O(N)
- Two stacks approach: 2N space.
- Optimized: Between N and 2N depending on value distribution.

---

## Phase 6: Follow-Up Questions

1. **"How to implement getMax too?"**
   → Add third stack for maximums; same logic.

2. **"Can we reduce space to O(1) extra?"**
   → Store encoded values (val, min encoded together); complex math manipulation.

3. **"What about thread safety?"**
   → Add locks around operations; use atomic operations or concurrent data structures.
