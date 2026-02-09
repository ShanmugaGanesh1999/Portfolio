# Majority Element

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 169 | Boyer-Moore Voting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the element that appears more than n/2 times in an array (guaranteed to exist).

### Constraints & Clarifying Questions
1. **Is majority element guaranteed to exist?** Yes, always exists.
2. **What is majority defined as?** Appears more than ⌊n/2⌋ times.
3. **Can we modify the array?** Assume yes.
4. **Expected complexity?** O(N) time, ideally O(1) space.
5. **Maximum array size?** Up to 5 × 10^4.

### Edge Cases
1. **Single element:** `nums = [3]` → 3
2. **Two elements same:** `nums = [2, 2]` → 2
3. **Majority at edges:** `nums = [3, 2, 3]` → 3

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Map)
Count frequencies, return element with count > n/2.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Boyer-Moore Voting)
Maintain a candidate and count. For each element: if count is 0, set new candidate; if same as candidate, increment; else decrement. The majority survives.

**Core Insight:** Majority element's count exceeds all others combined, so pairing it against any non-majority element always leaves majority standing.

### Why Optimal?
Achieves O(1) space with single pass by exploiting the mathematical property of majority (> n/2 guarantees survival).

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> int:
    """
    Find the majority element (appears > n/2 times).
    Uses Boyer-Moore Voting Algorithm.
    
    Args:
        numbers: Array with guaranteed majority element
    
    Returns:
        The majority element
    """
    candidate = None
    count = 0
    
    for number in numbers:  # O(N)
        if count == 0:
            # Start new candidate
            candidate = number  # O(1)
        
        # Update count based on match
        if number == candidate:
            count += 1
        else:
            count -= 1
    
    return candidate


def solve_with_verification(numbers: list[int]) -> int:
    """
    Boyer-Moore with verification step.
    Use when majority is not guaranteed.
    """
    # Phase 1: Find candidate
    candidate = None
    count = 0
    
    for number in numbers:
        if count == 0:
            candidate = number
        count += 1 if number == candidate else -1
    
    # Phase 2: Verify candidate is actually majority
    actual_count = sum(1 for num in numbers if num == candidate)
    
    if actual_count > len(numbers) // 2:
        return candidate
    
    raise ValueError("No majority element exists")
```

---

## Phase 4: Dry Run

**Input:** `numbers = [2, 2, 1, 1, 1, 2, 2]`

| Step | number | count (before) | candidate | Action | count (after) |
|------|--------|----------------|-----------|--------|---------------|
| 1 | 2 | 0 | — | Set candidate=2 | 1 |
| 2 | 2 | 1 | 2 | Match, increment | 2 |
| 3 | 1 | 2 | 2 | No match, decrement | 1 |
| 4 | 1 | 1 | 2 | No match, decrement | 0 |
| 5 | 1 | 0 | — | Set candidate=1 | 1 |
| 6 | 2 | 1 | 1 | No match, decrement | 0 |
| 7 | 2 | 0 | — | Set candidate=2 | 1 |

**Result:** `candidate = 2`

**Verification:** 
- Total elements: 7
- Count of 2: 4 (indices 0, 1, 5, 6)
- 4 > 7/2 = 3.5 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array with O(1) operations per element.

### Space Complexity: O(1)
Only two variables (candidate and count) regardless of input size.

---

## Phase 6: Follow-Up Questions

1. **"What if majority element might not exist?"**
   → Add verification pass: count actual occurrences of candidate; return only if > n/2.

2. **"What if we need elements appearing > n/3 times?"**
   → Use generalized Boyer-Moore with two candidates; at most 2 such elements can exist.

3. **"How would you solve this in a distributed system?"**
   → Each node finds local candidate with count; merge by summing counts and running Boyer-Moore on (candidate, count) pairs.
