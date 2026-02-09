# 🎯 DSA Pattern Cheatsheet - Quick Reference

## 📌 Pattern Recognition Guide

Use this cheatsheet to quickly identify which pattern to apply.

---

## 🔍 Problem Keywords → Pattern Mapping

### Array/String Keywords

| Keyword | Pattern | Example Problem |
|---------|---------|-----------------|
| "Subarray", "contiguous" | Sliding Window | Max sum subarray |
| "Two values", "pair" | Two Pointers | Two Sum II |
| "Sorted array" | Binary Search / Two Pointers | Search insert |
| "Rotate", "cycle" | Cyclic Sort / Two Pointers | Rotate array |
| "Anagram", "permutation" | Hash Map + Sliding Window | Find anagrams |
| "Palindrome" | Two Pointers / DP | Valid palindrome |
| "Longest/shortest" | Sliding Window / DP | Longest substring |

### Linked List Keywords

| Keyword | Pattern | Example Problem |
|---------|---------|-----------------|
| "Middle", "half" | Fast & Slow Pointers | Middle of list |
| "Cycle", "loop" | Fast & Slow Pointers | Detect cycle |
| "Reverse" | Iterative reversal | Reverse list |
| "Merge", "sorted" | Two Pointers | Merge two lists |
| "Nth from end" | Two Pointers (gap) | Remove Nth node |

### Tree/Graph Keywords

| Keyword | Pattern | Example Problem |
|---------|---------|-----------------|
| "Level by level" | BFS | Level order traversal |
| "Depth", "height" | DFS | Max depth |
| "Path", "sum" | DFS | Path sum |
| "Ancestor" | DFS | LCA |
| "Shortest path" | BFS | Word ladder |
| "Dependencies" | Topological Sort | Course schedule |
| "Connected" | Union Find / DFS | Number of islands |
| "All paths", "permutations" | Backtracking | All paths |

### DP Keywords

| Keyword | Pattern | Example Problem |
|---------|---------|-----------------|
| "Maximum/minimum" | DP | Max profit |
| "Ways to", "count" | DP | Climbing stairs |
| "Can you", "possible" | DP / Backtracking | Word break |
| "Longest", "shortest" | DP | LIS, LCS |
| "Subset", "partition" | Knapsack DP | Partition equal |
| "Target sum" | Knapsack DP | Coin change |

---

## 📊 Pattern Templates

### 1. Two Pointers (Opposite Direction)
```python
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        if condition:
            left += 1
        else:
            right -= 1
    return result
```

### 2. Sliding Window (Variable)
```python
def sliding_window(arr):
    left = 0
    for right in range(len(arr)):
        # Add arr[right] to window
        while invalid_condition:
            # Remove arr[left]
            left += 1
        # Update result
```

### 3. Binary Search
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
```

### 4. BFS (Level Order)
```python
def bfs(start):
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### 5. DFS (Recursive)
```python
def dfs(node, visited):
    if not node or node in visited:
        return
    visited.add(node)
    for neighbor in node.neighbors:
        dfs(neighbor, visited)
```

### 6. Backtracking
```python
def backtrack(state, choices):
    if is_solution(state):
        result.append(state[:])
        return
    for choice in choices:
        state.append(choice)
        backtrack(state, remaining)
        state.pop()
```

### 7. DP (Bottom-Up)
```python
def dp(n):
    dp = [0] * (n + 1)
    dp[0] = base_case
    for i in range(1, n + 1):
        dp[i] = recurrence(dp[i-1], ...)
    return dp[n]
```

---

## 🚀 Time Complexity Quick Reference

| Algorithm | Time | Space |
|-----------|------|-------|
| Binary Search | O(log n) | O(1) |
| Two Pointers | O(n) | O(1) |
| Sliding Window | O(n) | O(k) |
| BFS/DFS | O(V + E) | O(V) |
| Sorting | O(n log n) | O(n) |
| Heap operations | O(log n) | O(n) |
| Trie operations | O(m) | O(n*m) |

---

## ⚠️ Common Mistakes to Avoid

1. **Off-by-one errors** - Test with small inputs
2. **Empty input** - Always check!
3. **Integer overflow** - Use `mid = left + (right - left) // 2`
4. **Modifying while iterating** - Use copy or index
5. **Not handling duplicates** - Sort + skip pattern
6. **Wrong loop condition** - `<` vs `<=`
7. **Forgetting to backtrack** - Undo changes!
8. **Not marking visited** - Infinite loops in graphs

---

## 🎯 Interview Approach

1. **Clarify** (2-3 min)
   - Input constraints?
   - Edge cases?
   - Expected output?

2. **Plan** (3-5 min)
   - Identify pattern
   - Discuss approach
   - Analyze complexity

3. **Code** (15-20 min)
   - Write clean code
   - Use meaningful names
   - Add comments for tricky parts

4. **Test** (5-7 min)
   - Walk through example
   - Try edge cases
   - Fix bugs

5. **Optimize** (if time)
   - Better complexity?
   - Cleaner code?

---

## 📚 Must-Know Problems (Blind 75 Highlights)

### Arrays
- Two Sum
- Best Time to Buy/Sell Stock
- Contains Duplicate
- Product of Array Except Self
- Maximum Subarray

### Strings
- Valid Anagram
- Valid Palindrome
- Longest Substring Without Repeat
- Longest Palindromic Substring

### Linked Lists
- Reverse Linked List
- Merge Two Sorted Lists
- Detect Cycle
- Remove Nth Node

### Trees
- Max Depth
- Invert Tree
- Validate BST
- Level Order Traversal
- Lowest Common Ancestor

### Graphs
- Number of Islands
- Clone Graph
- Course Schedule
- Pacific Atlantic Water Flow

### DP
- Climbing Stairs
- Coin Change
- Longest Increasing Subsequence
- Word Break
- House Robber

---

**Good luck with your FAANG interviews! 🚀**
