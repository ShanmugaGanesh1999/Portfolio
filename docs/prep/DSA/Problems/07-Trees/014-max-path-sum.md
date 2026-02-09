# Binary Tree Maximum Path Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 124 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find maximum sum of any path in tree. Path = sequence of nodes where each pair is connected by edge; doesn't need to pass through root.

### Constraints & Clarifying Questions
1. **Negative values?** Yes, can be negative.
2. **Path can start/end anywhere?** Yes.
3. **Must include at least one node?** Yes.
4. **Can path go up then down?** Yes, through any node.

### Edge Cases
1. **Single node:** That node's value
2. **All negative:** Largest single value
3. **All same level:** Can take multiple nodes

---

## Phase 2: High-Level Approach

### Approach: DFS with Global Max
At each node, calculate max path sum including that node as the "peak" (going through it). Track global maximum.

**Core Insight:** At each node, decide whether to include left/right subtrees or not (negative contributions can be dropped).

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
    Find maximum path sum in binary tree.
    
    Args:
        root: Root of tree
    
    Returns:
        Maximum path sum
    """
    max_sum = float('-inf')
    
    def max_gain(node: TreeNode) -> int:
        """
        Returns max contribution from node going down one path.
        Updates global max for paths that peak at this node.
        """
        nonlocal max_sum
        
        if not node:
            return 0
        
        # Max gain from left/right (ignore negative contributions)
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)
        
        # Path sum with current node as peak
        path_through_node = node.val + left_gain + right_gain
        max_sum = max(max_sum, path_through_node)
        
        # Return max gain if continuing path through this node
        # Can only go one direction (left or right, not both)
        return node.val + max(left_gain, right_gain)
    
    max_gain(root)
    return max_sum


def solve_explicit(root: TreeNode) -> int:
    """
    More explicit version showing all cases.
    """
    result = [float('-inf')]
    
    def dfs(node):
        if not node:
            return 0
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Four cases for max path through this node:
        # 1. Just node
        # 2. Node + left path
        # 3. Node + right path
        # 4. Node + left + right (node is peak)
        
        local_max = max(
            node.val,
            node.val + left,
            node.val + right,
            node.val + left + right
        )
        result[0] = max(result[0], local_max)
        
        # Return max extendable path
        return max(node.val, node.val + left, node.val + right)
    
    dfs(root)
    return result[0]
```

---

## Phase 4: Dry Run

**Input:**
```
    -10
    /  \
   9   20
      /  \
     15   7
```

| Node | left_gain | right_gain | path_through | max_sum | return |
|------|-----------|------------|--------------|---------|--------|
| 9 | 0 | 0 | 9 | 9 | 9 |
| 15 | 0 | 0 | 15 | 15 | 15 |
| 7 | 0 | 0 | 7 | 15 | 7 |
| 20 | 15 | 7 | 42 | 42 | 35 |
| -10 | 9 | 35 | 34 | 42 | 25 |

**Result:** `42` (path: 15 → 20 → 7)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(H)
Recursion stack depth.

---

## Phase 6: Follow-Up Questions

1. **"Return the actual path?"**
   → Track nodes when updating max; reconstruct path.

2. **"What if path must go through root?"**
   → Only consider paths that include root; simpler.

3. **"Maximum path sum in DAG?"**
   → Topological sort + DP; different problem.
