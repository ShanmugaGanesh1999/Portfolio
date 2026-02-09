# Invert Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 226 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Mirror/flip a binary tree by swapping left and right children at every node.

### Constraints & Clarifying Questions
1. **Empty tree?** Return None.
2. **Single node?** Return that node.
3. **In-place or new tree?** In-place is fine.
4. **Return what?** Root of inverted tree.
5. **Iterative or recursive?** Both acceptable.

### Edge Cases
1. **Empty tree:** Return None
2. **Single node:** No change needed
3. **Skewed tree:** Becomes skewed opposite direction

---

## Phase 2: High-Level Approach

### Option 1: Recursive DFS
Swap children, then recursively invert subtrees.

### Option 2: Iterative BFS
Level-order traversal, swapping children at each node.

**Core Insight:** At each node, simply swap left and right pointers.

---

## Phase 3: Python Code

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> TreeNode:
    """
    Invert binary tree recursively.
    
    Args:
        root: Root of tree
    
    Returns:
        Root of inverted tree
    """
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recursively invert subtrees
    solve(root.left)
    solve(root.right)
    
    return root


def solve_iterative(root: TreeNode) -> TreeNode:
    """
    Invert using BFS.
    """
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:  # O(N)
        node = queue.popleft()
        
        # Swap children
        node.left, node.right = node.right, node.left
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return root
```

---

## Phase 4: Dry Run

**Input:**
```
    4
   / \
  2   7
 / \ / \
1  3 6  9
```

**Recursive Execution:**

| Call | Node | Action |
|------|------|--------|
| 1 | 4 | Swap: left=7, right=2 |
| 2 | 7 | Swap: left=9, right=6 |
| 3 | 9 | Leaf, return |
| 4 | 6 | Leaf, return |
| 5 | 2 | Swap: left=3, right=1 |
| 6 | 3 | Leaf, return |
| 7 | 1 | Leaf, return |

**Result:**
```
    4
   / \
  7   2
 / \ / \
9  6 3  1
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node exactly once.

### Space Complexity:
- **Recursive:** O(H) for call stack, H = height
- **Iterative:** O(W) for queue, W = max width

---

## Phase 6: Follow-Up Questions

1. **"What if it's an N-ary tree?"**
   → Reverse the children list instead of swapping two pointers.

2. **"Can you detect if a tree is already its own inverse?"**
   → Check if symmetric: left subtree mirrors right subtree.

3. **"What about in-place without recursion stack?"**
   → Use Morris traversal concept (thread links), but complex for this operation.
