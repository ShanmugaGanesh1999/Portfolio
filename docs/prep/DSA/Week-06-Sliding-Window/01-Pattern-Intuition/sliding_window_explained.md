# 🎯 Sliding Window Pattern - Complete Guide

## 📌 What is Sliding Window?

The Sliding Window pattern involves creating a "window" over a portion of data and sliding it to examine different parts. It's used for problems involving contiguous sequences (subarrays, substrings).

---

## 🧠 When to Use Sliding Window?

✅ Use Sliding Window when:
- Problem involves **contiguous subarray/substring**
- Need to find **max/min/count** of something in a range
- Problem mentions **"k consecutive elements"**
- Need to find **longest/shortest** sequence with a property
- Keywords: "subarray", "substring", "window", "consecutive"

---

## 📊 Pattern Types

### Type 1: Fixed Size Window

Window size is predetermined (k elements).

**Template:**
```python
def fixed_window(arr, k):
    """
    Process all windows of size k.
    """
    n = len(arr)
    if n < k:
        return None
    
    # Initialize first window
    window_sum = sum(arr[:k])
    result = window_sum
    
    # Slide window
    for i in range(k, n):
        # Add new element, remove old element
        window_sum += arr[i] - arr[i - k]
        result = max(result, window_sum)  # or other operation
    
    return result
```

**Example: Maximum Sum Subarray of Size K**
```python
def max_sum_subarray(arr: list[int], k: int) -> int:
    """
    Find maximum sum of any subarray of size k.
    
    Time: O(n)
    Space: O(1)
    """
    n = len(arr)
    if n < k:
        return 0
    
    # Sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Example
arr = [2, 1, 5, 1, 3, 2]
k = 3
print(max_sum_subarray(arr, k))  # 9 (5 + 1 + 3)
```

---

### Type 2: Variable Size - Find Longest

Expand window to include more elements, shrink when condition violated.

**Template:**
```python
def longest_window(arr):
    """
    Find longest window satisfying condition.
    """
    left = 0
    result = 0
    state = {}  # or other tracking structure
    
    for right in range(len(arr)):
        # Expand: add arr[right] to state
        update_state(state, arr[right])
        
        # Shrink while condition violated
        while not is_valid(state):
            # Remove arr[left] from state
            remove_from_state(state, arr[left])
            left += 1
        
        # Update result (current window is valid)
        result = max(result, right - left + 1)
    
    return result
```

**Example: Longest Substring Without Repeating Characters (LC 3)**
```python
def length_of_longest_substring(s: str) -> int:
    """
    Find longest substring with all unique characters.
    
    Condition: All characters in window are unique.
    
    Time: O(n)
    Space: O(min(n, 26)) for character set
    """
    char_index = {}  # character -> last seen index
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        char = s[right]
        
        # If char seen and is in current window, shrink
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        # Update character's last position
        char_index[char] = right
        
        # Update result
        max_length = max(max_length, right - left + 1)
    
    return max_length

# Example
s = "abcabcbb"
print(length_of_longest_substring(s))  # 3 ("abc")
```

**Example: Longest Substring with At Most K Distinct Characters**
```python
def longest_substring_k_distinct(s: str, k: int) -> int:
    """
    Find longest substring with at most k distinct characters.
    
    Time: O(n)
    Space: O(k)
    """
    from collections import defaultdict
    
    char_count = defaultdict(int)
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # Expand: add character
        char_count[s[right]] += 1
        
        # Shrink while more than k distinct
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        # Update result
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

### Type 3: Variable Size - Find Shortest

Expand to satisfy condition, then shrink to find minimum.

**Template:**
```python
def shortest_window(arr, target):
    """
    Find shortest window satisfying condition.
    """
    left = 0
    result = float('inf')
    state = initialize_state()
    
    for right in range(len(arr)):
        # Expand: add arr[right] to state
        update_state(state, arr[right])
        
        # Shrink while condition satisfied (try to minimize)
        while condition_satisfied(state, target):
            result = min(result, right - left + 1)
            # Remove arr[left] from state
            remove_from_state(state, arr[left])
            left += 1
    
    return result if result != float('inf') else 0
```

**Example: Minimum Size Subarray Sum (LC 209)**
```python
def min_subarray_len(target: int, nums: list[int]) -> int:
    """
    Find shortest subarray with sum >= target.
    
    Time: O(n)
    Space: O(1)
    """
    left = 0
    current_sum = 0
    min_length = float('inf')
    
    for right in range(len(nums)):
        # Expand
        current_sum += nums[right]
        
        # Shrink while condition satisfied
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return min_length if min_length != float('inf') else 0

