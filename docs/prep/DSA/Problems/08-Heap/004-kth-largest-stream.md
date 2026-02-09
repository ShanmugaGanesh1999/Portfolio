# Kth Largest Element in Stream

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 703 | Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design class to track kth largest element in a stream. Supports add() operation returning current kth largest.

### Constraints & Clarifying Questions
1. **Initial elements?** May have some in constructor.
2. **k relative to stream size?** Can assume enough elements.
3. **Add returns kth largest?** Yes, after adding.
4. **Duplicates?** Count each occurrence.

### Edge Cases
1. **Initial size < k:** Handle initial adds
2. **All same values:** That value
3. **Decreasing stream:** New values may not affect answer

---

## Phase 2: High-Level Approach

### Approach: Min Heap of Size k
Keep only k largest elements. Root is kth largest.

**Core Insight:** Min heap of size k ensures smallest of k largest is accessible in O(1).

---

## Phase 3: Python Code

```python
import heapq
from typing import List


class KthLargest:
    """
    Track kth largest element in stream.
    """
    
    def __init__(self, k: int, nums: List[int]):
        """
        Initialize with k and starting numbers.
        """
        self.k = k
        self.heap = []
        
        # Add initial elements
        for num in nums:
            self.add(num)
    
    def add(self, val: int) -> int:
        """
        Add value and return kth largest. O(log k)
        """
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)  # O(log k)
        
        return self.heap[0]


class KthLargestSimple:
    """
    Alternative: Always push, then maintain size.
    """
    
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = nums.copy()
        heapq.heapify(self.heap)
        
        # Trim to size k
        while len(self.heap) > k:
            heapq.heappop(self.heap)
    
    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        
        return self.heap[0]
```

---

## Phase 4: Dry Run

**Operations:** `KthLargest(3, [4,5,8,2])`, `add(3)`, `add(5)`, `add(10)`, `add(9)`, `add(4)`

| Op | Heap | Result |
|----|------|--------|
| init | [4,5,8] (trim 2) | - |
| add(3) | [4,5,8] | 4 |
| add(5) | [5,5,8] | 5 |
| add(10) | [5,8,10] | 5 |
| add(9) | [8,9,10] | 8 |
| add(4) | [8,9,10] | 8 |

---

## Phase 5: Complexity Analysis

### Time Complexity:
- **Constructor:** O(N log k)
- **add:** O(log k)

### Space Complexity: O(k)

---

## Phase 6: Follow-Up Questions

1. **"What about kth smallest?"**
   → Use max heap of size k instead.

2. **"Support remove operation?"**
   → Need indexed heap or balanced BST for O(log N) removal.

3. **"Moving window kth largest?"**
   → Need to handle removals; more complex data structure needed.
