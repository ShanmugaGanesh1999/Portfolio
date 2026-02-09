# Lowest Common Ancestor of BST

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 235 | BST / Tree |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find lowest common ancestor of two nodes in BST. LCA is lowest node that has both p and q as descendants (node can be descendant of itself).

### Constraints & Clarifying Questions
1. **p and q always exist?** Yes.
2. **p == q allowed?** Yes, LCA is the node itself.
3. **p or q could be ancestor of other?** Yes.
4. **BST property?** Yes, use it for efficiency.

### Edge Cases
1. **p is ancestor of q:** LCA is p
2. **Same node:** LCA is that node
3. **In different subtrees:** LCA is split point

---

## Phase 2: High-Level Approach

### Approach: BST Property
Use BST ordering: if both values < current, go left; if both > current, go right; else current is LCA.

**Core Insight:** LCA is first node where p and q split into different subtrees.

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
    Find LCA in BST using BST property.
    
    Args:
        root: BST root
        p: First node
        q: Second node
    
    Returns:
        Lowest common ancestor
    """
    current = root
    
    while current:  # O(H)
        if p.val < current.val and q.val < current.val:
            # Both in left subtree
            current = current.left
        elif p.val > current.val and q.val > current.val:
            # Both in right subtree
            current = current.right
        else:
            # Split point - this is LCA
            return current
    
    return None  # Should not reach here


def solve_recursive(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Recursive version.
    """
    if p.val < root.val and q.val < root.val:
        return solve_recursive(root.left, p, q)
    elif p.val > root.val and q.val > root.val:
        return solve_recursive(root.right, p, q)
    else:
        return root
```

---

## Phase 4: Dry Run

**Input:**
```
      6
     / \
    2   8
   / \ / \
  0  4 7  9
    / \
   3   5
```
p = 2, q = 8

| Step | current | p < curr | q < curr | Action |
|------|---------|----------|----------|--------|
| 1 | 6 | 2 < 6 ✓ | 8 > 6 | Split! Return 6 |

**Result:** Node 6

**Example 2:** p = 2, q = 4

| Step | current | p < curr | q < curr | Action |
|------|---------|----------|----------|--------|
| 1 | 6 | 2 < 6 ✓ | 4 < 6 ✓ | Go left |
| 2 | 2 | 2 = 2 | 4 > 2 | Split! Return 2 |

**Result:** Node 2 (p is LCA)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(H)
Single path from root to LCA. H = log N (balanced) or N (skewed).

### Space Complexity:
- **Iterative:** O(1)
- **Recursive:** O(H)

---

## Phase 6: Follow-Up Questions

1. **"What if it's regular binary tree (not BST)?"**
   → DFS: return node if p or q found, recurse both sides, return node if both sides return non-null.

2. **"Multiple queries?"**
   → Preprocess with parent pointers or binary lifting for O(log N) per query.

3. **"What if nodes might not exist?"**
   → First verify existence, then find LCA.