# Example
nums = [2, 3, 1, 2, 4, 3]
target = 7
print(min_subarray_len(target, nums))  # 2 ([4, 3])
```

**Example: Minimum Window Substring (LC 76) - HARD**
```python
def min_window(s: str, t: str) -> str:
    """
    Find minimum window in s containing all characters of t.
    
    This is a CLASSIC hard problem!
    
    Time: O(n + m)
    Space: O(m)
    """
    from collections import Counter
    
    if not s or not t:
        return ""
    
    # Count characters needed
    need = Counter(t)
    missing = len(t)  # Characters still needed
    
    left = 0
    min_start = 0
    min_length = float('inf')
    
    for right in range(len(s)):
        # Expand: add s[right]
        if s[right] in need:
            if need[s[right]] > 0:
                missing -= 1
            need[s[right]] -= 1
        
        # Shrink while valid (all characters found)
        while missing == 0:
            # Update minimum
            if right - left + 1 < min_length:
                min_length = right - left + 1
                min_start = left
            
            # Remove s[left]
            if s[left] in need:
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
            left += 1
    
    return "" if min_length == float('inf') else s[min_start:min_start + min_length]

# Example
s = "ADOBECODEBANC"
t = "ABC"
print(min_window(s, t))  # "BANC"
```

---

## 🔥 More Classic Problems

### Sliding Window Maximum (LC 239) - Using Deque

```python
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    """
    Find maximum in each window of size k.
    
    Use monotonic decreasing deque:
    - Front has index of maximum
    - Remove indices outside window
    - Remove smaller elements (they can't be max)
    
    Time: O(n)
    Space: O(k)
    """
    dq = deque()  # Store indices
    result = []
    
    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add maximum to result (after first window)
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### Longest Repeating Character Replacement (LC 424)

```python
def character_replacement(s: str, k: int) -> int:
    """
    Find longest substring where you can replace at most k characters
    to make all characters the same.
    
    Key insight: Window is valid if (window_size - max_count) <= k
    
    Time: O(n)
    Space: O(26) = O(1)
    """
    count = {}
    left = 0
    max_count = 0  # Max count of any single character in window
    max_length = 0
    
    for right in range(len(s)):
        # Add character
        count[s[right]] = count.get(s[right], 0) + 1
        max_count = max(max_count, count[s[right]])
        
        # Window size - max_count = characters to replace
        # If > k, shrink window
        while (right - left + 1) - max_count > k:
            count[s[left]] -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

### Fruit Into Baskets (LC 904)

```python
def total_fruit(fruits: list[int]) -> int:
    """
    Find longest subarray with at most 2 distinct elements.
    
    Same as "longest substring with at most K distinct characters"
    where K = 2.
    
    Time: O(n)
    Space: O(1) since at most 3 keys
    """
    from collections import defaultdict
    
    basket = defaultdict(int)
    left = 0
    max_fruits = 0
    
    for right in range(len(fruits)):
        basket[fruits[right]] += 1
        
        while len(basket) > 2:
            basket[fruits[left]] -= 1
            if basket[fruits[left]] == 0:
                del basket[fruits[left]]
            left += 1
        
        max_fruits = max(max_fruits, right - left + 1)
    
    return max_fruits
```

---

## 📋 Problem-Pattern Mapping

| Problem | Type | Key Technique |
|---------|------|---------------|
| Max Sum Subarray of Size K | Fixed | Add new, remove old |
| Contains Duplicate II | Fixed | Hash set in window |
| Longest Substring No Repeat | Variable (Long) | Hash map for index |
| Max Consecutive Ones III | Variable (Long) | Count zeros in window |
| Minimum Size Subarray Sum | Variable (Short) | Shrink when sum >= target |
| Minimum Window Substring | Variable (Short) | Character counting |
| Sliding Window Maximum | Fixed | Monotonic deque |
| Longest Repeating Character | Variable | max_count trick |

---

## ⚠️ Common Mistakes

1. **Off-by-one errors** in window size calculation
2. **Not handling edge cases** (k > n, empty input)
3. **Forgetting to update state** when shrinking
4. **Wrong condition** for expanding vs shrinking
5. **Not using efficient data structures** (Counter, defaultdict)

---

## 📝 Key Takeaways

1. **Fixed size**: Initialize first window, then slide by add/remove
2. **Find longest**: Shrink when condition violated
3. **Find shortest**: Shrink while condition satisfied
4. **Use hash map** for character/element counting
5. **Monotonic deque** for sliding window max/min
