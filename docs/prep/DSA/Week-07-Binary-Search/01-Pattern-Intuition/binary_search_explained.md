# 🎯 Binary Search Pattern - Complete Guide

## 📌 What is Binary Search?

Binary Search is a divide-and-conquer algorithm that finds a target in a **sorted** array by repeatedly halving the search space.

**Key Insight**: Each comparison eliminates half the remaining elements.

---

## 🧠 When to Use Binary Search?

✅ Use Binary Search when:
- Array is **sorted** (or has some sorted property)
- Need to find a **specific element**
- Need to find **first/last position** of element
- Need to find **minimum/maximum** satisfying a condition
- Problem mentions **O(log n)** requirement
- Array is **rotated sorted**
- Searching in **2D sorted matrix**
- Finding answer in a **range** (binary search on answer)

---

## 🎨 Visual Understanding

```
Array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
Target: 11

Step 1: left=0, right=9, mid=4 → arr[4]=9 < 11 → left=5
        [1, 3, 5, 7, 9, | 11, 13, 15, 17, 19]
                         ↑ search here

Step 2: left=5, right=9, mid=7 → arr[7]=15 > 11 → right=6
        [11, 13, 15, | 17, 19]
         ↑ search here

Step 3: left=5, right=6, mid=5 → arr[5]=11 = 11 → FOUND!
```

---

## 📊 Pattern Types

### Type 1: Classic Binary Search

Find exact target in sorted array.

```python
def binary_search(nums: list[int], target: int) -> int:
    """
    Find target in sorted array.
    Returns index if found, -1 otherwise.
    
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:  # Note: <= for searching all elements
        mid = left + (right - left) // 2  # Avoid overflow
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1

# Example
nums = [1, 3, 5, 7, 9, 11]
print(binary_search(nums, 7))  # 3
print(binary_search(nums, 4))  # -1
```

---

### Type 2: Lower Bound (First Occurrence / First >=)

Find first position where element >= target.

```python
def lower_bound(nums: list[int], target: int) -> int:
    """
    Find first index where nums[i] >= target.
    Also: First occurrence of target, or insert position.
    
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums)  # Note: right = len(nums)
    
    while left < right:  # Note: < not <=
        mid = (left + right) // 2
        
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid  # Keep searching left for first
    
    return left

# Example
nums = [1, 2, 2, 2, 3, 4]
print(lower_bound(nums, 2))  # 1 (first 2)
print(lower_bound(nums, 5))  # 6 (insert position)
```

---

### Type 3: Upper Bound (First Greater)

Find first position where element > target.

```python
def upper_bound(nums: list[int], target: int) -> int:
    """
    Find first index where nums[i] > target.
    
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums)
    
    while left < right:
        mid = (left + right) // 2
        
        if nums[mid] <= target:  # Note: <= to find strictly greater
            left = mid + 1
        else:
            right = mid
    
    return left

# Example
nums = [1, 2, 2, 2, 3, 4]
print(upper_bound(nums, 2))  # 4 (first > 2, which is 3)
```

---

### Type 4: Find First and Last Position (LC 34)

```python
def search_range(nums: list[int], target: int) -> list[int]:
    """
    Find first and last position of target.
    
    Time: O(log n)
    Space: O(1)
    """
    def find_first(nums, target):
        left, right = 0, len(nums) - 1
        result = -1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                result = mid
                right = mid - 1  # Keep searching left
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result
    
    def find_last(nums, target):
        left, right = 0, len(nums) - 1
        result = -1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                result = mid
                left = mid + 1  # Keep searching right
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result
    
    return [find_first(nums, target), find_last(nums, target)]

# Example
nums = [5, 7, 7, 8, 8, 10]
print(search_range(nums, 8))  # [3, 4]
print(search_range(nums, 6))  # [-1, -1]
```

---

### Type 5: Search in Rotated Sorted Array (LC 33)

```python
def search_rotated(nums: list[int], target: int) -> int:
    """
    Search in rotated sorted array (no duplicates).
    
    Key insight: One half is always sorted.
    
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        
        # Check which half is sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target in left half
            else:
                left = mid + 1  # Target in right half
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1  # Target in right half
            else:
                right = mid - 1  # Target in left half
    
    return -1

# Example
nums = [4, 5, 6, 7, 0, 1, 2]
print(search_rotated(nums, 0))  # 4
print(search_rotated(nums, 3))  # -1
```

---

### Type 6: Find Minimum in Rotated Array (LC 153)

```python
def find_min(nums: list[int]) -> int:
    """
    Find minimum in rotated sorted array (no duplicates).
    
    Key insight: Minimum is where rotation point is.
    
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        if nums[mid] > nums[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # Minimum is in left half (including mid)
            right = mid
    
    return nums[left]

# Example
nums = [4, 5, 6, 7, 0, 1, 2]
print(find_min(nums))  # 0
```

