# 🕸️ Graphs - Complete Problem Set

## Problem 1: Number of Islands (Medium)
**LeetCode 200**

### Problem
Count number of islands in grid of '1' (land) and '0' (water).

### Intuition
DFS/BFS from each unvisited land cell, marking all connected land.

### Solution
```python
def numIslands(grid: list[list[str]]) -> int:
    """
    Time: O(m * n)
    Space: O(m * n) worst case for DFS stack
    """
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        
        grid[r][c] = '0'  # Mark visited
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count
```

---

## Problem 2: Clone Graph (Medium)
**LeetCode 133**

### Problem
Deep copy a graph.

### Intuition
HashMap old→new. DFS/BFS creating nodes as we traverse.

### Solution
```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors else []

def cloneGraph(node: Node) -> Node:
    """
    Time: O(V + E)
    Space: O(V)
    """
    if not node:
        return None
    
    old_to_new = {}
    
    def dfs(node):
        if node in old_to_new:
            return old_to_new[node]
        
        copy = Node(node.val)
        old_to_new[node] = copy
        
        for neighbor in node.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)
```

---

## Problem 3: Max Area of Island (Medium)
**LeetCode 695**

### Problem
Find maximum area of an island.

### Intuition
DFS counting cells in each island.

### Solution
```python
def maxAreaOfIsland(grid: list[list[int]]) -> int:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
            return 0
        
        grid[r][c] = 0  # Mark visited
        
        return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)
    
    max_area = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
    
    return max_area
```

---

## Problem 4: Pacific Atlantic Water Flow (Medium)
**LeetCode 417**

### Problem
Find cells that can flow to both Pacific and Atlantic oceans.

### Intuition
Reverse thinking: DFS from oceans inward. Find intersection.

### Solution
```python
def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    if not heights:
        return []
    
    rows, cols = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, reachable, prev_height):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            (r, c) in reachable or heights[r][c] < prev_height):
            return
        
        reachable.add((r, c))
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            dfs(r + dr, c + dc, reachable, heights[r][c])
    
    # Start from ocean edges
    for c in range(cols):
        dfs(0, c, pacific, 0)  # Top edge (Pacific)
        dfs(rows - 1, c, atlantic, 0)  # Bottom edge (Atlantic)
    
    for r in range(rows):
        dfs(r, 0, pacific, 0)  # Left edge (Pacific)
        dfs(r, cols - 1, atlantic, 0)  # Right edge (Atlantic)
    
    return list(pacific & atlantic)
```

---

## Problem 5: Surrounded Regions (Medium)
**LeetCode 130**

### Problem
Capture all 'O' regions surrounded by 'X'.

### Intuition
Border 'O's and connected can't be captured. Mark them, then flip rest.

### Solution
```python
def solve(board: list[list[str]]) -> None:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    if not board:
        return
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != 'O':
            return
        
        board[r][c] = 'T'  # Temporary mark
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    # Mark border-connected O's
    for r in range(rows):
        dfs(r, 0)
        dfs(r, cols - 1)
    
    for c in range(cols):
        dfs(0, c)
        dfs(rows - 1, c)
    
    # Flip O to X, T back to O
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'
```

---

## Problem 6: Rotting Oranges (Medium)
**LeetCode 994**

### Problem
Find minimum time for all oranges to rot. Rotten spreads each minute.

### Intuition
Multi-source BFS from all rotten oranges simultaneously.

### Solution
```python
from collections import deque

def orangesRotting(grid: list[list[int]]) -> int:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    
    # Find all rotten and count fresh
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1
    
    if fresh == 0:
        return 0
    
    minutes = 0
    
    while queue:
        r, c, time = queue.popleft()
        minutes = time
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc, time + 1))
    
    return minutes if fresh == 0 else -1
```

---

## Problem 7: Walls and Gates (Medium)
**LeetCode 286**

### Problem
Fill each empty room with distance to nearest gate.

