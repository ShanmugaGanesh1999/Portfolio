# Brick Wall

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 554 | Hash Map Edge Counting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find a vertical line through a brick wall that crosses the minimum number of bricks.

### Constraints & Clarifying Questions
1. **What counts as crossing?** Line through brick interior counts; through edge doesn't.
2. **All rows same total width?** Yes, guaranteed.
3. **Can line be at wall edges?** No, must be strictly between edges.
4. **What if multiple optimal lines?** Return any minimum count.
5. **Maximum wall dimensions?** Up to 2 × 10^4 rows.

### Edge Cases
1. **Single brick per row:** `wall = [[3], [3], [3]]` → 3 (must cross all)
2. **Aligned edges:** `wall = [[1,1,1], [1,1,1]]` → 0
3. **No common edges:** Every row has different edge positions → number of rows

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Positions)
For each possible x-coordinate, count bricks crossed.
- **Time:** O(N × W) where W is wall width
- **Space:** O(1)

### Option 2: Optimal (Count Edge Positions)
Count how many rows have an edge at each x-coordinate. Line through position with most edges crosses fewest bricks.

**Core Insight:** Minimize bricks crossed = Maximize edges passed through. Total rows - max edges at any position.

### Why Optimal?
Only counts actual edge positions, not all possible x-coordinates. Time is O(total bricks).

---

## Phase 3: Python Code

```python
from collections import defaultdict

def solve(wall: list[list[int]]) -> int:
    """
    Find minimum bricks crossed by any vertical line.
    
    Args:
        wall: 2D list where each inner list represents brick widths in a row
    
    Returns:
        Minimum number of bricks a vertical line must cross
    """
    # Count how many rows have an edge at each x-coordinate
    edge_count = defaultdict(int)  # O(total bricks) space
    
    for row in wall:  # O(rows)
        edge_position = 0
        
        # Don't count the last brick (that's the wall's right edge)
        for brick_width in row[:-1]:  # O(bricks in row)
            edge_position += brick_width
            edge_count[edge_position] += 1  # O(1)
    
    # If no internal edges, line must cross all rows
    if not edge_count:
        return len(wall)
    
    # Minimum crossed = total rows - maximum edges at any position
    max_edges = max(edge_count.values())  # O(unique edges)
    return len(wall) - max_edges


def solve_explicit(wall: list[list[int]]) -> int:
    """
    Alternative with explicit edge tracking for clarity.
    """
    from collections import Counter
    
    edges = []
    
    for row in wall:
        x = 0
        for brick in row[:-1]:  # Exclude last edge
            x += brick
            edges.append(x)
    
    if not edges:
        return len(wall)
    
    edge_freq = Counter(edges)
    return len(wall) - edge_freq.most_common(1)[0][1]
```

---

## Phase 4: Dry Run

**Input:**
```
wall = [
    [1, 2, 2, 1],  # Edges at: 1, 3, 5
    [3, 1, 2],     # Edges at: 3, 4
    [1, 3, 2],     # Edges at: 1, 4
    [2, 4],        # Edges at: 2
    [3, 1, 2],     # Edges at: 3, 4
    [1, 3, 1, 1]   # Edges at: 1, 4, 5
]
```

**Build Edge Count:**

| Row | Brick Widths | Edge Positions (cumulative) |
|-----|--------------|----------------------------|
| 0 | [1,2,2,1] | 1, 3, 5 |
| 1 | [3,1,2] | 3, 4 |
| 2 | [1,3,2] | 1, 4 |
| 3 | [2,4] | 2 |
| 4 | [3,1,2] | 3, 4 |
| 5 | [1,3,1,1] | 1, 4, 5 |

**edge_count:** {1:3, 3:3, 5:2, 4:4, 2:1}

**max_edges:** 4 (at position x=4)

**Result:** 6 - 4 = **2**

**Verification:** Line at x=4 crosses only 2 bricks (rows 0 and 3) ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Where N is total number of bricks. Each brick is processed once to accumulate edge positions.

### Space Complexity: O(E)
Where E is the number of unique edge positions (≤ N-rows since each row contributes at most bricks-1 edges).

---

## Phase 6: Follow-Up Questions

1. **"What if we needed the actual x-coordinate of the optimal line?"**
   → Track the position with maximum edges: `max(edge_count, key=edge_count.get)`.

2. **"What if bricks could have fractional widths?"**
   → Use floating point positions; works the same way since we're comparing equality.

3. **"What if we wanted top K positions that cross fewest bricks?"**
   → Sort `edge_count.values()` descending, take top K positions; O(E log E) for sorting.
