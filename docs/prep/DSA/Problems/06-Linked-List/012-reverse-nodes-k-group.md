# Reverse Nodes in k-Group

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 25 | Linked List |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Reverse every k nodes in linked list. If remaining nodes < k, keep them as-is.

### Constraints & Clarifying Questions
1. **k always valid?** Yes, 1 ≤ k ≤ n.
2. **k = 1?** Return original list.
3. **Last group < k nodes?** Don't reverse.
4. **Constant space?** Ideally yes.
5. **Return new head?** Yes.

### Edge Cases
1. **k = 1:** No change
2. **k = n:** Reverse entire list
3. **Single node:** Return as-is

---

## Phase 2: High-Level Approach

### Approach: Iterative k-Node Reversal
1. Count k nodes
2. If k nodes exist, reverse them
3. Connect reversed group to previous part
4. Repeat

**Core Insight:** Use a dummy head and track group boundaries.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode, k: int) -> ListNode:
    """
    Reverse nodes in k-groups.
    
    Args:
        head: Head of linked list
        k: Group size
    
    Returns:
        Head of modified list
    """
    # Count total nodes
    count = 0
    curr = head
    while curr:
        count += 1
        curr = curr.next
    
    dummy = ListNode(0, head)
    group_prev = dummy
    
    while count >= k:
        # Reverse k nodes starting from group_prev.next
        prev = None
        curr = group_prev.next
        
        for _ in range(k):  # O(k)
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Connect: group_prev -> reversed group -> remaining
        group_start = group_prev.next  # Will become end after reverse
        group_prev.next = prev         # prev is new group head
        group_start.next = curr        # Connect to remaining
        
        # Move group_prev to end of reversed group
        group_prev = group_start
        count -= k
    
    return dummy.next


def solve_recursive(head: ListNode, k: int) -> ListNode:
    """
    Recursive approach.
    """
    # Check if k nodes exist
    curr = head
    count = 0
    while curr and count < k:
        curr = curr.next
        count += 1
    
    if count < k:
        return head  # Don't reverse
    
    # Reverse first k nodes
    prev = None
    curr = head
    for _ in range(k):
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    # head is now tail of reversed group
    # Recursively process rest and connect
    head.next = solve_recursive(curr, k)
    
    return prev  # New head of this group
```

---

## Phase 4: Dry Run

**Input:** `1 -> 2 -> 3 -> 4 -> 5, k = 2`

| Group | Before | After Reverse | Connection |
|-------|--------|---------------|------------|
| 1 | 1->2 | 2->1 | dummy->2->1 |
| 2 | 3->4 | 4->3 | 1->4->3 |
| 3 | 5 (< k) | 5 | 3->5 |

**Result:** `2 -> 1 -> 4 -> 3 -> 5`

**Detailed Iteration 1:**
- group_prev = dummy
- Reverse 1->2: becomes 2->1
- prev = 2, curr = 3
- group_start = 1
- dummy.next = 2, 1.next = 3
- group_prev = 1

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node constant times.

### Space Complexity:
- **Iterative:** O(1)
- **Recursive:** O(N/k) call stack

---

## Phase 6: Follow-Up Questions

1. **"What if we reverse alternating groups?"**
   → Skip k nodes after each reversal; use flag to toggle.

2. **"What about reversing last group even if < k?"**
   → Don't check count; reverse whatever remains.

3. **"Can we do it in single pass?"**
   → Need to know if k nodes exist; either count ahead or reverse optimistically then re-reverse if needed.
