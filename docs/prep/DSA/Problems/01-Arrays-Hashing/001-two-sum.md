# Two Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 1 | Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Given an array of integers and a target sum, find the indices of two numbers that add up to the target.

### Constraints & Clarifying Questions
1. **Are there always exactly two numbers that sum to target?** Assume yes, exactly one valid solution exists.
2. **Can we use the same element twice?** No, each element can only be used once.
3. **Are there duplicate values in the array?** Yes, duplicates are possible but won't affect the single valid solution.
4. **What is the maximum input size?** Up to 10^4 elements.
5. **Can values be negative?** Yes, integers range from -10^9 to 10^9.

### Edge Cases
1. **Minimum input:** `nums = [3, 3], target = 6` → Two identical values that sum to target
2. **Negative numbers:** `nums = [-1, -2, -3, -4, -5], target = -8` → Handle negative arithmetic
3. **Large gap indices:** `nums = [2, 7, 11, 15], target = 17` → Answer at positions 0 and 3 (non-adjacent)

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Brute Force)
Check every pair of elements using nested loops to find the pair that sums to target.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Hash Map)
Use a hash map to store each number's index as we iterate. For each element, check if `target - current` exists in the map. If yes, we found our pair; if no, store the current element.

**Core Insight:** Instead of searching for complement in remaining array (O(N) per element), we achieve O(1) lookup using a hash map.

### Why Optimal?
Eliminates nested iteration by trading O(1) hash map lookup time for O(N) auxiliary space, reducing time complexity from O(N²) to O(N).

---

## Phase 3: Python Code

```python
def solve(numbers: list[int], target: int) -> list[int]:
    """
    Find indices of two numbers that add up to target.
    
    Args:
        numbers: List of integers to search
        target: Target sum to achieve
    
    Returns:
        List containing exactly two indices [i, j] where numbers[i] + numbers[j] == target
    """
    # Maps number value -> its index for O(1) complement lookup
    value_to_index = {}  # O(N) space
    
    for current_index, current_value in enumerate(numbers):  # O(N) iteration
        complement = target - current_value
        
        # Check if complement was seen before
        if complement in value_to_index:  # O(1) lookup
            return [value_to_index[complement], current_index]
        
        # Store current value's index for future lookups
        value_to_index[current_value] = current_index  # O(1) insertion
    
    # Problem guarantees a solution exists; this line is defensive
    return []
```

---

## Phase 4: Dry Run

**Input:** `numbers = [2, 7, 11, 15], target = 9`

| Iteration | current_index | current_value | complement | complement in map? | value_to_index | Action |
|-----------|---------------|---------------|------------|-------------------|----------------|--------|
| 0 | 0 | 2 | 7 | No (map empty) | {2: 0} | Store 2 |
| 1 | 1 | 7 | 2 | Yes (index 0) | — | Return [0, 1] |

**Trace:**
1. **Initial state:** `value_to_index = {}`
2. **i=0:** complement = 9-2 = 7, not in map → store {2: 0}
3. **i=1:** complement = 9-7 = 2, found at index 0 → return [0, 1]

**Termination:** Returns immediately when complement is found.
**Correctness:** numbers[0] + numbers[1] = 2 + 7 = 9 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through the array with O(1) hash map operations (lookup and insertion) per element. Total: N × O(1) = O(N).

### Space Complexity: O(N)
Hash map stores up to N key-value pairs in the worst case (when solution involves last two elements). No other auxiliary structures used.

---

## Phase 6: Follow-Up Questions

1. **"What if the array is sorted?"**
   → Use two pointers from both ends: if sum < target, move left pointer right; if sum > target, move right pointer left. Achieves O(N) time with O(1) space.

2. **"What if we need to find all pairs that sum to target?"**
   → Modify to continue iterating after finding a pair, collecting all valid pairs; handle duplicates by using a frequency map instead of simple index storage.

3. **"What if the input is a stream of numbers?"**
   → Maintain a running hash map; for each new number, check if complement exists and output the pair; this supports online processing with O(1) per query.
