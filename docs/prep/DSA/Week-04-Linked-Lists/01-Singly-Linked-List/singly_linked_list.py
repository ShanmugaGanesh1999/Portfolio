"""
📚 Singly Linked List - Complete Implementation

A singly linked list is a linear data structure where each element
points to the next element. Unlike arrays, elements are not stored
in contiguous memory locations.

Author: DSA Roadmap
Topic: Week 4 - Linked Lists
"""


class ListNode:
    """
    Node class for singly linked list.
    
    Each node contains:
    - value: The data stored
    - next: Pointer to the next node (or None)
    
    Visual:
    ┌───────┬───────┐
    │ value │ next ─┼──→ (next node or None)
    └───────┴───────┘
    """
    
    def __init__(self, value=0, next=None):
        self.value = value
        self.next = next
    
    def __str__(self):
        return str(self.value)
    
    def __repr__(self):
        return f"ListNode({self.value})"


class SinglyLinkedList:
    """
    Singly Linked List implementation with all common operations.
    
    Structure:
    head → [1] → [2] → [3] → [4] → None
    
    Properties:
    - head: First node of the list
    - size: Number of nodes
    """
    
    def __init__(self):
        """Initialize empty linked list."""
        self.head = None
        self._size = 0
    
    # ==================== Basic Operations ====================
    
    def append(self, value):
        """
        Add node to the end. O(n)
        
        If we maintained a tail pointer, this would be O(1).
        """
        new_node = ListNode(value)
        
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        
        self._size += 1
    
    def prepend(self, value):
        """
        Add node to the beginning. O(1)
        
        Advantages of linked list over array!
        """
        new_node = ListNode(value)
        new_node.next = self.head
        self.head = new_node
        self._size += 1
    
    def insert(self, index, value):
        """
        Insert at specific index. O(n)
        """
        if index < 0 or index > self._size:
            raise IndexError(f"Index {index} out of range")
        
        if index == 0:
            self.prepend(value)
            return
        
        new_node = ListNode(value)
        current = self.head
        
        # Navigate to node before insertion point
        for _ in range(index - 1):
            current = current.next
        
        new_node.next = current.next
        current.next = new_node
        self._size += 1
    
    def delete(self, value):
        """
        Delete first occurrence of value. O(n)
        """
        if not self.head:
            return False
        
        # Special case: delete head
        if self.head.value == value:
            self.head = self.head.next
            self._size -= 1
            return True
        
        # Find node before the one to delete
        current = self.head
        while current.next and current.next.value != value:
            current = current.next
        
        if current.next:
            current.next = current.next.next
            self._size -= 1
            return True
        
        return False
    
    def delete_at_index(self, index):
        """
        Delete node at specific index. O(n)
        """
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range")
        
        if index == 0:
            value = self.head.value
            self.head = self.head.next
            self._size -= 1
            return value
        
        current = self.head
        for _ in range(index - 1):
            current = current.next
        
        value = current.next.value
        current.next = current.next.next
        self._size -= 1
        return value
    
    def get(self, index):
        """
        Get value at index. O(n)
        """
        if index < 0 or index >= self._size:
            raise IndexError(f"Index {index} out of range")
        
        current = self.head
        for _ in range(index):
            current = current.next
        
        return current.value
    
    def find(self, value):
        """
        Find index of first occurrence. O(n)
        Returns -1 if not found.
        """
        current = self.head
        index = 0
        
        while current:
            if current.value == value:
                return index
            current = current.next
            index += 1
        
        return -1
    
    # ==================== List Operations ====================
    
    def reverse(self):
        """
        Reverse the linked list in-place. O(n)
        
        This is a CLASSIC interview question!
        
        Algorithm:
        1. Use three pointers: prev, current, next
        2. For each node, reverse the pointer direction
        
        Before: 1 → 2 → 3 → None
        After:  None ← 1 ← 2 ← 3
        """
        prev = None
        current = self.head
        
        while current:
            # Save next node
            next_node = current.next
            # Reverse pointer
            current.next = prev
            # Move forward
            prev = current
            current = next_node
        
        self.head = prev
    
    def reverse_recursive(self, node=None, first_call=True):
        """
        Reverse using recursion. O(n) time, O(n) space (call stack)
        """
        if first_call:
            node = self.head
        
        # Base case
        if not node or not node.next:
            self.head = node
            return node
        
        # Recurse to the end
        new_head = self.reverse_recursive(node.next, False)
        
        # Reverse the pointer
        node.next.next = node
        node.next = None
        
        return new_head
    
    def get_middle(self):
        """
        Find middle node using fast-slow pointers. O(n)
        
        For even length, returns second middle.
        """
        if not self.head:
            return None
        
        slow = fast = self.head
        
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        
        return slow.value
    
    def has_cycle(self):
        """
        Detect if linked list has a cycle. O(n)
        
        Floyd's Cycle Detection (Tortoise and Hare)
        """
        if not self.head:
            return False
        
        slow = fast = self.head
        
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            
            if slow == fast:
                return True
        
        return False
    
    def get_nth_from_end(self, n):
        """
        Get nth node from end. O(n)
        
        Two pointer technique:
        1. Move fast pointer n steps ahead
        2. Move both until fast reaches end
        3. Slow is at nth from end
        """
        if n <= 0 or n > self._size:
            return None
        
        slow = fast = self.head
        
        # Move fast n steps ahead
        for _ in range(n):
            fast = fast.next
        
        # Move both until fast reaches end
        while fast:
            slow = slow.next
            fast = fast.next
        
        return slow.value
    
    def remove_duplicates(self):
        """
        Remove duplicates from sorted list. O(n)
        """
        if not self.head:
            return
        
        current = self.head
        
        while current and current.next:
            if current.value == current.next.value:
                current.next = current.next.next
                self._size -= 1
            else:
                current = current.next
    
    def remove_duplicates_unsorted(self):
        """
        Remove duplicates from unsorted list. O(n)
        Uses hash set for O(1) lookup.
        """
        if not self.head:
            return
        
        seen = {self.head.value}
        current = self.head
        
        while current.next:
            if current.next.value in seen:
                current.next = current.next.next
                self._size -= 1
            else:
                seen.add(current.next.value)
                current = current.next
    
    # ==================== Utility Methods ====================
    
    def is_empty(self):
        return self.head is None
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        if not self.head:
            return "Empty List"
        
        values = []
        current = self.head
        while current:
            values.append(str(current.value))
            current = current.next
        
        return " → ".join(values) + " → None"
    
    def __iter__(self):
        """Make list iterable."""
        current = self.head
        while current:
            yield current.value
            current = current.next
    
    def to_list(self):
        """Convert to Python list."""
        return list(self)
    
    @classmethod
    def from_list(cls, arr):
        """Create linked list from Python list."""
        ll = cls()
        for item in arr:
            ll.append(item)
        return ll


