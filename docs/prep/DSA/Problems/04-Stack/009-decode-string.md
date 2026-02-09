# Decode String

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 394 | Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Decode encoded string where `k[encoded_string]` means repeat `encoded_string` k times.

### Constraints & Clarifying Questions
1. **Nested brackets?** Yes, `3[a2[c]]` is valid.
2. **K range?** 1 to 300.
3. **Valid input?** Yes, always valid brackets.
4. **Empty brackets?** No, `k[]` won't appear.
5. **Only lowercase letters?** Yes.

### Edge Cases
1. **No encoding:** `"abc"` → "abc"
2. **Nested:** `"2[a2[b]]"` → "abbabb"
3. **Multiple parts:** `"2[a]3[b]"` → "aabbb"

---

## Phase 2: High-Level Approach

### Approach: Stack-Based
Push current string and multiplier when hitting `[`; pop and build when hitting `]`.

**Core Insight:** Stack maintains context (previous string, multiplier) for nested structures.

---

## Phase 3: Python Code

```python
def solve(s: str) -> str:
    """
    Decode string with pattern k[encoded_string].
    
    Args:
        s: Encoded string
    
    Returns:
        Decoded string
    """
    stack = []  # Stack of (previous_string, multiplier)
    current_string = ""
    current_num = 0
    
    for char in s:  # O(N)
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            # Save current state and start fresh
            stack.append((current_string, current_num))
            current_string = ""
            current_num = 0
        elif char == ']':
            # Pop and build: prev_string + current_string * multiplier
            prev_string, multiplier = stack.pop()
            current_string = prev_string + current_string * multiplier
        else:
            # Regular character
            current_string += char
    
    return current_string


def solve_recursive(s: str) -> str:
    """
    Recursive approach (uses call stack implicitly).
    """
    def decode(index: int) -> tuple[str, int]:
        """Returns (decoded_string, next_index)."""
        result = ""
        num = 0
        
        while index < len(s):
            char = s[index]
            
            if char.isdigit():
                num = num * 10 + int(char)
            elif char == '[':
                # Recursively decode inner part
                decoded, index = decode(index + 1)
                result += decoded * num
                num = 0
            elif char == ']':
                return result, index
            else:
                result += char
            
            index += 1
        
        return result, index
    
    return decode(0)[0]
```

---

## Phase 4: Dry Run

**Input:** `s = "3[a2[c]]"`

| i | char | current_num | current_string | Stack | Action |
|---|------|-------------|----------------|-------|--------|
| 0 | '3' | 3 | "" | [] | build num |
| 1 | '[' | 0 | "" | [("", 3)] | push, reset |
| 2 | 'a' | 0 | "a" | [("", 3)] | append |
| 3 | '2' | 2 | "a" | [("", 3)] | build num |
| 4 | '[' | 0 | "" | [("", 3), ("a", 2)] | push, reset |
| 5 | 'c' | 0 | "c" | [("", 3), ("a", 2)] | append |
| 6 | ']' | 0 | "acc" | [("", 3)] | pop: "a"+"c"*2 |
| 7 | ']' | 0 | "accaccacc" | [] | pop: ""+"acc"*3 |

**Result:** `"accaccacc"`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × M)
- N = length of encoded string
- M = maximum decoded length
- String concatenation dominates

### Space Complexity: O(N)
- Stack depth proportional to nesting level.
- Output string not counted (or O(M) if counted).

---

## Phase 6: Follow-Up Questions

1. **"How to encode a string (reverse operation)?"**
   → Find repeating patterns using LZ77 or similar compression algorithms.

2. **"What if we have negative multipliers?"**
   → Would need different interpretation; perhaps remove characters?

3. **"Memory-efficient for very large outputs?"**
   → Use generator/iterator pattern; yield characters lazily.
