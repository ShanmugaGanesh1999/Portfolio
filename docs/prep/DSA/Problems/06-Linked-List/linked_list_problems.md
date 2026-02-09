# 🔗 Linked List - Complete Problem Set

## Problem 1: Reverse Linked List (Easy)
**LeetCode 206**

### Problem
Reverse a singly linked list.

### Intuition
Track previous, current, next. Point current.next to previous.

### Solution
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head: ListNode) -> ListNode:
    """
    Iterative
    Time: O(n)
    Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    return prev

def reverseList_recursive(head: ListNode) -> ListNode:
    """
    Recursive
    Time: O(n)
    Space: O(n) for call stack
    """
    if not head or not head.next:
        return head
    
    new_head = reverseList_recursive(head.next)
    head.next.next = head
    head.next = None
    
    return new_head
```

---

## Problem 2: Merge Two Sorted Lists (Easy)
**LeetCode 21**

### Problem
Merge two sorted linked lists into one sorted list.

### Intuition
Use dummy head. Compare and link smaller node.

### Solution
```python
def mergeTwoLists(list1: ListNode, list2: ListNode) -> ListNode:
    """
    Time: O(n + m)
    Space: O(1)
    """
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    # Attach remaining
    current.next = list1 if list1 else list2
    
    return dummy.next
```

---

## Problem 3: Linked List Cycle (Easy)
**LeetCode 141**

### Problem
Detect if linked list has a cycle.

### Intuition
Floyd's algorithm: slow moves 1 step, fast moves 2 steps. If cycle, they meet.

### Solution
```python
def hasCycle(head: ListNode) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            return True
    
    return False
```

---

## Problem 4: Middle of the Linked List (Easy)
**LeetCode 876**

### Problem
Find middle node of linked list.

### Intuition
Slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle.

### Solution
```python
def middleNode(head: ListNode) -> ListNode:
    """
    Time: O(n)
    Space: O(1)
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow  # For even length, returns second middle
```

---

## Problem 5: Remove Nth Node From End of List (Medium)
**LeetCode 19**

### Problem
Remove nth node from end in one pass.

### Intuition
Use two pointers n apart. When fast reaches end, slow is at node before target.

### Solution
```python
def removeNthFromEnd(head: ListNode, n: int) -> ListNode:
    """
    Time: O(length)
    Space: O(1)
    """
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    # Move fast n+1 steps ahead
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Remove node
    slow.next = slow.next.next
    
    return dummy.next
```

---

## Problem 6: Linked List Cycle II (Medium)
**LeetCode 142**

### Problem
Find the node where cycle begins.

### Intuition
After detecting cycle, reset slow to head. Move both 1 step until they meet at cycle start.

### Solution
```python
def detectCycle(head: ListNode) -> ListNode:
    """
    Time: O(n)
    Space: O(1)
    """
    slow = fast = head
    
    # Detect cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            # Find cycle start
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    
    return None
