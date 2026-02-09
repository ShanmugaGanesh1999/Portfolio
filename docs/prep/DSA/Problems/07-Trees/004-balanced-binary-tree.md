# Balanced Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 110 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if tree is height-balanced: for every node, heights of subtrees differ by at most 1.

### Constraints & Clarifying Questions
1. **Empty tree?** Balanced (return True).
2. **Single node?** Balanced.
3. **Definition?** Every node, not just root, must be balanced.
4. **Expected complexity?** O(N).

### Edge Cases
1. **Empty tree:** True
2. **Single node:** True
3. **Skewed tree:** False (if >1 node)

---

## Phase 2: High-Level Approach

### Approach: Bottom-Up DFS
Calculate height while checking balance. Return -1 for unbalanced subtree.

**Core Insight:** Check balance bottom-up; short-circuit if any subtree unbalanced.

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
    Check if tree is height-balanced.
    
    Args:
        root: Root of tree
    
    Returns:
        True if balanced
    """
    def check_height(node: TreeNode) -> int:
        """
        Returns height if balanced, -1 if not.
        """
        if not node:
            return 0
        
        left_h = check_height(node.left)
        if left_h == -1:
            return -1  # Left subtree unbalanced
        
        right_h = check_height(node.right)
        if right_h == -1:
            return -1  # Right subtree unbalanced
        
        if abs(left_h - right_h) > 1:
            return -1  # Current node unbalanced
        
        return 1 + max(left_h, right_h)
    
    return check_height(root) != -1


def solve_naive(root: TreeNode) -> bool:
    """
    Naive: O(N^2) - recalculates height.
    """
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))
    
    if not root:
        return True
    
    if abs(height(root.left) - height(root.right)) > 1:
        return False
    
    return solve_naive(root.left) and solve_naive(root.right)
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

| Call | Node | left_h | right_h | |left-right| | Return |
|------|------|--------|---------|-------------|--------|
| 1 | 9 | 0 | 0 | 0 ≤ 1 | 1 |
| 2 | 15 | 0 | 0 | 0 ≤ 1 | 1 |
| 3 | 7 | 0 | 0 | 0 ≤ 1 | 1 |
| 4 | 20 | 1 | 1 | 0 ≤ 1 | 2 |
| 5 | 3 | 1 | 2 | 1 ≤ 1 | 3 |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Optimal (Bottom-Up):
- **Time:** O(N)
- **Space:** O(H)

### Naive:
- **Time:** O(N²) - height called for each node
- **Space:** O(H)

---

## Phase 6: Follow-Up Questions

1. **"What makes a tree completely balanced?"**
   → All levels full except possibly last, filled left-to-right (complete binary tree).

2. **"How to balance an unbalanced tree?"**
   → AVL rotations, red-black tree rebalancing, or rebuild from sorted array.

3. **"What about weight-balanced trees?"**
   → Balance by node count, not height; used in some self-balancing trees.
