# Surrounded Regions

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 130 | DFS/BFS Border |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Flip 'O's to 'X's except those connected to border.

### Constraints & Clarifying Questions
1. **Connected = 4-directional?** Yes.
2. **Modify in place?** Yes.
3. **Border 'O's protected?** Yes, and all connected to them.
4. **Empty board?** Handle gracefully.

### Edge Cases
1. **All 'X':** No change
2. **All 'O':** Only border ones remain
3. **Single row/column:** All on border

---

## Phase 2: High-Level Approach

### Approach: DFS from Borders
Mark border-connected 'O's as safe. Then flip remaining 'O's to 'X'.

**Core Insight:** Easier to find what NOT to flip than what to flip.

---

## Phase 3: Python Code

```python
from typing import List


def solve(board: List[List[str]]) -> None:
    """
    Capture surrounded regions in-place.
    
    Args:
        board: 2D grid of 'X' and 'O'
    """
    if not board or not board[0]:
        return
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r: int, c: int):
        # Out of bounds or not 'O'
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != 'O':
            return
        
        # Mark as safe (temporary marker)
        board[r][c] = 'S'
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    # Step 1: Mark border-connected 'O's as safe
    for r in range(rows):
        dfs(r, 0)
        dfs(r, cols - 1)
    
    for c in range(cols):
        dfs(0, c)
        dfs(rows - 1, c)
    
    # Step 2: Flip remaining 'O's to 'X', restore 'S' to 'O'
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'S':
                board[r][c] = 'O'


def solve_bfs(board: List[List[str]]) -> None:
    """
    BFS approach.
    """
    from collections import deque
    
    if not board or not board[0]:
        return
    
    rows, cols = len(board), len(board[0])
    
    # Collect border 'O's
    queue = deque()
    for r in range(rows):
        if board[r][0] == 'O':
            queue.append((r, 0))
        if board[r][cols - 1] == 'O':
            queue.append((r, cols - 1))
    for c in range(cols):
        if board[0][c] == 'O':
            queue.append((0, c))
        if board[rows - 1][c] == 'O':
            queue.append((rows - 1, c))
    
    # BFS to mark safe
    while queue:
        r, c = queue.popleft()
        if board[r][c] != 'O':
            continue
        
        board[r][c] = 'S'
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == 'O':
                queue.append((nr, nc))
    
    # Final pass
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'S':
                board[r][c] = 'O'
```

---

## Phase 4: Dry Run

**Input:**
```
X X X X
X O O X
X X O X
X O X X
```

**After border DFS (mark safe):**
- (3,1) is border 'O' → mark 'S'
- No neighbors to spread

```
X X X X
X O O X
X X O X
X S X X
```

**After final pass:**
- (1,1), (1,2), (2,2) are 'O' → flip to 'X'
- (3,1) is 'S' → restore to 'O'

```
X X X X
X X X X
X X X X
X O X X
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Each cell visited at most twice.

### Space Complexity: O(M × N)
Recursion stack or queue.

---

## Phase 6: Follow-Up Questions

1. **"Count flipped cells?"**
   → Count 'O's before and after, or count during flip.

2. **"8-directional connectivity?"**
   → Add diagonal directions to DFS/BFS.

3. **"Return coordinates of surrounded regions?"**
   → Collect during final flip.
