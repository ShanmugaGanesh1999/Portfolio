# Add Two Numbers

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 2 | Linked List |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Add two numbers represented as linked lists in reverse order (least significant digit first).

### Constraints & Clarifying Questions
1. **Reverse order?** Yes, 342 is stored as 2->4->3.
2. **Leading zeros?** No, except 0 itself.
3. **Non-negative?** Yes.
4. **Different lengths?** Yes, handle.
5. **Return format?** Same reverse order linked list.

### Edge Cases
1. **Different lengths:** 123 + 45
2. **Carry at end:** 99 + 1 = 100
3. **One list empty:** Return other (though problem says non-empty)

---

## Phase 2: High-Level Approach

### Approach: Elementary Math
Process both lists digit by digit; track carry.

**Core Insight:** Same as adding numbers by hand, starting from least significant digit.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add two numbers represented as reversed linked lists.
    
    Args:
        l1: First number (reversed)
        l2: Second number (reversed)
    
    Returns:
        Sum as reversed linked list
    """
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:  # O(max(N, M))
        # Get values (0 if list exhausted)
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        # Calculate sum and carry
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        # Create new node
        current.next = ListNode(digit)
        current = current.next
        
        # Advance pointers
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next


def solve_recursive(l1: ListNode, l2: ListNode, carry: int = 0) -> ListNode:
    """
    Recursive approach.
    """
    if not l1 and not l2 and not carry:
        return None
    
    val1 = l1.val if l1 else 0
    val2 = l2.val if l2 else 0
    
    total = val1 + val2 + carry
    node = ListNode(total % 10)
    
    node.next = solve_recursive(
        l1.next if l1 else None,
        l2.next if l2 else None,
        total // 10
    )
    
    return node
```

---

## Phase 4: Dry Run

**Input:** 
- l1: 2->4->3 (represents 342)
- l2: 5->6->4 (represents 465)
- Expected: 342 + 465 = 807 → 7->0->8

| Step | l1 | l2 | carry | total | digit | Result |
|------|----|----|-------|-------|-------|--------|
| 1 | 2 | 5 | 0 | 7 | 7 | 7 |
| 2 | 4 | 6 | 0 | 10 | 0 | 7->0 |
| 3 | 3 | 4 | 1 | 8 | 8 | 7->0->8 |
| 4 | None | None | 0 | - | - | Done |

**Result:** `7 -> 0 -> 8`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(max(N, M))
Process all digits of both numbers.

### Space Complexity: O(max(N, M))
New list with at most max(N, M) + 1 nodes.

---

## Phase 6: Follow-Up Questions

1. **"What if numbers are in correct order (most significant first)?"**
   → Reverse both lists first, add, reverse result. Or use recursion with stack.

2. **"What about subtraction?"**
   → More complex; handle negative results, borrow instead of carry.

3. **"What if we need to return the integer result?"**
   → Build number while traversing: `num = num * 10 + digit`. Watch for overflow.
