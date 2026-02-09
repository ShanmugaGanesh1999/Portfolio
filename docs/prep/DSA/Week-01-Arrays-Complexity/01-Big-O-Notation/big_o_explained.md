# 📊 Big O Notation - Complete Guide

## 🎯 What is Big O Notation?

Big O notation describes the **upper bound** of an algorithm's time or space requirements as the input size grows. It answers: *"How does the runtime/space scale as input increases?"*

---

## 🧠 Why Does It Matter?

In FAANG interviews, you'll be asked:
1. "What's the time complexity?"
2. "Can you optimize this?"
3. "What's the space complexity?"

Understanding Big O helps you:
- Compare algorithms objectively
- Identify bottlenecks
- Optimize solutions

---

## 📈 Common Time Complexities

### From Best to Worst:

```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

### Visual Comparison

```
Input Size: n = 1,000,000 (1 million)

┌──────────────┬─────────────────────────────────────┐
│ Complexity   │ Operations                          │
├──────────────┼─────────────────────────────────────┤
│ O(1)         │ 1                                   │
│ O(log n)     │ ~20                                 │
│ O(n)         │ 1,000,000                           │
│ O(n log n)   │ ~20,000,000                         │
│ O(n²)        │ 1,000,000,000,000 (1 trillion!)     │
│ O(2ⁿ)        │ Practically infinite                │
└──────────────┴─────────────────────────────────────┘
```

---

## 📝 Detailed Examples

### O(1) - Constant Time

**The runtime doesn't change with input size.**

```python
def get_first_element(arr):
    """O(1) - Always one operation regardless of array size"""
    return arr[0] if arr else None

def is_even(n):
    """O(1) - Single operation"""
    return n % 2 == 0

def swap(arr, i, j):
    """O(1) - Fixed number of operations"""
    arr[i], arr[j] = arr[j], arr[i]
```

**Common O(1) operations:**
- Array access by index
- Hash table lookup (average case)
- Stack push/pop
- Queue enqueue/dequeue

---

### O(log n) - Logarithmic Time

**The runtime grows logarithmically - very efficient for large inputs.**

```python
def binary_search(arr, target):
    """
    O(log n) - Each step halves the search space
    
    For n = 1,000,000: only ~20 comparisons needed!
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1  # Eliminate left half
        else:
            right = mid - 1  # Eliminate right half
    
    return -1
```

**Why log n?**
```
n = 16
Step 1: 16 → 8   (divide by 2)
Step 2: 8 → 4    (divide by 2)
Step 3: 4 → 2    (divide by 2)
Step 4: 2 → 1    (divide by 2)

4 steps for n=16, because log₂(16) = 4
```

**Common O(log n) operations:**
- Binary search
- Operations on balanced BST
- Finding power using divide & conquer

---

### O(n) - Linear Time

**Runtime grows linearly with input size.**

```python
def find_max(arr):
    """O(n) - Must check every element once"""
    if not arr:
        return None
    
    max_val = arr[0]
    for num in arr:  # n iterations
        if num > max_val:
            max_val = num
    return max_val

def linear_search(arr, target):
    """O(n) - Worst case: check all elements"""
    for i, num in enumerate(arr):
        if num == target:
            return i
    return -1

def sum_array(arr):
    """O(n) - Touch each element once"""
    total = 0
    for num in arr:
        total += num
    return total
```

**Common O(n) operations:**
- Linear search
- Finding min/max
- Counting elements
- Single loop through data

---

### O(n log n) - Linearithmic Time

**Common for efficient sorting algorithms.**

```python
def merge_sort(arr):
    """
    O(n log n) - Divide and conquer
    
    - log n levels of recursion (dividing)
    - n work at each level (merging)
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    """O(n) - Merge two sorted arrays"""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

**Common O(n log n) operations:**
- Merge Sort
- Quick Sort (average case)
- Heap Sort
- Sorting-based solutions

---

### O(n²) - Quadratic Time

**Runtime grows with square of input - often indicates nested loops.**

```python
def bubble_sort(arr):
    """
    O(n²) - Nested loops
    
    For n = 1000: 1,000,000 operations
    For n = 10000: 100,000,000 operations (slow!)
    """
    n = len(arr)
    for i in range(n):           # n iterations
        for j in range(n - 1):   # n iterations
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def find_pairs_with_sum(arr, target):
    """O(n²) - Check all pairs (brute force)"""
    pairs = []
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] + arr[j] == target:
                pairs.append((arr[i], arr[j]))
    return pairs

def has_duplicate_brute(arr):
    """O(n²) - Compare every element with every other"""
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] == arr[j]:
                return True
    return False
```

**⚠️ Warning:** O(n²) is often not acceptable in interviews for large inputs. Look for optimization opportunities!

---

### O(2ⁿ) - Exponential Time

**Very slow - doubles with each additional input element.**

