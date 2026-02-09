# Sudoku Solver

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 37 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Fill 9×9 grid following Sudoku rules: 1-9 in each row, column, and 3×3 box.

### Constraints & Clarifying Questions
1. **Valid input?** One unique solution exists.
2. **Modify in place?** Yes.
3. **Empty cells marked?** With '.'.
4. **Pre-filled cells valid?** Yes.

### Edge Cases
1. **Almost complete:** Few empty cells
2. **Many empty cells:** More backtracking needed
3. **Uniquely solvable:** Guaranteed

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Constraint Sets
Track used numbers in rows, columns, and boxes. Try each valid number for empty cells.

**Core Insight:** Use sets for O(1) validity checking.

---

## Phase 3: Python Code

```python
from typing import List


def solve(board: List[List[str]]) -> None:
    """
    Solve Sudoku in-place.
    
    Args:
        board: 9x9 grid with some cells filled
    """
    # Track used numbers
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]  # box index = (r//3)*3 + c//3
    
    # Initialize constraints from given numbers
    empty = []
    for r in range(9):
        for c in range(9):
            if board[r][c] != '.':
                num = board[r][c]
                rows[r].add(num)
                cols[c].add(num)
                boxes[(r // 3) * 3 + c // 3].add(num)
            else:
                empty.append((r, c))
    
    def backtrack(idx: int) -> bool:
        if idx == len(empty):
            return True
        
        r, c = empty[idx]
        box_idx = (r // 3) * 3 + c // 3
        
        for num in '123456789':
            if num in rows[r] or num in cols[c] or num in boxes[box_idx]:
                continue
            
            # Place number
            board[r][c] = num
            rows[r].add(num)
            cols[c].add(num)
            boxes[box_idx].add(num)
            
            if backtrack(idx + 1):
                return True
            
            # Backtrack
            board[r][c] = '.'
            rows[r].remove(num)
            cols[c].remove(num)
            boxes[box_idx].remove(num)
        
        return False
    
    backtrack(0)


def solve_simple(board: List[List[str]]) -> None:
    """
    Simpler version with validity check function.
    """
    def is_valid(r, c, num):
        # Check row
        if num in board[r]:
            return False
        
        # Check column
        if any(board[i][c] == num for i in range(9)):
            return False
        
        # Check 3x3 box
        box_r, box_c = 3 * (r // 3), 3 * (c // 3)
        for i in range(box_r, box_r + 3):
            for j in range(box_c, box_c + 3):
                if board[i][j] == num:
                    return False
        
        return True
    
    def backtrack():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for num in '123456789':
                        if is_valid(r, c, num):
                            board[r][c] = num
                            if backtrack():
                                return True
                            board[r][c] = '.'
                    return False
        return True
    
    backtrack()
```

---

## Phase 4: Dry Run

**Partial Board:**
```
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
...
```

**First empty cell (0, 2):**
- Row 0 has: 5, 3, 7
- Col 2 has: 8
- Box 0 has: 5, 3, 6, 9, 8

Available: 1, 2, 4

Try 1 → Check next empty → Continue or backtrack...

---

## Phase 5: Complexity Analysis

### Time Complexity: O(9^(N))
Where N = empty cells (max 81). Each cell tries up to 9 numbers.

### Space Complexity: O(N)
Recursion depth + constraint sets.

---

## Phase 6: Follow-Up Questions

1. **"Multiple solutions?"**
   → Don't stop at first; collect all.

2. **"Generate valid Sudoku?"**
   → Fill diagonals randomly (independent), then solve rest.

3. **"Constraint propagation?"**
   → Implement naked singles, hidden singles for speed.
