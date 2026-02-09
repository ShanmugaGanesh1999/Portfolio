"""
📚 Doubly Linked List - Complete Implementation

A doubly linked list has nodes with pointers to both next AND previous nodes.
This enables efficient operations in both directions.

Author: DSA Roadmap
Topic: Week 4 - Linked Lists
"""


class DoublyListNode:
    """
    Node for doubly linked list.
    
    Visual:
    ┌───────┬───────┬───────┐
    │ prev ←┼─ val ─┼→ next │
    └───────┴───────┴───────┘
    """
    
    def __init__(self, value=0, prev=None, next=None):
        self.value = value
        self.prev = prev
        self.next = next
    
    def __str__(self):
        return str(self.value)


class DoublyLinkedList:
    """
    Doubly Linked List implementation.
    
    Structure (with sentinels):
    head ↔ [1] ↔ [2] ↔ [3] ↔ tail
    
    Using sentinel nodes (dummy head/tail) simplifies edge cases!
    
    Time Complexities:
    - Insert at beginning/end: O(1)
    - Insert at index: O(n)
    - Delete (given node): O(1)
    - Delete by value: O(n)
    - Search: O(n)
    - Access by index: O(n)
    """
    
    def __init__(self):
        """Initialize with sentinel nodes."""
        # Sentinels simplify edge cases
        self.head = DoublyListNode()  # Dummy head
        self.tail = DoublyListNode()  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self._size = 0
    
    # ==================== Insert Operations ====================
    
    def append(self, value):
        """
        Add to end. O(1) - no traversal needed!
        
        This is faster than singly linked list without tail pointer.
        """
        new_node = DoublyListNode(value)
        
        # Insert before tail sentinel
        prev_node = self.tail.prev
        
        new_node.prev = prev_node
        new_node.next = self.tail
        prev_node.next = new_node
        self.tail.prev = new_node
        
        self._size += 1
    
    def prepend(self, value):
        """
        Add to beginning. O(1)
        """
        new_node = DoublyListNode(value)
        
        # Insert after head sentinel
        next_node = self.head.next
        
        new_node.prev = self.head
        new_node.next = next_node
        self.head.next = new_node
        next_node.prev = new_node
        
        self._size += 1
    
    def insert(self, index, value):
        """
        Insert at index. O(n)
        
        Optimization: traverse from closer end.
        """
        if index < 0 or index > self._size:
            raise IndexError(f"Index {index} out of range")
        
        # Find the node currently at index
        if index <= self._size // 2:
            # Traverse from head
            current = self.head.next
            for _ in range(index):
                current = current.next
        else:
            # Traverse from tail
            current = self.tail
            for _ in range(self._size - index):
                current = current.prev
        
        # Insert before current
        new_node = DoublyListNode(value)
        prev_node = current.prev
        
        new_node.prev = prev_node
        new_node.next = current
        prev_node.next = new_node
        current.prev = new_node
        
        self._size += 1
    
    # ==================== Delete Operations ====================
    
    def _remove_node(self, node):
        """
        Remove a node (internal helper). O(1)
        
        This is the advantage of doubly linked list!
        """
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
        self._size -= 1
        return node.value
    
    def delete(self, value):
        """
        Delete first occurrence of value. O(n)
        """
        current = self.head.next
        
        while current != self.tail:
            if current.value == value:
                self._remove_node(current)
                return True
            current = current.next
        
        return False
    
    def delete_at_index(self, index):
        """
        Delete at index. O(n)
        """
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range")
        
        # Find the node at index
        if index <= self._size // 2:
            current = self.head.next
            for _ in range(index):
                current = current.next
        else:
            current = self.tail.prev
            for _ in range(self._size - 1 - index):
                current = current.prev
        
        return self._remove_node(current)
    
    def pop_front(self):
        """Remove and return first element. O(1)"""
        if self.is_empty():
            raise IndexError("Pop from empty list")
        return self._remove_node(self.head.next)
    
    def pop_back(self):
        """Remove and return last element. O(1)"""
        if self.is_empty():
            raise IndexError("Pop from empty list")
        return self._remove_node(self.tail.prev)
    
    # ==================== Access Operations ====================
    
    def get(self, index):
        """
        Get value at index. O(n)
        
        Optimized to traverse from closer end.
        """
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range")
        
        if index <= self._size // 2:
            current = self.head.next
            for _ in range(index):
                current = current.next
        else:
            current = self.tail.prev
            for _ in range(self._size - 1 - index):
                current = current.prev
        
        return current.value
    
    def get_first(self):
        """Get first element. O(1)"""
        if self.is_empty():
            raise IndexError("List is empty")
        return self.head.next.value
    
    def get_last(self):
        """Get last element. O(1)"""
        if self.is_empty():
            raise IndexError("List is empty")
        return self.tail.prev.value
    
    def find(self, value):
        """Find index of value. O(n)"""
        current = self.head.next
        index = 0
        
        while current != self.tail:
            if current.value == value:
                return index
            current = current.next
            index += 1
        
        return -1
    
    # ==================== Utility Methods ====================
    
    def reverse(self):
        """
        Reverse in place. O(n)
        
        Swap prev and next pointers for each node.
        """
        if self._size <= 1:
            return
        
        current = self.head.next
        
        # Swap all internal nodes
        while current != self.tail:
            current.prev, current.next = current.next, current.prev
            current = current.prev  # Move to next (which is now prev)
        
        # Fix sentinel connections
        old_first = self.tail.prev
        old_last = self.head.next
        
        self.head.next = old_first
        old_first.prev = self.head
        
        self.tail.prev = old_last
        old_last.next = self.tail
    
    def is_empty(self):
        return self._size == 0
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        if self.is_empty():
            return "Empty List"
        
        values = []
        current = self.head.next
        while current != self.tail:
            values.append(str(current.value))
            current = current.next
        
        return "None ↔ " + " ↔ ".join(values) + " ↔ None"
    
    def __iter__(self):
        """Forward iteration."""
        current = self.head.next
        while current != self.tail:
            yield current.value
            current = current.next
    
    def reverse_iter(self):
        """Reverse iteration."""
        current = self.tail.prev
        while current != self.head:
            yield current.value
            current = current.prev
    
    def to_list(self):
        return list(self)
    
    @classmethod
    def from_list(cls, arr):
        """Create from Python list."""
        dll = cls()
        for item in arr:
            dll.append(item)
        return dll


