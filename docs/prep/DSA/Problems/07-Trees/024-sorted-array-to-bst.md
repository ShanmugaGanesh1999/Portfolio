# Convert Sorted Array to BST

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 108 | Tree / Divide and Conquer |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Convert sorted array to height-balanced BST. Height-balanced means depths of subtrees differ by at most 1.

### Constraints & Clarifying Questions
1. **Sorted ascending?** Yes.
2. **Unique values?** Yes.
3. **Empty array?** Return None.
4. **Multiple valid BSTs?** Yes, return any height-balanced one.

### Edge Cases
1. **Empty array:** None
2. **Single element:** Single node
3. **Two elements:** Root with one child

---

## Phase 2: High-Level Approach

### Approach: Divide and Conquer
Use middle element as root; left half forms left subtree, right half forms right subtree.

**Core Insight:** Choosing middle ensures balanced tree; sorted array ensures BST property.

---

## Phase 3: Python Code

```python
from typing import List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def solve(nums: List[int]) -> TreeNode:
    """
    Convert sorted array to height-balanced BST.
    
    Args:
        nums: Sorted array
    
    Returns:
        Root of BST
    """
    def build(left: int, right: int) -> TreeNode:
        if left > right:
            return None
        
        # Choose middle element as root
        mid = (left + right) // 2
        
        node = TreeNode(nums[mid])
        node.left = build(left, mid - 1)
        node.right = build(mid + 1, right)
        
        return node
    
    return build(0, len(nums) - 1)


def solve_right_middle(nums: List[int]) -> TreeNode:
    """
    Alternative: Use right middle for even-length arrays.
    Creates different valid BST.
    """
    def build(left, right):
        if left > right:
            return None
        
        # Use right middle
        mid = (left + right + 1) // 2
        
        node = TreeNode(nums[mid])
        node.left = build(left, mid - 1)
        node.right = build(mid + 1, right)
        
        return node
    
    return build(0, len(nums) - 1)
```

---

## Phase 4: Dry Run

**Input:** `[-10, -3, 0, 5, 9]`

| Call | left | right | mid | Action |
|------|------|-------|-----|--------|
| 1 | 0 | 4 | 2 | root=0 |
| 2 | 0 | 1 | 0 | left of 0, root=-10 |
| 3 | 1 | 1 | 1 | right of -10, root=-3 |
| 4 | 3 | 4 | 3 | right of 0, root=5 |
| 5 | 4 | 4 | 4 | right of 5, root=9 |

**Result:**
```
      0
     / \
   -10  5
     \   \
     -3   9
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Visit each element once.

### Space Complexity: O(log N)
Recursion depth for balanced tree.

---

## Phase 6: Follow-Up Questions

1. **"Convert sorted linked list to BST?"**
   → Either convert to array first, or use slow/fast to find middle.

2. **"Multiple valid answers?"**
   → Yes; choosing left vs right middle gives different valid BSTs.

3. **"What if array isn't sorted?"**
   → Sort first O(N log N), then apply this algorithm.
