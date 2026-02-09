# Restore IP Addresses

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 93 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return all valid IP addresses formed by inserting dots into digit string.

### Constraints & Clarifying Questions
1. **IP format?** Four integers 0-255.
2. **Leading zeros?** Only "0" valid, not "01", "001".
3. **Input length?** 4-12 characters (4 ones to 4 255s).
4. **Empty string?** Return `[]`.

### Edge Cases
1. **"0000":** `["0.0.0.0"]`
2. **Too short/long:** No valid IPs
3. **"010010":** Only combinations without leading zeros

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Validation
Split into exactly 4 parts; validate each part (0-255, no leading zeros).

**Core Insight:** Try all split points for 4 segments.

---

## Phase 3: Python Code

```python
from typing import List


def solve(s: str) -> List[str]:
    """
    Generate all valid IP addresses from digit string.
    
    Args:
        s: String of digits
    
    Returns:
        All valid IP addresses
    """
    result = []
    
    def is_valid(segment: str) -> bool:
        # Length check
        if not segment or len(segment) > 3:
            return False
        
        # Leading zero check
        if len(segment) > 1 and segment[0] == '0':
            return False
        
        # Range check
        return 0 <= int(segment) <= 255
    
    def backtrack(start: int, parts: List[str]):
        # If 4 parts and used all characters
        if len(parts) == 4:
            if start == len(s):
                result.append('.'.join(parts))
            return
        
        # Remaining parts need remaining characters
        remaining = 4 - len(parts)
        remaining_chars = len(s) - start
        
        # Pruning: need at least 1 char per part, at most 3
        if remaining_chars < remaining or remaining_chars > remaining * 3:
            return
        
        # Try segments of length 1, 2, 3
        for length in range(1, 4):
            if start + length > len(s):
                break
            
            segment = s[start:start + length]
            
            if is_valid(segment):
                parts.append(segment)
                backtrack(start + length, parts)
                parts.pop()
    
    backtrack(0, [])
    return result


def solve_iterative(s: str) -> List[str]:
    """
    Three nested loops for four segments.
    """
    result = []
    n = len(s)
    
    def valid(segment):
        if not segment or len(segment) > 3:
            return False
        if len(segment) > 1 and segment[0] == '0':
            return False
        return int(segment) <= 255
    
    for i in range(1, 4):
        for j in range(i + 1, i + 4):
            for k in range(j + 1, j + 4):
                if k >= n:
                    continue
                
                s1, s2, s3, s4 = s[:i], s[i:j], s[j:k], s[k:]
                
                if valid(s1) and valid(s2) and valid(s3) and valid(s4):
                    result.append(f"{s1}.{s2}.{s3}.{s4}")
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `"25525511135"`

**Valid Splits:**

| s1 | s2 | s3 | s4 | Valid? |
|----|----|----|----|----|
| 2 | 5 | 5 | 25511135 | ✗ (s4 > 255) |
| 255 | 255 | 11 | 135 | ✓ |
| 255 | 255 | 111 | 35 | ✓ |

**Result:** `["255.255.11.135", "255.255.111.35"]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
Fixed number of combinations: C(11,3) = 165 max ways to place 3 dots.

### Space Complexity: O(1)
Excluding output.

---

## Phase 6: Follow-Up Questions

1. **"IPv6 addresses?"**
   → Different rules: 8 groups of 4 hex digits.

2. **"Validate given IP?"**
   → Split by '.', validate each segment.

3. **"CIDR notation?"**
   → Add prefix length validation (0-32).
