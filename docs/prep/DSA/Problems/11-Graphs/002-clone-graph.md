# Clone Graph

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 133 | Graph DFS/BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Deep copy a connected undirected graph. Each node has value and list of neighbors.

### Constraints & Clarifying Questions
1. **Cycles allowed?** Yes.
2. **Self-loops?** Possible.
3. **Empty graph?** Return None.
4. **Single node?** Copy it.

### Edge Cases
1. **None input:** Return None
2. **Single node no neighbors:** Copy just that node
3. **Fully connected:** Handle cycles properly

---

## Phase 2: High-Level Approach

### Approach: DFS/BFS with HashMap
Map original nodes to clones. Create clone on first visit; reuse on subsequent visits.

**Core Insight:** HashMap prevents infinite loops and ensures same clone reused.

---

## Phase 3: Python Code

```python
from typing import Optional, Dict
from collections import deque


class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def solve_dfs(node: Optional[Node]) -> Optional[Node]:
    """
    Clone graph using DFS.
    
    Args:
        node: Starting node of graph
    
    Returns:
        Clone of starting node
    """
    if not node:
        return None
    
    cloned: Dict[Node, Node] = {}
    
    def dfs(original: Node) -> Node:
        # Already cloned
        if original in cloned:
            return cloned[original]
        
        # Create clone
        clone = Node(original.val)
        cloned[original] = clone
        
        # Clone neighbors
        for neighbor in original.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)


def solve_bfs(node: Optional[Node]) -> Optional[Node]:
    """
    Clone graph using BFS.
    
    Args:
        node: Starting node of graph
    
    Returns:
        Clone of starting node
    """
    if not node:
        return None
    
    cloned = {node: Node(node.val)}
    queue = deque([node])
    
    while queue:
        original = queue.popleft()
        
        for neighbor in original.neighbors:
            if neighbor not in cloned:
                cloned[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            
            cloned[original].neighbors.append(cloned[neighbor])
    
    return cloned[node]
```

---

## Phase 4: Dry Run

**Graph:**
```
1 -- 2
|    |
4 -- 3
```

**DFS from node 1:**

| Visit | Action | cloned |
|-------|--------|--------|
| 1 | Create clone 1' | {1: 1'} |
| 2 (neighbor) | Create 2', add to 1'.neighbors | {1: 1', 2: 2'} |
| 3 (from 2) | Create 3', add to 2'.neighbors | {1: 1', 2: 2', 3: 3'} |
| 4 (from 3) | Create 4', add to 3'.neighbors | {1: 1', 2: 2', 3: 3', 4: 4'} |
| 1 (from 4) | Already cloned, return 1' | |

**Result:** Complete deep copy

---

## Phase 5: Complexity Analysis

### Time Complexity: O(V + E)
Visit each node and edge once.

### Space Complexity: O(V)
HashMap + recursion stack.

---

## Phase 6: Follow-Up Questions

1. **"Clone directed graph?"**
   → Same approach; edges are one-way.

2. **"Clone with random pointers?"**
   → Similar HashMap approach (like copy linked list with random).

3. **"Serialize and deserialize graph?"**
   → Use adjacency list format with BFS/DFS.
