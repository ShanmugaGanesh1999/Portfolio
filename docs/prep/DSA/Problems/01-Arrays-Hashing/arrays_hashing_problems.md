# 🔢 Arrays & Hashing - Complete Problem Set

## Problem 1: Concatenation of Array (Easy)
**LeetCode 1929**

### Problem
Given an integer array `nums` of length `n`, create an array `ans` of length `2n` where `ans[i] == nums[i]` and `ans[i + n] == nums[i]`.

### Intuition
Simply append the array to itself. This is a basic array manipulation problem.

### Solution
```python
def getConcatenation(nums: list[int]) -> list[int]:
    """
    Time: O(n)
    Space: O(n)
    """
    return nums + nums

# Alternative: Manual approach
def getConcatenation_manual(nums: list[int]) -> list[int]:
    n = len(nums)
    ans = [0] * (2 * n)
    for i in range(n):
        ans[i] = nums[i]
        ans[i + n] = nums[i]
    return ans
```

---

## Problem 2: Contains Duplicate (Easy)
**LeetCode 217**

### Problem
Given an integer array `nums`, return `true` if any value appears at least twice.

### Intuition
Use a HashSet to track seen elements. If we encounter an element already in the set, we found a duplicate.

### Solution
```python
def containsDuplicate(nums: list[int]) -> bool:
    """
    Time: O(n)
    Space: O(n)
    """
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

# One-liner
def containsDuplicate_oneliner(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))
```

---

## Problem 3: Valid Anagram (Easy)
**LeetCode 242**

### Problem
Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`.

### Intuition
Anagrams have the same character frequencies. Count characters in both strings and compare.

### Solution
```python
from collections import Counter

def isAnagram(s: str, t: str) -> bool:
    """
    Time: O(n)
    Space: O(1) - at most 26 characters
    """
    if len(s) != len(t):
        return False
    return Counter(s) == Counter(t)

