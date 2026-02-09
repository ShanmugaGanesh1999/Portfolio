# Valid Anagram

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 242 | Hash Map / Frequency Count |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Determine if string `t` is an anagram of string `s` (contains exactly the same characters with the same frequencies).

### Constraints & Clarifying Questions
1. **Are strings case-sensitive?** Yes, 'A' and 'a' are different characters.
2. **Do strings contain only lowercase letters?** Assume yes (a-z only).
3. **Can strings be empty?** Yes, two empty strings are anagrams of each other.
4. **What is the maximum string length?** Up to 5 × 10^4 characters.
5. **Are there Unicode characters?** For basic version, assume ASCII lowercase only.

### Edge Cases
1. **Different lengths:** `s = "ab", t = "a"` → False (quick reject)
2. **Empty strings:** `s = "", t = ""` → True (both empty = valid anagram)
3. **Same characters, different frequencies:** `s = "aab", t = "abb"` → False

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Sorting)
Sort both strings and compare for equality.
- **Time:** O(N log N)
- **Space:** O(N) for sorted copies

### Option 2: Optimal (Frequency Count)
Count character frequencies in both strings using a hash map or fixed-size array. Anagrams must have identical frequency distributions.

**Core Insight:** Two strings are anagrams if and only if their character frequency histograms are identical.

### Why Optimal?
Reduces time from O(N log N) to O(N) by counting frequencies instead of sorting; uses O(1) space for fixed 26-character alphabet.

---

## Phase 3: Python Code

```python
def solve(source: str, target: str) -> bool:
    """
    Check if target is an anagram of source.
    
    Args:
        source: First string to compare
        target: Second string (potential anagram)
    
    Returns:
        True if target is a valid anagram of source
    """
    # Quick length check - anagrams must have same length
    if len(source) != len(target):  # O(1)
        return False
    
    # Fixed-size array for 26 lowercase letters - O(1) space
    frequency = [0] * 26
    
    for char_s, char_t in zip(source, target):  # O(N) iteration
        frequency[ord(char_s) - ord('a')] += 1  # Increment for source
        frequency[ord(char_t) - ord('a')] -= 1  # Decrement for target
    
    # If anagram, all frequencies should be zero
    return all(count == 0 for count in frequency)  # O(26) = O(1)


def solve_unicode(source: str, target: str) -> bool:
    """
    Unicode-safe version using Counter.
    Handles any characters including Unicode.
    """
    from collections import Counter
    return Counter(source) == Counter(target)  # O(N) time, O(K) space
```

---

## Phase 4: Dry Run

**Input:** `source = "anagram", target = "nagaram"`

| Index | char_s | char_t | Action | frequency[a] | frequency[n] | frequency[g] | frequency[r] | frequency[m] |
|-------|--------|--------|--------|--------------|--------------|--------------|--------------|--------------|
| 0 | 'a' | 'n' | +a, -n | 1 | -1 | 0 | 0 | 0 |
| 1 | 'n' | 'a' | +n, -a | 0 | 0 | 0 | 0 | 0 |
| 2 | 'a' | 'g' | +a, -g | 1 | 0 | -1 | 0 | 0 |
| 3 | 'g' | 'a' | +g, -a | 0 | 0 | 0 | 0 | 0 |
| 4 | 'r' | 'r' | +r, -r | 0 | 0 | 0 | 0 | 0 |
| 5 | 'a' | 'a' | +a, -a | 0 | 0 | 0 | 0 | 0 |
| 6 | 'm' | 'm' | +m, -m | 0 | 0 | 0 | 0 | 0 |

**Final Check:** All 26 entries in frequency array are 0 → Return True

**Correctness:** Both strings contain: a(3), n(1), g(1), r(1), m(1) ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through both strings simultaneously. The final `all()` check iterates through 26 elements (constant).

### Space Complexity: O(1)
Fixed array of 26 integers regardless of input size. For Unicode version with Counter: O(K) where K is unique characters.

---

## Phase 6: Follow-Up Questions

1. **"What if inputs contain Unicode characters?"**
   → Use `collections.Counter` which handles any hashable character; space becomes O(K) for K unique characters.

2. **"How would you handle case-insensitivity?"**
   → Convert both strings to lowercase with `.lower()` before processing; adds O(N) preprocessing.

3. **"What if we need to check many strings against one source?"**
   → Precompute and cache the source frequency map; each new target comparison becomes O(M) for target length M.
