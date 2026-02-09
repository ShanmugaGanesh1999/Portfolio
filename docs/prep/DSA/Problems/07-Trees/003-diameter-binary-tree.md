# Diameter of Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 543 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find longest path between any two nodes (number of edges). Path may or may not pass through root.

### Constraints & Clarifying Questions
1. **Count edges or nodes?** Edges.
2. **Empty tree?** Return 0.
3. **Single node?** Return 0 (no edges).
4. **Path direction?** Can go up then down through any node.

### Edge Cases
1. **Empty tree:** 0
2. **Single node:** 0
3. **Straight line tree:** N-1 edges

---

## Phase 2: High-Level Approach

### Approach: DFS with Global Max
At each node, diameter through it = left_height + right_height.
Track maximum during traversal.

**Core Insight:** Diameter at node = depth of left + depth of right subtrees.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> int:
    """
    Find diameter (longest path in edges).
    
    Args:
        root: Root of tree
    
    Returns:
        Diameter (number of edges)
    """
    diameter = 0
    
    def height(node: TreeNode) -> int:
        """Returns height and updates diameter."""
        nonlocal diameter
        
        if not node:
            return 0
        
        left_h = height(node.left)
        right_h = height(node.right)
        
        # Diameter through this node
        diameter = max(diameter, left_h + right_h)
        
        return 1 + max(left_h, right_h)
    
    height(root)
    return diameter


def solve_without_global(root: TreeNode) -> int:
    """
    Alternative: Return tuple (height, diameter).
    """
    def helper(node):
        if not node:
            return (0, 0)  # (height, diameter)
        
        left_h, left_d = helper(node.left)
        right_h, right_d = helper(node.right)
        
        height = 1 + max(left_h, right_h)
        diameter = max(left_d, right_d, left_h + right_h)
        
        return (height, diameter)
    
    return helper(root)[1]
```

---

## Phase 4: Dry Run

**Input:**
```
    1
   / \
  2   3
 / \
4   5
```

| Call | Node | left_h | right_h | Diameter Update | Return |
|------|------|--------|---------|-----------------|--------|
| 1 | 4 | 0 | 0 | max(0, 0+0)=0 | 1 |
| 2 | 5 | 0 | 0 | max(0, 0+0)=0 | 1 |
| 3 | 2 | 1 | 1 | max(0, 1+1)=2 | 2 |
| 4 | 3 | 0 | 0 | max(2, 0+0)=2 | 1 |
| 5 | 1 | 2 | 1 | max(2, 2+1)=3 | 3 |

**Result:** `3` (path: 4→2→1→3 or 5→2→1→3)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(H)
Recursion stack depth = height.

---

## Phase 6: Follow-Up Questions

1. **"Return the actual path?"**
   → Track path nodes when diameter updated; reconstruct path.

2. **"What about N-ary tree?"**
   → Need two largest child heights for diameter through node.

3. **"Binary tree diameter vs graph diameter?"**
   → Graph needs BFS from each node or Floyd-Warshall for all-pairs.