# Manual counting
def isAnagram_manual(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    
    for c in t:
        if c not in count:
            return False
        count[c] -= 1
        if count[c] < 0:
            return False
    
    return True
```

---

## Problem 4: Two Sum (Easy)
**LeetCode 1**

### Problem
Given an array of integers `nums` and an integer `target`, return indices of two numbers that add up to `target`.

### Intuition
For each number, we need `target - num`. Use a hashmap to store number → index mapping for O(1) lookup.

### Solution
```python
def twoSum(nums: list[int], target: int) -> list[int]:
    """
    Time: O(n)
    Space: O(n)
    """
    seen = {}  # num -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []
```

---

## Problem 5: Longest Common Prefix (Easy)
**LeetCode 14**

### Problem
Find the longest common prefix string amongst an array of strings.

### Intuition
Compare characters at each position across all strings until mismatch.

### Solution
```python
def longestCommonPrefix(strs: list[str]) -> str:
    """
    Time: O(n * m) where m = min string length
    Space: O(1)
    """
    if not strs:
        return ""
    
    prefix = strs[0]
    
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    
    return prefix

# Vertical scanning
def longestCommonPrefix_vertical(strs: list[str]) -> str:
    if not strs:
        return ""
    
    for i in range(len(strs[0])):
        char = strs[0][i]
        for s in strs[1:]:
            if i >= len(s) or s[i] != char:
                return strs[0][:i]
    
    return strs[0]
```

---

## Problem 6: Group Anagrams (Medium)
**LeetCode 49**

### Problem
Given an array of strings, group the anagrams together.

### Intuition
Anagrams have the same sorted string or same character count tuple. Use this as a key in a hashmap.

### Solution
```python
from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    """
    Time: O(n * k log k) where k = max string length
    Space: O(n * k)
    """
    groups = defaultdict(list)
    
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    
    return list(groups.values())

# Using character count as key (faster)
def groupAnagrams_count(strs: list[str]) -> list[list[str]]:
    """
    Time: O(n * k)
    Space: O(n * k)
    """
    groups = defaultdict(list)
    
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        groups[tuple(count)].append(s)
    
    return list(groups.values())
```

---

## Problem 7: Remove Element (Easy)
**LeetCode 27**

### Problem
Remove all occurrences of `val` in-place and return the new length.

### Intuition
Use two pointers: one for reading, one for writing. Only write when element != val.

### Solution
```python
def removeElement(nums: list[int], val: int) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    write = 0
    
    for read in range(len(nums)):
        if nums[read] != val:
            nums[write] = nums[read]
            write += 1
    
    return write
```

---

## Problem 8: Majority Element (Easy)
**LeetCode 169**

### Problem
Find the majority element (appears more than n/2 times).

### Intuition
**Boyer-Moore Voting Algorithm**: The majority element will survive elimination of equal count pairs.

### Solution
```python
def majorityElement(nums: list[int]) -> int:
    """
    Boyer-Moore Voting Algorithm
    Time: O(n)
    Space: O(1)
    """
    candidate = None
    count = 0
    
    for num in nums:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
    
    return candidate

# HashMap approach
def majorityElement_hashmap(nums: list[int]) -> int:
    from collections import Counter
    counts = Counter(nums)
    return max(counts.keys(), key=counts.get)
```

---

## Problem 9: Design HashSet (Easy)
**LeetCode 705**

### Problem
Design a HashSet without using built-in hash table libraries.

### Intuition
Use array of buckets with chaining (linked list or list) for collision handling.

### Solution
```python
class MyHashSet:
    """
    Time: O(n/k) average for all operations where k = bucket count
    Space: O(k + n)
    """
    def __init__(self):
        self.size = 1000
        self.buckets = [[] for _ in range(self.size)]
    
    def _hash(self, key: int) -> int:
        return key % self.size
    
    def add(self, key: int) -> None:
        idx = self._hash(key)
        if key not in self.buckets[idx]:
            self.buckets[idx].append(key)
    
    def remove(self, key: int) -> None:
        idx = self._hash(key)
        if key in self.buckets[idx]:
            self.buckets[idx].remove(key)
    
    def contains(self, key: int) -> bool:
        idx = self._hash(key)
        return key in self.buckets[idx]
```

---

## Problem 10: Design HashMap (Easy)
**LeetCode 706**

### Problem
Design a HashMap without using built-in hash table libraries.

### Intuition
Similar to HashSet but store key-value pairs in buckets.

### Solution
```python
class MyHashMap:
    def __init__(self):
        self.size = 1000
        self.buckets = [[] for _ in range(self.size)]
    
    def _hash(self, key: int) -> int:
        return key % self.size
    
    def put(self, key: int, value: int) -> None:
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[idx]):
            if k == key:
                self.buckets[idx][i] = (key, value)
                return
        self.buckets[idx].append((key, value))
    
    def get(self, key: int) -> int:
        idx = self._hash(key)
        for k, v in self.buckets[idx]:
            if k == key:
                return v
        return -1
    
    def remove(self, key: int) -> None:
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[idx]):
            if k == key:
                self.buckets[idx].pop(i)
                return
```

---

## Problem 11: Sort an Array (Medium)
**LeetCode 912**

### Problem
Sort an array in ascending order.

### Intuition
Implement efficient sorting algorithm like Merge Sort or Quick Sort.

### Solution
```python
def sortArray(nums: list[int]) -> list[int]:
    """
    Merge Sort
    Time: O(n log n)
    Space: O(n)
    """
    if len(nums) <= 1:
        return nums
    
    mid = len(nums) // 2
    left = sortArray(nums[:mid])
    right = sortArray(nums[mid:])
    
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
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

---

## Problem 12: Sort Colors (Medium)
**LeetCode 75**

### Problem
Sort array containing only 0, 1, 2 in-place (Dutch National Flag problem).

### Intuition
Three pointers: low (boundary of 0s), mid (current), high (boundary of 2s).

### Solution
```python
def sortColors(nums: list[int]) -> None:
    """
    Dutch National Flag Algorithm
    Time: O(n)
    Space: O(1)
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
```

---

## Problem 13: Top K Frequent Elements (Medium)
**LeetCode 347**

### Problem
Return the k most frequent elements.

### Intuition
1. Count frequencies with hashmap
2. Use min-heap of size k OR bucket sort for O(n) solution

