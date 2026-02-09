# 🌳 Trees - Complete Problem Set

## Problem 1: Invert Binary Tree (Easy)
**LeetCode 226**

### Problem
Invert a binary tree (mirror image).

### Intuition
Swap left and right children recursively at each node.

### Solution
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invertTree(root: TreeNode) -> TreeNode:
    """
    Time: O(n)
    Space: O(h) for recursion
    """
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recursively invert subtrees
    invertTree(root.left)
    invertTree(root.right)
    
    return root
```

---

## Problem 2: Maximum Depth of Binary Tree (Easy)
**LeetCode 104**

### Problem
Find maximum depth (number of nodes on longest path from root to leaf).

### Intuition
Depth = 1 + max(left_depth, right_depth)

### Solution
```python
def maxDepth(root: TreeNode) -> int:
    """
    Time: O(n)
    Space: O(h)
    """
    if not root:
        return 0
    
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

---

## Problem 3: Diameter of Binary Tree (Easy)
**LeetCode 543**

### Problem
Find length of longest path between any two nodes.

### Intuition
At each node, diameter through it = left_height + right_height. Track global max.

### Solution
```python
def diameterOfBinaryTree(root: TreeNode) -> int:
    """
    Time: O(n)
    Space: O(h)
    """
    diameter = 0
    
    def height(node):
        nonlocal diameter
        
        if not node:
            return 0
        
        left_h = height(node.left)
        right_h = height(node.right)
        
        # Update diameter
        diameter = max(diameter, left_h + right_h)
        
        return 1 + max(left_h, right_h)
    
    height(root)
    return diameter
```

---

## Problem 4: Balanced Binary Tree (Easy)
**LeetCode 110**

### Problem
Check if tree is height-balanced (heights differ by at most 1).

### Intuition
At each node, check if balanced and return height. Use -1 to indicate unbalanced.

### Solution
```python
def isBalanced(root: TreeNode) -> bool:
    """
    Time: O(n)
    Space: O(h)
    """
    def check(node):
        if not node:
            return 0
        
        left_h = check(node.left)
        if left_h == -1:
            return -1
        
        right_h = check(node.right)
        if right_h == -1:
            return -1
        
        if abs(left_h - right_h) > 1:
            return -1
        
        return 1 + max(left_h, right_h)
    
    return check(root) != -1
```

---

## Problem 5: Same Tree (Easy)
**LeetCode 100**

### Problem
Check if two binary trees are identical.

### Intuition
Both null = same. Both have same value and subtrees are same.

### Solution
```python
def isSameTree(p: TreeNode, q: TreeNode) -> bool:
    """
    Time: O(n)
    Space: O(h)
    """
    if not p and not q:
        return True
    if not p or not q:
        return False
    
    return (p.val == q.val and 
            isSameTree(p.left, q.left) and 
            isSameTree(p.right, q.right))
```

---

## Problem 6: Subtree of Another Tree (Easy)
**LeetCode 572**

### Problem
Check if tree t is subtree of tree s.

### Intuition
At each node in s, check if subtree matches t.

### Solution
```python
def isSubtree(root: TreeNode, subRoot: TreeNode) -> bool:
    """
    Time: O(m * n)
    Space: O(h)
    """
    def isSame(p, q):
        if not p and not q:
            return True
        if not p or not q:
            return False
        return p.val == q.val and isSame(p.left, q.left) and isSame(p.right, q.right)
    
    if not root:
        return False
    
    if isSame(root, subRoot):
        return True
    
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

---

## Problem 7: Symmetric Tree (Easy)
**LeetCode 101**

### Problem
Check if tree is symmetric around its center.

### Intuition
Compare left subtree with mirror of right subtree.

### Solution
```python
def isSymmetric(root: TreeNode) -> bool:
    """
    Time: O(n)
    Space: O(h)
    """
    def isMirror(left, right):
        if not left and not right:
            return True
        if not left or not right:
            return False
        
        return (left.val == right.val and 
                isMirror(left.left, right.right) and 
                isMirror(left.right, right.left))
    
    return isMirror(root, root)
