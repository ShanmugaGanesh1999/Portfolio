# Sliding Window Maximum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 239 | Sliding Window + Monotonic Deque |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find maximum element in each sliding window of size k.

### Constraints & Clarifying Questions
1. **Is k always valid?** 1 ≤ k ≤ n.
2. **What if k = n?** Single window, return max of array.
3. **What if k = 1?** Return array itself.
4. **Value range?** -10^4 to 10^4.
5. **Expected time complexity?** O(N) optimal.

### Edge Cases
1. **k = 1:** `nums = [1,2,3], k = 1` → [1,2,3]
2. **k = n:** `nums = [1,3,2], k = 3` → [3]
3. **All same:** `nums = [2,2,2], k = 2` → [2,2]

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Max per Window)
Find max in each window of size k.
- **Time:** O(N × K)
- **Space:** O(1)

### Option 2: Optimal (Monotonic Deque)
Maintain deque of indices where values are in decreasing order.

**Core Insight:** Keep potentially useful elements (monotonically decreasing); front is always current max.

---

## Phase 3: Python Code

```python
from collections import deque

def solve(nums: list[int], k: int) -> list[int]:
    """
    Find maximum in each sliding window of size k.
    
    Args:
        nums: Input array
        k: Window size
    
    Returns:
        Array of maximums for each window position
    """
    if not nums or k == 0:
        return []
    
    dq = deque()  # Store indices, values are monotonically decreasing
    result = []
    
    for i in range(len(nums)):  # O(N)
        # Remove elements outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()  # O(1)
        
        # Remove smaller elements (they can't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()  # O(1) amortized
        
        # Add current index
        dq.append(i)
        
        # Window is complete, record max
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result


def solve_heap(nums: list[int], k: int) -> list[int]:
    """
    Alternative using max heap (less optimal).
    """
    import heapq
    
    if not nums or k == 0:
        return []
    
    # Max heap: (-value, index)
    heap = []
    result = []
    
    for i in range(len(nums)):
        heapq.heappush(heap, (-nums[i], i))
        
        # Remove elements outside window
        while heap[0][1] < i - k + 1:
            heapq.heappop(heap)
        
        if i >= k - 1:
            result.append(-heap[0][0])
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3`

| i | nums[i] | deque (indices) | deque values | Window | Max |
|---|---------|-----------------|--------------|--------|-----|
| 0 | 1 | [0] | [1] | [1] | - |
| 1 | 3 | [1] | [3] | [1,3] | - |
| 2 | -1 | [1,2] | [3,-1] | [1,3,-1] | 3 |
| 3 | -3 | [1,2,3] | [3,-1,-3] | [3,-1,-3] | 3 |
| 4 | 5 | [4] | [5] | [-1,-3,5] | 5 |
| 5 | 3 | [4,5] | [5,3] | [-3,5,3] | 5 |
| 6 | 6 | [6] | [6] | [5,3,6] | 6 |
| 7 | 7 | [7] | [7] | [3,6,7] | 7 |

**Result:** `[3, 3, 5, 5, 6, 7]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each element added and removed from deque at most once.
- Amortized O(1) per element.

### Space Complexity: O(K)
- Deque stores at most k indices.

---

## Phase 6: Follow-Up Questions

1. **"What if we need minimum instead?"**
   → Change deque condition to maintain increasing order (remove larger elements).

2. **"What if k is dynamic?"**
   → More complex; may need balanced BST (like `sortedcontainers.SortedList`).

3. **"What if we need both max and min?"**
   → Use two deques simultaneously; one for max, one for min.
