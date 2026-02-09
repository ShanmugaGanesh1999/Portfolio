# Pacific Atlantic Water Flow

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 417 | Multi-source BFS/DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find cells where water can flow to both Pacific (top/left) and Atlantic (bottom/right) oceans.

### Constraints & Clarifying Questions
1. **Flow direction?** Water flows to equal or lower height neighbors.
2. **Pacific border?** Top row and left column.
3. **Atlantic border?** Bottom row and right column.
4. **Return format?** List of [row, col].

### Edge Cases
1. **1×1 grid:** That cell reaches both
2. **All same height:** All cells
3. **Strictly decreasing:** Only corners

---

## Phase 2: High-Level Approach

### Approach: Reverse DFS from Oceans
Start from ocean borders, go uphill (reverse flow). Find intersection of reachable sets.

**Core Insight:** Easier to go backward from destination than forward from all cells.

---

## Phase 3: Python Code

```python
from typing import List, Set, Tuple


def solve(heights: List[List[int]]) -> List[List[int]]:
    """
    Find cells reaching both oceans.
    
    Args:
        heights: Grid of heights
    
    Returns:
        Cells that can reach both oceans
    """
    if not heights or not heights[0]:
        return []
    
    rows, cols = len(heights), len(heights[0])
    pacific: Set[Tuple[int, int]] = set()
    atlantic: Set[Tuple[int, int]] = set()
    
    def dfs(r: int, c: int, visited: Set[Tuple[int, int]], prev_height: int):
        # Out of bounds, visited, or can't flow uphill
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            (r, c) in visited or heights[r][c] < prev_height):
            return
        
        visited.add((r, c))
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            dfs(r + dr, c + dc, visited, heights[r][c])
    
    # Start DFS from Pacific borders (top row, left column)
    for c in range(cols):
        dfs(0, c, pacific, heights[0][c])
    for r in range(rows):
        dfs(r, 0, pacific, heights[r][0])
    
    # Start DFS from Atlantic borders (bottom row, right column)
    for c in range(cols):
        dfs(rows - 1, c, atlantic, heights[rows - 1][c])
    for r in range(rows):
        dfs(r, cols - 1, atlantic, heights[r][cols - 1])
    
    # Intersection
    return [[r, c] for r, c in pacific & atlantic]


def solve_bfs(heights: List[List[int]]) -> List[List[int]]:
    """
    BFS approach.
    """
    from collections import deque
    
    if not heights or not heights[0]:
        return []
    
    rows, cols = len(heights), len(heights[0])
    
    def bfs(starts):
        visited = set(starts)
        queue = deque(starts)
        
        while queue:
            r, c = queue.popleft()
            
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc
                
                if (0 <= nr < rows and 0 <= nc < cols and
                    (nr, nc) not in visited and
                    heights[nr][nc] >= heights[r][c]):
                    visited.add((nr, nc))
                    queue.append((nr, nc))
        
        return visited
    
    pacific_starts = [(0, c) for c in range(cols)] + [(r, 0) for r in range(1, rows)]
    atlantic_starts = [(rows - 1, c) for c in range(cols)] + [(r, cols - 1) for r in range(rows - 1)]
    
    pacific = bfs(pacific_starts)
    atlantic = bfs(atlantic_starts)
    
    return [[r, c] for r, c in pacific & atlantic]
```

---

## Phase 4: Dry Run

**Input:**
```
  P P P P P
P 1 2 2 3 5 A
P 3 2 3 4 4 A
P 2 4 5 3 1 A
P 6 7 1 4 5 A
P 5 1 1 2 4 A
  A A A A A
```

**Pacific DFS:** Can reach from top/left → marks cells with path uphill
**Atlantic DFS:** Can reach from bottom/right → marks cells with path uphill

**Intersection (reaches both):**
- (0,4): 5 - both borders
- (1,3): 4 - can go up to Pacific, down to Atlantic
- (1,4): 4 - corner area
- etc.

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each cell visited at most twice (once per ocean).

### Space Complexity: O(M × N)
Two visited sets.

---

## Phase 6: Follow-Up Questions

1. **"Water flows only downhill (not equal)?"**
   → Change condition from `>=` to `>`.

2. **"Count paths to each ocean?"**
   → DP or memoized DFS counting.

3. **"Minimum cells to block to prevent flow?"**
   → Min-cut problem; more complex.
