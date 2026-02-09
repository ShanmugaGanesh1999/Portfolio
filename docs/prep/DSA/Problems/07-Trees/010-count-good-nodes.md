# Count Good Nodes in Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1448 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count nodes where the path from root to that node has no node with value greater than current node.

### Constraints & Clarifying Questions
1. **Root is always good?** Yes, no ancestors.
2. **Negative values?** Yes, handle them.
3. **Definition of path?** From root downward to current node.
4. **Equal values on path?** Still good (not strictly greater).

### Edge Cases
1. **Single node:** 1 (root is always good)
2. **All decreasing values:** Only root is good
3. **All same values:** All nodes are good

---

## Phase 2: High-Level Approach

### Approach: DFS with Max Tracking
Pass maximum value seen so far down the path. If current ≥ max, it's good.

**Core Insight:** Track running maximum along each path.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> int:
    """
    Count good nodes using DFS.
    
    Args:
        root: Root of tree
    
    Returns:
        Count of good nodes
    """
    def dfs(node: TreeNode, max_so_far: int) -> int:
        if not node:
            return 0
        
        # Check if current node is good
        good = 1 if node.val >= max_so_far else 0
        
        # Update max for children
        new_max = max(max_so_far, node.val)
        
        return good + dfs(node.left, new_max) + dfs(node.right, new_max)
    
    return dfs(root, float('-inf'))


def solve_iterative(root: TreeNode) -> int:
    """
    Iterative using stack.
    """
    if not root:
        return 0
    
    stack = [(root, float('-inf'))]
    count = 0
    
    while stack:  # O(N)
        node, max_so_far = stack.pop()
        
        if node.val >= max_so_far:
            count += 1
        
        new_max = max(max_so_far, node.val)
        
        if node.left:
            stack.append((node.left, new_max))
        if node.right:
            stack.append((node.right, new_max))
    
    return count
```

---

## Phase 4: Dry Run

**Input:**
```
    3
   / \
  1   4
 /   / \
3   1   5
```

| Node | max_so_far | val ≥ max? | good |
|------|------------|------------|------|
| 3 | -∞ | 3 ≥ -∞ ✓ | 1 |
| 1 | 3 | 1 ≥ 3 ✗ | 0 |
| 3 | 3 | 3 ≥ 3 ✓ | 1 |
| 4 | 3 | 4 ≥ 3 ✓ | 1 |
| 1 | 4 | 1 ≥ 4 ✗ | 0 |
| 5 | 4 | 5 ≥ 4 ✓ | 1 |

**Result:** `4` (nodes 3, 3, 4, 5)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(H)
Recursion depth = tree height.

---

## Phase 6: Follow-Up Questions

1. **"What if good means strictly greater path?"**
   → Change condition to `node.val > max_so_far` (root special case).

2. **"Find all good node values?"**
   → Return list instead of count; append values.

3. **"Good nodes considering both ancestors and descendants?"**
   → Need two passes or different definition; track global values.
