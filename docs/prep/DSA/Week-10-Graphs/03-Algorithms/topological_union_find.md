# 🎯 Topological Sort & Union Find

## 📌 Topological Sort

### What is Topological Sort?

A linear ordering of vertices in a **Directed Acyclic Graph (DAG)** such that for every edge u → v, u comes before v.

**Use Cases:**
- Course scheduling (prerequisites)
- Build order (dependencies)
- Task scheduling

---

### Kahn's Algorithm (BFS)

```python
from collections import deque, defaultdict

def topological_sort_bfs(n: int, edges: list[list[int]]) -> list[int]:
    """
    Topological sort using BFS (Kahn's Algorithm).
    
    edges: [[a, b], ...] means a -> b (a is prerequisite for b)
    
    Algorithm:
    1. Calculate in-degree for each node
    2. Add all nodes with in-degree 0 to queue
    3. Process queue: remove node, reduce neighbors' in-degree
    4. Add neighbors with in-degree 0 to queue
    
    Time: O(V + E)
    Space: O(V + E)
    """
    # Build graph and in-degree
    graph = defaultdict(list)
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Start with nodes having no prerequisites
    queue = deque()
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
    
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle (not all nodes processed)
    if len(result) != n:
        return []  # Cycle detected
    
    return result
```

### DFS-based Topological Sort

```python
def topological_sort_dfs(n: int, edges: list[list[int]]) -> list[int]:
    """
    Topological sort using DFS.
    
    Add node to result AFTER processing all descendants.
    Reverse at the end.
    
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    
    visited = set()
    rec_stack = set()  # For cycle detection
    result = []
    
    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        
        for neighbor in graph[node]:
            if neighbor in rec_stack:
                return False  # Cycle
            if neighbor not in visited:
                if not dfs(neighbor):
                    return False
        
        rec_stack.remove(node)
        result.append(node)
        return True
    
    for i in range(n):
        if i not in visited:
            if not dfs(i):
                return []  # Cycle
    
    return result[::-1]  # Reverse
```

---

### Course Schedule (LC 207)

```python
def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    """
    Determine if it's possible to finish all courses.
    
    This is cycle detection in directed graph!
    If no cycle exists, topological order exists.
    
    Time: O(V + E)
    Space: O(V + E)
    """
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    queue = deque()
    for i in range(num_courses):
        if in_degree[i] == 0:
            queue.append(i)
    
    completed = 0
    
    while queue:
        course = queue.popleft()
        completed += 1
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return completed == num_courses
```

### Course Schedule II (LC 210)

```python
def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    """
    Return ordering of courses (topological sort).
    """
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    queue = deque()
    for i in range(num_courses):
        if in_degree[i] == 0:
            queue.append(i)
    
    order = []
    
    while queue:
        course = queue.popleft()
        order.append(course)
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return order if len(order) == num_courses else []
```

---

## 📌 Union Find (Disjoint Set Union)

### What is Union Find?

A data structure that tracks elements partitioned into disjoint sets.

**Operations:**
- `find(x)`: Find the root/representative of x's set
- `union(x, y)`: Merge the sets containing x and y

**Optimizations:**
- **Path Compression**: Flatten tree during find
- **Union by Rank**: Attach smaller tree to larger

---

### Implementation

```python
class UnionFind:
    """
    Union Find with path compression and union by rank.
    
    Time: O(α(n)) ≈ O(1) per operation (amortized)
    Space: O(n)
    """
    
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of components
    
    def find(self, x: int) -> int:
        """
        Find root of x with path compression.
        """
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """
        Union two sets. Returns True if merged, False if already same set.
        """
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        self.count -= 1
        return True
    
    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in same set."""
        return self.find(x) == self.find(y)
    
    def get_count(self) -> int:
        """Return number of disjoint sets."""
        return self.count
```

---

### Number of Provinces (LC 547)

```python
def find_circle_num(is_connected: list[list[int]]) -> int:
    """
    Count number of provinces (connected components).
    
    Using Union Find.
    """
    n = len(is_connected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    return uf.get_count()
```

### Graph Valid Tree (LC 261)

```python
def valid_tree(n: int, edges: list[list[int]]) -> bool:
    """
    Check if edges form a valid tree.
    
    Valid tree conditions:
    1. No cycles
    2. All nodes connected
    3. n nodes need exactly n-1 edges
    
    Time: O(n * α(n))
    """
    if len(edges) != n - 1:
        return False
    
    uf = UnionFind(n)
    
    for u, v in edges:
        if not uf.union(u, v):
            return False  # Cycle detected
    
    return uf.get_count() == 1  # All connected
```

### Accounts Merge (LC 721)

```python
def accounts_merge(accounts: list[list[str]]) -> list[list[str]]:
    """
    Merge accounts with same emails.
    
    Union Find to group same person's emails.
    """
    from collections import defaultdict
    
    # Map email to account index
    email_to_id = {}
    email_to_name = {}
    
    n = len(accounts)
    uf = UnionFind(n)
    
    for i, account in enumerate(accounts):
        name = account[0]
        for email in account[1:]:
            email_to_name[email] = name
            
            if email in email_to_id:
                uf.union(i, email_to_id[email])
            else:
                email_to_id[email] = i
    
    # Group emails by root
    root_to_emails = defaultdict(set)
    for email, idx in email_to_id.items():
        root = uf.find(idx)
        root_to_emails[root].add(email)
    
    # Build result
    result = []
    for root, emails in root_to_emails.items():
        name = accounts[root][0]
        result.append([name] + sorted(emails))
    
    return result
```

### Number of Islands (Union Find)

```python
def num_islands_uf(grid: list[list[str]]) -> int:
    """
    Count islands using Union Find.
    """
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    
    # Map 2D to 1D
    def get_id(r, c):
        return r * cols + c
    
    # Count land cells
    land_count = sum(grid[r][c] == '1' 
                     for r in range(rows) 
                     for c in range(cols))
    
    uf = UnionFind(rows * cols)
    uf.count = land_count
    
    directions = [(0, 1), (1, 0)]
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if nr < rows and nc < cols and grid[nr][nc] == '1':
                        uf.union(get_id(r, c), get_id(nr, nc))
    
    return uf.get_count()
```

---

## 📋 When to Use What

| Problem Type | Best Approach |
|--------------|---------------|
| Course prerequisites | Topological Sort |
| Build order | Topological Sort |
| Check if valid DAG | Topological Sort |
| Connected components | Union Find or DFS |
| Detect cycle | Union Find (undirected) |
| Dynamic connectivity | Union Find |
| Minimum spanning tree | Union Find (Kruskal's) |

---

## 🎓 Key Takeaways

### Topological Sort:
1. **Only for DAGs** (Directed Acyclic Graphs)
2. **Kahn's (BFS)**: Easier to understand, detects cycles
3. **DFS**: Reverse postorder gives topological order

### Union Find:
1. **Near O(1)** operations with optimizations
2. **Path compression** flattens tree
3. **Union by rank** keeps tree balanced
4. **Perfect for** dynamic connectivity queries
