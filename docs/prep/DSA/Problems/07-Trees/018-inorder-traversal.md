# Binary Tree Inorder Traversal

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 94 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return inorder traversal (left → root → right) of binary tree.

### Constraints & Clarifying Questions
1. **Empty tree?** Return `[]`.
2. **Return format?** List of values.
3. **Iterative or recursive?** Both acceptable; follow-up asks iterative.
4. **Can we modify tree?** Morris traversal does temporarily.

### Edge Cases
1. **Empty tree:** `[]`
2. **Single node:** `[val]`
3. **Left-only or right-only tree**

---

## Phase 2: High-Level Approach

### Option 1: Recursive
Natural recursive definition.

### Option 2: Iterative with Stack
Simulate recursion with explicit stack.

### Option 3: Morris Traversal
O(1) space using threaded links.

**Core Insight:** Inorder = left subtree, then node, then right subtree.

---

## Phase 3: Python Code

```python
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> List[int]:
    """
    Iterative inorder traversal.
    
    Args:
        root: Root of tree
    
    Returns:
        Inorder traversal list
    """
    result = []
    stack = []
    current = root
    
    while stack or current:  # O(N)
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Visit node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result


def solve_recursive(root: TreeNode) -> List[int]:
    """
    Recursive inorder traversal.
    """
    result = []
    
    def inorder(node):
        if not node:
            return
        inorder(node.left)
        result.append(node.val)
        inorder(node.right)
    
    inorder(root)
    return result


def solve_morris(root: TreeNode) -> List[int]:
    """
    Morris traversal - O(1) space.
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, visit and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, remove it
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

---

## Phase 4: Dry Run

**Input:**
```
    1
     \
      2
     /
    3
```

**Iterative:**

| Step | Stack | Current | Result |
|------|-------|---------|--------|
| 1 | [1] | 1 | [] |
| 2 | [1] | None | [] |
| 3 | [] | 1 (popped) | [1] |
| 4 | [2] | 2 | [1] |
| 5 | [2, 3] | 3 | [1] |
| 6 | [2] | 3 (popped) | [1, 3] |
| 7 | [] | 2 (popped) | [1, 3, 2] |
| 8 | [] | None | done |

**Result:** `[1, 3, 2]`

---

## Phase 5: Complexity Analysis

### Recursive:
- **Time:** O(N)
- **Space:** O(H) call stack

### Iterative:
- **Time:** O(N)
- **Space:** O(H) stack

### Morris:
- **Time:** O(N) - each edge traversed at most twice
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"What about preorder and postorder?"**
   → Preorder: root first; Postorder: use modified preorder then reverse.

2. **"How does Morris traversal work?"**
   → Uses right pointer of predecessor as temporary thread; restores tree after.

3. **"Implement iterator?"**
   → Stack-based; `hasNext()` checks stack/current; `next()` returns next inorder element.
