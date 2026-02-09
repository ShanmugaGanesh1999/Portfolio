# Subarray Sum Equals K

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 560 | Prefix Sum + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count the total number of continuous subarrays whose sum equals k.

### Constraints & Clarifying Questions
1. **Can values be negative?** Yes, integers from -1000 to 1000.
2. **Can k be negative?** Yes.
3. **Can subarrays overlap in the count?** Yes, count each valid subarray.
4. **What is the maximum array length?** Up to 2 × 10^4.
5. **Does empty subarray count?** No, subarray must have at least one element.

### Edge Cases
1. **Single element equals k:** `nums = [5], k = 5` → 1
2. **All zeros, k=0:** `nums = [0,0,0], k = 0` → 6 (all possible subarrays)
3. **Negative numbers:** `nums = [1,-1,1,-1], k = 0` → 4

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Brute Force)
Check every subarray sum.
- **Time:** O(N²) or O(N³)
- **Space:** O(1)

### Option 2: Optimal (Prefix Sum + Hash Map)
If prefix_sum[j] - prefix_sum[i] = k, then subarray [i+1..j] sums to k. Store prefix sum frequencies in hash map.

**Core Insight:** For each position, count how many previous prefix sums equal (current_prefix - k); those form valid subarrays ending here.

### Why Optimal?
Transforms nested loop into single pass with O(1) hash lookups, achieving O(N) time.

---

## Phase 3: Python Code

```python
from collections import defaultdict

def solve(numbers: list[int], target_sum: int) -> int:
    """
    Count subarrays that sum to target.
    
    Args:
        numbers: Array of integers
        target_sum: Target sum to find
    
    Returns:
        Count of subarrays with sum equal to target
    """
    # Maps prefix_sum -> frequency of occurrence
    prefix_count = defaultdict(int)
    prefix_count[0] = 1  # Empty prefix (for subarrays starting at index 0)
    
    current_sum = 0
    subarray_count = 0
    
    for number in numbers:  # O(N)
        current_sum += number
        
        # How many previous prefixes satisfy: current_sum - prefix = target?
        # Those prefixes mark the START of valid subarrays ending here
        complement = current_sum - target_sum
        subarray_count += prefix_count[complement]  # O(1) lookup
        
        # Record current prefix sum
        prefix_count[current_sum] += 1  # O(1) insert
    
    return subarray_count
```

---

## Phase 4: Dry Run

**Input:** `numbers = [1, 2, 3], target_sum = 3`

**Initial:** prefix_count = {0: 1}, current_sum = 0, subarray_count = 0

| i | number | current_sum | complement | prefix_count[complement] | subarray_count | prefix_count update |
|---|--------|-------------|------------|--------------------------|----------------|---------------------|
| 0 | 1 | 1 | 1-3=-2 | 0 | 0 | {0:1, 1:1} |
| 1 | 2 | 3 | 3-3=0 | 1 | 1 | {0:1, 1:1, 3:1} |
| 2 | 3 | 6 | 6-3=3 | 1 | 2 | {0:1, 1:1, 3:1, 6:1} |

**Result:** `2`

**Verification:**
- Subarray [1,2] = sum 3 ✓ (found at i=1 via prefix_sum 0)
- Subarray [3] = sum 3 ✓ (found at i=2 via prefix_sum 3)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array with O(1) hash map operations per element.

### Space Complexity: O(N)
Hash map stores up to N distinct prefix sums in worst case.

---

## Phase 6: Follow-Up Questions

1. **"What if we need to return the actual subarrays, not just count?"**
   → Store list of indices for each prefix sum, then reconstruct subarrays from (start_index+1, end_index) pairs.

2. **"What if array is extremely long but values are bounded?"**
   → Prefix sums would still be bounded, limiting hash map size; may optimize for cache efficiency.

3. **"Can this be done with O(1) space for non-negative arrays?"**
   → Yes, use sliding window: expand when sum < k, shrink when sum > k. Only works for non-negative numbers.
