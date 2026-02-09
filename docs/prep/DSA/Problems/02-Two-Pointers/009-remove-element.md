# Remove Element

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 27 | Two Pointers (In-place) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Remove all occurrences of a value from array in-place, returning the new length.

### Constraints & Clarifying Questions
1. **Does order need to be preserved?** Not necessarily.
2. **What's in the first k positions?** Elements not equal to val.
3. **Can we use extra space?** No, must be O(1).
4. **Can array be empty?** Yes, return 0.
5. **What if val doesn't exist?** Return original length.

### Edge Cases
1. **All elements equal val:** `nums = [3,3,3], val = 3` → 0
2. **No elements equal val:** `nums = [1,2,3], val = 4` → 3
3. **Empty array:** `nums = [], val = 5` → 0

---

## Phase 2: High-Level Approach

### Option 1: Standard Two Pointers
Slow pointer for write position, fast pointer scans; copy when fast ≠ val.
- **Time:** O(N)
- **Space:** O(1)

### Option 2: Optimal (Two Pointers from Both Ends)
When element equals val, swap with element from end. Useful when val is rare—minimizes operations.

**Core Insight:** If order doesn't matter, swapping with end element avoids copying many elements.

### Why Optimal?
When val is rare, avoids unnecessary writes by replacing with end elements.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int], val: int) -> int:
    """
    Remove all occurrences of val from array in-place.
    
    Args:
        numbers: Array to modify
        val: Value to remove
    
    Returns:
        Length of array after removal
    """
    # Slow pointer: position to write next non-val element
    write_index = 0
    
    for read_index in range(len(numbers)):  # O(N)
        if numbers[read_index] != val:
            numbers[write_index] = numbers[read_index]  # O(1)
            write_index += 1
    
    return write_index


def solve_swap_from_end(numbers: list[int], val: int) -> int:
    """
    Alternative: Swap with end when val found.
    Better when val occurrences are rare.
    """
    left = 0
    right = len(numbers)  # Note: starts at len, not len-1
    
    while left < right:
        if numbers[left] == val:
            # Replace with element from end
            right -= 1
            numbers[left] = numbers[right]
            # Don't increment left - need to check swapped element
        else:
            left += 1
    
    return left
```

---

## Phase 4: Dry Run

**Input:** `numbers = [3, 2, 2, 3], val = 3`

**Standard Approach:**

| read | numbers[read] | Is val? | write | Action | Array |
|------|---------------|---------|-------|--------|-------|
| 0 | 3 | Yes | 0 | Skip | [3,2,2,3] |
| 1 | 2 | No | 1 | Copy to [0] | [2,2,2,3] |
| 2 | 2 | No | 2 | Copy to [1] | [2,2,2,3] |
| 3 | 3 | Yes | 2 | Skip | [2,2,2,3] |

**Result:** `2`, array starts with `[2, 2, ...]`

**Swap Approach:**

| left | right | numbers[left] | Action | Array |
|------|-------|---------------|--------|-------|
| 0 | 4 | 3 | Swap with [3], right-- | [3,2,2,3] (copy 3) |
| 0 | 3 | 3 | Swap with [2], right-- | [2,2,2,3] |
| 0 | 2 | 2 | left++ | [2,2,2,3] |
| 1 | 2 | 2 | left++ | [2,2,2,3] |
| 2 | 2 | — | Exit | [2,2,2,3] |

**Result:** `2`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Both approaches traverse array once. Swap approach may be faster in practice when val is rare (fewer writes).

### Space Complexity: O(1)
Only pointer variables, in-place modification.

---

## Phase 6: Follow-Up Questions

1. **"When is the swap approach better?"**
   → When val is rare. Standard approach does N-k writes; swap approach does 2×(count of val) operations.

2. **"What if we need to preserve relative order?"**
   → Must use standard approach; swap approach doesn't preserve order.

3. **"What if we need to remove multiple values?"**
   → Use hash set of values to remove: `if numbers[read] not in values_to_remove`.
