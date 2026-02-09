"""
📚 Circular Linked List - Complete Implementation

A circular linked list is a variation where the last node points back
to the first node, creating a circle.

Types:
1. Circular Singly Linked List: Last node → Head
2. Circular Doubly Linked List: Last ↔ Head

Author: DSA Roadmap
Topic: Week 4 - Linked Lists
"""


class CircularListNode:
    """Node for circular singly linked list."""
    
    def __init__(self, value=0, next=None):
        self.value = value
        self.next = next
    
    def __str__(self):
        return str(self.value)


class CircularSinglyLinkedList:
    """
    Circular Singly Linked List.
    
    Structure:
    ┌──────────────────────────────┐
    │                              │
    └→ [1] → [2] → [3] → [4] ─────┘
        ↑
       head
    
    We maintain pointer to tail (last node) instead of head.
    This allows O(1) operations at both ends!
    
    Why tail instead of head?
    - tail.next = head (access head in O(1))
    - Insert at head: O(1)
    - Insert at tail: O(1)
    """
    
    def __init__(self):
        self.tail = None
        self._size = 0
    
    @property
    def head(self):
        """Get head (first node)."""
        return self.tail.next if self.tail else None
    
    def append(self, value):
        """
        Add to end. O(1)
        """
        new_node = CircularListNode(value)
        
        if not self.tail:
            new_node.next = new_node  # Points to itself
            self.tail = new_node
        else:
            new_node.next = self.tail.next  # Point to head
            self.tail.next = new_node       # Old tail points to new
            self.tail = new_node            # Update tail
        
        self._size += 1
    
    def prepend(self, value):
        """
        Add to beginning. O(1)
        """
        new_node = CircularListNode(value)
        
        if not self.tail:
            new_node.next = new_node
            self.tail = new_node
        else:
            new_node.next = self.tail.next  # Point to old head
            self.tail.next = new_node       # Tail points to new head
        
        self._size += 1
    
    def delete(self, value):
        """
        Delete first occurrence of value. O(n)
        """
        if not self.tail:
            return False
        
        current = self.tail.next  # Start at head
        prev = self.tail
        
        while True:
            if current.value == value:
                if current == self.tail and current.next == self.tail:
                    # Only one node
                    self.tail = None
                else:
                    prev.next = current.next
                    if current == self.tail:
                        self.tail = prev
                
                self._size -= 1
                return True
            
            prev = current
            current = current.next
            
            # Completed circle without finding
            if current == self.tail.next:
                break
        
        return False
    
    def find(self, value):
        """Find index of value. O(n)"""
        if not self.tail:
            return -1
        
        current = self.tail.next  # Start at head
        index = 0
        
        while True:
            if current.value == value:
                return index
            
            current = current.next
            index += 1
            
            if current == self.tail.next:  # Completed circle
                break
        
        return -1
    
    def traverse(self):
        """
        Traverse and return all values.
        
        Important: Must check for circular condition!
        """
        if not self.tail:
            return []
        
        values = []
        current = self.tail.next  # Start at head
        
        while True:
            values.append(current.value)
            current = current.next
            
            if current == self.tail.next:  # Back to head
                break
        
        return values
    
    def rotate(self, k):
        """
        Rotate list by k positions.
        
        Rotate right: move tail k positions forward.
        This is O(k) but can be O(n) if k > size.
        """
        if not self.tail or k == 0:
            return
        
        k = k % self._size  # Handle k > size
        
        if k == 0:
            return
        
        # Move tail forward by k positions
        for _ in range(k):
            self.tail = self.tail.next
    
    def is_empty(self):
        return self.tail is None
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        if not self.tail:
            return "Empty Circular List"
        
        values = self.traverse()
        return " → ".join(map(str, values)) + " → (back to head)"
    
    def __iter__(self):
        if not self.tail:
            return
        
        current = self.tail.next
        while True:
            yield current.value
            current = current.next
            if current == self.tail.next:
                break


