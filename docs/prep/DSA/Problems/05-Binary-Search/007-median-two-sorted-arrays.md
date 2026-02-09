# Median of Two Sorted Arrays

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 4 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find median of two sorted arrays combined, in O(log(m+n)) time.

### Constraints & Clarifying Questions
1. **Can one array be empty?** Yes.
2. **Even total length?** Median is average of two middle elements.
3. **Elements can be negative?** Yes.
4. **Duplicates?** Yes, allowed.
5. **Expected time?** O(log(min(m, n))).

### Edge Cases
1. **One empty array:** Median of other array.
2. **Arrays don't overlap:** `[1,2]`, `[3,4]` → (2+3)/2 = 2.5
3. **Single elements:** `[1]`, `[2]` → 1.5

---

## Phase 2: High-Level Approach

### Approach: Binary Search on Partition
Binary search to find correct partition in smaller array.

**Core Insight:** Find partition where left elements from both arrays ≤ right elements from both arrays.

---

## Phase 3: Python Code

```python
def solve(nums1: list[int], nums2: list[int]) -> float:
    """
    Find median of two sorted arrays.
    
    Args:
        nums1: First sorted array
        nums2: Second sorted array
    
    Returns:
        Median of combined arrays
    """
    # Ensure nums1 is smaller for binary search efficiency
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    total = m + n
    half = total // 2
    
    left, right = 0, m
    
    while left <= right:  # O(log(min(m, n)))
        # Partition indices
        i = (left + right) // 2  # Partition in nums1
        j = half - i             # Partition in nums2
        
        # Values around partitions (use infinity for edge cases)
        nums1_left = nums1[i - 1] if i > 0 else float('-inf')
        nums1_right = nums1[i] if i < m else float('inf')
        nums2_left = nums2[j - 1] if j > 0 else float('-inf')
        nums2_right = nums2[j] if j < n else float('inf')
        
        # Check if valid partition
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            # Found correct partition
            if total % 2 == 1:
                # Odd total: median is min of right side
                return min(nums1_right, nums2_right)
            else:
                # Even total: average of max left and min right
                return (max(nums1_left, nums2_left) + 
                        min(nums1_right, nums2_right)) / 2
        elif nums1_left > nums2_right:
            # Too many from nums1 on left, move partition left
            right = i - 1
        else:
            # Too few from nums1 on left, move partition right
            left = i + 1
    
    return 0.0  # Should never reach here for valid input
```

---

## Phase 4: Dry Run

**Input:** `nums1 = [1, 3], nums2 = [2]`

m=2, n=1, total=3, half=1

| left | right | i | j | n1_L | n1_R | n2_L | n2_R | Valid? |
|------|-------|---|---|------|------|------|------|--------|
| 0 | 2 | 1 | 0 | 1 | 3 | -∞ | 2 | 1≤2 and -∞≤3? Yes! |

**Odd total:** median = min(3, 2) = `2`

**Input:** `nums1 = [1, 2], nums2 = [3, 4]`

m=2, n=2, total=4, half=2

| left | right | i | j | n1_L | n1_R | n2_L | n2_R | Valid? |
|------|-------|---|---|------|------|------|------|--------|
| 0 | 2 | 1 | 1 | 1 | 2 | 3 | 4 | 1≤4 and 3≤2? No |
| 2 | 2 | 2 | 0 | 2 | ∞ | -∞ | 3 | 2≤3 and -∞≤∞? Yes! |

**Even total:** median = (max(2, -∞) + min(∞, 3)) / 2 = (2 + 3) / 2 = `2.5`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log(min(m, n)))
Binary search on smaller array.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"Why binary search on smaller array?"**
   → Fewer iterations; both give correct answer but smaller is more efficient.

2. **"Can we generalize to k-th element?"**
   → Yes, similar approach but target k elements on left instead of half.

3. **"What about k sorted arrays?"**
   → Use min-heap to merge; or divide and conquer pairwise.
