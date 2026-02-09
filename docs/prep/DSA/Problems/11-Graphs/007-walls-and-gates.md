# Walls and Gates

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 286 | Multi-source BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Fill each empty room with distance to nearest gate. INF=2^31-1, gate=0, wall=-1.

### Constraints & Clarifying Questions
1. **INF value?** 2147483647.
2. **Modify in place?** Yes.
3. **Multiple gates?** Find nearest one.
4. **Unreachable rooms?** Keep as INF.

### Edge Cases
1. **No gates:** All rooms stay INF
2. **No rooms:** Nothing to fill
3. **Room surrounded by walls:** Stays INF

---

## Phase 2: High-Level Approach

### Approach: Multi-source BFS from Gates
Start BFS from all gates. Update distances as BFS expands.

**Core Insight:** BFS from gates ensures minimum distance.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve(rooms: List[List[int]]) -> None:
    """
    Fill each room with distance to nearest gate.
    
    Args:
        rooms: Grid with INF=empty, 0=gate, -1=wall
    """
    if not rooms or not rooms[0]:
        return
    
    INF = 2147483647
    rows, cols = len(rooms), len(rooms[0])
    queue = deque()
    
    # Start from all gates
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                queue.append((r, c))
    
    # BFS
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            # Only update unvisited rooms (INF)
            if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == INF:
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))


def solve_dfs(rooms: List[List[int]]) -> None:
    """
    DFS approach (less efficient but works).
    """
    if not rooms or not rooms[0]:
        return
    
    rows, cols = len(rooms), len(rooms[0])
    
    def dfs(r: int, c: int, distance: int):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            rooms[r][c] < distance):
            return
        
        rooms[r][c] = distance
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            dfs(r + dr, c + dc, distance + 1)
    
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                dfs(r, c, 0)
```

---

## Phase 4: Dry Run

**Input:**
```
INF  -1   0  INF
INF INF INF  -1
INF  -1 INF  -1
  0  -1 INF INF
```

**Gates at:** (0,2), (3,0)

**BFS Expansion:**

| Level | Queue | Updates |
|-------|-------|---------|
| 0 | [(0,2), (3,0)] | Start |
| 1 | [(0,3), (1,2), (2,0)] | (0,3)=1, (1,2)=1, (2,0)=1 |
| 2 | [(1,3)?, (1,1), (1,0)] | (1,1)=2, (1,0)=2 |
| 3 | [(0,0), (2,2)] | (0,0)=3, (2,2)=3 |

**Result:**
```
  3  -1   0   1
  2   2   1  -1
  1  -1   2  -1
  0  -1   3   4
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each cell visited at most once.

### Space Complexity: O(M × N)
Queue size.

---

## Phase 6: Follow-Up Questions

1. **"Return path to nearest gate?"**
   → Track parent during BFS; reconstruct path.

2. **"Multiple types of gates with different distances?"**
   → Weighted BFS or Dijkstra.

3. **"Moving obstacles?"**
   → Re-run BFS when obstacles change; or A* for single query.
