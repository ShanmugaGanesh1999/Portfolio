# Design Add and Search Words Data Structure

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 211 | Trie + DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design WordDictionary supporting addWord and search with '.' wildcard matching any letter.

### Constraints & Clarifying Questions
1. **'.' matches any single character?** Yes.
2. **Multiple '.' in pattern?** Yes.
3. **Character set?** Lowercase letters + '.'.
4. **Performance priority?** Balance add/search.

### Edge Cases
1. **All dots:** "..." matches any 3-letter word
2. **No words added:** search returns False
3. **Empty string:** Handle appropriately

---

## Phase 2: High-Level Approach

### Approach: Trie with DFS for Wildcards
Regular Trie for addWord. DFS exploring all children at '.' positions.

**Core Insight:** '.' requires branching to all children at that level.

---

## Phase 3: Python Code

```python
class TrieNode:
    """Node in Trie."""
    
    def __init__(self):
        self.children = {}
        self.is_end = False


class WordDictionary:
    """
    Dictionary supporting wildcard search.
    
    Time Complexity:
        - addWord: O(m)
        - search: O(m) best, O(26^m) worst (all dots)
    """
    
    def __init__(self):
        """Initialize with empty trie."""
        self.root = TrieNode()
    
    def addWord(self, word: str) -> None:
        """
        Add word to dictionary.
        
        Args:
            word: Word to add
        """
        node = self.root
        
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.is_end = True
    
    def search(self, word: str) -> bool:
        """
        Search for word, '.' matches any character.
        
        Args:
            word: Pattern to search
        
        Returns:
            True if match found
        """
        return self._search_from(word, 0, self.root)
    
    def _search_from(self, word: str, idx: int, node: TrieNode) -> bool:
        """
        DFS search from given node.
        
        Args:
            word: Pattern
            idx: Current position in pattern
            node: Current trie node
        
        Returns:
            True if match found from this point
        """
        if idx == len(word):
            return node.is_end
        
        char = word[idx]
        
        if char == '.':
            # Try all children
            for child in node.children.values():
                if self._search_from(word, idx + 1, child):
                    return True
            return False
        else:
            # Regular character
            if char not in node.children:
                return False
            return self._search_from(word, idx + 1, node.children[char])


class WordDictionaryIterative:
    """
    Alternative: BFS approach using queue.
    """
    
    def __init__(self):
        self.root = TrieNode()
    
    def addWord(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        from collections import deque
        
        queue = deque([(self.root, 0)])
        
        while queue:
            node, idx = queue.popleft()
            
            if idx == len(word):
                if node.is_end:
                    return True
                continue
            
            char = word[idx]
            
            if char == '.':
                for child in node.children.values():
                    queue.append((child, idx + 1))
            elif char in node.children:
                queue.append((node.children[char], idx + 1))
        
        return False
```

---

## Phase 4: Dry Run

**Operations:**
1. `addWord("bad")`
2. `addWord("dad")`
3. `addWord("mad")`
4. `search("pad")` → False
5. `search("bad")` → True
6. `search(".ad")` → True
7. `search("b..")` → True

**Trie Structure:**
```
root
 ├─b─a─d (end)
 ├─d─a─d (end)
 └─m─a─d (end)
```

**search(".ad"):**
- At '.': try b, d, m
- At 'a': continue from each
- At 'd': check is_end → True for all

---

## Phase 5: Complexity Analysis

### Time Complexity
- **addWord:** O(m) - m = word length
- **search:** O(m) to O(26^m) depending on wildcards

### Space Complexity: O(N × M)
Total characters across all words.

---

## Phase 6: Follow-Up Questions

1. **"Support '*' (zero or more)?"**
   → DP or more complex matching; greedy for single '*'.

2. **"Delete words?"**
   → Reference counting or mark deleted.

3. **"Case insensitive?"**
   → Normalize on add and search.
