# Binary Tree Zigzag Level Order Traversal

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 103 | Tree / BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Level order traversal but alternating direction: left-to-right, then right-to-left, etc.

### Constraints & Clarifying Questions
1. **First level direction?** Left to right.
2. **Empty tree?** Return `[]`.
3. **Return format?** List of lists.
4. **Odd levels reversed?** Yes (0-indexed: even=L→R, odd=R→L).

### Edge Cases
1. **Empty tree:** `[]`
2. **Single node:** `[[val]]`
3. **Two levels:** Second reversed

---

## Phase 2: High-Level Approach

### Option 1: BFS with Level Flag
Normal BFS, reverse odd levels.

### Option 2: BFS with Deque
Use deque; alternate append direction.

**Core Insight:** Standard level order + conditional reverse.

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
    Zigzag level order traversal.
    
    Args:
        root: Root of tree
    
    Returns:
        Zigzag ordered levels
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        level = deque()  # Use deque for efficient append at both ends
        
        for _ in range(level_size):
            node = queue.popleft()
            
            # Add based on direction
            if left_to_right:
                level.append(node.val)
            else:
                level.appendleft(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(level))
        left_to_right = not left_to_right
    
    return result


def solve_reverse(root: TreeNode) -> List[List[int]]:
    """
    Alternative: Build normally, reverse odd levels.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    level_num = 0
    
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        if level_num % 2 == 1:
            level.reverse()
        
        result.append(level)
        level_num += 1
    
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

| Level | Queue | Direction | Result |
|-------|-------|-----------|--------|
| 0 | [3] | L→R | [3] |
| 1 | [9, 20] | R→L | [20, 9] |
| 2 | [15, 7] | L→R | [15, 7] |

**Final:** `[[3], [20, 9], [15, 7]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once.

### Space Complexity: O(W)
Queue holds max one level; W = max width.

---

## Phase 6: Follow-Up Questions

1. **"Start right-to-left instead?"**
   → Initialize `left_to_right = False`.

2. **"Reverse every k levels?"**
   → Track level count; reverse when count % k == 0.

3. **"Spiral order for matrix?"**
   → Different problem; use four boundaries.
