# Last Stone Weight

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 1046 | Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Smash two heaviest stones repeatedly. If equal weight, both destroyed; else, remaining = |difference|. Return last stone's weight (0 if none).

### Constraints & Clarifying Questions
1. **Empty array?** Return 0.
2. **Single stone?** Return its weight.
3. **All equal weights?** Depends on parity (even: 0, odd: single stone).
4. **Tie on heaviest?** Pick any two heaviest.

### Edge Cases
1. **Empty:** 0
2. **Single stone:** Return weight
3. **Two equal stones:** 0

---

## Phase 2: High-Level Approach

### Approach: Max Heap
Use max heap; repeatedly extract two largest, push difference if non-zero.

**Core Insight:** Need efficient access to maximum; max heap provides O(log N) operations.

---

## Phase 3: Python Code

```python
import heapq
from typing import List


def solve(stones: List[int]) -> int:
    """
    Simulate stone smashing with max heap.
    
    Args:
        stones: Stone weights
    
    Returns:
        Weight of last stone (or 0)
    """
    # Max heap using negation
    heap = [-s for s in stones]
    heapq.heapify(heap)  # O(N)
    
    while len(heap) > 1:  # O(N log N)
        # Extract two largest
        first = -heapq.heappop(heap)
        second = -heapq.heappop(heap)
        
        # If different, push remainder
        if first != second:
            heapq.heappush(heap, -(first - second))
    
    return -heap[0] if heap else 0


def solve_sort(stones: List[int]) -> int:
    """
    Alternative: Sort and process (less efficient).
    """
    stones = sorted(stones, reverse=True)
    
    while len(stones) > 1:
        first = stones.pop(0)
        second = stones.pop(0)
        
        if first != second:
            # Insert in sorted position (O(N) per insert)
            diff = first - second
            i = 0
            while i < len(stones) and stones[i] > diff:
                i += 1
            stones.insert(i, diff)
    
    return stones[0] if stones else 0
```

---

## Phase 4: Dry Run

**Input:** `[2, 7, 4, 1, 8, 1]`

| Step | Heap (as positive) | Extract | Diff | Push |
|------|-------------------|---------|------|------|
| init | [8,7,4,2,1,1] | - | - | - |
| 1 | [7,4,2,1,1] | 8,7 | 1 | [4,2,1,1,1] |
| 2 | [2,1,1,1] | 4,2 | 2 | [2,2,1,1] |
| 3 | [2,1,1] | 2,2 | 0 | - |
| 4 | [1,1] | 2,1 | 1 | [1,1] |
| 5 | [1] | 1,1 | 0 | - |

**Result:** `1`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
At most N operations, each O(log N).

### Space Complexity: O(N)
Heap storage.

---

## Phase 6: Follow-Up Questions

1. **"What if we want the sequence of smashes?"**
   → Track operations during simulation.

2. **"Minimize final weight with different pairing?"**
   → Different problem; greedy may not work, need DP.

3. **"What about stone masses (3D problem)?"**
   → More complex; potentially need different data structure.
