# 📚 Array Basics & Implementation

## 🎯 What is an Array?

An **array** is a collection of elements stored at **contiguous memory locations**. It's the most fundamental data structure and the building block for many other structures.

---

## 🧠 Key Characteristics

| Property | Description |
|----------|-------------|
| **Indexed** | Elements accessed by index (0-based in Python) |
| **Ordered** | Elements maintain insertion order |
| **Contiguous** | Elements stored in adjacent memory |
| **Homogeneous** | Typically same data type (in typed languages) |

---

## 📊 Array Operations & Complexity

| Operation | Time Complexity | Explanation |
|-----------|-----------------|-------------|
| **Access** | O(1) | Direct index calculation |
| **Search** | O(n) | May need to check all elements |
| **Insert at end** | O(1)* | Amortized - occasionally O(n) for resize |
| **Insert at index** | O(n) | Must shift elements |
| **Delete at end** | O(1) | Just decrease size |
| **Delete at index** | O(n) | Must shift elements |

---

## 🐍 Arrays in Python

Python has two main array-like structures:

### 1. Lists (Dynamic Arrays)

```python
# Creating lists
arr = []                    # Empty list
arr = [1, 2, 3, 4, 5]      # With initial values
arr = [0] * 10              # 10 zeros
arr = list(range(1, 6))     # [1, 2, 3, 4, 5]

# 2D arrays (matrix)
matrix = [[0] * 3 for _ in range(3)]  # 3x3 matrix
```

### 2. Array module (Fixed type)

```python
from array import array

# Create typed array (more memory efficient)
int_arr = array('i', [1, 2, 3, 4, 5])  # 'i' = signed int
float_arr = array('f', [1.0, 2.0, 3.0])  # 'f' = float
```

**For interviews, we mainly use Python lists.**

---

## 🔧 Essential List Operations

### Accessing Elements

```python
arr = [10, 20, 30, 40, 50]

# Forward indexing (0-based)
arr[0]      # 10 (first element)
arr[2]      # 30 (third element)
arr[-1]     # 50 (last element)
arr[-2]     # 40 (second to last)

# Slicing [start:end:step] - end is exclusive
arr[1:4]    # [20, 30, 40]
arr[:3]     # [10, 20, 30] (first 3)
arr[2:]     # [30, 40, 50] (from index 2)
arr[::2]    # [10, 30, 50] (every 2nd)
arr[::-1]   # [50, 40, 30, 20, 10] (reversed)
```

### Modifying Elements

```python
arr = [1, 2, 3, 4, 5]

# Update single element
arr[0] = 10  # [10, 2, 3, 4, 5]

# Update slice
arr[1:3] = [20, 30]  # [10, 20, 30, 4, 5]

# Append (add to end)
arr.append(6)  # [10, 20, 30, 4, 5, 6]

# Insert at index
arr.insert(0, 0)  # [0, 10, 20, 30, 4, 5, 6]

# Extend (add multiple)
arr.extend([7, 8])  # [0, 10, 20, 30, 4, 5, 6, 7, 8]

# Remove by value (first occurrence)
arr.remove(4)  # [0, 10, 20, 30, 5, 6, 7, 8]

# Remove by index
del arr[0]     # [10, 20, 30, 5, 6, 7, 8]
popped = arr.pop()   # returns 8, arr = [10, 20, 30, 5, 6, 7]
popped = arr.pop(0)  # returns 10, arr = [20, 30, 5, 6, 7]
```

### Searching & Counting

```python
arr = [1, 2, 3, 2, 4, 2, 5]

# Check existence
2 in arr        # True
10 in arr       # False

# Find index (first occurrence)
arr.index(2)    # 1

# Count occurrences
arr.count(2)    # 3

# Min, Max, Sum
min(arr)        # 1
max(arr)        # 5
sum(arr)        # 19
```

### Sorting & Reversing

```python
arr = [3, 1, 4, 1, 5, 9, 2, 6]

# In-place sort (modifies original)
arr.sort()              # [1, 1, 2, 3, 4, 5, 6, 9]
arr.sort(reverse=True)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Return new sorted list (original unchanged)
sorted_arr = sorted(arr)
sorted_desc = sorted(arr, reverse=True)

# Sort by custom key
words = ["apple", "pie", "a", "banana"]
words.sort(key=len)     # ['a', 'pie', 'apple', 'banana']
words.sort(key=lambda x: x[-1])  # Sort by last character

# Reverse in-place
arr.reverse()

# Reverse (new list)
reversed_arr = arr[::-1]
reversed_arr = list(reversed(arr))
```

---

## 🔄 Iterating Through Arrays

### Basic Iteration

```python
arr = [10, 20, 30, 40, 50]

# Method 1: Direct iteration
for num in arr:
    print(num)

# Method 2: With index using enumerate
for i, num in enumerate(arr):
    print(f"Index {i}: {num}")

# Method 3: Using range (when you need index)
for i in range(len(arr)):
    print(f"arr[{i}] = {arr[i]}")

# Method 4: Reverse iteration
for num in reversed(arr):
    print(num)

for i in range(len(arr) - 1, -1, -1):
    print(arr[i])
```

### Two Pointer Iteration

