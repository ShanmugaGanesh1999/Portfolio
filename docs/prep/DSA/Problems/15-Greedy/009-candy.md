# Candy

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 135 | Greedy (Two Pass) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Each child gets at least 1 candy. Higher rated child gets more than neighbors.

### Constraints & Clarifying Questions
1. **Strictly more or equal?** Strictly more if higher rating.
2. **Same rating neighbors?** Can have same candy.
3. **Minimize total candies?** Yes.
4. **Ratings all positive?** Not necessarily.

### Edge Cases
1. **Single child:** 1 candy
2. **All same ratings:** n candies (all get 1)
3. **Strictly increasing:** 1+2+...+n

---

## Phase 2: High-Level Approach

### Approach: Two-Pass Greedy
Pass 1 (left to right): If rating[i] > rating[i-1], give more than left neighbor.
Pass 2 (right to left): If rating[i] > rating[i+1], ensure more than right neighbor.

**Core Insight:** Satisfy both neighbors with two passes.

---

## Phase 3: Python Code

```python
from typing import List


def solve(ratings: List[int]) -> int:
    """
    Minimum candies satisfying rating constraints.
    
    Args:
        ratings: Child ratings
    
    Returns:
        Minimum total candies
    """
    n = len(ratings)
    candies = [1] * n
    
    # Left to right: compare with left neighbor
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
    
    # Right to left: compare with right neighbor
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
    
    return sum(candies)


def solve_single_pass(ratings: List[int]) -> int:
    """
    O(1) space solution (tricky).
    """
    if not ratings:
        return 0
    
    n = len(ratings)
    total = 1
    up = down = peak = 1
    
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            up += 1
            down = 1
            peak = up
            total += up
        elif ratings[i] == ratings[i - 1]:
            up = down = peak = 1
            total += 1
        else:
            up = 1
            down += 1
            # Adjust if descending slope exceeds peak
            total += down + (-1 if peak >= down else 0)
    
    return total


def solve_verbose(ratings: List[int]) -> int:
    """
    More verbose with explanation.
    """
    n = len(ratings)
    
    # Initialize everyone with 1 candy
    left_to_right = [1] * n
    right_to_left = [1] * n
    
    # Pass 1: Satisfy left neighbor constraint
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            left_to_right[i] = left_to_right[i - 1] + 1
    
    # Pass 2: Satisfy right neighbor constraint
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            right_to_left[i] = right_to_left[i + 1] + 1
    
    # Take max of both constraints
    return sum(max(l, r) for l, r in zip(left_to_right, right_to_left))
```

---

## Phase 4: Dry Run

**Input:** `[1, 0, 2]`

**Left to right:**
- candies = [1, 1, 1]
- i=1: ratings[1]=0 < ratings[0]=1, no change
- i=2: ratings[2]=2 > ratings[1]=0, candies[2]=2
- candies = [1, 1, 2]

**Right to left:**
- i=1: ratings[1]=0 < ratings[2]=2, no change
- i=0: ratings[0]=1 > ratings[1]=0, candies[0]=max(1, 2)=2
- candies = [2, 1, 2]

**Total:** 2+1+2 = 5

**Result:** 5

---

## Phase 5: Complexity Analysis

### Two-Pass:
- **Time:** O(N)
- **Space:** O(N)

### Single-Pass:
- **Time:** O(N)
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"At least 2 candies difference?"**
   → Change +1 to +2 in comparisons.

2. **"With candy types (not count)?"**
   → Different problem; assign types.

3. **"Cyclic arrangement?"**
   → Need to handle wraparound.
