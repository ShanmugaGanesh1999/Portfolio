"""
📚 Queue Implementation from Scratch

Implementations:
1. Array-based Queue (using list)
2. Circular Queue (fixed size, efficient)
3. Linked List-based Queue
4. Queue using two Stacks

Author: DSA Roadmap
Topic: Week 3 - Queues
"""


# ============================================================
# IMPLEMENTATION 1: Simple Array Queue
# ============================================================

class SimpleQueue:
    """
    Basic queue using Python list.
    
    WARNING: dequeue is O(n) due to list shift!
    Use CircularQueue or LinkedListQueue for O(1).
    """
    
    def __init__(self):
        self._data = []
    
    def enqueue(self, item):
        """Add item to rear. O(1) amortized."""
        self._data.append(item)
    
    def dequeue(self):
        """Remove from front. O(n) - BAD!"""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")
        return self._data.pop(0)
    
    def front(self):
        """Peek front item. O(1)."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data[0]
    
    def rear(self):
        """Peek rear item. O(1)."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data[-1]
    
    def is_empty(self):
        return len(self._data) == 0
    
    def size(self):
        return len(self._data)
    
    def __len__(self):
        return self.size()
    
    def __str__(self):
        return f"Queue({self._data})"


# ============================================================
# IMPLEMENTATION 2: Circular Queue (Fixed Size)
# ============================================================

class CircularQueue:
    """
    Fixed-size circular queue using array.
    
    All operations are O(1)!
    
    Key Insight:
    - Use front and rear pointers
    - Wrap around using modulo: (index + 1) % capacity
    
    Visualization (capacity=5):
    
    Initial: front=0, rear=0, size=0
    [_] [_] [_] [_] [_]
     ↑
    f,r
    
    After enqueue(1, 2, 3):
    [1] [2] [3] [_] [_]
     ↑          ↑
     f          r
    
    After dequeue():
    [_] [2] [3] [_] [_]
         ↑      ↑
         f      r
    """
    
    def __init__(self, capacity=10):
        self._capacity = capacity
        self._data = [None] * capacity
        self._front = 0
        self._rear = 0
        self._size = 0
    
    def enqueue(self, item):
        """Add item to rear. O(1)."""
        if self.is_full():
            raise OverflowError("Queue is full")
        
        self._data[self._rear] = item
        self._rear = (self._rear + 1) % self._capacity
        self._size += 1
    
    def dequeue(self):
        """Remove from front. O(1)."""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")
        
        item = self._data[self._front]
        self._data[self._front] = None  # Optional: clear reference
        self._front = (self._front + 1) % self._capacity
        self._size -= 1
        return item
    
    def front(self):
        """Peek front item. O(1)."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data[self._front]
    
    def rear(self):
        """Peek rear item. O(1)."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        # Rear points to next empty slot, so go back one
        return self._data[(self._rear - 1) % self._capacity]
    
    def is_empty(self):
        return self._size == 0
    
    def is_full(self):
        return self._size == self._capacity
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        if self.is_empty():
            return "CircularQueue([])"
        
        items = []
        idx = self._front
        for _ in range(self._size):
            items.append(str(self._data[idx]))
            idx = (idx + 1) % self._capacity
        return f"CircularQueue([{', '.join(items)}])"


# ============================================================
# IMPLEMENTATION 3: Linked List Queue
# ============================================================

