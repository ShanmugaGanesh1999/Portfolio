# Find Duplicate Number

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 287 | Fast & Slow Pointers / Linked List Cycle |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the duplicate number in array of n+1 integers where each integer is in [1, n]. Only one duplicate exists (can repeat multiple times).

### Constraints & Clarifying Questions
1. **Modify array?** No.
2. **Extra space?** O(1).
3. **How many duplicates?** Only one number is duplicated.
4. **Can it repeat more than twice?** Yes.
5. **Array length?** n+1 elements with values 1 to n.

### Edge Cases
1. **Duplicate appears twice:** `[1,3,4,2,2]` → 2
2. **Duplicate appears many times:** `[3,1,3,3,3]` → 3
3. **Minimum array:** `[1,1]` → 1

---

## Phase 2: High-Level Approach

### Approach: Floyd's Cycle Detection
Treat array as linked list: index i points to index nums[i]. Duplicate creates cycle.

**Core Insight:** Values in range [1,n] act as pointers. Duplicate value means two "nodes" point to same "node" = cycle.

---

## Phase 3: Python Code

```python
def solve(nums: list[int]) -> int:
    """
    Find duplicate using Floyd's cycle detection.
    
    Args:
        nums: Array with one duplicate
    
    Returns:
        The duplicate number
    """
    # Phase 1: Find intersection point
    slow = nums[0]
    fast = nums[0]
    
    while True:  # O(N)
        slow = nums[slow]           # Move 1 step
        fast = nums[nums[fast]]     # Move 2 steps
        if slow == fast:
            break
    
    # Phase 2: Find cycle entrance
    slow = nums[0]
    while slow != fast:  # O(N)
        slow = nums[slow]
        fast = nums[fast]
    
    return slow


def solve_binary_search(nums: list[int]) -> int:
    """
    Alternative: Binary search on value range.
    Count numbers <= mid; if count > mid, duplicate is in [1, mid].
    """
    left, right = 1, len(nums) - 1
    
    while left < right:  # O(N log N)
        mid = (left + right) // 2
        count = sum(1 for num in nums if num <= mid)  # O(N)
        
        if count > mid:
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 3, 4, 2, 2]`

Treat as linked list:
- Index 0 → nums[0] = 1
- Index 1 → nums[1] = 3
- Index 2 → nums[2] = 4
- Index 3 → nums[3] = 2
- Index 4 → nums[4] = 2

Chain: 0 → 1 → 3 → 2 → 4 → 2 (cycle!)

**Phase 1: Detection**

| Step | slow | fast |
|------|------|------|
| 0 | 1 | 1 |
| 1 | 3 | 2 |
| 2 | 2 | 2 | ← Meet!

**Phase 2: Find Entrance**

| Step | slow | fast |
|------|------|------|
| 0 | 1 | 2 |
| 1 | 3 | 4 |
| 2 | 2 | 2 | ← Meet at 2!

**Result:** `2`

---

## Phase 5: Complexity Analysis

### Floyd's Approach:
- **Time:** O(N)
- **Space:** O(1)

### Binary Search Approach:
- **Time:** O(N log N)
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Why does Floyd's algorithm work here?"**
   → Values act as pointers; duplicate means two indices point to same value = cycle entrance.

2. **"Can there be multiple duplicates?"**
   → Different problem; would need different approach (like XOR or counting).

3. **"What if values could be 0?"**
   → Would need adjustment; 0 pointing to itself is problematic.