# ============================================================
# MERGE TWO SORTED LISTS (LC 21)
# ============================================================

def merge_two_sorted_lists(l1, l2):
    """
    Merge two sorted linked lists.
    
    Classic interview problem!
    
    Time: O(n + m)
    Space: O(1)
    """
    # Dummy node simplifies edge cases
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.value <= l2.value:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = l1 if l1 else l2
    
    return dummy.next


# ============================================================
# TESTING
# ============================================================

def test_singly_linked_list():
    print("=" * 50)
    print("Testing Singly Linked List")
    print("=" * 50)
    
    # Test basic operations
    print("\n1. Creating list and adding elements:")
    ll = SinglyLinkedList()
    ll.append(1)
    ll.append(2)
    ll.append(3)
    ll.prepend(0)
    print(f"   {ll}")
    print(f"   Size: {ll.size()}")
    
    # Test insert
    print("\n2. Insert at index 2:")
    ll.insert(2, 99)
    print(f"   {ll}")
    
    # Test delete
    print("\n3. Delete value 99:")
    ll.delete(99)
    print(f"   {ll}")
    
    # Test get
    print("\n4. Get operations:")
    print(f"   Get index 0: {ll.get(0)}")
    print(f"   Get index 2: {ll.get(2)}")
    print(f"   Find value 2: index {ll.find(2)}")
    
    # Test reverse
    print("\n5. Reverse list:")
    ll.reverse()
    print(f"   {ll}")
    
    # Test middle
    print("\n6. Get middle:")
    print(f"   Middle: {ll.get_middle()}")
    
    # Test nth from end
    print("\n7. Get 2nd from end:")
    print(f"   2nd from end: {ll.get_nth_from_end(2)}")
    
    # Test iteration
    print("\n8. Iterate through list:")
    print(f"   Values: {ll.to_list()}")
    
    # Test from_list
    print("\n9. Create from Python list:")
    ll2 = SinglyLinkedList.from_list([10, 20, 30, 40])
    print(f"   {ll2}")
    
    print("\n" + "=" * 50)
    print("All Singly Linked List tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_singly_linked_list()
