# Is Graph Bipartite?

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 785 | BFS/DFS Coloring |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if graph can be 2-colored such that no adjacent nodes have same color.

### Constraints & Clarifying Questions
1. **Graph format?** Adjacency list.
2. **Empty graph?** Bipartite.
3. **Disconnected?** Check all components.
4. **Self-loops?** Not bipartite.

### Edge Cases
1. **No edges:** Always bipartite
2. **Odd cycle:** Not bipartite
3. **Single node:** Bipartite

---

## Phase 2: High-Level Approach

### Approach: BFS/DFS 2-Coloring
Assign colors alternately. Conflict = not bipartite.

**Core Insight:** Odd cycle ⟺ not bipartite.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve_bfs(graph: List[List[int]]) -> bool:
    """
    Check bipartite using BFS coloring.
    
    Args:
        graph: Adjacency list
    
    Returns:
        True if bipartite
    """
    n = len(graph)
    color = [-1] * n  # -1 = uncolored, 0/1 = colors
    
    for start in range(n):
        if color[start] != -1:
            continue
        
        # BFS from this node
        queue = deque([start])
        color[start] = 0
        
        while queue:
            node = queue.popleft()
            
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False  # Conflict!
    
    return True


def solve_dfs(graph: List[List[int]]) -> bool:
    """
    Check bipartite using DFS coloring.
    
    Args:
        graph: Adjacency list
    
    Returns:
        True if bipartite
    """
    n = len(graph)
    color = [-1] * n
    
    def dfs(node: int, c: int) -> bool:
        color[node] = c
        
        for neighbor in graph[node]:
            if color[neighbor] == -1:
                if not dfs(neighbor, 1 - c):
                    return False
            elif color[neighbor] == c:
                return False
        
        return True
    
    for node in range(n):
        if color[node] == -1:
            if not dfs(node, 0):
                return False
    
    return True


def solve_union_find(graph: List[List[int]]) -> bool:
    """
    Union-Find approach: all neighbors should be in same group.
    """
    n = len(graph)
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        parent[find(x)] = find(y)
    
    for node in range(n):
        if not graph[node]:
            continue
        
        # All neighbors should be in same group (opposite to node)
        first_neighbor = graph[node][0]
        
        for neighbor in graph[node]:
            # Node and neighbor should be in different groups
            if find(node) == find(neighbor):
                return False
            
            # Union all neighbors together
            union(first_neighbor, neighbor)
    
    return True
```

---

## Phase 4: Dry Run

**Input:** `[[1,3], [0,2], [1,3], [0,2]]`

```
0 --- 1
|     |
3 --- 2
```

**BFS Coloring:**

| Step | Node | Color | Queue |
|------|------|-------|-------|
| 1 | 0 | 0 | [1,3] |
| 2 | 1 | 1 | [3,2] |
| 3 | 3 | 1 | [2] |
| 4 | 2 | 0 | [] |

Check neighbors:
- 2's neighbor 1 has color 1 ≠ 0 ✓
- 2's neighbor 3 has color 1 ≠ 0 ✓

**Result:** True (bipartite)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(V + E)
Visit each node and edge once.

### Space Complexity: O(V)
Color array + queue/stack.

---

## Phase 6: Follow-Up Questions

1. **"Find odd cycle?"**
   → Track parent during BFS; reconstruct when conflict found.

2. **"Make graph bipartite with minimum edge removals?"**
   → NP-hard; approximation algorithms.

3. **"Maximum bipartite matching?"**
   → Hungarian algorithm or Hopcroft-Karp.