```python
arr = [1, 2, 3, 4, 5]

# From both ends
left, right = 0, len(arr) - 1
while left < right:
    print(arr[left], arr[right])
    left += 1
    right -= 1
```

### Iterating Multiple Arrays

```python
arr1 = [1, 2, 3]
arr2 = [4, 5, 6]

# Using zip
for a, b in zip(arr1, arr2):
    print(a, b)  # 1 4, 2 5, 3 6

# With index
for i, (a, b) in enumerate(zip(arr1, arr2)):
    print(i, a, b)
```

---

## 🧩 Common Array Techniques

### 1. Swapping Elements

```python
arr = [1, 2, 3, 4, 5]

# Pythonic swap
arr[0], arr[4] = arr[4], arr[0]  # [5, 2, 3, 4, 1]
```

### 2. In-Place Reversal

```python
def reverse_array(arr):
    """Reverse array in-place using two pointers"""
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr

# Example
arr = [1, 2, 3, 4, 5]
reverse_array(arr)  # [5, 4, 3, 2, 1]
```

### 3. Finding Second Largest

```python
def find_second_largest(arr):
    """Find second largest in O(n) time"""
    if len(arr) < 2:
        return None
    
    first = second = float('-inf')
    
    for num in arr:
        if num > first:
            second = first
            first = num
        elif num > second and num != first:
            second = num
    
    return second if second != float('-inf') else None

# Example
arr = [12, 35, 1, 10, 34, 1]
find_second_largest(arr)  # 34
```

### 4. Remove Duplicates (In-Place)

```python
def remove_duplicates(arr):
    """
    Remove duplicates from sorted array in-place
    Returns new length
    """
    if not arr:
        return 0
    
    write_idx = 1
    
    for i in range(1, len(arr)):
        if arr[i] != arr[i - 1]:
            arr[write_idx] = arr[i]
            write_idx += 1
    
    return write_idx

# Example
arr = [1, 1, 2, 2, 3, 4, 4, 5]
new_length = remove_duplicates(arr)  # 5
# arr[:new_length] = [1, 2, 3, 4, 5]
```

### 5. Rotate Array

```python
def rotate_array(arr, k):
    """Rotate array to the right by k steps"""
    n = len(arr)
    k = k % n  # Handle k > n
    
    # Reverse entire array
    arr.reverse()
    # Reverse first k elements
    arr[:k] = reversed(arr[:k])
    # Reverse remaining elements
    arr[k:] = reversed(arr[k:])
    
    return arr

# Example
arr = [1, 2, 3, 4, 5, 6, 7]
rotate_array(arr, 3)  # [5, 6, 7, 1, 2, 3, 4]
```

---

## 🎯 List Comprehensions

List comprehensions are Pythonic ways to create and transform lists.

```python
# Basic comprehension
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition (filter)
even_squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Transform and filter
words = ["hello", "WORLD", "Python", "DSA"]
lower_words = [w.lower() for w in words if len(w) > 3]
# ['hello', 'world', 'python']

# Nested comprehension (2D array)
matrix = [[i * j for j in range(4)] for i in range(3)]
# [[0, 0, 0, 0], [0, 1, 2, 3], [0, 2, 4, 6]]

# Flatten 2D to 1D
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [x for row in matrix for x in row]
# [1, 2, 3, 4, 5, 6]
```

---

## ⚠️ Common Pitfalls

### 1. Modifying List While Iterating

```python
# ❌ WRONG - Modifying while iterating
arr = [1, 2, 3, 4, 5]
for i, num in enumerate(arr):
    if num % 2 == 0:
        arr.remove(num)  # Dangerous!

# ✅ CORRECT - Create new list or iterate backwards
arr = [num for num in arr if num % 2 != 0]

# Or iterate backwards
for i in range(len(arr) - 1, -1, -1):
    if arr[i] % 2 == 0:
        arr.pop(i)
```

### 2. Shallow Copy vs Deep Copy

```python
# Shallow copy (nested objects share reference)
arr = [[1, 2], [3, 4]]
copy = arr.copy()  # or arr[:] or list(arr)
copy[0][0] = 99
print(arr)  # [[99, 2], [3, 4]] - Original modified!

# Deep copy (completely independent)
import copy
arr = [[1, 2], [3, 4]]
deep = copy.deepcopy(arr)
deep[0][0] = 99
print(arr)  # [[1, 2], [3, 4]] - Original unchanged
```

### 3. 2D Array Initialization

```python
# ❌ WRONG - All rows share same reference
matrix = [[0] * 3] * 3
matrix[0][0] = 1
print(matrix)  # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

# ✅ CORRECT - Each row is independent
matrix = [[0] * 3 for _ in range(3)]
matrix[0][0] = 1
print(matrix)  # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

---

## 📝 Key Takeaways

1. **Arrays provide O(1) access** - leverage this for efficient algorithms
2. **Insert/Delete in middle is O(n)** - avoid when possible
3. **Two-pointer technique** - powerful for many array problems
4. **List comprehensions** - write clean, Pythonic code
5. **Be careful with shallow copies** - especially with nested lists
6. **Use `enumerate`** when you need both index and value

---

## ➡️ Next: [Dynamic Array Implementation](./dynamic_array.py)
