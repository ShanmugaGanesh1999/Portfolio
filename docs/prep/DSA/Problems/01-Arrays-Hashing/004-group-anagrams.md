# Group Anagrams

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 49 | Hash Map with Tuple Key |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Group an array of strings such that all anagrams are together in the same group.

### Constraints & Clarifying Questions
1. **Are strings case-sensitive?** Yes, assume all lowercase.
2. **Can strings be empty?** Yes, empty strings can exist and are anagrams of each other.
3. **What is the maximum number of strings?** Up to 10^4 strings.
4. **What is the maximum string length?** Up to 100 characters each.
5. **Does the order of groups matter?** No, any order is acceptable.

### Edge Cases
1. **Single empty string:** `strs = [""]` → `[[""]]`
2. **All unique (no anagrams):** `strs = ["abc", "def", "ghi"]` → Three separate groups
3. **All identical:** `strs = ["a", "a", "a"]` → `[["a", "a", "a"]]`

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Sort Each String)
For each string, sort its characters to create a canonical form; use sorted form as key.
- **Time:** O(N × K log K) where K is max string length
- **Space:** O(N × K)

### Option 2: Optimal (Character Count Key)
Use character frequency tuple as key (26 integers). Strings with same frequency distribution are anagrams.

**Core Insight:** Instead of sorting characters O(K log K), count them O(K). Both produce unique canonical representations for anagram groups.

### Why Optimal?
Reduces per-string processing from O(K log K) sorting to O(K) counting; overall time improves from O(NK log K) to O(NK).

---

## Phase 3: Python Code

```python
from collections import defaultdict

def solve(strings: list[str]) -> list[list[str]]:
    """
    Group strings that are anagrams of each other.
    
    Args:
        strings: List of strings to group
    
    Returns:
        List of groups, where each group contains mutual anagrams
    """
    # Maps frequency signature -> list of anagrams
    anagram_groups = defaultdict(list)  # O(N) space
    
    for string in strings:  # O(N) strings
        # Create frequency signature as tuple (hashable key)
        frequency = [0] * 26
        for char in string:  # O(K) per string
            frequency[ord(char) - ord('a')] += 1
        
        # Tuple is hashable, can be dict key
        signature = tuple(frequency)  # O(26) = O(1)
        anagram_groups[signature].append(string)  # O(1) amortized
    
    return list(anagram_groups.values())  # O(N)


def solve_sorting(strings: list[str]) -> list[list[str]]:
    """
    Alternative: Use sorted string as key.
    Simpler but slightly slower for long strings.
    """
    anagram_groups = defaultdict(list)
    
    for string in strings:
        # Sorted characters form canonical anagram representation
        sorted_key = ''.join(sorted(string))  # O(K log K)
        anagram_groups[sorted_key].append(string)
    
    return list(anagram_groups.values())
```

---

## Phase 4: Dry Run

**Input:** `strings = ["eat", "tea", "tan", "ate", "nat", "bat"]`

| String | Frequency Signature | Group Key | Action |
|--------|---------------------|-----------|--------|
| "eat" | a:1,e:1,t:1 → (1,0,0,0,1,...,1,...) | key1 | groups[key1] = ["eat"] |
| "tea" | a:1,e:1,t:1 → same key1 | key1 | groups[key1] = ["eat","tea"] |
| "tan" | a:1,n:1,t:1 → (1,0,...,1,...,1,...) | key2 | groups[key2] = ["tan"] |
| "ate" | a:1,e:1,t:1 → key1 | key1 | groups[key1] = ["eat","tea","ate"] |
| "nat" | a:1,n:1,t:1 → key2 | key2 | groups[key2] = ["tan","nat"] |
| "bat" | a:1,b:1,t:1 → (1,1,...,1,...) | key3 | groups[key3] = ["bat"] |

**Final Result:** `[["eat","tea","ate"], ["tan","nat"], ["bat"]]`

**Correctness:** All strings in each group are anagrams of each other ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × K)
- Iterate through N strings
- For each string, compute frequency in O(K) where K is string length
- Hash map operations are O(1) amortized
- Total: O(N × K)

### Space Complexity: O(N × K)
- Hash map stores all N strings
- Keys are tuples of 26 integers (constant per key)
- Values store string references (original strings)
- Total auxiliary space: O(N × K) for storing all strings in groups

---

## Phase 6: Follow-Up Questions

1. **"What if strings can have Unicode characters?"**
   → Use `Counter(string)` converted to `frozenset(Counter(string).items())` as key; handles arbitrary character sets.

2. **"How would you parallelize this for massive datasets?"**
   → MapReduce: map each string to (signature, string) pairs, then reduce by grouping on signature key.

3. **"What if we need to maintain original order within each group?"**
   → Current solution already maintains insertion order (Python 3.7+ dict ordering); for explicit ordering, track indices.
