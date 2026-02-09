# Evaluate Division

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 399 | Graph + DFS/BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Given equations a/b = k, answer queries x/y.

### Constraints & Clarifying Questions
1. **Variables are strings?** Yes.
2. **Division by zero?** Not in input.
3. **Unknown variable?** Return -1.0.
4. **Same variable query?** x/x = 1.0 if x exists.

### Edge Cases
1. **Query with unknown variable:** Return -1.0
2. **a/a:** Return 1.0
3. **Indirect path:** a/b × b/c = a/c

---

## Phase 2: High-Level Approach

### Approach: Weighted Graph + DFS
Build graph where edge a→b has weight a/b. Path multiplication gives answer.

**Core Insight:** Division is path traversal; multiplication along edges.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict


def solve(equations: List[List[str]], values: List[float], 
          queries: List[List[str]]) -> List[float]:
    """
    Evaluate division queries using graph.
    
    Args:
        equations: List of [a, b] meaning a/b
        values: Value of each equation
        queries: List of [x, y] to evaluate x/y
    
    Returns:
        List of answers
    """
    # Build weighted graph
    graph = defaultdict(dict)
    
    for (a, b), val in zip(equations, values):
        graph[a][b] = val
        graph[b][a] = 1.0 / val
    
    def dfs(start: str, end: str, visited: set) -> float:
        if start not in graph or end not in graph:
            return -1.0
        
        if start == end:
            return 1.0
        
        visited.add(start)
        
        for neighbor, weight in graph[start].items():
            if neighbor not in visited:
                result = dfs(neighbor, end, visited)
                if result != -1.0:
                    return weight * result
        
        return -1.0
    
    return [dfs(x, y, set()) for x, y in queries]


def solve_bfs(equations: List[List[str]], values: List[float],
              queries: List[List[str]]) -> List[float]:
    """
    BFS approach.
    """
    from collections import deque
    
    graph = defaultdict(dict)
    for (a, b), val in zip(equations, values):
        graph[a][b] = val
        graph[b][a] = 1.0 / val
    
    def bfs(start, end):
        if start not in graph or end not in graph:
            return -1.0
        
        queue = deque([(start, 1.0)])
        visited = {start}
        
        while queue:
            node, product = queue.popleft()
            
            if node == end:
                return product
            
            for neighbor, weight in graph[node].items():
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, product * weight))
        
        return -1.0
    
    return [bfs(x, y) for x, y in queries]


def solve_union_find(equations: List[List[str]], values: List[float],
                     queries: List[List[str]]) -> List[float]:
    """
    Union-Find with weights.
    """
    parent = {}
    weight = {}  # weight[x] = x / parent[x]
    
    def find(x):
        if x not in parent:
            parent[x] = x
            weight[x] = 1.0
            return x
        
        if parent[x] != x:
            root = find(parent[x])
            weight[x] *= weight[parent[x]]
            parent[x] = root
        
        return parent[x]
    
    def union(a, b, val):
        # a / b = val
        root_a, root_b = find(a), find(b)
        
        if root_a != root_b:
            parent[root_a] = root_b
            # weight[root_a] = root_a / root_b = (a/weight[a]) / (b/weight[b]) * val
            weight[root_a] = val * weight[b] / weight[a]
    
    for (a, b), val in zip(equations, values):
        union(a, b, val)
    
    results = []
    for x, y in queries:
        if x not in parent or y not in parent:
            results.append(-1.0)
        elif find(x) != find(y):
            results.append(-1.0)
        else:
            # x / y = (x / root) / (y / root) = weight[x] / weight[y]
            find(x)  # Ensure path compression
            find(y)
            results.append(weight[x] / weight[y])
    
    return results
```

---

## Phase 4: Dry Run

**Input:**
- equations = [["a","b"], ["b","c"]]
- values = [2.0, 3.0]
- queries = [["a","c"], ["b","a"], ["a","e"]]

**Graph:**
```
a --2.0--> b --3.0--> c
  <-0.5--   <-0.33--
```

**Query "a/c":**
- DFS: a → b (×2.0) → c (×3.0) = 6.0

**Query "b/a":**
- DFS: b → a (×0.5) = 0.5

**Query "a/e":**
- 'e' not in graph → -1.0

**Result:** [6.0, 0.5, -1.0]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(Q × (V + E))
Q queries, each may traverse graph.

### Space Complexity: O(V + E)
Graph storage.

---

## Phase 6: Follow-Up Questions

1. **"Add new equations dynamically?"**
   → Union-Find handles incremental updates well.

2. **"Detect inconsistency?"**
   → If existing path gives different value, inconsistent.

3. **"Multiply instead of divide?"**
   → Same structure; edges represent multiplication.