---

### Type 7: Peak Element (LC 162)

```python
def find_peak_element(nums: list[int]) -> int:
    """
    Find ANY peak element (greater than neighbors).
    
    Works because:
    - If mid > mid+1, peak is in left half (including mid)
    - If mid < mid+1, peak is in right half
    
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        if nums[mid] > nums[mid + 1]:
            right = mid  # Peak is at mid or left
        else:
            left = mid + 1  # Peak is in right half
    
    return left

# Example
nums = [1, 2, 3, 1]
print(find_peak_element(nums))  # 2 (value 3)
```

---

## 🎯 Binary Search on Answer Space

This is a powerful technique where you **binary search on the answer** rather than array indices.

**Template:**
```python
def binary_search_on_answer(condition_check):
    """
    Find minimum x such that condition(x) is True.
    """
    left, right = min_possible, max_possible
    
    while left < right:
        mid = (left + right) // 2
        
        if condition(mid):
            right = mid  # Try smaller values
        else:
            left = mid + 1  # Need larger values
    
    return left
```

### Example: Koko Eating Bananas (LC 875)

```python
def min_eating_speed(piles: list[int], h: int) -> int:
    """
    Find minimum eating speed to finish all bananas in h hours.
    
    Binary search on speed (1 to max(piles)).
    Check if a speed allows finishing in h hours.
    
    Time: O(n * log(max_pile))
    Space: O(1)
    """
    def can_finish(speed):
        hours = 0
        for pile in piles:
            hours += (pile + speed - 1) // speed  # ceil(pile/speed)
        return hours <= h
    
    left, right = 1, max(piles)
    
    while left < right:
        mid = (left + right) // 2
        
        if can_finish(mid):
            right = mid  # Try slower speed
        else:
            left = mid + 1  # Need faster speed
    
    return left

# Example
piles = [3, 6, 7, 11]
h = 8
print(min_eating_speed(piles, h))  # 4
```

### Example: Capacity to Ship Packages (LC 1011)

```python
def ship_within_days(weights: list[int], days: int) -> int:
    """
    Find minimum ship capacity to ship all packages in 'days' days.
    
    Time: O(n * log(sum - max))
    Space: O(1)
    """
    def can_ship(capacity):
        current_load = 0
        days_needed = 1
        
        for weight in weights:
            if current_load + weight > capacity:
                days_needed += 1
                current_load = 0
            current_load += weight
        
        return days_needed <= days
    
    # Min capacity = max weight, Max = sum of all
    left, right = max(weights), sum(weights)
    
    while left < right:
        mid = (left + right) // 2
        
        if can_ship(mid):
            right = mid
        else:
            left = mid + 1
    
    return left

# Example
weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
days = 5
print(ship_within_days(weights, days))  # 15
```

---

## 📐 Search in 2D Matrix (LC 74)

```python
def search_matrix(matrix: list[list[int]], target: int) -> bool:
    """
    Search in row-wise and column-wise sorted matrix.
    
    Treat 2D matrix as 1D sorted array.
    
    Time: O(log(m*n))
    Space: O(1)
    """
    if not matrix:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = (left + right) // 2
        # Convert 1D index to 2D
        row, col = mid // n, mid % n
        
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False
```

---

## 📋 When to Use Which Template

| Condition | Template | Loop | Right Init |
|-----------|----------|------|------------|
| Find exact match | Classic | `left <= right` | `len(arr) - 1` |
| Find first >= target | Lower bound | `left < right` | `len(arr)` |
| Find first > target | Upper bound | `left < right` | `len(arr)` |
| Find minimum satisfying | Answer space | `left < right` | `max_value` |
| Find maximum satisfying | Answer space (reversed) | `left < right` | `max_value` |

---

## ⚠️ Common Mistakes

1. **Off-by-one errors**: `<` vs `<=`, `mid - 1` vs `mid`
2. **Integer overflow**: Use `left + (right - left) // 2`
3. **Wrong initialization**: `right = len(arr)` vs `right = len(arr) - 1`
4. **Infinite loop**: Not shrinking search space
5. **Wrong half selection** in rotated arrays

---

## 🎓 Key Takeaways

1. **Use `left <= right`** for finding exact element
2. **Use `left < right`** for finding first/last position
3. **Always use `left + (right - left) // 2`** to avoid overflow
4. **Binary search on answer space** when searching for optimal value
5. **One half is always sorted** in rotated arrays

---

## ➡️ Next: [Binary Search Problems](../02-Problems/)
