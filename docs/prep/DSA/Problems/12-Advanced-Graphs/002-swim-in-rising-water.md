# Swim in Rising Water

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 778 | Dijkstra / Binary Search + BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum time t to swim from top-left to bottom-right. Can move when water level ≥ both cells.

### Constraints & Clarifying Questions
1. **Water level at time t?** t.
2. **Can stay in cell?** Yes, wait for water to rise.
3. **Movement?** 4-directional.
4. **Grid values?** 0 to n²-1, unique.

### Edge Cases
1. **1×1 grid:** Return grid[0][0]
2. **Path through max cell:** Time = max on path
3. **Minimize maximum cell on path**

---

## Phase 2: High-Level Approach

### Approach 1: Dijkstra (Min-Max Path)
Priority queue with max cell value on path. Find path minimizing maximum.

### Approach 2: Binary Search + BFS
Binary search on time; check if path exists at that time.

---

## Phase 3: Python Code

```python
from typing import List
import heapq


def solve_dijkstra(grid: List[List[int]]) -> int:
    """
    Find minimum time using Dijkstra (min-max path).
    
    Args:
        grid: n×n grid of elevations
    
    Returns:
        Minimum time to reach bottom-right
    """
    n = len(grid)
    
    # (max elevation on path, row, col)
    heap = [(grid[0][0], 0, 0)]
    visited = set()
    
    while heap:
        max_elev, r, c = heapq.heappop(heap)
        
        if (r, c) in visited:
            continue
        visited.add((r, c))
        
        if r == n - 1 and c == n - 1:
            return max_elev
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited:
                new_max = max(max_elev, grid[nr][nc])
                heapq.heappush(heap, (new_max, nr, nc))
    
    return -1


def solve_binary_search(grid: List[List[int]]) -> int:
    """
    Binary search on time + BFS connectivity check.
    """
    from collections import deque
    
    n = len(grid)
    
    def can_reach(time: int) -> bool:
        if grid[0][0] > time:
            return False
        
        queue = deque([(0, 0)])
        visited = {(0, 0)}
        
        while queue:
            r, c = queue.popleft()
            
            if r == n - 1 and c == n - 1:
                return True
            
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc
                
                if (0 <= nr < n and 0 <= nc < n and 
                    (nr, nc) not in visited and grid[nr][nc] <= time):
                    visited.add((nr, nc))
                    queue.append((nr, nc))
        
        return False
    
    # Binary search on time
    left = max(grid[0][0], grid[n-1][n-1])
    right = n * n - 1
    
    while left < right:
        mid = (left + right) // 2
        
        if can_reach(mid):
            right = mid
        else:
            left = mid + 1
    
    return left


def solve_union_find(grid: List[List[int]]) -> int:
    """
    Union-Find: process cells in increasing order.
    """
    n = len(grid)
    parent = list(range(n * n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        parent[find(x)] = find(y)
    
    def idx(r, c):
        return r * n + c
    
    # Sort cells by elevation
    cells = sorted((grid[r][c], r, c) for r in range(n) for c in range(n))
    
    processed = [[False] * n for _ in range(n)]
    
    for elev, r, c in cells:
        processed[r][c] = True
        
        # Union with processed neighbors
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and processed[nr][nc]:
                union(idx(r, c), idx(nr, nc))
        
        # Check if start and end connected
        if find(idx(0, 0)) == find(idx(n-1, n-1)):
            return elev
    
    return -1
```

---

## Phase 4: Dry Run

**Input:**
```
[[0, 2],
 [1, 3]]
```

**Dijkstra:**

| Step | Heap | Pop | Action |
|------|------|-----|--------|
| 1 | [(0,0,0)] | (0,0,0) | Add (2,0,1), (1,1,0) |
| 2 | [(1,1,0),(2,0,1)] | (1,1,0) | Add (3,1,1) |
| 3 | [(2,0,1),(3,1,1)] | (2,0,1) | (1,1) already via better |
| 4 | [(3,1,1)] | (3,1,1) | Reached! |

**Result:** 3 (path 0→1→3, max=3)

---

## Phase 5: Complexity Analysis

### Dijkstra:
- **Time:** O(N² log N)
- **Space:** O(N²)

### Binary Search + BFS:
- **Time:** O(N² log N)
- **Space:** O(N²)

---

## Phase 6: Follow-Up Questions

1. **"Water rises faster in some cells?"**
   → Modify time calculation per cell.

2. **"Find actual path?"**
   → Track parent in Dijkstra.

3. **"Multiple starting points?"**
   → Multi-source Dijkstra.