### Intuition
Multi-source BFS from all gates.

### Solution
```python
def wallsAndGates(rooms: list[list[int]]) -> None:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    if not rooms:
        return
    
    INF = 2147483647
    rows, cols = len(rooms), len(rooms[0])
    queue = deque()
    
    # Find all gates
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                queue.append((r, c))
    
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == INF:
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))
```

---

## Problem 8: Course Schedule (Medium)
**LeetCode 207**

### Problem
Check if possible to finish all courses (no cycle in prerequisites).

### Intuition
Detect cycle in directed graph using DFS with colors or Kahn's algorithm.

### Solution
```python
def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    """
    DFS cycle detection
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[course].append(prereq)
    
    # 0: unvisited, 1: visiting, 2: visited
    state = [0] * numCourses
    
    def has_cycle(node):
        if state[node] == 1:  # Cycle detected
            return True
        if state[node] == 2:  # Already processed
            return False
        
        state[node] = 1  # Mark visiting
        
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        
        state[node] = 2  # Mark visited
        return False
    
    for course in range(numCourses):
        if has_cycle(course):
            return False
    
    return True
```

---

## Problem 9: Course Schedule II (Medium)
**LeetCode 210**

### Problem
Return order to take all courses (topological sort).

### Intuition
Topological sort using DFS or Kahn's algorithm.

### Solution
```python
def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    """
    Kahn's Algorithm (BFS)
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    order = []
    
    while queue:
        course = queue.popleft()
        order.append(course)
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return order if len(order) == numCourses else []
```

---

## Problem 10: Graph Valid Tree (Medium)
**LeetCode 261**

### Problem
Check if edges form a valid tree with n nodes.

### Intuition
Tree = connected + no cycles. Check edges = n-1 and all nodes reachable.

### Solution
```python
def validTree(n: int, edges: list[list[int]]) -> bool:
    """
    Time: O(V + E)
    Space: O(V + E)
    """
    # Tree must have exactly n-1 edges
    if len(edges) != n - 1:
        return False
    
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    # BFS to check connectivity
    visited = set([0])
    queue = deque([0])
    
    while queue:
        node = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return len(visited) == n
```

---

## Problem 11: Number of Connected Components (Medium)
**LeetCode 323**

### Problem
Count connected components in undirected graph.

### Intuition
DFS/BFS from unvisited nodes, count number of times we start.

### Solution
```python
def countComponents(n: int, edges: list[list[int]]) -> int:
    """
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    components = 0
    
    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    
    for i in range(n):
        if i not in visited:
            components += 1
            dfs(i)
    
    return components
```

---

## Problem 12: Redundant Connection (Medium)
**LeetCode 684**

### Problem
Find edge that can be removed to make tree.

### Intuition
Use Union-Find. The edge that connects already-connected nodes is redundant.

### Solution
```python
def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    """
    Union-Find
    Time: O(n * α(n)) ≈ O(n)
    Space: O(n)
    """
    n = len(edges)
    parent = list(range(n + 1))
    rank = [0] * (n + 1)
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])  # Path compression
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False  # Already connected
        
        # Union by rank
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        
        return True
    
    for u, v in edges:
        if not union(u, v):
            return [u, v]
    
    return []
```

---

## Problem 13: Word Ladder (Hard)
**LeetCode 127**

### Problem
Find shortest transformation from beginWord to endWord.

### Intuition
BFS where neighbors differ by one character.

### Solution
```python
def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:
    """
    Time: O(m² * n) where m = word length, n = words count
    Space: O(m² * n)
    """
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    
    while queue:
        word, length = queue.popleft()
        
        if word == endWord:
            return length
        
        # Try all single-character changes
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    return 0
```

---

## Problem 14: Snakes and Ladders (Medium)
**LeetCode 909**

### Problem
Find minimum moves to reach last cell in snakes and ladders board.

### Intuition
BFS treating board as graph. Handle special cells (snakes/ladders).

