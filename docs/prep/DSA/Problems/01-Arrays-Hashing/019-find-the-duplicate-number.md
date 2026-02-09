# Find the Duplicate Number

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 287 | Floyd's Cycle Detection |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the one duplicate number in an array of n+1 integers where each integer is in range [1, n].

### Constraints & Clarifying Questions
1. **How many duplicates?** Exactly one number is duplicated (may appear 2+ times).
2. **Can we modify the array?** Ideally no, for optimal solution.
3. **Expected complexity?** O(N) time, O(1) space, no modification.
4. **Array size?** n+1 elements with values 1 to n.
5. **Is the duplicate guaranteed?** Yes, by pigeonhole principle.

### Edge Cases
1. **Minimum case:** `nums = [1, 1]` → 1
2. **Multiple occurrences:** `nums = [2, 2, 2, 2, 2]` → 2
3. **Duplicate at ends:** `nums = [1, 3, 4, 2, 2]` → 2

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Set)
Track seen numbers, return when duplicate found.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Floyd's Cycle Detection)
Treat array as linked list: index → nums[index]. Since there's a duplicate, there's a cycle. Use tortoise and hare to find cycle entrance (the duplicate).

**Core Insight:** With n+1 positions and values 1-n, some value must be pointed to twice, creating a cycle in the "linked list" interpretation.

### Why Optimal?
Achieves O(1) space without modifying array by treating it as an implicit linked list with a cycle.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> int:
    """
    Find the duplicate number using Floyd's Cycle Detection.
    Treats array as implicit linked list where nums[i] points to next node.
    
    Args:
        numbers: Array of n+1 integers in range [1, n]
    
    Returns:
        The duplicate integer
    """
    # Phase 1: Detect cycle using Floyd's algorithm
    slow = numbers[0]
    fast = numbers[0]
    
    # Move until they meet inside the cycle
    while True:  # O(N) - guaranteed to meet
        slow = numbers[slow]           # Move one step
        fast = numbers[numbers[fast]]  # Move two steps
        if slow == fast:
            break
    
    # Phase 2: Find cycle entrance (the duplicate)
    # Reset one pointer to start, move both at same speed
    slow = numbers[0]
    
    while slow != fast:  # O(N) - distance to cycle entrance
        slow = numbers[slow]
        fast = numbers[fast]
    
    return slow  # The meeting point is the duplicate


def solve_marking(numbers: list[int]) -> int:
    """
    Alternative: Marking with negation (modifies array).
    """
    for number in numbers:
        index = abs(number)
        if numbers[index] < 0:
            return index  # Already marked, this is duplicate
        numbers[index] = -numbers[index]
    
    return -1  # Should never reach
```

---

## Phase 4: Dry Run

**Input:** `numbers = [1, 3, 4, 2, 2]`

**Implicit Linked List:**
```
Index: 0 → 1 → 3 → 2 → 4 → 2 (cycle!)
Value: 1   3   2   4   2

0 → nums[0]=1 → nums[1]=3 → nums[3]=2 → nums[2]=4 → nums[4]=2 → nums[2]=4...
     ↓          ↓          ↓          ↓          ↓
     1          3          2          4          2 (back to 4,2,4,2...)
```

**Phase 1: Find Meeting Point**

| Step | slow | fast | After move: slow | After move: fast |
|------|------|------|------------------|------------------|
| 1 | 1 | 1 | nums[1]=3 | nums[nums[1]]=nums[3]=2 |
| 2 | 3 | 2 | nums[3]=2 | nums[nums[2]]=nums[4]=2 |
| 3 | 2 | 2 | Meet! | Meet! |

**Phase 2: Find Cycle Entrance**

Reset slow to nums[0]=1, keep fast at 2.

| Step | slow | fast | After move |
|------|------|------|------------|
| 1 | 1 | 2 | slow=nums[1]=3, fast=nums[2]=4 |
| 2 | 3 | 4 | slow=nums[3]=2, fast=nums[4]=2 |
| 3 | 2 | 2 | Meet! → Duplicate is 2 |

**Result:** `2`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Cycle detection: O(N) moves
- Finding entrance: O(N) moves
- Total: O(2N) = O(N)

### Space Complexity: O(1)
Only two pointer variables. Does not modify input array.

---

## Phase 6: Follow-Up Questions

1. **"Why does meeting point exist and why is finding entrance correct?"**
   → By pigeonhole, cycle exists. Mathematical proof: if cycle entrance is at distance μ from start and cycle length is λ, they meet at μ steps from entrance after reset.

2. **"What if we needed to find all duplicates?"**
   → Floyd's finds only one entrance; would need marking approach or hash set for all duplicates.

3. **"What if values could be 0 to n-1 instead of 1 to n?"**
   → Adjust indices: treat (value+1) as next pointer, or handle 0 specially since it would point to itself.
