# Binary Tree Level Order Traversal

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 102 | Tree / BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return node values level by level, left to right.

### Constraints & Clarifying Questions
1. **Empty tree?** Return empty list.
2. **Return format?** List of lists, one per level.
3. **Order within level?** Left to right.
4. **Can use BFS?** Yes, natural fit.

### Edge Cases
1. **Empty tree:** `[]`
2. **Single node:** `[[val]]`
3. **Skewed tree:** One node per level

---

## Phase 2: High-Level Approach

### Option 1: BFS with Queue
Process level by level using queue.

### Option 2: DFS with Level Tracking
Track level during DFS, append to appropriate list.

**Core Insight:** BFS naturally processes level by level.

---

## Phase 3: Python Code

```python
from collections import deque
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> List[List[int]]:
    """
    Level order traversal using BFS.
    
    Args:
        root: Root of tree
    
    Returns:
        List of levels
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:  # O(N)
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result


def solve_dfs(root: TreeNode) -> List[List[int]]:
    """
    Level order using DFS with level tracking.
    """
    result = []
    
    def dfs(node: TreeNode, level: int):
        if not node:
            return
        
        # Extend result if new level
        if level >= len(result):
            result.append([])
        
        result[level].append(node.val)
        
        dfs(node.left, level + 1)
        dfs(node.right, level + 1)
    
    dfs(root, 0)
    return result
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

**BFS:**

| Step | Queue | Level |
|------|-------|-------|
| init | [3] | - |
| 1 | [9, 20] | [3] |
| 2 | [15, 7] | [9, 20] |
| 3 | [] | [15, 7] |

**Result:** `[[3], [9, 20], [15, 7]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(W)
Queue holds at most one level; W = max width = N/2 in worst case.

---

## Phase 6: Follow-Up Questions

1. **"Zigzag level order?"**
   → Alternate direction each level; reverse odd levels or use deque.

2. **"Right side view?"**
   → Take last element of each level.

3. **"Average of each level?"**
   → Compute average while processing level.
