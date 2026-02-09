# Happy Number

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 202 | Math + Cycle Detection |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Sum of squares of digits repeatedly. Happy if reaches 1.

### Constraints & Clarifying Questions
1. **Positive integer?** Yes.
2. **Infinite loop if not happy?** Yes, cycle forms.
3. **1 is happy?** Yes.
4. **Leading zeros?** N/A, it's an integer.

### Edge Cases
1. **n = 1:** True
2. **n = 7:** True (known happy number)
3. **n = 2:** False (cycles)

---

## Phase 2: High-Level Approach

### Approach: Floyd's Cycle Detection
Two pointers: slow (1 step), fast (2 steps).
If cycle exists, they meet. If reaches 1, happy.

**Core Insight:** Either reaches 1 or cycles; use tortoise-hare.

---

## Phase 3: Python Code

```python
def solve(n: int) -> bool:
    """
    Check if n is a happy number.
    
    Args:
        n: Positive integer
    
    Returns:
        True if happy
    """
    def get_next(num: int) -> int:
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1


def solve_hashset(n: int) -> bool:
    """
    Using hashset to detect cycle.
    """
    def get_next(num: int) -> int:
        return sum(int(d) ** 2 for d in str(num))
    
    seen = set()
    
    while n != 1 and n not in seen:
        seen.add(n)
        n = get_next(n)
    
    return n == 1


def solve_known_cycle(n: int) -> bool:
    """
    Using known cycle endpoint (4).
    All unhappy numbers eventually reach 4.
    """
    def get_next(num: int) -> int:
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    while n != 1 and n != 4:
        n = get_next(n)
    
    return n == 1


def solve_recursive(n: int, seen: set = None) -> bool:
    """
    Recursive approach.
    """
    if seen is None:
        seen = set()
    
    if n == 1:
        return True
    if n in seen:
        return False
    
    seen.add(n)
    next_n = sum(int(d) ** 2 for d in str(n))
    
    return solve_recursive(next_n, seen)
```

---

## Phase 4: Dry Run

**Input:** n = 19

| Step | n | Sum of squares |
|------|---|----------------|
| 0 | 19 | 1² + 9² = 82 |
| 1 | 82 | 8² + 2² = 68 |
| 2 | 68 | 6² + 8² = 100 |
| 3 | 100 | 1² + 0² + 0² = 1 |

**Reached 1!**

**Result:** True

**Input:** n = 2

| Step | n | Sum |
|------|---|-----|
| 0 | 2 | 4 |
| 1 | 4 | 16 |
| 2 | 16 | 37 |
| 3 | 37 | 58 |
| 4 | 58 | 89 |
| 5 | 89 | 145 |
| 6 | 145 | 42 |
| 7 | 42 | 20 |
| 8 | 20 | 4 ← Cycle! |

**Result:** False

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Digits reduce logarithmically.

### Space Complexity: O(1)
Floyd's cycle detection uses constant space.

---

## Phase 6: Follow-Up Questions

1. **"Sum of cubes instead?"**
   → Same cycle detection; different transformation.

2. **"Count steps to reach 1 or cycle?"**
   → Track iterations until termination.

3. **"Find all happy numbers up to n?"**
   → Sieve-like approach with memoization.
