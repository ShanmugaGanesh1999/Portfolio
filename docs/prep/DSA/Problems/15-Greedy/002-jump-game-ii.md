# Jump Game II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 45 | Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum jumps to reach last index.

### Constraints & Clarifying Questions
1. **Guaranteed reachable?** Yes.
2. **Jump at most nums[i]?** Yes.
3. **Start position?** Index 0.
4. **Single element?** 0 jumps.

### Edge Cases
1. **Single element:** 0
2. **nums[0] >= n-1:** 1 jump
3. **All 1s:** n-1 jumps

---

## Phase 2: High-Level Approach

### Approach: Greedy - Farthest Reach per Level
Track current level's farthest reach. When we hit boundary, increment jumps.

**Core Insight:** Like BFS levels; count levels to reach end.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Find minimum jumps to reach end.
    
    Args:
        nums: Jump distances
    
    Returns:
        Minimum jumps
    """
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps = 0
    curr_end = 0      # End of current jump range
    farthest = 0      # Farthest reachable
    
    for i in range(n - 1):  # Don't need to jump from last
        farthest = max(farthest, i + nums[i])
        
        if i == curr_end:
            jumps += 1
            curr_end = farthest
            
            if curr_end >= n - 1:
                break
    
    return jumps


def solve_verbose(nums: List[int]) -> int:
    """
    More verbose with explanation.
    """
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps = 0
    level_start = 0
    level_end = 0
    
    while level_end < n - 1:
        jumps += 1
        farthest = 0
        
        # Find farthest reachable from current level
        for i in range(level_start, level_end + 1):
            farthest = max(farthest, i + nums[i])
        
        level_start = level_end + 1
        level_end = farthest
    
    return jumps


def solve_bfs(nums: List[int]) -> int:
    """
    BFS approach.
    """
    from collections import deque
    
    n = len(nums)
    if n <= 1:
        return 0
    
    visited = {0}
    queue = deque([0])
    level = 0
    
    while queue:
        level += 1
        for _ in range(len(queue)):
            pos = queue.popleft()
            
            for jump in range(1, nums[pos] + 1):
                next_pos = pos + jump
                
                if next_pos >= n - 1:
                    return level
                
                if next_pos not in visited:
                    visited.add(next_pos)
                    queue.append(next_pos)
    
    return -1
```

---

## Phase 4: Dry Run

**Input:** `[2, 3, 1, 1, 4]`

| i | nums[i] | farthest | curr_end | jumps |
|---|---------|----------|----------|-------|
| 0 | 2 | max(0,0+2)=2 | 0→2 | 0→1 |
| 1 | 3 | max(2,1+3)=4 | 2 | 1 |
| 2 | 1 | max(4,2+1)=4 | 2→4 | 1→2 |

**At i=2, curr_end=2, jump to farthest=4 (≥n-1)**

**Result:** 2 (jump 0→1→4 or 0→2→4)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Constant variables.

---

## Phase 6: Follow-Up Questions

1. **"Can reach end?"**
   → Jump Game I: check if farthest >= n-1.

2. **"Return actual path?"**
   → Track choices; backtrack from end.

3. **"With costs?"**
   → Dijkstra or DP with costs.