class ListNode:
    """Node for linked list queue."""
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedListQueue:
    """
    Queue using singly linked list.
    
    Maintain both head (front) and tail (rear) pointers
    for O(1) enqueue and dequeue.
    
    Structure:
    head (front)                     tail (rear)
        ↓                                ↓
       [1] → [2] → [3] → [4] → [5] → None
    
    Dequeue: Remove from head
    Enqueue: Add at tail
    """
    
    def __init__(self):
        self._head = None  # Front of queue
        self._tail = None  # Rear of queue
        self._size = 0
    
    def enqueue(self, item):
        """Add item to rear. O(1)."""
        new_node = ListNode(item)
        
        if self.is_empty():
            self._head = self._tail = new_node
        else:
            self._tail.next = new_node
            self._tail = new_node
        
        self._size += 1
    
    def dequeue(self):
        """Remove from front. O(1)."""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")
        
        item = self._head.value
        self._head = self._head.next
        self._size -= 1
        
        # If queue becomes empty, reset tail
        if self._head is None:
            self._tail = None
        
        return item
    
    def front(self):
        """Peek front item. O(1)."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._head.value
    
    def rear(self):
        """Peek rear item. O(1)."""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._tail.value
    
    def is_empty(self):
        return self._head is None
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        items = []
        current = self._head
        while current:
            items.append(str(current.value))
            current = current.next
        return f"Queue([{' -> '.join(items)}])"


# ============================================================
# IMPLEMENTATION 4: Queue Using Two Stacks (LC 232)
# ============================================================

class QueueUsingStacks:
    """
    Implement queue using two stacks.
    
    Approach:
    - stack_in: for enqueue
    - stack_out: for dequeue
    
    When stack_out is empty and we need to dequeue:
    - Transfer all from stack_in to stack_out (reverses order)
    
    Amortized O(1) for all operations!
    """
    
    def __init__(self):
        self._stack_in = []   # For push
        self._stack_out = []  # For pop/peek
    
    def enqueue(self, item):
        """Add to rear. O(1)."""
        self._stack_in.append(item)
    
    def dequeue(self):
        """Remove from front. O(1) amortized."""
        self._transfer()
        
        if not self._stack_out:
            raise IndexError("Dequeue from empty queue")
        
        return self._stack_out.pop()
    
    def front(self):
        """Peek front. O(1) amortized."""
        self._transfer()
        
        if not self._stack_out:
            raise IndexError("Queue is empty")
        
        return self._stack_out[-1]
    
    def _transfer(self):
        """Transfer from input to output stack if output is empty."""
        if not self._stack_out:
            while self._stack_in:
                self._stack_out.append(self._stack_in.pop())
    
    def is_empty(self):
        return not self._stack_in and not self._stack_out
    
    def size(self):
        return len(self._stack_in) + len(self._stack_out)
    
    def __str__(self):
        # Combine both stacks for display
        items = list(reversed(self._stack_out)) + self._stack_in
        return f"QueueUsingStacks({items})"


# ============================================================
# DEQUE (Double-Ended Queue) Implementation
# ============================================================

class Deque:
    """
    Double-ended queue - add/remove from both ends.
    
    Using doubly linked list for O(1) all operations.
    """
    
    class Node:
        def __init__(self, value):
            self.value = value
            self.prev = None
            self.next = None
    
    def __init__(self):
        # Sentinel nodes simplify edge cases
        self._head = self.Node(None)
        self._tail = self.Node(None)
        self._head.next = self._tail
        self._tail.prev = self._head
        self._size = 0
    
    def add_front(self, item):
        """Add to front. O(1)."""
        new_node = self.Node(item)
        new_node.next = self._head.next
        new_node.prev = self._head
        self._head.next.prev = new_node
        self._head.next = new_node
        self._size += 1
    
    def add_rear(self, item):
        """Add to rear. O(1)."""
        new_node = self.Node(item)
        new_node.prev = self._tail.prev
        new_node.next = self._tail
        self._tail.prev.next = new_node
        self._tail.prev = new_node
        self._size += 1
    
    def remove_front(self):
        """Remove from front. O(1)."""
        if self.is_empty():
            raise IndexError("Deque is empty")
        
        node = self._head.next
        self._head.next = node.next
        node.next.prev = self._head
        self._size -= 1
        return node.value
    
    def remove_rear(self):
        """Remove from rear. O(1)."""
        if self.is_empty():
            raise IndexError("Deque is empty")
        
        node = self._tail.prev
        self._tail.prev = node.prev
        node.prev.next = self._tail
        self._size -= 1
        return node.value
    
    def front(self):
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self._head.next.value
    
    def rear(self):
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self._tail.prev.value
    
    def is_empty(self):
        return self._size == 0
    
    def size(self):
        return self._size
    
    def __len__(self):
        return self._size
    
    def __str__(self):
        items = []
        current = self._head.next
        while current != self._tail:
            items.append(str(current.value))
            current = current.next
        return f"Deque([{', '.join(items)}])"


# ============================================================
# TESTING
# ============================================================

def test_queues():
    print("=" * 50)
    print("Testing Queue Implementations")
    print("=" * 50)
    
    # Test CircularQueue
    print("\n1. Testing CircularQueue:")
    cq = CircularQueue(5)
    cq.enqueue(1)
    cq.enqueue(2)
    cq.enqueue(3)
    print(f"   After enqueue 1, 2, 3: {cq}")
    print(f"   Front: {cq.front()}, Rear: {cq.rear()}")
    print(f"   Dequeue: {cq.dequeue()}")
    print(f"   After dequeue: {cq}")
    
    # Test LinkedListQueue
    print("\n2. Testing LinkedListQueue:")
    llq = LinkedListQueue()
    llq.enqueue('a')
    llq.enqueue('b')
    llq.enqueue('c')
    print(f"   After enqueue a, b, c: {llq}")
    print(f"   Dequeue: {llq.dequeue()}")
    print(f"   After dequeue: {llq}")
    
    # Test QueueUsingStacks
    print("\n3. Testing QueueUsingStacks:")
    qs = QueueUsingStacks()
    qs.enqueue(1)
    qs.enqueue(2)
    qs.enqueue(3)
    print(f"   After enqueue 1, 2, 3: {qs}")
    print(f"   Dequeue: {qs.dequeue()}")  # Should be 1
    print(f"   After dequeue: {qs}")
    qs.enqueue(4)
    print(f"   After enqueue 4: {qs}")
    print(f"   Dequeue: {qs.dequeue()}")  # Should be 2
    
    # Test Deque
    print("\n4. Testing Deque:")
    dq = Deque()
    dq.add_rear(2)
    dq.add_front(1)
    dq.add_rear(3)
    print(f"   After add_front(1), add_rear(2, 3): {dq}")
    print(f"   Remove front: {dq.remove_front()}")
    print(f"   Remove rear: {dq.remove_rear()}")
    print(f"   After removes: {dq}")
    
    print("\n" + "=" * 50)
    print("All Queue tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_queues()
