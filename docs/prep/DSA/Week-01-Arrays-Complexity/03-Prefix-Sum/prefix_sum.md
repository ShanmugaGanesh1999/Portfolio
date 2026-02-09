# 📊 Prefix Sum Pattern

## 🎯 What is Prefix Sum?

**Prefix Sum** (also called **Cumulative Sum**) is a technique where we precompute the sum of elements from the start up to each index. This allows us to answer range sum queries in O(1) time after O(n) preprocessing.

---

## 🧠 The Core Idea

### Without Prefix Sum
```
Query: "What's the sum from index 2 to 5?"

arr = [3, 1, 4, 1, 5, 9, 2, 6]
                 
To answer: sum(arr[2:6]) = 4 + 1 + 5 + 9 = 19

Time: O(n) for each query!
```

### With Prefix Sum
```
arr =    [3,  1,  4,  1,  5,  9,  2,  6]
prefix = [3,  4,  8,  9, 14, 23, 25, 31]
         ↑   ↑   ↑   ↑   ↑   ↑   ↑   ↑
         3  3+1 ...cumulative sums...

Query sum(2, 5) = prefix[5] - prefix[1] = 23 - 4 = 19

Time: O(1) for each query!
```

---

## 📝 Building Prefix Sum Array

```python
def build_prefix_sum(arr):
    """
    Build prefix sum array.
    
    prefix[i] = sum of arr[0..i]
    
    Time: O(n)
    Space: O(n)
    """
    n = len(arr)
    prefix = [0] * n
    prefix[0] = arr[0]
    
    for i in range(1, n):
        prefix[i] = prefix[i-1] + arr[i]
    
    return prefix


# Example
arr = [3, 1, 4, 1, 5, 9, 2, 6]
prefix = build_prefix_sum(arr)
print(prefix)  # [3, 4, 8, 9, 14, 23, 25, 31]
```

---

## 🔍 Range Sum Query

```python
def range_sum(prefix, left, right):
    """
    Get sum of elements from index left to right (inclusive).
    
    Formula:
    - sum(left, right) = prefix[right] - prefix[left-1]
    - Special case: if left == 0, answer is prefix[right]
    
    Time: O(1)
    """
    if left == 0:
        return prefix[right]
    return prefix[right] - prefix[left - 1]


# Example
arr = [3, 1, 4, 1, 5, 9, 2, 6]
prefix = build_prefix_sum(arr)

print(range_sum(prefix, 0, 2))  # 3+1+4 = 8
print(range_sum(prefix, 2, 5))  # 4+1+5+9 = 19
print(range_sum(prefix, 4, 7))  # 5+9+2+6 = 22
```

---

## 🎨 Visualization

```
Index:      0    1    2    3    4    5    6    7
arr:       [3]  [1]  [4]  [1]  [5]  [9]  [2]  [6]
            |    |    |    |    |    |    |    |
            v    v    v    v    v    v    v    v
prefix:    [3]  [4]  [8]  [9] [14] [23] [25] [31]
            ↑                        ↑
            |                        |
            +------------------------+
            
    sum(0,5) = prefix[5] = 23
    sum(2,5) = prefix[5] - prefix[1] = 23 - 4 = 19
```

---

## 🧩 Alternative: Length n+1 Prefix Array

Many prefer creating a prefix array of length n+1 with prefix[0] = 0. This simplifies the formula:

```python
def build_prefix_sum_v2(arr):
    """
    Build prefix sum array of length n+1.
    
    prefix[i] = sum of arr[0..i-1]
    prefix[0] = 0 (sum of nothing)
    
    This simplifies range sum formula.
    """
    n = len(arr)
    prefix = [0] * (n + 1)
    
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    
    return prefix


def range_sum_v2(prefix, left, right):
    """
    Range sum with n+1 prefix array.
    
    sum(left, right) = prefix[right + 1] - prefix[left]
    
    No special case needed!
    """
    return prefix[right + 1] - prefix[left]


# Example
arr = [3, 1, 4, 1, 5, 9, 2, 6]
prefix = build_prefix_sum_v2(arr)
print(prefix)  # [0, 3, 4, 8, 9, 14, 23, 25, 31]

print(range_sum_v2(prefix, 0, 2))  # 8
print(range_sum_v2(prefix, 2, 5))  # 19
```

---

