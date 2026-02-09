# Search Suggestions System

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1268 | Trie + DFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return top 3 lexicographically smallest suggestions after each character typed.

### Constraints & Clarifying Questions
1. **Sorting order?** Lexicographically smallest.
2. **Max suggestions?** Up to 3.
3. **Case sensitive?** Lowercase only.
4. **Products order?** Can sort them.

### Edge Cases
1. **No matches:** Return empty list for that prefix
2. **Fewer than 3 matches:** Return all
3. **Exact match:** Include it

---

## Phase 2: High-Level Approach

### Approach 1: Trie with DFS
Build Trie. For each prefix, DFS to find top 3 words.

### Approach 2: Binary Search
Sort products. Binary search for prefix; take next 3 valid.

**Core Insight:** Sorted order + binary search is simpler and often faster.

---

## Phase 3: Python Code

```python
from typing import List


def solve_binary_search(products: List[str], searchWord: str) -> List[List[str]]:
    """
    Binary search approach - simpler and efficient.
    
    Args:
        products: Available products
        searchWord: Word being typed
    
    Returns:
        Suggestions after each character
    """
    products.sort()
    result = []
    prefix = ""
    start = 0
    
    for char in searchWord:
        prefix += char
        
        # Binary search for first product with prefix
        import bisect
        start = bisect.bisect_left(products, prefix, start)
        
        suggestions = []
        for i in range(start, min(start + 3, len(products))):
            if products[i].startswith(prefix):
                suggestions.append(products[i])
            else:
                break
        
        result.append(suggestions)
    
    return result


class TrieNode:
    def __init__(self):
        self.children = {}
        self.words = []  # Store up to 3 words passing through


def solve_trie(products: List[str], searchWord: str) -> List[List[str]]:
    """
    Trie approach with stored suggestions.
    
    Args:
        products: Available products
        searchWord: Word being typed
    
    Returns:
        Suggestions after each character
    """
    # Sort products first
    products.sort()
    
    # Build Trie
    root = TrieNode()
    
    for product in products:
        node = root
        for char in product:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            
            # Keep only top 3 at each node
            if len(node.words) < 3:
                node.words.append(product)
    
    # Search
    result = []
    node = root
    
    for i, char in enumerate(searchWord):
        if node and char in node.children:
            node = node.children[char]
            result.append(node.words)
        else:
            # No more matches
            node = None
            result.append([])
    
    return result


def solve_trie_dfs(products: List[str], searchWord: str) -> List[List[str]]:
    """
    Trie with DFS to find suggestions.
    """
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.is_end = False
    
    # Build Trie
    root = TrieNode()
    for product in products:
        node = root
        for char in product:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def dfs(node, prefix, suggestions):
        if len(suggestions) >= 3:
            return
        
        if node.is_end:
            suggestions.append(prefix)
        
        # Traverse in alphabetical order
        for char in sorted(node.children.keys()):
            dfs(node.children[char], prefix + char, suggestions)
    
    result = []
    node = root
    prefix = ""
    
    for char in searchWord:
        prefix += char
        
        if node and char in node.children:
            node = node.children[char]
            suggestions = []
            dfs(node, prefix, suggestions)
            result.append(suggestions)
        else:
            node = None
            result.append([])
    
    return result
```

---

## Phase 4: Dry Run

**Input:** 
- products = ["mobile", "mouse", "moneypot", "monitor", "mousepad"]
- searchWord = "mouse"

**Sorted:** ["mobile", "moneypot", "monitor", "mouse", "mousepad"]

**Binary Search Approach:**

| Prefix | Start Index | Suggestions |
|--------|-------------|-------------|
| "m" | 0 | ["mobile", "moneypot", "monitor"] |
| "mo" | 0 | ["mobile", "moneypot", "monitor"] |
| "mou" | 3 | ["mouse", "mousepad"] |
| "mous" | 3 | ["mouse", "mousepad"] |
| "mouse" | 3 | ["mouse", "mousepad"] |

---

## Phase 5: Complexity Analysis

### Binary Search:
- **Time:** O(N log N + M × log N) - sorting + M searches
- **Space:** O(1) extra

### Trie:
- **Time:** O(N × L + M × 3) - build Trie + M lookups
- **Space:** O(N × L)

---

## Phase 6: Follow-Up Questions

1. **"Support typos (edit distance)?"**
   → More complex: fuzzy matching, possibly DP per candidate.

2. **"Rank by popularity?"**
   → Store frequency; sort by (frequency, lex) at each node.

3. **"Real-time updates (add/remove products)?"**
   → Trie better; rebuild sorted list is O(N).
