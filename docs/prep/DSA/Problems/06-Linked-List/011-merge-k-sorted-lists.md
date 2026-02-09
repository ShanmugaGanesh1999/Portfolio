# Merge K Sorted Lists

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 23 | Heap / Divide and Conquer |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Merge k sorted linked lists into one sorted list.

### Constraints & Clarifying Questions
1. **All lists sorted ascending?** Yes.
2. **Empty lists in array?** Yes, skip them.
3. **k = 0?** Return None.
4. **Can modify original lists?** Yes.
5. **Expected complexity?** O(N log k) where N = total nodes.

### Edge Cases
1. **Empty array:** Return None
2. **All lists empty:** Return None
3. **Single list:** Return that list

---

## Phase 2: High-Level Approach

### Option 1: Min Heap
Use heap to always get smallest among k heads.
- **Time:** O(N log k)

### Option 2: Divide and Conquer
Recursively merge pairs of lists.
- **Time:** O(N log k)

**Core Insight:** Both avoid comparing all k heads for each node.

---

## Phase 3: Python Code

```python
import heapq
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def solve(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted lists using min heap.
    
    Args:
        lists: Array of sorted linked list heads
    
    Returns:
        Head of merged sorted list
    """
    # Handle ListNode comparison for heap
    # Store (value, index, node) to handle equal values
    heap = []
    
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:  # O(N log k)
        val, i, node = heapq.heappop(heap)  # O(log k)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))  # O(log k)
    
    return dummy.next


def solve_divide_conquer(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted lists using divide and conquer.
    """
    def merge_two(l1: ListNode, l2: ListNode) -> ListNode:
        """Merge two sorted lists."""
        dummy = ListNode(0)
        curr = dummy
        
        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1
                l1 = l1.next
            else:
                curr.next = l2
                l2 = l2.next
            curr = curr.next
        
        curr.next = l1 or l2
        return dummy.next
    
    if not lists:
        return None
    
    # Pair-wise merge until one list remains
    while len(lists) > 1:  # O(log k) rounds
        merged = []
        for i in range(0, len(lists), 2):  # O(N) per round
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(l1, l2))
        lists = merged
    
    return lists[0]
```

---

## Phase 4: Dry Run

**Input:** `[[1,4,5], [1,3,4], [2,6]]`

**Heap Approach:**

| Step | Heap (val, idx) | Pop | Result |
|------|-----------------|-----|--------|
| init | [(1,0), (1,1), (2,2)] | - | dummy |
| 1 | [(1,1), (2,2), (4,0)] | (1,0) | 1 |
| 2 | [(2,2), (4,0), (3,1)] | (1,1) | 1→1 |
| 3 | [(3,1), (4,0), (6,2)] | (2,2) | 1→1→2 |
| 4 | [(4,0), (6,2), (4,1)] | (3,1) | 1→1→2→3 |
| 5 | [(4,1), (6,2), (5,0)] | (4,0) | 1→1→2→3→4 |
| 6 | [(5,0), (6,2)] | (4,1) | ...→4→4 |
| 7 | [(6,2)] | (5,0) | ...→4→5 |
| 8 | [] | (6,2) | ...→5→6 |

**Result:** `1→1→2→3→4→4→5→6`

---

## Phase 5: Complexity Analysis

### Heap Approach:
- **Time:** O(N log k) - N nodes, each heap operation O(log k)
- **Space:** O(k) - heap size

### Divide and Conquer:
- **Time:** O(N log k) - log k levels, N total work per level
- **Space:** O(log k) for recursion (or O(1) iterative)

---

## Phase 6: Follow-Up Questions

1. **"Why not merge one by one?"**
   → O(kN) time; heap/divide-conquer is O(N log k).

2. **"What if lists are very unequal lengths?"**
   → Both approaches handle naturally; heap always picks smallest.

3. **"Streaming input?"**
   → Heap approach adapts well; can add new lists dynamically.
