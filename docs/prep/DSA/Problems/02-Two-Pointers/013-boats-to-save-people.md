# Boats to Save People

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 881 | Two Pointers (Greedy Pairing) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum number of boats to carry all people, where each boat holds at most 2 people and has a weight limit.

### Constraints & Clarifying Questions
1. **Max people per boat?** Exactly 2.
2. **Can single person exceed limit?** No, guaranteed people[i] <= limit.
3. **What if person equals limit?** They go alone (can't pair).
4. **Array length?** 1 to 5 × 10^4.
5. **Weight range?** 1 to limit.

### Edge Cases
1. **Everyone fits together:** `people = [1, 1], limit = 3` → 1 boat
2. **No one fits together:** `people = [3, 3], limit = 3` → 2 boats
3. **Single person:** `people = [2], limit = 3` → 1 boat

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Greedy without Sorting)
For each person, find best remaining match.
- **Time:** O(N²)
- **Space:** O(N)

### Option 2: Optimal (Sort + Two Pointers)
Sort by weight. Pair heaviest with lightest if possible; if not, heaviest goes alone.

**Core Insight:** Pairing heaviest with lightest maximizes boat utilization. If heaviest can't pair with lightest, they can't pair with anyone.

### Why Optimal?
Greedy pairing after sorting ensures optimal boat usage with O(N log N) time.

---

## Phase 3: Python Code

```python
def solve(people: list[int], limit: int) -> int:
    """
    Find minimum boats to carry all people (max 2 per boat).
    
    Args:
        people: Array of person weights
        limit: Weight limit per boat
    
    Returns:
        Minimum number of boats needed
    """
    people.sort()  # O(N log N)
    
    light = 0                  # Lightest person not yet on boat
    heavy = len(people) - 1    # Heaviest person not yet on boat
    boats = 0
    
    while light <= heavy:  # O(N)
        # Always put heaviest person on this boat
        # Check if lightest can join them
        if people[light] + people[heavy] <= limit:
            light += 1  # Lightest person boards
        
        # Heaviest always boards
        heavy -= 1
        boats += 1
    
    return boats
```

---

## Phase 4: Dry Run

**Input:** `people = [3, 2, 2, 1], limit = 3`

**After sorting:** `[1, 2, 2, 3]`

| Step | light | heavy | people[light] | people[heavy] | Sum | Can pair? | Boats | Action |
|------|-------|-------|---------------|---------------|-----|-----------|-------|--------|
| 1 | 0 | 3 | 1 | 3 | 4 | No (4>3) | 1 | heavy alone |
| 2 | 0 | 2 | 1 | 2 | 3 | Yes | 2 | light+heavy pair |
| 3 | 1 | 1 | 2 | 2 | 4 | No | 3 | heavy alone |
| 4 | 1 | 0 | — | — | — | Exit | — | light > heavy |

**Result:** `3`

**Verification:** 
- Boat 1: person with weight 3
- Boat 2: persons with weight 1 and 2
- Boat 3: person with weight 2
Total: 3 boats ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
- Sorting: O(N log N)
- Two-pointer scan: O(N)
- Total dominated by sorting

### Space Complexity: O(1) or O(N)
- O(1) for pointers
- O(log N) to O(N) for sorting depending on implementation

---

## Phase 6: Follow-Up Questions

1. **"What if boats could hold up to k people?"**
   → Becomes bin packing problem (NP-hard for general k); for k=3, greedy heuristics exist but optimal is harder.

2. **"Why is greedy correct here?"**
   → If heaviest can pair with anyone, pairing with lightest is optimal (preserves heavier people for future pairings). If can't pair, must go alone anyway.

3. **"What if we want to minimize total weight per boat variance?"**
   → Different problem requiring balanced assignment; could use binary search or optimization techniques.
