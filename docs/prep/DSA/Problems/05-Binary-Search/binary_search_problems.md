# 🔍 Binary Search - Complete Problem Set

## Problem 1: Binary Search (Easy)
**LeetCode 704**

### Problem
Find target in sorted array, return index or -1.

### Intuition
Classic binary search. Compare mid with target, adjust search space.

### Solution
```python
def search(nums: list[int], target: int) -> int:
    """
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

---

## Problem 2: Search Insert Position (Easy)
**LeetCode 35**

### Problem
Find target or where it would be inserted in sorted array.

### Intuition
Binary search; if not found, left pointer is insertion position.

### Solution
```python
def searchInsert(nums: list[int], target: int) -> int:
    """
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return left  # Insertion position
```

---

## Problem 3: Guess Number Higher or Lower (Easy)
**LeetCode 374**

### Problem
Guess number between 1 and n using API.

### Intuition
Binary search on answer space [1, n].

### Solution
```python
def guessNumber(n: int) -> int:
    """
    Time: O(log n)
    Space: O(1)
    API: guess(num) returns -1 (lower), 1 (higher), 0 (correct)
    """
    left, right = 1, n
    
    while left <= right:
        mid = (left + right) // 2
        result = guess(mid)
        
        if result == 0:
            return mid
        elif result == -1:
            right = mid - 1
        else:
            left = mid + 1
    
    return -1
```

---

## Problem 4: Sqrt(x) (Easy)
**LeetCode 69**

### Problem
Compute floor of square root of x.

### Intuition
Binary search for largest n where n*n <= x.

### Solution
```python
def mySqrt(x: int) -> int:
    """
    Time: O(log x)
    Space: O(1)
    """
    if x < 2:
        return x
    
    left, right = 1, x // 2
    
    while left <= right:
        mid = (left + right) // 2
        square = mid * mid
        
        if square == x:
            return mid
        elif square < x:
            left = mid + 1
        else:
            right = mid - 1
    
    return right  # Largest where mid*mid <= x
```

---

## Problem 5: Search a 2D Matrix (Medium)
**LeetCode 74**

### Problem
Search in matrix where each row is sorted and first element > last of previous row.

### Intuition
Treat as 1D sorted array. Map index to (row, col).

### Solution
```python
def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    """
    Time: O(log(m*n))
    Space: O(1)
    """
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = (left + right) // 2
        row, col = mid // n, mid % n
        value = matrix[row][col]
        
        if value == target:
            return True
        elif value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False
```

---

## Problem 6: Koko Eating Bananas (Medium)
**LeetCode 875**

### Problem
Find minimum eating speed k to finish all piles in h hours.

### Intuition
Binary search on answer space [1, max(piles)]. Check if speed k works.

### Solution
```python
import math

def minEatingSpeed(piles: list[int], h: int) -> int:
    """
    Time: O(n * log(max_pile))
    Space: O(1)
    """
    def canFinish(k: int) -> bool:
        hours = sum(math.ceil(pile / k) for pile in piles)
        return hours <= h
    
    left, right = 1, max(piles)
    
    while left < right:
        mid = (left + right) // 2
        
        if canFinish(mid):
            right = mid  # Try smaller speed
        else:
            left = mid + 1
    
    return left
```

---

## Problem 7: Find Minimum In Rotated Sorted Array (Medium)
**LeetCode 153**

### Problem
Find minimum in rotated sorted array (no duplicates).

### Intuition
Compare mid with right. If mid > right, minimum is in right half.

### Solution
```python
def findMin(nums: list[int]) -> int:
    """
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
```

---

## Problem 8: Search In Rotated Sorted Array (Medium)
**LeetCode 33**

### Problem
Search target in rotated sorted array.

### Intuition
Determine which half is sorted, then check if target is in that range.

### Solution
```python
def search(nums: list[int], target: int) -> int:
    """
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

---

## Problem 9: Time Based Key Value Store (Medium)
**LeetCode 981**

### Problem
Store key-value pairs with timestamps. Get value at or before given timestamp.

### Intuition
Binary search for largest timestamp <= given timestamp.

### Solution
```python
from collections import defaultdict
import bisect

class TimeMap:
    """
    set: O(1)
    get: O(log n)
    Space: O(n)
    """
    def __init__(self):
        self.store = defaultdict(list)  # key -> [(timestamp, value)]
    
    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))
    
    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        
        values = self.store[key]
        
        # Binary search for largest timestamp <= given
        left, right = 0, len(values) - 1
        result = ""
        
        while left <= right:
            mid = (left + right) // 2
            
            if values[mid][0] <= timestamp:
                result = values[mid][1]
                left = mid + 1
            else:
                right = mid - 1
        
        return result
```

---

## Problem 10: Find First and Last Position (Medium)
**LeetCode 34**

### Problem
Find starting and ending position of target in sorted array.

### Intuition
Two binary searches: find leftmost and rightmost occurrence.

### Solution
```python
def searchRange(nums: list[int], target: int) -> list[int]:
    """
    Time: O(log n)
    Space: O(1)
    """
    def findLeft():
        left, right = 0, len(nums) - 1
        result = -1
        
        while left <= right:
            mid = (left + right) // 2
            
            if nums[mid] == target:
                result = mid
                right = mid - 1  # Continue searching left
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result
    
    def findRight():
        left, right = 0, len(nums) - 1
        result = -1
        
        while left <= right:
            mid = (left + right) // 2
            
            if nums[mid] == target:
                result = mid
                left = mid + 1  # Continue searching right
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result
    
    return [findLeft(), findRight()]
```

---

## Problem 11: Capacity To Ship Packages (Medium)
**LeetCode 1011**

### Problem
Find minimum ship capacity to ship all packages within days.

### Intuition
Binary search on capacity [max_weight, sum_weights].

### Solution
```python
def shipWithinDays(weights: list[int], days: int) -> int:
    """
    Time: O(n * log(sum - max))
    Space: O(1)
    """
    def canShip(capacity: int) -> bool:
        current_weight = 0
        days_needed = 1
        
        for weight in weights:
            if current_weight + weight > capacity:
                days_needed += 1
                current_weight = weight
            else:
                current_weight += weight
        
        return days_needed <= days
    
    left = max(weights)  # Must carry heaviest package
    right = sum(weights)  # Ship all in one day
    
    while left < right:
        mid = (left + right) // 2
        
        if canShip(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

## Problem 12: Split Array Largest Sum (Hard)
**LeetCode 410**

### Problem
Split array into k subarrays to minimize largest sum.

### Intuition
Binary search on answer. Check if we can split with max sum = mid.

### Solution
```python
def splitArray(nums: list[int], k: int) -> int:
    """
    Time: O(n * log(sum - max))
    Space: O(1)
    """
    def canSplit(max_sum: int) -> bool:
        current_sum = 0
        splits = 1
        
        for num in nums:
            if current_sum + num > max_sum:
                splits += 1
                current_sum = num
            else:
                current_sum += num
        
        return splits <= k
    
    left = max(nums)
    right = sum(nums)
    
    while left < right:
        mid = (left + right) // 2
        
        if canSplit(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

## Problem 13: Search In Rotated Sorted Array II (Medium)
**LeetCode 81**

### Problem
Search in rotated sorted array with duplicates.

### Intuition
Similar to without duplicates, but handle nums[left] == nums[mid] case.

### Solution
```python
def search(nums: list[int], target: int) -> bool:
    """
    Time: O(n) worst case, O(log n) average
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return True
        
        # Handle duplicates
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        # Left half is sorted
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return False
```

---

## Problem 14: Median of Two Sorted Arrays (Hard)
**LeetCode 4**

### Problem
Find median of two sorted arrays in O(log(m+n)).

### Intuition
Binary search for partition point. Left partitions should contain half elements.

### Solution
```python
def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    """
    Time: O(log(min(m, n)))
    Space: O(1)
    """
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2
    
    left, right = 0, m
    
    while left <= right:
        i = (left + right) // 2  # Partition in nums1
        j = half - i  # Partition in nums2
        
        # Edge cases with infinity
        nums1_left = float('-inf') if i == 0 else nums1[i - 1]
        nums1_right = float('inf') if i == m else nums1[i]
        nums2_left = float('-inf') if j == 0 else nums2[j - 1]
        nums2_right = float('inf') if j == n else nums2[j]
        
        # Valid partition
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            # Odd total
            if (m + n) % 2:
                return max(nums1_left, nums2_left)
            # Even total
            return (max(nums1_left, nums2_left) + 
                    min(nums1_right, nums2_right)) / 2
        elif nums1_left > nums2_right:
            right = i - 1
        else:
            left = i + 1
    
    return 0.0
