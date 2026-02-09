# 📚 Queue Data Structure

## 🎯 What is a Queue?

A **Queue** is a linear data structure that follows the **First-In-First-Out (FIFO)** principle. Think of it like a line at a store - first person in line is first to be served.

---

## 🧠 Core Operations

```
Front (Dequeue)                    Rear (Enqueue)
       ↓                                 ↓
┌─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │
└─────┴─────┴─────┴─────┴─────┘
   ↑                           ↑
 First                       Last
(oldest)                   (newest)

Enqueue(6): Add to rear
Dequeue():  Remove from front (returns 1)
Front():    Look at front (returns 1)
```

---

## ⚡ Time Complexities

| Operation | Time | Space |
|-----------|------|-------|
| Enqueue | O(1) | O(1) |
| Dequeue | O(1)* | O(1) |
| Front/Peek | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
| Search | O(n) | O(1) |

*O(1) with proper implementation (circular array or linked list)

---

## 🐍 Queue in Python

### Using collections.deque (Recommended)

```python
from collections import deque

queue = deque()

# Enqueue (add to rear)
queue.append(1)
queue.append(2)
queue.append(3)
print(queue)  # deque([1, 2, 3])

# Dequeue (remove from front)
front = queue.popleft()  # 1
print(queue)  # deque([2, 3])

# Peek front
front = queue[0]  # 2 (doesn't remove)

# Peek rear
rear = queue[-1]  # 3

# isEmpty
is_empty = len(queue) == 0

# Size
size = len(queue)
```

### Why deque over list?

```python
# Using list - BAD!
queue = [1, 2, 3]
queue.append(4)      # O(1) - fine
front = queue.pop(0) # O(n) - BAD! Shifts all elements

# Using deque - GOOD!
from collections import deque
queue = deque([1, 2, 3])
queue.append(4)      # O(1)
front = queue.popleft()  # O(1) - efficient!
```

---

## 🔀 Types of Queues

### 1. Simple Queue (FIFO)
Standard queue - enqueue at rear, dequeue from front.

### 2. Double-Ended Queue (Deque)
Operations at both ends:
```python
from collections import deque

dq = deque()

# Add to either end
dq.append(1)       # Right
dq.appendleft(0)   # Left

# Remove from either end
dq.pop()           # Right
dq.popleft()       # Left
```

### 3. Circular Queue
Fixed-size queue that wraps around:
```
Indices: [0] [1] [2] [3] [4]
          ↑           ↑
        front       rear

After enqueue: rear = (rear + 1) % capacity
After dequeue: front = (front + 1) % capacity
```

### 4. Priority Queue
Elements dequeued by priority (covered in Heaps).

---

## 🔥 Common Queue Patterns

### 1. BFS (Breadth-First Search)

```python
from collections import deque

def bfs(graph, start):
    """
    BFS traversal using queue.
    
    Queue ensures we visit level by level.
    """
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result
```

### 2. Level Order Tree Traversal

```python
from collections import deque

def level_order(root):
    """
    Traverse binary tree level by level.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

### 3. Sliding Window Maximum

```python
from collections import deque

def max_sliding_window(nums, k):
    """
    Find maximum in each sliding window of size k.
    
    Use monotonic deque - decreasing order.
    """
    result = []
    dq = deque()  # Store indices
    
    for i in range(len(nums)):
        # Remove elements outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove smaller elements (they'll never be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add maximum to result (after first window formed)
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### 4. Implement Stack Using Queues

```python
from collections import deque

class MyStack:
    """
    Stack using two queues.
    
    Approach: Make pop() expensive - reverse queue on each pop.
    """
    
    def __init__(self):
        self.queue = deque()
    
    def push(self, x):
        self.queue.append(x)
        # Rotate to put new element at front
        for _ in range(len(self.queue) - 1):
            self.queue.append(self.queue.popleft())
    
    def pop(self):
        return self.queue.popleft()
    
    def top(self):
        return self.queue[0]
    
    def empty(self):
        return len(self.queue) == 0
```

---

## 📚 Classic Queue Problems

| Problem | Pattern | Difficulty |
|---------|---------|------------|
| Implement Queue using Stacks (LC 232) | Two stacks | Easy |
| Number of Recent Calls (LC 933) | Sliding window queue | Easy |
| Design Circular Queue (LC 622) | Circular array | Medium |
| Sliding Window Maximum (LC 239) | Monotonic deque | Hard |
| Binary Tree Level Order (LC 102) | BFS | Medium |
| Rotting Oranges (LC 994) | Multi-source BFS | Medium |
| Shortest Path in Binary Matrix (LC 1091) | BFS | Medium |

---

## 📝 Key Takeaways

1. **Queue = FIFO** - first in, first out
2. **Use `collections.deque`** for efficient O(1) operations
3. **BFS uses queue** - essential for graph/tree level traversal
4. **Deque (double-ended)** is more flexible than simple queue
5. **Monotonic deque** solves sliding window max/min problems
