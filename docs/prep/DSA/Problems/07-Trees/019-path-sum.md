# Path Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 112 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if tree has root-to-leaf path with sum equal to targetSum.

### Constraints & Clarifying Questions
1. **Leaf definition?** Node with no children.
2. **Empty tree?** Return False.
3. **Negative values?** Yes, possible.
4. **Path must end at leaf?** Yes.
5. **Can target be negative?** Yes.

### Edge Cases
1. **Empty tree:** False
2. **Single node = target:** True
3. **Single node ≠ target:** False

---

## Phase 2: High-Level Approach

### Approach: DFS with Running Sum
Subtract current value from target; at leaf, check if remaining is 0.

**Core Insight:** Track remaining target as we go down; simpler than summing.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode, targetSum: int) -> bool:
    """
    Check if root-to-leaf path with targetSum exists.
    
    Args:
        root: Tree root
        targetSum: Target sum
    
    Returns:
        True if path exists
    """
    if not root:
        return False
    
    # At leaf: check if we've reached target
    if not root.left and not root.right:
        return root.val == targetSum
    
    # Continue with remaining target
    remaining = targetSum - root.val
    
    return (solve(root.left, remaining) or 
            solve(root.right, remaining))


def solve_iterative(root: TreeNode, targetSum: int) -> bool:
    """
    Iterative using stack.
    """
    if not root:
        return False
    
    stack = [(root, targetSum)]
    
    while stack:
        node, remaining = stack.pop()
        
        # Leaf check
        if not node.left and not node.right:
            if node.val == remaining:
                return True
            continue
        
        new_remaining = remaining - node.val
        
        if node.right:
            stack.append((node.right, new_remaining))
        if node.left:
            stack.append((node.left, new_remaining))
    
    return False
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
 /  \      \
7    2      1
```
targetSum = 22

**Path Check:**

| Path | Sum | == 22? |
|------|-----|--------|
| 5→4→11→7 | 27 | No |
| 5→4→11→2 | 22 | Yes! |

**Recursive Calls:**
- solve(5, 22) → solve(4, 17)
- solve(4, 17) → solve(11, 13)
- solve(11, 13) → solve(2, 2)
- 2 is leaf, 2 == 2 ✓

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node at most once.

### Space Complexity: O(H)
Recursion depth = tree height.

---

## Phase 6: Follow-Up Questions

1. **"Return all paths with sum?"**
   → Path Sum II: backtracking to collect all valid paths.

2. **"Path can start/end anywhere?"**
   → Path Sum III: prefix sum technique.

3. **"Maximum path sum to any leaf?"**
   → Track max instead of checking equality.
