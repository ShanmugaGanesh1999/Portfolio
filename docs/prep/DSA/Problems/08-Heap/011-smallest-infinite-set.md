# Smallest Number in Infinite Set

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 2336 | Heap / Set |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design set containing all positive integers. Support popSmallest() and addBack(num).

### Constraints & Clarifying Questions
1. **Initial state?** All positive integers present.
2. **addBack already present?** No effect.
3. **popSmallest?** Remove and return smallest.
4. **Efficiency goal?** O(log N) operations.

### Edge Cases
1. **Pop, then add back:** Should be available again
2. **Add back something never popped:** No effect
3. **Sequential pops:** 1, 2, 3, ...

---

## Phase 2: High-Level Approach

### Approach: Heap + Set + Pointer
- Track "current smallest if no adds" (threshold)
- Heap for added-back numbers below threshold
- Set for O(1) membership check

**Core Insight:** Numbers ≥ threshold always available; track added-back numbers separately.

---

## Phase 3: Python Code

```python
import heapq


class SmallestInfiniteSet:
    """
    Infinite set of positive integers with pop and add operations.
    """
    
    def __init__(self):
        """Initialize the set."""
        self.threshold = 1  # Smallest number if heap empty
        self.heap = []      # Added-back numbers < threshold
        self.added = set()  # Track what's in heap
    
    def popSmallest(self) -> int:
        """
        Remove and return smallest number. O(log N)
        """
        if self.heap:
            smallest = heapq.heappop(self.heap)
            self.added.remove(smallest)
            return smallest
        else:
            result = self.threshold
            self.threshold += 1
            return result
    
    def addBack(self, num: int) -> None:
        """
        Add number back to set if removed. O(log N)
        """
        # Only add if below threshold and not already in heap
        if num < self.threshold and num not in self.added:
            heapq.heappush(self.heap, num)
            self.added.add(num)


class SmallestInfiniteSetSimple:
    """
    Alternative: Just use sorted set (less efficient but simpler).
    """
    
    def __init__(self):
        self.popped = set()
        self.current = 1
    
    def popSmallest(self) -> int:
        while self.current in self.popped:
            self.current += 1
        result = self.current
        self.popped.add(result)
        self.current += 1
        return result
    
    def addBack(self, num: int) -> None:
        self.popped.discard(num)
```

---

## Phase 4: Dry Run

**Operations:** popSmallest(), popSmallest(), addBack(1), popSmallest(), popSmallest()

| Op | threshold | heap | added | Return |
|----|-----------|------|-------|--------|
| init | 1 | [] | {} | - |
| pop | 2 | [] | {} | 1 |
| pop | 3 | [] | {} | 2 |
| add(1) | 3 | [1] | {1} | - |
| pop | 3 | [] | {} | 1 |
| pop | 4 | [] | {} | 3 |

---

## Phase 5: Complexity Analysis

### popSmallest: O(log N)
Where N = number of added-back elements.

### addBack: O(log N)

### Space: O(N)
For heap and set.

---

## Phase 6: Follow-Up Questions

1. **"What if we need kth smallest?"**
   → Peek into heap and compare with threshold.

2. **"Range removal?"**
   → Need interval tracking; more complex.

3. **"Concurrent access?"**
   → Add locks around operations.
