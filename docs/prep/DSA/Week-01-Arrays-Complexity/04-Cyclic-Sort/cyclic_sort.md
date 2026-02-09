# 🔄 Cyclic Sort Pattern

## 🎯 What is Cyclic Sort?

**Cyclic Sort** is an elegant pattern for problems involving arrays containing numbers in a given range (usually 1 to n or 0 to n-1). Instead of using extra space, we place each number at its correct index.

---

## 🧠 The Core Intuition

### The Key Insight

When you have numbers 1 to n in an array of size n, each number has a "correct" position:
- Number 1 should be at index 0
- Number 2 should be at index 1
- Number `i` should be at index `i-1`

**If every number is at its correct position, the array is sorted!**

```
Goal: arr[i] should equal i + 1

Before: [3, 1, 5, 4, 2]
After:  [1, 2, 3, 4, 5]
         ↑  ↑  ↑  ↑  ↑
         0  1  2  3  4  (indices)
```

---

## 📝 The Algorithm

```python
def cyclic_sort(nums):
    """
    Sort array containing 1 to n using cyclic sort.
    
    Algorithm:
    1. Start at index 0
    2. While current number is not at its correct position:
       - Swap it to its correct position
    3. Move to next index when current is correct
    
    Time: O(n) - each number moves at most once
    Space: O(1) - in-place
    """
    i = 0
    n = len(nums)
    
    while i < n:
        # Correct position for nums[i]
        correct_idx = nums[i] - 1
        
        # If not at correct position, swap
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            # Current position is correct, move forward
            i += 1
    
    return nums


# Example
arr = [3, 1, 5, 4, 2]
print(cyclic_sort(arr))  # [1, 2, 3, 4, 5]
```

---

## 🎨 Visualization

```
Initial: [3, 1, 5, 4, 2]

Step 1: i=0, nums[0]=3, correct_idx=2
        3 should be at index 2
        Swap: [3, 1, 5, 4, 2] → [5, 1, 3, 4, 2]
              
Step 2: i=0, nums[0]=5, correct_idx=4
        5 should be at index 4
        Swap: [5, 1, 3, 4, 2] → [2, 1, 3, 4, 5]
              
Step 3: i=0, nums[0]=2, correct_idx=1
        2 should be at index 1
        Swap: [2, 1, 3, 4, 5] → [1, 2, 3, 4, 5]
              
Step 4: i=0, nums[0]=1, correct_idx=0
        1 is at correct position, i++
        
Step 5: i=1, nums[1]=2, correct_idx=1
        2 is at correct position, i++
        
... Continue until i reaches n

Final: [1, 2, 3, 4, 5] ✓
```

---

## ❓ Why O(n) and not O(n²)?

Even though there's a while loop with swaps, the time complexity is O(n):

**Key observation:** Each number moves to its correct position at most once.
- We have n numbers
- Each number is swapped at most once to its final position
- Total swaps ≤ n
- Total operations = O(n)

---

## 🚀 FAANG Problems Using Cyclic Sort

### Problem 1: Find Missing Number (LeetCode 268)

**Problem:** Given an array containing n distinct numbers from 0 to n, find the missing one.

```python
def find_missing_number(nums):
    """
    Find the missing number in array of 0 to n.
    
    Approach: 
    1. Use cyclic sort to place each number at its index
    2. Number i should be at index i
    3. Find the index where nums[i] != i
    
    Time: O(n)
    Space: O(1)
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i]
        
        # Only swap if:
        # 1. Number is within valid range (not n)
        # 2. Not already at correct position
        if nums[i] < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find the missing number
    for i in range(n):
        if nums[i] != i:
            return i
    
    # If all 0 to n-1 present, n is missing
    return n


# Examples
print(find_missing_number([3, 0, 1]))     # 2
print(find_missing_number([0, 1]))         # 2
print(find_missing_number([9,6,4,2,3,5,7,0,1]))  # 8
```

**Alternative (Math approach):**
```python
def find_missing_number_math(nums):
    """Using sum formula: O(n) time, O(1) space"""
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum
```

---

### Problem 2: Find All Missing Numbers (LeetCode 448)

**Problem:** Given array of n integers where 1 ≤ a[i] ≤ n, find all missing numbers.

```python
def find_all_missing(nums):
    """
    Find all numbers from 1 to n missing in array.
    
    Approach:
    1. Cyclic sort to place each at correct position
    2. Numbers at wrong positions indicate missing numbers
    
    Time: O(n)
    Space: O(1) excluding output
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i] - 1  # For 1 to n range
        
        # Swap if not at correct position
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find indices where nums[i] != i + 1
    missing = []
    for i in range(n):
        if nums[i] != i + 1:
            missing.append(i + 1)
    
    return missing


# Example
print(find_all_missing([4, 3, 2, 7, 8, 2, 3, 1]))  # [5, 6]
print(find_all_missing([1, 1]))  # [2]
```

---

### Problem 3: Find Duplicate Number (LeetCode 287)

**Problem:** Given array of n+1 integers where each is in range [1, n], find the duplicate.

