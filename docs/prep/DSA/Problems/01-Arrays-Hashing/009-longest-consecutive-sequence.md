# Longest Consecutive Sequence

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 128 | Hash Set with Smart Start |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the length of the longest sequence of consecutive integers in an unsorted array.

### Constraints & Clarifying Questions
1. **Does order in array matter?** No, elements can be in any order.
2. **Are there duplicates?** Yes, but they don't extend sequences.
3. **What is the expected time complexity?** O(N), cannot sort.
4. **Can array be empty?** Yes, return 0.
5. **Range of values?** -10^9 to 10^9.

### Edge Cases
1. **Empty array:** `nums = []` → 0
2. **No consecutive:** `nums = [10, 20, 30]` → 1 (each element is sequence of length 1)
3. **All consecutive:** `nums = [4, 3, 2, 1]` → 4

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Sort)
Sort array, then linear scan to find longest consecutive run.
- **Time:** O(N log N)
- **Space:** O(1) or O(N) depending on sort

### Option 2: Optimal (Hash Set)
Put all numbers in a set. For each number, only start counting if it's the beginning of a sequence (num-1 not in set). Then count consecutive elements upward.

**Core Insight:** Only start sequences from their true beginning; this ensures each element is visited at most twice (once for set membership, once in sequence extension).

### Why Optimal?
Achieves O(N) by ensuring each element participates in at most one sequence count, avoiding redundant work from starting mid-sequence.

---

## Phase 3: Python Code

```python
def solve(numbers: list[int]) -> int:
    """
    Find length of longest consecutive elements sequence.
    
    Args:
        numbers: Unsorted array of integers
    
    Returns:
        Length of longest consecutive sequence
    """
    if not numbers:
        return 0
    
    number_set = set(numbers)  # O(N) space, O(N) time to build
    longest_streak = 0
    
    for number in number_set:  # O(N) iterations total
        # Only start sequence from its beginning
        # (when num-1 is NOT in set)
        if number - 1 not in number_set:  # O(1) lookup
            current_number = number
            current_streak = 1
            
            # Extend sequence upward
            while current_number + 1 in number_set:  # O(1) per check
                current_number += 1
                current_streak += 1
            
            longest_streak = max(longest_streak, current_streak)
    
    return longest_streak
```

---

## Phase 4: Dry Run

**Input:** `numbers = [100, 4, 200, 1, 3, 2]`

**Step 1: Build set**
```
number_set = {100, 4, 200, 1, 3, 2}
```

**Step 2: Find sequence starts and count**

| number | Is sequence start? (num-1 not in set?) | Sequence | Length |
|--------|----------------------------------------|----------|--------|
| 100 | 99 not in set → Yes | 100 | 1 |
| 4 | 3 in set → **No, skip** | — | — |
| 200 | 199 not in set → Yes | 200 | 1 |
| 1 | 0 not in set → Yes | 1→2→3→4 | 4 |
| 3 | 2 in set → **No, skip** | — | — |
| 2 | 1 in set → **No, skip** | — | — |

**Detailed trace for number=1:**
```
current_number=1, streak=1
  2 in set? Yes → current_number=2, streak=2
  3 in set? Yes → current_number=3, streak=3
  4 in set? Yes → current_number=4, streak=4
  5 in set? No → stop
longest_streak = max(0, 4) = 4
```

**Result:** `4`

**Correctness:** Sequence [1, 2, 3, 4] has length 4 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Building set: O(N)
- Main loop: O(N) iterations
- Inner while loop: Each number is part of at most one sequence extension, so total inner loop iterations across all outer iterations is O(N)
- Total: O(N) + O(N) = O(N)

### Space Complexity: O(N)
Hash set stores up to N unique elements.

---

## Phase 6: Follow-Up Questions

1. **"What if we need to return the actual sequence, not just length?"**
   → Track start number of longest sequence, then reconstruct [start, start+1, ..., start+length-1].

2. **"How would you handle this with limited memory for billions of numbers?"**
   → External sort the data, then single pass to find longest streak; trades time for space.

3. **"What if numbers arrive in a stream and we need ongoing longest sequence?"**
   → Union-Find: each number creates a set; union with neighbors if they exist; track sizes.
