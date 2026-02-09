# Making a Large Island

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 827 | Union-Find / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Change at most one 0 to 1 to maximize island size.

### Constraints & Clarifying Questions
1. **Can change exactly one 0?** At most one (can be zero).
2. **All 1s already?** Return total size.
3. **All 0s?** Return 1 (change one).
4. **Island = 4-connected?** Yes.

### Edge Cases
1. **No 0s:** Return grid size
2. **No 1s:** Return 1
3. **Single 0 between two islands:** Merge them

---

## Phase 2: High-Level Approach

### Approach: Label Islands + Check Each 0
1. Label each island with unique ID and track sizes.
2. For each 0, check which islands it would connect.

**Core Insight:** Pre-compute island sizes; check each 0's potential.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict


def solve(grid: List[List[int]]) -> int:
    """
    Find largest island after changing at most one 0.
    
    Args:
        grid: Binary grid
    
    Returns:
        Maximum possible island size
    """
    n = len(grid)
    if n == 0:
        return 0
    
    island_id = 2  # Start from 2 to distinguish from 0 and 1
    island_size = {}
    
    def dfs(r: int, c: int, id: int) -> int:
        if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
            return 0
        
        grid[r][c] = id
        size = 1
        size += dfs(r + 1, c, id)
        size += dfs(r - 1, c, id)
        size += dfs(r, c + 1, id)
        size += dfs(r, c - 1, id)
        return size
    
    # Step 1: Label all islands and compute sizes
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 1:
                size = dfs(r, c, island_id)
                island_size[island_id] = size
                island_id += 1
    
    # Handle case with no 0s
    if not island_size:
        return 1  # All 0s, change one
    
    max_island = max(island_size.values())
    
    # Step 2: For each 0, check potential merged size
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 0:
                neighbors = set()
                
                for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] > 1:
                        neighbors.add(grid[nr][nc])
                
                # Size if we flip this 0
                merged_size = 1 + sum(island_size[id] for id in neighbors)
                max_island = max(max_island, merged_size)
    
    return max_island


def solve_union_find(grid: List[List[int]]) -> int:
    """
    Union-Find approach.
    """
    n = len(grid)
    parent = list(range(n * n))
    size = [1] * (n * n)
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            if size[px] < size[py]:
                px, py = py, px
            parent[py] = px
            size[px] += size[py]
    
    def idx(r, c):
        return r * n + c
    
    # Union adjacent 1s
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 1:
                for dr, dc in [(0, 1), (1, 0)]:
                    nr, nc = r + dr, c + dc
                    if nr < n and nc < n and grid[nr][nc] == 1:
                        union(idx(r, c), idx(nr, nc))
    
    # Find max existing island
    max_size = max((size[find(idx(r, c))] for r in range(n) 
                    for c in range(n) if grid[r][c] == 1), default=0)
    
    # Try each 0
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 0:
                neighbors = set()
                for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 1:
                        neighbors.add(find(idx(nr, nc)))
                
                merged = 1 + sum(size[root] for root in neighbors)
                max_size = max(max_size, merged)
    
    return max_size if max_size > 0 else 1
```

---

## Phase 4: Dry Run

**Input:**
```
[[1, 0],
 [0, 1]]
```

**Step 1: Label islands**
- (0,0) → ID 2, size 1
- (1,1) → ID 3, size 1

**Step 2: Check 0s**
- (0,1): neighbors {2, 3} → size = 1+1+1 = 3
- (1,0): neighbors {2, 3} → size = 1+1+1 = 3

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
Two passes over grid.

### Space Complexity: O(N²)
Island size map.

---

## Phase 6: Follow-Up Questions

1. **"Change k zeros?"**
   → More complex; BFS expansion from each island.

2. **"Online queries for different cells?"**
   → Pre-compute; answer each query O(1).

3. **"3D grid?"**
   → Extend to 6 neighbors.
