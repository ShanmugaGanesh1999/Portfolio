# 🎯 Trees - Complete Guide

## 📌 What is a Tree?

A tree is a hierarchical data structure with:
- **Root**: Top node with no parent
- **Nodes**: Elements connected by edges
- **Leaves**: Nodes with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to a node

---

## 🌳 Binary Tree

Each node has at most 2 children (left and right).

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

### Types of Binary Trees

1. **Full Binary Tree**: Every node has 0 or 2 children
2. **Complete Binary Tree**: All levels filled except possibly last (left to right)
3. **Perfect Binary Tree**: All internal nodes have 2 children, all leaves at same level
4. **Balanced Binary Tree**: Height difference between subtrees ≤ 1

---

## 🔄 Tree Traversals

### 1. Preorder (Root → Left → Right)

```python
def preorder_recursive(root: TreeNode) -> list[int]:
    """
    Process root first, then left subtree, then right subtree.
    """
    result = []
    
    def dfs(node):
        if not node:
            return
        result.append(node.val)  # Process root
        dfs(node.left)           # Left subtree
        dfs(node.right)          # Right subtree
    
    dfs(root)
    return result

def preorder_iterative(root: TreeNode) -> list[int]:
    """
    Using stack to simulate recursion.
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push right first so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

### 2. Inorder (Left → Root → Right)

```python
def inorder_recursive(root: TreeNode) -> list[int]:
    """
    Process left subtree, then root, then right subtree.
    For BST: gives sorted order!
    """
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)           # Left subtree
        result.append(node.val)  # Process root
        dfs(node.right)          # Right subtree
    
    dfs(root)
    return result

def inorder_iterative(root: TreeNode) -> list[int]:
    """
    Go left as far as possible, process, go right.
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go left as far as possible
        while current:
            stack.append(current)
            current = current.left
        
        # Process node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result
```

### 3. Postorder (Left → Right → Root)

```python
def postorder_recursive(root: TreeNode) -> list[int]:
    """
    Process left, then right, then root.
    Useful for deletion, calculating heights.
    """
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)           # Left subtree
        dfs(node.right)          # Right subtree
        result.append(node.val)  # Process root
    
    dfs(root)
    return result

def postorder_iterative(root: TreeNode) -> list[int]:
    """
    Modified preorder (Root → Right → Left) then reverse.
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    
    return result[::-1]  # Reverse
```

### 4. Level Order (BFS)

```python
from collections import deque

def level_order(root: TreeNode) -> list[list[int]]:
    """
    Process level by level using BFS.
    
    Time: O(n)
    Space: O(n)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result
```

---

## 🔥 Common Tree Problems

### Maximum Depth (LC 104)

```python
def max_depth(root: TreeNode) -> int:
    """
    Height of tree = max depth.
    
    Bottom-up approach:
    - Base: null node has depth 0
    - Recursive: max(left, right) + 1
    
    Time: O(n), Space: O(h)
    """
    if not root:
        return 0
    
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    return max(left_depth, right_depth) + 1
```

### Same Tree (LC 100)

```python
def is_same_tree(p: TreeNode, q: TreeNode) -> bool:
    """
    Check if two trees are identical.
    """
    if not p and not q:
        return True
    if not p or not q:
        return False
    
    return (p.val == q.val and 
            is_same_tree(p.left, q.left) and 
            is_same_tree(p.right, q.right))
```

### Invert Binary Tree (LC 226)

```python
def invert_tree(root: TreeNode) -> TreeNode:
    """
    Mirror the tree.
    
    Swap left and right children recursively.
    """
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recursively invert subtrees
    invert_tree(root.left)
    invert_tree(root.right)
    
    return root
```

### Symmetric Tree (LC 101)

```python
def is_symmetric(root: TreeNode) -> bool:
    """
    Check if tree is mirror of itself.
    """
    def is_mirror(t1, t2):
        if not t1 and not t2:
            return True
        if not t1 or not t2:
            return False
        
        return (t1.val == t2.val and 
                is_mirror(t1.left, t2.right) and 
                is_mirror(t1.right, t2.left))
    
    return is_mirror(root, root)
```

### Path Sum (LC 112)

```python
def has_path_sum(root: TreeNode, target_sum: int) -> bool:
    """
    Check if any root-to-leaf path sums to target.
    
    Top-down approach: subtract as we go.
    """
    if not root:
        return False
    
    # Leaf node check
    if not root.left and not root.right:
        return root.val == target_sum
    
    remaining = target_sum - root.val
    
    return (has_path_sum(root.left, remaining) or 
            has_path_sum(root.right, remaining))
```

### Lowest Common Ancestor (LC 236)

```python
def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA of two nodes in binary tree.
    
    Key insight:
    - If root is p or q, root is LCA
    - If p and q in different subtrees, root is LCA
    - If both in same subtree, recurse
    
    Time: O(n), Space: O(h)
    """
    if not root or root == p or root == q:
        return root
    
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    # p and q in different subtrees
    if left and right:
        return root
    
    # Both in same subtree
    return left if left else right
```

---

## 📐 Tree Patterns

### Pattern 1: Top-Down (Passing Info Down)

```python
def max_depth_topdown(root):
    """
    Pass depth as parameter.
    """
    max_depth = 0
    
    def dfs(node, depth):
        nonlocal max_depth
        if not node:
            return
        
        if not node.left and not node.right:
            max_depth = max(max_depth, depth)
        
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    
    dfs(root, 1)
    return max_depth
```

### Pattern 2: Bottom-Up (Returning Info Up)

```python
def is_balanced(root):
    """
    Check if tree is height-balanced.
    Return height, use -1 to indicate unbalanced.
    """
    def height(node):
        if not node:
            return 0
        
        left_height = height(node.left)
        if left_height == -1:
            return -1
        
        right_height = height(node.right)
        if right_height == -1:
            return -1
        
        if abs(left_height - right_height) > 1:
            return -1
        
        return max(left_height, right_height) + 1
    
    return height(root) != -1
```

---

## 📋 Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Traversal | O(n) | O(h) |
| Search (BST) | O(log n) avg | O(1) |
| Search (Binary) | O(n) | O(1) |
| Level Order | O(n) | O(n) |

Where n = nodes, h = height (log n for balanced, n for skewed)

---

## ➡️ Next: [BST Operations](../02-BST-Operations/)
