# Jump Game

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 55 | Greedy / DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Can reach last index? nums[i] = max jump from position i.

### Constraints & Clarifying Questions
1. **Start position?** Index 0.
2. **Jump exactly or up to?** Up to nums[i].
3. **Single element?** Already at end (true).
4. **0 values?** May get stuck.

### Edge Cases
1. **Single element:** True
2. **All zeros except first:** Depends on first value
3. **All 1s:** True

---

## Phase 2: High-Level Approach

### Approach: Greedy - Track Farthest Reachable
Track maximum reachable index. If current position > reachable, return false.

**Core Insight:** If we can reach position i, update max reach to max(reach, i + nums[i]).

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> bool:
    """
    Check if last index is reachable.
    
    Args:
        nums: Jump distances
    
    Returns:
        True if reachable
    """
    n = len(nums)
    max_reach = 0
    
    for i in range(n):
        # Can't reach this position
        if i > max_reach:
            return False
        
        # Update farthest reachable
        max_reach = max(max_reach, i + nums[i])
        
        # Can reach end
        if max_reach >= n - 1:
            return True
    
    return True


def solve_dp(nums: List[int]) -> bool:
    """
    DP approach O(n²).
    """
    n = len(nums)
    dp = [False] * n
    dp[0] = True
    
    for i in range(1, n):
        for j in range(i):
            if dp[j] and j + nums[j] >= i:
                dp[i] = True
                break
    
    return dp[n - 1]


def solve_backward(nums: List[int]) -> bool:
    """
    Work backward from end.
    """
    n = len(nums)
    goal = n - 1
    
    for i in range(n - 2, -1, -1):
        if i + nums[i] >= goal:
            goal = i
    
    return goal == 0


def solve_bfs(nums: List[int]) -> bool:
    """
    BFS approach.
    """
    from collections import deque
    
    n = len(nums)
    if n <= 1:
        return True
    
    visited = {0}
    queue = deque([0])
    
    while queue:
        pos = queue.popleft()
        
        for jump in range(1, nums[pos] + 1):
            next_pos = pos + jump
            
            if next_pos >= n - 1:
                return True
            
            if next_pos not in visited:
                visited.add(next_pos)
                queue.append(next_pos)
    
    return False
```

---

## Phase 4: Dry Run

**Input:** `[2, 3, 1, 1, 4]`

| i | nums[i] | max_reach | Status |
|---|---------|-----------|--------|
| 0 | 2 | max(0,0+2)=2 | Continue |
| 1 | 3 | max(2,1+3)=4 | ≥ 4 ✓ |

**Result:** True (can reach index 4)

**Input:** `[3, 2, 1, 0, 4]`

| i | nums[i] | max_reach | Status |
|---|---------|-----------|--------|
| 0 | 3 | 3 | Continue |
| 1 | 2 | 3 | Continue |
| 2 | 1 | 3 | Continue |
| 3 | 0 | 3 | Continue |
| 4 | - | 3 < 4 | i > max_reach |

**Result:** False (stuck at index 3)

---

## Phase 5: Complexity Analysis

### Greedy Approach:
- **Time:** O(N)
- **Space:** O(1)

### DP Approach:
- **Time:** O(N²)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Minimum jumps to reach end?"**
   → Jump Game II: BFS levels or greedy.

2. **"Can jump backward too?"**
   → BFS both directions.

3. **"Jump cost associated?"**
   → Shortest path algorithms.
