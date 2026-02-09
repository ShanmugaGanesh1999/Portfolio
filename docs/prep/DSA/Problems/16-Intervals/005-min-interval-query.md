# Minimum Interval to Include Each Query

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 1851 | Intervals + Sorting + Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
For each query, find size of smallest interval containing it.

### Constraints & Clarifying Questions
1. **Size = end - start + 1?** Yes.
2. **No containing interval?** Return -1.
3. **Multiple intervals same size?** Any valid.
4. **Same query multiple times?** Same answer.

### Edge Cases
1. **No intervals:** All -1
2. **Query outside all intervals:** -1
3. **Query at boundary:** Included

---

## Phase 2: High-Level Approach

### Approach: Sort + Min Heap
Sort intervals by start, queries by value.
For each query, add all intervals starting ≤ query.
Remove intervals ending < query.
Answer = smallest size in heap.

**Core Insight:** Process queries in sorted order; use heap for min size.

---

## Phase 3: Python Code

```python
from typing import List
import heapq


def solve(intervals: List[List[int]], queries: List[int]) -> List[int]:
    """
    Find smallest interval containing each query.
    
    Args:
        intervals: List of [left, right]
        queries: Query points
    
    Returns:
        Smallest interval size for each query
    """
    # Sort intervals by start
    intervals.sort()
    
    # Sort queries but remember original index
    sorted_queries = sorted(enumerate(queries), key=lambda x: x[1])
    
    result = [-1] * len(queries)
    heap = []  # (size, end)
    i = 0
    
    for idx, q in sorted_queries:
        # Add all intervals starting <= q
        while i < len(intervals) and intervals[i][0] <= q:
            left, right = intervals[i]
            size = right - left + 1
            heapq.heappush(heap, (size, right))
            i += 1
        
        # Remove intervals ending before q
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        
        # Answer is top of heap
        if heap:
            result[idx] = heap[0][0]
    
    return result


def solve_with_memo(intervals: List[List[int]], queries: List[int]) -> List[int]:
    """
    With memoization for duplicate queries.
    """
    intervals.sort()
    
    # Group queries by value
    query_to_idx = {}
    for i, q in enumerate(queries):
        if q not in query_to_idx:
            query_to_idx[q] = []
        query_to_idx[q].append(i)
    
    unique_queries = sorted(query_to_idx.keys())
    
    result = [-1] * len(queries)
    heap = []
    j = 0
    
    for q in unique_queries:
        # Add intervals starting <= q
        while j < len(intervals) and intervals[j][0] <= q:
            left, right = intervals[j]
            heapq.heappush(heap, (right - left + 1, right))
            j += 1
        
        # Remove intervals ending < q
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        
        # Assign to all queries with this value
        if heap:
            for idx in query_to_idx[q]:
                result[idx] = heap[0][0]
    
    return result


def solve_brute_force(intervals: List[List[int]], queries: List[int]) -> List[int]:
    """
    Brute force O(n*m) for comparison.
    """
    result = []
    
    for q in queries:
        min_size = float('inf')
        
        for left, right in intervals:
            if left <= q <= right:
                min_size = min(min_size, right - left + 1)
        
        result.append(min_size if min_size != float('inf') else -1)
    
    return result
```

---

## Phase 4: Dry Run

**Input:**
- intervals = [[1,4],[2,4],[3,6],[4,4]]
- queries = [2,3,4,5]

**Sorted intervals:** [[1,4],[2,4],[3,6],[4,4]]
**Sorted queries:** [(0,2), (1,3), (2,4), (3,5)]

| Query | Add intervals | Remove | Heap | Answer |
|-------|---------------|--------|------|--------|
| 2 | [1,4]→(4,4), [2,4]→(3,4) | None | [(3,4),(4,4)] | 3 |
| 3 | [3,6]→(4,6) | None | [(3,4),(4,4),(4,6)] | 3 |
| 4 | [4,4]→(1,4) | None | [(1,4),(3,4),(4,4),(4,6)] | 1 |
| 5 | None | (1,4),(3,4),(4,4) | [(4,6)] | 4 |

**Result:** [3, 3, 1, 4]

---

## Phase 5: Complexity Analysis

### Time Complexity: O((N + Q) log N)
- Sort: O(N log N + Q log Q)
- Each interval added/removed from heap once: O(N log N)

### Space Complexity: O(N + Q)
Heap and result array.

---

## Phase 6: Follow-Up Questions

1. **"Online queries (no sorting)?"**
   → Interval tree or segment tree.

2. **"K smallest intervals?"**
   → Track k intervals in heap.

3. **"Weighted intervals?"**
   → Track minimum weight instead of size.
