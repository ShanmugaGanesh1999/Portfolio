# Path With Maximum Probability

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1514 | Modified Dijkstra |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find path with maximum success probability between two nodes.

### Constraints & Clarifying Questions
1. **Probability range?** 0 to 1.
2. **Path probability?** Product of edge probabilities.
3. **No path?** Return 0.
4. **Self-loops?** May exist.

### Edge Cases
1. **Start == end:** Return 1.0
2. **No edges from start:** Return 0
3. **Multiple paths:** Take highest probability

---

## Phase 2: High-Level Approach

### Approach: Dijkstra with Max Probability
Use max-heap (negate for min-heap). Track maximum probability to each node.

**Core Insight:** Instead of minimum distance, maximize product of probabilities.

---

## Phase 3: Python Code

```python
from typing import List
import heapq
from collections import defaultdict


def solve(n: int, edges: List[List[int]], succProb: List[float],
          start: int, end: int) -> float:
    """
    Find maximum probability path.
    
    Args:
        n: Number of nodes
        edges: List of [u, v] edges
        succProb: Probability of each edge
        start: Start node
        end: End node
    
    Returns:
        Maximum probability, 0 if no path
    """
    # Build graph
    graph = defaultdict(list)
    for (u, v), prob in zip(edges, succProb):
        graph[u].append((v, prob))
        graph[v].append((u, prob))
    
    # Dijkstra with max probability (use negative for max-heap)
    max_prob = [0.0] * n
    max_prob[start] = 1.0
    
    # (-probability, node)
    heap = [(-1.0, start)]
    
    while heap:
        neg_prob, node = heapq.heappop(heap)
        prob = -neg_prob
        
        if node == end:
            return prob
        
        # Skip if we've found better
        if prob < max_prob[node]:
            continue
        
        for neighbor, edge_prob in graph[node]:
            new_prob = prob * edge_prob
            
            if new_prob > max_prob[neighbor]:
                max_prob[neighbor] = new_prob
                heapq.heappush(heap, (-new_prob, neighbor))
    
    return 0.0


def solve_bellman_ford(n: int, edges: List[List[int]], succProb: List[float],
                       start: int, end: int) -> float:
    """
    Bellman-Ford approach (maximize instead of minimize).
    """
    max_prob = [0.0] * n
    max_prob[start] = 1.0
    
    for _ in range(n - 1):
        updated = False
        
        for (u, v), prob in zip(edges, succProb):
            # Try both directions (undirected)
            if max_prob[u] * prob > max_prob[v]:
                max_prob[v] = max_prob[u] * prob
                updated = True
            if max_prob[v] * prob > max_prob[u]:
                max_prob[u] = max_prob[v] * prob
                updated = True
        
        if not updated:
            break
    
    return max_prob[end]


def solve_log_dijkstra(n: int, edges: List[List[int]], succProb: List[float],
                       start: int, end: int) -> float:
    """
    Convert to standard Dijkstra using log.
    Maximize product = minimize sum of -log.
    """
    import math
    
    graph = defaultdict(list)
    for (u, v), prob in zip(edges, succProb):
        if prob > 0:
            cost = -math.log(prob)
            graph[u].append((v, cost))
            graph[v].append((u, cost))
    
    dist = [float('inf')] * n
    dist[start] = 0
    
    heap = [(0, start)]
    
    while heap:
        d, node = heapq.heappop(heap)
        
        if node == end:
            return math.exp(-d)
        
        if d > dist[node]:
            continue
        
        for neighbor, cost in graph[node]:
            new_dist = d + cost
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))
    
    return 0.0
```

---

## Phase 4: Dry Run

**Input:**
- n = 3
- edges = [[0,1], [1,2], [0,2]]
- succProb = [0.5, 0.5, 0.2]
- start = 0, end = 2

**Graph:**
```
0 --0.5--> 1 --0.5--> 2
  \-------0.2-------/
```

**Dijkstra:**

| Step | Heap | Pop | max_prob |
|------|------|-----|----------|
| Init | [(-1,0)] | | [1,0,0] |
| 1 | [(-0.5,1),(-0.2,2)] | (-1,0) | [1,0.5,0.2] |
| 2 | [(-0.25,2),(-0.2,2)] | (-0.5,1) | [1,0.5,0.25] |
| 3 | Found end! | (-0.25,2) | prob=0.25 |

**Result:** 0.25 (path 0→1→2)

---

## Phase 5: Complexity Analysis

### Time Complexity: O((V + E) log V)
Standard Dijkstra complexity.

### Space Complexity: O(V + E)
Graph + heap.

---

## Phase 6: Follow-Up Questions

1. **"Minimum probability path?"**
   → Regular Dijkstra minimizing.

2. **"K best paths?"**
   → Yen's algorithm for k-shortest paths.

3. **"Dynamic probability updates?"**
   → Re-run or use more advanced data structures.
