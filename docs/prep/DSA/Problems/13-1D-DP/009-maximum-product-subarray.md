# Maximum Product Subarray

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 152 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find contiguous subarray with maximum product.

### Constraints & Clarifying Questions
1. **Negative numbers?** Yes, tricky with products.
2. **Zeros?** Reset product.
3. **At least one element?** Yes.
4. **Integer overflow?** Consider, but typically fits.

### Edge Cases
1. **Single element:** Return it
2. **All negatives:** Max of evens, or single
3. **Contains zero:** Splits into segments

---

## Phase 2: High-Level Approach

### Approach: Track Max and Min
Track both max and min products ending at current position (min can become max when multiplied by negative).

**Core Insight:** A negative × negative = positive, so track min too.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Find maximum product subarray.
    
    Args:
        nums: Array of integers
    
    Returns:
        Maximum product
    """
    if not nums:
        return 0
    
    result = nums[0]
    curr_max = nums[0]
    curr_min = nums[0]
    
    for i in range(1, len(nums)):
        num = nums[i]
        
        # Candidates: num, num*curr_max, num*curr_min
        temp_max = max(num, num * curr_max, num * curr_min)
        curr_min = min(num, num * curr_max, num * curr_min)
        curr_max = temp_max
        
        result = max(result, curr_max)
    
    return result


def solve_swap(nums: List[int]) -> int:
    """
    Swap approach when negative.
    """
    if not nums:
        return 0
    
    result = nums[0]
    max_prod = nums[0]
    min_prod = nums[0]
    
    for i in range(1, len(nums)):
        num = nums[i]
        
        # If negative, swap max and min
        if num < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        
        result = max(result, max_prod)
    
    return result


def solve_prefix_suffix(nums: List[int]) -> int:
    """
    Prefix and suffix products approach.
    """
    n = len(nums)
    result = float('-inf')
    
    # Left to right
    product = 1
    for i in range(n):
        product *= nums[i]
        result = max(result, product)
        if product == 0:
            product = 1
    
    # Right to left
    product = 1
    for i in range(n - 1, -1, -1):
        product *= nums[i]
        result = max(result, product)
        if product == 0:
            product = 1
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `[2, 3, -2, 4]`

| i | num | curr_max | curr_min | result |
|---|-----|----------|----------|--------|
| 0 | 2 | 2 | 2 | 2 |
| 1 | 3 | 6 | 3 | 6 |
| 2 | -2 | -2 | -12 | 6 |
| 3 | 4 | 4 | -48 | 6 |

**Subarray:** [2, 3]
**Result:** 6

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Constant variables.

---

## Phase 6: Follow-Up Questions

1. **"Return the subarray itself?"**
   → Track start/end indices when result updates.

2. **"Circular array?"**
   → Similar to max sum circular array logic.

3. **"Modular arithmetic?"**
   → Different problem (no negatives concern).
