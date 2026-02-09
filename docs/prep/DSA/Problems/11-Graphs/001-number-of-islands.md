# Number of Islands

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 200 | BFS/DFS Grid |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count distinct islands in 2D grid. '1' is land, '0' is water. Adjacent = 4 directions.

### Constraints & Clarifying Questions
1. **Diagonal connected?** No, only 4 directions.
2. **Modify grid?** Usually allowed.
3. **Grid size?** Up to 300×300.
4. **Empty grid?** Return 0.

### Edge Cases
1. **All water:** 0 islands
2. **All land:** 1 island
3. **Single cell:** 0 or 1 depending on value

---

## Phase 2: High-Level Approach

### Approach: DFS/BFS to Flood Fill
When finding '1', increment count and mark entire island as visited.

**Core Insight:** Each DFS/BFS from unvisited land explores one complete island.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve_dfs(grid: List[List[str]]) -> int:
    """
    Count islands using DFS.
    
    Args:
        grid: 2D grid of '0' and '1'
    
    Returns:
        Number of islands
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r: int, c: int):
        # Out of bounds or water
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        
        # Mark as visited
        grid[r][c] = '#'
        
        # Explore neighbors
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count


def solve_bfs(grid: List[List[str]]) -> int:
    """
    Count islands using BFS.
    
    Args:
        grid: 2D grid of '0' and '1'
    
    Returns:
        Number of islands
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def bfs(start_r: int, start_c: int):
        queue = deque([(start_r, start_c)])
        grid[start_r][start_c] = '#'
        
        while queue:
            r, c = queue.popleft()
            
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc
                
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '#'
                    queue.append((nr, nc))
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                bfs(r, c)
    
    return count
```

---

## Phase 4: Dry Run

**Input:**
```
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
```

**Process:**

| Position | Action | Count |
|----------|--------|-------|
| (0,0)='1' | DFS marks (0,0),(0,1),(1,0),(1,1) | 1 |
| (0,2)='0' | Skip | 1 |
| ... | | |
| (2,2)='1' | DFS marks (2,2) | 2 |
| (3,3)='1' | DFS marks (3,3),(3,4) | 3 |

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each cell visited once.

### Space Complexity: O(M × N)
Recursion stack worst case (all land).

---

## Phase 6: Follow-Up Questions

1. **"Can't modify grid?"**
   → Use separate visited set.

2. **"Count of each island's size?"**
   → Return size from DFS; collect in list.

3. **"Largest island?"**
   → Track max during traversal.
