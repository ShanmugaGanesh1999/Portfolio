# Number of Connected Components

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 323 | Union-Find / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count connected components in undirected graph.

### Constraints & Clarifying Questions
1. **Edges undirected?** Yes.
2. **Isolated nodes?** Each is a component.
3. **Empty graph?** n components if n nodes, 0 edges.
4. **Self-loops?** Not typical.

### Edge Cases
1. **No edges:** n components
2. **Fully connected:** 1 component
3. **n=0:** 0 components

---

## Phase 2: High-Level Approach

### Approach 1: Union-Find
Count distinct roots after processing all edges.

### Approach 2: DFS
Count how many DFS calls needed to visit all nodes.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict


def solve_union_find(n: int, edges: List[List[int]]) -> int:
    """
    Count components using Union-Find.
    
    Args:
        n: Number of nodes
        edges: List of [u, v] edges
    
    Returns:
        Number of connected components
    """
    parent = list(range(n))
    rank = [0] * n
    components = n  # Start with n components
    
    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x: int, y: int):
        nonlocal components
        px, py = find(x), find(y)
        
        if px == py:
            return  # Already connected
        
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        
        components -= 1  # Merged two components
    
    for u, v in edges:
        union(u, v)
    
    return components


def solve_dfs(n: int, edges: List[List[int]]) -> int:
    """
    Count components using DFS.
    
    Args:
        n: Number of nodes
        edges: List of [u, v] edges
    
    Returns:
        Number of connected components
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    components = 0
    
    def dfs(node: int):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
    
    for node in range(n):
        if node not in visited:
            dfs(node)
            components += 1
    
    return components


def solve_bfs(n: int, edges: List[List[int]]) -> int:
    """
    BFS approach.
    """
    from collections import deque
    
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    components = 0
    
    for node in range(n):
        if node not in visited:
            queue = deque([node])
            visited.add(node)
            
            while queue:
                curr = queue.popleft()
                for neighbor in graph[curr]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            components += 1
    
    return components
```

---

## Phase 4: Dry Run

**Input:** `n = 5, edges = [[0,1], [1,2], [3,4]]`

**Union-Find:**

| Edge | Action | Components |
|------|--------|------------|
| Init | - | 5 |
| [0,1] | union(0,1) | 4 |
| [1,2] | union(1,2) | 3 |
| [3,4] | union(3,4) | 2 |

**Result:** 2

Components: {0,1,2} and {3,4}

---

## Phase 5: Complexity Analysis

### Union-Find:
- **Time:** O(E × α(N)) ≈ O(E)
- **Space:** O(N)

### DFS:
- **Time:** O(V + E)
- **Space:** O(V + E)

---

## Phase 6: Follow-Up Questions

1. **"Dynamic add/remove edges?"**
   → Union-Find for add; rebuild or use Link-Cut Trees for remove.

2. **"Size of each component?"**
   → Track size in Union-Find; or count in DFS.

3. **"Check if two nodes in same component?"**
   → Union-Find: check find(u) == find(v).
