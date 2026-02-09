# Matchsticks to Square

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 473 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if matchsticks can form a square (4 equal sides). Each stick used exactly once.

### Constraints & Clarifying Questions
1. **Use all sticks?** Yes.
2. **Sticks can be broken?** No.
3. **Total divisible by 4?** Must be, else impossible.
4. **Input size?** Up to 15 sticks.

### Edge Cases
1. **Total not divisible by 4:** False
2. **Any stick > side length:** False
3. **Exactly 4 sticks of same length:** True

---

## Phase 2: High-Level Approach

### Approach: Backtracking into 4 Buckets
Try placing each stick into one of 4 sides. Prune early when side exceeds target.

**Core Insight:** Partition problem with k=4 buckets.

---

## Phase 3: Python Code

```python
from typing import List


def solve(matchsticks: List[int]) -> bool:
    """
    Check if matchsticks can form a square.
    
    Args:
        matchsticks: Lengths of matchsticks
    
    Returns:
        True if square possible
    """
    total = sum(matchsticks)
    
    # Must be divisible by 4
    if total % 4 != 0:
        return False
    
    side = total // 4
    
    # Quick check: no stick can be larger than side
    if max(matchsticks) > side:
        return False
    
    # Sort descending for better pruning
    matchsticks.sort(reverse=True)
    
    sides = [0] * 4
    
    def backtrack(idx: int) -> bool:
        if idx == len(matchsticks):
            # All sticks placed; check if all sides equal
            return sides[0] == sides[1] == sides[2] == sides[3] == side
        
        stick = matchsticks[idx]
        
        for i in range(4):
            # Pruning: skip if this side would exceed target
            if sides[i] + stick > side:
                continue
            
            # Pruning: skip duplicate sides (optimization)
            if i > 0 and sides[i] == sides[i - 1]:
                continue
            
            sides[i] += stick
            
            if backtrack(idx + 1):
                return True
            
            sides[i] -= stick
        
        return False
    
    return backtrack(0)


def solve_bitmask(matchsticks: List[int]) -> bool:
    """
    Alternative: Bitmask DP (for reference).
    """
    total = sum(matchsticks)
    if total % 4 != 0:
        return False
    
    side = total // 4
    n = len(matchsticks)
    
    # dp[mask] = accumulated sum for current side
    dp = {0: 0}
    
    for i in range(n):
        new_dp = {}
        for mask, curr_sum in dp.items():
            if mask & (1 << i):
                continue
            
            new_mask = mask | (1 << i)
            new_sum = (curr_sum + matchsticks[i]) % side
            
            # Only valid if doesn't exceed side
            if curr_sum + matchsticks[i] <= side * ((bin(mask).count('1') // side) + 1):
                new_dp[new_mask] = new_sum
        
        dp.update(new_dp)
    
    full_mask = (1 << n) - 1
    return full_mask in dp and dp[full_mask] == 0
```

---

## Phase 4: Dry Run

**Input:** `[1, 1, 2, 2, 2]`

- Total = 8, side = 2
- Sorted: [2, 2, 2, 1, 1]

**Backtracking:**

| idx | stick | sides | Action |
|-----|-------|-------|--------|
| 0 | 2 | [2,0,0,0] | Place in side 0 |
| 1 | 2 | [2,2,0,0] | Place in side 1 |
| 2 | 2 | [2,2,2,0] | Place in side 2 |
| 3 | 1 | [2,2,2,1] | Place in side 3 |
| 4 | 1 | [2,2,2,2] | Place in side 3 |
| 5 | - | All equal! | ✓ |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(4^N)
Each stick can go to 4 sides (with pruning).

### Space Complexity: O(N)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"Partition into k equal subsets?"**
   → Generalize: k buckets instead of 4.

2. **"Minimum sides that can be formed?"**
   → Different problem; try 2, 3, ... until possible.

3. **"What if we can break sticks?"**
   → Always possible if total divisible by 4; different approach.
