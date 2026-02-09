# Permutation in String

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 567 | Sliding Window + Frequency |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if any permutation of s1 exists as a substring in s2.

### Constraints & Clarifying Questions
1. **Character set?** Lowercase English letters only.
2. **Can s1 be longer than s2?** Yes, return False.
3. **Empty strings?** s1 empty → return True (empty is permutation of empty).
4. **Case sensitive?** Yes, but only lowercase given.
5. **Multiple permutations exist?** Just need to find one.

### Edge Cases
1. **s1 longer than s2:** `s1 = "abc", s2 = "ab"` → False
2. **Exact match:** `s1 = "ab", s2 = "ab"` → True
3. **s1 empty:** `s1 = "", s2 = "abc"` → True

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Windows)
For each window of size len(s1), sort and compare.
- **Time:** O(N × M log M) where N = len(s2), M = len(s1)
- **Space:** O(M)

### Option 2: Optimal (Fixed Sliding Window)
Use frequency count; slide window of size len(s1) through s2.

**Core Insight:** Permutation has same character frequencies; use fixed-size window matching frequency.

---

## Phase 3: Python Code

```python
def solve(s1: str, s2: str) -> bool:
    """
    Check if any permutation of s1 is substring of s2.
    
    Args:
        s1: Pattern string
        s2: Text string to search in
    
    Returns:
        True if permutation of s1 exists in s2
    """
    if len(s1) > len(s2):
        return False
    
    from collections import Counter
    
    s1_count = Counter(s1)
    window_count = Counter(s2[:len(s1)])
    
    if s1_count == window_count:
        return True
    
    # Slide window
    for i in range(len(s1), len(s2)):  # O(N - M)
        # Add new character
        new_char = s2[i]
        window_count[new_char] = window_count.get(new_char, 0) + 1
        
        # Remove old character
        old_char = s2[i - len(s1)]
        window_count[old_char] -= 1
        if window_count[old_char] == 0:
            del window_count[old_char]
        
        # Compare - O(26) = O(1)
        if s1_count == window_count:
            return True
    
    return False


def solve_matches(s1: str, s2: str) -> bool:
    """
    Optimized using matches count instead of comparing maps.
    """
    if len(s1) > len(s2):
        return False
    
    s1_count = [0] * 26
    window_count = [0] * 26
    
    for c in s1:
        s1_count[ord(c) - ord('a')] += 1
    
    matches = 0  # Characters with matching counts
    
    for i in range(len(s2)):
        # Add new character
        idx = ord(s2[i]) - ord('a')
        window_count[idx] += 1
        if window_count[idx] == s1_count[idx]:
            matches += 1
        elif window_count[idx] == s1_count[idx] + 1:
            matches -= 1
        
        # Remove old character (when window exceeds size)
        if i >= len(s1):
            idx = ord(s2[i - len(s1)]) - ord('a')
            window_count[idx] -= 1
            if window_count[idx] == s1_count[idx]:
                matches += 1
            elif window_count[idx] == s1_count[idx] - 1:
                matches -= 1
        
        # All 26 characters match
        if matches == 26:
            return True
    
    return False
```

---

## Phase 4: Dry Run

**Input:** `s1 = "ab", s2 = "eidbaooo"`

| i | Window | window_count | s1_count | Match? |
|---|--------|--------------|----------|--------|
| init | "ei" | {e:1,i:1} | {a:1,b:1} | ✗ |
| 2 | "id" | {i:1,d:1} | {a:1,b:1} | ✗ |
| 3 | "db" | {d:1,b:1} | {a:1,b:1} | ✗ |
| 4 | "ba" | {b:1,a:1} | {a:1,b:1} | ✓ |

**Result:** `True` (window "ba" is permutation of "ab")

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Single pass through s2.
- Counter comparison is O(26) = O(1).

### Space Complexity: O(26) = O(1)
- Two frequency arrays/maps of size 26.

---

## Phase 6: Follow-Up Questions

1. **"What if we need all starting indices?"**
   → Collect indices instead of returning True early; similar to Find All Anagrams.

2. **"What if character set is larger (Unicode)?"**
   → Use hash maps; time still O(N), space O(min(M, char_set_size)).

3. **"Can we optimize space further?"**
   → Use single counter and decrement for s1 chars, increment for s2; track zeros.
