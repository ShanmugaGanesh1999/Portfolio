# Flatten Binary Tree to Linked List

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 114 | Tree / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Flatten tree to linked list in-place, using preorder traversal order. Use right pointers; set all left to null.

### Constraints & Clarifying Questions
1. **In-place?** Yes, modify existing tree.
2. **Order?** Preorder (root → left → right).
3. **Use right pointer?** Yes, like linked list.
4. **Left pointers?** Set to null.
5. **Empty tree?** Handle it.

### Edge Cases
1. **Empty tree:** Nothing to do
2. **Single node:** Already flat
3. **Left-only or right-only tree**

---

## Phase 2: High-Level Approach

### Option 1: Recursion with Predecessor
Flatten recursively; return tail to connect properly.

### Option 2: Morris-like (Iterative)
For each node, find rightmost of left subtree, connect to right subtree.

**Core Insight:** Need to connect left subtree's rightmost to original right subtree.

---

## Phase 3: Python Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(root: TreeNode) -> None:
    """
    Flatten tree to linked list in-place.
    
    Args:
        root: Tree root (modified in place)
    """
    if not root:
        return
    
    current = root
    
    while current:  # O(N)
        if current.left:
            # Find rightmost node in left subtree
            rightmost = current.left
            while rightmost.right:
                rightmost = rightmost.right
            
            # Connect right subtree to rightmost
            rightmost.right = current.right
            
            # Move left subtree to right
            current.right = current.left
            current.left = None
        
        current = current.right


def solve_recursive(root: TreeNode) -> None:
    """
    Recursive approach - flatten and return tail.
    """
    def flatten_and_return_tail(node):
        if not node:
            return None
        
        # Flatten subtrees
        left_tail = flatten_and_return_tail(node.left)
        right_tail = flatten_and_return_tail(node.right)
        
        # If left subtree exists
        if node.left:
            # Connect left tail to right subtree
            left_tail.right = node.right
            node.right = node.left
            node.left = None
        
        # Return the rightmost tail
        return right_tail or left_tail or node
    
    flatten_and_return_tail(root)
```

---

## Phase 4: Dry Run

**Input:**
```
    1
   / \
  2   5
 / \   \
3   4   6
```

**Iterative:**

| Step | Current | Action |
|------|---------|--------|
| 1 | 1 | left=2; rightmost of 2 is 4; 4.right=5; 1.right=2; 1.left=null |
| 2 | 2 | left=3; rightmost of 3 is 3; 3.right=4; 2.right=3; 2.left=null |
| 3 | 3 | no left, move right |
| 4 | 4 | no left, move right |
| 5 | 5 | no left, move right |
| 6 | 6 | no left, move right |
| 7 | null | done |

**Result:** `1 → 2 → 3 → 4 → 5 → 6`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Each node visited constant times.

### Space Complexity: O(1)
Iterative approach uses no extra space (recursion uses O(H)).

---

## Phase 6: Follow-Up Questions

1. **"Flatten using inorder instead?"**
   → Change order of operations; flatten left, then node, then right.

2. **"Create actual linked list nodes?"**
   → Create new ListNode objects during traversal.

3. **"Restore original tree structure?"**
   → Would need to store structure information; not possible from flattened form alone.
