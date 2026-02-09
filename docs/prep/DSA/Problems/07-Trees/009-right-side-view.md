# Binary Tree Right Side View

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 199 | Tree / BFS / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return values of nodes visible when looking at tree from right side (rightmost node at each level).

### Constraints & Clarifying Questions
1. **Empty tree?** Return empty list.
2. **What if right child missing?** Left child visible from right.
3. **Return order?** Top to bottom.
4. **Multiple nodes at same level?** Only rightmost.

### Edge Cases
1. **Empty tree:** `[]`
2. **Single node:** `[val]`
3. **Left-skewed tree:** All left nodes visible

---

## Phase 2: High-Level Approach

### Option 1: BFS
Take last node of each level.

### Option 2: DFS (Right-First)
Visit right before left; first node at each depth is visible.

**Core Insight:** Need exactly one node per level - the rightmost.

---

## Phase 3: Python Code

```python
from collections import deque
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> List[int]:
    """
    Right side view using BFS.
    
    Args:
        root: Root of tree
    
    Returns:
        List of rightmost values per level
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:  # O(N)
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node in level is rightmost
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result


def solve_dfs(root: TreeNode) -> List[int]:
    """
    DFS: visit right subtree first.
    """
    result = []
    
    def dfs(node: TreeNode, depth: int):
        if not node:
            return
        
        # First node at this depth (coming from right)
        if depth == len(result):
            result.append(node.val)
        
        # Right first!
        dfs(node.right, depth + 1)
        dfs(node.left, depth + 1)
    
    dfs(root, 0)
    return result
```

---

## Phase 4: Dry Run

**Input:**
```
    1
   / \
  2   3
   \   \
    5   4
```

**BFS:**

| Level | Nodes | Rightmost |
|-------|-------|-----------|
| 0 | [1] | 1 |
| 1 | [2, 3] | 3 |
| 2 | [5, 4] | 4 |

**Result:** `[1, 3, 4]`

**DFS (right-first):**

| Visit | Node | Depth | Result |
|-------|------|-------|--------|
| 1 | 1 | 0 | [1] |
| 2 | 3 | 1 | [1, 3] |
| 3 | 4 | 2 | [1, 3, 4] |
| 4 | 2 | 1 | (depth 1 filled) |
| 5 | 5 | 2 | (depth 2 filled) |

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity:
- **BFS:** O(W) - max width
- **DFS:** O(H) - recursion depth

---

## Phase 6: Follow-Up Questions

1. **"Left side view?"**
   → BFS: first node; DFS: visit left first.

2. **"Top view or bottom view?"**
   → Track horizontal distance; use map to store first/last at each distance.

3. **"Boundary traversal?"**
   → Combine left boundary + leaves + right boundary (reverse).
