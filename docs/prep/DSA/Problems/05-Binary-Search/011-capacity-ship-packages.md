# Capacity To Ship Packages

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1011 | Binary Search on Answer |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum ship capacity to ship all packages within D days. Must ship in order.

### Constraints & Clarifying Questions
1. **Must ship in order?** Yes, can't reorder packages.
2. **Ship multiple packages per day?** Yes, if within capacity.
3. **Single package must fit?** Yes, capacity ≥ max(weights).
4. **Can split a package?** No.
5. **D guaranteed sufficient?** Yes, D ≤ len(weights).

### Edge Cases
1. **D = len(weights):** Capacity = max(weights).
2. **D = 1:** Capacity = sum(weights).
3. **All same weight:** Capacity = weight × ceil(n/D).

---

## Phase 2: High-Level Approach

### Approach: Binary Search on Capacity
Search for minimum capacity in range [max(weights), sum(weights)].

**Core Insight:** If capacity C works, any capacity > C also works. Binary search finds minimum.

---

## Phase 3: Python Code

```python
def solve(weights: list[int], days: int) -> int:
    """
    Find minimum ship capacity to ship all packages in given days.
    
    Args:
        weights: Package weights in order
        days: Number of days available
    
    Returns:
        Minimum ship capacity needed
    """
    def days_needed(capacity: int) -> int:
        """Calculate days needed with given capacity."""
        total_days = 1
        current_load = 0
        
        for weight in weights:
            if current_load + weight > capacity:
                total_days += 1
                current_load = weight
            else:
                current_load += weight
        
        return total_days
    
    # Search range: [max weight, total weight]
    left, right = max(weights), sum(weights)
    
    while left < right:  # O(log(sum - max))
        mid = left + (right - left) // 2
        
        if days_needed(mid) <= days:  # O(N)
            right = mid  # Valid, try smaller
        else:
            left = mid + 1  # Need more capacity
    
    return left


def solve_verbose(weights: list[int], days: int) -> int:
    """
    More explicit version with result tracking.
    """
    def can_ship(capacity: int) -> bool:
        """Check if we can ship with given capacity in 'days' days."""
        current_days = 1
        current_weight = 0
        
        for w in weights:
            if w > capacity:
                return False  # Single package too heavy
            
            if current_weight + w > capacity:
                current_days += 1
                current_weight = w
                if current_days > days:
                    return False
            else:
                current_weight += w
        
        return True
    
    left, right = max(weights), sum(weights)
    result = right
    
    while left <= right:
        mid = (left + right) // 2
        
        if can_ship(mid):
            result = mid
            right = mid - 1
        else:
            left = mid + 1
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5`

sum = 55, max = 10

| left | right | mid | days_needed | Action |
|------|-------|-----|-------------|--------|
| 10 | 55 | 32 | 2 | 2 ≤ 5, right = 32 |
| 10 | 32 | 21 | 3 | 3 ≤ 5, right = 21 |
| 10 | 21 | 15 | 5 | 5 ≤ 5, right = 15 |
| 10 | 15 | 12 | 6 | 6 > 5, left = 13 |
| 13 | 15 | 14 | 6 | 6 > 5, left = 15 |
| 15 | 15 | - | - | left = right, return 15 |

**Verification with capacity=15:**
- Day 1: 1+2+3+4+5 = 15
- Day 2: 6+7 = 13 (can't add 8: 13+8=21>15)
- Day 3: 8 (can't add 9: 8+9=17>15)
- Day 4: 9
- Day 5: 10
→ 5 days ✓

**Result:** `15`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × log(sum - max))
- Binary search: O(log(sum - max)) iterations.
- Each iteration: O(N) to check feasibility.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What if we can reorder packages?"**
   → Different problem (bin packing variant); NP-hard but greedy approximations exist.

2. **"What if ship has multiple compartments?"**
   → More complex; need to track compartment usage.

3. **"Minimize days given fixed capacity?"**
   → Single pass greedy: fill each day as much as possible.
