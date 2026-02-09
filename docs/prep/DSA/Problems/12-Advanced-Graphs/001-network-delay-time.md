# Network Delay Time

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 743 | Dijkstra's Algorithm |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum time for signal to reach all nodes from source k.

### Constraints & Clarifying Questions
1. **Graph type?** Directed, weighted.
2. **Edge weights?** Non-negative (Dijkstra valid).
3. **Unreachable nodes?** Return -1.
4. **Return what?** Time when last node receives signal.

### Edge Cases
1. **Single node:** Return 0
2. **Disconnected graph:** Return -1
3. **Multiple paths:** Take shortest

---

## Phase 2: High-Level Approach

### Approach: Dijkstra's Algorithm
Find shortest path from source to all nodes. Return max distance.

**Core Insight:** Dijkstra gives minimum time to each node; answer is the maximum.

---

## Phase 3: Python Code

```python
from typing import List
import heapq
from collections import defaultdict


def solve(times: List[List[int]], n: int, k: int) -> int:
    """
    Find network delay time using Dijkstra.
    
    Args:
        times: List of [u, v, w] edges
        n: Number of nodes (1-indexed)
        k: Source node
    
    Returns:
        Time for all nodes to receive signal, -1 if impossible
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    
    # Dijkstra's algorithm
    dist = {k: 0}
    heap = [(0, k)]  # (distance, node)
    
    while heap:
        d, node = heapq.heappop(heap)
        
        # Skip if already processed with shorter distance
        if d > dist.get(node, float('inf')):
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            
            if new_dist < dist.get(neighbor, float('inf')):
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))
    
    # Check if all nodes reached
    if len(dist) != n:
        return -1
    
    return max(dist.values())


def solve_bellman_ford(times: List[List[int]], n: int, k: int) -> int:
    """
    Bellman-Ford (handles negative weights, though not needed here).
    """
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    
    for _ in range(n - 1):
        for u, v, w in times:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    max_dist = max(dist[1:])
    return max_dist if max_dist != float('inf') else -1
```

---

## Phase 4: Dry Run

**Input:** 
- times = [[2,1,1], [2,3,1], [3,4,1]]
- n = 4, k = 2

**Graph:**
```
2 --1--> 1
2 --1--> 3 --1--> 4
```

**Dijkstra from node 2:**

| Step | Heap | Dist | Pop |
|------|------|------|-----|
| Init | [(0,2)] | {2:0} | |
| 1 | [(1,1),(1,3)] | {2:0,1:1,3:1} | (0,2) |
| 2 | [(1,3)] | {2:0,1:1,3:1} | (1,1) |
| 3 | [(2,4)] | {2:0,1:1,3:1,4:2} | (1,3) |
| 4 | [] | | (2,4) |

**Max dist:** 2 (to node 4)

**Result:** 2

---

## Phase 5: Complexity Analysis

### Dijkstra:
- **Time:** O((V + E) log V)
- **Space:** O(V + E)

### Bellman-Ford:
- **Time:** O(V × E)
- **Space:** O(V)

---

## Phase 6: Follow-Up Questions

1. **"Negative edge weights?"**
   → Bellman-Ford algorithm.

2. **"Find actual path?"**
   → Track parent; reconstruct.

3. **"Update edges dynamically?"**
   → Incremental Dijkstra or re-run.
