# Minimum Knight Moves

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1197 | BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum moves for chess knight from (0,0) to (x,y) on infinite board.

### Constraints & Clarifying Questions
1. **Knight moves?** L-shaped: (±1,±2) or (±2,±1).
2. **Infinite board?** No boundaries.
3. **x, y range?** Can be negative.
4. **Target is origin?** Return 0.

### Edge Cases
1. **(0,0):** 0 moves
2. **(1,1):** 2 moves
3. **Negative coordinates:** Use absolute values (symmetry)

---

## Phase 2: High-Level Approach

### Approach: BFS with Symmetry
Use absolute values (symmetry). BFS from origin to target.

**Core Insight:** Board is symmetric; work with positive quadrant.

---

## Phase 3: Python Code

```python
from collections import deque


def solve(x: int, y: int) -> int:
    """
    Find minimum knight moves to reach (x, y).
    
    Args:
        x, y: Target coordinates
    
    Returns:
        Minimum moves
    """
    # Use symmetry - work with positive coordinates
    x, y = abs(x), abs(y)
    
    if x == 0 and y == 0:
        return 0
    
    # Knight moves
    moves = [
        (-2, -1), (-2, 1), (-1, -2), (-1, 2),
        (1, -2), (1, 2), (2, -1), (2, 1)
    ]
    
    queue = deque([(0, 0, 0)])  # (x, y, distance)
    visited = {(0, 0)}
    
    while queue:
        cx, cy, dist = queue.popleft()
        
        for dx, dy in moves:
            nx, ny = cx + dx, cy + dy
            
            if nx == x and ny == y:
                return dist + 1
            
            # Prune: don't go too far from target
            # Allow small negative for edge cases like (1,1)
            if (nx, ny) not in visited and -2 <= nx <= x + 2 and -2 <= ny <= y + 2:
                visited.add((nx, ny))
                queue.append((nx, ny, dist + 1))
    
    return -1


def solve_bidirectional(x: int, y: int) -> int:
    """
    Bidirectional BFS for optimization.
    """
    x, y = abs(x), abs(y)
    
    if x == 0 and y == 0:
        return 0
    
    moves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]
    
    # Start from both origin and target
    start_set = {(0, 0)}
    end_set = {(x, y)}
    start_visited = {(0, 0): 0}
    end_visited = {(x, y): 0}
    steps = 0
    
    while start_set:
        if len(start_set) > len(end_set):
            start_set, end_set = end_set, start_set
            start_visited, end_visited = end_visited, start_visited
        
        next_set = set()
        steps += 1
        
        for cx, cy in start_set:
            for dx, dy in moves:
                nx, ny = cx + dx, cy + dy
                
                if (nx, ny) in end_visited:
                    return steps + end_visited[(nx, ny)]
                
                if (nx, ny) not in start_visited and -2 <= nx <= x + 4 and -2 <= ny <= y + 4:
                    start_visited[(nx, ny)] = steps
                    next_set.add((nx, ny))
        
        start_set = next_set
    
    return -1


def solve_formula(x: int, y: int) -> int:
    """
    Mathematical formula (for reference).
    """
    x, y = abs(x), abs(y)
    
    # Special cases
    if (x, y) == (0, 0):
        return 0
    if (x, y) == (1, 0) or (x, y) == (0, 1):
        return 3
    if (x, y) == (1, 1):
        return 2
    if (x, y) == (2, 2):
        return 4
    
    # General formula approximation
    t = max(max(x, y), (x + y + 2) // 3) 
    t += (t - x - y) % 2
    
    return t
```

---

## Phase 4: Dry Run

**Input:** `x = 2, y = 1`

**BFS:**

| Step | Position | Neighbors Checked |
|------|----------|-------------------|
| 0 | (0,0) | Add reachable |
| 1 | (1,2),(2,1),(-1,2),(2,-1)... | (2,1) matches! |

**Result:** 1 move

**Input:** `x = 5, y = 5`

**Path:** (0,0) → (2,1) → (4,2) → (5,4)? No, adjust...
Optimal: ~4 moves

---

## Phase 5: Complexity Analysis

### Time Complexity: O(max(|x|, |y|)²)
BFS explores area proportional to distance squared.

### Space Complexity: O(max(|x|, |y|)²)
Visited set.

---

## Phase 6: Follow-Up Questions

1. **"With obstacles?"**
   → BFS avoiding obstacle cells.

2. **"Minimum moves between two points?"**
   → Same algorithm with different start.

3. **"All cells reachable in k moves?"**
   → BFS to level k; collect all positions.
