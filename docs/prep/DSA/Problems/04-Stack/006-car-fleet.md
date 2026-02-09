# Car Fleet

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 853 | Stack / Sorting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Cars at different positions with different speeds drive toward target. Faster cars merge with slower cars ahead (become fleet). Count final number of fleets.

### Constraints & Clarifying Questions
1. **Can cars pass each other?** No, they merge and travel at slower speed.
2. **All cars reach target?** Yes.
3. **Starting positions unique?** Yes.
4. **What's a fleet?** Cars that reach target at same time.
5. **Single car?** One car is one fleet.

### Edge Cases
1. **No cars:** Return 0.
2. **Single car:** Return 1.
3. **All reach at same time:** Return 1.

---

## Phase 2: High-Level Approach

### Approach: Sort by Position + Monotonic Stack
Sort cars by position (closest to target first). Compare arrival times.

**Core Insight:** A car becomes a fleet with car ahead if it would arrive at/before the car ahead. Car ahead determines fleet speed.

---

## Phase 3: Python Code

```python
def solve(target: int, position: list[int], speed: list[int]) -> int:
    """
    Count number of car fleets reaching target.
    
    Args:
        target: Target position
        position: Starting positions of cars
        speed: Speeds of cars
    
    Returns:
        Number of fleets reaching target
    """
    if not position:
        return 0
    
    # Pair positions with speeds, sort by position descending
    cars = sorted(zip(position, speed), reverse=True)
    
    stack = []  # Stack of arrival times
    
    for pos, spd in cars:  # O(N)
        # Calculate time to reach target
        time = (target - pos) / spd
        
        # If this car arrives later than car ahead, it's a new fleet
        # If arrives earlier or same time, it catches up (same fleet)
        if not stack or time > stack[-1]:
            stack.append(time)
    
    return len(stack)


def solve_no_stack(target: int, position: list[int], speed: list[int]) -> int:
    """
    Without explicit stack - just count fleets.
    """
    if not position:
        return 0
    
    cars = sorted(zip(position, speed), reverse=True)
    
    fleets = 0
    max_time = 0  # Slowest arrival time so far
    
    for pos, spd in cars:
        time = (target - pos) / spd
        
        if time > max_time:
            fleets += 1
            max_time = time
    
    return fleets
```

---

## Phase 4: Dry Run

**Input:** `target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]`

**Sort by position (descending):**
| Position | Speed | Time to target |
|----------|-------|----------------|
| 10 | 2 | (12-10)/2 = 1.0 |
| 8 | 4 | (12-8)/4 = 1.0 |
| 5 | 1 | (12-5)/1 = 7.0 |
| 3 | 3 | (12-3)/3 = 3.0 |
| 0 | 1 | (12-0)/1 = 12.0 |

**Process:**
| Car (pos) | Time | Stack | Action |
|-----------|------|-------|--------|
| 10 | 1.0 | [1.0] | New fleet |
| 8 | 1.0 | [1.0] | ≤ stack top, merges |
| 5 | 7.0 | [1.0, 7.0] | > stack top, new fleet |
| 3 | 3.0 | [1.0, 7.0] | ≤ stack top, merges |
| 0 | 12.0 | [1.0, 7.0, 12.0] | > stack top, new fleet |

**Result:** `3` fleets

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
- Sorting: O(N log N)
- Processing: O(N)

### Space Complexity: O(N)
- Stack or sorted pairs array.

---

## Phase 6: Follow-Up Questions

1. **"What if we need to know which cars are in each fleet?"**
   → Track car indices when pushing to stack; pop reveals merged cars.

2. **"What about Car Fleet II (find collision times)?"**
   → Different problem: track when each car catches up to next; use stack differently.

3. **"What if cars can also move backward?"**
   → Need to handle negative speeds; more complex collision detection.
