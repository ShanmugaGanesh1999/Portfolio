# Maximum Depth of Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 104 | Tree / DFS / BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find maximum depth (height) of binary tree. Depth = number of nodes along longest root-to-leaf path.

### Constraints & Clarifying Questions
1. **Empty tree depth?** 0.
2. **Single node depth?** 1.
3. **Count nodes or edges?** Nodes (LeetCode convention).
4. **Unbalanced tree?** Yes, handle any structure.

### Edge Cases
1. **Empty tree:** 0
2. **Single node:** 1
3. **Skewed tree:** Depth = N

---

## Phase 2: High-Level Approach

### Option 1: Recursive DFS
`depth(node) = 1 + max(depth(left), depth(right))`

### Option 2: Iterative BFS
Count levels during level-order traversal.

**Core Insight:** Maximum depth equals maximum level count.

---

## Phase 3: Python Code

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> int:
    """
    Find max depth using recursive DFS.
    
    Args:
        root: Root of tree
    
    Returns:
        Maximum depth (number of nodes)
    """
    if not root:
        return 0
    
    left_depth = solve(root.left)
    right_depth = solve(root.right)
    
    return 1 + max(left_depth, right_depth)


def solve_bfs(root: TreeNode) -> int:
    """
    Find max depth using BFS level counting.
    """
    if not root:
        return 0
    
    queue = deque([root])
    depth = 0
    
    while queue:  # O(N)
        depth += 1
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return depth
```

---

## Phase 4: Dry Run

**Input:**
```
    3
   / \
  9  20
    /  \
   15   7
```

**Recursive:**

| Call | Node | Left | Right | Return |
|------|------|------|-------|--------|
| 1 | 3 | ? | ? | 1 + max(1, 2) = 3 |
| 2 | 9 | 0 | 0 | 1 |
| 3 | 20 | ? | ? | 1 + max(1, 1) = 2 |
| 4 | 15 | 0 | 0 | 1 |
| 5 | 7 | 0 | 0 | 1 |

**Result:** `3`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity:
- **Recursive:** O(H) call stack
- **BFS:** O(W) queue width

---

## Phase 6: Follow-Up Questions

1. **"What about minimum depth?"**
   → Stop at first leaf in BFS; or modify DFS to handle leaves correctly.

2. **"Depth counting edges?"**
   → Subtract 1 from result; or change base case to -1.

3. **"How to find depth of a specific node?"**
   → Track depth during traversal until target found.
