# 🎯 Backtracking - Complete Guide

## 📌 What is Backtracking?

Backtracking is a systematic way to explore all possible solutions by:
1. Building candidates incrementally
2. Abandoning candidates ("backtracking") when they can't lead to valid solutions

**Think of it as DFS on a decision tree.**

---

## 🎨 Backtracking Template

```python
def backtrack(state, choices):
    """
    Generic backtracking template.
    """
    # Base case: found a valid solution
    if is_solution(state):
        result.append(state.copy())  # Or process solution
        return
    
    # Try each choice
    for choice in choices:
        # Pruning: skip invalid choices
        if not is_valid(choice, state):
            continue
        
        # Make choice
        state.add(choice)
        
        # Explore further
        backtrack(state, remaining_choices)
        
        # Undo choice (backtrack)
        state.remove(choice)
```

---

## 🔥 Classic Problems

### Subsets (LC 78)

```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Generate all subsets of nums.
    
    Decision: Include or exclude each element.
    
    Time: O(n * 2^n)
    Space: O(n) for recursion
    """
    result = []
    
    def backtrack(start, current):
        # Every state is a valid subset
        result.append(current[:])
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

### Subsets II (with duplicates) - LC 90

```python
def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    """
    Generate all unique subsets when nums may have duplicates.
    
    Key: Sort first, then skip duplicates at same level.
    """
    nums.sort()
    result = []
    
    def backtrack(start, current):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

### Permutations (LC 46)

```python
def permutations(nums: list[int]) -> list[list[int]]:
    """
    Generate all permutations of nums.
    
    Use set to track used elements.
    
    Time: O(n * n!)
    Space: O(n)
    """
    result = []
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            
            used[i] = True
            current.append(nums[i])
            
            backtrack(current)
            
            current.pop()
            used[i] = False
    
    backtrack([])
    return result
```

### Permutations II (with duplicates) - LC 47

```python
def permutations_unique(nums: list[int]) -> list[list[int]]:
    """
    Generate all unique permutations.
    
    Sort first, skip duplicates by checking:
    - Same as previous AND previous not used (at same level)
    """
    nums.sort()
    result = []
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            
            # Skip duplicates at same level
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            
            backtrack(current)
            
            current.pop()
            used[i] = False
    
    backtrack([])
    return result
```

### Combination Sum (LC 39)

```python
def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Find combinations that sum to target (can reuse elements).
    
    Time: O(n^(T/M)) where T=target, M=min candidate
    """
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                continue  # Pruning
            
            current.append(candidates[i])
            # i (not i+1) allows reuse
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result
```

### Combination Sum II (no reuse) - LC 40

```python
def combination_sum2(candidates: list[int], target: int) -> list[list[int]]:
    """
    Each number can only be used once.
    """
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result
```

### N-Queens (LC 51)

```python
def solve_n_queens(n: int) -> list[list[str]]:
    """
    Place n queens on n×n board such that no two attack each other.
    
    Use sets to track columns and diagonals.
    """
    result = []
    
    # Track occupied columns and diagonals
    cols = set()
    pos_diag = set()  # row + col
    neg_diag = set()  # row - col
    
    board = [['.'] * n for _ in range(n)]
    
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            if col in cols or (row + col) in pos_diag or (row - col) in neg_diag:
                continue
            
            # Place queen
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            board[row][col] = 'Q'
            
            backtrack(row + 1)
            
            # Remove queen
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board[row][col] = '.'
    
    backtrack(0)
    return result
```

### Word Search (LC 79)

```python
def exist(board: list[list[str]], word: str) -> bool:
    """
    Find if word exists in grid moving horizontally/vertically.
    """
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, idx):
        if idx == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[idx]):
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore all directions
        found = (backtrack(r + 1, c, idx + 1) or
                 backtrack(r - 1, c, idx + 1) or
                 backtrack(r, c + 1, idx + 1) or
                 backtrack(r, c - 1, idx + 1))
        
        # Restore
        board[r][c] = temp
        
        return found
    
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    
    return False
```

---

## 📋 Backtracking Pattern Summary

| Problem Type | Key Technique |
|--------------|---------------|
| Subsets | Include/exclude each element |
| Permutations | Track used elements |
| Combinations | Start from index, avoid duplicates |
| Grid search | Mark visited, restore |
| Constraint satisfaction | Use sets for O(1) checking |

---

## ⚠️ Common Mistakes

1. **Forgetting to backtrack** (undo changes)
2. **Wrong base case** (off-by-one)
3. **Not handling duplicates** properly
4. **Modifying instead of copying** result

---

## 🎓 Key Takeaways

1. **Always backtrack** - undo your choice
2. **Sort first** when dealing with duplicates
3. **Use sets** for efficient constraint checking
4. **Start index** prevents revisiting in combinations
5. **Pruning** can significantly improve performance
