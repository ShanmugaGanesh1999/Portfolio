# Course Schedule II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 210 | Topological Sort |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return a valid course order (topological sort) or empty if impossible.

### Constraints & Clarifying Questions
1. **Multiple valid orders?** Return any one.
2. **Cycle exists?** Return empty array.
3. **No prerequisites?** Return any order [0, 1, ..., n-1].
4. **Single course?** Return [0].

### Edge Cases
1. **Empty prerequisites:** Any order valid
2. **All dependent:** One linear order
3. **Cycle:** Return []

---

## Phase 2: High-Level Approach

### Approach: Kahn's Algorithm
Build order using BFS from zero in-degree nodes.

**Core Insight:** Process nodes with all prerequisites completed.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict, deque


def solve(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    """
    Return valid course order using topological sort.
    
    Args:
        numCourses: Number of courses
        prerequisites: List of [course, prereq] pairs
    
    Returns:
        Valid order or empty if impossible
    """
    # Build graph and in-degrees
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    # Start with zero in-degree nodes
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    order = []
    
    while queue:
        course = queue.popleft()
        order.append(course)
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return order if len(order) == numCourses else []


def solve_dfs(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    """
    DFS approach with reverse postorder.
    """
    graph = defaultdict(list)
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    # States: 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * numCourses
    order = []
    
    def dfs(node: int) -> bool:
        if state[node] == 1:
            return False  # Cycle
        if state[node] == 2:
            return True
        
        state[node] = 1
        
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        
        state[node] = 2
        order.append(node)  # Add after all dependencies
        return True
    
    for course in range(numCourses):
        if state[course] == 0:
            if not dfs(course):
                return []
    
    return order[::-1]  # Reverse for correct order
```

---

## Phase 4: Dry Run

**Input:** `numCourses = 4, prerequisites = [[1,0], [2,0], [3,1], [3,2]]`

**Graph:**
```
    0
   / \
  1   2
   \ /
    3
```

**Kahn's:**

| Step | Queue | Order | In-degrees |
|------|-------|-------|------------|
| Init | [0] | [] | [0,1,1,2] |
| 1 | [1,2] | [0] | [0,0,0,2] |
| 2 | [2] | [0,1] | [0,0,0,1] |
| 3 | [3] | [0,1,2] | [0,0,0,0] |
| 4 | [] | [0,1,2,3] | - |

**Result:** `[0, 1, 2, 3]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(V + E)
Process each node and edge once.

### Space Complexity: O(V + E)
Graph storage + queue.

---

## Phase 6: Follow-Up Questions

1. **"All valid orderings?"**
   → Backtrack with all zero in-degree choices at each step.

2. **"Minimum semesters if taking k courses per semester?"**
   → BFS levels with limit k per level.

3. **"Lexicographically smallest order?"**
   → Use min-heap instead of queue.