```

---

## Problem 8: Lowest Common Ancestor of BST (Easy)
**LeetCode 235**

### Problem
Find LCA of two nodes in BST.

### Intuition
If both values < root, go left. If both > root, go right. Otherwise, root is LCA.

### Solution
```python
def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Time: O(h)
    Space: O(1) iterative
    """
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    
    return None
```

---

## Problem 9: Binary Tree Level Order Traversal (Medium)
**LeetCode 102**

### Problem
Return level order traversal as 2D list.

### Intuition
BFS with queue. Process level by level.

### Solution
```python
from collections import deque

def levelOrder(root: TreeNode) -> list[list[int]]:
    """
    Time: O(n)
    Space: O(n)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
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
```

---

## Problem 10: Binary Tree Right Side View (Medium)
**LeetCode 199**

### Problem
Return values visible from right side.

### Intuition
BFS: take last element of each level. Or DFS: visit right first.

### Solution
```python
def rightSideView(root: TreeNode) -> list[int]:
    """
    BFS approach
    Time: O(n)
    Space: O(n)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            if i == level_size - 1:  # Rightmost
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result

def rightSideView_dfs(root: TreeNode) -> list[int]:
    """
    DFS approach (right first)
    """
    result = []
    
    def dfs(node, depth):
        if not node:
            return
        
        if depth == len(result):
            result.append(node.val)
        
        dfs(node.right, depth + 1)  # Right first
        dfs(node.left, depth + 1)
    
    dfs(root, 0)
    return result
```

---

## Problem 11: Count Good Nodes in Binary Tree (Medium)
**LeetCode 1448**

### Problem
Count nodes where value is >= all ancestors.

### Intuition
DFS tracking max value seen so far on path.

### Solution
```python
def goodNodes(root: TreeNode) -> int:
    """
    Time: O(n)
    Space: O(h)
    """
    def dfs(node, max_so_far):
        if not node:
            return 0
        
        count = 1 if node.val >= max_so_far else 0
        new_max = max(max_so_far, node.val)
        
        return count + dfs(node.left, new_max) + dfs(node.right, new_max)
    
    return dfs(root, root.val)
```

---

## Problem 12: Validate Binary Search Tree (Medium)
**LeetCode 98**

### Problem
Check if tree is valid BST.

### Intuition
Each node must be within valid range. Update range as we traverse.

### Solution
```python
def isValidBST(root: TreeNode) -> bool:
    """
    Time: O(n)
    Space: O(h)
    """
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))
```

---

## Problem 13: Kth Smallest Element in BST (Medium)
**LeetCode 230**

### Problem
Find kth smallest element in BST.

### Intuition
Inorder traversal visits nodes in sorted order. Count until k.

### Solution
```python
def kthSmallest(root: TreeNode, k: int) -> int:
    """
    Time: O(h + k)
    Space: O(h)
    """
    stack = []
    current = root
    count = 0
    
    while stack or current:
        # Go left
        while current:
            stack.append(current)
            current = current.left
        
        # Process node
        current = stack.pop()
        count += 1
        
        if count == k:
            return current.val
        
        # Go right
        current = current.right
    
    return -1
```

---

## Problem 14: Construct Binary Tree from Preorder and Inorder (Medium)
**LeetCode 105**

### Problem
Build tree from preorder and inorder traversals.

### Intuition
First element of preorder is root. Find root in inorder to determine left/right subtrees.

### Solution
```python
def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode:
    """
    Time: O(n)
    Space: O(n)
    """
    inorder_map = {val: idx for idx, val in enumerate(inorder)}
    
    def build(pre_start, pre_end, in_start, in_end):
        if pre_start > pre_end:
            return None
        
        root_val = preorder[pre_start]
        root = TreeNode(root_val)
        
        in_root = inorder_map[root_val]
        left_size = in_root - in_start
        
        root.left = build(pre_start + 1, pre_start + left_size,
                         in_start, in_root - 1)
        root.right = build(pre_start + left_size + 1, pre_end,
                          in_root + 1, in_end)
        
        return root
    
    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

---

## Problem 15: Path Sum II (Medium)
**LeetCode 113**

### Problem
Find all root-to-leaf paths where sum equals target.

### Intuition
Backtracking DFS. Track current path and remaining sum.

### Solution
```python
def pathSum(root: TreeNode, targetSum: int) -> list[list[int]]:
    """
    Time: O(n²) worst case
    Space: O(n)
    """
    result = []
    
    def dfs(node, remaining, path):
        if not node:
            return
        
        path.append(node.val)
        
        # Check if leaf with target sum
        if not node.left and not node.right and remaining == node.val:
            result.append(path[:])  # Copy path
        
        dfs(node.left, remaining - node.val, path)
        dfs(node.right, remaining - node.val, path)
        
        path.pop()  # Backtrack
    
    dfs(root, targetSum, [])
    return result
```

---

## Problem 16: Lowest Common Ancestor (Medium)
**LeetCode 236**

### Problem
Find LCA of two nodes in binary tree.

### Intuition
If node is p or q, return it. If both subtrees return non-null, current is LCA.

### Solution
```python
def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Time: O(n)
    Space: O(h)
    """
    if not root or root == p or root == q:
        return root
    
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root  # Current node is LCA
    
    return left if left else right
