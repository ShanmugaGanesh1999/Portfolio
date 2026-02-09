# 🎯 Graphs - Complete Guide

## 📌 What is a Graph?

A graph G = (V, E) consists of:
- **V (Vertices/Nodes)**: Set of objects
- **E (Edges)**: Connections between vertices

---

## 📊 Types of Graphs

### 1. Directed vs Undirected
```
Undirected:          Directed:
A ---- B             A ---→ B
|      |             ↓      ↓
C ---- D             C ---→ D
```

### 2. Weighted vs Unweighted
```
Unweighted:          Weighted:
A ---- B             A --5-- B
|      |             |       |
C ---- D             3       7
                     |       |
                     C --2-- D
```

### 3. Cyclic vs Acyclic
- **Cyclic**: Contains at least one cycle
- **Acyclic**: No cycles (DAG = Directed Acyclic Graph)

---

## 🔧 Graph Representations

### 1. Adjacency List (Preferred)

```python
# Using dictionary (most common)
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2]
}

# Using defaultdict
from collections import defaultdict

def build_graph(edges):
    """
    Build adjacency list from edge list.
    edges: List of [u, v] pairs
    """
    graph = defaultdict(list)
    
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)  # Remove for directed
    
    return graph

# Example
edges = [[0, 1], [0, 2], [1, 3], [2, 3]]
graph = build_graph(edges)
# {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
```

**Complexity:**
- Space: O(V + E)
- Add edge: O(1)
- Check edge: O(degree)
- Get neighbors: O(1)

### 2. Adjacency Matrix

```python
def build_matrix(n, edges):
    """
    Build adjacency matrix.
    n: number of nodes
    """
    matrix = [[0] * n for _ in range(n)]
    
    for u, v in edges:
        matrix[u][v] = 1
        matrix[v][u] = 1  # Remove for directed
    
    return matrix

# Example
n = 4
edges = [[0, 1], [0, 2], [1, 3], [2, 3]]
matrix = build_matrix(n, edges)
# [[0, 1, 1, 0],
#  [1, 0, 0, 1],
#  [1, 0, 0, 1],
#  [0, 1, 1, 0]]
```

**Complexity:**
- Space: O(V²)
- Add edge: O(1)
- Check edge: O(1)
- Get neighbors: O(V)

### When to Use Which?

| Scenario | Use |
|----------|-----|
| Sparse graph (E << V²) | Adjacency List |
| Dense graph (E ≈ V²) | Matrix |
| Need to check if edge exists | Matrix |
| Need to iterate neighbors | Adjacency List |
| Memory constrained | Adjacency List |

---

## 🔄 Graph Traversals

### Depth-First Search (DFS)

Go deep before going wide. Uses **stack** (or recursion).

```python
def dfs_recursive(graph: dict, start: int) -> list[int]:
    """
    DFS using recursion.
    
    Time: O(V + E)
    Space: O(V) for visited set + O(V) for recursion
    """
    visited = set()
    result = []
    
    def dfs(node):
        visited.add(node)
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    
    dfs(start)
    return result

def dfs_iterative(graph: dict, start: int) -> list[int]:
    """
    DFS using explicit stack.
    """
    visited = set()
    result = []
    stack = [start]
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to stack
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result
```

### Breadth-First Search (BFS)

Go level by level. Uses **queue**.

```python
from collections import deque

def bfs(graph: dict, start: int) -> list[int]:
    """
    BFS traversal.
    
    Time: O(V + E)
    Space: O(V)
    """
    visited = set([start])
    result = []
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

def bfs_with_levels(graph: dict, start: int) -> list[list[int]]:
    """
    BFS returning nodes by level.
    """
    visited = set([start])
    result = []
    queue = deque([start])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node)
            
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        result.append(current_level)
    
    return result
```

---

## 🔥 Classic Graph Problems

### Number of Islands (LC 200)

```python
def num_islands(grid: list[list[str]]) -> int:
    """
    Count connected components of '1's.
    
    DFS from each unvisited '1'.
    
    Time: O(M * N)
    Space: O(M * N) worst case for recursion
    """
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        # Base cases
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return
        
        # Mark as visited
        grid[r][c] = '0'
        
        # Explore all 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    
    return islands
```

### Clone Graph (LC 133)

```python
def clone_graph(node):
    """
    Deep copy a graph.
    
    Use hashmap to track cloned nodes.
    
    Time: O(V + E)
    Space: O(V)
    """
    if not node:
        return None
    
    cloned = {}  # original -> clone
    
    def dfs(node):
        if node in cloned:
            return cloned[node]
        
        # Create clone
        clone = Node(node.val)
        cloned[node] = clone
        
        # Clone neighbors
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)
```

### Shortest Path (BFS)

```python
def shortest_path(graph: dict, start: int, end: int) -> int:
    """
    Find shortest path in unweighted graph.
    
    BFS guarantees shortest path in unweighted graph.
    
    Time: O(V + E)
    Space: O(V)
    """
    if start == end:
        return 0
    
    visited = set([start])
    queue = deque([(start, 0)])
    
    while queue:
        node, distance = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor == end:
                return distance + 1
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, distance + 1))
    
    return -1  # No path
```

### Cycle Detection (Undirected Graph)

```python
def has_cycle_undirected(graph: dict, n: int) -> bool:
    """
    Detect cycle in undirected graph using DFS.
    
    A cycle exists if we visit a node that's already
    in the current DFS path (excluding parent).
    """
    visited = set()
    
    def dfs(node, parent):
        visited.add(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                # Visited but not parent = cycle
                return True
        
        return False
    
    # Check all components
    for i in range(n):
        if i not in visited:
            if dfs(i, -1):
                return True
    
    return False
```

### Cycle Detection (Directed Graph)

```python
def has_cycle_directed(graph: dict, n: int) -> bool:
    """
    Detect cycle in directed graph.
    
    Use three states:
    - 0: unvisited
    - 1: visiting (in current path)
    - 2: visited (finished)
    """
    state = [0] * n  # 0=unvisited, 1=visiting, 2=visited
    
    def dfs(node):
        state[node] = 1  # Visiting
        
        for neighbor in graph[node]:
            if state[neighbor] == 1:  # Back edge = cycle
                return True
            if state[neighbor] == 0:
                if dfs(neighbor):
                    return True
        
        state[node] = 2  # Visited
        return False
    
    for i in range(n):
        if state[i] == 0:
            if dfs(i):
                return True
    
    return False
```

---

## 📐 Grid as Graph

Many problems use 2D grids as implicit graphs.

```python
def grid_bfs(grid, start_r, start_c):
    """
    BFS on a grid.
    """
    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    visited = set()
    visited.add((start_r, start_c))
    queue = deque([(start_r, start_c)])
    
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < rows and 0 <= nc < cols:
                if (nr, nc) not in visited and grid[nr][nc] != '#':
                    visited.add((nr, nc))
                    queue.append((nr, nc))
```

---

## 📋 DFS vs BFS Summary

| Use Case | Best Choice |
|----------|-------------|
| Shortest path (unweighted) | BFS |
| Shortest path (weighted) | Dijkstra/BFS |
| Detect cycle | DFS |
| Topological sort | DFS |
| Find any path | DFS |
| Level-order traversal | BFS |
| Connected components | DFS or BFS |
| Check bipartite | BFS or DFS |