```

---

## 📊 Binary Search Summary

| Problem | Difficulty | Search Type | Key Insight |
|---------|------------|-------------|-------------|
| Binary Search | Easy | Index | Classic template |
| Search Insert | Easy | Index | Return left if not found |
| Guess Number | Easy | Value | Search on [1, n] |
| Sqrt(x) | Easy | Value | Largest n² ≤ x |
| Search 2D Matrix | Medium | Index | Treat as 1D array |
| Koko Bananas | Medium | Answer | Check if speed works |
| Find Min Rotated | Medium | Index | Compare mid with right |
| Search Rotated | Medium | Index | Find sorted half |
| Time Based KV | Medium | Index | Find largest timestamp |
| First Last Position | Medium | Index | Two searches |
| Ship Packages | Medium | Answer | Min capacity check |
| Split Array | Hard | Answer | Min max sum check |
| Search Rotated II | Medium | Index | Handle duplicates |
| Median Two Arrays | Hard | Partition | Binary search partition |

### Pattern Recognition:

**Search for Index:**
- Standard binary search
- Return left/right for insertion point

**Search on Answer Space:**
- Answer is in known range [min, max]
- Check if mid is valid answer
- Common: minimize maximum, maximize minimum

**Rotated Array:**
- Find which half is sorted
- Check if target in sorted range

**Two Arrays / Partition:**
- Binary search on one array
- Calculate position in other array
