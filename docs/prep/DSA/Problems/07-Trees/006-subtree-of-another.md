# Subtree of Another Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 572 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if subRoot is a subtree of root. A subtree starts at some node and includes all descendants.

### Constraints & Clarifying Questions
1. **subRoot can be root itself?** Yes.
2. **Empty subRoot?** Assume non-empty.
3. **Subtree definition?** Complete match from that point down.
4. **Partial match?** No, must match entirely.

### Edge Cases
1. **root is None:** False (subRoot is non-empty)
2. **Identical trees:** True
3. **subRoot larger:** False

---

## Phase 2: High-Level Approach

### Approach: DFS + Same Tree Check
For each node in root, check if subtree rooted there equals subRoot.

**Core Insight:** Combine tree traversal with same-tree comparison.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode, subRoot: TreeNode) -> bool:
    """
    Check if subRoot is subtree of root.
    
    Args:
        root: Main tree root
        subRoot: Subtree to find
    
    Returns:
        True if subRoot exists in root
    """
    def is_same(p: TreeNode, q: TreeNode) -> bool:
        """Check if two trees are identical."""
        if not p and not q:
            return True
        if not p or not q:
            return False
        return (p.val == q.val and 
                is_same(p.left, q.left) and 
                is_same(p.right, q.right))
    
    if not root:
        return False
    
    # Check if current node starts matching subtree
    if is_same(root, subRoot):
        return True
    
    # Check left and right subtrees
    return solve(root.left, subRoot) or solve(root.right, subRoot)


def solve_serialization(root: TreeNode, subRoot: TreeNode) -> bool:
    """
    Alternative: Serialize both trees and use string matching.
    Careful with delimiter to avoid false matches.
    """
    def serialize(node):
        if not node:
            return "#"
        return f"^{node.val}^{serialize(node.left)}{serialize(node.right)}"
    
    root_str = serialize(root)
    sub_str = serialize(subRoot)
    
    return sub_str in root_str
```

---

## Phase 4: Dry Run

**Input:**
```
root:          subRoot:
    3             4
   / \           / \
  4   5         1   2
 / \
1   2
```

| Call | Node | is_same? | Continue |
|------|------|----------|----------|
| 1 | 3 | 3≠4 | Check children |
| 2 | 4 | 4=4, check children | |
| 3 | 1,1 | Same | |
| 4 | 2,2 | Same | |
| - | - | All match! | True |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### DFS Approach:
- **Time:** O(N × M) - for each of N nodes, compare M nodes
- **Space:** O(H) recursion stack

### Serialization:
- **Time:** O(N + M) serialization + O(N × M) string match (or O(N + M) with KMP)
- **Space:** O(N + M) for strings

---

## Phase 6: Follow-Up Questions

1. **"How to find all occurrences?"**
   → Don't short-circuit; collect all matching roots.

2. **"What if we need partial match?"**
   → Different problem; check if subRoot structure exists anywhere.

3. **"Can we use hashing?"**
   → Merkle tree hashing: hash(node) = hash(val + hash(left) + hash(right)).
