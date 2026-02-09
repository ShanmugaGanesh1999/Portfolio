# Middle of Linked List

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 876 | Fast & Slow Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find middle node of linked list. If two middle nodes, return second one.

### Constraints & Clarifying Questions
1. **Even length?** Return second of two middles.
2. **Single node?** Return that node.
3. **Empty list?** Return None.
4. **Return node or value?** Return the node.
5. **Expected complexity?** O(N) time, O(1) space.

### Edge Cases
1. **Single node:** Return that node
2. **Two nodes:** Return second
3. **Even length:** Return second middle

---

## Phase 2: High-Level Approach

### Approach: Fast & Slow Pointers
Slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle.

**Core Insight:** Fast travels twice as far; when fast at end, slow at midpoint.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode) -> ListNode:
    """
    Find middle node (second middle if two).
    
    Args:
        head: Head of linked list
    
    Returns:
        Middle node
    """
    slow = fast = head
    
    while fast and fast.next:  # O(N)
        slow = slow.next
        fast = fast.next.next
    
    return slow


def solve_first_middle(head: ListNode) -> ListNode:
    """
    Return first middle if two middles exist.
    """
    slow = fast = head
    
    while fast.next and fast.next.next:  # O(N)
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

---

## Phase 4: Dry Run

**Input (odd):** `1 -> 2 -> 3 -> 4 -> 5`

| Step | slow | fast |
|------|------|------|
| 0 | 1 | 1 |
| 1 | 2 | 3 |
| 2 | 3 | 5 |
| 3 | - | None (stop) |

**Result:** Node 3

**Input (even):** `1 -> 2 -> 3 -> 4 -> 5 -> 6`

| Step | slow | fast |
|------|------|------|
| 0 | 1 | 1 |
| 1 | 2 | 3 |
| 2 | 3 | 5 |
| 3 | 4 | None (fast.next is None) |

**Result:** Node 4 (second middle)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Fast pointer traverses entire list once.

### Space Complexity: O(1)
Only two pointers.

---

## Phase 6: Follow-Up Questions

1. **"How to find 1/3 point?"**
   → Slow moves 1 step, fast moves 3 steps.

2. **"What if we need both middles for even length?"**
   → Find second middle, traverse backward (need doubly linked), or find first middle instead.

3. **"How to split list at middle?"**
   → Find node before middle; set its next to None.
