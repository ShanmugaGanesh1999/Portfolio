# Sort Array By Parity

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 905 | Two Pointers (Partitioning) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Reorder array so all even numbers come before all odd numbers.

### Constraints & Clarifying Questions
1. **Does order within evens/odds matter?** No, any order is fine.
2. **In-place required?** Not strictly, but preferred.
3. **Can array be empty?** No, at least 1 element.
4. **Are there only positive integers?** Yes, 1 to 1000.
5. **Maximum size?** Up to 5000.

### Edge Cases
1. **All even:** `nums = [2, 4, 6]` → Already valid
2. **All odd:** `nums = [1, 3, 5]` → Already valid
3. **Single element:** `nums = [1]` → Already valid

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Two Pass)
Collect evens, then odds, combine.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Two Pointers)
Left pointer seeks odd (to swap), right pointer seeks even. When both found, swap.

**Core Insight:** Partition array into [evens | odds] using swap-based partitioning like Dutch National Flag.

### Why Optimal?
O(1) space with single pass by swapping in-place.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> list[int]:
    """
    Reorder so all evens appear before all odds.
    
    Args:
        numbers: Array of integers
    
    Returns:
        Reordered array (also modifies in-place)
    """
    left = 0
    right = len(numbers) - 1
    
    while left < right:  # O(N)
        # Find odd number from left
        while left < right and numbers[left] % 2 == 0:
            left += 1
        
        # Find even number from right
        while left < right and numbers[right] % 2 == 1:
            right -= 1
        
        # Swap if valid positions
        if left < right:
            numbers[left], numbers[right] = numbers[right], numbers[left]  # O(1)
            left += 1
            right -= 1
    
    return numbers


def solve_single_pointer(numbers: list[int]) -> list[int]:
    """
    Alternative: Single pointer approach.
    Move evens to front as we find them.
    """
    even_position = 0
    
    for i in range(len(numbers)):
        if numbers[i] % 2 == 0:
            numbers[even_position], numbers[i] = numbers[i], numbers[even_position]
            even_position += 1
    
    return numbers
```

---

## Phase 4: Dry Run

**Input:** `numbers = [3, 1, 2, 4]`

| Step | left | right | nums[left] | nums[right] | Action | Array |
|------|------|-------|------------|-------------|--------|-------|
| 1 | 0 | 3 | 3 (odd) | 4 (even) | Swap | [4,1,2,3] |
| 2 | 1 | 2 | 1 (odd) | 2 (even) | Swap | [4,2,1,3] |
| 3 | 2 | 1 | — | — | left > right | Exit |

**Result:** `[4, 2, 1, 3]`

**Verification:** Evens (4, 2) before odds (1, 3) ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Each element is examined at most twice (once by each pointer).

### Space Complexity: O(1)
Only two pointer variables, in-place modification.

---

## Phase 6: Follow-Up Questions

1. **"What if we need to preserve relative order within evens and odds?"**
   → Use stable partition: two-pointer with temporary array, or in-place with careful rotation (more complex).

2. **"How to generalize to k categories?"**
   → Multiple passes or counting sort approach; Dutch National Flag for 3 categories.

3. **"What if we need evens sorted and odds sorted?"**
   → First partition, then sort each half: O(N log N) total.
