# Find Eventual Safe States

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 802 | Graph + DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all nodes that eventually reach terminal nodes (no outgoing edges).

### Constraints & Clarifying Questions
1. **Terminal node?** Node with no outgoing edges.
2. **Safe = no cycles?** Path from safe node never enters cycle.
3. **Return sorted?** Yes.
4. **Empty graph?** Return empty.

### Edge Cases
1. **All terminal:** All are safe
2. **Self-loop:** That node is unsafe
3. **Cycle with exit:** Nodes outside cycle safe

---

## Phase 2: High-Level Approach

### Approach 1: DFS with Cycle Detection
Node is safe if all successors are safe. Track states: unvisited, visiting (in stack), safe, unsafe.

### Approach 2: Reverse Graph + Topological Sort
Reverse edges. Start from terminals. Process in reverse topo order.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve_dfs(graph: List[List[int]]) -> List[int]:
    """
    Find safe nodes using DFS.
    
    Args:
        graph: Adjacency list
    
    Returns:
        Sorted list of safe nodes
    """
    n = len(graph)
    # States: 0=unvisited, 1=visiting, 2=safe, 3=unsafe
    state = [0] * n
    
    def dfs(node: int) -> bool:
        if state[node] == 1:  # Cycle
            return False
        if state[node] == 2:  # Already safe
            return True
        if state[node] == 3:  # Already unsafe
            return False
        
        state[node] = 1  # Mark visiting
        
        for neighbor in graph[node]:
            if not dfs(neighbor):
                state[node] = 3
                return False
        
        state[node] = 2  # Mark safe
        return True
    
    safe_nodes = []
    for node in range(n):
        if dfs(node):
            safe_nodes.append(node)
    
    return safe_nodes


def solve_reverse_topo(graph: List[List[int]]) -> List[int]:
    """
    Reverse graph + BFS from terminals.
    """
    from collections import defaultdict
    
    n = len(graph)
    
    # Build reverse graph and out-degree
    reverse_graph = defaultdict(list)
    out_degree = [0] * n
    
    for node in range(n):
        out_degree[node] = len(graph[node])
        for neighbor in graph[node]:
            reverse_graph[neighbor].append(node)
    
    # Start with terminal nodes (out_degree = 0)
    queue = deque([i for i in range(n) if out_degree[i] == 0])
    safe = set(queue)
    
    while queue:
        node = queue.popleft()
        
        for predecessor in reverse_graph[node]:
            out_degree[predecessor] -= 1
            
            if out_degree[predecessor] == 0:
                safe.add(predecessor)
                queue.append(predecessor)
    
    return sorted(safe)
```

---

## Phase 4: Dry Run

**Input:** `[[1,2],[2,3],[5],[0],[5],[],[]]`

```
0 → 1 → 2 → 5
    ↓   ↓
    3 → 0  (cycle 0→1→2→3→0)
    
4 → 5
6 (terminal)
```

**DFS:**
- Node 5: no neighbors → safe
- Node 6: no neighbors → safe
- Node 4: neighbor 5 safe → safe
- Node 2: neighbor 5 safe, but 3 leads to cycle
- Node 3: neighbor 0 leads to cycle → unsafe
- Node 1: neighbors 2,3 → 3 unsafe → unsafe
- Node 0: neighbors 1,2 → 1 unsafe → unsafe

**Result:** `[2, 4, 5, 6]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(V + E)
Each node and edge visited once.

### Space Complexity: O(V)
State array + recursion stack.

---

## Phase 6: Follow-Up Questions

1. **"Find all nodes in cycles?"**
   → SCC (Strongly Connected Components).

2. **"Longest path from safe nodes?"**
   → DP on topological order of safe subgraph.

3. **"Make all nodes safe with minimum edge removals?"**
   → Find and break cycles; more complex.
