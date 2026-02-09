# Merge Sorted Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 88 | Two Pointers (Reverse Direction) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Merge two sorted arrays into the first array (which has extra space allocated at the end).

### Constraints & Clarifying Questions
1. **Where to store result?** In nums1, which has size m + n.
2. **Are arrays sorted?** Yes, both in non-decreasing order.
3. **What's at end of nums1?** Zeros as placeholders (don't count).
4. **Can nums2 be empty?** Yes (n = 0), nums1 stays as is.
5. **Is in-place modification required?** Yes.

### Edge Cases
1. **nums2 empty:** `nums1 = [1,2,3,0,0], m=3, nums2=[], n=0` → [1,2,3,0,0] (no change to first m)
2. **nums1 empty:** `nums1 = [0,0], m=0, nums2=[1,2], n=2` → [1,2]
3. **No interleaving:** `nums1 = [4,5,6,0,0], nums2=[1,2]` → [1,2,4,5,6]

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Copy and Sort)
Copy nums2 to end of nums1, then sort.
- **Time:** O((m+n) log(m+n))
- **Space:** O(1) or O(m+n)

### Option 2: Optimal (Three Pointers from End)
Fill nums1 from the end (position m+n-1) by comparing largest elements from both arrays. This avoids overwriting elements we still need.

**Core Insight:** By filling from the back, we never overwrite elements in nums1 that haven't been processed yet.

### Why Optimal?
O(m+n) time with O(1) space; avoids extra array or sorting.

---

## Phase 3: Python Code

```python
def solve(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    """
    Merge nums2 into nums1 in-place (nums1 has extra space at end).
    
    Args:
        nums1: First sorted array with m elements + n zeros
        m: Number of actual elements in nums1
        nums2: Second sorted array
        n: Number of elements in nums2
    """
    # Pointers to last actual element in each array
    pointer1 = m - 1
    pointer2 = n - 1
    # Pointer to last position in merged array
    write_position = m + n - 1
    
    # Merge from the end
    while pointer2 >= 0:  # O(m + n)
        # If nums1 exhausted or nums2 element is larger
        if pointer1 < 0 or nums2[pointer2] >= nums1[pointer1]:
            nums1[write_position] = nums2[pointer2]  # O(1)
            pointer2 -= 1
        else:
            nums1[write_position] = nums1[pointer1]  # O(1)
            pointer1 -= 1
        
        write_position -= 1


def solve_alternative(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    """
    Alternative with explicit while loops.
    """
    p1, p2, write = m - 1, n - 1, m + n - 1
    
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[write] = nums1[p1]
            p1 -= 1
        else:
            nums1[write] = nums2[p2]
            p2 -= 1
        write -= 1
    
    # Copy remaining nums2 (if any)
    # Note: no need to copy remaining nums1 - already in place!
    while p2 >= 0:
        nums1[write] = nums2[p2]
        p2 -= 1
        write -= 1
```

---

## Phase 4: Dry Run

**Input:** `nums1 = [1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3`

| Step | p1 | p2 | write | nums1[p1] | nums2[p2] | Larger | Action | nums1 |
|------|----|----|-------|-----------|-----------|--------|--------|-------|
| 1 | 2 | 2 | 5 | 3 | 6 | 6 | Copy 6, p2-- | [1,2,3,0,0,6] |
| 2 | 2 | 1 | 4 | 3 | 5 | 5 | Copy 5, p2-- | [1,2,3,0,5,6] |
| 3 | 2 | 0 | 3 | 3 | 2 | 3 | Copy 3, p1-- | [1,2,3,3,5,6] |
| 4 | 1 | 0 | 2 | 2 | 2 | 2 (nums2) | Copy 2, p2-- | [1,2,2,3,5,6] |
| 5 | 1 | -1 | — | — | — | — | p2 < 0, done | [1,2,2,3,5,6] |

**Result:** `[1, 2, 2, 3, 5, 6]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m + n)
Each element from nums1 and nums2 is processed exactly once.

### Space Complexity: O(1)
Only three pointer variables; merging happens in-place within nums1.

---

## Phase 6: Follow-Up Questions

1. **"Why don't we need to copy remaining nums1 elements?"**
   → They're already in their correct positions within nums1. When p2 is exhausted, remaining nums1 elements are already where they should be.

2. **"What if nums1 doesn't have extra space?"**
   → Would need O(m) or O(n) extra space for temporary storage, or merge into a new array.

3. **"How would you merge k sorted arrays?"**
   → Use min-heap with (value, array_index, element_index) tuples; O(N log k) where N is total elements.
