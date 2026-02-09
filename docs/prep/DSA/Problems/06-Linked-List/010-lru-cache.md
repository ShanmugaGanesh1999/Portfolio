# LRU Cache

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 146 | Hash Map + Doubly Linked List |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design Least Recently Used cache with O(1) get and put operations.

### Constraints & Clarifying Questions
1. **Capacity always positive?** Yes.
2. **What operations?** get(key), put(key, value).
3. **get non-existent key?** Return -1.
4. **put updates existing?** Yes, and marks as recently used.
5. **Eviction policy?** Remove least recently used when full.

### Edge Cases
1. **Capacity 1:** Each put evicts previous
2. **Get updates recency:** Accessed item moves to front
3. **Put existing key:** Update value and recency

---

## Phase 2: High-Level Approach

### Approach: HashMap + Doubly Linked List
- HashMap: key → node (O(1) lookup)
- Doubly Linked List: maintains usage order (O(1) add/remove)

**Core Insight:** Need O(1) for both lookup (hash map) and ordering (doubly linked list with head/tail pointers).

---

## Phase 3: Python Code

```python
class ListNode:
    def __init__(self, key: int = 0, val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    """
    LRU Cache with O(1) get and put.
    """
    
    def __init__(self, capacity: int):
        """Initialize cache with given capacity."""
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail for easy manipulation
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove(self, node: ListNode) -> None:
        """Remove node from doubly linked list. O(1)"""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def _add_to_front(self, node: ListNode) -> None:
        """Add node right after head (most recent). O(1)"""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
    
    def get(self, key: int) -> int:
        """
        Get value for key, mark as recently used. O(1)
        """
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        
        # Move to front (most recently used)
        self._remove(node)
        self._add_to_front(node)
        
        return node.val
    
    def put(self, key: int, value: int) -> None:
        """
        Insert or update key-value pair. O(1)
        """
        if key in self.cache:
            # Update existing
            node = self.cache[key]
            node.val = value
            self._remove(node)
            self._add_to_front(node)
        else:
            # Insert new
            if len(self.cache) >= self.capacity:
                # Evict LRU (node before tail)
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
            
            # Add new node
            new_node = ListNode(key, value)
            self.cache[key] = new_node
            self._add_to_front(new_node)


# Alternative using Python's OrderedDict
from collections import OrderedDict

class LRUCacheOrdered:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

---

## Phase 4: Dry Run

**Operations:** LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)

| Operation | Cache | List (head→tail) | Return |
|-----------|-------|------------------|--------|
| init(2) | {} | head↔tail | - |
| put(1,1) | {1:n1} | head↔1↔tail | - |
| put(2,2) | {1:n1, 2:n2} | head↔2↔1↔tail | - |
| get(1) | same | head↔1↔2↔tail | 1 |
| put(3,3) | {1:n1, 3:n3} | head↔3↔1↔tail (evict 2) | - |
| get(2) | same | same | -1 |

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
- get: Hash lookup + list remove/add = O(1)
- put: Hash operations + list operations = O(1)

### Space Complexity: O(capacity)
Stores at most `capacity` nodes.

---

## Phase 6: Follow-Up Questions

1. **"What about LFU Cache?"**
   → Track frequency counts; evict least frequently used (with LRU as tiebreaker).

2. **"Thread-safe version?"**
   → Add locks around operations; or use concurrent data structures.

3. **"What if we need TTL (time-to-live)?"**
   → Store timestamp with each entry; check expiration on access; use lazy or active cleanup.
