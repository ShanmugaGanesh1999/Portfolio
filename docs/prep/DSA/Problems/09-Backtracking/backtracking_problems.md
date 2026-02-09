# 🔙 Backtracking - Complete Problem Set

## Problem 1: Subsets (Medium)
**LeetCode 78**

### Problem
Generate all subsets of array with distinct elements.

### Intuition
For each element, choose to include or exclude it.

### Solution
```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Time: O(n * 2^n)
    Space: O(n) for recursion
    """
    result = []
    
    def backtrack(index, current):
        if index == len(nums):
            result.append(current[:])
            return
        
        # Exclude current element
        backtrack(index + 1, current)
        
        # Include current element
        current.append(nums[index])
        backtrack(index + 1, current)
        current.pop()
    
    backtrack(0, [])
    return result

# Iterative approach
def subsets_iterative(nums: list[int]) -> list[list[int]]:
    """Build subsets incrementally"""
    result = [[]]
    
    for num in nums:
        result += [subset + [num] for subset in result]
    
    return result
```

---

## Problem 2: Subsets II (Medium)
**LeetCode 90**

### Problem
Generate all subsets with possible duplicates.

### Intuition
Sort first. Skip duplicates at same level of recursion.

### Solution
```python
def subsetsWithDup(nums: list[int]) -> list[list[int]]:
    """
    Time: O(n * 2^n)
    Space: O(n)
    """
    nums.sort()  # Sort to handle duplicates
    result = []
    
    def backtrack(index, current):
        result.append(current[:])
        
        for i in range(index, len(nums)):
            # Skip duplicates at same level
            if i > index and nums[i] == nums[i-1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

## Problem 3: Permutations (Medium)
**LeetCode 46**

### Problem
Generate all permutations of distinct integers.

### Intuition
At each position, try all remaining unused numbers.

### Solution
```python
def permute(nums: list[int]) -> list[list[int]]:
    """
    Time: O(n * n!)
    Space: O(n)
    """
    result = []
    
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()
    
    backtrack([], nums)
    return result

