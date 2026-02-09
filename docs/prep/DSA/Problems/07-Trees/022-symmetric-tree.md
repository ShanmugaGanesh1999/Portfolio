# Symmetric Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 101 | Tree / DFS / BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if binary tree is symmetric around its center (mirror of itself).

### Constraints & Clarifying Questions
1. **Empty tree?** Symmetric (True).
2. **Single node?** Symmetric (True).
3. **Values must match?** Yes, structure and values.
4. **Definition?** Left subtree is mirror of right subtree.

### Edge Cases
1. **Empty tree:** True
2. **Single node:** True
3. **One child missing:** Asymmetric (False)

---

## Phase 2: High-Level Approach

### Option 1: Recursive
Check if left and right subtrees are mirrors of each other.

### Option 2: Iterative BFS
Use queue to compare corresponding nodes.

**Core Insight:** Two trees are mirrors if roots equal and left1.left mirrors right1.right.

---

## Phase 3: Python Code

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> bool:
    """
    Check if tree is symmetric.
    
    Args:
        root: Tree root
    
    Returns:
        True if symmetric
    """
    def is_mirror(t1: TreeNode, t2: TreeNode) -> bool:
        # Both null
        if not t1 and not t2:
            return True
        # One null
        if not t1 or not t2:
            return False
        # Values match and subtrees are mirrors
        return (t1.val == t2.val and
                is_mirror(t1.left, t2.right) and
                is_mirror(t1.right, t2.left))
    
    return is_mirror(root, root)


def solve_iterative(root: TreeNode) -> bool:
    """
    Iterative using queue.
    """
    if not root:
        return True
    
    queue = deque([(root.left, root.right)])
    
    while queue:
        t1, t2 = queue.popleft()
        
        if not t1 and not t2:
            continue
        if not t1 or not t2:
            return False
        if t1.val != t2.val:
            return False
        
        queue.append((t1.left, t2.right))
        queue.append((t1.right, t2.left))
    
    return True
```

---

## Phase 4: Dry Run

**Input:**
```
    1
   / \
  2   2
 / \ / \
3  4 4  3
```

**Recursive Calls:**

| t1 | t2 | Match? | Continue |
|----|----|--------|----------|
| 2 | 2 | 2==2 ✓ | Check children |
| 3 | 3 | 3==3 ✓ | Leaves |
| 4 | 4 | 4==4 ✓ | Leaves |
| null | null | Both null ✓ | Done |

**Result:** `True`

**Non-symmetric example:**
```
    1
   / \
  2   2
   \   \
   3    3
```
- is_mirror(2.left, 2.right) → is_mirror(null, 3) → False!

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once (conceptually twice for comparison).

### Space Complexity: O(H)
Recursion depth or queue size.

---

## Phase 6: Follow-Up Questions

1. **"Make tree symmetric?"**
   → Mirror one subtree to match the other.

2. **"Check if two trees are mirrors?"**
   → Same is_mirror function on two different roots.

3. **"Find largest symmetric subtree?"**
   → Check each node as potential root; track size.