```

---

## Problem 17: Binary Tree Maximum Path Sum (Hard)
**LeetCode 124**

### Problem
Find maximum path sum (any path, not necessarily root-to-leaf).

### Intuition
At each node, max path through it = node.val + max(left, 0) + max(right, 0). Return max single branch.

### Solution
```python
def maxPathSum(root: TreeNode) -> int:
    """
    Time: O(n)
    Space: O(h)
    """
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        
        if not node:
            return 0
        
        # Only take positive contributions
        left_max = max(dfs(node.left), 0)
        right_max = max(dfs(node.right), 0)
        
        # Path through current node
        max_sum = max(max_sum, node.val + left_max + right_max)
        
        # Return max single branch for parent
        return node.val + max(left_max, right_max)
    
    dfs(root)
    return max_sum
```

---

## Problem 18: Serialize and Deserialize Binary Tree (Hard)
**LeetCode 297**

### Problem
Design serialization and deserialization of binary tree.

### Intuition
Preorder traversal with null markers. Rebuild using queue.

### Solution
```python
class Codec:
    """
    Time: O(n) for both
    Space: O(n)
    """
    def serialize(self, root: TreeNode) -> str:
        def dfs(node):
            if not node:
                return ['null']
            
            return [str(node.val)] + dfs(node.left) + dfs(node.right)
        
        return ','.join(dfs(root))
    
    def deserialize(self, data: str) -> TreeNode:
        values = iter(data.split(','))
        
        def dfs():
            val = next(values)
            
            if val == 'null':
                return None
            
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            
            return node
        
        return dfs()
