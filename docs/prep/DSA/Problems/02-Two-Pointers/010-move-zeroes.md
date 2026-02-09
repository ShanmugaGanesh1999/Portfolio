# Move Zeroes

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 283 | Two Pointers (Partitioning) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Move all zeros to the end of array while maintaining relative order of non-zero elements.

### Constraints & Clarifying Questions
1. **Maintain relative order?** Yes, for non-zero elements.
2. **In-place?** Yes, must minimize operations.
3. **What counts as zero?** The integer 0.
4. **Can array be empty?** Yes, handle gracefully.
5. **Maximum size?** Up to 10^4.

### Edge Cases
1. **No zeros:** `nums = [1, 2, 3]` → No change
2. **All zeros:** `nums = [0, 0, 0]` → No change (already correct)
3. **Zeros at end:** `nums = [1, 0, 0]` → No change needed

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Create New Array)
Collect non-zeros, then pad with zeros.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Two Pointers)
Slow pointer marks position for next non-zero. When fast finds non-zero, swap with slow position.

**Core Insight:** Partition array into [non-zeros | zeros] by swapping non-zeros forward.

### Why Optimal?
In-place with O(1) space; single pass with minimal swaps.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> None:
    """
    Move all zeros to end while maintaining order of non-zeros.
    Modifies array in-place.
    
    Args:
        numbers: Array to modify
    """
    # Position to place next non-zero element
    non_zero_position = 0
    
    for current in range(len(numbers)):  # O(N)
        if numbers[current] != 0:
            # Swap current non-zero to its correct position
            numbers[non_zero_position], numbers[current] = (
                numbers[current], numbers[non_zero_position]
            )  # O(1)
            non_zero_position += 1


def solve_two_pass(numbers: list[int]) -> None:
    """
    Alternative: First pass moves non-zeros, second pass fills zeros.
    No swapping, just overwriting.
    """
    write = 0
    
    # First pass: move all non-zeros to front
    for num in numbers:
        if num != 0:
            numbers[write] = num
            write += 1
    
    # Second pass: fill remaining with zeros
    while write < len(numbers):
        numbers[write] = 0
        write += 1
```

---

## Phase 4: Dry Run

**Input:** `numbers = [0, 1, 0, 3, 12]`

| current | numbers[current] | Is non-zero? | non_zero_pos | Action | Array |
|---------|------------------|--------------|--------------|--------|-------|
| 0 | 0 | No | 0 | Skip | [0,1,0,3,12] |
| 1 | 1 | Yes | 1 | Swap [0]↔[1] | [1,0,0,3,12] |
| 2 | 0 | No | 1 | Skip | [1,0,0,3,12] |
| 3 | 3 | Yes | 2 | Swap [1]↔[3] | [1,3,0,0,12] |
| 4 | 12 | Yes | 3 | Swap [2]↔[4] | [1,3,12,0,0] |

**Result:** `[1, 3, 12, 0, 0]`

**Verification:** 
- Non-zero order preserved: 1, 3, 12 ✓
- All zeros at end ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array, each element examined once.

### Space Complexity: O(1)
Only pointer variables, in-place modification.

---

## Phase 6: Follow-Up Questions

1. **"What if we want to minimize the number of operations?"**
   → Two-pass approach (copy then fill zeros) does exactly N operations; swap approach might do more but accesses are localized.

2. **"What if we need to move zeros to the front?"**
   → Iterate backwards, or reverse the pointer logic (collect zeros instead of non-zeros).

3. **"What if we need to remove zeros entirely?"**
   → Same algorithm but return `non_zero_position` as new length instead of filling zeros.
