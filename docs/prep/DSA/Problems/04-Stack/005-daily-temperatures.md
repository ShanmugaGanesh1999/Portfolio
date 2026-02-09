# Daily Temperatures

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 739 | Monotonic Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
For each day, find how many days until warmer temperature. Return 0 if no warmer day exists.

### Constraints & Clarifying Questions
1. **Temperature range?** 30 to 100.
2. **Array length?** 1 to 10^5.
3. **No warmer day?** Return 0 for that position.
4. **Must be strictly warmer?** Yes, not equal.
5. **Looking forward only?** Yes.

### Edge Cases
1. **Decreasing temps:** `[100, 90, 80]` → [0, 0, 0]
2. **Increasing temps:** `[70, 71, 72]` → [1, 1, 0]
3. **Single day:** `[50]` → [0]

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Nested Loops)
For each day, scan forward for warmer day.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Monotonic Stack)
Process from right to left; maintain stack of indices with decreasing temperatures.

**Core Insight:** Stack keeps potential "next warmer" candidates; pop smaller/equal temps as they're no longer useful.

---

## Phase 3: Python Code

```python
def solve(temperatures: list[int]) -> list[int]:
    """
    Find days until warmer temperature for each day.
    
    Args:
        temperatures: Daily temperatures
    
    Returns:
        Array where result[i] = days until warmer temp (0 if none)
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices (temps in decreasing order)
    
    for i in range(n - 1, -1, -1):  # O(N) - right to left
        temp = temperatures[i]
        
        # Pop indices with temp <= current (not useful)
        while stack and temperatures[stack[-1]] <= temp:
            stack.pop()  # O(1) amortized
        
        # If stack not empty, top is next warmer day
        if stack:
            result[i] = stack[-1] - i
        
        # Push current index
        stack.append(i)
    
    return result


def solve_left_to_right(temperatures: list[int]) -> list[int]:
    """
    Alternative: Process left to right, resolve when warmer found.
    """
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices waiting for warmer day
    
    for i in range(n):
        temp = temperatures[i]
        
        # Resolve all days where current is warmer
        while stack and temperatures[stack[-1]] < temp:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day
        
        stack.append(i)
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`

**Right-to-left approach:**

| i | temp | stack (indices) | stack temps | result[i] |
|---|------|-----------------|-------------|-----------|
| 7 | 73 | [7] | [73] | 0 |
| 6 | 76 | [6] | [76] | 0 |
| 5 | 72 | [6, 5] | [76, 72] | 6-5=1 |
| 4 | 69 | [6, 5, 4] | [76, 72, 69] | 5-4=1 |
| 3 | 71 | [6, 5, 3] | [76, 72, 71] | 5-3=2 |
| 2 | 75 | [6, 2] | [76, 75] | 6-2=4 |
| 1 | 74 | [6, 2, 1] | [76, 75, 74] | 2-1=1 |
| 0 | 73 | [6, 2, 1, 0] | [76, 75, 74, 73] | 1-0=1 |

**Result:** `[1, 1, 4, 2, 1, 1, 0, 0]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each index pushed and popped at most once.
- Amortized O(1) per element.

### Space Complexity: O(N)
- Stack may hold all indices (strictly decreasing sequence).

---

## Phase 6: Follow-Up Questions

1. **"What if we need days until colder temperature?"**
   → Same approach but pop when stack top >= current temp.

2. **"What if temperatures are streaming?"**
   → Left-to-right approach works; can't give final answer until stream ends for pending days.

3. **"What about circular array (wrap around)?"**
   → Process array twice (2N iterations) using modulo indexing.
