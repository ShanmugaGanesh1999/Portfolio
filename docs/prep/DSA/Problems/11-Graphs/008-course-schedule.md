# Course Schedule

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 207 | Topological Sort / Cycle Detection |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if all courses can be finished given prerequisites. Detect cycle in directed graph.

### Constraints & Clarifying Questions
1. **Prerequisites format?** [course, prereq] meaning prereq → course.
2. **Self-loop?** Not in valid input.
3. **Empty prerequisites?** All courses can be finished.
4. **Multiple prerequisites?** Course can have many.

### Edge Cases
1. **No prerequisites:** Return True
2. **Single course:** Return True
3. **Cycle exists:** Return False

---

## Phase 2: High-Level Approach

### Approach 1: DFS Cycle Detection
Track visiting (in current path) and visited nodes. Cycle if we revisit a visiting node.

### Approach 2: Kahn's Algorithm (BFS)
Topological sort using in-degrees. If all nodes processed, no cycle.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict, deque


def solve_dfs(numCourses: int, prerequisites: List[List[int]]) -> bool:
    """
    Check if courses can be finished using DFS cycle detection.
    
    Args:
        numCourses: Number of courses
        prerequisites: List of [course, prereq] pairs
    
    Returns:
        True if all courses can be finished
    """
    # Build adjacency list
    graph = defaultdict(list)
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    # States: 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * numCourses
    
    def has_cycle(node: int) -> bool:
        if state[node] == 1:  # Back edge - cycle
            return True
        if state[node] == 2:  # Already processed
            return False
        
        state[node] = 1  # Mark visiting
        
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        
        state[node] = 2  # Mark visited
        return False
    
    # Check all nodes (graph may be disconnected)
    for course in range(numCourses):
        if has_cycle(course):
            return False
    
    return True


def solve_bfs(numCourses: int, prerequisites: List[List[int]]) -> bool:
    """
    Kahn's algorithm for topological sort.
    
    Args:
        numCourses: Number of courses
        prerequisites: List of [course, prereq] pairs
    
    Returns:
        True if all courses can be finished
    """
    # Build graph and in-degree count
    graph = defaultdict(list)
    in_degree = [0] * numCourses
    
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1
    
    # Start with nodes having no prerequisites
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    processed = 0
    
    while queue:
        course = queue.popleft()
        processed += 1
        
        for next_course in graph[course]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)
    
    return processed == numCourses
```

---

## Phase 4: Dry Run

**Input:** `numCourses = 4, prerequisites = [[1,0], [2,1], [3,2]]`

**Graph:** 0 → 1 → 2 → 3

**Kahn's Algorithm:**
| Step | Queue | In-degrees | Processed |
|------|-------|------------|-----------|
| Init | [0] | [0,1,1,1] | 0 |
| 1 | [1] | [0,0,1,1] | 1 |
| 2 | [2] | [0,0,0,1] | 2 |
| 3 | [3] | [0,0,0,0] | 3 |
| 4 | [] | - | 4 |

4 == 4 → **True**

**With Cycle:** `[[1,0], [0,1]]`
- In-degrees: [1, 1]
- Queue starts empty
- Processed = 0 ≠ 2 → **False**

---

## Phase 5: Complexity Analysis

### Time Complexity: O(V + E)
V = courses, E = prerequisites.

### Space Complexity: O(V + E)
Graph storage + queue/recursion.

---

## Phase 6: Follow-Up Questions

1. **"Return one valid order?"**
   → Course Schedule II: return topological order.

2. **"Minimum semesters?"**
   → BFS levels = semesters (parallel courses).

3. **"All valid orderings?"**
   → Backtracking with all choices at each step.
