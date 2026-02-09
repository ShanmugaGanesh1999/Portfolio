# Koko Eating Bananas

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 875 | Binary Search on Answer |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum eating speed k to eat all bananas in h hours. Each hour, eat min(pile, k) from one pile.

### Constraints & Clarifying Questions
1. **One pile per hour max?** Yes, even if k > pile size.
2. **h >= number of piles?** Yes, guaranteed solvable.
3. **Minimum speed?** 1 banana per hour.
4. **Maximum speed needed?** max(piles).
5. **Eating from multiple piles in one hour?** No.

### Edge Cases
1. **h = piles length:** Must eat each pile in one hour, speed = max(piles).
2. **Single pile:** Speed = ceil(pile / h).
3. **Large h:** Can eat slowly, speed = 1 might work.

---

## Phase 2: High-Level Approach

### Approach: Binary Search on Speed
Search for minimum k in range [1, max(piles)] where total hours ≤ h.

**Core Insight:** If speed k works, any speed > k also works. Binary search finds minimum valid k.

---

## Phase 3: Python Code

```python
import math

def solve(piles: list[int], h: int) -> int:
    """
    Find minimum eating speed to finish in h hours.
    
    Args:
        piles: Banana counts per pile
        h: Hours available
    
    Returns:
        Minimum eating speed
    """
    def hours_needed(speed: int) -> int:
        """Calculate total hours to eat all piles at given speed."""
        return sum(math.ceil(pile / speed) for pile in piles)
    
    left, right = 1, max(piles)
    result = right
    
    while left <= right:  # O(log(max_pile))
        mid = left + (right - left) // 2
        
        if hours_needed(mid) <= h:  # O(N)
            result = mid  # Valid speed, try smaller
            right = mid - 1
        else:
            left = mid + 1  # Need faster speed
    
    return result


def solve_alternative(piles: list[int], h: int) -> int:
    """
    Without math.ceil - using integer division.
    """
    def hours_needed(speed: int) -> int:
        # ceil(a/b) = (a + b - 1) // b
        return sum((pile + speed - 1) // speed for pile in piles)
    
    left, right = 1, max(piles)
    
    while left < right:
        mid = left + (right - left) // 2
        
        if hours_needed(mid) <= h:
            right = mid  # Valid, but might find smaller
        else:
            left = mid + 1
    
    return left
```

---

## Phase 4: Dry Run

**Input:** `piles = [3, 6, 7, 11], h = 8`

| Speed | Hours needed | Calculation | Valid? |
|-------|--------------|-------------|--------|
| 1 | 27 | ceil(3/1)+ceil(6/1)+ceil(7/1)+ceil(11/1) | No |
| 4 | 10 | 1+2+2+3 = 8... wait recalc | Check |
| 6 | 7 | 1+1+2+2 = 6 | Yes |

**Binary Search:**

| left | right | mid | hours_needed(mid) | Action |
|------|-------|-----|-------------------|--------|
| 1 | 11 | 6 | 1+1+2+2=6 ≤ 8 | right = 5 |
| 1 | 5 | 3 | 1+2+3+4=10 > 8 | left = 4 |
| 4 | 5 | 4 | 1+2+2+3=8 ≤ 8 | right = 3 |
| 4 | 3 | - | left > right, done | result = 4 |

**Result:** `4`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × log(max(piles)))
- Binary search: O(log(max(piles))) iterations.
- Each iteration: O(N) to calculate hours.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What if Koko can eat from multiple piles in one hour?"**
   → Different problem; total bananas / h gives minimum speed.

2. **"What if there's a maximum speed limit?"**
   → Adjust search range to [1, min(max_pile, limit)].

3. **"What if piles are streaming?"**
   → Need to maintain max pile and recalculate; or use approximate bounds.
