# 🪟 Sliding Window - Complete Problem Set

## Problem 1: Contains Duplicate II (Easy)
**LeetCode 219**

### Problem
Check if there are two duplicate elements within distance k of each other.

### Intuition
Maintain a sliding window of size k using a set.

### Solution
```python
def containsNearbyDuplicate(nums: list[int], k: int) -> bool:
    """
    Time: O(n)
    Space: O(min(n, k))
    """
    window = set()
    
    for i, num in enumerate(nums):
        if num in window:
            return True
        
        window.add(num)
        
        # Remove element outside window
        if len(window) > k:
            window.remove(nums[i - k])
    
    return False
```

---

## Problem 2: Best Time to Buy And Sell Stock (Easy)
**LeetCode 121**

### Problem
Find maximum profit from one buy-sell transaction.

### Intuition
Track minimum price seen so far. At each point, profit = current - min_so_far.

### Solution
```python
def maxProfit(prices: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit
```

---

## Problem 3: Longest Substring Without Repeating Characters (Medium)
**LeetCode 3**

### Problem
Find length of longest substring without repeating characters.

### Intuition
Expand window, when duplicate found, shrink from left until valid.

### Solution
```python
def lengthOfLongestSubstring(s: str) -> int:
    """
    Time: O(n)
    Space: O(min(n, 26))
    """
    char_index = {}  # char -> last seen index
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        char = s[right]
        
        # If char seen and within current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

## Problem 4: Longest Repeating Character Replacement (Medium)
**LeetCode 424**

### Problem
Find longest substring where you can replace at most k characters to make all same.

### Intuition
Window is valid if `window_size - max_count <= k`. Track max frequency in window.

### Solution
```python
def characterReplacement(s: str, k: int) -> int:
    """
    Time: O(n)
    Space: O(26) = O(1)
    """
    count = {}
    left = 0
    max_count = 0  # Max frequency of any char in window
    max_length = 0
    
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_count = max(max_count, count[s[right]])
        
        # Window size - max_count = chars to replace
        # If > k, shrink window
        while (right - left + 1) - max_count > k:
            count[s[left]] -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

## Problem 5: Permutation In String (Medium)
**LeetCode 567**

### Problem
Check if s2 contains a permutation of s1.

### Intuition
Fixed window of size len(s1). Compare character counts.

### Solution
```python
from collections import Counter

def checkInclusion(s1: str, s2: str) -> bool:
    """
    Time: O(n)
    Space: O(26) = O(1)
    """
    if len(s1) > len(s2):
        return False
    
    s1_count = Counter(s1)
    window_count = Counter(s2[:len(s1)])
    
    if s1_count == window_count:
        return True
    
    for i in range(len(s1), len(s2)):
        # Add new char
        window_count[s2[i]] += 1
        
        # Remove old char
        old_char = s2[i - len(s1)]
        window_count[old_char] -= 1
        if window_count[old_char] == 0:
            del window_count[old_char]
        
        if s1_count == window_count:
            return True
    
    return False
```

---

## Problem 6: Minimum Size Subarray Sum (Medium)
**LeetCode 209**

### Problem
Find shortest subarray with sum >= target.

### Intuition
Expand to reach target, shrink while still valid to minimize length.

### Solution
```python
def minSubArrayLen(target: int, nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    left = 0
    current_sum = 0
    min_length = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        # Shrink while valid
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return min_length if min_length != float('inf') else 0
```

---

## Problem 7: Find K Closest Elements (Medium)
**LeetCode 658**

### Problem
Find k closest elements to x in sorted array.

### Intuition
Binary search to find starting position of window, or shrink window from both ends.

### Solution
```python
def findClosestElements(arr: list[int], k: int, x: int) -> list[int]:
    """
    Two Pointer approach (shrink window)
    Time: O(n - k)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while right - left >= k:
        # Remove the farther element
        if abs(arr[left] - x) > abs(arr[right] - x):
            left += 1
        else:
            right -= 1
    
    return arr[left:right + 1]

# Binary Search approach
def findClosestElements_bs(arr: list[int], k: int, x: int) -> list[int]:
    """
    Binary search for left boundary
    Time: O(log(n-k) + k)
    Space: O(1)
    """
    left, right = 0, len(arr) - k
    
    while left < right:
        mid = (left + right) // 2
        
        # Compare distances at boundaries
        if x - arr[mid] > arr[mid + k] - x:
            left = mid + 1
        else:
            right = mid
    
    return arr[left:left + k]
```

---

## Problem 8: Minimum Window Substring (Hard)
**LeetCode 76**

### Problem
Find minimum window in s containing all characters of t.

### Intuition
Expand until all chars included, then shrink to minimize. Track needed chars and how many still missing.

### Solution
```python
from collections import Counter

def minWindow(s: str, t: str) -> str:
    """
    Time: O(n + m)
    Space: O(m) where m = len(t)
    """
    if not s or not t:
        return ""
    
    # Count chars needed from t
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
        
        # Shrink while valid
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
```

---

## Problem 9: Sliding Window Maximum (Hard)
**LeetCode 239**

### Problem
Find maximum in each window of size k.

### Intuition
Use monotonic decreasing deque. Front always has index of maximum.

### Solution
```python
from collections import deque

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    """
    Monotonic Deque
    Time: O(n)
    Space: O(k)
    """
    dq = deque()  # Store indices
    result = []
    
    for i in range(len(nums)):
        # Remove indices outside current window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements (they can't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add to result after first window is complete
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

---

## 📊 Sliding Window Summary

| Problem | Difficulty | Window Type | Key Technique |
|---------|------------|-------------|---------------|
| Contains Duplicate II | Easy | Fixed (k) | HashSet window |
| Best Time Buy/Sell | Easy | Variable | Track min price |
| Longest No Repeat | Medium | Variable | Char index map |
| Longest Repeating Char | Medium | Variable | Max freq + k replacements |
| Permutation in String | Medium | Fixed (len s1) | Counter comparison |
| Min Size Subarray Sum | Medium | Variable (shortest) | Shrink while valid |
| K Closest Elements | Medium | Fixed (k) | Shrink from ends |
| Min Window Substring | Hard | Variable (shortest) | Track missing chars |
| Sliding Window Max | Hard | Fixed (k) | Monotonic deque |

### Pattern Recognition:

**Fixed Window:**
- Window size given (k)
- Add new element, remove old element
- Process/compare window state

**Variable Window (Longest):**
- Expand right pointer
- Shrink left when condition violated
- Track maximum length

**Variable Window (Shortest):**
- Expand until condition satisfied
- Shrink while condition still satisfied
- Track minimum length
