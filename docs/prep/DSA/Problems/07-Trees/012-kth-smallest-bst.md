# Kth Smallest Element in BST

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 230 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find kth smallest element in BST (1-indexed).

### Constraints & Clarifying Questions
1. **k always valid?** Yes, 1 ≤ k ≤ n.
2. **Duplicates?** Assume no (or count each).
3. **Return value or node?** Value.
4. **Expected complexity?** O(H + k).

### Edge Cases
1. **k = 1:** Leftmost node
2. **k = n:** Rightmost node
3. **Balanced tree:** O(log n + k)

---

## Phase 2: High-Level Approach

### Approach: Inorder Traversal
Inorder of BST gives sorted order. Count until k.

**Core Insight:** kth element in inorder traversal = kth smallest.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode, k: int) -> int:
    """
    Find kth smallest using inorder traversal.
    
    Args:
        root: BST root
        k: Position (1-indexed)
    
    Returns:
        kth smallest value
    """
    count = 0
    result = None
    
    def inorder(node: TreeNode):
        nonlocal count, result
        
        if not node or result is not None:
            return
        
        # Left subtree
        inorder(node.left)
        
        # Visit current
        count += 1
        if count == k:
            result = node.val
            return
        
        # Right subtree
        inorder(node.right)
    
    inorder(root)
    return result


def solve_iterative(root: TreeNode, k: int) -> int:
    """
    Iterative inorder using stack.
    """
    stack = []
    current = root
    count = 0
    
    while stack or current:  # O(H + k)
        # Go to leftmost
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        count += 1
        
        if count == k:
            return current.val
        
        current = current.right
    
    return -1  # Should not reach


def solve_with_augmented_tree(root: TreeNode, k: int) -> int:
    """
    If BST nodes store subtree sizes, O(H) lookup.
    Each node has: val, left, right, left_count
    """
    # Assume node.left_count = size of left subtree
    current = root
    
    while current:
        left_count = current.left_count if hasattr(current, 'left_count') else 0
        
        if k == left_count + 1:
            return current.val
        elif k <= left_count:
            current = current.left
        else:
            k -= left_count + 1
            current = current.right
    
    return -1
```

---

## Phase 4: Dry Run

**Input:**
```
    5
   / \
  3   6
 / \
2   4
```
k = 3

**Inorder Traversal:**

| Step | Node | Count | k? |
|------|------|-------|-----|
| 1 | 2 | 1 | No |
| 2 | 3 | 2 | No |
| 3 | 4 | 3 | Yes! |

**Result:** `4`

---

## Phase 5: Complexity Analysis

### Basic Approach:
- **Time:** O(H + k) - go left H times, then k visits
- **Space:** O(H) for stack/recursion

### Augmented BST:
- **Time:** O(H)
- **Space:** O(1) iterative, O(N) extra for storing counts

---

## Phase 6: Follow-Up Questions

1. **"Frequent queries, tree rarely changes?"**
   → Augment nodes with subtree size; O(H) per query.

2. **"Tree changes frequently?"**
   → Balance between augmentation overhead and query time.

3. **"Kth largest?"**
   → Reverse inorder (right first) or use n - k + 1.
