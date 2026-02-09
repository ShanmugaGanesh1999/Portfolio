# Word Search

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 79 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if word exists in grid. Path through adjacent cells (horizontal/vertical), each cell used at most once.

### Constraints & Clarifying Questions
1. **Adjacent means?** Up, down, left, right (not diagonal).
2. **Cell reuse?** Not in same path.
3. **Case sensitive?** Yes.
4. **Grid size?** Up to 6×6, word up to 15.

### Edge Cases
1. **Single letter word:** Check if letter exists
2. **Word longer than cells:** Impossible
3. **Empty word:** True (edge case handling)

---

## Phase 2: High-Level Approach

### Approach: DFS Backtracking
For each cell matching first letter, DFS to find rest of word. Mark visited during path; unmark on backtrack.

**Core Insight:** Classic grid DFS with backtracking.

---

## Phase 3: Python Code

```python
from typing import List


def solve(board: List[List[str]], word: str) -> bool:
    """
    Check if word exists in grid.
    
    Args:
        board: Character grid
        word: Target word
    
    Returns:
        True if word exists
    """
    rows, cols = len(board), len(board[0])
    
    def dfs(r: int, c: int, idx: int) -> bool:
        # Found complete word
        if idx == len(word):
            return True
        
        # Out of bounds or wrong character
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            board[r][c] != word[idx]):
            return False
        
        # Mark visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore neighbors
        found = (dfs(r + 1, c, idx + 1) or
                 dfs(r - 1, c, idx + 1) or
                 dfs(r, c + 1, idx + 1) or
                 dfs(r, c - 1, idx + 1))
        
        # Backtrack
        board[r][c] = temp
        
        return found
    
    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    
    return False


def solve_with_set(board: List[List[str]], word: str) -> bool:
    """
    Using set instead of modifying board.
    """
    rows, cols = len(board), len(board[0])
    path = set()
    
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[idx] or (r, c) in path):
            return False
        
        path.add((r, c))
        
        result = (dfs(r + 1, c, idx + 1) or
                  dfs(r - 1, c, idx + 1) or
                  dfs(r, c + 1, idx + 1) or
                  dfs(r, c - 1, idx + 1))
        
        path.remove((r, c))
        return result
    
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False
```

---

## Phase 4: Dry Run

**Input:**
```
board = [["A","B","C","E"],
         ["S","F","C","S"],
         ["A","D","E","E"]]
word = "ABCCED"
```

**DFS from (0,0):**

| Step | (r,c) | idx | char | Match? |
|------|-------|-----|------|--------|
| 1 | (0,0) | 0 | A | ✓ |
| 2 | (0,1) | 1 | B | ✓ |
| 3 | (0,2) | 2 | C | ✓ |
| 4 | (1,2) | 3 | C | ✓ |
| 5 | (2,2) | 4 | E | ✓ |
| 6 | (2,1) | 5 | D | ✓ |
| 7 | - | 6 | - | Done! |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N × 4^L)
Where M×N = grid size, L = word length. Each cell starts DFS with 4 choices per level.

### Space Complexity: O(L)
Recursion depth = word length.

---

## Phase 6: Follow-Up Questions

1. **"Multiple words?"**
   → Word Search II: Use Trie for efficient prefix matching.

2. **"Allow diagonal?"**
   → Add 4 more directions to DFS.

3. **"Count all occurrences?"**
   → Don't return early; continue counting.
