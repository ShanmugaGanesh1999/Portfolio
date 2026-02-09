# Valid Sudoku

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 36 | Hash Set Validation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Determine if a 9×9 Sudoku board is valid based on current state (not whether it's solvable).

### Constraints & Clarifying Questions
1. **What does valid mean?** Each row, column, and 3×3 box contains no duplicate digits 1-9.
2. **Are empty cells allowed?** Yes, represented by '.'.
3. **Is the board always 9×9?** Yes, fixed size.
4. **Do we need to check if puzzle is solvable?** No, only check current state validity.
5. **What characters appear?** Only '1'-'9' and '.'.

### Edge Cases
1. **Empty board:** All '.' cells → Valid (no violations)
2. **Duplicate in row:** Row has two '5's → Invalid
3. **Duplicate in box:** Same digit in same 3×3 box → Invalid

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Three Separate Passes)
Check all rows, then all columns, then all boxes separately.
- **Time:** O(N²) where N=9
- **Space:** O(N)

### Option 2: Optimal (Single Pass with Hash Sets)
Use three collections of sets: one for rows, one for columns, one for boxes. In single pass through all cells, check and record each digit's position.

**Core Insight:** Box index can be computed as `(row // 3, col // 3)`, allowing single-pass validation.

### Why Optimal?
Single pass through the board instead of three; constant factor improvement. Both are O(81) for fixed 9×9 board.

---

## Phase 3: Python Code

```python
def solve(board: list[list[str]]) -> bool:
    """
    Validate a 9x9 Sudoku board's current state.
    
    Args:
        board: 9x9 grid with '1'-'9' or '.' for empty
    
    Returns:
        True if board state is valid (no rule violations)
    """
    # Track seen digits for each row, column, and 3x3 box
    rows = [set() for _ in range(9)]  # O(9) space
    cols = [set() for _ in range(9)]  # O(9) space
    boxes = [[set() for _ in range(3)] for _ in range(3)]  # O(9) space
    
    for row in range(9):  # O(81) = O(1) for fixed board
        for col in range(9):
            digit = board[row][col]
            
            if digit == '.':
                continue  # Skip empty cells
            
            # Compute box coordinates (0-2, 0-2)
            box_row, box_col = row // 3, col // 3
            
            # Check for duplicates in row, column, or box
            if digit in rows[row]:
                return False
            if digit in cols[col]:
                return False
            if digit in boxes[box_row][box_col]:
                return False
            
            # Record this digit's presence
            rows[row].add(digit)  # O(1)
            cols[col].add(digit)  # O(1)
            boxes[box_row][box_col].add(digit)  # O(1)
    
    return True


def solve_single_set(board: list[list[str]]) -> bool:
    """
    Alternative: Use single set with encoded keys.
    """
    seen = set()
    
    for row in range(9):
        for col in range(9):
            digit = board[row][col]
            if digit == '.':
                continue
            
            # Encode position information in the key
            row_key = (row, digit)
            col_key = (digit, col)
            box_key = (row // 3, col // 3, digit)
            
            if row_key in seen or col_key in seen or box_key in seen:
                return False
            
            seen.add(row_key)
            seen.add(col_key)
            seen.add(box_key)
    
    return True
```

---

## Phase 4: Dry Run

**Input:** Partial board with potential row duplicate at (0,0) and (0,5) both being '5'

```
[["5","3",".",".","7","5",...]...]
      ^                 ^
     (0,0)            (0,5)
```

| Step | (row,col) | digit | Check rows[0] | Check cols | Check box | Action |
|------|-----------|-------|---------------|------------|-----------|--------|
| 1 | (0,0) | '5' | {} empty | {} | {} | Add '5' to rows[0], cols[0], boxes[0][0] |
| 2 | (0,1) | '3' | {'5'} no dup | {} | {'5'} no dup | Add '3' |
| 3 | (0,2) | '.' | — | — | — | Skip |
| ... | ... | ... | ... | ... | ... | ... |
| 6 | (0,5) | '5' | {'5','3'} **DUPLICATE!** | — | — | Return False |

**Termination:** Returns False immediately when '5' is found again in row 0.
**Correctness:** Same digit '5' appears twice in row 0, violating Sudoku rules ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
Board is fixed 9×9 = 81 cells. We visit each cell exactly once. Even with variable N×N, it would be O(N²).

### Space Complexity: O(1)
Storage for 9 row sets + 9 column sets + 9 box sets, each holding at most 9 elements. Fixed regardless of input content.

---

## Phase 6: Follow-Up Questions

1. **"How would you extend this to validate an N×N Sudoku with √N × √N boxes?"**
   → Generalize box calculation to `(row // sqrt_n, col // sqrt_n)` and scale data structures to N sets each.

2. **"What if we also needed to check if the puzzle is solvable?"**
   → Would need backtracking solver; validation alone is O(N²) but solvability check is NP-complete in general.

3. **"How would you handle validating a Sudoku being filled in real-time?"**
   → Maintain persistent row/col/box sets; on each new digit, perform O(1) duplicate check before accepting the move.
