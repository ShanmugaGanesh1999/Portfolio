# Online Stock Span

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 901 | Monotonic Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design class that returns span of stock's price for current day. Span = max consecutive days (including today) where price ≤ today's price.

### Constraints & Clarifying Questions
1. **Consecutive days looking backward?** Yes.
2. **Include current day?** Yes, minimum span is 1.
3. **First day's span?** Always 1.
4. **Called once per day?** Yes, prices come as stream.
5. **Price range?** 1 to 10^5.

### Edge Cases
1. **Increasing prices:** Each day's span is 1.
2. **Decreasing prices:** Spans grow each day.
3. **All same price:** Spans are 1, 2, 3, ...

---

## Phase 2: High-Level Approach

### Approach: Monotonic Stack with Spans
Stack stores (price, span) pairs. Pop smaller prices and accumulate their spans.

**Core Insight:** When price is greater than previous prices, we can include their spans in our span.

---

## Phase 3: Python Code

```python
class StockSpanner:
    """
    Calculate stock price spans in O(1) amortized time.
    """
    
    def __init__(self):
        """Initialize empty span calculator."""
        self.stack = []  # Stack of (price, span) tuples
    
    def next(self, price: int) -> int:
        """
        Calculate span for today's price.
        
        Args:
            price: Today's stock price
        
        Returns:
            Number of consecutive days with price <= today
        """
        span = 1  # At minimum, today counts
        
        # Pop smaller prices and accumulate their spans
        while self.stack and self.stack[-1][0] <= price:
            _, prev_span = self.stack.pop()
            span += prev_span
        
        self.stack.append((price, span))
        return span


class StockSpannerWithIndex:
    """
    Alternative using indices instead of spans.
    """
    
    def __init__(self):
        self.stack = []  # Stack of (price, index)
        self.day = 0
    
    def next(self, price: int) -> int:
        # Pop smaller prices
        while self.stack and self.stack[-1][0] <= price:
            self.stack.pop()
        
        # Span = distance to previous larger price (or all days if none)
        span = self.day - self.stack[-1][1] if self.stack else self.day + 1
        
        self.stack.append((price, self.day))
        self.day += 1
        
        return span
```

---

## Phase 4: Dry Run

**Operations:** next(100), next(80), next(60), next(70), next(60), next(75), next(85)

| Call | Price | Stack before | Span | Stack after |
|------|-------|--------------|------|-------------|
| 1 | 100 | [] | 1 | [(100,1)] |
| 2 | 80 | [(100,1)] | 1 | [(100,1),(80,1)] |
| 3 | 60 | [(100,1),(80,1)] | 1 | [(100,1),(80,1),(60,1)] |
| 4 | 70 | [(100,1),(80,1),(60,1)] | 2 | [(100,1),(80,1),(70,2)] |
| 5 | 60 | [(100,1),(80,1),(70,2)] | 1 | [(100,1),(80,1),(70,2),(60,1)] |
| 6 | 75 | [(100,1),(80,1),(70,2),(60,1)] | 4 | [(100,1),(80,1),(75,4)] |
| 7 | 85 | [(100,1),(80,1),(75,4)] | 6 | [(100,1),(85,6)] |

**Results:** `[1, 1, 1, 2, 1, 4, 6]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1) amortized per call
- Each price pushed once and popped at most once.
- Over N calls, total operations ≤ 2N.

### Space Complexity: O(N)
- Stack may hold all prices (strictly increasing sequence).

---

## Phase 6: Follow-Up Questions

1. **"What if we need span looking forward instead?"**
   → Process all prices first; use same monotonic stack but from right to left.

2. **"Memory-bounded version with sliding window?"**
   → Track only last K days; more complex with deque.

3. **"What about finding previous greater price?"**
   → Stack already maintains this; previous greater is stack[-1] before pushing.
