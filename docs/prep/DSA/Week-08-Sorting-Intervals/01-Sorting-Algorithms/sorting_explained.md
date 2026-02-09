# 🎯 Sorting Algorithms - Complete Guide

## 📌 Why Learn Sorting Algorithms?

1. **Foundational knowledge** for understanding time complexity
2. **Asked directly** in FAANG interviews
3. **Building blocks** for more complex algorithms
4. **Optimize solutions** - many problems become easier after sorting

---

## 📊 Quick Reference

| Algorithm | Best | Average | Worst | Space | Stable | Use Case |
|-----------|------|---------|-------|-------|--------|----------|
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No | General purpose |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Linked lists, stability needed |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | In-place needed |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | Small range integers |
| Radix Sort | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | Yes | Integers, strings |

---

## 🔥 Quick Sort

**Divide & Conquer**: Pick a pivot, partition array so elements < pivot are left, > pivot are right.

```python
def quick_sort(arr: list[int]) -> list[int]:
    """
    Quick Sort implementation.
    
    Time: O(n log n) average, O(n²) worst
    Space: O(log n) for recursion stack
    
    Steps:
    1. Pick pivot (here: last element)
    2. Partition: elements < pivot to left, > pivot to right
    3. Recursively sort left and right
    """
    def partition(low, high):
        """
        Lomuto partition scheme.
        Returns final position of pivot.
        """
        pivot = arr[high]
        i = low - 1  # Boundary of elements <= pivot
        
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        
        # Place pivot in correct position
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    def quick_sort_helper(low, high):
        if low < high:
            pi = partition(low, high)
            quick_sort_helper(low, pi - 1)
            quick_sort_helper(pi + 1, high)
    
    quick_sort_helper(0, len(arr) - 1)
    return arr

# Example
arr = [10, 7, 8, 9, 1, 5]
print(quick_sort(arr))  # [1, 5, 7, 8, 9, 10]
```

### Quick Sort with Random Pivot (Optimized)

```python
import random

def quick_sort_random(arr: list[int]) -> list[int]:
    """
    Quick Sort with random pivot to avoid O(n²) on sorted arrays.
    """
    def partition(low, high):
        # Random pivot selection
        rand_idx = random.randint(low, high)
        arr[rand_idx], arr[high] = arr[high], arr[rand_idx]
        
        pivot = arr[high]
        i = low - 1
        
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    def helper(low, high):
        if low < high:
            pi = partition(low, high)
            helper(low, pi - 1)
            helper(pi + 1, high)
    
    helper(0, len(arr) - 1)
    return arr
```

---

## 🔥 Merge Sort

**Divide & Conquer**: Split array in half, recursively sort, then merge.

```python
def merge_sort(arr: list[int]) -> list[int]:
    """
    Merge Sort implementation.
    
    Time: O(n log n) always
    Space: O(n) for auxiliary array
    
    Steps:
    1. Divide array into two halves
    2. Recursively sort each half
    3. Merge two sorted halves
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    """
    Merge two sorted arrays.
    """
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # <= for stability
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Append remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result

# Example
arr = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(arr))  # [3, 9, 10, 27, 38, 43, 82]
```

### In-Place Merge Sort (Interview Variant)

```python
def merge_sort_inplace(arr: list[int]) -> None:
    """
    In-place merge sort (still uses O(n) temp space for merge).
    """
    def merge_inplace(left, mid, right):
        # Create temp arrays
        L = arr[left:mid + 1]
        R = arr[mid + 1:right + 1]
        
        i = j = 0
        k = left
        
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
        
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
        
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
    
    def helper(left, right):
        if left < right:
            mid = (left + right) // 2
            helper(left, mid)
            helper(mid + 1, right)
            merge_inplace(left, mid, right)
    
    helper(0, len(arr) - 1)
```

---

## 🔥 Heap Sort

**Selection-based**: Build max-heap, repeatedly extract maximum.

```python
def heap_sort(arr: list[int]) -> list[int]:
    """
    Heap Sort implementation.
    
    Time: O(n log n) always
    Space: O(1) - in-place
    
    Steps:
    1. Build max heap
    2. Extract max (swap with last), heapify
    3. Repeat until sorted
    """
    n = len(arr)
    
    def heapify(n, i):
        """
        Heapify subtree rooted at index i.
        n is size of heap.
        """
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n and arr[left] > arr[largest]:
            largest = left
        
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(n, largest)
    
    # Build max heap (bottom-up)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # Move max to end
        heapify(i, 0)  # Heapify reduced heap
    
    return arr

# Example
arr = [12, 11, 13, 5, 6, 7]
print(heap_sort(arr))  # [5, 6, 7, 11, 12, 13]
```

---

## 🔥 Counting Sort

**Non-comparison sort**: Count occurrences, place in sorted order.

```python
def counting_sort(arr: list[int]) -> list[int]:
    """
    Counting Sort - for small range of non-negative integers.
    
    Time: O(n + k) where k is range of input
    Space: O(k)
    """
    if not arr:
        return arr
    
    max_val = max(arr)
    count = [0] * (max_val + 1)
    
    # Count occurrences
    for num in arr:
        count[num] += 1
    
    # Build sorted array
    result = []
    for i in range(len(count)):
        result.extend([i] * count[i])
    
    return result

# Example
arr = [4, 2, 2, 8, 3, 3, 1]
print(counting_sort(arr))  # [1, 2, 2, 3, 3, 4, 8]
```

---

## 🎯 Dutch National Flag / Sort Colors (LC 75)

Three-way partition - very common interview question!

```python
def sort_colors(nums: list[int]) -> None:
    """
    Sort array containing only 0, 1, 2.
    
    Three pointers:
    - low: boundary of 0s
    - mid: current element
    - high: boundary of 2s
    
    Time: O(n), Space: O(1)
    """
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid - need to check swapped element

# Example
nums = [2, 0, 2, 1, 1, 0]
sort_colors(nums)
print(nums)  # [0, 0, 1, 1, 2, 2]
```

---

## 📋 When to Use Which Sort

| Scenario | Best Sort | Reason |
|----------|-----------|--------|
| General purpose | Quick Sort | Fast average case, in-place |
| Need stability | Merge Sort | Stable, consistent O(n log n) |
| Limited memory | Heap Sort | O(1) space |
| Small range integers | Counting Sort | O(n + k) time |
| Nearly sorted | Insertion Sort | O(n) for nearly sorted |
| Linked list | Merge Sort | No random access needed |

---

## ⚠️ Common Interview Questions

1. **Why is Quick Sort faster than Merge Sort in practice?**
   - Better cache performance (in-place)
   - Smaller constant factors

2. **When does Quick Sort degrade to O(n²)?**
   - Already sorted array with bad pivot choice
   - Fix: Random pivot selection

3. **Why use Merge Sort for external sorting?**
   - Sequential access pattern is ideal for disk I/O
