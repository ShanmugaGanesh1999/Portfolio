# Top K Frequent Elements

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 347 | Bucket Sort / Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return the k most frequently occurring elements in an integer array.

### Constraints & Clarifying Questions
1. **Is k always valid?** Yes, k is between 1 and the number of unique elements.
2. **Can there be ties in frequency?** Yes, but answer is guaranteed to be unique.
3. **Does the order of output matter?** No, any order is acceptable.
4. **What is the maximum array size?** Up to 10^5 elements.
5. **Can we modify the input array?** Assume yes.

### Edge Cases
1. **k equals unique elements:** `nums = [1,2,3], k = 3` → Return all elements
2. **Single element:** `nums = [1], k = 1` → `[1]`
3. **All same frequency:** `nums = [1,2,3,4], k = 2` → Any 2 elements valid

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Sort by Frequency)
Count frequencies with hash map, sort all entries by frequency, take top k.
- **Time:** O(N log N)
- **Space:** O(N)

### Option 2: Optimal (Bucket Sort)
Count frequencies, then use array of buckets where index = frequency. Iterate from highest frequency bucket downward to collect top k.

**Core Insight:** Frequencies are bounded by N (max possible frequency), so bucket sort achieves linear time without comparison-based sorting.

### Why Optimal?
Eliminates O(N log N) sorting by exploiting bounded frequency range [1, N]; bucket collection is O(N).

---

## Phase 3: Python Code

```python
from collections import Counter

def solve(numbers: list[int], k: int) -> list[int]:
    """
    Find k most frequent elements using bucket sort.
    
    Args:
        numbers: List of integers
        k: Number of top frequent elements to return
    
    Returns:
        List of k most frequent elements
    """
    # Count frequency of each number - O(N) time, O(N) space
    frequency_map = Counter(numbers)
    
    # Buckets indexed by frequency (index 0 unused)
    # buckets[i] contains all numbers that appear i times
    buckets = [[] for _ in range(len(numbers) + 1)]  # O(N) space
    
    for number, frequency in frequency_map.items():  # O(unique elements)
        buckets[frequency].append(number)
    
    # Collect top k from highest frequency buckets downward
    result = []
    for frequency in range(len(buckets) - 1, 0, -1):  # O(N) total iterations
        for number in buckets[frequency]:
            result.append(number)
            if len(result) == k:  # Early termination
                return result
    
    return result


def solve_heap(numbers: list[int], k: int) -> list[int]:
    """
    Alternative using min-heap of size k.
    Better when k << N.
    """
    import heapq
    
    frequency_map = Counter(numbers)
    
    # Min-heap keeps k largest frequencies
    # Push (frequency, number) pairs
    return heapq.nlargest(k, frequency_map.keys(), key=frequency_map.get)
```

---

## Phase 4: Dry Run

**Input:** `numbers = [1,1,1,2,2,3], k = 2`

**Step 1: Build frequency map**
```
frequency_map = {1: 3, 2: 2, 3: 1}
```

**Step 2: Populate buckets**
```
buckets[0] = []
buckets[1] = [3]      # 3 appears 1 time
buckets[2] = [2]      # 2 appears 2 times
buckets[3] = [1]      # 1 appears 3 times
buckets[4] = []
buckets[5] = []
buckets[6] = []
```

**Step 3: Collect from highest frequency**

| Frequency | Bucket Contents | result | len(result) == k? |
|-----------|-----------------|--------|-------------------|
| 6 | [] | [] | No |
| 5 | [] | [] | No |
| 4 | [] | [] | No |
| 3 | [1] | [1] | No |
| 2 | [2] | [1, 2] | Yes → Return |

**Result:** `[1, 2]`

**Correctness:** 1 appears 3 times, 2 appears 2 times → Top 2 frequent ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Counting frequencies: O(N)
- Creating buckets: O(N)
- Filling buckets: O(unique elements) ≤ O(N)
- Collecting k elements: O(N) worst case
- Total: O(N)

### Space Complexity: O(N)
- Frequency map: O(N) for up to N unique elements
- Buckets array: O(N) slots
- Result: O(k) ⊆ O(N)

---

## Phase 6: Follow-Up Questions

1. **"What if k is very small compared to N?"**
   → Use min-heap of size k: O(N log k) time, O(k) space; more efficient when k << N.

2. **"What if we need top k in sorted order by frequency?"**
   → After bucket collection, frequencies are naturally sorted (high to low); for ascending, reverse the result.

3. **"How would you handle a continuous stream of numbers?"**
   → Use a hash map for frequencies plus a balanced BST or heap keyed by frequency; supports O(log N) updates and O(k) queries.
