# 👆 Two Pointers - Complete Problem Set

## Problem 1: Reverse String (Easy)
**LeetCode 344**

### Problem
Reverse a string in-place.

### Intuition
Use two pointers from both ends, swap until they meet.

### Solution
```python
def reverseString(s: list[str]) -> None:
    """
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
```

---

## Problem 2: Valid Palindrome (Easy)
**LeetCode 125**

### Problem
Check if a string is a palindrome considering only alphanumeric characters.

### Intuition
Two pointers from both ends, skip non-alphanumeric, compare lowercase.

### Solution
```python
def isPalindrome(s: str) -> bool:
    """
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
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

---

## Problem 3: Valid Palindrome II (Easy)
**LeetCode 680**

### Problem
Check if string can become palindrome by removing at most one character.

### Intuition
When mismatch found, try removing either left or right character.

### Solution
```python
def validPalindrome(s: str) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    def is_palindrome(left: int, right: int) -> bool:
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] != s[right]:
            # Try removing either character
            return is_palindrome(left + 1, right) or is_palindrome(left, right - 1)
        left += 1
        right -= 1
    
    return True
```

---

## Problem 4: Merge Strings Alternately (Easy)
**LeetCode 1768**

### Problem
Merge two strings by alternating characters.

### Intuition
Use two pointers, add one char from each alternately.

### Solution
```python
def mergeAlternately(word1: str, word2: str) -> str:
    """
    Time: O(n + m)
    Space: O(n + m)
    """
    result = []
    i = j = 0
    
    while i < len(word1) and j < len(word2):
        result.append(word1[i])
        result.append(word2[j])
        i += 1
        j += 1
    
    # Append remaining
    result.append(word1[i:])
    result.append(word2[j:])
    
    return ''.join(result)
```

---

## Problem 5: Merge Sorted Array (Easy)
**LeetCode 88**

### Problem
Merge nums2 into nums1 (sorted). nums1 has extra space at end.

### Intuition
Fill from the end to avoid overwriting. Compare largest elements first.

### Solution
```python
def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    """
    Time: O(m + n)
    Space: O(1)
    """
    # Start from the end
    p1 = m - 1
    p2 = n - 1
    write = m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[write] = nums1[p1]
            p1 -= 1
        else:
            nums1[write] = nums2[p2]
            p2 -= 1
        write -= 1
```

---

## Problem 6: Remove Duplicates From Sorted Array (Easy)
**LeetCode 26**

### Problem
Remove duplicates in-place from sorted array. Return new length.

### Intuition
Two pointers: read and write. Write only when new element found.

### Solution
```python
def removeDuplicates(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    write = 1  # First element always stays
    
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    
    return write
```

---

## Problem 7: Two Sum II - Input Array Is Sorted (Medium)
**LeetCode 167**

### Problem
Find two numbers in sorted array that sum to target. Return 1-indexed positions.

### Intuition
Two pointers from both ends. If sum too small, move left. If too large, move right.

### Solution
```python
def twoSum(numbers: list[int], target: int) -> list[int]:
    """
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []
```

---

## Problem 8: 3Sum (Medium)
**LeetCode 15**

### Problem
Find all unique triplets that sum to zero.

### Intuition
Sort array. Fix one element, use two pointers for the other two. Skip duplicates.

### Solution
```python
def threeSum(nums: list[int]) -> list[list[int]]:
    """
    Time: O(n²)
    Space: O(1) excluding output
    """
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Two pointers for remaining two elements
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    
    return result
```

---

## Problem 9: 4Sum (Medium)
**LeetCode 18**

### Problem
Find all unique quadruplets that sum to target.

### Intuition
Fix first two elements, use two pointers for remaining two.

### Solution
```python
def fourSum(nums: list[int], target: int) -> list[list[int]]:
    """
    Time: O(n³)
    Space: O(1) excluding output
    """
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue
            
            left, right = j + 1, n - 1
            
            while left < right:
                total = nums[i] + nums[j] + nums[left] + nums[right]
                
                if total == target:
                    result.append([nums[i], nums[j], nums[left], nums[right]])
                    
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    
                    left += 1
                    right -= 1
                elif total < target:
                    left += 1
                else:
                    right -= 1
    
    return result
```

---

## Problem 10: Rotate Array (Medium)
**LeetCode 189**

### Problem
Rotate array right by k steps.

### Intuition
Reverse entire array, then reverse first k and last n-k elements.
`[1,2,3,4,5,6,7], k=3` → `[7,6,5,4,3,2,1]` → `[5,6,7,4,3,2,1]` → `[5,6,7,1,2,3,4]`

### Solution
```python
def rotate(nums: list[int], k: int) -> None:
    """
    Time: O(n)
    Space: O(1)
    """
    n = len(nums)
    k = k % n  # Handle k > n
    
    def reverse(start: int, end: int):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    # Reverse entire array
    reverse(0, n - 1)
    # Reverse first k elements
    reverse(0, k - 1)
    # Reverse remaining elements
    reverse(k, n - 1)
```

---

## Problem 11: Container With Most Water (Medium)
**LeetCode 11**

### Problem
Find two lines that together with x-axis form a container with most water.

### Intuition
Two pointers from both ends. Area = min(height) × width. Move the shorter line inward (might find taller).

### Solution
```python
def maxArea(height: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        # Move the shorter line
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

---

## Problem 12: Boats to Save People (Medium)
**LeetCode 881**

### Problem
Each boat carries at most 2 people with weight limit. Find minimum boats.

### Intuition
Sort by weight. Pair heaviest with lightest if possible.

### Solution
```python
def numRescueBoats(people: list[int], limit: int) -> int:
    """
    Time: O(n log n)
    Space: O(1)
    """
    people.sort()
    left, right = 0, len(people) - 1
    boats = 0
    
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1  # Lightest person fits
        right -= 1  # Heaviest always goes
        boats += 1
    
    return boats
```

---

## Problem 13: Trapping Rain Water (Hard)
**LeetCode 42**

### Problem
Calculate how much rain water can be trapped.

### Intuition
Water at position i = min(max_left, max_right) - height[i].
Use two pointers to track max from both sides.

### Solution
```python
def trap(height: list[int]) -> int:
    """
    Two Pointer approach
    Time: O(n)
    Space: O(1)
    """
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    
    return water

# Alternative: Precompute max arrays
def trap_arrays(height: list[int]) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    if not height:
        return 0
    
    n = len(height)
    
    # Max height to the left of each position
    left_max = [0] * n
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])
    
    # Max height to the right of each position
    right_max = [0] * n
    right_max[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])
    
    # Calculate water
    water = 0
    for i in range(n):
        water += min(left_max[i], right_max[i]) - height[i]
    
    return water
```

---

## 📊 Two Pointers Summary

| Problem | Difficulty | Key Technique |
|---------|------------|---------------|
| Reverse String | Easy | Opposite ends swap |
| Valid Palindrome | Easy | Skip non-alnum, compare |
| Valid Palindrome II | Easy | Try removing left/right |
| Merge Strings | Easy | Alternating pointers |
| Merge Sorted Array | Easy | Fill from end |
| Remove Duplicates | Easy | Read/write pointers |
| Two Sum II | Medium | Sorted + opposite ends |
| 3Sum | Medium | Fix one + two pointers |
| 4Sum | Medium | Fix two + two pointers |
| Rotate Array | Medium | Three reverses |
| Container With Water | Medium | Move shorter line |
| Boats to Save People | Medium | Pair heavy + light |
| Trapping Rain Water | Hard | Track max from both sides |
