# Graph Valid Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 261 | Union-Find / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if graph is a valid tree: connected and no cycles.

### Constraints & Clarifying Questions
1. **Tree properties?** n-1 edges, connected, no cycles.
2. **Edge format?** [u, v] undirected.
3. **Empty graph?** n=0 or n=1 valid tree.
4. **Duplicate edges?** Not in valid input.

### Edge Cases
1. **n=0:** True (or False depending on definition)
2. **n=1, no edges:** True
3. **n=2, one edge:** True

---

## Phase 2: High-Level Approach

### Approach 1: Union-Find
Valid tree: exactly n-1 edges and no cycle (union fails = cycle).

### Approach 2: DFS
Check connected and no cycle simultaneously.

**Core Insight:** Tree = n-1 edges + connected.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict


def solve_union_find(n: int, edges: List[List[int]]) -> bool:
    """
    Check valid tree using Union-Find.
    
    Args:
        n: Number of nodes
        edges: List of [u, v] edges
    
    Returns:
        True if valid tree
    """
    # Tree must have exactly n-1 edges
    if len(edges) != n - 1:
        return False
    
    parent = list(range(n))
    rank = [0] * n
    
    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x: int, y: int) -> bool:
        px, py = find(x), find(y)
        if px == py:
            return False  # Cycle detected
        
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        
        return True
    
    for u, v in edges:
        if not union(u, v):
            return False
    
    return True


def solve_dfs(n: int, edges: List[List[int]]) -> bool:
    """
    Check valid tree using DFS.
    
    Args:
        n: Number of nodes
        edges: List of [u, v] edges
    
    Returns:
        True if valid tree
    """
    if len(edges) != n - 1:
        return False
    
    # Build adjacency list
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    
    def dfs(node: int, parent: int) -> bool:
        visited.add(node)
        
        for neighbor in graph[node]:
            if neighbor == parent:
                continue
            if neighbor in visited:
                return False  # Cycle
            if not dfs(neighbor, node):
                return False
        
        return True
    
    # Check for cycle
    if not dfs(0, -1):
        return False
    
    # Check connectivity
    return len(visited) == n
```

---

## Phase 4: Dry Run

**Input:** `n = 5, edges = [[0,1], [0,2], [0,3], [1,4]]`

**Check:** 4 edges = 5-1 = 4 ✓

**Union-Find:**

| Edge | Union | Parent |
|------|-------|--------|
| [0,1] | union(0,1) | [0,0,2,3,4] |
| [0,2] | union(0,2) | [0,0,0,3,4] |
| [0,3] | union(0,3) | [0,0,0,0,4] |
| [1,4] | union(1,4)=union(0,4) | [0,0,0,0,0] |

All unions succeed → **True**

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × α(N)) ≈ O(N)
α = inverse Ackermann (nearly constant).

### Space Complexity: O(N)
Parent array.

---

## Phase 6: Follow-Up Questions

1. **"Make graph into valid tree with minimum edge removals?"**
   → Remove cycle edges; connect components.

2. **"Find all bridges in graph?"**
   → Tarjan's algorithm.

3. **"Check if adding edge creates cycle?"**
   → Union-Find: if find(u) == find(v).
