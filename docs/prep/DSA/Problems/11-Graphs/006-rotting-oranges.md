# Rotting Oranges

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 994 | Multi-source BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum minutes for all oranges to rot. Rotten spreads to adjacent fresh each minute.

### Constraints & Clarifying Questions
1. **Spread rate?** All adjacent fresh rot simultaneously each minute.
2. **Grid values?** 0=empty, 1=fresh, 2=rotten.
3. **Isolated fresh?** Return -1.
4. **No fresh initially?** Return 0.

### Edge Cases
1. **No fresh oranges:** Return 0
2. **No rotten oranges:** Return -1 if any fresh exist
3. **Unreachable fresh:** Return -1

---

## Phase 2: High-Level Approach

### Approach: Multi-source BFS
Start BFS from all rotten oranges simultaneously. Track levels (minutes).

**Core Insight:** BFS levels = time elapsed.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve(grid: List[List[int]]) -> int:
    """
    Find minimum time for all oranges to rot.
    
    Args:
        grid: Grid with 0=empty, 1=fresh, 2=rotten
    
    Returns:
        Minutes needed, or -1 if impossible
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    
    # Initialize: find all rotten and count fresh
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1
    
    # Edge case: no fresh oranges
    if fresh_count == 0:
        return 0
    
    minutes = 0
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    # BFS
    while queue and fresh_count > 0:
        minutes += 1
        
        # Process all oranges at current time
        for _ in range(len(queue)):
            r, c = queue.popleft()
            
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))
    
    return minutes if fresh_count == 0 else -1


def solve_alternate(grid: List[List[int]]) -> int:
    """
    Track time in queue entries.
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))  # Include time
            elif grid[r][c] == 1:
                fresh_count += 1
    
    if fresh_count == 0:
        return 0
    
    max_time = 0
    
    while queue:
        r, c, time = queue.popleft()
        max_time = max(max_time, time)
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh_count -= 1
                queue.append((nr, nc, time + 1))
    
    return max_time if fresh_count == 0 else -1
```

---

## Phase 4: Dry Run

**Input:**
```
2 1 1
1 1 0
0 1 1
```

**Initial:** queue = [(0,0)], fresh = 5

**Minute 1:**
- (0,0) rots (0,1) and (1,0)
- Queue: [(0,1), (1,0)], fresh = 3

**Minute 2:**
- (0,1) rots (0,2)
- (1,0) rots (1,1)
- Queue: [(0,2), (1,1)], fresh = 1

**Minute 3:**
- (1,1) rots (2,1)
- Queue: [(2,1)], fresh = 0

**Minute 4:**
- (2,1) rots (2,2)
- fresh = 0

**Result:** 4 minutes

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each cell visited at most once.

### Space Complexity: O(M × N)
Queue size.

---

## Phase 6: Follow-Up Questions

1. **"Minimum rotten needed for all to rot?"**
   → Different problem; find minimal set covering all fresh.

2. **"What if rot spreads at different rates?"**
   → Use priority queue (Dijkstra-like).

3. **"Which cells rot at minute k?"**
   → Track level in BFS; collect cells at level k.
