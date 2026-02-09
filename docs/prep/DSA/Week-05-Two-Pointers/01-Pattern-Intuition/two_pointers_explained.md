# 🎯 Two Pointers Pattern - Complete Guide

## 📌 What is the Two Pointers Pattern?

The Two Pointers pattern uses two pointers to iterate through a data structure simultaneously. By moving these pointers strategically, we can solve problems in O(n) time that would otherwise require O(n²).

---

## 🧠 When to Use Two Pointers?

✅ Use Two Pointers when:
- Problem involves **sorted arrays/lists**
- Need to find **pairs or triplets** with specific conditions
- Need to **compare elements** from different positions
- Need to **partition** an array
- Problem involves **palindrome** checking
- Need to **remove duplicates** in-place

---

## 📊 Pattern Variations

### 1. Opposite Direction (Converging) Pointers

Start from both ends, move toward center based on conditions.

```
Array:  [1, 2, 3, 4, 5, 6, 7]
         ↑                 ↑
        left              right

Movement: left++ or right-- based on condition
```

**Classic Problems:**
- Two Sum (sorted array)
- Container With Most Water
- Valid Palindrome
- 3Sum

---

### 2. Same Direction (Slow-Fast) Pointers

Both pointers start from beginning, fast moves faster than slow.

```
Array:  [1, 2, 2, 3, 3, 3, 4]
         ↑  ↑
        slow fast

Movement: fast always moves, slow moves on condition
```

**Classic Problems:**
- Remove Duplicates
- Move Zeroes
- Remove Element
- Middle of Linked List
- Linked List Cycle

---

### 3. Two Arrays/Strings

One pointer for each array, move based on comparison.

```
Array1: [1, 3, 5]    Array2: [2, 4, 6]
         ↑                    ↑
         i                    j
```

**Classic Problems:**
- Merge Sorted Arrays
- Intersection of Arrays
- Compare Strings

---

## 🔥 Pattern 1: Opposite Direction

### Template Code

```python
def opposite_direction_pattern(arr):
    """
    Template for opposite direction two pointers.
    
    Use when:
    - Array is sorted
    - Need to find pairs with condition
    - Need to check from both ends
    """
    left = 0
    right = len(arr) - 1
    
    while left < right:
        # Check current pair
        current = arr[left] + arr[right]  # or other condition
        
        if condition_met(current):
            # Found answer or process pair
            return result
        elif need_bigger:
            left += 1   # Move left to get larger value
        else:
            right -= 1  # Move right to get smaller value
    
    return default_result
```

### Example 1: Two Sum II (Sorted Array)

```python
def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    """
    Find two numbers that add up to target in sorted array.
    
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1   # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return [-1, -1]
```

### Example 2: Valid Palindrome

```python
def is_palindrome(s: str) -> bool:
    """
    Check if string is palindrome (ignoring non-alphanumeric).
    
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

### Example 3: Container With Most Water (LC 11)

```python
def max_area(height: list[int]) -> int:
    """
    Find two lines that form container with most water.
    
    Key Insight:
    - Area = min(height[left], height[right]) * (right - left)
    - To potentially find larger area, move the shorter line
    
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Calculate current area
        width = right - left
        current_area = min(height[left], height[right]) * width
        max_water = max(max_water, current_area)
        
        # Move the shorter line (greedy: try to find taller)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

---

## 🔥 Pattern 2: Same Direction

### Template Code

```python
def same_direction_pattern(arr):
    """
    Template for same direction two pointers.
    
    Use when:
    - Need to modify array in-place
    - Need to remove/keep elements based on condition
    - One pointer tracks "write" position
    """
    slow = 0  # Write position / boundary of processed elements
    
    for fast in range(len(arr)):
        if condition(arr[fast]):
            arr[slow] = arr[fast]  # Write at slow position
            slow += 1
    
    return slow  # New length
```

### Example 1: Remove Duplicates from Sorted Array

```python
def remove_duplicates(nums: list[int]) -> int:
    """
    Remove duplicates in-place, return new length.
    
    Slow pointer: boundary of unique elements
    Fast pointer: explores array
    
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    slow = 1  # First element is always unique
    
    for fast in range(1, len(nums)):
        if nums[fast] != nums[fast - 1]:  # Found new unique
            nums[slow] = nums[fast]
            slow += 1
    
    return slow
