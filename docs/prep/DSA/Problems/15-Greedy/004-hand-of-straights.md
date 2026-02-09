# Hand of Straights

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 846 | Greedy + Sorting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Rearrange cards into groups of groupSize consecutive cards.

### Constraints & Clarifying Questions
1. **Consecutive = increasing by 1?** Yes.
2. **All cards must be used?** Yes.
3. **Order within groups?** Must be consecutive.
4. **Duplicates allowed?** Yes.

### Edge Cases
1. **Length not divisible by groupSize:** False
2. **Single group:** Check if consecutive
3. **All same cards:** Only if groupSize = 1

---

## Phase 2: High-Level Approach

### Approach: Greedy with Min Heap / Counter
Always start groups from smallest available card.
Use counter to track remaining cards.

**Core Insight:** Smallest card must start some group.

---

## Phase 3: Python Code

```python
from typing import List
from collections import Counter
import heapq


def solve(hand: List[int], groupSize: int) -> bool:
    """
    Check if cards can form consecutive groups.
    
    Args:
        hand: Card values
        groupSize: Size of each group
    
    Returns:
        True if possible
    """
    if len(hand) % groupSize != 0:
        return False
    
    count = Counter(hand)
    min_heap = list(count.keys())
    heapq.heapify(min_heap)
    
    while min_heap:
        first = min_heap[0]  # Smallest card
        
        # Try to form group starting from first
        for card in range(first, first + groupSize):
            if count[card] == 0:
                return False
            
            count[card] -= 1
            
            if count[card] == 0:
                # Must be the smallest, otherwise gap exists
                if card != min_heap[0]:
                    return False
                heapq.heappop(min_heap)
    
    return True


def solve_sorted(hand: List[int], groupSize: int) -> bool:
    """
    Sorting approach.
    """
    if len(hand) % groupSize != 0:
        return False
    
    count = Counter(hand)
    
    for card in sorted(count):
        while count[card] > 0:
            # Start a group from this card
            for i in range(groupSize):
                if count[card + i] <= 0:
                    return False
                count[card + i] -= 1
    
    return True


def solve_optimized(hand: List[int], groupSize: int) -> bool:
    """
    Optimized with batch processing.
    """
    if len(hand) % groupSize != 0:
        return False
    
    count = Counter(hand)
    
    for card in sorted(count):
        if count[card] > 0:
            num_groups = count[card]
            
            # Start num_groups groups from this card
            for i in range(groupSize):
                if count[card + i] < num_groups:
                    return False
                count[card + i] -= num_groups
    
    return True
```

---

## Phase 4: Dry Run

**Input:** `hand = [1,2,3,6,2,3,4,7,8], groupSize = 3`

**Count:** {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}
**Sorted keys:** [1, 2, 3, 4, 6, 7, 8]

| Card | Groups to form | Check consecutive |
|------|----------------|-------------------|
| 1 | 1 | Need 1,2,3 → counts 1,2,2 ✓ → new counts 0,1,1 |
| 2 | 1 | Need 2,3,4 → counts 1,1,1 ✓ → new counts 0,0,0 |
| 6 | 1 | Need 6,7,8 → counts 1,1,1 ✓ → new counts 0,0,0 |

**Groups formed:** [1,2,3], [2,3,4], [6,7,8]

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting + processing.

### Space Complexity: O(N)
Counter storage.

---

## Phase 6: Follow-Up Questions

1. **"Groups of any size?"**
   → Different problem; longest consecutive sequence.

2. **"Minimize leftover cards?"**
   → Greedy may not be optimal; DP needed.

3. **"Non-consecutive groups (like sets)?"**
   → Divide Players Into Teams problem.