```

---

## Problem 19: Binary Tree Zigzag Level Order Traversal (Medium)
**LeetCode 103**

### Problem
Level order traversal with alternating direction.

### Intuition
BFS with flag to reverse alternate levels.

### Solution
```python
def zigzagLevelOrder(root: TreeNode) -> list[list[int]]:
    """
    Time: O(n)
    Space: O(n)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        level = deque()
        
        for _ in range(level_size):
            node = queue.popleft()
            
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
```

---

## Problem 20: Sum Root to Leaf Numbers (Medium)
**LeetCode 129**

### Problem
Each root-to-leaf path forms a number. Find sum of all numbers.

### Intuition
DFS tracking current number. Add to sum at leaf.

### Solution
```python
def sumNumbers(root: TreeNode) -> int:
    """
    Time: O(n)
    Space: O(h)
    """
    def dfs(node, current_num):
        if not node:
            return 0
        
        current_num = current_num * 10 + node.val
        
        # Leaf node
        if not node.left and not node.right:
            return current_num
        
        return dfs(node.left, current_num) + dfs(node.right, current_num)
    
    return dfs(root, 0)
```

---

## Problem 21: House Robber III (Medium)
**LeetCode 337**

### Problem
Rob houses in tree. Can't rob directly connected nodes.

### Intuition
Each node returns (rob_this, skip_this). Choose optimal at each level.

### Solution
```python
def rob(root: TreeNode) -> int:
    """
    Time: O(n)
    Space: O(h)
    """
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, skip)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Rob this node: can't rob children
        rob_current = node.val + left[1] + right[1]
        
        # Skip this node: take max of each child
        skip_current = max(left) + max(right)
        
        return (rob_current, skip_current)
    
    return max(dfs(root))
```

---

## Problem 22: Binary Search Tree Iterator (Medium)
**LeetCode 173**

### Problem
Implement iterator for inorder traversal of BST.

### Intuition
Controlled recursion using stack. Push all left nodes.

### Solution
```python
class BSTIterator:
    """
    next(): O(1) amortized
    hasNext(): O(1)
    Space: O(h)
    """
    def __init__(self, root: TreeNode):
        self.stack = []
        self._push_left(root)
    
    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self) -> int:
        node = self.stack.pop()
        self._push_left(node.right)
        return node.val
    
    def hasNext(self) -> bool:
        return len(self.stack) > 0
```

---

## Problem 23: Flatten Binary Tree to Linked List (Medium)
**LeetCode 114**

### Problem
Flatten tree to linked list in preorder.

### Intuition
Reverse postorder (right, left, root). Keep track of previous node.

### Solution
```python
def flatten(root: TreeNode) -> None:
    """
    Time: O(n)
    Space: O(h)
    """
    prev = None
    
    def dfs(node):
        nonlocal prev
        
        if not node:
            return
        
        # Process right first
        dfs(node.right)
        dfs(node.left)
        
        # Link current to previous
        node.right = prev
        node.left = None
        prev = node
    
    dfs(root)
```

---

## Problem 24: Populating Next Right Pointers (Medium)
**LeetCode 116**

### Problem
Connect each node to its next right node (perfect binary tree).

### Intuition
Use next pointers of current level to traverse next level.

### Solution
```python
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next

def connect(root: Node) -> Node:
    """
    Time: O(n)
    Space: O(1)
    """
    if not root:
        return root
    
    leftmost = root
    
    while leftmost.left:
        current = leftmost
        
        while current:
            # Connect children
            current.left.next = current.right
            
            # Connect across parents
            if current.next:
                current.right.next = current.next.left
            
            current = current.next
        
        leftmost = leftmost.left
    
    return root
```

---

## 📊 Trees Summary

| Problem | Difficulty | Traversal | Key Technique |
|---------|------------|-----------|---------------|
| Invert Tree | Easy | Any | Swap children |
| Max Depth | Easy | DFS | Recursive depth |
| Diameter | Easy | DFS | Height + diameter |
| Balanced Tree | Easy | DFS | Return height or -1 |
| Same Tree | Easy | DFS | Compare both trees |
| Subtree | Easy | DFS | Check at each node |
| Symmetric | Easy | DFS | Mirror comparison |
| LCA (BST) | Easy | BST property | Compare values |
| Level Order | Medium | BFS | Queue per level |
| Right Side View | Medium | BFS/DFS | Last per level |
| Good Nodes | Medium | DFS | Track max on path |
| Validate BST | Medium | DFS | Range validation |
| Kth Smallest | Medium | Inorder | Count in traversal |
| Build Tree | Medium | DFS | Preorder/Inorder split |
| Path Sum II | Medium | Backtracking | Track path |
| LCA (BT) | Medium | DFS | Find in subtrees |
| Max Path Sum | Hard | DFS | Single branch return |
| Serialize | Hard | Preorder | Null markers |
