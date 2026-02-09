# Range Sum Query - Immutable

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 303 | Prefix Sum |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design a data structure that efficiently answers multiple range sum queries on an immutable array.

### Constraints & Clarifying Questions
1. **Will the array change after initialization?** No, it's immutable.
2. **How many queries will there be?** Up to 10^4 queries.
3. **Are query indices always valid?** Yes, 0 ≤ left ≤ right < n.
4. **What is the array size?** Up to 10^4 elements.
5. **Can values be negative?** Yes.

### Edge Cases
1. **Single element query:** `left = right = 2` → Just that element
2. **Full array query:** `left = 0, right = n-1` → Sum of all elements
3. **Array of single element:** `nums = [5]` → Only query is (0, 0)

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Per-Query Calculation)
Sum elements from left to right for each query.
- **Time:** O(N) per query, O(Q × N) total
- **Space:** O(1)

### Option 2: Optimal (Prefix Sum Array)
Precompute prefix sums during initialization. Query becomes O(1): sum(left, right) = prefix[right+1] - prefix[left].

**Core Insight:** Precompute cumulative sums once; any range sum is the difference of two prefix values.

### Why Optimal?
Amortizes computation cost across queries; O(N) preprocessing enables O(1) per query.

---

## Phase 3: Python Code

```python
class NumArray:
    """
    Range sum query data structure using prefix sums.
    Supports O(1) range sum queries after O(N) initialization.
    """
    
    def __init__(self, numbers: list[int]):
        """
        Initialize with prefix sum array.
        
        Args:
            numbers: Input array for range sum queries
        
        Time: O(N)
        Space: O(N)
        """
        n = len(numbers)
        # prefix[i] = sum of numbers[0..i-1]
        # prefix[0] = 0 (empty prefix)
        self.prefix_sums = [0] * (n + 1)  # O(N) space
        
        for i in range(n):  # O(N)
            self.prefix_sums[i + 1] = self.prefix_sums[i] + numbers[i]
    
    def sumRange(self, left: int, right: int) -> int:
        """
        Return sum of elements from index left to right (inclusive).
        
        Args:
            left: Starting index (inclusive)
            right: Ending index (inclusive)
        
        Returns:
            Sum of numbers[left..right]
        
        Time: O(1)
        """
        # sum(left, right) = prefix[right+1] - prefix[left]
        return self.prefix_sums[right + 1] - self.prefix_sums[left]  # O(1)
```

---

## Phase 4: Dry Run

**Input:** `numbers = [-2, 0, 3, -5, 2, -1]`

**Initialization (Build Prefix Sums):**

| i | numbers[i] | prefix_sums[i+1] |
|---|------------|------------------|
| — | — | prefix_sums[0] = 0 |
| 0 | -2 | 0 + (-2) = -2 |
| 1 | 0 | -2 + 0 = -2 |
| 2 | 3 | -2 + 3 = 1 |
| 3 | -5 | 1 + (-5) = -4 |
| 4 | 2 | -4 + 2 = -2 |
| 5 | -1 | -2 + (-1) = -3 |

**prefix_sums = [0, -2, -2, 1, -4, -2, -3]**

**Query Examples:**

| Query | Formula | Calculation | Result |
|-------|---------|-------------|--------|
| sumRange(0, 2) | prefix[3] - prefix[0] | 1 - 0 | 1 |
| sumRange(2, 5) | prefix[6] - prefix[2] | -3 - (-2) | -1 |
| sumRange(0, 5) | prefix[6] - prefix[0] | -3 - 0 | -3 |

**Verification:**
- sumRange(0, 2) = -2 + 0 + 3 = 1 ✓
- sumRange(2, 5) = 3 + (-5) + 2 + (-1) = -1 ✓
- sumRange(0, 5) = -2 + 0 + 3 - 5 + 2 - 1 = -3 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity:
- **Initialization:** O(N) to build prefix sum array
- **Query:** O(1) per sumRange call

### Space Complexity: O(N)
Prefix sum array stores N+1 elements.

---

## Phase 6: Follow-Up Questions

1. **"What if the array can be updated?"**
   → Use Segment Tree or Binary Indexed Tree (Fenwick Tree) for O(log N) updates and O(log N) queries.

2. **"What if we need 2D range sum queries?"**
   → Use 2D prefix sum: prefix[i][j] = sum of rectangle (0,0) to (i-1,j-1). Query uses inclusion-exclusion principle.

3. **"How would you handle overflow for very large sums?"**
   → Use 64-bit integers (Python handles this automatically), or modular arithmetic if modulo is specified.
