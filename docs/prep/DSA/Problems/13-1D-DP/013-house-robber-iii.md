# House Robber III

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 337 | Tree DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Rob houses arranged as binary tree. Can't rob directly connected nodes (parent-child).

### Constraints & Clarifying Questions
1. **Connected = parent-child?** Yes.
2. **Grandchildren okay?** Yes.
3. **Null tree?** Return 0.
4. **Negative values?** No, non-negative.

### Edge Cases
1. **Single node:** Rob it
2. **Only root and children:** max(root, sum(children))
3. **Linear tree (linked list):** Same as House Robber I

---

## Phase 2: High-Level Approach

### Approach: Tree DP - Rob or Not
For each node, return (rob_it, skip_it).
- rob_it = node.val + skip(left) + skip(right)
- skip_it = max(left) + max(right)

**Core Insight:** Post-order traversal computing two values per node.

---

## Phase 3: Python Code

```python
from typing import Optional, Tuple


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: Optional[TreeNode]) -> int:
    """
    Find maximum robbery on tree-structured houses.
    
    Args:
        root: Root of binary tree
    
    Returns:
        Maximum robbery amount
    """
    def dfs(node: Optional[TreeNode]) -> Tuple[int, int]:
        """
        Returns (rob_this, skip_this).
        """
        if not node:
            return (0, 0)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If we rob this node, can't rob children
        rob_this = node.val + left[1] + right[1]
        
        # If we skip this node, take max from each child
        skip_this = max(left) + max(right)
        
        return (rob_this, skip_this)
    
    result = dfs(root)
    return max(result)


def solve_memo(root: Optional[TreeNode]) -> int:
    """
    Memoization with single value per node.
    """
    memo = {}
    
    def dfs(node: Optional[TreeNode]) -> int:
        if not node:
            return 0
        if node in memo:
            return memo[node]
        
        # Option 1: Rob this node + grandchildren
        val = node.val
        if node.left:
            val += dfs(node.left.left) + dfs(node.left.right)
        if node.right:
            val += dfs(node.right.left) + dfs(node.right.right)
        
        # Option 2: Skip this node, rob children
        val = max(val, dfs(node.left) + dfs(node.right))
        
        memo[node] = val
        return val
    
    return dfs(root)


def solve_iterative(root: Optional[TreeNode]) -> int:
    """
    Iterative post-order traversal.
    """
    if not root:
        return 0
    
    from collections import deque
    
    stack = deque()
    node = root
    last_visited = None
    results = {}  # node -> (rob, skip)
    
    while stack or node:
        if node:
            stack.append(node)
            node = node.left
        else:
            peek = stack[-1]
            if peek.right and peek.right != last_visited:
                node = peek.right
            else:
                stack.pop()
                
                left = results.get(peek.left, (0, 0))
                right = results.get(peek.right, (0, 0))
                
                rob = peek.val + left[1] + right[1]
                skip = max(left) + max(right)
                
                results[peek] = (rob, skip)
                last_visited = peek
    
    return max(results[root])
```

---

## Phase 4: Dry Run

**Input:**
```
     3
    / \
   2   3
    \   \
     3   1
```

| Node | Left | Right | Rob | Skip |
|------|------|-------|-----|------|
| 3(leaf) | - | - | 3 | 0 |
| 1(leaf) | - | - | 1 | 0 |
| 2 | - | (3,0) | 2+0=2 | 3 |
| 3(right) | - | (1,0) | 3+0=3 | 1 |
| 3(root) | (2,3) | (3,1) | 3+3+1=7 | 3+3=6 |

**max(7, 6) = 7** (Rob root + grandchildren: 3+3+1)

**Result:** 7

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(H)
Recursion stack (H = height).

---

## Phase 6: Follow-Up Questions

1. **"Return which nodes to rob?"**
   → Track decision at each node.

2. **"K levels apart required?"**
   → Track depth in state.

3. **"N-ary tree?"**
   → Sum over all children instead of just left/right.
