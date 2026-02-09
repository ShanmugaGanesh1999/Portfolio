# Snakes and Ladders

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 909 | BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum dice rolls to reach square n² from square 1 on modified board.

### Constraints & Clarifying Questions
1. **Board numbering?** Boustrophedon (alternating direction per row).
2. **Snakes/ladders mandatory?** Yes, must take if land on one.
3. **Snake at destination?** Still counts as reaching.
4. **-1 in board?** No snake/ladder at that square.

### Edge Cases
1. **Ladder from 1?** Take it immediately
2. **Snake to lower number?** Must take
3. **Impossible?** Return -1

---

## Phase 2: High-Level Approach

### Approach: BFS State Exploration
States are board positions (1 to n²). BFS with dice rolls 1-6.

**Core Insight:** Convert coordinates; apply snake/ladder; BFS.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve(board: List[List[int]]) -> int:
    """
    Find minimum moves to reach end.
    
    Args:
        board: n×n board with snakes/ladders (-1 if none)
    
    Returns:
        Minimum dice rolls, -1 if impossible
    """
    n = len(board)
    target = n * n
    
    def get_board_value(square: int) -> int:
        """Convert square number to board coordinates and get value."""
        # Square 1 is at bottom-left
        row = (square - 1) // n
        col = (square - 1) % n
        
        # Boustrophedon: odd rows (from bottom) go right-to-left
        if row % 2 == 1:
            col = n - 1 - col
        
        # Board row 0 is top, but square 1 is at bottom
        board_row = n - 1 - row
        
        return board[board_row][col]
    
    queue = deque([(1, 0)])  # (square, moves)
    visited = {1}
    
    while queue:
        square, moves = queue.popleft()
        
        for dice in range(1, 7):
            next_square = square + dice
            
            if next_square > target:
                continue
            
            # Check for snake/ladder
            board_val = get_board_value(next_square)
            if board_val != -1:
                next_square = board_val
            
            if next_square == target:
                return moves + 1
            
            if next_square not in visited:
                visited.add(next_square)
                queue.append((next_square, moves + 1))
    
    return -1


def solve_simplified(board: List[List[int]]) -> int:
    """
    Precompute board array for simpler access.
    """
    n = len(board)
    
    # Flatten board in play order
    flat = [0]  # 1-indexed
    for row in range(n - 1, -1, -1):
        if (n - 1 - row) % 2 == 0:
            flat.extend(board[row])
        else:
            flat.extend(board[row][::-1])
    
    target = n * n
    queue = deque([(1, 0)])
    visited = {1}
    
    while queue:
        pos, moves = queue.popleft()
        
        for dice in range(1, 7):
            next_pos = pos + dice
            if next_pos > target:
                continue
            
            if flat[next_pos] != -1:
                next_pos = flat[next_pos]
            
            if next_pos == target:
                return moves + 1
            
            if next_pos not in visited:
                visited.add(next_pos)
                queue.append((next_pos, moves + 1))
    
    return -1
```

---

## Phase 4: Dry Run

**Input (6×6 simplified):**
```
[-1,-1,-1,-1,-1,-1]
[-1,-1,-1,-1,-1,-1]
[-1,-1,-1,-1,-1,-1]
[-1,35,-1,-1,13,-1]
[-1,-1,-1,-1,-1,-1]
[-1,-1,-1,-1,-1,-1]
```

Square 2 has ladder to 35, Square 5 has ladder to 13.

**BFS:**

| Moves | Queue | Key Events |
|-------|-------|------------|
| 0 | [1] | Start |
| 1 | [2→35, 3, 4, 5→13, 6, 7] | Roll 1-6 |
| 2 | From 35: can reach 36 (target) | |

**Result:** 2

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
Each square visited once.

### Space Complexity: O(N²)
Visited set.

---

## Phase 6: Follow-Up Questions

1. **"Expected value (average rolls)?"**
   → Markov chain / DP approach.

2. **"Optimal dice (can skip)?"**
   → BFS still works; don't have to use full roll.

3. **"Multiple dice at once?"**
   → Expand state space; more neighbors per state.
