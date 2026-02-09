# Reorder List

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 143 | Linked List |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Reorder list from L0→L1→...→Ln to L0→Ln→L1→Ln-1→L2→Ln-2→...

### Constraints & Clarifying Questions
1. **Modify in place?** Yes.
2. **Return anything?** No, void function.
3. **Empty or single node?** No change needed.
4. **Even vs odd length?** Handle both.
5. **Can use extra space?** Ideally O(1).

### Edge Cases
1. **Empty/single node:** No change
2. **Two nodes:** 1->2 stays 1->2
3. **Three nodes:** 1->2->3 becomes 1->3->2

---

## Phase 2: High-Level Approach

### Approach: Three Steps
1. Find middle using slow/fast pointers
2. Reverse second half
3. Merge two halves alternately

**Core Insight:** Break into subproblems we know how to solve.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode) -> None:
    """
    Reorder list in-place: L0→Ln→L1→Ln-1→...
    
    Args:
        head: Head of linked list
    """
    if not head or not head.next:
        return
    
    # Step 1: Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    second = slow.next
    slow.next = None  # Split the list
    prev = None
    
    while second:  # O(N/2)
        next_temp = second.next
        second.next = prev
        prev = second
        second = next_temp
    
    second = prev  # New head of reversed second half
    
    # Step 3: Merge alternately
    first = head
    while second:  # O(N/2)
        # Save next pointers
        first_next = first.next
        second_next = second.next
        
        # Reorder
        first.next = second
        second.next = first_next
        
        # Move pointers
        first = first_next
        second = second_next
```

---

## Phase 4: Dry Run

**Input:** `1 -> 2 -> 3 -> 4 -> 5`

**Step 1: Find Middle**
- slow stops at 3 (middle)

**Step 2: Split and Reverse Second Half**
- First half: 1 -> 2 -> 3 -> None
- Second half before reverse: 4 -> 5
- Second half after reverse: 5 -> 4

**Step 3: Merge**

| Iteration | first | second | Result so far |
|-----------|-------|--------|---------------|
| 1 | 1 | 5 | 1 -> 5 -> 2... |
| 2 | 2 | 4 | 1 -> 5 -> 2 -> 4 -> 3 |
| 3 | 3 | None | Done |

**Result:** `1 -> 5 -> 2 -> 4 -> 3`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Find middle: O(N)
- Reverse: O(N/2)
- Merge: O(N/2)

### Space Complexity: O(1)
Only pointer variables.

---

## Phase 6: Follow-Up Questions

1. **"What if we use a deque?"**
   → Store all nodes; pop from both ends alternately. O(N) space.

2. **"Can we do it recursively?"**
   → Yes, but O(N) stack space.

3. **"What if we need to return new head?"**
   → Head doesn't change; still return original head.
