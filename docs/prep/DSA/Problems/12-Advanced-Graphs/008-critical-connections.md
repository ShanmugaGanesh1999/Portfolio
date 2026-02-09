# Critical Connections in a Network

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 1192 | Tarjan's Algorithm (Bridges) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all bridges (edges whose removal disconnects the graph).

### Constraints & Clarifying Questions
1. **Bridge definition?** Edge that if removed, increases number of components.
2. **Graph connected?** Yes initially.
3. **Multiple edges same pair?** No.
4. **Return order?** Any order.

### Edge Cases
1. **Tree (n-1 edges):** All edges are bridges
2. **Cycle:** No bridges in cycle
3. **Two nodes:** Single edge is bridge

---

## Phase 2: High-Level Approach

### Approach: Tarjan's Algorithm
DFS with discovery time and low-link values. Bridge if low[v] > disc[u].

**Core Insight:** Low-link is minimum discovery time reachable. Bridge can't be bypassed.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict


def solve(n: int, connections: List[List[int]]) -> List[List[int]]:
    """
    Find all bridges using Tarjan's algorithm.
    
    Args:
        n: Number of nodes
        connections: List of [u, v] edges
    
    Returns:
        List of bridge edges
    """
    graph = defaultdict(list)
    for u, v in connections:
        graph[u].append(v)
        graph[v].append(u)
    
    disc = [-1] * n  # Discovery time
    low = [-1] * n   # Lowest reachable discovery time
    bridges = []
    time = [0]  # Use list for mutable in nested function
    
    def dfs(node: int, parent: int):
        disc[node] = low[node] = time[0]
        time[0] += 1
        
        for neighbor in graph[node]:
            if disc[neighbor] == -1:  # Not visited
                dfs(neighbor, node)
                
                # Update low-link
                low[node] = min(low[node], low[neighbor])
                
                # Bridge condition: can't reach node or earlier from neighbor
                if low[neighbor] > disc[node]:
                    bridges.append([node, neighbor])
            
            elif neighbor != parent:
                # Back edge - update low-link
                low[node] = min(low[node], disc[neighbor])
    
    # Handle potentially disconnected graph
    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    
    return bridges


def solve_iterative(n: int, connections: List[List[int]]) -> List[List[int]]:
    """
    Iterative version to avoid recursion limit.
    """
    graph = defaultdict(list)
    for u, v in connections:
        graph[u].append(v)
        graph[v].append(u)
    
    disc = [-1] * n
    low = [-1] * n
    bridges = []
    time = 0
    
    for start in range(n):
        if disc[start] != -1:
            continue
        
        # Stack: (node, parent, iterator index)
        stack = [(start, -1, 0)]
        
        while stack:
            node, parent, idx = stack.pop()
            
            if idx == 0:
                disc[node] = low[node] = time
                time += 1
            
            neighbors = graph[node]
            
            while idx < len(neighbors):
                neighbor = neighbors[idx]
                idx += 1
                
                if disc[neighbor] == -1:
                    stack.append((node, parent, idx))
                    stack.append((neighbor, node, 0))
                    break
                elif neighbor != parent:
                    low[node] = min(low[node], disc[neighbor])
            else:
                # All neighbors processed
                if parent != -1:
                    low[parent] = min(low[parent], low[node])
                    if low[node] > disc[parent]:
                        bridges.append([parent, node])
    
    return bridges
```

---

## Phase 4: Dry Run

**Input:** `n = 4, connections = [[0,1], [1,2], [2,0], [1,3]]`

```
0 --- 1 --- 3
 \   /
  \ /
   2
```

**DFS from 0:**

| Node | disc | low | Action |
|------|------|-----|--------|
| 0 | 0 | 0 | Visit 1 |
| 1 | 1 | 1 | Visit 2 |
| 2 | 2 | 0 | Back edge to 0: low[2]=0 |
| 1 | 1 | 0 | low[1]=min(1,0)=0; Visit 3 |
| 3 | 3 | 3 | No unvisited neighbors |
| 1 | 1 | 0 | low[3]=3 > disc[1]=1 → Bridge [1,3] |

**Result:** `[[1, 3]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(V + E)
Each node and edge visited once.

### Space Complexity: O(V + E)
Graph + arrays.

---

## Phase 6: Follow-Up Questions

1. **"Find articulation points?"**
   → Similar: root with ≥2 children or non-root with low[v] ≥ disc[u].

2. **"Make graph 2-edge-connected?"**
   → Add edges to connect bridge components.

3. **"Count components after removing edge?"**
   → If bridge: components + 1; else same.
