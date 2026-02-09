# Minimum Window Substring

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 76 | Sliding Window + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the minimum length window in string s that contains all characters of string t (including duplicates).

### Constraints & Clarifying Questions
1. **Are characters case-sensitive?** Yes, 'A' ≠ 'a'.
2. **Does t have duplicates?** Yes, window must contain at least that many.
3. **What if no valid window exists?** Return empty string "".
4. **Is t ever empty?** Constraints say t is non-empty.
5. **Maximum string lengths?** s up to 10^5, t up to 10^5.

### Edge Cases
1. **t longer than s:** `s = "a", t = "aa"` → ""
2. **Exact match:** `s = "abc", t = "abc"` → "abc"
3. **t is single char:** `s = "ab", t = "b"` → "b"

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Substrings)
For each substring of s, check if it contains all of t.
- **Time:** O(N² × M)
- **Space:** O(M)

### Option 2: Optimal (Sliding Window)
Expand right to include characters until window is valid (contains all of t). Then shrink left to minimize while maintaining validity.

**Core Insight:** Use two hash maps (or frequency arrays): one for t's requirements, one for current window. Track how many unique characters have met their required count.

### Why Optimal?
Each character is visited at most twice (once by right, once by left), achieving O(N + M) time.

---

## Phase 3: Python Code

```python
from collections import Counter

def solve(source: str, target: str) -> str:
    """
    Find minimum window in source containing all characters of target.
    
    Args:
        source: String to search in
        target: String whose characters must be in window
    
    Returns:
        Minimum window substring, or "" if none exists
    """
    if not source or not target or len(source) < len(target):
        return ""
    
    # Frequency of characters needed
    target_count = Counter(target)  # O(M)
    required = len(target_count)  # Number of unique chars to match
    
    # Current window state
    window_count = {}
    formed = 0  # How many unique chars meet required frequency
    
    # Result: (window_length, left, right)
    result = (float('inf'), 0, 0)
    
    left = 0
    
    for right, char in enumerate(source):  # O(N)
        # Expand: add character to window
        window_count[char] = window_count.get(char, 0) + 1
        
        # Check if current char's frequency matches requirement
        if char in target_count and window_count[char] == target_count[char]:
            formed += 1
        
        # Contract: shrink window while valid
        while formed == required and left <= right:  # O(N) total across all iterations
            char_left = source[left]
            
            # Update result if smaller window found
            window_length = right - left + 1
            if window_length < result[0]:
                result = (window_length, left, right)
            
            # Remove leftmost character
            window_count[char_left] -= 1
            if char_left in target_count and window_count[char_left] < target_count[char_left]:
                formed -= 1  # No longer valid
            
            left += 1
    
    return "" if result[0] == float('inf') else source[result[1]:result[2] + 1]
```

---

## Phase 4: Dry Run

**Input:** `source = "ADOBECODEBANC", target = "ABC"`

**target_count:** {A:1, B:1, C:1}, required = 3

| right | char | window_count | formed | Contract? | left | Window | min |
|-------|------|--------------|--------|-----------|------|--------|-----|
| 0 | A | {A:1} | 1 | No | 0 | — | — |
| 1 | D | {A:1,D:1} | 1 | No | 0 | — | — |
| 2 | O | {A:1,D:1,O:1} | 1 | No | 0 | — | — |
| 3 | B | {A:1,D:1,O:1,B:1} | 2 | No | 0 | — | — |
| 4 | E | {A:1,D:1,O:1,B:1,E:1} | 2 | No | 0 | — | — |
| 5 | C | {A:1,D:1,O:1,B:1,E:1,C:1} | 3 | **Yes** | 0 | "ADOBEC" | 6 |
| — | — | Contract: remove A | 2 | Stop | 1 | — | 6 |
| ... | ... | (continue expanding and contracting) | ... | ... | ... | ... | ... |
| 12 | C | {...} | 3 | **Yes** | 9 | "BANC" | 4 |

**Final Result:** `"BANC"`

**Verification:** "BANC" contains A, B, C and has length 4 (minimum) ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N + M)
- Building target_count: O(M)
- Sliding window: O(N) for right pointer, O(N) total for left pointer
- Total: O(2N + M) = O(N + M)

### Space Complexity: O(N + M)
- target_count: O(M)
- window_count: O(N) in worst case
- Total: O(N + M)

---

## Phase 6: Follow-Up Questions

1. **"What if we only need the length, not the actual substring?"**
   → Same algorithm, just track length instead of indices; marginally simpler.

2. **"What if we need all minimum windows (there could be ties)?"**
   → Collect all windows with length equal to minimum in a list during the process.

3. **"How would you optimize for very large files that don't fit in memory?"**
   → Stream processing with chunked reading; maintain window state across chunks; requires careful boundary handling.