# In-place swap approach
def permute_swap(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result
```

---

## Problem 4: Permutations II (Medium)
**LeetCode 47**

### Problem
Generate all unique permutations with possible duplicates.

### Intuition
Sort and skip duplicates. Use visited array.

### Solution
```python
def permuteUnique(nums: list[int]) -> list[list[int]]:
    """
    Time: O(n * n!)
    Space: O(n)
    """
    nums.sort()
    result = []
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            # Skip used or duplicate at same level
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result
```

---

## Problem 5: Combination Sum (Medium)
**LeetCode 39**

### Problem
Find all combinations that sum to target (can reuse elements).

### Intuition
For each element, try using it multiple times or skip.

### Solution
```python
def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Time: O(n^(target/min))
    Space: O(target/min)
    """
    result = []
    
    def backtrack(index, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return
        
        for i in range(index, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])  # Same i for reuse
            current.pop()
    
    backtrack(0, [], target)
    return result
```

---

## Problem 6: Combination Sum II (Medium)
**LeetCode 40**

### Problem
Find all unique combinations that sum to target (each element used once).

### Intuition
Sort to handle duplicates. Skip same elements at same level.

### Solution
```python
def combinationSum2(candidates: list[int], target: int) -> list[list[int]]:
    """
    Time: O(2^n)
    Space: O(n)
    """
    candidates.sort()
    result = []
    
    def backtrack(index, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return
        
        for i in range(index, len(candidates)):
            # Skip duplicates at same level
            if i > index and candidates[i] == candidates[i-1]:
                continue
            
            # Pruning: no point continuing if current > remaining
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result
```

---

## Problem 7: Combination Sum III (Medium)
**LeetCode 216**

### Problem
Find all combinations of k numbers (1-9) that sum to n.

### Intuition
Backtrack choosing numbers 1-9 without repetition.

### Solution
```python
def combinationSum3(k: int, n: int) -> list[list[int]]:
    """
    Time: O(C(9, k))
    Space: O(k)
    """
    result = []
    
    def backtrack(start, current, remaining):
        if len(current) == k:
            if remaining == 0:
                result.append(current[:])
            return
        
        for num in range(start, 10):
            if num > remaining:  # Pruning
                break
            
            current.append(num)
            backtrack(num + 1, current, remaining - num)
            current.pop()
    
    backtrack(1, [], n)
    return result
```

---

## Problem 8: Word Search (Medium)
**LeetCode 79**

### Problem
Check if word exists in grid (horizontally/vertically adjacent).

### Intuition
DFS from each cell, mark visited during search.

### Solution
```python
def exist(board: list[list[str]], word: str) -> bool:
    """
    Time: O(m * n * 4^L) where L = word length
    Space: O(L) for recursion
    """
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c, index):
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        # Mark visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore all directions
        found = (dfs(r + 1, c, index + 1) or
                 dfs(r - 1, c, index + 1) or
                 dfs(r, c + 1, index + 1) or
                 dfs(r, c - 1, index + 1))
        
        # Restore
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    
    return False
```

---

## Problem 9: Palindrome Partitioning (Medium)
**LeetCode 131**

### Problem
Partition string so every substring is palindrome.

### Intuition
At each position, try all palindrome prefixes as first partition.

### Solution
```python
def partition(s: str) -> list[list[str]]:
    """
    Time: O(n * 2^n)
    Space: O(n)
    """
    result = []
    
    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    def backtrack(index, current):
        if index == len(s):
            result.append(current[:])
            return
        
        for end in range(index, len(s)):
            if is_palindrome(index, end):
                current.append(s[index:end + 1])
                backtrack(end + 1, current)
                current.pop()
    
    backtrack(0, [])
    return result
```

---

## Problem 10: Letter Combinations of a Phone Number (Medium)
**LeetCode 17**

### Problem
Return all letter combinations that phone number could represent.

### Intuition
For each digit, try all corresponding letters.

### Solution
```python
def letterCombinations(digits: str) -> list[str]:
    """
    Time: O(4^n)
    Space: O(n)
    """
    if not digits:
        return []
    
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(index, current):
        if index == len(digits):
            result.append(current)
            return
        
        for letter in mapping[digits[index]]:
            backtrack(index + 1, current + letter)
    
    backtrack(0, '')
    return result
```

---

## Problem 11: N-Queens (Hard)
**LeetCode 51**

### Problem
Place n queens on n×n board so no two attack each other.

### Intuition
Place row by row. Track columns and diagonals under attack.

### Solution
```python
def solveNQueens(n: int) -> list[list[str]]:
    """
    Time: O(n!)
    Space: O(n)
    """
    result = []
    board = [['.'] * n for _ in range(n)]
    
    cols = set()
    pos_diag = set()  # r + c
    neg_diag = set()  # r - c
    
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

---

## Problem 12: N-Queens II (Hard)
**LeetCode 52**

### Problem
Count number of distinct N-Queens solutions.

### Intuition
Same as N-Queens but just count solutions.

### Solution
```python
def totalNQueens(n: int) -> int:
    """
    Time: O(n!)
    Space: O(n)
    """
    cols = set()
    pos_diag = set()
    neg_diag = set()
    count = 0
    
    def backtrack(row):
        nonlocal count
        
        if row == n:
            count += 1
            return
        
        for col in range(n):
            if col in cols or (row + col) in pos_diag or (row - col) in neg_diag:
                continue
            
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            
            backtrack(row + 1)
            
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
    
    backtrack(0)
    return count
```

---

## Problem 13: Sudoku Solver (Hard)
**LeetCode 37**

### Problem
Solve Sudoku puzzle.

### Intuition
For each empty cell, try 1-9. Check row, column, and box constraints.

### Solution
```python
def solveSudoku(board: list[list[str]]) -> None:
    """
    Time: O(9^(empty cells))
    Space: O(1)
    """
    def is_valid(row, col, num):
        # Check row
        if num in board[row]:
            return False
        
        # Check column
        for r in range(9):
            if board[r][col] == num:
                return False
        
        # Check 3x3 box
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for r in range(box_row, box_row + 3):
            for c in range(box_col, box_col + 3):
                if board[r][c] == num:
                    return False
        
        return True
    
    def solve():
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in '123456789':
                        if is_valid(row, col, num):
                            board[row][col] = num
                            
                            if solve():
                                return True
                            
                            board[row][col] = '.'
                    
                    return False  # No valid number
        
        return True  # All cells filled
    
    solve()
```

---

## Problem 14: Restore IP Addresses (Medium)
**LeetCode 93**

### Problem
Return all valid IP addresses from string.

### Intuition
Partition into 4 parts, each 1-3 digits, value 0-255.

### Solution
```python
def restoreIpAddresses(s: str) -> list[str]:
    """
    Time: O(1) - max 27 combinations
    Space: O(1)
    """
    result = []
    
    def is_valid(segment):
        if len(segment) > 3:
            return False
        if len(segment) > 1 and segment[0] == '0':
            return False
        return 0 <= int(segment) <= 255
    
    def backtrack(index, parts):
        if len(parts) == 4:
            if index == len(s):
                result.append('.'.join(parts))
            return
        
        for length in range(1, 4):
            if index + length > len(s):
                break
            
            segment = s[index:index + length]
            if is_valid(segment):
                backtrack(index + length, parts + [segment])
    
    backtrack(0, [])
    return result
```

---

## Problem 15: Matchsticks to Square (Medium)
**LeetCode 473**

### Problem
Check if matchsticks can form a square.

### Intuition
Partition into 4 groups with equal sum.

### Solution
```python
def makesquare(matchsticks: list[int]) -> bool:
    """
    Time: O(4^n)
    Space: O(n)
    """
    total = sum(matchsticks)
    if total % 4 != 0:
        return False
    
    side = total // 4
    matchsticks.sort(reverse=True)  # Optimization: try larger first
    
    if matchsticks[0] > side:
        return False
    
    sides = [0] * 4
    
    def backtrack(index):
        if index == len(matchsticks):
            return all(s == side for s in sides)
        
        for i in range(4):
            if sides[i] + matchsticks[index] <= side:
                sides[i] += matchsticks[index]
                
                if backtrack(index + 1):
                    return True
                
                sides[i] -= matchsticks[index]
            
            # Optimization: if first side fails, others will too
            if sides[i] == 0:
                break
        
        return False
    
    return backtrack(0)
```

---

## Problem 16: Splitting a String Into Descending Consecutive Values (Medium)
**LeetCode 1849**

### Problem
Split string into parts where each value is 1 less than previous.

### Intuition
Try each prefix as first number, then greedily find next.

### Solution
```python
def splitString(s: str) -> bool:
    """
    Time: O(n²)
    Space: O(n)
    """
    def backtrack(index, prev_val, count):
        if index == len(s):
            return count >= 2
        
        current = 0
        for i in range(index, len(s)):
            current = current * 10 + int(s[i])
            
            # Too large
            if prev_val is not None and current >= prev_val:
                break
            
            if prev_val is None or current == prev_val - 1:
                if backtrack(i + 1, current, count + 1):
                    return True
        
        return False
    
    return backtrack(0, None, 0)
```

---

## Problem 17: Find Unique Binary String (Medium)
**LeetCode 1980**

### Problem
Find binary string not in given list.

### Intuition
Cantor's diagonal: for ith string, flip ith bit.

### Solution
```python
def findDifferentBinaryString(nums: list[str]) -> str:
    """
    Diagonal argument
    Time: O(n)
    Space: O(n)
    """
    result = []
    for i, num in enumerate(nums):
        result.append('0' if num[i] == '1' else '1')
    
    return ''.join(result)

# Backtracking approach
def findDifferentBinaryString_backtrack(nums: list[str]) -> str:
    num_set = set(nums)
    n = len(nums)
    
    def backtrack(current):
        if len(current) == n:
            if current not in num_set:
                return current
            return None
        
        # Try '0' first
        result = backtrack(current + '0')
        if result:
            return result
        
        return backtrack(current + '1')
    
    return backtrack('')
```

---

## 📊 Backtracking Summary

| Problem | Difficulty | Pattern | Key Technique |
|---------|------------|---------|---------------|
| Subsets | Medium | Subset | Include/exclude each |
| Subsets II | Medium | Subset | Skip duplicates |
| Permutations | Medium | Permutation | Use remaining elements |
| Permutations II | Medium | Permutation | Used array + sort |
| Combination Sum | Medium | Combination | Reuse allowed |
| Combination Sum II | Medium | Combination | Each once, skip dups |
| Combination Sum III | Medium | Combination | Numbers 1-9 |
| Word Search | Medium | Grid | DFS + mark visited |
| Palindrome Partition | Medium | Partition | Try all palindrome prefixes |
| Letter Combinations | Medium | Combination | Phone mapping |
| N-Queens | Hard | Constraint | Track cols/diagonals |
| N-Queens II | Hard | Constraint | Count solutions |
| Sudoku Solver | Hard | Constraint | Row/col/box validation |
| Restore IP | Medium | Partition | Valid segments |
| Matchsticks Square | Medium | Partition | 4 equal groups |

### Pattern Recognition:

**Subsets Pattern:**
```python
def backtrack(index, current):
    result.append(current[:])
    for i in range(index, len(nums)):
        current.append(nums[i])
        backtrack(i + 1, current)
        current.pop()
```

**Permutation Pattern:**
```python
def backtrack(current, remaining):
    if not remaining:
        result.append(current[:])
    for i in range(len(remaining)):
        current.append(remaining[i])
        backtrack(current, remaining[:i] + remaining[i+1:])
        current.pop()
```

**Combination Sum Pattern:**
```python
def backtrack(index, current, remaining):
    if remaining == 0:
        result.append(current[:])
    for i in range(index, len(candidates)):
        if candidates[i] <= remaining:
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])  # i for reuse
            current.pop()
```

### Key Optimizations:
1. **Sort first** for duplicate handling
2. **Pruning** - skip branches that can't lead to solution
3. **Early termination** - return as soon as solution found
