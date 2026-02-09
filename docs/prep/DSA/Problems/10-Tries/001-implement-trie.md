# Implement Trie (Prefix Tree)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 208 | Trie |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Implement Trie with insert, search, and startsWith operations.

### Constraints & Clarifying Questions
1. **Character set?** Lowercase English letters.
2. **Word length?** Up to 2000.
3. **Number of operations?** Up to 30,000.
4. **Empty string?** May need handling.

### Edge Cases
1. **Empty string:** Handle edge case
2. **Prefix is a word:** startsWith vs search
3. **Repeated inserts:** Should be idempotent

---

## Phase 2: High-Level Approach

### Approach: Tree of Nodes with Children Dictionary
Each node has children map and end-of-word flag.

**Core Insight:** Path from root represents prefix; end flag marks complete words.

---

## Phase 3: Python Code

```python
class TrieNode:
    """Node in Trie."""
    
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.is_end = False


class Trie:
    """
    Prefix tree for efficient string operations.
    
    Time Complexity:
        - insert: O(m) where m = word length
        - search: O(m)
        - startsWith: O(m)
    
    Space Complexity: O(total characters across all words)
    """
    
    def __init__(self):
        """Initialize with empty root."""
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert word into trie.
        
        Args:
            word: Word to insert
        """
        node = self.root
        
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.is_end = True
    
    def search(self, word: str) -> bool:
        """
        Check if word exists in trie.
        
        Args:
            word: Word to search
        
        Returns:
            True if word exists
        """
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def startsWith(self, prefix: str) -> bool:
        """
        Check if any word starts with prefix.
        
        Args:
            prefix: Prefix to check
        
        Returns:
            True if prefix exists
        """
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix: str) -> TrieNode:
        """
        Find node at end of prefix path.
        
        Args:
            prefix: Prefix to traverse
        
        Returns:
            Node at prefix end, or None
        """
        node = self.root
        
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        
        return node


class TrieArray:
    """
    Alternative: Array-based for fixed alphabet.
    """
    
    def __init__(self):
        self.root = [None] * 27  # 26 children + end flag at index 26
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            idx = ord(char) - ord('a')
            if node[idx] is None:
                node[idx] = [None] * 27
            node = node[idx]
        node[26] = True  # Mark end
    
    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            idx = ord(char) - ord('a')
            if node[idx] is None:
                return False
            node = node[idx]
        return node[26] is True
    
    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            idx = ord(char) - ord('a')
            if node[idx] is None:
                return False
            node = node[idx]
        return True
```

---

## Phase 4: Dry Run

**Operations:**
1. `insert("apple")`
2. `search("apple")` → True
3. `search("app")` → False
4. `startsWith("app")` → True
5. `insert("app")`
6. `search("app")` → True

**Trie Structure after insertions:**
```
root
 └─a
   └─p
     └─p (is_end after step 5)
       └─l
         └─e (is_end)
```

---

## Phase 5: Complexity Analysis

### Time Complexity
- **Insert:** O(m) - m = word length
- **Search:** O(m)
- **StartsWith:** O(m)

### Space Complexity: O(N × M)
N = number of words, M = average length. Worst case with no shared prefixes.

---

## Phase 6: Follow-Up Questions

1. **"Delete a word?"**
   → Mark is_end = False; optionally prune if no children.

2. **"Wildcard search (. matches any)?"**
   → BFS/DFS trying all children at wildcard position.

3. **"Autocomplete top k suggestions?"**
   → Store frequency at end nodes; DFS from prefix with heap.