### Solution
```python
import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    """
    Heap approach
    Time: O(n log k)
    Space: O(n)
    """
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)

# Bucket Sort - O(n)
def topKFrequent_bucket(nums: list[int], k: int) -> list[int]:
    """
    Time: O(n)
    Space: O(n)
    """
    count = Counter(nums)
    
    # Bucket: index = frequency, value = list of nums with that freq
    buckets = [[] for _ in range(len(nums) + 1)]
    
    for num, freq in count.items():
        buckets[freq].append(num)
    
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result
```

---

## Problem 14: Encode and Decode Strings (Medium)
**LeetCode 271**

### Problem
Design an algorithm to encode a list of strings to a single string and decode back.

### Intuition
Use length prefix: `len#string` format. This handles any character including delimiters.

### Solution
```python
class Codec:
    def encode(self, strs: list[str]) -> str:
        """
        Encode: "length#string" for each string
        """
        result = []
        for s in strs:
            result.append(f"{len(s)}#{s}")
        return ''.join(result)
    
    def decode(self, s: str) -> list[str]:
        """
        Decode by reading length, then extracting that many chars
        """
        result = []
        i = 0
        
        while i < len(s):
            # Find the # delimiter
            j = i
            while s[j] != '#':
                j += 1
            
            length = int(s[i:j])
            result.append(s[j + 1:j + 1 + length])
            i = j + 1 + length
        
        return result
```

---

## Problem 15: Range Sum Query 2D Immutable (Medium)
**LeetCode 304**

### Problem
Calculate sum of elements inside a rectangle in a 2D matrix.

### Intuition
Use prefix sum matrix. `prefix[i][j]` = sum of all elements from (0,0) to (i-1,j-1).

### Solution
```python
class NumMatrix:
    """
    Time: O(mn) init, O(1) query
    Space: O(mn)
    """
    def __init__(self, matrix: list[list[int]]):
        if not matrix:
            return
        
        m, n = len(matrix), len(matrix[0])
        self.prefix = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                self.prefix[i][j] = (matrix[i-1][j-1] 
                                    + self.prefix[i-1][j] 
                                    + self.prefix[i][j-1] 
                                    - self.prefix[i-1][j-1])
    
    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        return (self.prefix[row2+1][col2+1] 
                - self.prefix[row1][col2+1] 
                - self.prefix[row2+1][col1] 
                + self.prefix[row1][col1])
```

---

## Problem 16: Product of Array Except Self (Medium)
**LeetCode 238**

### Problem
Return array where `output[i]` = product of all elements except `nums[i]`. No division allowed.

### Intuition
For each position, product = (product of all left) × (product of all right).
Compute prefix products from left and right.

### Solution
```python
def productExceptSelf(nums: list[int]) -> list[int]:
    """
    Time: O(n)
    Space: O(1) excluding output
    """
    n = len(nums)
    result = [1] * n
    
    # Left products
    left_product = 1
    for i in range(n):
        result[i] = left_product
        left_product *= nums[i]
    
    # Right products
    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]
    
    return result
```

---

## Problem 17: Valid Sudoku (Medium)
**LeetCode 36**

### Problem
Determine if a 9x9 Sudoku board is valid.

### Intuition
Check each row, column, and 3x3 box for duplicates using sets.

### Solution
```python
def isValidSudoku(board: list[list[str]]) -> bool:
    """
    Time: O(81) = O(1)
    Space: O(81) = O(1)
    """
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    for i in range(9):
        for j in range(9):
            if board[i][j] == '.':
                continue
            
            num = board[i][j]
            box_idx = (i // 3) * 3 + (j // 3)
            
            if num in rows[i] or num in cols[j] or num in boxes[box_idx]:
                return False
            
            rows[i].add(num)
            cols[j].add(num)
            boxes[box_idx].add(num)
    
    return True
```

---

## Problem 18: Longest Consecutive Sequence (Medium)
**LeetCode 128**

### Problem
Find the length of the longest consecutive elements sequence in O(n) time.

### Intuition
Use a set. For each number that is the START of a sequence (num-1 not in set), count consecutive numbers.

### Solution
```python
def longestConsecutive(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        # Only start counting if this is the beginning of a sequence
        if num - 1 not in num_set:
            current = num
            length = 1
            
            while current + 1 in num_set:
                current += 1
                length += 1
            
            longest = max(longest, length)
    
    return longest
```

---

## Problem 19: Best Time to Buy And Sell Stock II (Medium)
**LeetCode 122**

