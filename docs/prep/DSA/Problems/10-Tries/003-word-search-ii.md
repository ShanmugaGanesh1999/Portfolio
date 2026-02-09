# Word Search II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 212 | Trie + DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all words from list that exist in 2D board via adjacent (not diagonal) cells.

### Constraints & Clarifying Questions
1. **Same cell reused in one word?** No.
2. **Adjacent = 4 directions?** Yes.
3. **Board and word sizes?** Board up to 12×12, words up to 10 chars.
4. **Duplicate words in list?** Return each once.

### Edge Cases
1. **Empty words list:** Return `[]`
2. **Word longer than board cells:** Impossible
3. **Overlapping word paths:** Fine, each search independent

---

## Phase 2: High-Level Approach

### Approach: Trie + DFS from Each Cell
Build Trie from words. DFS from each cell, following Trie nodes. Mark visited cells.

**Core Insight:** Trie provides early termination when prefix doesn't exist.

---

## Phase 3: Python Code

```python
from typing import List


class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end


class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        """
        Find all words from list in board.
        
        Args:
            board: 2D character grid
            words: Words to find
        
        Returns:
            Words found in board
        """
        # Build Trie
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.word = word
        
        result = []
        rows, cols = len(board), len(board[0])
        
        def dfs(r: int, c: int, node: TrieNode):
            char = board[r][c]
            
            if char not in node.children:
                return
            
            child = node.children[char]
            
            # Found a word
            if child.word:
                result.append(child.word)
                child.word = None  # Avoid duplicates
            
            # Mark visited
            board[r][c] = '#'
            
            # Explore neighbors
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, child)
            
            # Restore
            board[r][c] = char
            
            # Optimization: prune empty branches
            if not child.children:
                del node.children[char]
        
        # Start DFS from each cell
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        
        return result


def find_words_simple(board: List[List[str]], words: List[str]) -> List[str]:
    """
    Simpler approach: DFS for each word (less efficient).
    """
    rows, cols = len(board), len(board[0])
    result = []
    
    def dfs(r, c, word, idx, visited):
        if idx == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            (r, c) in visited or board[r][c] != word[idx]):
            return False
        
        visited.add((r, c))
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            if dfs(r + dr, c + dc, word, idx + 1, visited):
                visited.remove((r, c))
                return True
        
        visited.remove((r, c))
        return False
    
    for word in words:
        found = False
        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, word, 0, set()):
                    found = True
                    break
            if found:
                break
        
        if found:
            result.append(word)
    
    return result
```

---

## Phase 4: Dry Run

**Board:**
```
o a a n
e t a e
i h k r
i f l v
```

**Words:** `["oath", "pea", "eat", "rain"]`

**Trie Built:** o-a-t-h(word), p-e-a(word), e-a-t(word), r-a-i-n(word)

**DFS from (0,0)='o':**
- Follow Trie: o → a(1,1) → t(1,2)? No 't' at (1,2)
- Try: o → a(0,1) → t(1,1) → h(2,1) → Found "oath"!

**DFS from (1,0)='e':**
- Follow: e → a(0,1 or 1,2) → t(1,1) → Found "eat"!

**Result:** `["oath", "eat"]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N × 4^L)
M×N cells, DFS up to 4^L paths per cell (L = max word length).
Trie pruning significantly reduces this.

### Space Complexity: O(W × L)
Trie storage: W words of average length L.

---

## Phase 6: Follow-Up Questions

1. **"Find longest word?"**
   → Track max length during search.

2. **"Count occurrences?"**
   → Don't nullify word; use counter.

3. **"Streaming words?"**
   → Add to Trie incrementally; restart search.