```

### Example 2: Move Zeroes

```python
def move_zeroes(nums: list[int]) -> None:
    """
    Move all zeroes to end while maintaining order.
    
    Slow: boundary of non-zero elements
    Fast: current element being examined
    
    Time: O(n)
    Space: O(1)
    """
    slow = 0
    
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
```

### Example 3: Remove Element

```python
def remove_element(nums: list[int], val: int) -> int:
    """
    Remove all occurrences of val in-place.
    
    Time: O(n)
    Space: O(1)
    """
    slow = 0
    
    for fast in range(len(nums)):
        if nums[fast] != val:
            nums[slow] = nums[fast]
            slow += 1
    
    return slow
```

---

## 🔥 3Sum Pattern (Three Pointers)

### The Problem

Find all unique triplets that sum to zero.

### Key Insight

1. Sort the array
2. Fix one element, use two pointers for remaining two
3. Skip duplicates to avoid duplicate triplets

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    """
    Find all triplets with sum = 0.
    
    Algorithm:
    1. Sort array
    2. For each element i, find pairs (j, k) where nums[i] + nums[j] + nums[k] = 0
    3. Use two pointers for the pair search
    4. Skip duplicates
    
    Time: O(n²) - n iterations × O(n) two-pointer search
    Space: O(1) excluding output
    """
    nums.sort()
    n = len(nums)
    result = []
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Early termination: if smallest element > 0, no valid triplet
        if nums[i] > 0:
            break
        
        # Two pointers for remaining elements
        left, right = i + 1, n - 1
        target = -nums[i]
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result
```

### 3Sum Closest

```python
def three_sum_closest(nums: list[int], target: int) -> int:
    """
    Find triplet with sum closest to target.
    
    Time: O(n²)
    Space: O(1)
    """
    nums.sort()
    n = len(nums)
    closest = float('inf')
    
    for i in range(n - 2):
        left, right = i + 1, n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if abs(current_sum - target) < abs(closest - target):
                closest = current_sum
            
            if current_sum < target:
                left += 1
            elif current_sum > target:
                right -= 1
            else:
                return target  # Exact match
    
    return closest
```

---

## 🔥 Two Pointers on Linked Lists

### Middle of Linked List

```python
def find_middle(head):
    """
    Find middle node using slow-fast pointers.
    
    Fast moves 2x speed of slow.
    When fast reaches end, slow is at middle.
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

### Linked List Cycle

```python
def has_cycle(head):
    """
    Detect cycle using Floyd's algorithm.
    
    If cycle exists, fast will eventually meet slow.
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

### Find Cycle Start

```python
def detect_cycle(head):
    """
    Find the node where cycle begins.
    
    Key insight: After slow and fast meet,
    distance from head to cycle start =
    distance from meeting point to cycle start.
    """
    slow = fast = head
    
    # Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

## 📋 Problem-Pattern Mapping

| Problem | Pattern | Key Insight |
|---------|---------|-------------|
| Two Sum (sorted) | Opposite | Sum too small → left++, too big → right-- |
| Valid Palindrome | Opposite | Compare from both ends |
| Container With Most Water | Opposite | Move shorter line |
| 3Sum | Fix + Opposite | Sort, fix one, two-pointer rest |
| Remove Duplicates | Same Direction | Slow = unique boundary |
| Move Zeroes | Same Direction | Swap non-zero to slow position |
| Merge Sorted Arrays | Two Arrays | Compare and merge |
| Linked List Cycle | Fast-Slow | Fast catches slow if cycle |
| Trapping Rain Water | Opposite | Min of max heights from both sides |

---

## ⚠️ Common Mistakes

1. **Not handling edge cases** (empty array, single element)
2. **Off-by-one errors** in pointer initialization/movement
3. **Forgetting to skip duplicates** in problems requiring unique results
4. **Wrong direction** of pointer movement
5. **Not checking boundary conditions** in while loop

---

## 📝 Key Takeaways

1. **Opposite direction** for sorted arrays, palindromes, pair finding
2. **Same direction** for in-place modifications, partitioning
3. **Sort first** if order doesn't matter (enables two pointers)
4. **Skip duplicates** when unique results required
5. **Two pointers reduces O(n²) to O(n)** for many problems
