# Sort Colors

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 75 | Dutch National Flag / Three-Way Partition |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Sort an array containing only 0s, 1s, and 2s in-place with a single pass.

### Constraints & Clarifying Questions
1. **Must it be single pass?** Yes, O(N) time with O(1) space.
2. **Can we use built-in sort?** Not optimal; problem asks for one-pass.
3. **What is the input format?** Array of integers: 0, 1, or 2.
4. **Can array be empty?** Yes, handle gracefully.
5. **Are values guaranteed to be only 0, 1, 2?** Yes.

### Edge Cases
1. **Single element:** `nums = [2]` → `[2]`
2. **Already sorted:** `nums = [0, 0, 1, 1, 2, 2]` → No change needed
3. **Reverse sorted:** `nums = [2, 2, 1, 1, 0, 0]` → Requires full rearrangement

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Counting Sort)
Count 0s, 1s, 2s, then overwrite array.
- **Time:** O(N)
- **Space:** O(1)
- **Passes:** Two (count, then fill)

### Option 2: Optimal (Dutch National Flag)
Three pointers: low (boundary for 0s), mid (current), high (boundary for 2s). Move 0s to left of low, 2s to right of high, 1s stay in middle.

**Core Insight:** Maintain three regions [0..low-1]=0s, [low..mid-1]=1s, [high+1..n-1]=2s, process elements at mid.

### Why Optimal?
Single pass through array with O(1) space; each element is examined at most twice (when swapped).

---

## Phase 3: Python Code

```python
def solve(colors: list[int]) -> None:
    """
    Sort array of 0s, 1s, 2s in-place using Dutch National Flag algorithm.
    
    Args:
        colors: Array to sort in-place (modified directly)
    
    Returns:
        None (modifies input array)
    """
    low = 0                    # Boundary: everything left of low is 0
    mid = 0                    # Current element being examined
    high = len(colors) - 1     # Boundary: everything right of high is 2
    
    while mid <= high:  # O(N) - each element processed at most twice
        if colors[mid] == 0:
            # Move 0 to the low region
            colors[low], colors[mid] = colors[mid], colors[low]  # O(1) swap
            low += 1
            mid += 1  # Safe to advance - swapped element was already processed
        
        elif colors[mid] == 1:
            # 1 is in correct region, just advance
            mid += 1  # O(1)
        
        else:  # colors[mid] == 2
            # Move 2 to the high region
            colors[mid], colors[high] = colors[high], colors[mid]  # O(1) swap
            high -= 1
            # Don't advance mid - need to examine swapped element


def solve_counting(colors: list[int]) -> None:
    """
    Two-pass counting sort approach.
    """
    count = [0, 0, 0]
    
    for color in colors:
        count[color] += 1
    
    idx = 0
    for color in range(3):
        for _ in range(count[color]):
            colors[idx] = color
            idx += 1
```

---

## Phase 4: Dry Run

**Input:** `colors = [2, 0, 2, 1, 1, 0]`

**Initial:** low=0, mid=0, high=5

| Step | mid | colors[mid] | Action | Array State | low | mid | high |
|------|-----|-------------|--------|-------------|-----|-----|------|
| 1 | 0 | 2 | Swap with high, high-- | [0,0,2,1,1,2] | 0 | 0 | 4 |
| 2 | 0 | 0 | Swap with low, low++, mid++ | [0,0,2,1,1,2] | 1 | 1 | 4 |
| 3 | 1 | 0 | Swap with low, low++, mid++ | [0,0,2,1,1,2] | 2 | 2 | 4 |
| 4 | 2 | 2 | Swap with high, high-- | [0,0,1,1,2,2] | 2 | 2 | 3 |
| 5 | 2 | 1 | mid++ | [0,0,1,1,2,2] | 2 | 3 | 3 |
| 6 | 3 | 1 | mid++ | [0,0,1,1,2,2] | 2 | 4 | 3 |
| 7 | — | — | mid > high, exit | [0,0,1,1,2,2] | — | — | — |

**Result:** `[0, 0, 1, 1, 2, 2]`

**Correctness:** Array sorted with 0s first, then 1s, then 2s ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through the array. While mid may not advance on every iteration (when swapping with high), high decreases instead. Total operations: N.

### Space Complexity: O(1)
Only three pointer variables regardless of input size. In-place modification of input array.

---

## Phase 6: Follow-Up Questions

1. **"How would you extend this to k colors?"**
   → Use counting sort or recursive Dutch National Flag partitioning; general k-way partition is O(kN).

2. **"What if the array is too large for memory?"**
   → External sort with multiple passes, or parallel bucket-based counting across distributed systems.

3. **"What if we need to maintain relative order of equal elements (stable sort)?"**
   → Dutch National Flag is not stable; would need to use indices array and sort by (color, original_index) pairs.
