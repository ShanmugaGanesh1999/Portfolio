# Top K Frequent Elements

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 347 | Heap / Bucket Sort |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find k most frequent elements. Answer may be in any order.

### Constraints & Clarifying Questions
1. **k always valid?** Yes.
2. **Ties?** Any k most frequent is fine.
3. **Return order?** Any order.
4. **Expected complexity?** Better than O(N log N).

### Edge Cases
1. **k = n:** Return all unique elements
2. **All same frequency:** Any k
3. **Single element:** Return it

---

## Phase 2: High-Level Approach

### Option 1: Min Heap of Size k
Count frequencies, use heap to track top k.
- **Time:** O(N log k)

### Option 2: Bucket Sort
Group by frequency; collect from highest buckets.
- **Time:** O(N)

### Option 3: Quickselect
Select kth most frequent.
- **Time:** O(N) average

**Core Insight:** Bucket sort gives true O(N) by using frequency as index.

---

## Phase 3: Python Code

```python
import heapq
from collections import Counter
from typing import List


def solve(nums: List[int], k: int) -> List[int]:
    """
    Find k most frequent using bucket sort. O(N)
    
    Args:
        nums: Input array
        k: Number of elements
    
    Returns:
        k most frequent elements
    """
    count = Counter(nums)
    
    # Buckets: index = frequency, value = list of nums
    buckets = [[] for _ in range(len(nums) + 1)]
    
    for num, freq in count.items():
        buckets[freq].append(num)
    
    # Collect from highest frequency buckets
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result


def solve_heap(nums: List[int], k: int) -> List[int]:
    """
    Using min heap of size k. O(N log k)
    """
    count = Counter(nums)
    
    # Min heap: (frequency, num)
    heap = []
    
    for num, freq in count.items():
        if len(heap) < k:
            heapq.heappush(heap, (freq, num))
        elif freq > heap[0][0]:
            heapq.heapreplace(heap, (freq, num))
    
    return [num for freq, num in heap]


def solve_counter(nums: List[int], k: int) -> List[int]:
    """
    Using Counter.most_common(). O(N log N) typically.
    """
    return [num for num, _ in Counter(nums).most_common(k)]
```

---

## Phase 4: Dry Run

**Input:** `nums = [1,1,1,2,2,3], k = 2`

**Bucket Sort:**

| Step | Action |
|------|--------|
| Count | {1:3, 2:2, 3:1} |
| Buckets | [[], [3], [2], [1], [], [], []] |
| Collect | freq=3: [1], freq=2: [1,2] → done |

**Result:** `[1, 2]`

---

## Phase 5: Complexity Analysis

### Bucket Sort:
- **Time:** O(N)
- **Space:** O(N)

### Heap:
- **Time:** O(N log k)
- **Space:** O(N) for counter + O(k) for heap

---

## Phase 6: Follow-Up Questions

1. **"Streaming data?"**
   → Maintain counter and heap; update on each element.

2. **"Return in frequency order?"**
   → Sort final result by frequency.

3. **"What about k least frequent?"**
   → Use max heap or iterate buckets from low frequency.
