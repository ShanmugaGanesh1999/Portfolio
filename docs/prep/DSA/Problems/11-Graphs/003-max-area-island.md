# Max Area of Island

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 695 | DFS/BFS Grid |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find maximum area (count of 1s) among all islands in grid.

### Constraints & Clarifying Questions
1. **Area = cell count?** Yes.
2. **Same adjacency rules?** 4-directional.
3. **Grid modification?** Usually allowed.
4. **Empty grid?** Return 0.

### Edge Cases
1. **All water:** Return 0
2. **All land:** Return rows × cols
3. **Single cells:** Max area = 1

---

## Phase 2: High-Level Approach

### Approach: DFS with Area Counting
Similar to Number of Islands, but return area from each DFS.

**Core Insight:** Track sum of DFS returns for connected cells.

---

## Phase 3: Python Code

```python
from typing import List


def solve(grid: List[List[int]]) -> int:
    """
    Find maximum island area.
    
    Args:
        grid: 2D grid of 0 and 1
    
    Returns:
        Maximum island area
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def dfs(r: int, c: int) -> int:
        # Out of bounds or water
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:
            return 0
        
        # Mark visited
        grid[r][c] = 0
        
        # Count this cell + neighbors
        area = 1
        area += dfs(r + 1, c)
        area += dfs(r - 1, c)
        area += dfs(r, c + 1)
        area += dfs(r, c - 1)
        
        return area
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
    
    return max_area


def solve_iterative(grid: List[List[int]]) -> int:
    """
    BFS approach.
    """
    from collections import deque
    
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                area = 0
                queue = deque([(r, c)])
                grid[r][c] = 0
                
                while queue:
                    cr, cc = queue.popleft()
                    area += 1
                    
                    for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                            grid[nr][nc] = 0
                            queue.append((nr, nc))
                
                max_area = max(max_area, area)
    
    return max_area
```

---

## Phase 4: Dry Run

**Input:**
```
0 0 1 0 0 0 0 1 0 0 0 0 0
0 0 0 0 0 0 0 1 1 1 0 0 0
0 1 1 0 1 0 0 0 0 0 0 0 0
0 1 0 0 1 1 0 0 1 0 1 0 0
0 1 0 0 1 1 0 0 1 1 1 0 0
0 0 0 0 0 0 0 0 0 0 1 0 0
0 0 0 0 0 0 0 1 1 1 0 0 0
0 0 0 0 0 0 0 1 1 0 0 0 0
```

**Island Areas:**
- Island at (0,2): area = 1
- Island at (0,7): area = 4 (1+1+1+1)
- Island at (2,1): area = 2
- Island at (2,4): area = 4
- Island at (3,8): area = 6
- Island at (6,7): area = 4

**Max Area:** 6

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each cell visited once.

### Space Complexity: O(M × N)
Recursion stack in worst case.

---

## Phase 6: Follow-Up Questions

1. **"Return coordinates of largest island?"**
   → Collect cells during DFS; keep best list.

2. **"Perimeter of islands?"**
   → Count edges adjacent to water or boundary.

3. **"Island shapes comparison?"**
   → Normalize coordinates relative to top-left; hash for grouping.