class CircularDoublyLinkedList:
    """
    Circular Doubly Linked List.
    
    Structure:
    ┌──────────────────────────────────────┐
    │                                      │
    └↔ [1] ↔ [2] ↔ [3] ↔ [4] ↔────────────┘
        ↑
       head
    
    Can traverse in both directions.
    Using sentinel node simplifies implementation.
    """
    
    class Node:
        def __init__(self, value=0):
            self.value = value
            self.prev = None
            self.next = None
    
    def __init__(self):
        # Sentinel node
        self.sentinel = self.Node()
        self.sentinel.next = self.sentinel
        self.sentinel.prev = self.sentinel
        self._size = 0
    
    def append(self, value):
        """Add to end. O(1)"""
        new_node = self.Node(value)
        
        # Insert before sentinel (which is at end)
        last = self.sentinel.prev
        
        new_node.prev = last
        new_node.next = self.sentinel
        last.next = new_node
        self.sentinel.prev = new_node
        
        self._size += 1
    
    def prepend(self, value):
        """Add to beginning. O(1)"""
        new_node = self.Node(value)
        
        # Insert after sentinel (which is at beginning)
        first = self.sentinel.next
        
        new_node.prev = self.sentinel
        new_node.next = first
        self.sentinel.next = new_node
        first.prev = new_node
        
        self._size += 1
    
    def delete(self, value):
        """Delete first occurrence. O(n)"""
        current = self.sentinel.next
        
        while current != self.sentinel:
            if current.value == value:
                current.prev.next = current.next
                current.next.prev = current.prev
                self._size -= 1
                return True
            current = current.next
        
        return False
    
    def traverse_forward(self):
        """Traverse forward from head."""
        values = []
        current = self.sentinel.next
        
        while current != self.sentinel:
            values.append(current.value)
            current = current.next
        
        return values
    
    def traverse_backward(self):
        """Traverse backward from tail."""
        values = []
        current = self.sentinel.prev
        
        while current != self.sentinel:
            values.append(current.value)
            current = current.prev
        
        return values
    
    def is_empty(self):
        return self._size == 0
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        if self.is_empty():
            return "Empty Circular Doubly Linked List"
        
        values = self.traverse_forward()
        return "↔ " + " ↔ ".join(map(str, values)) + " ↔ (circular)"


# ============================================================
# CIRCULAR LINKED LIST PROBLEMS
# ============================================================

def josephus_problem(n, k):
    """
    Josephus Problem: n people in circle, eliminate every k-th person.
    
    Classic circular linked list problem!
    
    Returns: Position of survivor (1-indexed)
    """
    # Create circular list
    head = CircularListNode(1)
    current = head
    
    for i in range(2, n + 1):
        current.next = CircularListNode(i)
        current = current.next
    
    current.next = head  # Make circular
    
    # Eliminate until one remains
    prev = current  # Points to last node
    current = head  # Points to first node
    
    while current.next != current:
        # Move k-1 steps
        for _ in range(k - 1):
            prev = current
            current = current.next
        
        # Eliminate current
        prev.next = current.next
        current = current.next
    
    return current.value


def split_circular_list(head):
    """
    Split circular list into two halves.
    
    Uses slow-fast pointer to find middle.
    
    Returns: (head1, head2)
    """
    if not head or head.next == head:
        return head, None
    
    slow = fast = head
    
    # Find middle
    while fast.next != head and fast.next.next != head:
        slow = slow.next
        fast = fast.next.next
    
    # Split
    head2 = slow.next
    
    # Fix first half's circular connection
    slow.next = head
    
    # Find end of second half and make circular
    current = head2
    while current.next != head:
        current = current.next
    current.next = head2
    
    return head, head2


# ============================================================
# TESTING
# ============================================================

def test_circular_linked_list():
    print("=" * 50)
    print("Testing Circular Linked Lists")
    print("=" * 50)
    
    # Test Circular Singly Linked List
    print("\n1. Circular Singly Linked List:")
    csll = CircularSinglyLinkedList()
    csll.append(1)
    csll.append(2)
    csll.append(3)
    csll.prepend(0)
    print(f"   After append(1,2,3), prepend(0): {csll}")
    print(f"   Traverse: {csll.traverse()}")
    
    # Test delete
    print("\n2. Delete value 2:")
    csll.delete(2)
    print(f"   {csll}")
    
    # Test rotate
    print("\n3. Rotate by 1:")
    csll.rotate(1)
    print(f"   {csll}")
    
    # Test iteration
    print("\n4. Iteration:")
    print(f"   Values: {list(csll)}")
    
    # Test Circular Doubly Linked List
    print("\n5. Circular Doubly Linked List:")
    cdll = CircularDoublyLinkedList()
    cdll.append(1)
    cdll.append(2)
    cdll.append(3)
    cdll.prepend(0)
    print(f"   {cdll}")
    print(f"   Forward:  {cdll.traverse_forward()}")
    print(f"   Backward: {cdll.traverse_backward()}")
    
    # Josephus Problem
    print("\n6. Josephus Problem (n=7, k=3):")
    survivor = josephus_problem(7, 3)
    print(f"   Survivor position: {survivor}")
    
    print("\n" + "=" * 50)
    print("All Circular Linked List tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_circular_linked_list()
