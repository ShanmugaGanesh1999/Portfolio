# 🎯 Binary Search Tree (BST) - Complete Guide

## 📌 What is a BST?

A Binary Search Tree is a binary tree with the property:
- **Left subtree** contains only nodes with values **< root**
- **Right subtree** contains only nodes with values **> root**
- Both subtrees are also BSTs

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

**Key Property**: Inorder traversal gives sorted order!

---

## 🔧 BST Implementation

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None
    
    # ==================== SEARCH ====================
    def search(self, val: int) -> TreeNode:
        """
        Search for value in BST.
        
        Time: O(log n) average, O(n) worst
        Space: O(1)
        """
        current = self.root
        
        while current:
            if val == current.val:
                return current
            elif val < current.val:
                current = current.left
            else:
                current = current.right
        
        return None
    
    def search_recursive(self, node: TreeNode, val: int) -> TreeNode:
        """
        Recursive search.
        """
        if not node or node.val == val:
            return node
        
        if val < node.val:
            return self.search_recursive(node.left, val)
        return self.search_recursive(node.right, val)
    
    # ==================== INSERT ====================
    def insert(self, val: int) -> TreeNode:
        """
        Insert value into BST.
        
        Time: O(log n) average, O(n) worst
        Space: O(1)
        """
        new_node = TreeNode(val)
        
        if not self.root:
            self.root = new_node
            return new_node
        
        current = self.root
        
        while True:
            if val < current.val:
                if not current.left:
                    current.left = new_node
                    return new_node
                current = current.left
            else:
                if not current.right:
                    current.right = new_node
                    return new_node
                current = current.right
    
    def insert_recursive(self, node: TreeNode, val: int) -> TreeNode:
        """
        Recursive insert.
        Returns root of subtree.
        """
        if not node:
            return TreeNode(val)
        
        if val < node.val:
            node.left = self.insert_recursive(node.left, val)
        else:
            node.right = self.insert_recursive(node.right, val)
        
        return node
    
    # ==================== DELETE ====================
    def delete(self, val: int) -> TreeNode:
        """
        Delete value from BST.
        
        Three cases:
        1. Node is leaf: just remove
        2. Node has one child: replace with child
        3. Node has two children: replace with successor
        
        Time: O(log n) average, O(n) worst
        """
        self.root = self._delete_recursive(self.root, val)
        return self.root
    
    def _delete_recursive(self, node: TreeNode, val: int) -> TreeNode:
        if not node:
            return None
        
        if val < node.val:
            node.left = self._delete_recursive(node.left, val)
        elif val > node.val:
            node.right = self._delete_recursive(node.right, val)
        else:
            # Node to delete found
            
            # Case 1 & 2: No child or one child
            if not node.left:
                return node.right
            if not node.right:
                return node.left
            
            # Case 3: Two children
            # Find inorder successor (smallest in right subtree)
            successor = self._find_min(node.right)
            node.val = successor.val
            node.right = self._delete_recursive(node.right, successor.val)
        
        return node
    
    def _find_min(self, node: TreeNode) -> TreeNode:
        """Find minimum node in subtree."""
        while node.left:
            node = node.left
        return node
    
    def _find_max(self, node: TreeNode) -> TreeNode:
        """Find maximum node in subtree."""
        while node.right:
            node = node.right
        return node
    
    # ==================== TRAVERSALS ====================
    def inorder(self) -> list[int]:
        """Returns sorted order for BST."""
        result = []
        
        def dfs(node):
            if not node:
                return
            dfs(node.left)
            result.append(node.val)
            dfs(node.right)
        
        dfs(self.root)
        return result
```

---

## 🔥 Common BST Problems

### Validate BST (LC 98)

```python
def is_valid_bst(root: TreeNode) -> bool:
    """
    Check if tree is valid BST.
    
    Key: Each node must be within valid range.
    
    Time: O(n), Space: O(h)
    """
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

# Alternative: Inorder should be strictly increasing
def is_valid_bst_inorder(root: TreeNode) -> bool:
    prev = float('-inf')
    
    def inorder(node):
        nonlocal prev
        if not node:
            return True
        
        if not inorder(node.left):
            return False
        
        if node.val <= prev:
            return False
        prev = node.val
        
        return inorder(node.right)
    
    return inorder(root)