```python
def find_duplicate(nums):
    """
    Find the duplicate number.
    
    Approach:
    1. Try to place each number at index (num - 1)
    2. If position already has the same number, that's duplicate
    
    Time: O(n)
    Space: O(1)
    """
    i = 0
    
    while i < len(nums):
        # Number should be at index (nums[i] - 1)
        correct_idx = nums[i] - 1
        
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            if i != correct_idx:
                # Found duplicate!
                return nums[i]
            i += 1
    
    return -1


# Example
print(find_duplicate([1, 3, 4, 2, 2]))  # 2
print(find_duplicate([3, 1, 3, 4, 2]))  # 3
```

---

### Problem 4: Find All Duplicates (LeetCode 442)

**Problem:** Given array of n integers where 1 ≤ a[i] ≤ n, find all duplicates.

```python
def find_all_duplicates(nums):
    """
    Find all numbers that appear twice.
    
    Approach:
    1. Cyclic sort - place each at correct position
    2. Numbers at wrong positions are duplicates
    
    Time: O(n)
    Space: O(1) excluding output
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1
        
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    duplicates = []
    for i in range(n):
        if nums[i] != i + 1:
            duplicates.append(nums[i])
    
    return duplicates


# Example
print(find_all_duplicates([4, 3, 2, 7, 8, 2, 3, 1]))  # [2, 3]
```

---

### Problem 5: First Missing Positive (LeetCode 41) ⭐ HARD

**Problem:** Find the smallest missing positive integer. Must run in O(n) time and O(1) space.

```python
def first_missing_positive(nums):
    """
    Find smallest missing positive integer.
    
    This is a HARD problem - classic cyclic sort application!
    
    Key insight:
    - Answer must be in range [1, n+1]
    - If array has all 1 to n, answer is n+1
    - Otherwise, answer is some missing number in [1, n]
    
    Approach:
    1. Ignore numbers ≤ 0 or > n (they can't be the answer)
    2. Place each valid number at index (num - 1)
    3. First position where nums[i] != i + 1 is our answer
    
    Time: O(n)
    Space: O(1)
    """
    n = len(nums)
    i = 0
    
    while i < n:
        # Only care about numbers in [1, n]
        num = nums[i]
        correct_idx = num - 1
        
        # Conditions to swap:
        # 1. Number is in valid range [1, n]
        # 2. Number not at correct position
        if 1 <= num <= n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first position where nums[i] != i + 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    # All [1, n] are present
    return n + 1


# Examples
print(first_missing_positive([1, 2, 0]))      # 3
print(first_missing_positive([3, 4, -1, 1]))  # 2
print(first_missing_positive([7, 8, 9, 11]))  # 1
```

---

### Problem 6: Find the Corrupt Pair

**Problem:** Find the duplicate and missing number in array of 1 to n.

```python
def find_corrupt_pair(nums):
    """
    Find [duplicate, missing] in array that should have 1 to n.
    
    Time: O(n)
    Space: O(1)
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i] - 1
        
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find the wrong position
    for i in range(n):
        if nums[i] != i + 1:
            return [nums[i], i + 1]  # [duplicate, missing]
    
    return [-1, -1]


# Example
print(find_corrupt_pair([3, 1, 2, 5, 2]))  # [2, 4]
print(find_corrupt_pair([3, 1, 2, 3, 6, 4]))  # [3, 5]
```

---

## 🎯 When to Use Cyclic Sort

Use this pattern when:

1. ✅ Array contains numbers in a **specific range** (like 1 to n)
2. ✅ Need to find **missing or duplicate** numbers
3. ✅ Must solve in **O(1) space**
4. ✅ Problem mentions numbers are **bounded**

---

## 📝 Template Code

```python
def cyclic_sort_template(nums):
    """Generic cyclic sort template"""
    i = 0
    n = len(nums)
    
    while i < n:
        # Calculate correct index for nums[i]
        # For 1 to n: correct_idx = nums[i] - 1
        # For 0 to n-1: correct_idx = nums[i]
        correct_idx = nums[i] - 1  # Adjust based on problem
        
        # Conditions to check before swapping:
        # 1. Is number in valid range?
        # 2. Is it not at correct position?
        # 3. Is target position different? (avoid infinite loop)
        
        if is_valid(nums[i]) and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return nums


def is_valid(num):
    """Check if number should be processed"""
    # Customize based on problem
    return True
```

---

## 📚 Practice Problems

| Problem | Difficulty | Type |
|---------|------------|------|
| Missing Number (LC 268) | Easy | Find missing |
| Find Disappeared Numbers (LC 448) | Easy | Find all missing |
| Find Duplicate Number (LC 287) | Medium | Find duplicate |
| Find Duplicates (LC 442) | Medium | Find all duplicates |
| First Missing Positive (LC 41) | Hard | Find missing |
| Set Mismatch (LC 645) | Easy | Corrupt pair |

---

## 📝 Key Takeaways

1. **Cyclic sort places each number at its "home" index**
2. **O(n) time, O(1) space** - very efficient
3. **Perfect for bounded range problems**
4. **After sorting, wrong positions reveal missing/duplicate**
5. **Handle edge cases**: out-of-range numbers, duplicates
