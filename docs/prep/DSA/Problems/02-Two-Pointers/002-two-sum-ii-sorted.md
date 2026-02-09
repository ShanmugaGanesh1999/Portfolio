# Two Sum II - Input Array Is Sorted

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 167 | Two Pointers (Sorted Array) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find two numbers in a sorted array that add up to target; return their 1-indexed positions.

### Constraints & Clarifying Questions
1. **Is array sorted?** Yes, in non-decreasing order.
2. **Is there exactly one solution?** Yes, guaranteed.
3. **Can we use the same element twice?** No.
4. **Index format?** 1-indexed, not 0-indexed.
5. **Can we use extra space?** Problem asks for O(1) space.

### Edge Cases
1. **Two elements:** `numbers = [2, 7], target = 9` → [1, 2]
2. **Same values:** `numbers = [3, 3], target = 6` → [1, 2]
3. **Large array:** Solution at edges vs middle

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Map)
Same as Two Sum I, O(N) time and space.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Two Pointers)
Start with pointers at both ends. If sum < target, move left right (increase sum). If sum > target, move right left (decrease sum).

**Core Insight:** Sorted property allows binary-search-like narrowing: adjust pointers based on whether current sum is too small or too large.

### Why Optimal?
Exploits sorted order for O(1) space; hash map ignores the sorted property.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int], target: int) -> list[int]:
    """
    Find two numbers in sorted array that sum to target.
    Returns 1-indexed positions.
    
    Args:
        numbers: Sorted array of integers
        target: Target sum
    
    Returns:
        List of two 1-indexed positions [i, j] where i < j
    """
    left = 0
    right = len(numbers) - 1
    
    while left < right:  # O(N)
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # Convert to 1-indexed
        
        elif current_sum < target:
            # Need larger sum, move left pointer right
            left += 1  # O(1)
        
        else:  # current_sum > target
            # Need smaller sum, move right pointer left
            right -= 1  # O(1)
    
    return []  # No solution (shouldn't happen per constraints)


def solve_binary_search(numbers: list[int], target: int) -> list[int]:
    """
    Alternative: For each element, binary search for complement.
    """
    for i in range(len(numbers)):
        complement = target - numbers[i]
        # Binary search for complement in numbers[i+1:]
        lo, hi = i + 1, len(numbers) - 1
        
        while lo <= hi:
            mid = (lo + hi) // 2
            if numbers[mid] == complement:
                return [i + 1, mid + 1]
            elif numbers[mid] < complement:
                lo = mid + 1
            else:
                hi = mid - 1
    
    return []
```

---

## Phase 4: Dry Run

**Input:** `numbers = [2, 7, 11, 15], target = 9`

| Step | left | right | numbers[left] | numbers[right] | Sum | Action |
|------|------|-------|---------------|----------------|-----|--------|
| 1 | 0 | 3 | 2 | 15 | 17 | 17 > 9, right-- |
| 2 | 0 | 2 | 2 | 11 | 13 | 13 > 9, right-- |
| 3 | 0 | 1 | 2 | 7 | 9 | 9 == 9, found! |

**Result:** `[1, 2]` (1-indexed)

**Verification:** numbers[0] + numbers[1] = 2 + 7 = 9 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Each iteration moves either left or right pointer. Total movements ≤ N-1.

### Space Complexity: O(1)
Only two pointer variables regardless of input size.

---

## Phase 6: Follow-Up Questions

1. **"What if there could be multiple solutions?"**
   → Continue after finding one: try left++ and right-- both, collect all valid pairs.

2. **"What if we needed the sum closest to target instead of exact?"**
   → Track closest_sum and update whenever |sum - target| improves; return that pair.

3. **"How would this change if array is sorted in descending order?"**
   → Reverse the pointer movement logic: move right on sum < target, move left on sum > target.
