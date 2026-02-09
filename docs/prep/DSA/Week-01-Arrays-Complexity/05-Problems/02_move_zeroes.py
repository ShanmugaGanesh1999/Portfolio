"""
🎯 Move Zeroes (LeetCode 283)
Difficulty: Easy
Topics: Array, Two Pointers

Classic in-place array manipulation problem.
"""


# ============================================================
# PROBLEM STATEMENT
# ============================================================
"""
Given an integer array nums, move all 0's to the end while 
maintaining the relative order of the non-zero elements.

You must do this IN-PLACE without making a copy of the array.

Example 1:
    Input: nums = [0, 1, 0, 3, 12]
    Output: [1, 3, 12, 0, 0]

Example 2:
    Input: nums = [0]
    Output: [0]

Constraints:
- 1 <= nums.length <= 10^4
- -2^31 <= nums[i] <= 2^31 - 1
"""


# ============================================================
# APPROACH 1: Two Pointers (OPTIMAL)
# ============================================================
def move_zeroes(nums: list[int]) -> None:
    """
    Move all zeroes to end while maintaining order.
    
    🧠 KEY INSIGHT:
    Use a "write pointer" that tracks where to place next non-zero.
    All positions before write pointer are non-zero.
    
    Algorithm:
    1. write_idx points to where next non-zero should go
    2. Iterate through array with read pointer
    3. When we find non-zero, write it at write_idx and increment
    4. Fill remaining positions with zeros
    
    Time: O(n) - two passes
    Space: O(1) - in-place
    """
    n = len(nums)
    write_idx = 0
    
    # Pass 1: Move all non-zeros to front
    for read_idx in range(n):
        if nums[read_idx] != 0:
            nums[write_idx] = nums[read_idx]
            write_idx += 1
    
    # Pass 2: Fill remaining with zeros
    for i in range(write_idx, n):
        nums[i] = 0


# ============================================================
# APPROACH 2: Single Pass with Swap (OPTIMAL)
# ============================================================
def move_zeroes_swap(nums: list[int]) -> None:
    """
    Single pass using swap.
    
    🧠 INTUITION:
    Maintain two pointers:
    - slow: boundary of non-zero region
    - fast: current element being examined
    
    When fast finds non-zero, swap with slow position.
    
    Time: O(n) - single pass
    Space: O(1) - in-place
    """
    slow = 0
    
    for fast in range(len(nums)):
        if nums[fast] != 0:
            # Swap only if pointers are different
            if slow != fast:
                nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1


# ============================================================
# VISUALIZATION
# ============================================================
"""
nums = [0, 1, 0, 3, 12]
        s
        f

Step 1: f=0, nums[f]=0 (zero, skip)
        [0, 1, 0, 3, 12]
         s     f

Step 2: f=1, nums[f]=1 (non-zero, swap with s)
        [1, 0, 0, 3, 12]
            s     f

Step 3: f=2, nums[f]=0 (zero, skip)
        [1, 0, 0, 3, 12]
            s        f

Step 4: f=3, nums[f]=3 (non-zero, swap with s)
        [1, 3, 0, 0, 12]
               s        f

Step 5: f=4, nums[f]=12 (non-zero, swap with s)
        [1, 3, 12, 0, 0]
                   s      f

Final: [1, 3, 12, 0, 0] ✓
"""


# ============================================================
# APPROACH 3: Pythonic (but less efficient)
# ============================================================
def move_zeroes_pythonic(nums: list[int]) -> None:
    """
    Count zeros, create new list, copy back.
    
    Note: This is NOT in-place technically, 
    but modifies original in the end.
    
    Time: O(n)
    Space: O(n) - creates new list
    """
    zero_count = nums.count(0)
    non_zeros = [x for x in nums if x != 0]
    
    # Modify original list
    for i in range(len(nums)):
        if i < len(non_zeros):
            nums[i] = non_zeros[i]
        else:
            nums[i] = 0


# ============================================================
# RELATED PROBLEMS
# ============================================================

def move_val_to_end(nums: list[int], val: int) -> None:
    """
    Generalized: Move all occurrences of val to end.
    """
    slow = 0
    
    for fast in range(len(nums)):
        if nums[fast] != val:
            if slow != fast:
                nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1


def segregate_zeros_ones(nums: list[int]) -> None:
    """
    Move all 0s to left and 1s to right.
    Also known as Dutch National Flag (2 colors).
    """
    left = 0
    right = len(nums) - 1
    
    while left < right:
        while left < right and nums[left] == 0:
            left += 1
        while left < right and nums[right] == 1:
            right -= 1
        
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1


# ============================================================
# TEST CASES
# ============================================================
def test_move_zeroes():
    # Test case 1: Mixed zeros and non-zeros
    nums1 = [0, 1, 0, 3, 12]
    move_zeroes_swap(nums1)
    assert nums1 == [1, 3, 12, 0, 0], f"Got {nums1}"
    
    # Test case 2: Single zero
    nums2 = [0]
    move_zeroes_swap(nums2)
    assert nums2 == [0]
    
    # Test case 3: No zeros
    nums3 = [1, 2, 3]
    move_zeroes_swap(nums3)
    assert nums3 == [1, 2, 3]
    
    # Test case 4: All zeros
    nums4 = [0, 0, 0]
    move_zeroes_swap(nums4)
    assert nums4 == [0, 0, 0]
    
    # Test case 5: Zeros at end already
    nums5 = [1, 2, 0, 0]
    move_zeroes_swap(nums5)
    assert nums5 == [1, 2, 0, 0]
    
    print("All tests passed! ✓")


if __name__ == "__main__":
    test_move_zeroes()
    
    # Visual demonstration
    print("\n" + "="*50)
    print("Move Zeroes Demonstration")
    print("="*50)
    
    nums = [0, 1, 0, 3, 12]
    print(f"Before: {nums}")
    move_zeroes_swap(nums)
    print(f"After:  {nums}")