```

---

## Problem 7: Reorder List (Medium)
**LeetCode 143**

### Problem
Reorder: L0→L1→...→Ln to L0→Ln→L1→Ln-1→L2→Ln-2→...

### Intuition
Find middle, reverse second half, merge alternately.

### Solution
```python
def reorderList(head: ListNode) -> None:
    """
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    prev = None
    current = slow.next
    slow.next = None  # Cut the list
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    # Merge two halves
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
```

---

## Problem 8: Copy List with Random Pointer (Medium)
**LeetCode 138**

### Problem
Deep copy linked list with random pointer.

### Intuition
Method 1: HashMap old→new. Method 2: Interleave copies.

### Solution
```python
class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copyRandomList(head: Node) -> Node:
    """
    HashMap approach
    Time: O(n)
    Space: O(n)
    """
    if not head:
        return None
    
    old_to_new = {}
    
    # First pass: create all nodes
    current = head
    while current:
        old_to_new[current] = Node(current.val)
        current = current.next
    
    # Second pass: set pointers
    current = head
    while current:
        copy = old_to_new[current]
        copy.next = old_to_new.get(current.next)
        copy.random = old_to_new.get(current.random)
        current = current.next
    
    return old_to_new[head]

def copyRandomList_O1(head: Node) -> Node:
    """
    Interleaving approach
    Time: O(n)
    Space: O(1)
    """
    if not head:
        return None
    
    # Step 1: Create interleaved copies
    current = head
    while current:
        copy = Node(current.val, current.next)
        current.next = copy
        current = copy.next
    
    # Step 2: Set random pointers
    current = head
    while current:
        if current.random:
            current.next.random = current.random.next
        current = current.next.next
    
    # Step 3: Separate lists
    dummy = Node(0)
    copy_curr = dummy
    current = head
    
    while current:
        copy_curr.next = current.next
        copy_curr = copy_curr.next
        current.next = current.next.next
        current = current.next
    
    return dummy.next
```

---

## Problem 9: Add Two Numbers (Medium)
**LeetCode 2**

### Problem
Add two numbers represented as linked lists (digits in reverse order).

### Intuition
Simulate addition digit by digit with carry.

### Solution
```python
def addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Time: O(max(m, n))
    Space: O(max(m, n))
    """
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        
        current.next = ListNode(total % 10)
        current = current.next
        
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next
```

---

## Problem 10: Find the Duplicate Number (Medium)
**LeetCode 287**

### Problem
Find duplicate in array [1,n] with n+1 elements.

### Intuition
Floyd's cycle detection treating array as linked list where nums[i] = next.

### Solution
```python
def findDuplicate(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    # Floyd's algorithm
    slow = fast = nums[0]
    
    # Find intersection point
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Find cycle start (duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

---

## Problem 11: LRU Cache (Medium)
**LeetCode 146**

### Problem
Design LRU Cache with get and put in O(1).

### Intuition
HashMap + Doubly Linked List. HashMap for O(1) access, DLL for O(1) reordering.

### Solution
```python
class DLinkedNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    """
    get: O(1)
    put: O(1)
    Space: O(capacity)
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail
        self.head = DLinkedNode()
        self.tail = DLinkedNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _add_to_front(self, node):
        """Add node right after head"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove(self, node):
        """Remove node from list"""
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _move_to_front(self, node):
        """Move existing node to front"""
        self._remove(node)
        self._add_to_front(node)
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        self._move_to_front(node)
        return node.val
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_front(node)
        else:
            if len(self.cache) >= self.capacity:
                # Remove LRU (before tail)
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
            
            node = DLinkedNode(key, value)
            self.cache[key] = node
            self._add_to_front(node)
```

---

## Problem 12: Reverse Nodes in k-Group (Hard)
**LeetCode 25**

### Problem
Reverse nodes in groups of k.

### Intuition
Reverse each group of k, connect groups. Don't reverse if less than k nodes.

### Solution
```python
def reverseKGroup(head: ListNode, k: int) -> ListNode:
    """
    Time: O(n)
    Space: O(1)
    """
    def reverseGroup(start, end):
        """Reverse from start to end (exclusive)"""
        prev = end
        current = start
        
        while current != end:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        return prev  # New head of reversed group
    
    dummy = ListNode(0, head)
    group_prev = dummy
    
    while True:
        # Check if k nodes exist
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        
        group_next = kth.next
        
        # Reverse group
        new_head = reverseGroup(group_prev.next, group_next)
        
        # Connect to previous and next groups
        group_end = group_prev.next  # Will be end after reverse
        group_prev.next = new_head
        group_end.next = group_next
        
        # Move to next group
        group_prev = group_end
    
    return dummy.next
```

---

## Problem 13: Merge k Sorted Lists (Hard)
**LeetCode 23**

### Problem
Merge k sorted linked lists.

### Intuition
Use min heap to always get smallest next node.

### Solution
```python
import heapq

def mergeKLists(lists: list[ListNode]) -> ListNode:
    """
    Time: O(N log k) where N = total nodes
    Space: O(k)
    """
    # Handle ListNode comparison
    heap = []
    
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
    
    return dummy.next

def mergeKLists_divide_conquer(lists: list[ListNode]) -> ListNode:
    """
    Divide and Conquer
    Time: O(N log k)
    Space: O(log k) for recursion
    """
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]
    
    mid = len(lists) // 2
    left = mergeKLists_divide_conquer(lists[:mid])
    right = mergeKLists_divide_conquer(lists[mid:])
    
    return mergeTwoLists(left, right)
```

---

## Problem 14: Sort List (Medium)
**LeetCode 148**

### Problem
Sort linked list in O(n log n) time and O(1) space.

### Intuition
Merge sort: find middle, sort halves, merge.

### Solution
```python
def sortList(head: ListNode) -> ListNode:
    """
    Time: O(n log n)
    Space: O(log n) for recursion
    """
    if not head or not head.next:
        return head
    
    # Find middle
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Split
    mid = slow.next
    slow.next = None
    
    # Sort halves
    left = sortList(head)
    right = sortList(mid)
    
    # Merge
    return mergeTwoLists(left, right)
```

---

## 📊 Linked List Summary

| Problem | Difficulty | Technique | Key Insight |
|---------|------------|-----------|-------------|
| Reverse List | Easy | Iteration/Recursion | Track prev, curr, next |
| Merge Two Lists | Easy | Two Pointers | Dummy head pattern |
| Linked List Cycle | Easy | Floyd's (fast/slow) | Fast catches slow in cycle |
| Middle of List | Easy | Fast/Slow | Fast 2x speed |
| Remove Nth From End | Medium | Two Pointers | n gap between pointers |
| Cycle II | Medium | Floyd's | Reset slow to find start |
| Reorder List | Medium | Multiple Techniques | Find mid, reverse, merge |
| Copy Random Pointer | Medium | HashMap/Interleave | Map old to new |
| Add Two Numbers | Medium | Simulation | Track carry |
| Find Duplicate | Medium | Floyd's (array) | Array as linked list |
| LRU Cache | Medium | HashMap + DLL | O(1) access and reorder |
| Reverse K-Group | Hard | Reverse Groups | Connect groups carefully |
| Merge K Lists | Hard | Heap/D&C | Min heap or divide conquer |
| Sort List | Medium | Merge Sort | Find mid, sort, merge |

### Pattern Recognition:

**Floyd's Cycle Detection:**
- Slow (1 step) and fast (2 steps)
- Used for: cycle detection, finding middle, finding duplicates

**Dummy Head:**
- Simplifies edge cases
- Used for: merging, removing nodes, building new lists

**Reverse Techniques:**
- Iterative: track prev, curr, next
- Recursive: reverse rest, point back

**Two Pointer Gap:**
- Pointers at fixed distance apart
- Used for: remove nth from end, finding specific positions
