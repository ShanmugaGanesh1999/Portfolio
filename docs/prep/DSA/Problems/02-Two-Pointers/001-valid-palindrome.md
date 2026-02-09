# Valid Palindrome

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 125 | Two Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Determine if a string is a palindrome, considering only alphanumeric characters and ignoring case.

### Constraints & Clarifying Questions
1. **What characters count?** Only letters and digits; ignore spaces, punctuation.
2. **Is it case-sensitive?** No, 'A' equals 'a'.
3. **Can string be empty?** Yes, empty string is a palindrome.
4. **Maximum string length?** Up to 2 × 10^5.
5. **What about Unicode?** Assume ASCII alphanumeric only.

### Edge Cases
1. **Empty string:** `s = ""` → True
2. **Only non-alphanumeric:** `s = ",,,..."` → True (empty after filtering)
3. **Single character:** `s = "a"` → True

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Create Filtered String)
Filter alphanumerics, reverse, compare.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Two Pointers)
Use two pointers from both ends, skipping non-alphanumeric characters, comparing case-insensitively.

**Core Insight:** Process in-place by only comparing valid characters at both ends simultaneously.

### Why Optimal?
Achieves O(1) space by avoiding string creation; single pass with pointers.

---

## Phase 3: Python Code

```python
def solve(text: str) -> bool:
    """
    Check if string is a palindrome (alphanumeric only, case-insensitive).
    
    Args:
        text: Input string to check
    
    Returns:
        True if palindrome after filtering
    """
    left = 0
    right = len(text) - 1
    
    while left < right:  # O(N)
        # Skip non-alphanumeric from left
        while left < right and not text[left].isalnum():  # O(1) amortized
            left += 1
        
        # Skip non-alphanumeric from right
        while left < right and not text[right].isalnum():  # O(1) amortized
            right -= 1
        
        # Compare characters (case-insensitive)
        if text[left].lower() != text[right].lower():  # O(1)
            return False
        
        left += 1
        right -= 1
    
    return True


def solve_pythonic(text: str) -> bool:
    """
    One-liner using filtering.
    Cleaner but uses O(N) space.
    """
    filtered = ''.join(char.lower() for char in text if char.isalnum())
    return filtered == filtered[::-1]
```

---

## Phase 4: Dry Run

**Input:** `text = "A man, a plan, a canal: Panama"`

| Step | left | right | text[left] | text[right] | Action |
|------|------|-------|------------|-------------|--------|
| 1 | 0 | 29 | 'A' | 'a' | Compare: 'a'=='a' ✓, move both |
| 2 | 1 | 28 | ' ' | 'm' | Skip left |
| 3 | 2 | 28 | 'm' | 'm' | Compare: 'm'=='m' ✓, move both |
| 4 | 3 | 27 | 'a' | 'a' | Compare: 'a'=='a' ✓, move both |
| 5 | 4 | 26 | 'n' | 'n' | Compare: 'n'=='n' ✓, move both |
| ... | ... | ... | ... | ... | Continue... |
| Final | 15 | 14 | — | — | left > right, exit loop |

**Result:** `True`

**Verification:** "amanaplanacanalpanama" is a palindrome ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Each character is visited at most once by either pointer. Inner while loops don't add extra passes.

### Space Complexity: O(1)
Only two pointer variables regardless of input size.

---

## Phase 6: Follow-Up Questions

1. **"What if we need to handle Unicode properly?"**
   → Use `unicodedata.category()` to identify letters/numbers; handle combining characters carefully.

2. **"What if we want to ignore specific characters (not just non-alphanumeric)?"**
   → Pass a filter function or character set as parameter; apply during skip logic.

3. **"How would you parallelize palindrome checking?"**
   → Split string into halves; one thread checks from start, another from end; coordinate to meet in middle.
