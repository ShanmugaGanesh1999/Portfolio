# Asteroid Collision

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 735 | Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Asteroids moving in row: positive = right, negative = left. Same direction never collide. Opposite directions: smaller explodes, equal both explode.

### Constraints & Clarifying Questions
1. **Collision condition?** Only positive (right) meeting negative (left).
2. **Same size collision?** Both explode.
3. **Different sizes?** Smaller explodes, larger continues.
4. **Movement after collision?** Surviving asteroid continues same direction.
5. **All same direction?** No collisions, return as-is.

### Edge Cases
1. **No collision:** `[1, 2, 3]` or `[-1, -2, -3]` → same
2. **All destroy:** `[1, -1]` → []
3. **Chain collision:** `[5, -1, -2, -3]` → [5]

---

## Phase 2: High-Level Approach

### Approach: Stack Simulation
Process asteroids left to right. Stack holds survivors. Handle collisions with top of stack.

**Core Insight:** Only right-moving (stack) can collide with left-moving (incoming negative).

---

## Phase 3: Python Code

```python
def solve(asteroids: list[int]) -> list[int]:
    """
    Simulate asteroid collisions.
    
    Args:
        asteroids: Array of asteroid sizes (positive=right, negative=left)
    
    Returns:
        State after all collisions
    """
    stack = []
    
    for asteroid in asteroids:  # O(N)
        alive = True
        
        # Collision possible: stack has right-moving, current is left-moving
        while alive and stack and asteroid < 0 < stack[-1]:
            # Compare sizes
            if stack[-1] < -asteroid:
                # Current asteroid destroys top
                stack.pop()
            elif stack[-1] == -asteroid:
                # Both destroy
                stack.pop()
                alive = False
            else:
                # Current asteroid destroyed
                alive = False
        
        if alive:
            stack.append(asteroid)
    
    return stack


def solve_verbose(asteroids: list[int]) -> list[int]:
    """
    More explicit collision handling.
    """
    stack = []
    
    for asteroid in asteroids:
        # Check for potential collision
        while stack and asteroid < 0 and stack[-1] > 0:
            top = stack[-1]
            
            if top + asteroid < 0:
                # Incoming wins (larger magnitude)
                stack.pop()
                continue
            elif top + asteroid > 0:
                # Stack top wins
                break
            else:
                # Equal - both destroyed
                stack.pop()
                break
        else:
            # No collision or all colliding asteroids destroyed
            stack.append(asteroid)
    
    return stack
```

---

## Phase 4: Dry Run

**Input:** `asteroids = [5, 10, -5]`

| i | asteroid | Stack | Action |
|---|----------|-------|--------|
| 0 | 5 | [5] | push (no collision) |
| 1 | 10 | [5, 10] | push (same direction) |
| 2 | -5 | [5, 10] | collision: 10 > |-5|, -5 destroyed |

**Result:** `[5, 10]`

**Input:** `asteroids = [8, -8]`

| i | asteroid | Stack | Action |
|---|----------|-------|--------|
| 0 | 8 | [8] | push |
| 1 | -8 | [] | collision: 8 = |-8|, both destroyed |

**Result:** `[]`

**Input:** `asteroids = [10, 2, -5]`

| i | asteroid | Stack | Action |
|---|----------|-------|--------|
| 0 | 10 | [10] | push |
| 1 | 2 | [10, 2] | push |
| 2 | -5 | [10] | collision: 2 < |-5|, pop 2; then 10 > |-5|, -5 destroyed |

**Result:** `[10]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each asteroid pushed and popped at most once.

### Space Complexity: O(N)
- Stack holds surviving asteroids.

---

## Phase 6: Follow-Up Questions

1. **"What if asteroids have different speeds?"**
   → Need to track positions over time; simulate with priority queue.

2. **"What if we need collision order/times?"**
   → Track collision events; return sequence of collisions.

3. **"What about 2D asteroid field?"**
   → Much more complex; need physics simulation with vectors.
