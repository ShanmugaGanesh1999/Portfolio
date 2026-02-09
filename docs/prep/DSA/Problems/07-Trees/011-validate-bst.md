# Validate Binary Search Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 98 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if tree is valid BST: all left descendants < node < all right descendants.

### Constraints & Clarifying Questions
1. **Duplicates allowed?** No, strict inequality.
2. **Empty tree valid?** Yes.
3. **Single node valid?** Yes.
4. **Check entire subtree or just children?** Entire subtree.

### Edge Cases
1. **Empty tree:** True
2. **Single node:** True
3. **Equal values:** Invalid (strict BST)

---

## Phase 2: High-Level Approach

### Option 1: Range Validation
Pass valid range (min, max) down; each node must be in range.

### Option 2: Inorder Traversal
Inorder of BST is sorted; check if strictly increasing.

**Core Insight:** Each node has implicit range from ancestors.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> bool:
    """
    Validate BST using range checking.
    
    Args:
        root: Root of tree
    
    Returns:
        True if valid BST
    """
    def validate(node: TreeNode, min_val: float, max_val: float) -> bool:
        if not node:
            return True
        
        # Check current node in valid range
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Left subtree: all values < current
        # Right subtree: all values > current
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))


def solve_inorder(root: TreeNode) -> bool:
    """
    Validate using inorder traversal (should be sorted).
    """
    prev = float('-inf')
    
    def inorder(node: TreeNode) -> bool:
        nonlocal prev
        
        if not node:
            return True
        
        # Visit left
        if not inorder(node.left):
            return False
        
        # Check current
        if node.val <= prev:
            return False
        prev = node.val
        
        # Visit right
        return inorder(node.right)
    
    return inorder(root)
```

---

## Phase 4: Dry Run

**Input:**
```
    5
   / \
  1   4
     / \
    3   6
```

**Range Method:**

| Node | Range | Valid? |
|------|-------|--------|
| 5 | (-∞, ∞) | ✓ |
| 1 | (-∞, 5) | ✓ |
| 4 | (5, ∞) | 4 < 5 ✗ |

**Result:** `False` (4 should be > 5)

**Valid BST example:**
```
    5
   / \
  1   7
     / \
    6   8
```
All ranges satisfied → `True`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(H)
Recursion stack depth.

---

## Phase 6: Follow-Up Questions

1. **"What if duplicates are allowed (≤ instead of <)?"**
   → Change comparison to `<=` for right subtree.

2. **"Find the largest BST subtree?"**
   → Post-order traversal; each node returns (isBST, min, max, size).

3. **"Iterator for BST?"**
   → Stack-based inorder iterator; O(H) space.
