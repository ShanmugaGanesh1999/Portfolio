# Queue Reconstruction by Height

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 406 | Greedy + Sorting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Reconstruct queue from [h, k] where k = people in front with height >= h.

### Constraints & Clarifying Questions
1. **Height h, count k?** Yes.
2. **Valid input guaranteed?** Yes.
3. **Ties in height?** Handle by k value.
4. **Empty queue?** Return [].

### Edge Cases
1. **Single person:** Return as is
2. **All same height:** Sort by k
3. **All different heights:** k values determine positions

---

## Phase 2: High-Level Approach

### Approach: Greedy - Tallest First
Sort by height descending, then by k ascending.
Insert each person at index k (they only see taller/equal people before them).

**Core Insight:** Insert tallest first; they don't see shorter people.

---

## Phase 3: Python Code

```python
from typing import List


def solve(people: List[List[int]]) -> List[List[int]]:
    """
    Reconstruct queue by height.
    
    Args:
        people: List of [height, count_in_front]
    
    Returns:
        Reconstructed queue
    """
    # Sort: tallest first, then by k (ascending)
    people.sort(key=lambda x: (-x[0], x[1]))
    
    result = []
    
    for person in people:
        # Insert at index k
        result.insert(person[1], person)
    
    return result


def solve_verbose(people: List[List[int]]) -> List[List[int]]:
    """
    More verbose explanation.
    """
    # Sort by height descending
    # For same height, sort by k ascending
    sorted_people = sorted(people, key=lambda p: (-p[0], p[1]))
    
    queue = []
    
    for h, k in sorted_people:
        # When inserting, all people in queue are >= h
        # So k represents the exact position to insert
        queue.insert(k, [h, k])
    
    return queue


def solve_optimized(people: List[List[int]]) -> List[List[int]]:
    """
    Optimized with linked list (conceptual).
    """
    # For large inputs, using list.insert is O(n) per operation
    # Could use a balanced BST or segment tree for O(log n) insert
    
    # Sort: height descending, k ascending
    people.sort(key=lambda x: (-x[0], x[1]))
    
    result = []
    for person in people:
        result.insert(person[1], person)
    
    return result


def solve_alternative(people: List[List[int]]) -> List[List[int]]:
    """
    Alternative: shortest first approach.
    """
    people.sort(key=lambda x: (x[0], -x[1]))
    n = len(people)
    result = [None] * n
    
    for h, k in people:
        # Find k-th empty slot
        count = 0
        for i in range(n):
            if result[i] is None:
                if count == k:
                    result[i] = [h, k]
                    break
                count += 1
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]`

**Sorted:** [[7,0], [7,1], [6,1], [5,0], [5,2], [4,4]]

| Person | k | Insert at | Queue |
|--------|---|-----------|-------|
| [7,0] | 0 | 0 | [[7,0]] |
| [7,1] | 1 | 1 | [[7,0],[7,1]] |
| [6,1] | 1 | 1 | [[7,0],[6,1],[7,1]] |
| [5,0] | 0 | 0 | [[5,0],[7,0],[6,1],[7,1]] |
| [5,2] | 2 | 2 | [[5,0],[7,0],[5,2],[6,1],[7,1]] |
| [4,4] | 4 | 4 | [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] |

**Result:** [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
N inserts, each O(N) worst case.

### Space Complexity: O(N)
Result array.

---

## Phase 6: Follow-Up Questions

1. **"Optimize for large inputs?"**
   → Use segment tree for O(N log N).

2. **"People can face left or right?"**
   → More constraints; adjust counting.

3. **"3D: count people both in front AND behind?"**
   → Much more complex constraint satisfaction.
