# Lowest Common Ancestor of Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 236 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find LCA of two nodes in general binary tree (not BST). LCA is lowest node having both p and q as descendants (node is descendant of itself).

### Constraints & Clarifying Questions
1. **Nodes always exist?** Yes.
2. **p == q?** Yes, LCA is itself.
3. **p or q could be ancestor of other?** Yes.
4. **Unique values?** Yes.

### Edge Cases
1. **p is ancestor of q:** LCA is p
2. **p and q are siblings:** LCA is parent
3. **Same node:** LCA is that node

---

## Phase 2: High-Level Approach

### Approach: Recursive DFS
Return node if it's p or q, or if it receives non-null from both subtrees (meaning p and q are in different subtrees).

**Core Insight:** If a node receives non-null from both children, it's the LCA.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA in binary tree.
    
    Args:
        root: Tree root
        p: First node
        q: Second node
    
    Returns:
        Lowest common ancestor
    """
    # Base case
    if not root or root == p or root == q:
        return root
    
    # Search in subtrees
    left = solve(root.left, p, q)
    right = solve(root.right, p, q)
    
    # If both subtrees return non-null, current is LCA
    if left and right:
        return root
    
    # Otherwise return the non-null result
    return left if left else right


def solve_with_parent(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Alternative: Use parent pointers and find intersection.
    """
    # Build parent map
    parent = {root: None}
    stack = [root]
    
    while stack:
        node = stack.pop()
        if node.left:
            parent[node.left] = node
            stack.append(node.left)
        if node.right:
            parent[node.right] = node
            stack.append(node.right)
    
    # Get all ancestors of p
    ancestors = set()
    while p:
        ancestors.add(p)
        p = parent[p]
    
    # Find first ancestor of q that's also ancestor of p
    while q not in ancestors:
        q = parent[q]
    
    return q
```

---

## Phase 4: Dry Run

**Input:**
```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```
p = 5, q = 1

| Call | Node | left | right | Return |
|------|------|------|-------|--------|
| 1 | 6 | - | - | None |
| 2 | 7 | - | - | None |
| 3 | 4 | - | - | None |
| 4 | 2 | None | None | None |
| 5 | 5 | - | - | 5 (found p) |
| 6 | 0 | - | - | None |
| 7 | 8 | - | - | None |
| 8 | 1 | None | None | 1 (found q) |
| 9 | 3 | 5 | 1 | 3 (both non-null!) |

**Result:** Node 3

---

## Phase 5: Complexity Analysis

### Recursive Approach:
- **Time:** O(N)
- **Space:** O(H) recursion

### Parent Pointer Approach:
- **Time:** O(N)
- **Space:** O(N) for parent map

---

## Phase 6: Follow-Up Questions

1. **"What if nodes might not exist?"**
   → Track whether both found; return LCA only if both exist.

2. **"Multiple queries?"**
   → Use binary lifting or Euler tour + RMQ for O(log N) per query.

3. **"LCA in N-ary tree?"**
   → Same logic; check all children instead of just left/right.
