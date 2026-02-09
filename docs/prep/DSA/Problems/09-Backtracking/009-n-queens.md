# N-Queens

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 51 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Place n queens on n×n board so no two attack each other. Return all distinct solutions.

### Constraints & Clarifying Questions
1. **Attack definition?** Same row, column, or diagonal.
2. **Board representation?** List of strings with 'Q' and '.'.
3. **n range?** 1 to 9 typically.
4. **Return all solutions?** Yes.

### Edge Cases
1. **n = 1:** `[["Q"]]`
2. **n = 2, 3:** No solutions
3. **n = 4:** 2 solutions

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Constraint Sets
Place queen row by row. Track columns and diagonals used.

**Core Insight:** Use sets for O(1) attack checking. Diagonals identified by (row - col) and (row + col).

---

## Phase 3: Python Code

```python
from typing import List


def solve(n: int) -> List[List[str]]:
    """
    Solve N-Queens problem.
    
    Args:
        n: Board size
    
    Returns:
        All valid board configurations
    """
    result = []
    
    # Track attacked positions
    cols = set()
    diag1 = set()  # row - col (top-left to bottom-right)
    diag2 = set()  # row + col (top-right to bottom-left)
    
    board = [['.'] * n for _ in range(n)]
    
    def backtrack(row: int):
        if row == n:
            # Convert board to strings
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            # Check if position is safe
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            
            # Place queen
            board[row][col] = 'Q'
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            backtrack(row + 1)
            
            # Remove queen (backtrack)
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    
    backtrack(0)
    return result


def solve_n_queens_count(n: int) -> int:
    """
    N-Queens II: Just count solutions.
    """
    count = [0]
    cols = set()
    diag1 = set()
    diag2 = set()
    
    def backtrack(row):
        if row == n:
            count[0] += 1
            return
        
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            backtrack(row + 1)
            
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    
    backtrack(0)
    return count[0]
```

---

## Phase 4: Dry Run

**Input:** `n = 4`

**Backtracking Tree (partial):**
```
Row 0: Try col 0
  Row 1: col 0,1 blocked → try col 2
    Row 2: col 0,2,3 blocked → try col 1? blocked → backtrack
  Row 1: try col 3
    Row 2: try col 1
      Row 3: try col 2 → blocked, try others...
```

**Solution 1:**
```
.Q..
...Q
Q...
..Q.
```

**Solution 2:**
```
..Q.
Q...
...Q
.Q..
```

**Result:** 2 solutions for n=4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N!)
N choices for row 1, N-2 for row 2 (roughly), etc.

### Space Complexity: O(N)
Recursion depth + sets.

---

## Phase 6: Follow-Up Questions

1. **"N-Rooks (no diagonal constraint)?"**
   → Simpler: N! permutations of columns.

2. **"N-Queens with some pre-placed?"**
   → Add initial positions to constraint sets; validate before starting.

3. **"First solution only?"**
   → Return immediately after finding one.