```

### Kth Smallest Element (LC 230)

```python
def kth_smallest(root: TreeNode, k: int) -> int:
    """
    Find kth smallest element in BST.
    
    Inorder traversal gives sorted order.
    
    Time: O(H + k), Space: O(H)
    """
    stack = []
    current = root
    count = 0
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        count += 1
        
        if count == k:
            return current.val
        
        current = current.right
    
    return -1
```

### LCA in BST (LC 235)

```python
def lowest_common_ancestor_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    LCA in BST - simpler than general binary tree!
    
    Use BST property to navigate:
    - If both < root, go left
    - If both > root, go right
    - Otherwise, root is LCA
    
    Time: O(H), Space: O(1)
    """
    current = root
    
    while current:
        if p.val < current.val and q.val < current.val:
            current = current.left
        elif p.val > current.val and q.val > current.val:
            current = current.right
        else:
            return current
    
    return None
```

### BST Iterator (LC 173)

```python
class BSTIterator:
    """
    Iterator for BST in ascending order.
    
    Simulates controlled inorder traversal.
    """
    
    def __init__(self, root: TreeNode):
        self.stack = []
        self._push_left(root)
    
    def _push_left(self, node):
        """Push all left children to stack."""
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self) -> int:
        """Return next smallest element."""
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val
    
    def hasNext(self) -> bool:
        """Return whether we have more elements."""
        return len(self.stack) > 0

# Time: O(1) average for next()
# Space: O(h) for stack
```

### Convert Sorted Array to BST (LC 108)

```python
def sorted_array_to_bst(nums: list[int]) -> TreeNode:
    """
    Create height-balanced BST from sorted array.
    
    Middle element becomes root (ensures balance).
    
    Time: O(n), Space: O(log n)
    """
    def build(left, right):
        if left > right:
            return None
        
        mid = (left + right) // 2
        node = TreeNode(nums[mid])
        
        node.left = build(left, mid - 1)
        node.right = build(mid + 1, right)
        
        return node
    
    return build(0, len(nums) - 1)
```

### Delete Node in BST (LC 450)

```python
def delete_node(root: TreeNode, key: int) -> TreeNode:
    """
    Delete a node from BST.
    
    Time: O(H), Space: O(H)
    """
    if not root:
        return None
    
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        # Node found - delete it
        
        # Case 1 & 2: One or no child
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        
        # Case 3: Two children
        # Find successor (smallest in right)
        successor = root.right
        while successor.left:
            successor = successor.left
        
        root.val = successor.val
        root.right = delete_node(root.right, successor.val)
    
    return root
```

---

## 📊 BST vs Other Trees

| Operation | BST (avg) | BST (worst) | Balanced BST | Hash Table |
|-----------|-----------|-------------|--------------|------------|
| Search | O(log n) | O(n) | O(log n) | O(1) |
| Insert | O(log n) | O(n) | O(log n) | O(1) |
| Delete | O(log n) | O(n) | O(log n) | O(1) |
| Min/Max | O(log n) | O(n) | O(log n) | O(n) |
| Predecessor | O(log n) | O(n) | O(log n) | N/A |
| Range Query | O(k + log n) | O(k + n) | O(k + log n) | O(n) |

**When to use BST over Hash Table:**
- Need ordered data (in-order traversal)
- Range queries
- Finding predecessor/successor
- Ordered operations (kth element)

---

## ⚠️ Common Mistakes

1. **Forgetting BST property** in validation (all left < root, not just immediate child)
2. **Not handling duplicates** - decide if they go left or right
3. **Memory leaks** in delete operation
4. **Stack overflow** on skewed trees with recursion

---

## 🎓 Key Takeaways

1. **Inorder traversal = sorted order** for BST
2. **Validate with ranges**, not just parent comparison
3. **LCA in BST** is O(H), simpler than binary tree
4. **Use iterative** for production (avoids stack overflow)
5. **Consider self-balancing BSTs** (AVL, Red-Black) for guaranteed O(log n)

---

## ➡️ Next: [Tree Patterns](../03-Tree-Patterns/)
