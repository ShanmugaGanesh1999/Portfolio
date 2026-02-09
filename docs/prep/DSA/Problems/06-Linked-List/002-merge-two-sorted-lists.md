# Merge Two Sorted Lists

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 21 | Linked List |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Merge two sorted linked lists into one sorted list.

### Constraints & Clarifying Questions
1. **Both sorted ascending?** Yes.
2. **Can modify original lists?** Yes.
3. **Empty lists?** Return the other list.
4. **Duplicates?** Yes, keep all.
5. **Return new head?** Yes.

### Edge Cases
1. **Both empty:** Return None
2. **One empty:** Return the other
3. **No overlap:** `[1,2]` and `[3,4]` → `[1,2,3,4]`

---

## Phase 2: High-Level Approach

### Option 1: Iterative with Dummy
Use dummy head; compare and link smaller node.

### Option 2: Recursive
Smaller head becomes result; recursively merge rest.

**Core Insight:** Always pick the smaller of two current nodes.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(list1: ListNode, list2: ListNode) -> ListNode:
    """
    Merge two sorted lists iteratively.
    
    Args:
        list1: Head of first sorted list
        list2: Head of second sorted list
    
    Returns:
        Head of merged sorted list
    """
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:  # O(N + M)
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = list1 if list1 else list2
    
    return dummy.next


def solve_recursive(list1: ListNode, list2: ListNode) -> ListNode:
    """
    Merge two sorted lists recursively.
    """
    if not list1:
        return list2
    if not list2:
        return list1
    
    if list1.val <= list2.val:
        list1.next = solve_recursive(list1.next, list2)
        return list1
    else:
        list2.next = solve_recursive(list1, list2.next)
        return list2
```

---

## Phase 4: Dry Run

**Input:** `list1 = 1->2->4, list2 = 1->3->4`

| Step | list1 | list2 | Pick | current.next |
|------|-------|-------|------|--------------|
| 1 | 1->2->4 | 1->3->4 | list1 (1) | 1 |
| 2 | 2->4 | 1->3->4 | list2 (1) | 1 |
| 3 | 2->4 | 3->4 | list1 (2) | 2 |
| 4 | 4 | 3->4 | list2 (3) | 3 |
| 5 | 4 | 4 | list1 (4) | 4 |
| 6 | None | 4 | - | attach 4 |

**Result:** `1->1->2->3->4->4`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N + M)
Visit each node once.

### Space Complexity:
- **Iterative:** O(1) extra space.
- **Recursive:** O(N + M) call stack.

---

## Phase 6: Follow-Up Questions

1. **"What about merging k sorted lists?"**
   → Use min-heap of size k; or divide and conquer pairwise merging.

2. **"Can we do it without modifying original lists?"**
   → Create new nodes; increases space to O(N + M).

3. **"What if lists are sorted descending?"**
   → Reverse comparison; or reverse both lists first.
