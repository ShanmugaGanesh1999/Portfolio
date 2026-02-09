# 3Sum Closest

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 16 | Sort + Two Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find three integers in array whose sum is closest to target; return the sum.

### Constraints & Clarifying Questions
1. **Is there exactly one solution?** Yes, unique closest sum guaranteed.
2. **Array length?** At least 3 elements.
3. **Value range?** -1000 to 1000.
4. **Can we have exact match?** Yes, if triplet sums exactly to target, return it.
5. **Maximum array size?** Up to 500.

### Edge Cases
1. **Exact match:** `nums = [-1, 2, 1, -4], target = 2` → 2 (-1+2+1)
2. **Three elements:** `nums = [0, 0, 0], target = 1` → 0
3. **All equal distance:** Pick any one

---

## Phase 2: High-Level Approach

### Option 1: Naïve (All Triplets)
Check all O(N³) triplets.
- **Time:** O(N³)
- **Space:** O(1)

### Option 2: Optimal (Sort + Two Pointers)
Sort array. For each first element, use two pointers to find pair closest to (target - first). Track minimum distance seen.

**Core Insight:** Same as 3Sum but instead of finding exact sum, track closest. Can return early if exact match found.

### Why Optimal?
Reduces to O(N²) by using sorted two-pointer technique for inner search.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int], target: int) -> int:
    """
    Find triplet sum closest to target.
    
    Args:
        numbers: Array of integers
        target: Target sum to approach
    
    Returns:
        Sum of triplet closest to target
    """
    numbers.sort()  # O(N log N)
    n = len(numbers)
    closest_sum = numbers[0] + numbers[1] + numbers[2]  # Initialize with first triplet
    
    for i in range(n - 2):  # O(N)
        # Skip duplicates for minor optimization (not required for correctness)
        if i > 0 and numbers[i] == numbers[i - 1]:
            continue
        
        left = i + 1
        right = n - 1
        
        while left < right:  # O(N) per i
            current_sum = numbers[i] + numbers[left] + numbers[right]
            
            # Early termination if exact match
            if current_sum == target:
                return target
            
            # Update closest if this sum is nearer
            if abs(current_sum - target) < abs(closest_sum - target):
                closest_sum = current_sum
            
            # Adjust pointers to get closer to target
            if current_sum < target:
                left += 1  # Need larger sum
            else:
                right -= 1  # Need smaller sum
    
    return closest_sum
```

---

## Phase 4: Dry Run

**Input:** `numbers = [-1, 2, 1, -4], target = 1`

**After sorting:** `[-4, -1, 1, 2]`

**Initial:** closest_sum = -4 + (-1) + 1 = -4

| i | numbers[i] | left | right | Sum | Distance | Update | Pointer |
|---|------------|------|-------|-----|----------|--------|---------|
| 0 | -4 | 1 | 3 | -4+(-1)+2=-3 | \|-3-1\|=4 | -3 (4<5) | L++ |
| 0 | -4 | 2 | 3 | -4+1+2=-1 | \|-1-1\|=2 | -1 (2<4) | L++ |
| 0 | -4 | 3 | 3 | — | — | — | Next i |
| 1 | -1 | 2 | 3 | -1+1+2=2 | \|2-1\|=1 | 2 (1<2) | R-- |
| 1 | -1 | 2 | 2 | — | — | — | Next i |
| 2 | 1 | 3 | 3 | — | — | — | Done |

**Result:** `2`

**Verification:** Triplet (-1, 1, 2) sums to 2, distance |2-1|=1 is minimum ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
- Sorting: O(N log N)
- Outer loop: O(N)
- Inner two-pointer: O(N) per iteration
- Total: O(N²)

### Space Complexity: O(1) or O(log N)
- O(1) for pointers and tracking
- O(log N) to O(N) for sorting depending on implementation

---

## Phase 6: Follow-Up Questions

1. **"What if there are multiple sums with same closest distance?"**
   → Problem states unique answer exists; if not, we could return any or all such sums.

2. **"How would you return the actual triplet instead of just the sum?"**
   → Track `best_triplet = [numbers[i], numbers[left], numbers[right]]` when updating closest.

3. **"What if we need k numbers closest to target?"**
   → Generalize with k-1 nested loops + two pointers for last pair. O(N^(k-1)) time.
