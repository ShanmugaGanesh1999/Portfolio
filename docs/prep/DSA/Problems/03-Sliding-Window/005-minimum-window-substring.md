# Minimum Window Substring

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 76 | Sliding Window + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find smallest substring of s that contains all characters of t (including duplicates).

### Constraints & Clarifying Questions
1. **Are characters case-sensitive?** Yes, 'A' ≠ 'a'.
2. **Can t have duplicates?** Yes, must include all with counts.
3. **What if t is longer than s?** Return "".
4. **Character set?** Uppercase and lowercase English letters.
5. **Multiple valid windows?** Return any one (first minimum).

### Edge Cases
1. **No valid window:** `s = "a", t = "aa"` → ""
2. **Exact match:** `s = "abc", t = "abc"` → "abc"
3. **t is single character:** `s = "abc", t = "b"` → "b"

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Substrings)
Check every substring of s.
- **Time:** O(N² × M)
- **Space:** O(M)

### Option 2: Optimal (Sliding Window)
Expand right to include all chars; shrink left to minimize window while still valid.

**Core Insight:** Use two pointers; expand to satisfy condition, shrink to minimize while maintaining condition.

---

## Phase 3: Python Code

```python
def solve(s: str, t: str) -> str:
    """
    Find minimum window substring containing all characters of t.
    
    Args:
        s: Source string
        t: Target string with required characters
    
    Returns:
        Minimum window substring or "" if none exists
    """
    if not t or not s:
        return ""
    
    from collections import Counter
    
    t_count = Counter(t)
    required = len(t_count)  # Unique characters needed
    
    window_count = {}
    formed = 0  # Unique chars with required frequency
    
    left = 0
    min_len = float('inf')
    min_window = (0, 0)  # (start, end)
    
    for right in range(len(s)):  # O(N)
        char = s[right]
        window_count[char] = window_count.get(char, 0) + 1
        
        # Check if current char satisfies requirement
        if char in t_count and window_count[char] == t_count[char]:
            formed += 1
        
        # Shrink window while valid
        while left <= right and formed == required:  # O(N) total
            char = s[left]
            
            # Update minimum
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_window = (left, right)
            
            # Remove leftmost char
            window_count[char] -= 1
            if char in t_count and window_count[char] < t_count[char]:
                formed -= 1
            
            left += 1
    
    return "" if min_len == float('inf') else s[min_window[0]:min_window[1] + 1]
```

---

## Phase 4: Dry Run

**Input:** `s = "ADOBECODEBANC", t = "ABC"`

| right | char | window_count | formed | left | Action | min_window |
|-------|------|--------------|--------|------|--------|------------|
| 0 | A | {A:1} | 1 | 0 | - | - |
| 1 | D | {A:1,D:1} | 1 | 0 | - | - |
| 2 | O | {A:1,D:1,O:1} | 1 | 0 | - | - |
| 3 | B | {A:1,D:1,O:1,B:1} | 2 | 0 | - | - |
| 4 | E | {...,E:1} | 2 | 0 | - | - |
| 5 | C | {...,C:1} | 3 | 0 | shrink | (0,5)="ADOBEC" |
| - | - | {D:1,O:1,B:1,E:1,C:1} | 2 | 1 | stop | len=6 |
| ... | ... | ... | ... | ... | ... | ... |
| 10 | A | {...,A:1} | 3 | 5 | shrink | (5,10)="CODEBA" |
| - | - | {...} | 3 | 6 | shrink | better? no |
| ... | ... | ... | ... | ... | ... | ... |
| 12 | C | {...} | 3 | 9 | shrink | (9,12)="BANC" |

**Result:** `"BANC"` (length 4)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N + M)
- N = len(s), M = len(t).
- Each character in s visited at most twice (right and left pointers).

### Space Complexity: O(M + K)
- t_count: O(M) for characters in t.
- window_count: O(K) where K is unique characters in s (at most 52).

---

## Phase 6: Follow-Up Questions

1. **"What if we need all minimum windows?"**
   → Store all windows with min_len; update list when equal length found.

2. **"What if order matters (subsequence instead)?"**
   → Different problem (minimum window subsequence); use DP or two-pointer with jumping.

3. **"How to handle very long strings?"**
   → Streaming approach; same algorithm works with O(1) extra space per character.
