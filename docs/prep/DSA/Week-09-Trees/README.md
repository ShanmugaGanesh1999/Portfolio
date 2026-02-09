# 📅 Week 9: Trees & Binary Search Trees

## 🎯 Overview

Trees are fundamental data structures heavily tested in FAANG interviews. This week covers tree traversals, BST operations, and common tree patterns.

---

## 📚 Topics Covered

### 1. Binary Tree Fundamentals
- Tree terminology (root, leaf, height, depth)
- Tree traversals (Preorder, Inorder, Postorder, Level Order)
- Recursive vs Iterative approaches

### 2. Binary Search Tree (BST)
- BST properties and operations
- Search, Insert, Delete
- Validate BST
- BST Iterator

### 3. Tree Patterns
- DFS patterns (Top-down, Bottom-up)
- BFS / Level Order patterns
- Path problems
- LCA (Lowest Common Ancestor)

---

## 📁 Folder Structure

```
Week-09-Trees/
├── README.md
├── 01-Tree-Fundamentals/
│   └── trees_explained.md
└── 02-BST-Operations/
    └── bst_explained.md
```

> 📝 **Note:** Practice problems for Trees can be found in the main [Problems/07-Trees/](../Problems/07-Trees/) folder.

---

## 🎯 Learning Goals

By the end of this week, you should be able to:

1. ✅ Implement all tree traversals (recursive & iterative)
2. ✅ Perform BST operations with confidence
3. ✅ Recognize top-down vs bottom-up patterns
4. ✅ Solve path sum and LCA problems
5. ✅ Handle level-order traversal variations

---

## 📊 Key Concepts

### Tree Node Definition
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

### Traversal Orders
```
        1
       / \
      2   3
     / \
    4   5

Preorder (Root-Left-Right):  1, 2, 4, 5, 3
Inorder (Left-Root-Right):   4, 2, 5, 1, 3
Postorder (Left-Right-Root): 4, 5, 2, 3, 1
Level Order:                 1, 2, 3, 4, 5
```

---

## 🔥 FAANG Interview Questions

| Problem | Difficulty | Company | Pattern |
|---------|------------|---------|---------|
| Maximum Depth | Easy | All | DFS |
| Same Tree | Easy | Google, Amazon | DFS |
| Invert Binary Tree | Easy | Google | DFS/BFS |
| Level Order Traversal | Medium | Meta, Amazon | BFS |
| Validate BST | Medium | Google, Meta | DFS |
| Lowest Common Ancestor | Medium | Meta, Amazon | DFS |
| Binary Tree Right Side View | Medium | Meta | BFS |
| Serialize/Deserialize | Hard | Meta, Google | BFS/DFS |
| Binary Tree Maximum Path Sum | Hard | Meta | DFS |

---

## ⏰ Time Commitment

- **Tree Fundamentals**: 3-4 hours
- **BST Operations**: 2-3 hours
- **Tree Patterns**: 4-5 hours
- **Problem Solving**: 5-6 hours
- **Total**: ~15 hours

---

## ✅ Progress Tracker

- [ ] Master all traversals
- [ ] Implement BST from scratch
- [ ] Understand top-down vs bottom-up
- [ ] Practice path problems
- [ ] Complete 15+ tree problems
