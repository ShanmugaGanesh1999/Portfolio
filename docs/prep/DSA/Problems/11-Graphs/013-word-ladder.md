# Word Ladder

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 127 | BFS Shortest Path |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find shortest transformation sequence length from beginWord to endWord, changing one letter at a time.

### Constraints & Clarifying Questions
1. **All words same length?** Yes.
2. **endWord must be in wordList?** Yes.
3. **beginWord in wordList?** Not required.
4. **Return what if impossible?** 0.

### Edge Cases
1. **endWord not in list:** Return 0
2. **beginWord equals endWord:** Return 1
3. **No valid path:** Return 0

---

## Phase 2: High-Level Approach

### Approach: BFS with Pattern Matching
Create graph where words connect if differ by one letter. BFS for shortest path.

**Core Insight:** Use pattern like "h*t" to group words differing by one position.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict, deque


def solve(beginWord: str, endWord: str, wordList: List[str]) -> int:
    """
    Find shortest transformation sequence length.
    
    Args:
        beginWord: Starting word
        endWord: Target word
        wordList: Available words
    
    Returns:
        Shortest sequence length, 0 if impossible
    """
    if endWord not in wordList:
        return 0
    
    # Build pattern graph
    word_set = set(wordList)
    patterns = defaultdict(list)
    
    for word in wordList:
        for i in range(len(word)):
            pattern = word[:i] + '*' + word[i+1:]
            patterns[pattern].append(word)
    
    # BFS
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    
    while queue:
        word, length = queue.popleft()
        
        if word == endWord:
            return length
        
        for i in range(len(word)):
            pattern = word[:i] + '*' + word[i+1:]
            
            for neighbor in patterns[pattern]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, length + 1))
    
    return 0


def solve_bidirectional(beginWord: str, endWord: str, wordList: List[str]) -> int:
    """
    Bidirectional BFS for optimization.
    """
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    
    begin_set = {beginWord}
    end_set = {endWord}
    visited = set()
    length = 1
    
    while begin_set and end_set:
        # Always expand smaller set
        if len(begin_set) > len(end_set):
            begin_set, end_set = end_set, begin_set
        
        next_set = set()
        
        for word in begin_set:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    next_word = word[:i] + c + word[i+1:]
                    
                    if next_word in end_set:
                        return length + 1
                    
                    if next_word in word_set and next_word not in visited:
                        visited.add(next_word)
                        next_set.add(next_word)
        
        begin_set = next_set
        length += 1
    
    return 0
```

---

## Phase 4: Dry Run

**Input:** 
- beginWord = "hit"
- endWord = "cog"
- wordList = ["hot", "dot", "dog", "lot", "log", "cog"]

**Patterns:**
- "*ot": [hot, dot, lot]
- "h*t": [hot]
- "ho*": [hot]
- etc.

**BFS:**

| Level | Queue | Visited |
|-------|-------|---------|
| 1 | [(hit,1)] | {hit} |
| 2 | [(hot,2)] | {hit,hot} |
| 3 | [(dot,3),(lot,3)] | {hit,hot,dot,lot} |
| 4 | [(dog,4),(log,4)] | {hit,hot,dot,lot,dog,log} |
| 5 | [(cog,5)] | Found! |

**Result:** 5

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M² × N)
M = word length, N = wordList size. Each word generates M patterns.

### Space Complexity: O(M² × N)
Pattern dictionary storage.

---

## Phase 6: Follow-Up Questions

1. **"Return all shortest paths?"**
   → Word Ladder II: BFS + backtracking.

2. **"Words of different lengths?"**
   → Add/remove character operations; more complex graph.

3. **"Weighted transformations?"**
   → Dijkstra's algorithm instead of BFS.
