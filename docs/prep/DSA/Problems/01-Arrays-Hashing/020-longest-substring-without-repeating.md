# Longest Substring Without Repeating Characters

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 3 | Sliding Window + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the length of the longest substring that contains no repeating characters.

### Constraints & Clarifying Questions
1. **Character set?** ASCII characters (letters, digits, symbols, spaces).
2. **Is it case-sensitive?** Yes, 'A' and 'a' are different.
3. **Can string be empty?** Yes, return 0.
4. **Maximum string length?** Up to 5 × 10^4.
5. **Return length or the actual substring?** Just the length.

### Edge Cases
1. **Empty string:** `s = ""` → 0
2. **All same character:** `s = "aaaa"` → 1
3. **All unique:** `s = "abcdef"` → 6

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Substrings)
For each starting position, expand until duplicate found.
- **Time:** O(N²) or O(N³)
- **Space:** O(min(N, charset))

### Option 2: Optimal (Sliding Window)
Maintain a window [left, right] with no duplicates. Expand right; when duplicate found, shrink left until valid. Track max length.

**Core Insight:** When a duplicate is found at right, jump left pointer to just past the previous occurrence of that character.

### Why Optimal?
Each character is visited at most twice (once by right, once by left), achieving O(N) time.

---

## Phase 3: Python Code

```python
def solve(text: str) -> int:
    """
    Find length of longest substring without repeating characters.
    Uses sliding window with hash map for last seen positions.
    
    Args:
        text: Input string
    
    Returns:
        Length of longest substring with all unique characters
    """
    # Maps character -> most recent index where it appeared
    last_seen = {}  # O(min(N, charset)) space
    max_length = 0
    window_start = 0
    
    for window_end, char in enumerate(text):  # O(N)
        # If character was seen and is within current window
        if char in last_seen and last_seen[char] >= window_start:
            # Move window start past the duplicate
            window_start = last_seen[char] + 1
        
        # Update last seen position for current character
        last_seen[char] = window_end  # O(1)
        
        # Update maximum length
        current_length = window_end - window_start + 1
        max_length = max(max_length, current_length)
    
    return max_length


def solve_set_based(text: str) -> int:
    """
    Alternative: Using set to track current window contents.
    Simpler but may be slightly slower due to set removals.
    """
    char_set = set()
    max_length = 0
    left = 0
    
    for right, char in enumerate(text):
        while char in char_set:
            char_set.remove(text[left])
            left += 1
        
        char_set.add(char)
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

## Phase 4: Dry Run

**Input:** `text = "abcabcbb"`

| Step | window_end | char | last_seen[char] | window_start | In window? | Action | Length | max |
|------|------------|------|-----------------|--------------|------------|--------|--------|-----|
| 0 | 0 | 'a' | — | 0 | No | Add a→0 | 1 | 1 |
| 1 | 1 | 'b' | — | 0 | No | Add b→1 | 2 | 2 |
| 2 | 2 | 'c' | — | 0 | No | Add c→2 | 3 | 3 |
| 3 | 3 | 'a' | 0 | 0 | Yes (0≥0) | start=1, a→3 | 3 | 3 |
| 4 | 4 | 'b' | 1 | 1 | Yes (1≥1) | start=2, b→4 | 3 | 3 |
| 5 | 5 | 'c' | 2 | 2 | Yes (2≥2) | start=3, c→5 | 3 | 3 |
| 6 | 6 | 'b' | 4 | 3 | Yes (4≥3) | start=5, b→6 | 2 | 3 |
| 7 | 7 | 'b' | 6 | 5 | Yes (6≥5) | start=7, b→7 | 1 | 3 |

**Result:** `3`

**Verification:** Longest substring is "abc" (length 3) ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through string. Each character processed once by right pointer, and left pointer only moves forward.

### Space Complexity: O(min(N, M))
Hash map stores at most M unique characters where M is charset size (26 for lowercase, 128 for ASCII, etc.).

---

## Phase 6: Follow-Up Questions

1. **"What if we need the actual substring, not just length?"**
   → Track the starting index of best window; at end, return `text[best_start:best_start+max_length]`.

2. **"What if we allow at most k repeated characters?"**
   → Use Counter to track character frequencies; shrink window when any frequency exceeds k.

3. **"How would you handle Unicode surrogate pairs?"**
   → Iterate by codepoints rather than code units; Python 3 handles this naturally with string iteration.
