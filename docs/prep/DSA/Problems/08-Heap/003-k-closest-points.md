# K Closest Points to Origin

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 973 | Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find k points closest to origin (0, 0). Distance is Euclidean, but sqrt not needed for comparison.

### Constraints & Clarifying Questions
1. **Return order matters?** No, any order.
2. **Ties?** Any k closest is fine.
3. **k always valid?** Yes.
4. **Distance measure?** Euclidean (squared works for comparison).

### Edge Cases
1. **k = 1:** Closest single point
2. **k = n:** Return all points
3. **Points at same distance:** Any k

---

## Phase 2: High-Level Approach

### Option 1: Max Heap of Size k
Keep k closest; max heap allows O(1) check against furthest in top-k.

### Option 2: Sort
Sort by distance, take first k.

### Option 3: Quickselect
Partition to find k smallest distances.

**Core Insight:** Use squared distance to avoid sqrt computation.

---

## Phase 3: Python Code

```python
import heapq
from typing import List


def solve(points: List[List[int]], k: int) -> List[List[int]]:
    """
    Find k closest points using max heap.
    
    Args:
        points: List of [x, y] coordinates
        k: Number of points to return
    
    Returns:
        k closest points
    """
    # Max heap: store (-distance, point)
    heap = []
    
    for x, y in points:
        dist = x * x + y * y  # Squared distance
        
        if len(heap) < k:
            heapq.heappush(heap, (-dist, [x, y]))
        elif dist < -heap[0][0]:
            heapq.heapreplace(heap, (-dist, [x, y]))
    
    return [point for _, point in heap]


def solve_min_heap(points: List[List[int]], k: int) -> List[List[int]]:
    """
    Using min heap - heapify all, pop k times.
    """
    heap = [(x*x + y*y, [x, y]) for x, y in points]
    heapq.heapify(heap)  # O(N)
    
    result = []
    for _ in range(k):  # O(k log N)
        result.append(heapq.heappop(heap)[1])
    
    return result


def solve_quickselect(points: List[List[int]], k: int) -> List[List[int]]:
    """
    Using Quickselect - O(N) average.
    """
    def distance(point):
        return point[0]**2 + point[1]**2
    
    def partition(left, right):
        pivot = distance(points[right])
        store = left
        
        for i in range(left, right):
            if distance(points[i]) < pivot:
                points[i], points[store] = points[store], points[i]
                store += 1
        
        points[store], points[right] = points[right], points[store]
        return store
    
    left, right = 0, len(points) - 1
    
    while left < right:
        pivot_idx = partition(left, right)
        
        if pivot_idx == k:
            break
        elif pivot_idx < k:
            left = pivot_idx + 1
        else:
            right = pivot_idx - 1
    
    return points[:k]
```

---

## Phase 4: Dry Run

**Input:** `points = [[1,3],[-2,2]], k = 1`

**Distances:**
- [1,3]: 1 + 9 = 10
- [-2,2]: 4 + 4 = 8

**Max Heap (k=1):**

| Point | dist | Heap | Action |
|-------|------|------|--------|
| [1,3] | 10 | [(-10, [1,3])] | Add |
| [-2,2] | 8 | [(-8, [-2,2])] | 8 < 10, replace |

**Result:** `[[-2, 2]]`

---

## Phase 5: Complexity Analysis

### Max Heap:
- **Time:** O(N log k)
- **Space:** O(k)

### Min Heap:
- **Time:** O(N + k log N)
- **Space:** O(N)

### Quickselect:
- **Time:** O(N) average
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"What if points are streaming?"**
   → Max heap of size k; add if closer than current max.

2. **"K closest to arbitrary point?"**
   → Use distance to that point instead of origin.

3. **"What if we need sorted output?"**
   → Sort the k results afterward O(k log k).
