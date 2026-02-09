# Construct Binary Tree from Preorder and Inorder

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 105 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Build unique binary tree from preorder and inorder traversal arrays.

### Constraints & Clarifying Questions
1. **Unique values?** Yes, no duplicates.
2. **Valid input?** Yes, traversals are from same tree.
3. **Empty arrays?** Return None.
4. **Array lengths match?** Yes.

### Edge Cases
1. **Empty arrays:** None
2. **Single element:** Single node
3. **Left-only or right-only:** Handle correctly

---

## Phase 2: High-Level Approach

### Approach: Recursive Construction
1. First element of preorder = root
2. Find root in inorder → splits into left and right subtrees
3. Recursively build left and right

**Core Insight:** Preorder gives root first; inorder tells left vs right.

---

## Phase 3: Python Code

```python
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(preorder: List[int], inorder: List[int]) -> TreeNode:
    """
    Build tree from preorder and inorder traversals.
    
    Args:
        preorder: Preorder traversal
        inorder: Inorder traversal
    
    Returns:
        Root of constructed tree
    """
    # Map values to indices for O(1) lookup
    inorder_map = {val: idx for idx, val in enumerate(inorder)}
    preorder_idx = [0]  # Use list to allow mutation in nested function
    
    def build(left: int, right: int) -> TreeNode:
        if left > right:
            return None
        
        # Root is next element in preorder
        root_val = preorder[preorder_idx[0]]
        preorder_idx[0] += 1
        
        root = TreeNode(root_val)
        
        # Find root position in inorder
        mid = inorder_map[root_val]
        
        # Build subtrees (left first to match preorder consumption)
        root.left = build(left, mid - 1)
        root.right = build(mid + 1, right)
        
        return root
    
    return build(0, len(inorder) - 1)


def solve_without_map(preorder: List[int], inorder: List[int]) -> TreeNode:
    """
    Without hash map - O(N^2) but simpler.
    """
    if not preorder:
        return None
    
    root_val = preorder[0]
    root = TreeNode(root_val)
    
    mid = inorder.index(root_val)
    
    root.left = solve_without_map(preorder[1:mid+1], inorder[:mid])
    root.right = solve_without_map(preorder[mid+1:], inorder[mid+1:])
    
    return root
```

---

## Phase 4: Dry Run

**Input:**
- preorder = [3, 9, 20, 15, 7]
- inorder = [9, 3, 15, 20, 7]

| Step | preorder[idx] | mid in inorder | Action |
|------|---------------|----------------|--------|
| 1 | 3 (idx=0) | 1 | Root=3, left[0:0], right[2:4] |
| 2 | 9 (idx=1) | 0 | Root=9, left=None, right=None |
| 3 | 20 (idx=2) | 3 | Root=20, left[2:2], right[4:4] |
| 4 | 15 (idx=3) | 2 | Root=15, leaves |
| 5 | 7 (idx=4) | 4 | Root=7, leaves |

**Result:**
```
    3
   / \
  9  20
    /  \
   15   7
```

---

## Phase 5: Complexity Analysis

### Optimized (with HashMap):
- **Time:** O(N)
- **Space:** O(N) for map + O(H) recursion

### Without HashMap:
- **Time:** O(N²) due to index lookup
- **Space:** O(N) for slicing + O(H) recursion

---

## Phase 6: Follow-Up Questions

1. **"What about postorder and inorder?"**
   → Postorder root is last; process right subtree before left.

2. **"Can we build from preorder and postorder?"**
   → Only for full binary trees (every node has 0 or 2 children).

3. **"Iterative approach?"**
   → Use stack; more complex but O(1) extra space (excluding result).
