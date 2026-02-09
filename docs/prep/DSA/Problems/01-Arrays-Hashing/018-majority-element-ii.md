# Majority Element II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 229 | Generalized Boyer-Moore Voting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all elements appearing more than n/3 times in an array.

### Constraints & Clarifying Questions
1. **Is majority guaranteed?** No, there may be 0, 1, or 2 such elements.
2. **Why at most 2?** Math: at most ⌊n/(n/3 + 1)⌋ = 2 elements can exceed n/3 count.
3. **Expected complexity?** O(N) time, O(1) space.
4. **Can array be empty?** Yes, return [].
5. **Value range?** -10^9 to 10^9.

### Edge Cases
1. **No majority:** `nums = [1, 2, 3]` → `[]`
2. **One majority:** `nums = [3, 2, 3]` → `[3]`
3. **Two majorities:** `nums = [1, 1, 1, 2, 2, 2, 3]` → `[1, 2]`

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Hash Map)
Count all frequencies, filter those > n/3.
- **Time:** O(N)
- **Space:** O(N)

### Option 2: Optimal (Boyer-Moore with Two Candidates)
Maintain two candidates with their counts. Same voting logic: when count reaches 0, replace candidate; otherwise increment if match, decrement if no match to either.

**Core Insight:** Any element appearing > n/3 times will survive the elimination process since it "outweighs" the others.

### Why Optimal?
Extends Boyer-Moore to handle two potential candidates, maintaining O(1) space.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> list[int]:
    """
    Find all elements appearing more than n/3 times.
    Uses generalized Boyer-Moore with two candidates.
    
    Args:
        numbers: Input array
    
    Returns:
        List of elements appearing > n/3 times (at most 2)
    """
    if not numbers:
        return []
    
    # Phase 1: Find up to two candidates
    candidate1, candidate2 = None, None
    count1, count2 = 0, 0
    
    for number in numbers:  # O(N)
        if candidate1 == number:
            count1 += 1
        elif candidate2 == number:
            count2 += 1
        elif count1 == 0:
            candidate1 = number
            count1 = 1
        elif count2 == 0:
            candidate2 = number
            count2 = 1
        else:
            # Decrement both counts (voting against both candidates)
            count1 -= 1
            count2 -= 1
    
    # Phase 2: Verify candidates actually exceed n/3
    threshold = len(numbers) // 3
    result = []
    
    actual_count1 = sum(1 for num in numbers if num == candidate1)  # O(N)
    actual_count2 = sum(1 for num in numbers if num == candidate2)  # O(N)
    
    if actual_count1 > threshold:
        result.append(candidate1)
    if candidate2 != candidate1 and actual_count2 > threshold:
        result.append(candidate2)
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `numbers = [1, 1, 1, 3, 3, 2, 2, 2]`

**Phase 1: Finding Candidates**

| Step | num | c1 | cnt1 | c2 | cnt2 | Action |
|------|-----|-----|------|-----|------|--------|
| 1 | 1 | None | 0 | None | 0 | c1=1, cnt1=1 |
| 2 | 1 | 1 | 1 | None | 0 | Match c1, cnt1=2 |
| 3 | 1 | 1 | 2 | None | 0 | Match c1, cnt1=3 |
| 4 | 3 | 1 | 3 | None | 0 | c2=3, cnt2=1 |
| 5 | 3 | 1 | 3 | 3 | 1 | Match c2, cnt2=2 |
| 6 | 2 | 1 | 3 | 3 | 2 | Decrement both |
| — | — | 1 | 2 | 3 | 1 | — |
| 7 | 2 | 1 | 2 | 3 | 1 | Decrement both |
| — | — | 1 | 1 | 3 | 0 | — |
| 8 | 2 | 1 | 1 | 3 | 0 | c2=2, cnt2=1 |

**Candidates:** c1=1, c2=2

**Phase 2: Verification**
- n/3 = 8/3 = 2 (threshold)
- Count of 1: 3 (indices 0, 1, 2) → 3 > 2 ✓
- Count of 2: 3 (indices 5, 6, 7) → 3 > 2 ✓

**Result:** `[1, 2]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Candidate finding: O(N)
- Verification: O(N) for each candidate (2 passes)
- Total: O(3N) = O(N)

### Space Complexity: O(1)
Fixed number of variables (2 candidates, 2 counts) regardless of input size. Output is at most 2 elements.

---

## Phase 6: Follow-Up Questions

1. **"Can this be generalized to > n/k?"**
   → Yes, use k-1 candidates; at most k-1 elements can exceed n/k. Time O(NK), Space O(K).

2. **"Why must we verify candidates?"**
   → Voting only guarantees candidates are "most likely"; verification confirms actual counts exceed threshold.

3. **"How would you handle a stream of numbers?"**
   → Run Boyer-Moore online; for verification, either store seen numbers or use probabilistic counting (Count-Min Sketch).
