# Copy List with Random Pointer

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 138 | Linked List + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Deep copy a linked list where each node has a next pointer and a random pointer (can point to any node or None).

### Constraints & Clarifying Questions
1. **Deep copy means?** Create entirely new nodes.
2. **Random can point anywhere?** Yes, including itself or None.
3. **Empty list?** Return None.
4. **Preserve random relationships?** Yes, in copied list.
5. **Expected complexity?** O(N) time.

### Edge Cases
1. **Empty list:** Return None
2. **Single node with random to itself:** Copy should self-reference
3. **Random is None:** Copy's random is also None

---

## Phase 2: High-Level Approach

### Option 1: Hash Map (Two Pass)
First pass: create all nodes. Second pass: set next and random.

### Option 2: Interleaving (O(1) Space)
Insert copy nodes between original nodes; set random; separate lists.

**Core Insight:** Need to map original nodes to copies to set random pointers correctly.

---

## Phase 3: Python Code

```python
class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random


def solve(head: Node) -> Node:
    """
    Deep copy list with random pointers using hash map.
    
    Args:
        head: Head of original list
    
    Returns:
        Head of deep copied list
    """
    if not head:
        return None
    
    # Map original nodes to copies
    old_to_new = {}
    
    # First pass: create all nodes
    curr = head
    while curr:  # O(N)
        old_to_new[curr] = Node(curr.val)
        curr = curr.next
    
    # Second pass: set next and random
    curr = head
    while curr:  # O(N)
        if curr.next:
            old_to_new[curr].next = old_to_new[curr.next]
        if curr.random:
            old_to_new[curr].random = old_to_new[curr.random]
        curr = curr.next
    
    return old_to_new[head]


def solve_interleave(head: Node) -> Node:
    """
    O(1) space solution by interleaving nodes.
    """
    if not head:
        return None
    
    # Step 1: Create copies interleaved
    # A -> A' -> B -> B' -> C -> C'
    curr = head
    while curr:
        new_node = Node(curr.val, curr.next)
        curr.next = new_node
        curr = new_node.next
    
    # Step 2: Set random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next
    
    # Step 3: Separate lists
    dummy = Node(0)
    copy_curr = dummy
    curr = head
    
    while curr:
        copy_curr.next = curr.next
        copy_curr = copy_curr.next
        curr.next = curr.next.next
        curr = curr.next
    
    return dummy.next
```

---

## Phase 4: Dry Run

**Input:** 
```
Original: A(val=1) -> B(val=2) -> None
A.random = B, B.random = A
```

**Hash Map Approach:**

| Pass | Node | Action |
|------|------|--------|
| 1 | A | Create A'(1) |
| 1 | B | Create B'(2) |
| 2 | A | A'.next = B', A'.random = B' |
| 2 | B | B'.next = None, B'.random = A' |

**Result:** `A'(1) -> B'(2)` with A'.random = B', B'.random = A'

---

## Phase 5: Complexity Analysis

### Hash Map Approach:
- **Time:** O(N) - two passes
- **Space:** O(N) - hash map

### Interleaving Approach:
- **Time:** O(N) - three passes
- **Space:** O(1) - no extra data structures

---

## Phase 6: Follow-Up Questions

1. **"Why can't we just copy in one pass?"**
   → Random might point to node not yet created.

2. **"What about cycles in random pointers?"**
   → Handled naturally; we create nodes first, then link.

3. **"What if random points to nodes outside list?"**
   → Undefined; typically random only points within list.