### Solution
```python
def snakesAndLadders(board: list[list[int]]) -> int:
    """
    Time: O(n²)
    Space: O(n²)
    """
    n = len(board)
    
    def get_position(num):
        """Convert 1-indexed number to (row, col)"""
        num -= 1
        row = n - 1 - num // n
        col = num % n if (n - 1 - row) % 2 == 0 else n - 1 - num % n
        return row, col
    
    visited = set([1])
    queue = deque([(1, 0)])  # (position, moves)
    
    while queue:
        pos, moves = queue.popleft()
        
        for i in range(1, 7):  # Dice roll
            next_pos = pos + i
            
            if next_pos > n * n:
                continue
            
            r, c = get_position(next_pos)
            
            # Check for snake/ladder
            if board[r][c] != -1:
                next_pos = board[r][c]
            
            if next_pos == n * n:
                return moves + 1
            
            if next_pos not in visited:
                visited.add(next_pos)
                queue.append((next_pos, moves + 1))
    
    return -1
```

---

## Problem 15: Open the Lock (Medium)
**LeetCode 752**

### Problem
Find minimum turns to open lock from "0000" to target.

### Intuition
BFS where neighbors are adjacent wheel positions.

### Solution
```python
def openLock(deadends: list[str], target: str) -> int:
    """
    Time: O(10^4 * 4 * 10) = O(d + 10^4)
    Space: O(10^4)
    """
    dead_set = set(deadends)
    
    if "0000" in dead_set:
        return -1
    
    if target == "0000":
        return 0
    
    def get_neighbors(state):
        neighbors = []
        for i in range(4):
            digit = int(state[i])
            for delta in [-1, 1]:
                new_digit = (digit + delta) % 10
                new_state = state[:i] + str(new_digit) + state[i+1:]
                neighbors.append(new_state)
        return neighbors
    
    visited = {"0000"}
    queue = deque([("0000", 0)])
    
    while queue:
        state, turns = queue.popleft()
        
        for neighbor in get_neighbors(state):
            if neighbor == target:
                return turns + 1
            
            if neighbor not in visited and neighbor not in dead_set:
                visited.add(neighbor)
                queue.append((neighbor, turns + 1))
    
    return -1
```

---

## Problem 16: Evaluate Division (Medium)
**LeetCode 399**

### Problem
Given equations a/b=k, evaluate queries.

### Intuition
Build graph with edge weights. DFS/BFS to find path product.

### Solution
```python
def calcEquation(equations: list[list[str]], values: list[float], 
                 queries: list[list[str]]) -> list[float]:
    """
    Time: O(E + Q * V) where Q = queries
    Space: O(E)
    """
    from collections import defaultdict
    
    graph = defaultdict(dict)
    
    # Build graph
    for (a, b), val in zip(equations, values):
        graph[a][b] = val
        graph[b][a] = 1 / val
    
    def dfs(src, dst, visited):
        if src not in graph or dst not in graph:
            return -1.0
        if src == dst:
            return 1.0
        
        visited.add(src)
        
        for neighbor, weight in graph[src].items():
            if neighbor not in visited:
                result = dfs(neighbor, dst, visited)
                if result != -1.0:
                    return weight * result
        
        return -1.0
    
    return [dfs(a, b, set()) for a, b in queries]
```

---

## Problem 17: Cheapest Flights Within K Stops (Medium)
**LeetCode 787**

### Problem
Find cheapest flight with at most k stops.

### Intuition
Modified Dijkstra or Bellman-Ford limited to k+1 edges.

### Solution
```python
def findCheapestPrice(n: int, flights: list[list[int]], src: int, 
                      dst: int, k: int) -> int:
    """
    Bellman-Ford variant
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
```

---

## Problem 18: Minimum Cost to Connect All Points (Medium)
**LeetCode 1584**

### Problem
Find minimum cost to connect all points (Minimum Spanning Tree).