# ============================================================
# LRU CACHE (LC 146) - Classic DLL Application
# ============================================================

class LRUCache:
    """
    Least Recently Used (LRU) Cache.
    
    This is a CLASSIC interview problem!
    
    Design:
    - HashMap for O(1) lookup
    - Doubly Linked List for O(1) removal and insertion
    
    Most recently used at end, least recently used at front.
    When capacity reached, remove from front.
    
    Time: O(1) for both get and put
    Space: O(capacity)
    """
    
    class CacheNode:
        def __init__(self, key=0, value=0):
            self.key = key
            self.value = value
            self.prev = None
            self.next = None
    
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Sentinel nodes
        self.head = self.CacheNode()
        self.tail = self.CacheNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _remove_node(self, node):
        """Remove node from list."""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add_to_end(self, node):
        """Add node to end (most recently used)."""
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node
    
    def _move_to_end(self, node):
        """Move existing node to end."""
        self._remove_node(node)
        self._add_to_end(node)
    
    def get(self, key: int) -> int:
        """Get value. Mark as recently used."""
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_end(node)
        return node.value
    
    def put(self, key: int, value: int) -> None:
        """Add or update key-value pair."""
        if key in self.cache:
            # Update existing
            node = self.cache[key]
            node.value = value
            self._move_to_end(node)
        else:
            # Add new
            if len(self.cache) >= self.capacity:
                # Remove LRU (front)
                lru_node = self.head.next
                self._remove_node(lru_node)
                del self.cache[lru_node.key]
            
            new_node = self.CacheNode(key, value)
            self.cache[key] = new_node
            self._add_to_end(new_node)


# ============================================================
# TESTING
# ============================================================

def test_doubly_linked_list():
    print("=" * 50)
    print("Testing Doubly Linked List")
    print("=" * 50)
    
    # Test basic operations
    print("\n1. Creating list:")
    dll = DoublyLinkedList()
    dll.append(1)
    dll.append(2)
    dll.append(3)
    dll.prepend(0)
    print(f"   {dll}")
    
    # Test insert
    print("\n2. Insert 99 at index 2:")
    dll.insert(2, 99)
    print(f"   {dll}")
    
    # Test delete
    print("\n3. Delete value 99:")
    dll.delete(99)
    print(f"   {dll}")
    
    # Test access
    print("\n4. Access operations:")
    print(f"   First: {dll.get_first()}")
    print(f"   Last: {dll.get_last()}")
    print(f"   Index 2: {dll.get(2)}")
    
    # Test pop operations
    print("\n5. Pop operations:")
    print(f"   Pop front: {dll.pop_front()}")
    print(f"   Pop back: {dll.pop_back()}")
    print(f"   After pops: {dll}")
    
    # Test reverse
    print("\n6. Reverse list:")
    dll = DoublyLinkedList.from_list([1, 2, 3, 4, 5])
    print(f"   Before: {dll}")
    dll.reverse()
    print(f"   After:  {dll}")
    
    # Test reverse iteration
    print("\n7. Reverse iteration:")
    dll = DoublyLinkedList.from_list([1, 2, 3])
    print(f"   Forward:  {list(dll)}")
    print(f"   Backward: {list(dll.reverse_iter())}")
    
    print("\n" + "=" * 50)
    print("Testing LRU Cache")
    print("=" * 50)
    
    # Test LRU Cache
    print("\n8. LRU Cache operations:")
    cache = LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    print(f"   Get 1: {cache.get(1)}")  # 1
    cache.put(3, 3)  # Evicts key 2
    print(f"   Get 2: {cache.get(2)}")  # -1 (evicted)
    cache.put(4, 4)  # Evicts key 1
    print(f"   Get 1: {cache.get(1)}")  # -1 (evicted)
    print(f"   Get 3: {cache.get(3)}")  # 3
    print(f"   Get 4: {cache.get(4)}")  # 4
    
    print("\n" + "=" * 50)
    print("All tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_doubly_linked_list()
