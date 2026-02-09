# 🎯 Heap / Priority Queue - Complete Guide

## 📌 What is a Heap?

A heap is a complete binary tree that satisfies the heap property:
- **Max-Heap**: Parent ≥ children (root is maximum)
- **Min-Heap**: Parent ≤ children (root is minimum)

Python's `heapq` implements a **min-heap** by default.

---

## 🔧 Python heapq Operations

```python
import heapq

# Create min heap
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)
# heap = [3, 5, 7]

# Get minimum (peek)
min_val = heap[0]  # 3

# Pop minimum
min_val = heapq.heappop(heap)  # 3, heap = [5, 7]

# Heapify a list
arr = [5, 3, 7, 1]
heapq.heapify(arr)  # O(n), arr = [1, 3, 7, 5]

# Push and pop in one operation
heapq.heappushpop(heap, 2)  # Push 2, then pop min

# Pop and push in one operation
heapq.heapreplace(heap, 10)  # Pop min, then push 10

# Get n smallest/largest
heapq.nsmallest(3, arr)
heapq.nlargest(3, arr)
```

## 🔧 Max-Heap in Python

```python
# Method 1: Negate values
max_heap = []
heapq.heappush(max_heap, -5)  # Push -5 instead of 5
max_val = -heapq.heappop(max_heap)  # Get 5 back

# Method 2: Use tuple with negated priority
max_heap = []
heapq.heappush(max_heap, (-priority, value))
```

---

## 🔧 Heap Implementation from Scratch

```python
class MinHeap:
    """
    Min-heap implementation from scratch.
    
    All operations maintain the heap property.
    """
    
    def __init__(self):
        self.heap = []
    
    def parent(self, i):
        return (i - 1) // 2
    
    def left_child(self, i):
        return 2 * i + 1
    
    def right_child(self, i):
        return 2 * i + 2
    
    def swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]
    
    def push(self, val):
        """
        Add element and bubble up.
        Time: O(log n)
        """
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)
    
    def _bubble_up(self, i):
        while i > 0 and self.heap[self.parent(i)] > self.heap[i]:
            self.swap(i, self.parent(i))
            i = self.parent(i)
    
    def pop(self):
        """
        Remove and return minimum, bubble down.
        Time: O(log n)
        """
        if not self.heap:
            return None
        
        if len(self.heap) == 1:
            return self.heap.pop()
        
        min_val = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._bubble_down(0)
        
        return min_val
    
    def _bubble_down(self, i):
        n = len(self.heap)
        smallest = i
        
        left = self.left_child(i)
        right = self.right_child(i)
        
        if left < n and self.heap[left] < self.heap[smallest]:
            smallest = left
        
        if right < n and self.heap[right] < self.heap[smallest]:
            smallest = right
        
        if smallest != i:
            self.swap(i, smallest)
            self._bubble_down(smallest)
    
    def peek(self):
        return self.heap[0] if self.heap else None
    
    def __len__(self):
        return len(self.heap)
```

---

## 🔥 Classic Heap Problems

### Kth Largest Element (LC 215)

```python
def find_kth_largest(nums: list[int], k: int) -> int:
    """
    Find kth largest element.
    
    Use min-heap of size k:
    - Top of heap = kth largest
    
    Time: O(n log k)
    Space: O(k)
    """
    import heapq
    
    heap = []
    
    for num in nums:
        heapq.heappush(heap, num)
        
        if len(heap) > k:
            heapq.heappop(heap)
    
    return heap[0]

# Alternative: Use nlargest
def find_kth_largest_alt(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]
```

### Top K Frequent Elements (LC 347)