### Problem
Maximize profit with multiple transactions (buy-sell-buy-sell...).

### Intuition
Capture every upward price movement. Add profit whenever price goes up.

### Solution
```python
def maxProfit(prices: list[int]) -> int:
    """
    Greedy: capture all upward movements
    Time: O(n)
    Space: O(1)
    """
    profit = 0
    
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    
    return profit
```

---

## Problem 20: Majority Element II (Medium)
**LeetCode 229**

### Problem
Find all elements that appear more than n/3 times.

### Intuition
At most 2 elements can appear more than n/3 times. Use Boyer-Moore Voting with 2 candidates.

### Solution
```python
def majorityElement(nums: list[int]) -> list[int]:
    """
    Boyer-Moore Voting (extended)
    Time: O(n)
    Space: O(1)
    """
    candidate1 = candidate2 = None
    count1 = count2 = 0
    
    # Find potential candidates
    for num in nums:
        if candidate1 == num:
            count1 += 1
        elif candidate2 == num:
            count2 += 1
        elif count1 == 0:
            candidate1 = num
            count1 = 1
        elif count2 == 0:
            candidate2 = num
            count2 = 1
        else:
            count1 -= 1
            count2 -= 1
    
    # Verify candidates
    result = []
    threshold = len(nums) // 3
    
    if nums.count(candidate1) > threshold:
        result.append(candidate1)
    if candidate2 != candidate1 and nums.count(candidate2) > threshold:
        result.append(candidate2)
    
    return result
```

---

## Problem 21: Subarray Sum Equals K (Medium)
**LeetCode 560**

### Problem
Find total number of subarrays with sum equal to k.

### Intuition
Use prefix sum with hashmap. If `prefix[j] - prefix[i] = k`, then subarray [i+1, j] sums to k.
Count occurrences of `prefix - k` seen before.

### Solution
```python
def subarraySum(nums: list[int], k: int) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    count = 0
    prefix_sum = 0
    prefix_count = {0: 1}  # Empty prefix has sum 0
    
    for num in nums:
        prefix_sum += num
        
        # Check if (prefix_sum - k) exists
        if prefix_sum - k in prefix_count:
            count += prefix_count[prefix_sum - k]
        
        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
    
    return count
```

---

## Problem 22: First Missing Positive (Hard)
**LeetCode 41**

### Problem
Find the smallest missing positive integer in O(n) time and O(1) space.

### Intuition
Use the array itself as a hashmap. Place each number n at index n-1. Then find first index where `arr[i] != i + 1`.

### Solution
```python
def firstMissingPositive(nums: list[int]) -> int:
    """
    Cyclic Sort variant
    Time: O(n)
    Space: O(1)
    """
    n = len(nums)
    
    # Place each number at its correct position
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            # Swap nums[i] to its correct position
            correct_idx = nums[i] - 1
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
    
    # Find first missing
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1
```

---

## 📊 Arrays & Hashing Summary

| Problem | Difficulty | Key Technique |
|---------|------------|---------------|
| Concatenation of Array | Easy | Array manipulation |
| Contains Duplicate | Easy | HashSet |
| Valid Anagram | Easy | Character counting |
| Two Sum | Easy | HashMap complement |
| Longest Common Prefix | Easy | String comparison |
| Group Anagrams | Medium | HashMap with sorted key |
| Remove Element | Easy | Two pointers |
| Majority Element | Easy | Boyer-Moore Voting |
| Design HashSet | Easy | Bucket + chaining |
| Design HashMap | Easy | Bucket + chaining |
| Sort an Array | Medium | Merge Sort |
| Sort Colors | Medium | Dutch National Flag |
| Top K Frequent | Medium | Heap / Bucket Sort |
| Encode and Decode | Medium | Length prefix encoding |
| Range Sum Query 2D | Medium | 2D Prefix Sum |
| Product Except Self | Medium | Prefix/Suffix products |
| Valid Sudoku | Medium | HashSet per row/col/box |
| Longest Consecutive | Medium | HashSet + sequence start |
| Buy Sell Stock II | Medium | Greedy upward capture |
| Majority Element II | Medium | Boyer-Moore (2 candidates) |
| Subarray Sum = K | Medium | Prefix sum + HashMap |
| First Missing Positive | Hard | Cyclic Sort in-place |
