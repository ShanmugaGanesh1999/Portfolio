# Detect Squares

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 2013 | Math + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design class to add points and count squares containing query point.

### Constraints & Clarifying Questions
1. **Axis-aligned squares only?** Yes.
2. **Duplicate points?** Allowed, count matters.
3. **Point as corner?** Query point must be a corner.
4. **Non-zero area?** Yes.

### Edge Cases
1. **No points:** 0 squares
2. **Duplicate diagonal points:** Multiply counts
3. **Query point not added:** Still valid query

---

## Phase 2: High-Level Approach

### Approach: Hash Map with Diagonal Pairing
Store point counts. For query (x, y), find diagonal points (x', y') where |x-x'| = |y-y'|.
Check if other two corners exist.

**Core Insight:** If diagonal exists, check other two corners.

---

## Phase 3: Python Code

```python
from collections import defaultdict
from typing import List


class DetectSquares:
    """
    Detect squares with axis-aligned sides.
    """
    
    def __init__(self):
        """Initialize data structure."""
        self.point_count = defaultdict(int)  # (x, y) -> count
        self.x_to_ys = defaultdict(set)  # x -> set of y values
    
    def add(self, point: List[int]) -> None:
        """
        Add a point to the data structure.
        
        Time: O(1)
        """
        x, y = point
        self.point_count[(x, y)] += 1
        self.x_to_ys[x].add(y)
    
    def count(self, point: List[int]) -> int:
        """
        Count squares with this point as corner.
        
        Time: O(N) where N is number of distinct points
        """
        x1, y1 = point
        result = 0
        
        # Find all points on same vertical line (potential diagonal y)
        for y2 in self.x_to_ys[x1]:
            if y2 == y1:
                continue  # Need non-zero side length
            
            side = abs(y2 - y1)
            
            # Check two possible squares (left and right)
            for x2 in [x1 - side, x1 + side]:
                # Check if diagonal and third corner exist
                count_p3 = self.point_count[(x2, y1)]  # (x2, y1)
                count_p4 = self.point_count[(x2, y2)]  # (x2, y2)
                count_p2 = self.point_count[(x1, y2)]  # (x1, y2)
                
                result += count_p2 * count_p3 * count_p4
        
        return result


class DetectSquaresOptimized:
    """
    Optimized version iterating over diagonal points.
    """
    
    def __init__(self):
        self.point_count = defaultdict(int)
    
    def add(self, point: List[int]) -> None:
        self.point_count[tuple(point)] += 1
    
    def count(self, point: List[int]) -> int:
        x1, y1 = point
        result = 0
        
        # Iterate all potential diagonal points
        for (x2, y2), cnt in self.point_count.items():
            # Diagonal must form square: |x1-x2| = |y1-y2| != 0
            if abs(x1 - x2) != abs(y1 - y2) or x1 == x2:
                continue
            
            # Check other two corners
            result += cnt * self.point_count[(x1, y2)] * self.point_count[(x2, y1)]
        
        return result


# Usage example
def solve():
    ds = DetectSquares()
    ds.add([3, 10])
    ds.add([11, 2])
    ds.add([3, 2])
    print(ds.count([11, 10]))  # 1
    print(ds.count([14, 8]))   # 0
    ds.add([11, 2])
    print(ds.count([11, 10]))  # 2
```

---

## Phase 4: Dry Run

**Operations:**
1. add([3,10]), add([11,2]), add([3,2])
2. count([11,10])

**Query [11,10]:**
- Find y values at x=11: {2}
- y2=2, side=8
- Check right (x=19): No points
- Check left (x=3): 
  - (3,10) exists ✓ count=1
  - (3,2) exists ✓ count=1
  - (11,2) exists ✓ count=1
- Squares: 1 × 1 × 1 = 1

**Result:** 1

---

## Phase 5: Complexity Analysis

### add():
- **Time:** O(1)
- **Space:** O(N) total

### count():
- **Time:** O(N) per query
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Count rectangles instead?"**
   → Need two height values matching.

2. **"Rotated squares (45 degrees)?"**
   → Different diagonal relationship.

3. **"Efficient for many queries?"**
   → Precompute square counts per point.
