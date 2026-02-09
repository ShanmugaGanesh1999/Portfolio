# Remove Nth Node From End of List

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 19 | Two Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Remove the nth node from the end of the list.

### Constraints & Clarifying Questions
1. **n always valid?** Yes, 1 ≤ n ≤ list length.
2. **One-indexed from end?** Yes, n=1 means last node.
3. **Single node, n=1?** Remove it, return None.
4. **Return new head?** Yes.
5. **Can do in one pass?** Yes, with two pointers.

### Edge Cases
1. **Remove head:** n = list length
2. **Remove tail:** n = 1
3. **Single node:** Return None

---

## Phase 2: High-Level Approach

### Approach: Two Pointers with Gap
Advance first pointer n steps. Then move both until first reaches end. Second is at node before target.

**Core Insight:** Maintain n-node gap between two pointers.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode, n: int) -> ListNode:
    """
    Remove nth node from end of list.
    
    Args:
        head: Head of linked list
        n: Position from end (1-indexed)
    
    Returns:
        Head of modified list
    """
    dummy = ListNode(0, head)  # Handle removing head case
    first = dummy
    second = dummy
    
    # Advance first n+1 steps ahead
    for _ in range(n + 1):  # O(N)
        first = first.next
    
    # Move both until first reaches end
    while first:  # O(N)
        first = first.next
        second = second.next
    
    # Remove nth node
    second.next = second.next.next
    
    return dummy.next


def solve_two_pass(head: ListNode, n: int) -> ListNode:
    """
    Two-pass approach: count length first.
    """
    # Count length
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Handle removing head
    if n == length:
        return head.next
    
    # Find node before target
    curr = head
    for _ in range(length - n - 1):
        curr = curr.next
    
    curr.next = curr.next.next
    return head
```

---

## Phase 4: Dry Run

**Input:** `1 -> 2 -> 3 -> 4 -> 5, n = 2`

**Advance first pointer n+1 = 3 steps:**
- dummy -> 1 -> 2 -> 3 (first at 3)
- second at dummy

**Move both until first is None:**

| Step | first | second |
|------|-------|--------|
| 0 | 3 | dummy |
| 1 | 4 | 1 |
| 2 | 5 | 2 |
| 3 | None | 3 |

**Remove:** second.next (4) is removed
- 3.next = 3.next.next = 5

**Result:** `1 -> 2 -> 3 -> 5`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass with two pointers.

### Space Complexity: O(1)
Only pointer variables.

---

## Phase 6: Follow-Up Questions

1. **"Why use dummy node?"**
   → Handles edge case of removing head uniformly.

2. **"What if n is invalid?"**
   → Add validation; return head unchanged or throw error.

3. **"Remove all occurrences of a value?"**
   → Different problem; iterate and skip matching nodes.
