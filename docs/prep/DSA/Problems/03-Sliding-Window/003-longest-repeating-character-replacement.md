# Longest Repeating Character Replacement

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 424 | Sliding Window |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find longest substring where you can replace at most K characters to make all characters the same.

### Constraints & Clarifying Questions
1. **Character set?** Uppercase English letters only.
2. **K value range?** 0 to length of string.
3. **Can K exceed string length?** Yes, then answer is string length.
4. **Empty string?** Return 0.
5. **Must replace exactly K?** No, at most K.

### Edge Cases
1. **K = 0:** Only consecutive same characters count.
2. **All same characters:** Return length of string.
3. **K >= length:** Return length (can replace all).

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Windows)
For each window, count if valid (≤K replacements needed).
- **Time:** O(N² × 26)
- **Space:** O(26)

### Option 2: Optimal (Sliding Window + Frequency)
Maintain window where `window_size - max_freq ≤ K`.

**Core Insight:** Window is valid if we can replace non-majority characters (window_size - max_frequency ≤ K).

---

## Phase 3: Python Code

```python
def solve(s: str, k: int) -> int:
    """
    Find longest substring achievable with at most k character replacements.
    
    Args:
        s: Input string (uppercase letters)
        k: Maximum replacements allowed
    
    Returns:
        Length of longest valid substring
    """
    count = {}  # Character frequency in current window
    max_freq = 0  # Maximum frequency of any single character in window
    left = 0
    max_length = 0
    
    for right in range(len(s)):  # O(N)
        char = s[right]
        count[char] = count.get(char, 0) + 1
        
        # Track max frequency (we don't need to decrease it)
        max_freq = max(max_freq, count[char])  # O(1)
        
        # Window size - max_freq = characters to replace
        # If > k, shrink window
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length


def solve_strict(s: str, k: int) -> int:
    """
    Strictly correct version recalculating max_freq.
    """
    count = {}
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        char = s[right]
        count[char] = count.get(char, 0) + 1
        
        # Recalculate max frequency
        max_freq = max(count.values())  # O(26) = O(1)
        
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
            max_freq = max(count.values()) if count else 0
        
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

## Phase 4: Dry Run

**Input:** `s = "AABABBA", k = 1`

| right | char | count | max_freq | window_size | replacements | valid? | left | max_length |
|-------|------|-------|----------|-------------|--------------|--------|------|------------|
| 0 | A | {A:1} | 1 | 1 | 0 | ✓ | 0 | 1 |
| 1 | A | {A:2} | 2 | 2 | 0 | ✓ | 0 | 2 |
| 2 | B | {A:2,B:1} | 2 | 3 | 1 | ✓ | 0 | 3 |
| 3 | A | {A:3,B:1} | 3 | 4 | 1 | ✓ | 0 | 4 |
| 4 | B | {A:3,B:2} | 3 | 5 | 2 | ✗ | 1 | 4 |
| - | - | {A:2,B:2} | 3 | 4 | 1 | ✓ | 1 | 4 |
| 5 | B | {A:2,B:3} | 3 | 5 | 2 | ✗ | 2 | 4 |
| - | - | {A:1,B:3} | 3 | 4 | 1 | ✓ | 2 | 4 |
| 6 | A | {A:2,B:3} | 3 | 5 | 2 | ✗ | 3 | 4 |
| - | - | {A:2,B:2} | 3 | 4 | 1 | ✓ | 3 | 4 |

**Result:** `4` (substring "ABAB" or "BABB" with 1 replacement → "AAAA" or "BBBB")

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each character added/removed from window at most once.
- max_freq tracking is O(1) since we don't decrease it (still gives correct answer).

### Space Complexity: O(26) = O(1)
- Frequency map for at most 26 characters.

---

## Phase 6: Follow-Up Questions

1. **"Why don't we need to decrease max_freq?"**
   → We're looking for maximum window; a smaller max_freq won't give longer result than we already found.

2. **"What if lowercase letters too?"**
   → Same algorithm; space becomes O(52) which is still O(1).

3. **"What if we need to return the actual substring?"**
   → Track `best_left` when updating max_length.
