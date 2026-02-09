# Kth Largest Element in Array

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 215 | Heap / Quickselect |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find kth largest element in unsorted array (sorted order position, not kth distinct).

### Constraints & Clarifying Questions
1. **Duplicates count?** Yes, each occurrence counts.
2. **k always valid?** Yes, 1 ≤ k ≤ n.
3. **Expected complexity?** O(N) average possible with Quickselect.
4. **Can modify array?** Usually yes for Quickselect.

### Edge Cases
1. **k = 1:** Maximum element
2. **k = n:** Minimum element
3. **All same elements:** That element

---

## Phase 2: High-Level Approach

### Option 1: Min Heap of Size k
Keep k largest elements; root is kth largest.
- **Time:** O(N log k)

### Option 2: Quickselect
Partition-based selection.
- **Time:** O(N) average, O(N²) worst

### Option 3: Sort
Simple but slower.
- **Time:** O(N log N)

**Core Insight:** Don't need full sort; partial ordering suffices.

---

## Phase 3: Python Code

```python
import heapq
import random
from typing import List


def solve(nums: List[int], k: int) -> int:
    """
    Find kth largest using min heap.
    
    Args:
        nums: Input array
        k: Position from largest
    
    Returns:
        kth largest element
    """
    # Min heap of size k
    heap = []
    
    for num in nums:  # O(N log k)
        if len(heap) < k:
            heapq.heappush(heap, num)
        elif num > heap[0]:
            heapq.heapreplace(heap, num)  # Pop and push
    
    return heap[0]


def solve_quickselect(nums: List[int], k: int) -> int:
    """
    Quickselect algorithm - O(N) average.
    """
    k = len(nums) - k  # Convert to kth smallest index
    
    def quickselect(left: int, right: int) -> int:
        # Randomize pivot to avoid worst case
        pivot_idx = random.randint(left, right)
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        
        pivot = nums[right]
        store_idx = left
        
        for i in range(left, right):
            if nums[i] < pivot:
                nums[i], nums[store_idx] = nums[store_idx], nums[i]
                store_idx += 1
        
        nums[store_idx], nums[right] = nums[right], nums[store_idx]
        
        if store_idx == k:
            return nums[store_idx]
        elif store_idx < k:
            return quickselect(store_idx + 1, right)
        else:
            return quickselect(left, store_idx - 1)
    
    return quickselect(0, len(nums) - 1)


def solve_max_heap(nums: List[int], k: int) -> int:
    """
    Using max heap - pop k times.
    """
    # Python heapq is min heap; negate for max heap
    max_heap = [-x for x in nums]
    heapq.heapify(max_heap)  # O(N)
    
    for _ in range(k - 1):  # O(k log N)
        heapq.heappop(max_heap)
    
    return -max_heap[0]
```

---

## Phase 4: Dry Run

**Input:** `nums = [3,2,1,5,6,4], k = 2`

**Min Heap Approach:**

| num | Heap | Action |
|-----|------|--------|
| 3 | [3] | Add |
| 2 | [2,3] | Add |
| 1 | [2,3] | 1 < 2, skip |
| 5 | [3,5] | Replace 2 |
| 6 | [5,6] | Replace 3 |
| 4 | [5,6] | 4 < 5, skip |

**Result:** `5` (heap[0])

---

## Phase 5: Complexity Analysis

### Min Heap:
- **Time:** O(N log k)
- **Space:** O(k)

### Quickselect:
- **Time:** O(N) average, O(N²) worst
- **Space:** O(1)

### Max Heap Pop k:
- **Time:** O(N + k log N)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Streaming data?"**
   → Min heap of size k; new elements may replace root.

2. **"kth largest distinct?"**
   → Use set to track unique values in heap.

3. **"Median finding?"**
   → Use two heaps (max heap for lower half, min heap for upper half).