```python
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Find k most frequent elements.
    
    Method 1: Min heap of size k
    Time: O(n log k)
    """
    from collections import Counter
    import heapq
    
    count = Counter(nums)
    
    # Min heap of (frequency, element)
    heap = []
    
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
    
    return [num for freq, num in heap]

def top_k_frequent_bucket(nums: list[int], k: int) -> list[int]:
    """
    Method 2: Bucket sort
    Time: O(n)
    """
    from collections import Counter
    
    count = Counter(nums)
    
    # Bucket: index = frequency
    buckets = [[] for _ in range(len(nums) + 1)]
    
    for num, freq in count.items():
        buckets[freq].append(num)
    
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result
```

### Merge K Sorted Lists (LC 23)

```python
def merge_k_lists(lists: list) -> 'ListNode':
    """
    Merge k sorted linked lists.
    
    Use min heap to always get smallest element.
    
    Time: O(n log k) where n = total nodes
    Space: O(k)
    """
    import heapq
    
    # Handle custom comparison for ListNode
    class Wrapper:
        def __init__(self, node):
            self.node = node
        def __lt__(self, other):
            return self.node.val < other.node.val
    
    heap = []
    
    # Add first node of each list
    for lst in lists:
        if lst:
            heapq.heappush(heap, Wrapper(lst))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        wrapper = heapq.heappop(heap)
        node = wrapper.node
        
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, Wrapper(node.next))
    
    return dummy.next
```

### Find Median from Data Stream (LC 295)

```python
class MedianFinder:
    """
    Find median from data stream.
    
    Use two heaps:
    - max_heap: smaller half
    - min_heap: larger half
    
    Keep balanced: |max_heap| - |min_heap| <= 1
    
    Time: O(log n) for add, O(1) for find
    """
    
    def __init__(self):
        self.max_heap = []  # Smaller half (negated for max)
        self.min_heap = []  # Larger half
    
    def addNum(self, num: int) -> None:
        # Add to max_heap first
        heapq.heappush(self.max_heap, -num)
        
        # Move max to min_heap
        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))
        
        # Balance: max_heap should have equal or one more
        if len(self.min_heap) > len(self.max_heap):
            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))
    
    def findMedian(self) -> float:
        if len(self.max_heap) > len(self.min_heap):
            return -self.max_heap[0]
        return (-self.max_heap[0] + self.min_heap[0]) / 2
```

### Task Scheduler (LC 621)

```python
def least_interval(tasks: list[str], n: int) -> int:
    """
    Find minimum intervals to complete all tasks with cooldown n.
    
    Greedy: Always execute most frequent task.
    
    Time: O(m) where m = total tasks
    """
    from collections import Counter
    import heapq
    
    count = Counter(tasks)
    max_heap = [-c for c in count.values()]
    heapq.heapify(max_heap)
    
    time = 0
    cooldown = []  # (available_time, count)
    
    while max_heap or cooldown:
        time += 1
        
        if max_heap:
            cnt = heapq.heappop(max_heap) + 1  # Execute one task
            if cnt < 0:
                cooldown.append((time + n, cnt))
        
        # Add back tasks that finished cooldown
        if cooldown and cooldown[0][0] == time:
            heapq.heappush(max_heap, cooldown.pop(0)[1])
    
    return time
```

---

## 📋 Heap Use Cases

| Problem Type | Approach |
|--------------|----------|
| Kth largest/smallest | Heap of size k |
| Top K elements | Min heap size k |
| Merge K sorted | Min heap of heads |
| Running median | Two heaps |
| Scheduling | Max heap by priority |

---

## ⚠️ Common Pitfalls

1. **Forgetting Python uses min-heap** - negate for max
2. **Custom objects** - need `__lt__` or wrapper
3. **Heap vs sorted** - heap is O(log n) for insert

---

## 🎓 Key Takeaways

1. **Min-heap of size k** = k largest elements
2. **Max-heap of size k** = k smallest elements
3. **Two heaps** for median problems
4. **Heapify is O(n)**, individual pushes are O(n log n)
5. **Priority queue** = heap with (priority, value) tuples

---

## ➡️ Next: [Greedy Algorithms](../03-Greedy/)
