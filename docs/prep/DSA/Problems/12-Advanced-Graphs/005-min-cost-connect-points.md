# Min Cost to Connect All Points

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1584 | Minimum Spanning Tree |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum cost to connect all points. Cost = Manhattan distance.

### Constraints & Clarifying Questions
1. **Manhattan distance?** |x1-x2| + |y1-y2|.
2. **All points must connect?** Yes, form spanning tree.
3. **Direct or indirect?** Either, as long as connected.
4. **Duplicate points?** May exist, cost 0 to connect.

### Edge Cases
1. **Single point:** Return 0
2. **Two points:** Return their distance
3. **All same point:** Return 0

---

## Phase 2: High-Level Approach

### Approach 1: Prim's Algorithm
Start from one point, greedily add nearest point.

### Approach 2: Kruskal's Algorithm
Sort all edges, add if doesn't create cycle (Union-Find).

---

## Phase 3: Python Code

```python
from typing import List
import heapq


def solve_prim(points: List[List[int]]) -> int:
    """
    Find MST cost using Prim's algorithm.
    
    Args:
        points: List of [x, y] coordinates
    
    Returns:
        Minimum cost to connect all points
    """
    n = len(points)
    if n <= 1:
        return 0
    
    def manhattan(i: int, j: int) -> int:
        return abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
    
    # Prim's: start from point 0
    total_cost = 0
    visited = {0}
    # (distance, point_index)
    heap = [(manhattan(0, i), i) for i in range(1, n)]
    heapq.heapify(heap)
    
    while len(visited) < n:
        cost, point = heapq.heappop(heap)
        
        if point in visited:
            continue
        
        visited.add(point)
        total_cost += cost
        
        # Add edges to unvisited points
        for i in range(n):
            if i not in visited:
                heapq.heappush(heap, (manhattan(point, i), i))
    
    return total_cost


def solve_kruskal(points: List[List[int]]) -> int:
    """
    Find MST cost using Kruskal's algorithm.
    """
    n = len(points)
    if n <= 1:
        return 0
    
    # Generate all edges
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.append((dist, i, j))
    
    # Sort by distance
    edges.sort()
    
    # Union-Find
    parent = list(range(n))
    rank = [0] * n
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True
    
    total_cost = 0
    edges_added = 0
    
    for dist, i, j in edges:
        if union(i, j):
            total_cost += dist
            edges_added += 1
            if edges_added == n - 1:
                break
    
    return total_cost


def solve_prim_optimized(points: List[List[int]]) -> int:
    """
    Optimized Prim's without storing all edges.
    """
    n = len(points)
    if n <= 1:
        return 0
    
    # min_dist[i] = minimum distance from MST to point i
    INF = float('inf')
    min_dist = [INF] * n
    min_dist[0] = 0
    in_mst = [False] * n
    
    total_cost = 0
    
    for _ in range(n):
        # Find minimum distance point not in MST
        u = -1
        for i in range(n):
            if not in_mst[i] and (u == -1 or min_dist[i] < min_dist[u]):
                u = i
        
        in_mst[u] = True
        total_cost += min_dist[u]
        
        # Update distances
        for v in range(n):
            if not in_mst[v]:
                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                min_dist[v] = min(min_dist[v], dist)
    
    return total_cost
```

---

## Phase 4: Dry Run

**Input:** `[[0,0], [2,2], [3,10], [5,2], [7,0]]`

**Prim's from point 0:**

| Step | MST | Add Point | Cost |
|------|-----|-----------|------|
| 1 | {0} | 1 (dist=4) | 4 |
| 2 | {0,1} | 3 (dist=3) | 4+3=7 |
| 3 | {0,1,3} | 4 (dist=4) | 7+4=11 |
| 4 | {0,1,3,4} | 2 (dist=8) | 11+8=19 |

Wait, let me recalculate...
- 0→1: |2-0|+|2-0| = 4
- 0→2: |3-0|+|10-0| = 13
- 1→3: |5-2|+|2-2| = 3
- 3→4: |7-5|+|0-2| = 4
- 2→3: |5-3|+|2-10| = 10

**Result:** 20

---

## Phase 5: Complexity Analysis

### Prim's with Heap:
- **Time:** O(N² log N)
- **Space:** O(N²)

### Kruskal's:
- **Time:** O(N² log N)
- **Space:** O(N²)

---

## Phase 6: Follow-Up Questions

1. **"Add new point dynamically?"**
   → Re-run MST or use incremental algorithms.

2. **"Limit max edge length?"**
   → May result in forest; count components.

3. **"Euclidean distance?"**
   → Same algorithms; change distance function.
