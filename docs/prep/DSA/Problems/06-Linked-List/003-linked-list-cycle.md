# Linked List Cycle

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 141 | Fast & Slow Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Detect if linked list has a cycle.

### Constraints & Clarifying Questions
1. **What's a cycle?** Tail connects to earlier node.
2. **Empty list?** No cycle (return False).
3. **Single node pointing to itself?** Cycle exists.
4. **Can modify list?** Ideally not (O(1) space approach).
5. **Expected complexity?** O(N) time, O(1) space.

### Edge Cases
1. **Empty list:** No cycle
2. **Single node, no cycle:** Return False
3. **Single node with self-loop:** Return True

---

## Phase 2: High-Level Approach

### Option 1: Hash Set
Track visited nodes.
- **Time:** O(N), **Space:** O(N)

### Option 2: Floyd's Cycle Detection (Tortoise & Hare)
Slow pointer moves 1 step, fast moves 2 steps. If cycle exists, they meet.

**Core Insight:** In a cycle, fast pointer eventually catches slow pointer.

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(head: ListNode) -> bool:
    """
    Detect cycle using Floyd's algorithm.
    
    Args:
        head: Head of linked list
    
    Returns:
        True if cycle exists
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:  # O(N)
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
        
        if slow == fast:
            return True
    
    return False


def solve_hash(head: ListNode) -> bool:
    """
    Detect cycle using hash set.
    """
    visited = set()
    
    while head:
        if head in visited:
            return True
        visited.add(head)
        head = head.next
    
    return False
```

---

## Phase 4: Dry Run

**Input:** `1 -> 2 -> 3 -> 4 -> 2 (cycle back to node 2)`

| Step | slow | fast | Same? |
|------|------|------|-------|
| 0 | 1 | 1 | No |
| 1 | 2 | 3 | No |
| 2 | 3 | 2 | No |
| 3 | 4 | 4 | Yes! |

**Result:** `True`

**No Cycle:** `1 -> 2 -> 3 -> None`

| Step | slow | fast |
|------|------|------|
| 0 | 1 | 1 |
| 1 | 2 | 3 |
| 2 | 3 | None |

Fast reaches None → `False`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- If no cycle: fast pointer reaches end in N/2 steps.
- If cycle: slow enters cycle, fast catches up within cycle length steps.

### Space Complexity: O(1)
Only two pointers.

---

## Phase 6: Follow-Up Questions

1. **"How to find where cycle starts?"**
   → After detection, reset one pointer to head; move both at same speed; they meet at cycle start.

2. **"How to find cycle length?"**
   → After pointers meet, count steps for one to circle back.

3. **"Can fast move 3 steps instead of 2?"**
   → Works for detection but may miss meeting point; 2 steps is optimal.