```python
def fibonacci_recursive(n):
    """
    O(2ⁿ) - Exponential due to repeated calculations
    
    fib(5) calls fib(4) and fib(3)
    fib(4) calls fib(3) and fib(2)
    ...creates a tree of calls
    """
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

def all_subsets(arr):
    """
    O(2ⁿ) - Number of subsets doubles with each element
    
    n=3: 8 subsets
    n=4: 16 subsets
    n=10: 1024 subsets
    n=20: 1,048,576 subsets!
    """
    if not arr:
        return [[]]
    
    first = arr[0]
    rest_subsets = all_subsets(arr[1:])
    
    with_first = [[first] + subset for subset in rest_subsets]
    return rest_subsets + with_first
```

---

## 🧮 How to Analyze Complexity

### Rule 1: Drop Constants

```python
# This is O(n), not O(3n)
def process(arr):
    for x in arr:    # n
        print(x)
    for x in arr:    # n
        print(x)
    for x in arr:    # n
        print(x)
```

**O(3n) → O(n)** because constants don't affect growth rate.

---

### Rule 2: Drop Lower-Order Terms

```python
# This is O(n²), not O(n² + n)
def mixed(arr):
    n = len(arr)
    
    # O(n²)
    for i in range(n):
        for j in range(n):
            print(i, j)
    
    # O(n)
    for x in arr:
        print(x)
```

**O(n² + n) → O(n²)** because n² dominates as n grows.

---

### Rule 3: Different Inputs = Different Variables

```python
def process_two_arrays(arr1, arr2):
    """
    O(a + b) where a = len(arr1), b = len(arr2)
    NOT O(n)!
    """
    for x in arr1:   # O(a)
        print(x)
    for y in arr2:   # O(b)
        print(y)

def nested_two_arrays(arr1, arr2):
    """O(a * b) - nested loops with different inputs"""
    for x in arr1:
        for y in arr2:
            print(x, y)
```

---

### Rule 4: Nested Loops Multiply

```python
# O(n * m)
def nested(arr1, arr2):
    for i in arr1:      # n iterations
        for j in arr2:  # m iterations each
            print(i, j)

# O(n * n) = O(n²)
def square(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n):
            print(i, j)

# O(n * log n)
def search_in_loop(arr, targets):
    arr.sort()  # Assume arr is sorted
    for target in targets:          # n iterations
        binary_search(arr, target)  # log n each
```

---

## 💾 Space Complexity

Space complexity measures **additional memory** used by the algorithm.

### O(1) Space

```python
def reverse_in_place(arr):
    """O(1) space - Only uses a few variables"""
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
```

### O(n) Space

```python
def reverse_with_new_array(arr):
    """O(n) space - Creates new array of same size"""
    return arr[::-1]

def count_frequency(arr):
    """O(n) space - Hash map can store up to n keys"""
    freq = {}
    for num in arr:
        freq[num] = freq.get(num, 0) + 1
    return freq
```

### O(n) Space for Recursion

```python
def factorial(n):
    """
    O(n) space due to call stack
    Each recursive call adds a frame to the stack
    """
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

---

## 🎯 Quick Reference Cheat Sheet

| Algorithm/Operation | Time | Space |
|---------------------|------|-------|
| Array access | O(1) | O(1) |
| Array append | O(1)* | O(1) |
| Array insert/delete | O(n) | O(1) |
| Linear search | O(n) | O(1) |
| Binary search | O(log n) | O(1) |
| Hash table lookup | O(1)* | O(n) |
| Bubble/Selection/Insertion sort | O(n²) | O(1) |
| Merge sort | O(n log n) | O(n) |
| Quick sort | O(n log n)* | O(log n) |
| Heap sort | O(n log n) | O(1) |
| BFS/DFS on graph | O(V + E) | O(V) |

*\* = average/amortized case*

---

## 🏋️ Practice Exercises

### Exercise 1: Analyze This Code

```python
def mystery(arr):
    n = len(arr)
    result = 0
    
    for i in range(n):
        for j in range(i, n):
            result += arr[j]
    
    return result
```

<details>
<summary>Answer</summary>

**Time: O(n²)**
- Outer loop: n iterations
- Inner loop: n, n-1, n-2, ..., 1 iterations
- Total: n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 = O(n²)

**Space: O(1)** - only using a few variables

</details>

### Exercise 2: Analyze This Code

```python
def mystery2(n):
    if n <= 0:
        return 0
    return n + mystery2(n // 2)
```

<details>
<summary>Answer</summary>

**Time: O(log n)** - n is halved each call  
**Space: O(log n)** - recursion depth is log n

</details>

### Exercise 3: Optimize This

```python
# Current: O(n²)
def has_duplicate(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False
```

<details>
<summary>Optimized Answer</summary>

```python
# Optimized: O(n) time, O(n) space
def has_duplicate(arr):
    seen = set()
    for num in arr:
        if num in seen:
            return True
        seen.add(num)
    return False
```

</details>

---

## 📝 Key Takeaways

1. **Big O describes growth rate**, not exact runtime
2. **Drop constants and lower-order terms**
3. **Nested loops usually multiply** complexities
4. **Space complexity includes** call stack for recursion
5. **O(n²) or worse is usually a red flag** - look for optimization
6. **O(n log n) is often the best** for comparison-based sorting

---

## ➡️ Next: [Array Basics & Implementation](../02-Array-Implementation/array_basics.md)