## 🚀 FAANG Problem: Subarray Sum Equals K (LeetCode 560)

### Problem
Given an array of integers and an integer k, find the total number of subarrays whose sum equals to k.

### Intuition
```
If prefix[j] - prefix[i] = k, then sum(i+1, j) = k

So we need: prefix[i] = prefix[j] - k

Use a hash map to count prefix sums we've seen!
```

### Solution

```python
def subarray_sum_equals_k(nums, k):
    """
    Find count of subarrays with sum equal to k.
    
    Key Insight:
    - If prefix_sum[j] - prefix_sum[i] = k
    - Then subarray (i+1 to j) has sum k
    - So we need prefix_sum[i] = prefix_sum[j] - k
    
    Use hash map to count how many times we've seen each prefix sum.
    
    Time: O(n)
    Space: O(n)
    """
    count = 0
    prefix_sum = 0
    # Map: prefix_sum -> count of occurrences
    prefix_count = {0: 1}  # Empty prefix has sum 0
    
    for num in nums:
        prefix_sum += num
        
        # If (prefix_sum - k) exists, those positions are valid starts
        if prefix_sum - k in prefix_count:
            count += prefix_count[prefix_sum - k]
        
        # Record current prefix sum
        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
    
    return count


# Example
nums = [1, 1, 1]
k = 2
print(subarray_sum_equals_k(nums, k))  # 2 (subarrays: [1,1], [1,1])

nums = [1, 2, 3, -3, 4]
k = 3
print(subarray_sum_equals_k(nums, k))  # 4
```

### Step-by-Step Trace

```
nums = [1, 1, 1], k = 2

Step 1: num = 1
  prefix_sum = 1
  Need: 1 - 2 = -1 (not in map) -> count = 0
  Map: {0: 1, 1: 1}

Step 2: num = 1
  prefix_sum = 2
  Need: 2 - 2 = 0 (in map with count 1) -> count = 1
  Map: {0: 1, 1: 1, 2: 1}

Step 3: num = 1
  prefix_sum = 3
  Need: 3 - 2 = 1 (in map with count 1) -> count = 2
  Map: {0: 1, 1: 1, 2: 1, 3: 1}

Final answer: 2
```

---

## 🎯 2D Prefix Sum

For matrices, we can extend prefix sum to 2D:

```python
def build_2d_prefix_sum(matrix):
    """
    Build 2D prefix sum for matrix.
    
    prefix[i][j] = sum of rectangle from (0,0) to (i-1,j-1)
    
    Time: O(m * n)
    Space: O(m * n)
    """
    if not matrix or not matrix[0]:
        return [[]]
    
    m, n = len(matrix), len(matrix[0])
    prefix = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            prefix[i][j] = (matrix[i-1][j-1] 
                          + prefix[i-1][j] 
                          + prefix[i][j-1] 
                          - prefix[i-1][j-1])
    
    return prefix


def region_sum(prefix, r1, c1, r2, c2):
    """
    Get sum of rectangle from (r1,c1) to (r2,c2) inclusive.
    
    Time: O(1)
    """
    return (prefix[r2+1][c2+1] 
            - prefix[r1][c2+1] 
            - prefix[r2+1][c1] 
            + prefix[r1][c1])


# Example
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

prefix = build_2d_prefix_sum(matrix)
print(region_sum(prefix, 0, 0, 1, 1))  # 1+2+4+5 = 12
print(region_sum(prefix, 1, 1, 2, 2))  # 5+6+8+9 = 28
```

---

## 📚 Practice Problems

| Problem | Difficulty | Key Concept |
|---------|------------|-------------|
| Range Sum Query (LC 303) | Easy | Basic prefix sum |
| Subarray Sum Equals K (LC 560) | Medium | Prefix sum + hash map |
| Continuous Subarray Sum (LC 523) | Medium | Prefix sum + modulo |
| Range Sum Query 2D (LC 304) | Medium | 2D prefix sum |
| Product of Array Except Self (LC 238) | Medium | Prefix/suffix products |

---

## 📝 Key Takeaways

1. **Prefix sum trades space for time** - O(n) space to answer queries in O(1)
2. **Use hash map for "find subarray with sum X"** problems
3. **The key formula**: `sum(i, j) = prefix[j] - prefix[i-1]`
4. **Can extend to 2D** for matrix range sum queries
5. **Look for prefix sum** when problem involves range sums
