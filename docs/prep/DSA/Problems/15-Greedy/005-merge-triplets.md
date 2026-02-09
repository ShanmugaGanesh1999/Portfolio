# Merge Triplets to Form Target Triplet

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1899 | Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Can we merge triplets using max operation to get target triplet?

### Constraints & Clarifying Questions
1. **Merge = element-wise max?** Yes.
2. **Use any subset?** Yes, any number of triplets.
3. **Order matters?** No, max is commutative.
4. **Empty triplets?** At least one given.

### Edge Cases
1. **Target exists in triplets:** True
2. **All triplets exceed target somewhere:** False
3. **Need multiple triplets:** Combine valid ones

---

## Phase 2: High-Level Approach

### Approach: Greedy - Valid Triplets Only
A triplet is valid if all elements ≤ corresponding target elements.
Check if valid triplets can cover all target positions.

**Core Insight:** Any element > target[i] would ruin that position forever.

---

## Phase 3: Python Code

```python
from typing import List


def solve(triplets: List[List[int]], target: List[int]) -> bool:
    """
    Check if triplets can merge to form target.
    
    Args:
        triplets: List of [a, b, c] triplets
        target: Target [x, y, z]
    
    Returns:
        True if achievable
    """
    # Track which target positions we can achieve
    achieved = [False, False, False]
    
    for triplet in triplets:
        # Skip if any element exceeds target
        if triplet[0] > target[0] or triplet[1] > target[1] or triplet[2] > target[2]:
            continue
        
        # This triplet is valid, mark which positions it can contribute
        for i in range(3):
            if triplet[i] == target[i]:
                achieved[i] = True
    
    return all(achieved)


def solve_set(triplets: List[List[int]], target: List[int]) -> bool:
    """
    Using set to track achieved positions.
    """
    achieved = set()
    
    for a, b, c in triplets:
        # Skip invalid triplets
        if a > target[0] or b > target[1] or c > target[2]:
            continue
        
        if a == target[0]:
            achieved.add(0)
        if b == target[1]:
            achieved.add(1)
        if c == target[2]:
            achieved.add(2)
        
        if len(achieved) == 3:
            return True
    
    return len(achieved) == 3


def solve_explicit(triplets: List[List[int]], target: List[int]) -> bool:
    """
    More explicit version.
    """
    can_get_x = False
    can_get_y = False
    can_get_z = False
    
    for triplet in triplets:
        a, b, c = triplet
        x, y, z = target
        
        # Valid triplet: no element exceeds target
        if a <= x and b <= y and c <= z:
            if a == x:
                can_get_x = True
            if b == y:
                can_get_y = True
            if c == z:
                can_get_z = True
    
    return can_get_x and can_get_y and can_get_z
```

---

## Phase 4: Dry Run

**Input:** `triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]`

| Triplet | Valid? | Contributes |
|---------|--------|-------------|
| [2,5,3] | 2≤2, 5≤7, 3≤5 ✓ | pos 0 (a=2) |
| [1,8,4] | 1≤2, 8>7 ✗ | Skip |
| [1,7,5] | 1≤2, 7≤7, 5≤5 ✓ | pos 1 (b=7), pos 2 (c=5) |

**Achieved:** {0, 1, 2}

**Merge:** max([2,5,3], [1,7,5]) = [2,7,5] = target ✓

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through triplets.

### Space Complexity: O(1)
Constant tracking variables.

---

## Phase 6: Follow-Up Questions

1. **"Return which triplets to use?"**
   → Track indices contributing to each position.

2. **"Minimum triplets needed?"**
   → Greedy: find triplet covering most positions first.

3. **"N-tuples instead of triplets?"**
   → Same logic, just more positions to track.
