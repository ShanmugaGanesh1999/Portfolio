# Fruit Into Baskets

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 904 | Sliding Window |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find longest contiguous subarray with at most 2 distinct elements (pick fruits with 2 baskets, each basket holds one type).

### Constraints & Clarifying Questions
1. **How many baskets?** Exactly 2.
2. **Can we reuse basket for same type?** Yes, unlimited fruits per type.
3. **Must be contiguous?** Yes, can't skip trees.
4. **Empty array?** Return 0.
5. **All same fruit?** Return array length.

### Edge Cases
1. **Single element:** `fruits = [1]` → 1
2. **Two types:** `fruits = [1, 2, 1]` → 3
3. **Three types:** `fruits = [1, 2, 3]` → 2

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Subarrays)
For each starting position, expand until > 2 types.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Sliding Window)
Maintain window with at most 2 distinct values using hash map.

**Core Insight:** This is "longest subarray with at most K distinct elements" where K = 2.

---

## Phase 3: Python Code

```python
def solve(fruits: list[int]) -> int:
    """
    Find longest subarray with at most 2 distinct elements.
    
    Args:
        fruits: Array of fruit types
    
    Returns:
        Maximum fruits we can collect
    """
    basket = {}  # fruit_type -> count in window
    left = 0
    max_fruits = 0
    
    for right in range(len(fruits)):  # O(N)
        fruit = fruits[right]
        basket[fruit] = basket.get(fruit, 0) + 1
        
        # Shrink window while > 2 types
        while len(basket) > 2:
            left_fruit = fruits[left]
            basket[left_fruit] -= 1
            if basket[left_fruit] == 0:
                del basket[left_fruit]
            left += 1
        
        max_fruits = max(max_fruits, right - left + 1)
    
    return max_fruits


def solve_generalized(fruits: list[int], k: int = 2) -> int:
    """
    Generalized: at most k distinct elements.
    """
    from collections import defaultdict
    
    basket = defaultdict(int)
    left = 0
    max_fruits = 0
    
    for right in range(len(fruits)):
        basket[fruits[right]] += 1
        
        while len(basket) > k:
            basket[fruits[left]] -= 1
            if basket[fruits[left]] == 0:
                del basket[fruits[left]]
            left += 1
        
        max_fruits = max(max_fruits, right - left + 1)
    
    return max_fruits
```

---

## Phase 4: Dry Run

**Input:** `fruits = [1, 2, 3, 2, 2]`

| right | fruit | basket | types | left | Window | max_fruits |
|-------|-------|--------|-------|------|--------|------------|
| 0 | 1 | {1:1} | 1 | 0 | [1] | 1 |
| 1 | 2 | {1:1,2:1} | 2 | 0 | [1,2] | 2 |
| 2 | 3 | {1:1,2:1,3:1} | 3 | 0 | - | - |
| - | - | {2:1,3:1} | 2 | 2 | [3] | 2 |
| 3 | 2 | {2:2,3:1} | 2 | 2 | [3,2] | 2 |
| 4 | 2 | {2:3,3:1} | 2 | 2 | [3,2,2] | 3 |

**Result:** `3` (subarray [3, 2, 2] or equivalently indices 2-4)

**Better Example:** `fruits = [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]`
Answer: 5 (subarray [1, 2, 1, 1, 2])

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each element added/removed from window at most once.

### Space Complexity: O(1)
- Hash map has at most 3 entries at any time.

---

## Phase 6: Follow-Up Questions

1. **"What if we have K baskets?"**
   → Generalize: maintain at most K distinct in window. Same algorithm.

2. **"What if we need the actual subarray?"**
   → Track `best_left` when updating max_fruits; return `fruits[best_left:best_left + max_fruits]`.

3. **"What if fruits have weights?"**
   → Track total weight instead of count; might need deque for efficient removal.
