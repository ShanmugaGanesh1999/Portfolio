# Serialize and Deserialize Binary Tree

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 297 | Tree / BFS / DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design algorithm to serialize tree to string and deserialize back. Format is up to us.

### Constraints & Clarifying Questions
1. **Format restrictions?** None, choose any.
2. **Empty tree?** Handle it.
3. **Negative values?** Yes.
4. **Need to be efficient?** Reasonably.
5. **Unique values?** Not guaranteed.

### Edge Cases
1. **Empty tree:** Special marker
2. **Single node:** Simple case
3. **Skewed tree:** Many nulls

---

## Phase 2: High-Level Approach

### Option 1: Preorder with Nulls
Serialize using preorder; mark nulls. Deserialize recursively.

### Option 2: Level Order (BFS)
Serialize level by level; deserialize with queue.

**Core Insight:** Include null markers to uniquely reconstruct tree.

---

## Phase 3: Python Code

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Codec:
    """
    Preorder serialization with null markers.
    """
    
    def serialize(self, root: TreeNode) -> str:
        """
        Serialize tree to string.
        """
        result = []
        
        def preorder(node):
            if not node:
                result.append("N")
                return
            result.append(str(node.val))
            preorder(node.left)
            preorder(node.right)
        
        preorder(root)
        return ",".join(result)
    
    def deserialize(self, data: str) -> TreeNode:
        """
        Deserialize string to tree.
        """
        values = iter(data.split(","))
        
        def build():
            val = next(values)
            if val == "N":
                return None
            
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        
        return build()


class CodecBFS:
    """
    Level-order serialization.
    """
    
    def serialize(self, root: TreeNode) -> str:
        if not root:
            return "N"
        
        result = []
        queue = deque([root])
        
        while queue:
            node = queue.popleft()
            if node:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append("N")
        
        return ",".join(result)
    
    def deserialize(self, data: str) -> TreeNode:
        values = data.split(",")
        if values[0] == "N":
            return None
        
        root = TreeNode(int(values[0]))
        queue = deque([root])
        idx = 1
        
        while queue:
            node = queue.popleft()
            
            # Left child
            if values[idx] != "N":
                node.left = TreeNode(int(values[idx]))
                queue.append(node.left)
            idx += 1
            
            # Right child
            if values[idx] != "N":
                node.right = TreeNode(int(values[idx]))
                queue.append(node.right)
            idx += 1
        
        return root
```

---

## Phase 4: Dry Run

**Input Tree:**
```
    1
   / \
  2   3
     / \
    4   5
```

**Preorder Serialization:**
Visit order: 1 → 2 → N → N → 3 → 4 → N → N → 5 → N → N
Result: `"1,2,N,N,3,4,N,N,5,N,N"`

**Deserialization:**

| Step | Value | Action |
|------|-------|--------|
| 1 | 1 | Create root |
| 2 | 2 | root.left |
| 3 | N | 2.left = None |
| 4 | N | 2.right = None |
| 5 | 3 | root.right |
| 6 | 4 | 3.left |
| 7 | N | 4.left = None |
| 8 | N | 4.right = None |
| 9 | 5 | 3.right |
| 10 | N | 5.left = None |
| 11 | N | 5.right = None |

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each node once for both serialize and deserialize.

### Space Complexity: O(N)
String storage + recursion/queue.

---

## Phase 6: Follow-Up Questions

1. **"How to compress?"**
   → Use binary encoding, variable-length integers, omit trailing nulls.

2. **"What about BST specifically?"**
   → Only need preorder (BST property determines structure); no null markers needed.

3. **"Multiple trees in one string?"**
   → Add length prefix or delimiter between trees.
