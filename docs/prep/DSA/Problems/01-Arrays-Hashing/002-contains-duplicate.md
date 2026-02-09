# Contains Duplicate

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 217 | Hash Set |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Determine if any value appears at least twice in the given integer array.

### Constraints & Clarifying Questions
1. **What is the maximum array size?** Up to 10^5 elements.
2. **What is the range of values?** Integers from -10^9 to 10^9.
3. **What should we return for empty array?** Return False (no duplicates possible).
4. **Is the array sorted?** No, assume unsorted input.
5. **Do we need to identify which element is duplicated?** No, just return boolean.

### Edge Cases
1. **Empty array:** `nums = []` → False (no elements to compare)
2. **Single element:** `nums = [1]` → False (need at least 2 elements for duplicate)
3. **All identical:** `nums = [5, 5, 5, 5]` → True (immediate duplicate)

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Brute Force)
Compare every pair of elements using nested loops.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Hash Set)
Iterate through array, checking if each element exists in a set. If yes, duplicate found; if no, add element to set and continue.

**Core Insight:** A set provides O(1) membership testing, allowing us to detect duplicates in a single pass.

### Why Optimal?
Reduces time from O(N²) to O(N) by using O(N) space for the hash set, trading space for dramatically improved time complexity.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> bool:
    """
    Check if array contains any duplicate values.
    
    Args:
        numbers: List of integers to check
    
    Returns:
        True if any value appears at least twice, False otherwise
    """
    seen_values = set()  # O(N) space for storing unique elements
    
    for value in numbers:  # O(N) iteration
        if value in seen_values:  # O(1) average lookup
            return True
        seen_values.add(value)  # O(1) average insertion
    
    return False


def solve_pythonic(numbers: list[int]) -> bool:
    """
    One-liner using set size comparison.
    Set automatically removes duplicates; if sizes differ, duplicates existed.
    """
    return len(numbers) != len(set(numbers))  # O(N) time, O(N) space
```

---

## Phase 4: Dry Run

**Input:** `numbers = [1, 2, 3, 1]`

| Iteration | value | value in seen? | seen_values | Action |
|-----------|-------|----------------|-------------|--------|
| 0 | 1 | No | {1} | Add 1, continue |
| 1 | 2 | No | {1, 2} | Add 2, continue |
| 2 | 3 | No | {1, 2, 3} | Add 3, continue |
| 3 | 1 | Yes | — | Return True |

**Trace:**
1. **Initial state:** `seen_values = {}`
2. **i=0:** 1 not in set → add {1}
3. **i=1:** 2 not in set → add {1, 2}
4. **i=2:** 3 not in set → add {1, 2, 3}
5. **i=3:** 1 IS in set → return True

**Termination:** Returns True immediately upon finding duplicate.
**Correctness:** Value 1 appears at indices 0 and 3 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through array with O(1) average-case hash set operations per element. Worst case for hash collisions is O(N) per operation, but amortized O(N) overall.

### Space Complexity: O(N)
Hash set stores up to N unique elements in the worst case (when no duplicates exist). Early termination on duplicate reduces average space usage.

---

## Phase 6: Follow-Up Questions

1. **"What if we need O(1) space?"**
   → Sort the array in-place: O(N log N) time, O(1) space; then duplicates will be adjacent, detectable in single scan.

2. **"What if we need to return all duplicate values?"**
   → Use a hash map counting frequencies, then filter for values with count > 1; alternatively use two sets (seen and duplicates).

3. **"What if the array is extremely large and doesn't fit in memory?"**
   → Use external sorting with merge sort variant, or probabilistic data structure like Bloom filter for approximate duplicate detection.
