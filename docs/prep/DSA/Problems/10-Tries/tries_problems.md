# 🌲 Tries - Complete Problem Set

## Problem 1: Implement Trie (Prefix Tree) (Medium)
**LeetCode 208**

### Problem
Implement Trie with insert, search, and startsWith.

### Intuition
Each node has children (26 letters) and isEnd flag. Traverse character by character.

### Solution
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    """
    All operations: O(m) where m = word length
    Space: O(total characters)
    """
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.is_end
    
    def startsWith(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None
    
    def _traverse(self, s: str) -> TrieNode:
        node = self.root
        for char in s:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

---

## Problem 2: Design Add and Search Words Data Structure (Medium)
**LeetCode 211**

### Problem
Design data structure supporting addWord and search. Search supports '.' as wildcard.

### Intuition
Trie with DFS for wildcard handling.

### Solution
```python
class WordDictionary:
    """
    addWord: O(m)
    search: O(m) without wildcards, O(26^m) worst case with wildcards
    Space: O(total characters)
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
        def dfs(node, index):
            if index == len(word):
                return node.is_end
            
            char = word[index]
            
            if char == '.':
                # Try all children
                for child in node.children.values():
                    if dfs(child, index + 1):
                        return True
                return False
            else:
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)
        
        return dfs(self.root, 0)
```

---

## Problem 3: Word Search II (Hard)
**LeetCode 212**

### Problem
Find all words from dictionary that exist in grid.

### Intuition
Build Trie from words. DFS from each cell, traverse Trie simultaneously.

### Solution
```python
def findWords(board: list[list[str]], words: list[str]) -> list[str]:
    """
    Time: O(m * n * 4^L + W * L) where L = max word length, W = words count
    Space: O(W * L)
    """
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word = word  # Store word at end
    
    rows, cols = len(board), len(board[0])
    result = set()
    
    def dfs(r, c, node):
        char = board[r][c]
        
        if char not in node.children:
            return
        
        next_node = node.children[char]
        
        if hasattr(next_node, 'word'):
            result.add(next_node.word)
            # Don't return - might be prefix of another word
        
        # Mark visited
        board[r][c] = '#'
        
        # Explore neighbors
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        
        # Restore
        board[r][c] = char
    
    # Start DFS from each cell
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    
    return list(result)
```

### Optimized with Pruning:
```python
def findWords_optimized(board: list[list[str]], words: list[str]) -> list[str]:
    """Prune Trie as words are found"""
    
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.word = None
    
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word = word
    
    rows, cols = len(board), len(board[0])
    result = []
    
    def dfs(r, c, parent, char_key):
        node = parent.children[char_key]
        
        if node.word:
            result.append(node.word)
            node.word = None  # Avoid duplicates
        
        # Mark visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore neighbors
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                board[nr][nc] != '#' and board[nr][nc] in node.children):
                dfs(nr, nc, node, board[nr][nc])
        
        # Restore
        board[r][c] = temp
        
        # Prune Trie - remove leaf nodes
        if not node.children:
            del parent.children[char_key]
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] in root.children:
                dfs(r, c, root, board[r][c])
    
    return result
```

---

## Problem 4: Replace Words (Medium)
**LeetCode 648**

### Problem
Replace words with shortest root from dictionary.

### Intuition
Build Trie from roots. For each word, find shortest prefix in Trie.

### Solution
```python
def replaceWords(dictionary: list[str], sentence: str) -> str:
    """
    Time: O(d * w + s * w) where d = dict size, w = word length, s = sentence words
    Space: O(d * w)
    """
    # Build Trie from dictionary
    root = TrieNode()
    for word in dictionary:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def find_root(word):
        node = root
        prefix = []
        
        for char in word:
            if char not in node.children:
                break
            
            prefix.append(char)
            node = node.children[char]
            
            if node.is_end:
                return ''.join(prefix)
        
        return word  # No root found
    
    words = sentence.split()
    return ' '.join(find_root(word) for word in words)
```

---

## 📊 Trie Summary

| Problem | Difficulty | Operation | Key Technique |
|---------|------------|-----------|---------------|
| Implement Trie | Medium | Basic | Insert/Search/Prefix |
| Add Search Words | Medium | Wildcard | DFS for '.' |
| Word Search II | Hard | Grid + Trie | DFS with Trie traversal |
| Replace Words | Medium | Prefix Match | Find shortest root |

### Trie Template:
```python
class TrieNode:
    def __init__(self):
        self.children = {}  # or [None] * 26 for fixed alphabet
        self.is_end = False
        # Additional fields as needed:
        # self.word = None  # Store word at end
        # self.count = 0    # Count words with this prefix

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None
    
    def _find_node(self, s: str) -> TrieNode:
        node = self.root
        for char in s:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

### When to Use Trie:
1. **Prefix matching** - autocomplete, prefix search
2. **Word dictionary** - spell checker, word games
3. **Multiple string search** - Word Search II
4. **XOR operations** - maximum XOR problems

### Time Complexity:
- Insert: O(m) where m = word length
- Search: O(m)
- Prefix search: O(m)
- Space: O(alphabet_size * m * n) for n words

### Trie vs HashMap:
| Aspect | Trie | HashMap |
|--------|------|---------|
| Prefix search | O(p) | O(n * p) |
| Exact search | O(m) | O(m) avg |
| Space | More (pointers) | Less |
| Alphabetical order | Natural | No |
