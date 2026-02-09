"""
🎯 Two Sum (LeetCode 1)
Difficulty: Easy
Topics: Array, Hash Table

This is THE most asked interview question. Master it!
"""


# ============================================================
# PROBLEM STATEMENT
# ============================================================
"""
Given an array of integers `nums` and an integer `target`, 
return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution,
and you may not use the same element twice.

Example 1:
    Input: nums = [2, 7, 11, 15], target = 9
    Output: [0, 1]
    Explanation: nums[0] + nums[1] = 2 + 7 = 9

Example 2:
    Input: nums = [3, 2, 4], target = 6
    Output: [1, 2]

Example 3:
    Input: nums = [3, 3], target = 6
    Output: [0, 1]
"""


# ============================================================
# APPROACH 1: Brute Force (NOT recommended for interviews)
# ============================================================
def two_sum_brute(nums: list[int], target: int) -> list[int]:
    """
    Check every pair of numbers.
    
    Time: O(n²) - nested loops
    Space: O(1) - no extra space
    
    ❌ Too slow for large inputs!
    """
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []


# ============================================================
# APPROACH 2: Hash Map (OPTIMAL - Use this!)
# ============================================================
def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Use hash map to find complement in O(1).
    
    🧠 KEY INSIGHT:
    For each number x, we need to find (target - x).
    Instead of searching, store seen numbers in hash map.
    
    Time: O(n) - single pass
    Space: O(n) - hash map storage
    
    ✅ Optimal solution!
    """
    # Map: number -> index
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement was seen before
        if complement in seen:
            return [seen[complement], i]
        
        # Store current number and its index
        seen[num] = i
    
    return []


# ============================================================
# STEP-BY-STEP TRACE
# ============================================================
"""
nums = [2, 7, 11, 15], target = 9

Step 1: i=0, num=2
    complement = 9 - 2 = 7
    7 not in seen
    seen = {2: 0}

Step 2: i=1, num=7
    complement = 9 - 7 = 2
    2 IS in seen at index 0! ✓
    Return [0, 1]

Answer: [0, 1]
"""


# ============================================================
# APPROACH 3: Two Pointers (If array is sorted)
# ============================================================
def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Use two pointers if array is SORTED.
    
    This returns values, not indices (indices change after sort).
    For original indices, need to track them.
    
    Time: O(n log n) if sorting, O(n) if already sorted
    Space: O(1) - no extra space
    """
    # Create list with (value, original_index) and sort
    indexed_nums = [(num, i) for i, num in enumerate(nums)]
    indexed_nums.sort(key=lambda x: x[0])
    
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = indexed_nums[left][0] + indexed_nums[right][0]
        
        if current_sum == target:
            return [indexed_nums[left][1], indexed_nums[right][1]]
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return []


# ============================================================
# RELATED VARIATIONS
# ============================================================

def two_sum_less_than_k(nums: list[int], k: int) -> int:
    """
    Find largest sum < k.
    
    Two Sum II - variant
    """
    nums.sort()
    left, right = 0, len(nums) - 1
    result = -1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum < k:
            result = max(result, current_sum)
            left += 1
        else:
            right -= 1
    
    return result


def two_sum_all_pairs(nums: list[int], target: int) -> list[list[int]]:
    """
    Find ALL pairs that sum to target.
    
    Handle duplicates properly.
    """
    from collections import Counter
    
    count = Counter(nums)
    result = []
    seen = set()
    
    for num in count:
        complement = target - num
        
        if complement in count:
            # Avoid duplicate pairs
            pair = tuple(sorted([num, complement]))
            if pair in seen:
                continue
            
            # Handle same number case
            if num == complement:
                if count[num] >= 2:
                    result.append([num, complement])
            else:
                result.append([num, complement])
            
            seen.add(pair)
    
    return result


# ============================================================
# TEST CASES
# ============================================================
def test_two_sum():
    # Test case 1: Basic
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    
    # Test case 2: Middle elements
    assert two_sum([3, 2, 4], 6) == [1, 2]
    
    # Test case 3: Same elements
    assert two_sum([3, 3], 6) == [0, 1]
    
    # Test case 4: Negative numbers
    assert two_sum([-1, -2, -3, -4, -5], -8) == [2, 4]
    
    # Test case 5: With zero
    assert two_sum([0, 4, 3, 0], 0) == [0, 3]
    
    print("All tests passed! ✓")


if __name__ == "__main__":
    test_two_sum()
    
    # Interactive examples
    print("\n" + "="*50)
    print("Two Sum Examples")
    print("="*50)
    
    examples = [
        ([2, 7, 11, 15], 9),
        ([3, 2, 4], 6),
        ([3, 3], 6),
    ]
    
    for nums, target in examples:
        result = two_sum(nums.copy(), target)
        print(f"nums = {nums}, target = {target}")
        print(f"Output: {result}")
        print(f"Verification: {nums[result[0]]} + {nums[result[1]]} = {target}")
        print()
