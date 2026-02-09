# Same Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 100 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if two binary trees are structurally identical with same node values.

### Constraints & Clarifying Questions
1. **Both empty?** Same (return True).
2. **One empty, one not?** Different (return False).
3. **Compare values only?** Values and structure.
4. **Data types?** Assume integer values.

### Edge Cases
1. **Both None:** True
2. **One None:** False
3. **Same values, different structure:** False

---

## Phase 2: High-Level Approach

### Approach: Recursive DFS
Compare node values and recursively check both subtrees.

**Core Insight:** Trees are same if roots match and both subtrees are same.

---

## Phase 3: Python Code

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(p: TreeNode, q: TreeNode) -> bool:
    """
    Check if two trees are identical.
    
    Args:
        p: Root of first tree
        q: Root of second tree
    
    Returns:
        True if identical
    """
    # Both empty
    if not p and not q:
        return True
    
    # One empty
    if not p or not q:
        return False
    
    # Both exist: check value and recurse
    return (p.val == q.val and 
            solve(p.left, q.left) and 
            solve(p.right, q.right))


def solve_iterative(p: TreeNode, q: TreeNode) -> bool:
    """
    Iterative using queue.
    """
    queue = deque([(p, q)])
    
    while queue:
        n1, n2 = queue.popleft()
        
        if not n1 and not n2:
            continue
        if not n1 or not n2:
            return False
        if n1.val != n2.val:
            return False
        
        queue.append((n1.left, n2.left))
        queue.append((n1.right, n2.right))
    
    return True
```

---

## Phase 4: Dry Run

**Input:**
```
Tree p:     Tree q:
  1           1
 / \         / \
2   3       2   3
```

| Call | p | q | Check | Result |
|------|---|---|-------|--------|
| 1 | 1 | 1 | values equal | recurse |
| 2 | 2 | 2 | values equal | recurse |
| 3 | None | None | both null | True |
| 4 | None | None | both null | True |
| 5 | 3 | 3 | values equal | recurse |
| 6 | None | None | both null | True |
| 7 | None | None | both null | True |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(min(N, M))
Visit at most min of both tree sizes.

### Space Complexity: O(min(H1, H2))
Recursion depth limited by shorter tree.

---

## Phase 6: Follow-Up Questions

1. **"What about symmetric tree check?"**
   → Compare left subtree with mirrored right subtree.

2. **"Check if one tree is subtree of another?"**
   → For each node in main tree, check if same tree with subtree root.

3. **"Serialize and compare?"**
   → Works but O(N) space; traversal comparison is better.
