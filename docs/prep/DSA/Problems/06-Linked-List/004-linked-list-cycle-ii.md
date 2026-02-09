# Linked List Cycle II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 142 | Fast & Slow Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the node where cycle begins. Return None if no cycle.

### Constraints & Clarifying Questions
1. **Return the node, not value?** Yes, return the actual node.
2. **No cycle?** Return None.
3. **Space constraint?** O(1) expected.
4. **Multiple cycles possible?** No, at most one cycle.
5. **Empty list?** Return None.

### Edge Cases
1. **No cycle:** Return None
2. **Cycle at head:** Head is cycle start
3. **Cycle at tail:** Last node points to some earlier node

---

## Phase 2: High-Level Approach

### Approach: Floyd's Algorithm Extended
1. Detect cycle (slow/fast meet)
2. Reset one pointer to head
3. Move both at same speed; they meet at cycle start

**Core Insight:** Mathematical proof: distance from head to cycle start = distance from meeting point to cycle start.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode) -> ListNode:
    """
    Find cycle start using Floyd's algorithm.
    
    Args:
        head: Head of linked list
    
    Returns:
        Node where cycle begins, or None
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Detect cycle
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:  # O(N)
        slow = slow.next
        fast = fast.next
    
    return slow


def solve_hash(head: ListNode) -> ListNode:
    """
    Find cycle start using hash set.
    """
    visited = set()
    
    while head:
        if head in visited:
            return head
        visited.add(head)
        head = head.next
    
    return None
```

---

## Phase 4: Dry Run

**Input:** `3 -> 2 -> 0 -> -4 -> 2 (cycle back to node with value 2)`

Let's label nodes: A(3) -> B(2) -> C(0) -> D(-4) -> B

Distance from head to cycle start = 1 (A to B)
Cycle length = 3 (B -> C -> D -> B)

**Phase 1: Detection**

| Step | slow | fast |
|------|------|------|
| 0 | A | A |
| 1 | B | C |
| 2 | C | B |
| 3 | D | D | ← Meet!

**Phase 2: Find Start**

| Step | slow (from head) | fast (from meeting) |
|------|------------------|---------------------|
| 0 | A | D |
| 1 | B | B | ← Meet at cycle start!

**Result:** Node B (value 2)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Cycle detection: O(N)
- Finding start: O(N)

### Space Complexity: O(1)
Only two pointers.

---

## Phase 6: Follow-Up Questions

1. **"Prove why this works mathematically?"**
   → Let a = distance to cycle start, b = distance from cycle start to meeting point, c = cycle length.
   → When they meet: slow traveled a+b, fast traveled a+b+c (fast did one extra loop).
   → Since fast travels 2x: 2(a+b) = a+b+c → a = c-b. So both need 'a' steps to reach cycle start.

2. **"How to remove the cycle?"**
   → Find the node before cycle start (traverse cycle to find it); set its next to None.

3. **"What if there's no O(1) space requirement?"**
   → Hash set is simpler and still O(N) time.
