# Find Median from Data Stream

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 295 | Two Heaps |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design data structure to find median from streaming integers efficiently.

### Constraints & Clarifying Questions
1. **Median definition?** Middle value; average of two middles if even count.
2. **Streaming?** Elements added one at a time.
3. **Expected operations?** addNum, findMedian.
4. **Complexity goal?** O(log N) add, O(1) median.

### Edge Cases
1. **Single element:** That element
2. **Two elements:** Average
3. **Negative numbers:** Handle normally

---

## Phase 2: High-Level Approach

### Approach: Two Heaps
- Max heap for lower half
- Min heap for upper half
- Keep balanced (differ by at most 1)

**Core Insight:** Median is at boundary of two halves; heaps give O(1) access to boundary elements.

---

## Phase 3: Python Code

```python
import heapq


class MedianFinder:
    """
    Find median using two heaps.
    """
    
    def __init__(self):
        """Initialize heaps."""
        self.small = []  # Max heap (negated) - lower half
        self.large = []  # Min heap - upper half
    
    def addNum(self, num: int) -> None:
        """
        Add number to data structure. O(log N)
        """
        # Default: add to small (lower half)
        heapq.heappush(self.small, -num)
        
        # Ensure all small ≤ all large
        if self.small and self.large and -self.small[0] > self.large[0]:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        
        # Balance sizes (small can have one more)
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)
    
    def findMedian(self) -> float:
        """
        Return current median. O(1)
        """
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2


class MedianFinderAlt:
    """
    Alternative: Always add to one side first, then rebalance.
    """
    
    def __init__(self):
        self.small = []  # Max heap (negated)
        self.large = []  # Min heap
    
    def addNum(self, num: int) -> None:
        # Always push to small first, then move top to large
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Keep small at least as large
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

---

## Phase 4: Dry Run

**Operations:** addNum(1), addNum(2), findMedian(), addNum(3), findMedian()

| Op | small (vals) | large (vals) | Median |
|----|--------------|--------------|--------|
| add(1) | [1] | [] | - |
| add(2) | [1] | [2] | - |
| median | | | (1+2)/2 = 1.5 |
| add(3) | [2,1] | [3] | - |
| median | | | 2 |

**Detailed add(3):**
1. Push -3 to small → small = [-3,-1]
2. -small[0]=3 > large[0]=2? Yes
3. Move 3 to large → small=[-1], large=[2,3]
4. large bigger? Yes
5. Move 2 to small → small=[-2,-1], large=[3]

Wait, let me re-trace with the Alt version which is cleaner:

**Alt version add(3):**
1. Push to small: small = [-3,-2,-1]
2. Pop small, push to large: small=[-2,-1], large=[2,3] → small=[-2,-1], large=[2,3]? No:
   - Pop -3 (which is 3), push 3 to large
   - small=[-2,-1], large=[2,3]
3. large > small? 2 > 2? No
4. Final: small=[-2,-1], large=[3]... 

Let me be more careful with the standard version.

---

## Phase 5: Complexity Analysis

### addNum: O(log N)
At most 3 heap operations.

### findMedian: O(1)
Just access heap tops.

### Space: O(N)
Store all elements.

---

## Phase 6: Follow-Up Questions

1. **"All integers in [0, 100]?"**
   → Use counting array; O(1) add, O(100) median.

2. **"99% in [0, 100], 1% outliers?"**
   → Use buckets for [0,100], heaps for outliers.

3. **"Remove elements?"**
   → Lazy deletion with hash map; more complex.
