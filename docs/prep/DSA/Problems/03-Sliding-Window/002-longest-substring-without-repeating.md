# Longest Substring Without Repeating Characters

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 3 | Sliding Window |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find length of longest substring containing no duplicate characters.

### Constraints & Clarifying Questions
1. **Character set?** English letters, digits, symbols, spaces (ASCII).
2. **Case sensitive?** Yes, 'a' ≠ 'A'.
3. **Empty string?** Return 0.
4. **Maximum length?** Up to 5 × 10^4.
5. **Need actual substring or just length?** Just length.

### Edge Cases
1. **Empty string:** `s = ""` → 0
2. **All same characters:** `s = "aaaa"` → 1
3. **All unique:** `s = "abcd"` → 4

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Substrings)
For each starting position, expand until duplicate found.
- **Time:** O(N²)
- **Space:** O(min(N, M)) where M = character set size

### Option 2: Optimal (Sliding Window + Hash Set)
Maintain window of unique characters; shrink from left when duplicate found.

**Core Insight:** When duplicate found, shrink window from left until duplicate removed, then expand right.

---

## Phase 3: Python Code

```python
def solve(s: str) -> int:
    """
    Find length of longest substring without repeating characters.
    
    Args:
        s: Input string
    
    Returns:
        Length of longest substring with all unique characters
    """
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):  # O(N)
        # Shrink window while duplicate exists
        while s[right] in char_set:  # O(1) average lookup
            char_set.remove(s[left])
            left += 1
        
        # Add current character
        char_set.add(s[right])
        
        # Update max length
        max_length = max(max_length, right - left + 1)
    
    return max_length


def solve_optimized(s: str) -> int:
    """
    Optimized version using hash map to jump left pointer directly.
    """
    char_index = {}  # char -> most recent index
    left = 0
    max_length = 0
    
    for right in range(len(s)):  # O(N)
        char = s[right]
        
        # If char seen and within current window, jump left
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        # Update character's most recent position
        char_index[char] = right
        
        # Update max length
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

## Phase 4: Dry Run

**Input:** `s = "abcabcbb"`

| right | char | char_set | left | Window | max_length |
|-------|------|----------|------|--------|------------|
| 0 | a | {a} | 0 | "a" | 1 |
| 1 | b | {a,b} | 0 | "ab" | 2 |
| 2 | c | {a,b,c} | 0 | "abc" | 3 |
| 3 | a | {b,c,a} | 1 | "bca" | 3 |
| 4 | b | {c,a,b} | 2 | "cab" | 3 |
| 5 | c | {a,b,c} | 3 | "abc" | 3 |
| 6 | b | {c,b} | 5 | "cb" | 3 |
| 7 | b | {b} | 7 | "b" | 3 |

**Result:** `3`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each character visited at most twice (once by right, once by left).

### Space Complexity: O(min(N, M))
- M = size of character set (128 for ASCII, 26 for lowercase letters).

---

## Phase 6: Follow-Up Questions

1. **"What if we need the actual substring?"**
   → Track `start_index` when updating max_length; return `s[start_index:start_index + max_length]`.

2. **"What if we allow at most K repeats?"**
   → Use hash map counting frequencies; shrink when any count exceeds K.

3. **"How to handle Unicode characters?"**
   → Same algorithm works; hash set/map handles any hashable characters.
