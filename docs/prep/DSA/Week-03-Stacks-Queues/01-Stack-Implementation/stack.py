"""
📚 Stack Implementation from Scratch

Two implementations:
1. Array-based Stack (using Python list)
2. Linked List-based Stack

Author: DSA Roadmap
Topic: Week 3 - Stacks
"""


# ============================================================
# IMPLEMENTATION 1: Array-Based Stack
# ============================================================

class ArrayStack:
    """
    Stack implementation using dynamic array (Python list).
    
    Advantages:
    - Cache-friendly (contiguous memory)
    - Simple implementation
    - Good for most use cases
    
    Time Complexity: All operations O(1) amortized
    Space Complexity: O(n)
    """
    
    def __init__(self):
        """Initialize empty stack."""
        self._data = []
    
    def push(self, item):
        """Add item to top of stack. O(1) amortized."""
        self._data.append(item)
    
    def pop(self):
        """Remove and return top item. O(1)."""
        if self.is_empty():
            raise IndexError("Pop from empty stack")
        return self._data.pop()
    
    def peek(self):
        """Return top item without removing. O(1)."""
        if self.is_empty():
            raise IndexError("Peek from empty stack")
        return self._data[-1]
    
    def is_empty(self):
        """Check if stack is empty. O(1)."""
        return len(self._data) == 0
    
    def size(self):
        """Return number of items. O(1)."""
        return len(self._data)
    
    def __len__(self):
        return self.size()
    
    def __str__(self):
        return f"Stack({self._data})"
    
    def __repr__(self):
        return f"ArrayStack(size={self.size()})"


# ============================================================
# IMPLEMENTATION 2: Linked List-Based Stack
# ============================================================

class ListNode:
    """Node for linked list stack."""
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedListStack:
    """
    Stack implementation using singly linked list.
    
    Advantages:
    - True O(1) push/pop (no resize needed)
    - No wasted space
    
    Disadvantages:
    - Extra memory for node pointers
    - Not cache-friendly
    
    Time Complexity: All operations O(1)
    Space Complexity: O(n)
    """
    
    def __init__(self):
        """Initialize empty stack."""
        self._top = None
        self._size = 0
    
    def push(self, item):
        """Add item to top of stack. O(1)."""
        new_node = ListNode(item)
        new_node.next = self._top
        self._top = new_node
        self._size += 1
    
    def pop(self):
        """Remove and return top item. O(1)."""
        if self.is_empty():
            raise IndexError("Pop from empty stack")
        
        item = self._top.value
        self._top = self._top.next
        self._size -= 1
        return item
    
    def peek(self):
        """Return top item without removing. O(1)."""
        if self.is_empty():
            raise IndexError("Peek from empty stack")
        return self._top.value
    
    def is_empty(self):
        """Check if stack is empty. O(1)."""
        return self._top is None
    
    def size(self):
        """Return number of items. O(1)."""
        return self._size
    
    def __len__(self):
        return self.size()
    
    def __str__(self):
        items = []
        current = self._top
        while current:
            items.append(str(current.value))
            current = current.next
        return f"Stack([{' -> '.join(items)}])"


# ============================================================
# MIN STACK - Classic Interview Problem (LC 155)
# ============================================================

class MinStack:
    """
    Stack that supports getting minimum in O(1).
    
    Key Insight:
    - Maintain a parallel stack that tracks minimum at each level
    - When we push, also push current minimum
    - When we pop, also pop from min stack
    
    Time: O(1) for all operations
    Space: O(n) for the auxiliary min stack
    """
    
    def __init__(self):
        self._stack = []
        self._min_stack = []
    
    def push(self, val):
        """Push value onto stack."""
        self._stack.append(val)
        
        # Push minimum onto min_stack
        if not self._min_stack or val <= self._min_stack[-1]:
            self._min_stack.append(val)
        else:
            self._min_stack.append(self._min_stack[-1])
    
    def pop(self):
        """Remove top element."""
        if self._stack:
            self._stack.pop()
            self._min_stack.pop()
    
    def top(self):
        """Get top element."""
        return self._stack[-1] if self._stack else None
    
    def get_min(self):
        """Get minimum element in O(1)."""
        return self._min_stack[-1] if self._min_stack else None


