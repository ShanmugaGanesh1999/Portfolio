# Gas Station

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 134 | Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find starting gas station index to complete circular tour.

### Constraints & Clarifying Questions
1. **Circular tour?** End at same station started.
2. **Unique solution?** Guaranteed if exists.
3. **No solution?** Return -1.
4. **Same length arrays?** Yes.

### Edge Cases
1. **Total gas < total cost:** -1
2. **All zeros:** Return 0
3. **Single station:** Check gas[0] >= cost[0]

---

## Phase 2: High-Level Approach

### Approach: Greedy - Find Valid Start
If total gas >= total cost, solution exists.
Start from position where running sum never goes negative.

**Core Insight:** If we can't reach j from i, we can't reach j from any station between i and j either.

---

## Phase 3: Python Code

```python
from typing import List


def solve(gas: List[int], cost: List[int]) -> int:
    """
    Find starting station for complete circuit.
    
    Args:
        gas: Gas at each station
        cost: Cost to reach next station
    
    Returns:
        Starting index, -1 if impossible
    """
    total_tank = 0
    curr_tank = 0
    start = 0
    
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        
        # Can't reach station i+1, reset start
        if curr_tank < 0:
            start = i + 1
            curr_tank = 0
    
    return start if total_tank >= 0 else -1


def solve_brute_force(gas: List[int], cost: List[int]) -> int:
    """
    O(n²) brute force for verification.
    """
    n = len(gas)
    
    for start in range(n):
        tank = 0
        valid = True
        
        for i in range(n):
            station = (start + i) % n
            tank += gas[station] - cost[station]
            
            if tank < 0:
                valid = False
                break
        
        if valid:
            return start
    
    return -1


def solve_verbose(gas: List[int], cost: List[int]) -> int:
    """
    More verbose with explanation.
    """
    n = len(gas)
    
    # First check if solution exists
    if sum(gas) < sum(cost):
        return -1
    
    # Find starting point
    tank = 0
    start = 0
    
    for i in range(n):
        tank += gas[i] - cost[i]
        
        # If we run out of gas, start from next station
        if tank < 0:
            start = i + 1
            tank = 0
    
    return start
```

---

## Phase 4: Dry Run

**Input:** `gas = [1,2,3,4,5], cost = [3,4,5,1,2]`

**Differences (gas - cost):** [-2, -2, -2, 3, 3]
**Total sum:** 0 (solution exists)

| i | diff | curr_tank | start |
|---|------|-----------|-------|
| 0 | -2 | -2 < 0 | 1 |
| 1 | -2 | -2 < 0 | 2 |
| 2 | -2 | -2 < 0 | 3 |
| 3 | 3 | 3 | 3 |
| 4 | 3 | 6 | 3 |

**Verify from station 3:**
- 3→4: tank = 4-1 = 3, travel cost 2, arrive with 1
- 4→0: tank = 1+5-2 = 4
- 0→1: tank = 4+1-3 = 2
- 1→2: tank = 2+2-4 = 0
- 2→3: tank = 0+3-5 = -2 ❌

**Wait, let's recalculate...**

Actually start=3 means:
- Station 3: tank = 4, cost = 1 → arrive at 4 with 3
- Station 4: tank = 3+5 = 8, cost = 2 → arrive at 0 with 6
- Station 0: tank = 6+1 = 7, cost = 3 → arrive at 1 with 4
- Station 1: tank = 4+2 = 6, cost = 4 → arrive at 2 with 2
- Station 2: tank = 2+3 = 5, cost = 5 → arrive at 3 with 0 ✓

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Constant variables.

---

## Phase 6: Follow-Up Questions

1. **"Multiple valid starts?"**
   → Problem guarantees unique if exists.

2. **"Bidirectional travel?"**
   → Check both directions.

3. **"Minimum starting fuel needed?"**
   → Binary search on fuel amount.
