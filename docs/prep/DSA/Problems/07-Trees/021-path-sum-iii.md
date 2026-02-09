# Path Sum III

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 437 | Tree / Prefix Sum |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count paths where sum equals targetSum. Path can start and end at any node (going downward).

### Constraints & Clarifying Questions
1. **Must path go down?** Yes, parent to child direction.
2. **Single node counts?** Yes, if value == target.
3. **Negative values?** Yes.
4. **Overlapping paths?** Count separately.

### Edge Cases
1. **Empty tree:** 0
2. **All nodes equal target:** Count each
3. **Target = 0 with sum canceling:** Count subpaths summing to 0

---

## Phase 2: High-Level Approach

### Approach: Prefix Sum
Use prefix sum to find subarray sums in O(1). Track prefix sums from root; if currentSum - targetSum exists in map, we found a valid path.

**Core Insight:** Same technique as "subarray sum equals k" applied to tree paths.

---

## Phase 3: Python Code

```python
from collections import defaultdict

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode, targetSum: int) -> int:
    """
    Count paths summing to targetSum using prefix sum.
    
    Args:
        root: Tree root
        targetSum: Target sum
    
    Returns:
        Number of valid paths
    """
    prefix_sum_count = defaultdict(int)
    prefix_sum_count[0] = 1  # Empty path
    
    def dfs(node: TreeNode, current_sum: int) -> int:
        if not node:
            return 0
        
        current_sum += node.val
        
        # Count paths ending at this node
        count = prefix_sum_count[current_sum - targetSum]
        
        # Add current prefix sum
        prefix_sum_count[current_sum] += 1
        
        # Recurse
        count += dfs(node.left, current_sum)
        count += dfs(node.right, current_sum)
        
        # Backtrack (remove current prefix sum)
        prefix_sum_count[current_sum] -= 1
        
        return count
    
    return dfs(root, 0)


def solve_naive(root: TreeNode, targetSum: int) -> int:
    """
    Naive: For each node, count paths starting there.
    O(N^2) time.
    """
    def count_paths_from(node, remaining):
        if not node:
            return 0
        
        count = 1 if node.val == remaining else 0
        count += count_paths_from(node.left, remaining - node.val)
        count += count_paths_from(node.right, remaining - node.val)
        return count
    
    if not root:
        return 0
    
    return (count_paths_from(root, targetSum) +
            solve_naive(root.left, targetSum) +
            solve_naive(root.right, targetSum))
```

---

## Phase 4: Dry Run

**Input:**
```
      10
     /  \
    5   -3
   / \    \
  3   2    11
 / \   \
3  -2   1
```
targetSum = 8

**Prefix Sum Approach:**

| Node | currentSum | Look for | Found | Count |
|------|------------|----------|-------|-------|
| 10 | 10 | 10-8=2 | 0 | 0 |
| 5 | 15 | 15-8=7 | 0 | 0 |
| 3 | 18 | 18-8=10 | 1 | 1 |
| 3 | 21 | 21-8=13 | 0 | 1 |
| -2 | 16 | 16-8=8 | 0 | 1 |
| 2 | 17 | 17-8=9 | 0 | 1 |
| 1 | 18 | 18-8=10 | 1 | 2 |
| -3 | 7 | 7-8=-1 | 0 | 2 |
| 11 | 18 | 18-8=10 | 1 | 3 |

**Result:** `3` (paths: 5→3, 5→2→1, -3→11)

---

## Phase 5: Complexity Analysis

### Prefix Sum Approach:
- **Time:** O(N)
- **Space:** O(H) for recursion + O(N) for map

### Naive Approach:
- **Time:** O(N²)
- **Space:** O(H)

---

## Phase 6: Follow-Up Questions

1. **"Return the paths, not just count?"**
   → Track paths during traversal; more complex with prefix sum approach.

2. **"What if negative target?"**
   → Works the same; prefix sum handles it.

3. **"Paths going any direction (not just down)?"**
   → Different problem; need different approach (e.g., tree DP).
