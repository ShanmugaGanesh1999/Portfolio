# Next Greater Element I

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 496 | Monotonic Stack + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
For each element in nums1, find next greater element in nums2 (nums1 is subset of nums2).

### Constraints & Clarifying Questions
1. **nums1 subset of nums2?** Yes, all elements of nums1 exist in nums2.
2. **All unique?** Yes, no duplicates in either array.
3. **No greater element?** Return -1.
4. **"Next greater" meaning?** First element to the right that is larger.
5. **Relative order preserved?** Looking in nums2's order.

### Edge Cases
1. **Last element:** No next greater, return -1.
2. **Decreasing sequence:** All return -1.
3. **nums1 = nums2:** Direct mapping.

---

## Phase 2: High-Level Approach

### Option 1: Naïve (For Each Query)
For each element in nums1, find in nums2 and scan right.
- **Time:** O(N × M)
- **Space:** O(1)

### Option 2: Optimal (Precompute + Hash Map)
Precompute next greater for all elements in nums2 using monotonic stack.

**Core Insight:** Build hash map of next_greater for nums2; answer queries from nums1 in O(1).

---

## Phase 3: Python Code

```python
def solve(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Find next greater element for each nums1 element in nums2.
    
    Args:
        nums1: Query elements (subset of nums2)
        nums2: Array to find next greater elements in
    
    Returns:
        Next greater element for each query (-1 if none)
    """
    next_greater = {}  # value -> next greater value
    stack = []  # Monotonic decreasing stack
    
    # Process nums2 from right to left
    for num in reversed(nums2):  # O(M)
        # Pop smaller elements (not useful as "next greater")
        while stack and stack[-1] <= num:
            stack.pop()
        
        # Top of stack is next greater (or -1 if empty)
        next_greater[num] = stack[-1] if stack else -1
        
        # Push current
        stack.append(num)
    
    # Answer queries
    return [next_greater[num] for num in nums1]  # O(N)


def solve_left_to_right(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Alternative: Process left to right, resolve when greater found.
    """
    next_greater = {}
    stack = []  # Stack of elements waiting for next greater
    
    for num in nums2:
        # Resolve all elements smaller than current
        while stack and stack[-1] < num:
            next_greater[stack.pop()] = num
        stack.append(num)
    
    # Remaining elements have no next greater
    while stack:
        next_greater[stack.pop()] = -1
    
    return [next_greater[num] for num in nums1]
```

---

## Phase 4: Dry Run

**Input:** `nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]`

**Build next_greater (right to left):**

| num | Stack before | next_greater[num] | Stack after |
|-----|--------------|-------------------|-------------|
| 2 | [] | -1 | [2] |
| 4 | [2] | -1 (2 < 4, pop) | [4] |
| 3 | [4] | 4 | [4, 3] |
| 1 | [4, 3] | 3 | [4, 3, 1] |

**next_greater:** `{2: -1, 4: -1, 3: 4, 1: 3}`

**Answer queries:**
- nums1[0] = 4 → next_greater[4] = -1
- nums1[1] = 1 → next_greater[1] = 3
- nums1[2] = 2 → next_greater[2] = -1

**Result:** `[-1, 3, -1]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N + M)
- Preprocessing nums2: O(M)
- Answering N queries: O(N)

### Space Complexity: O(M)
- Hash map stores M entries.
- Stack holds at most M elements.

---

## Phase 6: Follow-Up Questions

1. **"What about Next Greater Element II (circular array)?"**
   → Process array twice (2N iterations) with modulo indexing.

2. **"What if arrays have duplicates?"**
   → Store indices instead of values; map index to next greater index.

3. **"What about next smaller element?"**
   → Reverse condition: pop while stack top >= current.
