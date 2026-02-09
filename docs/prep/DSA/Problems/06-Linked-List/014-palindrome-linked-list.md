# Palindrome Linked List

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 234 | Fast & Slow Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if linked list values form a palindrome.

### Constraints & Clarifying Questions
1. **O(1) space?** Follow-up asks for it.
2. **Empty list?** True (vacuously palindrome).
3. **Single node?** True.
4. **Compare values, not nodes?** Yes.
5. **Modify list allowed?** For O(1) space, yes (can restore).

### Edge Cases
1. **Empty/single node:** True
2. **Two same nodes:** True
3. **Two different nodes:** False

---

## Phase 2: High-Level Approach

### Option 1: Stack (O(N) space)
Push first half to stack; compare with second half.

### Option 2: Reverse Second Half (O(1) space)
Find middle, reverse second half, compare, optionally restore.

**Core Insight:** Palindrome means first half equals reversed second half.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode) -> bool:
    """
    Check palindrome by reversing second half. O(1) space.
    
    Args:
        head: Head of linked list
    
    Returns:
        True if palindrome
    """
    if not head or not head.next:
        return True
    
    # Step 1: Find middle (slow at first of second half)
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    prev = None
    while slow:
        next_temp = slow.next
        slow.next = prev
        prev = slow
        slow = next_temp
    
    # Step 3: Compare halves
    left, right = head, prev
    while right:  # Right half might be shorter
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    
    return True


def solve_stack(head: ListNode) -> bool:
    """
    Using stack. O(N) space.
    """
    # Collect all values
    values = []
    curr = head
    while curr:
        values.append(curr.val)
        curr = curr.next
    
    # Check palindrome
    return values == values[::-1]
```

---

## Phase 4: Dry Run

**Input:** `1 -> 2 -> 2 -> 1`

**Step 1: Find Middle**
- slow ends at second 2 (index 2)

**Step 2: Reverse Second Half**
- Before: 2 -> 1 -> None
- After: 1 -> 2 -> None (prev points to 1)

**Step 3: Compare**

| left | right | Match? |
|------|-------|--------|
| 1 | 1 | ✓ |
| 2 | 2 | ✓ |
| - | None | Done |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Reverse Second Half:
- **Time:** O(N)
- **Space:** O(1)

### Stack:
- **Time:** O(N)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Should we restore the list?"**
   → Depends on requirements; reverse second half again after comparison.

2. **"What about doubly linked list?"**
   → Use two pointers from both ends; simpler.

3. **"Recursive approach?"**
   → Use call stack to compare; O(N) space.
