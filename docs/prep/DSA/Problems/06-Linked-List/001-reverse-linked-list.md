# Reverse Linked List

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 206 | Linked List |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Reverse a singly linked list.

### Constraints & Clarifying Questions
1. **Return new head?** Yes.
2. **Empty list?** Return None.
3. **Single node?** Return as-is.
4. **Modify in-place?** Yes.
5. **Need iterative or recursive?** Both are valid.

### Edge Cases
1. **Empty list:** Return None
2. **Single node:** Return that node
3. **Two nodes:** Swap pointers

---

## Phase 2: High-Level Approach

### Option 1: Iterative
Use three pointers: prev, curr, next.

### Option 2: Recursive
Reverse rest of list, then fix current node's next.

**Core Insight:** Change each next pointer to point to previous node.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode) -> ListNode:
    """
    Reverse linked list iteratively.
    
    Args:
        head: Head of linked list
    
    Returns:
        New head (original tail)
    """
    prev = None
    curr = head
    
    while curr:  # O(N)
        next_temp = curr.next  # Save next
        curr.next = prev       # Reverse link
        prev = curr            # Move prev forward
        curr = next_temp       # Move curr forward
    
    return prev


def solve_recursive(head: ListNode) -> ListNode:
    """
    Reverse linked list recursively.
    """
    # Base case: empty or single node
    if not head or not head.next:
        return head
    
    # Reverse rest of list
    new_head = solve_recursive(head.next)  # O(N) calls
    
    # Fix pointers: head -> next should point back to head
    head.next.next = head
    head.next = None
    
    return new_head
```

---

## Phase 4: Dry Run

**Input:** `1 -> 2 -> 3 -> None`

**Iterative:**

| Step | prev | curr | next_temp | Action |
|------|------|------|-----------|--------|
| 0 | None | 1 | - | Start |
| 1 | None | 1 | 2 | 1.next = None |
| 2 | 1 | 2 | 3 | 2.next = 1 |
| 3 | 2 | 3 | None | 3.next = 2 |
| 4 | 3 | None | - | Done, return 3 |

**Result:** `3 -> 2 -> 1 -> None`

**Recursive:**
```
reverse(1->2->3)
  └── reverse(2->3)
        └── reverse(3) = 3 (base case)
        2.next.next = 2 → 3.next = 2
        2.next = None
        return 3
  1.next.next = 1 → 2.next = 1
  1.next = None
  return 3
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity:
- **Iterative:** O(1) extra space.
- **Recursive:** O(N) call stack.

---

## Phase 6: Follow-Up Questions

1. **"What about reversing between positions m and n?"**
   → Traverse to position m-1, reverse m to n, fix connections.

2. **"How to reverse in groups of k?"**
   → Reverse k nodes at a time, connect reversed groups.

3. **"Can we verify reversal?"**
   → Traverse and check if values are in reverse order.