### Intuition
Prim's or Kruskal's MST algorithm.

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
    
    def distance(i, j):
        return abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
    
    total_cost = 0
    visited = set([0])
    heap = []
    
    # Add edges from node 0
    for i in range(1, n):
        heapq.heappush(heap, (distance(0, i), i))
    
    while len(visited) < n:
        cost, node = heapq.heappop(heap)
        
        if node in visited:
            continue
        
        visited.add(node)
        total_cost += cost
        
        # Add edges from new node
        for i in range(n):
            if i not in visited:
                heapq.heappush(heap, (distance(node, i), i))
    
    return total_cost
```

---

## Problem 19: Network Delay Time (Medium)
**LeetCode 743**

### Problem
Find time for all nodes to receive signal (shortest path from source to all).

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
    
    if len(dist) == n:
        return max(dist.values())
    return -1
```

---

## Problem 20: Path with Minimum Effort (Medium)
**LeetCode 1631**

### Problem
Find path minimizing maximum absolute difference in heights.

### Intuition
Modified Dijkstra where edge weight is max difference so far.

### Solution
```python
def minimumEffortPath(heights: list[list[int]]) -> int:
    """
    Dijkstra's Algorithm
    Time: O(m * n * log(m * n))
    Space: O(m * n)
    """
    rows, cols = len(heights), len(heights[0])
    
    dist = [[float('inf')] * cols for _ in range(rows)]
    dist[0][0] = 0
    
    heap = [(0, 0, 0)]  # (effort, row, col)
    
    while heap:
        effort, r, c = heapq.heappop(heap)
        
        if r == rows - 1 and c == cols - 1:
            return effort
        
        if effort > dist[r][c]:
            continue
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < rows and 0 <= nc < cols:
                new_effort = max(effort, abs(heights[nr][nc] - heights[r][c]))
                
                if new_effort < dist[nr][nc]:
                    dist[nr][nc] = new_effort
                    heapq.heappush(heap, (new_effort, nr, nc))
    
    return 0
```

---

## Problem 21: Swim in Rising Water (Hard)
**LeetCode 778**

### Problem
Find minimum time to swim from top-left to bottom-right.

### Intuition
Modified Dijkstra where edge weight is max height so far.

### Solution
```python
def swimInWater(grid: list[list[int]]) -> int:
    """
    Dijkstra's Algorithm
    Time: O(n² log n)
    Space: O(n²)
    """
    n = len(grid)
    
    dist = [[float('inf')] * n for _ in range(n)]
    dist[0][0] = grid[0][0]
    
    heap = [(grid[0][0], 0, 0)]
    
    while heap:
        time, r, c = heapq.heappop(heap)
        
        if r == n - 1 and c == n - 1:
            return time
        
        if time > dist[r][c]:
            continue
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < n and 0 <= nc < n:
                new_time = max(time, grid[nr][nc])
                
                if new_time < dist[nr][nc]:
                    dist[nr][nc] = new_time
                    heapq.heappush(heap, (new_time, nr, nc))
    
    return 0
```

---

## 📊 Graphs Summary

| Problem | Type | Algorithm | Key Insight |
|---------|------|-----------|-------------|
| Number of Islands | Grid | DFS/BFS | Mark visited |
| Clone Graph | General | DFS | HashMap old→new |
| Pacific Atlantic | Grid | Multi-DFS | Reverse from edges |
| Rotting Oranges | Grid | Multi-BFS | Start from all rotten |
| Course Schedule | Directed | Cycle Detection | Color states |
| Valid Tree | Undirected | BFS | edges = n-1 + connected |
| Connected Components | Undirected | DFS/Union-Find | Count starts |
| Redundant Connection | Undirected | Union-Find | First cycle edge |
| Word Ladder | Implicit | BFS | Transform neighbors |
| Cheapest Flights | Weighted | Bellman-Ford | k+1 iterations |
| MST | Weighted | Prim's/Kruskal's | Greedy edge selection |
| Shortest Path | Weighted | Dijkstra | Priority queue |