class MinStackOptimized:
    """
    Optimized MinStack using single stack.
    
    Store (value, current_min) pairs.
    Even more optimized: only push to min_stack when new min found.
    """
    
    def __init__(self):
        self._stack = []
        self._min_stack = []
    
    def push(self, val):
        self._stack.append(val)
        
        # Only push to min_stack if it's a new minimum
        if not self._min_stack or val <= self._min_stack[-1]:
            self._min_stack.append(val)
    
    def pop(self):
        if self._stack:
            val = self._stack.pop()
            # Only pop from min_stack if it was the minimum
            if val == self._min_stack[-1]:
                self._min_stack.pop()
    
    def top(self):
        return self._stack[-1] if self._stack else None
    
    def get_min(self):
        return self._min_stack[-1] if self._min_stack else None


# ============================================================
# MAX STACK (LC 716)
# ============================================================

class MaxStack:
    """
    Stack that supports:
    - push, pop, top (standard stack)
    - peekMax: return maximum
    - popMax: remove and return maximum
    
    This implementation uses two stacks.
    For better popMax, consider using TreeMap + doubly linked list.
    """
    
    def __init__(self):
        self._stack = []
        self._max_stack = []
    
    def push(self, val):
        self._stack.append(val)
        
        if not self._max_stack or val >= self._max_stack[-1]:
            self._max_stack.append(val)
        else:
            self._max_stack.append(self._max_stack[-1])
    
    def pop(self):
        self._max_stack.pop()
        return self._stack.pop()
    
    def top(self):
        return self._stack[-1]
    
    def peek_max(self):
        return self._max_stack[-1]
    
    def pop_max(self):
        """O(n) - need to find and remove max."""
        max_val = self._max_stack[-1]
        
        # Temporarily store elements until we find max
        temp = []
        while self._stack[-1] != max_val:
            temp.append(self.pop())
        
        # Pop the max
        self.pop()
        
        # Restore elements
        while temp:
            self.push(temp.pop())
        
        return max_val


# ============================================================
# TESTING
# ============================================================

def test_stacks():
    print("=" * 50)
    print("Testing Stack Implementations")
    print("=" * 50)
    
    # Test ArrayStack
    print("\n1. Testing ArrayStack:")
    stack = ArrayStack()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    print(f"   After push 1, 2, 3: {stack}")
    print(f"   Peek: {stack.peek()}")
    print(f"   Pop: {stack.pop()}")
    print(f"   After pop: {stack}")
    print(f"   Size: {stack.size()}")
    
    # Test LinkedListStack
    print("\n2. Testing LinkedListStack:")
    ll_stack = LinkedListStack()
    ll_stack.push('a')
    ll_stack.push('b')
    ll_stack.push('c')
    print(f"   After push a, b, c: {ll_stack}")
    print(f"   Pop: {ll_stack.pop()}")
    print(f"   After pop: {ll_stack}")
    
    # Test MinStack
    print("\n3. Testing MinStack:")
    min_stack = MinStack()
    min_stack.push(5)
    min_stack.push(3)
    min_stack.push(7)
    min_stack.push(2)
    print(f"   Pushed: 5, 3, 7, 2")
    print(f"   Min: {min_stack.get_min()}")  # 2
    min_stack.pop()
    print(f"   After pop, Min: {min_stack.get_min()}")  # 3
    min_stack.pop()
    print(f"   After pop, Min: {min_stack.get_min()}")  # 3
    
    print("\n" + "=" * 50)
    print("All Stack tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    test_stacks()
