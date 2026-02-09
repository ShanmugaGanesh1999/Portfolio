# Product of Array Except Self

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 238 | Prefix/Suffix Products |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return an array where each element is the product of all elements in the original array except the element at that index, without using division.

### Constraints & Clarifying Questions
1. **Can we use division?** No, division operation is not allowed.
2. **Are there zeros in the array?** Yes, zeros are possible.
3. **What is the expected time complexity?** O(N).
4. **Can we use extra space?** Output array doesn't count; prefer O(1) auxiliary.
5. **What is the value range?** -30 to 30, so products fit in 32-bit int.

### Edge Cases
1. **Contains one zero:** `nums = [1,2,0,4]` → Only position of zero has non-zero product
2. **Contains multiple zeros:** `nums = [0,0,1]` → All products are 0
3. **Two elements:** `nums = [a, b]` → `[b, a]`

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Nested Loops)
For each index, multiply all other elements.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Prefix × Suffix)
For each position, result = (product of all left elements) × (product of all right elements). Compute prefix products in forward pass, suffix products in backward pass.

**Core Insight:** answer[i] = prefix[0..i-1] × suffix[i+1..n-1]. Build these incrementally in two passes.

### Why Optimal?
Avoids division by decomposing each product into independent prefix and suffix components, computed in O(N) time.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> list[int]:
    """
    Compute product of all elements except self without division.
    
    Args:
        numbers: Input array of integers
    
    Returns:
        Array where result[i] = product of all numbers except numbers[i]
    """
    n = len(numbers)
    result = [1] * n  # O(N) space (counts as output, not auxiliary)
    
    # Forward pass: result[i] = product of elements to the LEFT of i
    prefix_product = 1
    for i in range(n):  # O(N)
        result[i] = prefix_product
        prefix_product *= numbers[i]  # Build prefix for next position
    
    # Backward pass: multiply by product of elements to the RIGHT of i
    suffix_product = 1
    for i in range(n - 1, -1, -1):  # O(N)
        result[i] *= suffix_product
        suffix_product *= numbers[i]  # Build suffix for next position
    
    return result


def solve_explicit_arrays(numbers: list[int]) -> list[int]:
    """
    Explicit prefix/suffix arrays for clarity.
    Uses O(N) extra space.
    """
    n = len(numbers)
    
    prefix = [1] * n
    suffix = [1] * n
    
    for i in range(1, n):
        prefix[i] = prefix[i-1] * numbers[i-1]
    
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i+1] * numbers[i+1]
    
    return [prefix[i] * suffix[i] for i in range(n)]
```

---

## Phase 4: Dry Run

**Input:** `numbers = [1, 2, 3, 4]`

**Forward Pass (building prefix products):**

| i | numbers[i] | prefix_product (before) | result[i] | prefix_product (after) |
|---|------------|-------------------------|-----------|------------------------|
| 0 | 1 | 1 | 1 | 1×1=1 |
| 1 | 2 | 1 | 1 | 1×2=2 |
| 2 | 3 | 2 | 2 | 2×3=6 |
| 3 | 4 | 6 | 6 | 6×4=24 |

After forward: `result = [1, 1, 2, 6]`

**Backward Pass (multiplying suffix products):**

| i | numbers[i] | suffix_product (before) | result[i] | suffix_product (after) |
|---|------------|-------------------------|-----------|------------------------|
| 3 | 4 | 1 | 6×1=6 | 1×4=4 |
| 2 | 3 | 4 | 2×4=8 | 4×3=12 |
| 1 | 2 | 12 | 1×12=12 | 12×2=24 |
| 0 | 1 | 24 | 1×24=24 | 24×1=24 |

**Final Result:** `[24, 12, 8, 6]`

**Verification:**
- result[0] = 2×3×4 = 24 ✓
- result[1] = 1×3×4 = 12 ✓
- result[2] = 1×2×4 = 8 ✓
- result[3] = 1×2×3 = 6 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Two linear passes through the array: one forward, one backward. Each pass is O(N), total O(2N) = O(N).

### Space Complexity: O(1) auxiliary
Result array is required output and doesn't count. Only two variables (prefix_product, suffix_product) used for computation.

---

## Phase 6: Follow-Up Questions

1. **"What if division was allowed?"**
   → Compute total product, then result[i] = total / nums[i]. Handle zeros specially: if one zero, only that position is non-zero; if multiple zeros, all are zero.

2. **"What if array has very large numbers causing overflow?"**
   → Use arbitrary precision integers (Python handles this), or compute in log-space (sum of logs) and exponentiate.

3. **"How would you parallelize this?"**
   → Divide array into chunks, compute local prefix/suffix in parallel, then combine at boundaries; requires coordination at chunk borders.
