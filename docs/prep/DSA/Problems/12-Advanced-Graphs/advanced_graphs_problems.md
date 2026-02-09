# 🌐 Advanced Graphs - Complete Problem Set

## Problem 1: Reconstruct Itinerary (Hard)
**LeetCode 332**

### Problem
Reconstruct itinerary using all tickets. Start from "JFK", pick lexically smallest.

### Intuition
Hierholzer's algorithm for Eulerian path. DFS with sorted neighbors.

### Solution
```python
from collections import defaultdict

def findItinerary(tickets: list[list[str]]) -> list[str]:
    """
    Hierholzer's Algorithm
    Time: O(E log E)
    Space: O(E)
    """
    # Build adjacency list with sorted destinations
    graph = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        graph[src].append(dst)
    
    itinerary = []
    
    def dfs(airport):
        while graph[airport]:
            next_airport = graph[airport].pop()
            dfs(next_airport)
        itinerary.append(airport)
    
    dfs("JFK")
    return itinerary[::-1]
```

---

## Problem 2: Min Cost to Connect All Points (Medium)
**LeetCode 1584**

### Problem
Find minimum cost to connect all points (Manhattan distance).

### Intuition
Minimum Spanning Tree using Prim's algorithm.

### Solution
```python
import heapq

def minCostConnectPoints(points: list[list[int]]) -> int:
    """
    Prim's Algorithm
    Time: O(n² log n)
    Space: O(n²)
    """
    n = len(points)
    
    def dist(i, j):
        return abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
    
    visited = set([0])
    heap = [(dist(0, i), i) for i in range(1, n)]
    heapq.heapify(heap)
    
    total = 0
    
    while len(visited) < n:
        cost, node = heapq.heappop(heap)
        
        if node in visited:
            continue
        
        visited.add(node)
        total += cost
        
        for i in range(n):
            if i not in visited:
                heapq.heappush(heap, (dist(node, i), i))
    
    return total

# Kruskal's Algorithm with Union-Find
def minCostConnectPoints_kruskal(points: list[list[int]]) -> int:
    """
    Time: O(n² log n)
    Space: O(n²)
    """
    n = len(points)
    
    # Generate all edges
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            cost = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.append((cost, i, j))
    
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
    
    total = 0
    edges_used = 0
    
    for cost, u, v in edges:
        if union(u, v):
            total += cost
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return total
```

---

## Problem 3: Network Delay Time (Medium)
**LeetCode 743**

### Problem
Find time for signal to reach all nodes from source.

### Intuition
Dijkstra's algorithm for single-source shortest paths.

### Solution
```python
def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    """
    Dijkstra's Algorithm
    Time: O(E log V)
    Space: O(V + E)
    """
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    
    dist = {k: 0}
    heap = [(0, k)]
    
    while heap:
        d, node = heapq.heappop(heap)
        
        if d > dist.get(node, float('inf')):
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist.get(neighbor, float('inf')):
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))
    
    return max(dist.values()) if len(dist) == n else -1
```

---

## Problem 4: Swim in Rising Water (Hard)
**LeetCode 778**

### Problem
Find minimum time to swim from (0,0) to (n-1,n-1).

### Intuition
Modified Dijkstra - minimize maximum height along path.

### Solution
```python
def swimInWater(grid: list[list[int]]) -> int:
    """
    Modified Dijkstra
    Time: O(n² log n)
    Space: O(n²)
    """
    n = len(grid)
    
    visited = [[False] * n for _ in range(n)]
    heap = [(grid[0][0], 0, 0)]
    
    while heap:
        time, r, c = heapq.heappop(heap)
        
        if r == n - 1 and c == n - 1:
            return time
        
        if visited[r][c]:
            continue
        
        visited[r][c] = True
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                new_time = max(time, grid[nr][nc])
                heapq.heappush(heap, (new_time, nr, nc))
    
    return -1
```

---

## Problem 5: Alien Dictionary (Hard)
**LeetCode 269**

### Problem
Derive order of characters from sorted dictionary.

### Intuition
Build graph from adjacent words. Topological sort gives order.

### Solution
```python
def alienOrder(words: list[str]) -> str:
    """
    Topological Sort
    Time: O(C) where C = total characters
    Space: O(1) - max 26 chars
    """
    # Build adjacency list
    graph = {c: set() for word in words for c in word}
    in_degree = {c: 0 for c in graph}
    
    # Compare adjacent words
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        
        # Invalid: prefix comes after longer word
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        
        # Find first difference
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in graph[w1[j]]:
                    graph[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
    
    # Kahn's algorithm
    queue = deque([c for c in in_degree if in_degree[c] == 0])
    result = []
    
    while queue:
        c = queue.popleft()
        result.append(c)
        
        for neighbor in graph[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != len(graph):
        return ""
    
    return ''.join(result)
```

---

## Problem 6: Cheapest Flights Within K Stops (Medium)
**LeetCode 787**

### Problem
Find cheapest flight with at most k stops.

### Intuition
Bellman-Ford limited to k+1 relaxations.

### Solution
```python
def findCheapestPrice(n: int, flights: list[list[int]], src: int, 
                      dst: int, k: int) -> int:
    """
    Bellman-Ford
    Time: O(k * E)
    Space: O(n)
    """
    prices = [float('inf')] * n
    prices[src] = 0
    
    for _ in range(k + 1):
        temp = prices[:]
        
        for u, v, price in flights:
            if prices[u] != float('inf'):
                temp[v] = min(temp[v], prices[u] + price)
        
        prices = temp
    
    return prices[dst] if prices[dst] != float('inf') else -1

# BFS with pruning
def findCheapestPrice_bfs(n: int, flights: list[list[int]], src: int, 
                          dst: int, k: int) -> int:
    """
    BFS with level tracking
    """
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    dist = [float('inf')] * n
    queue = deque([(src, 0, 0)])  # (node, cost, stops)
    
    while queue:
        node, cost, stops = queue.popleft()
        
        if stops > k:
            continue
        
        for neighbor, price in graph[node]:
            new_cost = cost + price
            if new_cost < dist[neighbor]:
                dist[neighbor] = new_cost
                queue.append((neighbor, new_cost, stops + 1))
    
    return dist[dst] if dist[dst] != float('inf') else -1
```

