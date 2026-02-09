# Redundant Connection

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 684 | Union-Find |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the edge that when removed makes the graph a valid tree (no cycle).

### Constraints & Clarifying Questions
1. **Which edge to return?** Last one in input that creates/maintains cycle.
2. **Graph type?** Undirected.
3. **Multiple answers?** Return last valid one in input order.
4. **Tree + 1 edge?** Yes, exactly one extra edge.

### Edge Cases
1. **Minimum input:** 3 nodes, 3 edges forming cycle
2. **Multiple cycles share edges:** Return last
3. **All edges form one cycle:** Return last

---

## Phase 2: High-Level Approach

### Approach: Union-Find
Process edges in order. First edge where union fails (already connected) is the answer.

**Core Insight:** The edge that connects already-connected nodes creates the cycle.

---

## Phase 3: Python Code

```python
from typing import List


def solve(edges: List[List[int]]) -> List[int]:
    """
    Find redundant edge using Union-Find.
    
    Args:
        edges: List of [u, v] edges
    
    Returns:
        Edge to remove
    """
    n = len(edges)
    parent = list(range(n + 1))
    rank = [0] * (n + 1)
    
    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x: int, y: int) -> bool:
        px, py = find(x), find(y)
        
        if px == py:
            return False  # Already connected - cycle!
        
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


def solve_dfs(edges: List[List[int]]) -> List[int]:
    """
    DFS approach: check connectivity before adding edge.
    """
    from collections import defaultdict
    
    graph = defaultdict(set)
    
    def is_connected(start, end, visited):
        if start == end:
            return True
        visited.add(start)
        for neighbor in graph[start]:
            if neighbor not in visited:
                if is_connected(neighbor, end, visited):
                    return True
        return False
    
    for u, v in edges:
        # Check if u and v already connected
        if is_connected(u, v, set()):
            return [u, v]
        graph[u].add(v)
        graph[v].add(u)
    
    return []
```

---

## Phase 4: Dry Run

**Input:** `[[1,2], [1,3], [2,3]]`

**Union-Find:**

| Edge | find(u) | find(v) | Action |
|------|---------|---------|--------|
| [1,2] | 1 | 2 | union → parent[2]=1 |
| [1,3] | 1 | 3 | union → parent[3]=1 |
| [2,3] | 1 | 1 | Same root! Return [2,3] |

**Result:** `[2, 3]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × α(N)) ≈ O(N)
N = number of edges.

### Space Complexity: O(N)
Parent and rank arrays.

---

## Phase 6: Follow-Up Questions

1. **"Redundant Connection II (directed graph)?"**
   → Check for two parents + cycle; more complex logic.

2. **"Remove minimum edges to make tree?"**
   → Count edges beyond n-1; remove those creating cycles.

3. **"Find all redundant edges?"**
   → Continue processing; collect all that fail union.
