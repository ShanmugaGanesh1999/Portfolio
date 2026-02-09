# Cheapest Flights Within K Stops

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 787 | Bellman-Ford / BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find cheapest flight from src to dst with at most k stops.

### Constraints & Clarifying Questions
1. **K stops = k intermediate cities?** Yes.
2. **Direct flight counts as 0 stops?** Yes.
3. **No path within k?** Return -1.
4. **Multiple flights same route?** Take cheapest.

### Edge Cases
1. **src == dst:** Return 0
2. **Direct flight exists:** Compare with other paths
3. **K = 0:** Only direct flight

---

## Phase 2: High-Level Approach

### Approach 1: Modified Bellman-Ford
Run k+1 relaxation rounds (k+1 edges = k stops).

### Approach 2: BFS/Dijkstra with State
State = (city, stops). Priority by cost.

---

## Phase 3: Python Code

```python
from typing import List
import heapq
from collections import defaultdict


def solve_bellman_ford(n: int, flights: List[List[int]], src: int, 
                       dst: int, k: int) -> int:
    """
    Find cheapest flight with at most k stops.
    
    Args:
        n: Number of cities
        flights: List of [from, to, price]
        src: Source city
        dst: Destination city
        k: Max stops
    
    Returns:
        Minimum cost, -1 if impossible
    """
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0
    
    # K+1 rounds (k stops = k+1 edges)
    for _ in range(k + 1):
        # Use copy to prevent using updated values in same round
        new_dist = dist.copy()
        
        for u, v, price in flights:
            if dist[u] != INF:
                new_dist[v] = min(new_dist[v], dist[u] + price)
        
        dist = new_dist
    
    return dist[dst] if dist[dst] != INF else -1


def solve_dijkstra_modified(n: int, flights: List[List[int]], src: int,
                            dst: int, k: int) -> int:
    """
    Modified Dijkstra with stops tracking.
    """
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # (cost, city, stops_remaining)
    heap = [(0, src, k + 1)]
    visited = {}  # city -> min stops used to reach
    
    while heap:
        cost, city, stops = heapq.heappop(heap)
        
        if city == dst:
            return cost
        
        # Skip if we've reached this city with more stops remaining
        if city in visited and visited[city] >= stops:
            continue
        visited[city] = stops
        
        if stops > 0:
            for neighbor, price in graph[city]:
                heapq.heappush(heap, (cost + price, neighbor, stops - 1))
    
    return -1


def solve_bfs(n: int, flights: List[List[int]], src: int,
              dst: int, k: int) -> int:
    """
    BFS level by level (k+1 levels).
    """
    from collections import deque
    
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    INF = float('inf')
    min_cost = [INF] * n
    min_cost[src] = 0
    
    queue = deque([(src, 0)])  # (city, cost)
    stops = 0
    
    while queue and stops <= k:
        for _ in range(len(queue)):
            city, cost = queue.popleft()
            
            for neighbor, price in graph[city]:
                new_cost = cost + price
                
                if new_cost < min_cost[neighbor]:
                    min_cost[neighbor] = new_cost
                    queue.append((neighbor, new_cost))
        
        stops += 1
    
    return min_cost[dst] if min_cost[dst] != INF else -1
```

---

## Phase 4: Dry Run

**Input:**
- n = 4
- flights = [[0,1,100], [1,2,100], [2,0,100], [1,3,600], [2,3,200]]
- src = 0, dst = 3, k = 1

**Bellman-Ford:**

| Round | dist[0] | dist[1] | dist[2] | dist[3] |
|-------|---------|---------|---------|---------|
| Init | 0 | ∞ | ∞ | ∞ |
| 1 | 0 | 100 | ∞ | ∞ |
| 2 | 0 | 100 | 200 | 700 |

k=1 means 2 rounds. 

**Result:** 700 (path: 0→1→3)

---

## Phase 5: Complexity Analysis

### Bellman-Ford:
- **Time:** O(K × E)
- **Space:** O(N)

### Modified Dijkstra:
- **Time:** O(K × E × log(K × N))
- **Space:** O(K × N)

---

## Phase 6: Follow-Up Questions

1. **"Return actual path?"**
   → Track parent with (city, stops) state.

2. **"Exactly k stops?"**
   → Only check distance after exactly k+1 relaxations.

3. **"Multiple sources?"**
   → Run from each source; or modify state.
