# Partition Labels

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 763 | Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Partition string so each letter appears in at most one part. Return part sizes.

### Constraints & Clarifying Questions
1. **Maximize or minimize parts?** Maximize (as many parts as possible).
2. **Letters only?** Yes, lowercase English.
3. **Empty string?** Return [].
4. **Single letter repeated?** One part.

### Edge Cases
1. **All unique letters:** Length = n parts of size 1
2. **One letter throughout:** Single part
3. **Two distinct groups:** Two parts

---

## Phase 2: High-Level Approach

### Approach: Greedy - Track Last Occurrence
Find last occurrence of each character.
Extend current partition until we pass all last occurrences.

**Core Insight:** Must extend partition to include all occurrences of current characters.

---

## Phase 3: Python Code

```python
from typing import List


def solve(s: str) -> List[int]:
    """
    Partition string with unique letters per part.
    
    Args:
        s: Input string
    
    Returns:
        List of partition sizes
    """
    # Find last occurrence of each character
    last = {c: i for i, c in enumerate(s)}
    
    result = []
    start = 0
    end = 0
    
    for i, c in enumerate(s):
        # Extend partition to include all of current char
        end = max(end, last[c])
        
        # If we've reached the end of current partition
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    
    return result


def solve_verbose(s: str) -> List[int]:
    """
    More verbose with explanation.
    """
    # Step 1: Find last index of each character
    last_index = {}
    for i, c in enumerate(s):
        last_index[c] = i
    
    # Step 2: Greedy partitioning
    partitions = []
    partition_start = 0
    partition_end = 0
    
    for i, c in enumerate(s):
        # Must include all occurrences of c
        partition_end = max(partition_end, last_index[c])
        
        # Can close partition when we've included everything
        if i == partition_end:
            partitions.append(i - partition_start + 1)
            partition_start = i + 1
    
    return partitions


def solve_two_pass(s: str) -> List[int]:
    """
    Alternative two-pass approach.
    """
    # First pass: build character ranges
    first = {}
    last = {}
    
    for i, c in enumerate(s):
        if c not in first:
            first[c] = i
        last[c] = i
    
    # Second pass: merge overlapping ranges
    result = []
    start = 0
    end = last[s[0]]
    
    for i, c in enumerate(s):
        if i > end:
            # Start new partition
            result.append(end - start + 1)
            start = i
            end = last[c]
        else:
            # Extend current partition
            end = max(end, last[c])
    
    # Don't forget last partition
    result.append(end - start + 1)
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `"ababcbacadefegdehijhklij"`

**Last occurrences:**
```
a:8, b:5, c:7, d:14, e:15, f:11, g:13, h:19, i:22, j:23, k:20, l:21
```

| i | c | last[c] | end | Action |
|---|---|---------|-----|--------|
| 0 | a | 8 | 8 | - |
| 1 | b | 5 | 8 | - |
| 5 | b | 5 | 8 | - |
| 8 | a | 8 | 8 | i=end, partition [0-8], size=9 |
| 9 | d | 14 | 14 | - |
| 14 | d | 14 | 15 | - |
| 15 | e | 15 | 15 | i=end, partition [9-15], size=7 |
| 16 | h | 19 | 19 | - |
| 23 | j | 23 | 23 | i=end, partition [16-23], size=8 |

**Result:** [9, 7, 8]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Two passes (build last map + partition).

### Space Complexity: O(1)
26 letters at most.

---

## Phase 6: Follow-Up Questions

1. **"Minimize number of parts?"**
   → Different problem; would need different approach.

2. **"Return actual partitions?"**
   → Track start/end indices, return substrings.

3. **"With constraints on part sizes?"**
   → More complex; may need DP.
