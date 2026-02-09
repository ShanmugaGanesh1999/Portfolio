# Path Sum II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 113 | Tree / DFS / Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all root-to-leaf paths where sum equals targetSum.

### Constraints & Clarifying Questions
1. **Return paths or count?** All paths as lists.
2. **Multiple valid paths?** Collect all.
3. **Empty tree?** Return `[]`.
4. **Path order in result?** Any order.

### Edge Cases
1. **Empty tree:** `[]`
2. **No valid paths:** `[]`
3. **Single node matches:** `[[val]]`

---

## Phase 2: High-Level Approach

### Approach: DFS Backtracking
Build path as we traverse; add to result at valid leaves; backtrack.

**Core Insight:** Standard backtracking - add, recurse, remove.

---

## Phase 3: Python Code

```python
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode, targetSum: int) -> List[List[int]]:
    """
    Find all root-to-leaf paths with targetSum.
    
    Args:
        root: Tree root
        targetSum: Target sum
    
    Returns:
        List of valid paths
    """
    result = []
    
    def dfs(node: TreeNode, remaining: int, path: List[int]):
        if not node:
            return
        
        path.append(node.val)
        
        # Check if leaf with correct sum
        if not node.left and not node.right and node.val == remaining:
            result.append(path.copy())  # Add copy!
        else:
            # Continue search
            dfs(node.left, remaining - node.val, path)
            dfs(node.right, remaining - node.val, path)
        
        # Backtrack
        path.pop()
    
    dfs(root, targetSum, [])
    return result


def solve_no_backtrack(root: TreeNode, targetSum: int) -> List[List[int]]:
    """
    Alternative: Pass new list (no explicit backtrack, more memory).
    """
    result = []
    
    def dfs(node, remaining, path):
        if not node:
            return
        
        new_path = path + [node.val]
        
        if not node.left and not node.right and node.val == remaining:
            result.append(new_path)
            return
        
        dfs(node.left, remaining - node.val, new_path)
        dfs(node.right, remaining - node.val, new_path)
    
    dfs(root, targetSum, [])
    return result
```

---

## Phase 4: Dry Run

**Input:**
```
      5
     / \
    4   8
   /   / \
  11  13  4
 /  \    / \
7    2  5   1
```
targetSum = 22

**DFS Trace:**

| Path | Sum | Leaf? | Valid? |
|------|-----|-------|--------|
| [5,4,11,7] | 27 | Yes | No |
| [5,4,11,2] | 22 | Yes | Yes ✓ |
| [5,8,13] | 26 | Yes | No |
| [5,8,4,5] | 22 | Yes | Yes ✓ |
| [5,8,4,1] | 18 | Yes | No |

**Result:** `[[5,4,11,2], [5,8,4,5]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
Visit each node O(N), copying path can be O(N).

### Space Complexity: O(N)
Path length + recursion stack.

---

## Phase 6: Follow-Up Questions

1. **"Return paths as strings?"**
   → Join values with "→" when adding to result.

2. **"Count paths instead?"**
   → Just increment counter instead of appending.

3. **"Path Sum III (any start/end)?"**
   → Use prefix sum map to find valid subpaths.
