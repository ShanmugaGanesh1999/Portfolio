# Shortest Path in Binary Matrix

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1091 | BFS Shortest Path |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find shortest clear path (all 0s) from top-left to bottom-right with 8-directional movement.

### Constraints & Clarifying Questions
1. **8 directions?** Yes, including diagonals.
2. **Path cells must be 0?** Yes.
3. **Start/end must be 0?** Yes.
4. **Return what?** Path length (cells count), or -1.

### Edge Cases
1. **Start is 1:** Return -1
2. **End is 1:** Return -1
3. **1×1 grid with 0:** Return 1

---

## Phase 2: High-Level Approach

### Approach: BFS for Shortest Path
Start from (0,0), BFS with 8 directions. First to reach (n-1, n-1) is shortest.

**Core Insight:** BFS guarantees shortest path in unweighted graph.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve(grid: List[List[int]]) -> int:
    """
    Find shortest clear path length.
    
    Args:
        grid: Binary grid (0=clear, 1=blocked)
    
    Returns:
        Shortest path length, -1 if impossible
    """
    n = len(grid)
    
    # Check start and end
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1
    
    if n == 1:
        return 1
    
    # 8 directions
    directions = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),          (0, 1),
        (1, -1),  (1, 0), (1, 1)
    ]
    
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # Mark visited
    
    while queue:
        r, c, dist = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                if nr == n - 1 and nc == n - 1:
                    return dist + 1
                
                grid[nr][nc] = 1  # Mark visited
                queue.append((nr, nc, dist + 1))
    
    return -1


def solve_a_star(grid: List[List[int]]) -> int:
    """
    A* with Chebyshev distance heuristic.
    """
    import heapq
    
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1
    
    # Chebyshev distance heuristic
    def heuristic(r, c):
        return max(n - 1 - r, n - 1 - c)
    
    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    
    # (f_score, distance, row, col)
    heap = [(heuristic(0, 0) + 1, 1, 0, 0)]
    visited = set()
    
    while heap:
        _, dist, r, c = heapq.heappop(heap)
        
        if (r, c) in visited:
            continue
        visited.add((r, c))
        
        if r == n - 1 and c == n - 1:
            return dist
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < n and 0 <= nc < n and 
                grid[nr][nc] == 0 and (nr, nc) not in visited):
                f = dist + 1 + heuristic(nr, nc)
                heapq.heappush(heap, (f, dist + 1, nr, nc))
    
    return -1
```

---

## Phase 4: Dry Run

**Input:**
```
0 0 0
1 1 0
1 1 0
```

**BFS:**

| Step | Queue | Processing |
|------|-------|------------|
| 1 | [(0,0,1)] | Explore from (0,0) |
| 2 | [(0,1,2),(1,0)?blocked] | Add (0,1) |
| 3 | [(0,1,2),(0,2,2)] | Add (0,2) from diagonal |
| 4 | Process (0,1) → add (1,2,3) | |
| 5 | Process (0,2) → (1,2) already | |
| 6 | Process (1,2) → add (2,2,4) | Found! |

**Result:** 4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
Each cell visited at most once.

### Space Complexity: O(N²)
Queue can hold all cells.

---

## Phase 6: Follow-Up Questions

1. **"Return actual path?"**
   → Track parent; reconstruct from end.

2. **"Weighted cells?"**
   → Dijkstra's algorithm.

3. **"Multiple start/end points?"**
   → Multi-source BFS from all starts.