---

## Problem 7: Critical Connections in a Network (Hard)
**LeetCode 1192**

### Problem
Find all critical edges (bridges) in network.

### Intuition
Tarjan's algorithm using DFS discovery and low times.

### Solution
```python
def criticalConnections(n: int, connections: list[list[int]]) -> list[list[int]]:
    """
    Tarjan's Bridge Finding
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = defaultdict(list)
    for u, v in connections:
        graph[u].append(v)
        graph[v].append(u)
    
    disc = [-1] * n  # Discovery time
    low = [-1] * n   # Lowest reachable time
    bridges = []
    time = [0]
    
    def dfs(node, parent):
        disc[node] = low[node] = time[0]
        time[0] += 1
        
        for neighbor in graph[node]:
            if disc[neighbor] == -1:  # Not visited
                dfs(neighbor, node)
                low[node] = min(low[node], low[neighbor])
                
                # Bridge condition
                if low[neighbor] > disc[node]:
                    bridges.append([node, neighbor])
            elif neighbor != parent:
                low[node] = min(low[node], disc[neighbor])
    
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    
    return bridges
```

---

## Problem 8: Accounts Merge (Medium)
**LeetCode 721**

### Problem
Merge accounts with same email.

### Intuition
Union-Find to connect emails belonging to same person.

### Solution
```python
def accountsMerge(accounts: list[list[str]]) -> list[list[str]]:
    """
    Union-Find
    Time: O(n * m * α(n * m)) where n = accounts, m = emails per account
    Space: O(n * m)
    """
    parent = {}
    email_to_name = {}
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
    
    # Build union-find
    for account in accounts:
        name = account[0]
        first_email = account[1]
        
        for email in account[1:]:
            if email not in parent:
                parent[email] = email
            email_to_name[email] = name
            union(email, first_email)
    
    # Group emails by root
    groups = defaultdict(list)
    for email in parent:
        groups[find(email)].append(email)
    
    # Build result
    return [[email_to_name[root]] + sorted(emails) 
            for root, emails in groups.items()]
```

---

## Problem 9: Number of Operations to Make Network Connected (Medium)
**LeetCode 1319**

### Problem
Find minimum cables to move to connect all computers.

### Intuition
Find connected components. Need components - 1 cables. Check if enough spare.

### Solution
```python
def makeConnected(n: int, connections: list[list[int]]) -> int:
    """
    Union-Find
    Time: O(E * α(n))
    Space: O(n)
    """
    # Need at least n-1 cables
    if len(connections) < n - 1:
        return -1
    
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
            return True
        return False
    
    # Count components
    components = n
    for u, v in connections:
        if union(u, v):
            components -= 1
    
    return components - 1
```

---

## Problem 10: Path with Maximum Probability (Medium)
**LeetCode 1514**

### Problem
Find path with maximum probability between two nodes.

### Intuition
Modified Dijkstra maximizing product (use max-heap).

### Solution
```python
def maxProbability(n: int, edges: list[list[int]], succProb: list[float], 
                   start: int, end: int) -> float:
    """
    Dijkstra's (max probability)
    Time: O(E log V)
    Space: O(V + E)
    """
    graph = defaultdict(list)
    for (u, v), prob in zip(edges, succProb):
        graph[u].append((v, prob))
        graph[v].append((u, prob))
    
    prob = [0.0] * n
    prob[start] = 1.0
    
    heap = [(-1.0, start)]  # Max-heap (negative for min-heap behavior)
    
    while heap:
        curr_prob, node = heapq.heappop(heap)
        curr_prob = -curr_prob
        
        if node == end:
            return curr_prob
        
        if curr_prob < prob[node]:
            continue
        
        for neighbor, edge_prob in graph[node]:
            new_prob = curr_prob * edge_prob
            if new_prob > prob[neighbor]:
                prob[neighbor] = new_prob
                heapq.heappush(heap, (-new_prob, neighbor))
    
    return 0.0
```

---

## 📊 Advanced Graphs Summary

| Problem | Algorithm | Key Insight |
|---------|-----------|-------------|
| Reconstruct Itinerary | Hierholzer | Eulerian path, post-order |
| Min Cost Connect | Prim's/Kruskal's | MST |
| Network Delay | Dijkstra | Single-source shortest path |
| Swim in Water | Modified Dijkstra | Minimize max along path |
| Alien Dictionary | Topological Sort | Order from word comparison |
| Cheapest Flights K | Bellman-Ford | Limited iterations |
| Critical Connections | Tarjan | Bridge finding |
| Accounts Merge | Union-Find | Group by root |
| Make Connected | Union-Find | Count components |
| Max Probability | Dijkstra | Maximize product |

### Algorithm Selection:

| Scenario | Algorithm |
|----------|-----------|
| Shortest path (unweighted) | BFS |
| Shortest path (weighted, positive) | Dijkstra |
| Shortest path (negative weights) | Bellman-Ford |
| All pairs shortest | Floyd-Warshall |
| Minimum spanning tree | Prim's/Kruskal's |
| Topological order | Kahn's/DFS |
| Detect cycle (directed) | Color DFS |
| Detect cycle (undirected) | Union-Find |
| Find bridges/articulation | Tarjan |
| Strongly connected components | Kosaraju/Tarjan |
