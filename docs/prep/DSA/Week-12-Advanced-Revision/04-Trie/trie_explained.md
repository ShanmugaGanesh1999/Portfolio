# 🎯 Trie (Prefix Tree) - Complete Guide

## 📌 What is a Trie?

A Trie is a tree-like data structure for efficient string operations:
- **Prefix matching** in O(m) where m = prefix length
- **Autocomplete** functionality
- **Spell checking**

Each node represents a character, and paths represent strings.

---

## 🔧 Trie Implementation

```python
class TrieNode:
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.is_end = False
        # Optional: store word, count, etc.


class Trie:
    """
    Standard Trie implementation.
    
    Time: O(m) for all operations where m = word length
    Space: O(n * m) where n = number of words
    """
    
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert word into trie.
        """
        node = self.root
        
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.is_end = True
    
    def search(self, word: str) -> bool:
        """
        Return True if word exists in trie.
        """
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def startsWith(self, prefix: str) -> bool:
        """
        Return True if any word starts with prefix.
        """
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix: str) -> TrieNode:
        """
        Helper: Find node at end of prefix.
        """
        node = self.root
        
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        
        return node
```

---

## 🔧 Trie with Array (Faster)

```python
class TrieArray:
    """
    Trie using array for children (lowercase letters only).
    Slightly faster due to array indexing.
    """
    
    def __init__(self):
        self.root = [None] * 27  # 26 letters + is_end flag
    
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
        
        return node[26] == True
    
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

## 🔥 Classic Trie Problems

### Implement Trie (LC 208)

```python
# See implementation above
trie = Trie()
trie.insert("apple")
print(trie.search("apple"))    # True
print(trie.search("app"))      # False
print(trie.startsWith("app"))  # True
```

### Word Search II (LC 212)

```python
def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    """
    Find all words from list that exist in grid.
    
    Build trie from words, then DFS on board.
    
    Time: O(m * n * 4^L) where L = max word length
    """
    # Build trie
    root = {}
    END = '#'
    
    for word in words:
        node = root
        for char in word:
            node = node.setdefault(char, {})
        node[END] = word
    
    rows, cols = len(board), len(board[0])
    result = set()
    
    def dfs(r, c, node):
        char = board[r][c]
        
        if char not in node:
            return
        
        next_node = node[char]
        
        # Found a word
        if END in next_node:
            result.add(next_node[END])
            # Don't return - might have longer words
        
        # Mark visited
        board[r][c] = '#'
        
        # Explore neighbors
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        
        # Restore
        board[r][c] = char
    
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    
    return list(result)
```

### Design Add and Search Words (LC 211)

```python
class WordDictionary:
    """
    Support '.' wildcard that matches any character.
    """
    
    def __init__(self):
        self.root = {}
    
    def addWord(self, word: str) -> None:
        node = self.root
        for char in word:
            node = node.setdefault(char, {})
        node['$'] = True
    
    def search(self, word: str) -> bool:
        """
        Search with '.' wildcard support.
        """
        def dfs(node, i):
            if i == len(word):
                return '$' in node
            
            char = word[i]
            
            if char == '.':
                # Try all children
                for child in node:
                    if child != '$' and dfs(node[child], i + 1):
                        return True
                return False
            else:
                if char not in node:
                    return False
                return dfs(node[char], i + 1)
        
        return dfs(self.root, 0)
```

### Autocomplete System (LC 642)

```python
class AutocompleteSystem:
    """
    Autocomplete with frequency tracking.
    """
    
    def __init__(self, sentences: list[str], times: list[int]):
        self.root = {}
        self.current_input = ""
        
        for sentence, count in zip(sentences, times):
            self._insert(sentence, count)
    
    def _insert(self, sentence: str, count: int):
        node = self.root
        for char in sentence:
            node = node.setdefault(char, {})
        node['#'] = node.get('#', 0) + count
    
    def input(self, c: str) -> list[str]:
        if c == '#':
            # End of input - save sentence
            self._insert(self.current_input, 1)
            self.current_input = ""
            return []
        
        self.current_input += c
        
        # Find node at current prefix
        node = self.root
        for char in self.current_input:
            if char not in node:
                return []
            node = node[char]
        
        # DFS to find all sentences with this prefix
        sentences = []
        self._dfs(node, self.current_input, sentences)
        
        # Sort by frequency (desc), then alphabetically
        sentences.sort(key=lambda x: (-x[1], x[0]))
        
        return [s[0] for s in sentences[:3]]
    
    def _dfs(self, node, prefix, sentences):
        if '#' in node:
            sentences.append((prefix, node['#']))
        
        for char, child in node.items():
            if char != '#':
                self._dfs(child, prefix + char, sentences)
```

### Replace Words (LC 648)

```python
def replace_words(dictionary: list[str], sentence: str) -> str:
    """
    Replace words with their shortest root from dictionary.
    """
    # Build trie
    root = {}
    
    for word in dictionary:
        node = root
        for char in word:
            node = node.setdefault(char, {})
        node['$'] = word  # Store word at end
    
    def find_root(word):
        node = root
        for char in word:
            if char not in node:
                return word  # No root found
            node = node[char]
            if '$' in node:
                return node['$']  # Found shortest root
        return word
    
    words = sentence.split()
    return ' '.join(find_root(word) for word in words)
```

---

## 📋 Trie Applications

| Use Case | Example |
|----------|---------|
| Autocomplete | Search suggestions |
| Spell checker | Word validation |
| IP routing | Longest prefix match |
| Word games | Boggle, Scrabble |
| Compression | LZW encoding |

---

## 📊 Trie vs Other Data Structures

| Operation | Trie | Hash Set | Sorted Array |
|-----------|------|----------|--------------|
| Search | O(m) | O(m) avg | O(m log n) |
| Insert | O(m) | O(m) avg | O(n) |
| Prefix search | O(m) | O(n * m) | O(m log n) |
| Autocomplete | O(m + k) | O(n) | O(log n + k) |

Where m = word length, n = number of words, k = results

---

## 🎓 Key Takeaways

1. **Trie excels at prefix operations**
2. **Use dict for flexibility**, array for speed
3. **Mark word endings** explicitly
4. **Combine with DFS** for word search problems
5. **Space can be optimized** with compressed tries

---

## ➡️ Next: [Interview Preparation](../06-Interview-Prep/)
