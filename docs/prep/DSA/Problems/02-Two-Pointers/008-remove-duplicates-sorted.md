# Remove Duplicates from Sorted Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 26 | Two Pointers (In-place Modification) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Remove duplicates from sorted array in-place, returning the count of unique elements.

### Constraints & Clarifying Questions
1. **Is array sorted?** Yes, in non-decreasing order.
2. **What goes in first k positions?** Unique elements in original order.
3. **What about elements after k?** Don't matter.
4. **Can array be empty?** No, at least 1 element.
5. **Modify in-place?** Yes, no extra array allocation.

### Edge Cases
1. **All unique:** `nums = [1, 2, 3]` → 3, array unchanged
2. **All same:** `nums = [1, 1, 1]` → 1, first element is 1
3. **Single element:** `nums = [5]` → 1

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Use Set)
Create set, copy back.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Two Pointers)
Use slow pointer for position to write, fast pointer to scan. When fast finds new element, copy to slow and advance slow.

**Core Insight:** Since array is sorted, duplicates are adjacent. We only need to copy when we see a new value.

### Why Optimal?
O(1) space by modifying in-place; single pass with two pointers.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> int:
    """
    Remove duplicates from sorted array in-place.
    
    Args:
        numbers: Sorted array (will be modified)
    
    Returns:
        Count of unique elements (first k positions contain unique elements)
    """
    if not numbers:
        return 0
    
    # slow_pointer: position to write next unique element
    # First element is always unique
    slow_pointer = 1
    
    for fast_pointer in range(1, len(numbers)):  # O(N)
        # If current element is different from previous
        if numbers[fast_pointer] != numbers[fast_pointer - 1]:
            numbers[slow_pointer] = numbers[fast_pointer]  # O(1)
            slow_pointer += 1
    
    return slow_pointer


def solve_alternative(numbers: list[int]) -> int:
    """
    Alternative: Compare with element at slow position.
    """
    if not numbers:
        return 0
    
    write_index = 0
    
    for read_index in range(len(numbers)):
        if numbers[read_index] != numbers[write_index]:
            write_index += 1
            numbers[write_index] = numbers[read_index]
    
    return write_index + 1
```

---

## Phase 4: Dry Run

**Input:** `numbers = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`

| fast | numbers[fast] | numbers[fast-1] | Different? | slow | Action | Array (first slow) |
|------|---------------|-----------------|------------|------|--------|-------------------|
| 1 | 0 | 0 | No | 1 | Skip | [0] |
| 2 | 1 | 0 | Yes | 2 | Copy 1 to [1] | [0,1] |
| 3 | 1 | 1 | No | 2 | Skip | [0,1] |
| 4 | 1 | 1 | No | 2 | Skip | [0,1] |
| 5 | 2 | 1 | Yes | 3 | Copy 2 to [2] | [0,1,2] |
| 6 | 2 | 2 | No | 3 | Skip | [0,1,2] |
| 7 | 3 | 2 | Yes | 4 | Copy 3 to [3] | [0,1,2,3] |
| 8 | 3 | 3 | No | 4 | Skip | [0,1,2,3] |
| 9 | 4 | 3 | Yes | 5 | Copy 4 to [4] | [0,1,2,3,4] |

**Result:** `5`

**Array:** `[0, 1, 2, 3, 4, ...]` (elements after index 4 don't matter)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array with fast pointer.

### Space Complexity: O(1)
Only two pointer variables, in-place modification.

---

## Phase 6: Follow-Up Questions

1. **"What if we allow at most 2 duplicates?"**
   → Compare `numbers[fast]` with `numbers[slow - 2]` instead of previous element.

2. **"What if array is unsorted?"**
   → Use hash set to track seen elements; O(N) time but O(N) space.

3. **"What if we need to preserve the original array?"**
   → Make a copy first, or use separate result array; trades space for preservation.
