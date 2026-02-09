# Open the Lock

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 752 | BFS |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum turns to go from "0000" to target, avoiding deadends.

### Constraints & Clarifying Questions
1. **Wheel movement?** Each digit ±1, wraps (9→0, 0→9).
2. **Deadends?** States that end the game.
3. **"0000" is deadend?** Return -1.
4. **Target is deadend?** Impossible to reach.

### Edge Cases
1. **Target = "0000":** 0 turns
2. **"0000" in deadends:** Return -1
3. **Target in deadends:** Return -1

---

## Phase 2: High-Level Approach

### Approach: BFS State Exploration
Each state has 8 neighbors (4 wheels × 2 directions). BFS for shortest path.

**Core Insight:** State space = 10^4 = 10000 possible states.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve(deadends: List[str], target: str) -> int:
    """
    Find minimum turns to reach target.
    
    Args:
        deadends: States to avoid
        target: Target combination
    
    Returns:
        Minimum turns, -1 if impossible
    """
    dead_set = set(deadends)
    
    if "0000" in dead_set:
        return -1
    if target == "0000":
        return 0
    
    def get_neighbors(state: str) -> List[str]:
        neighbors = []
        for i in range(4):
            digit = int(state[i])
            
            # Turn up
            up = (digit + 1) % 10
            neighbors.append(state[:i] + str(up) + state[i+1:])
            
            # Turn down
            down = (digit - 1) % 10
            neighbors.append(state[:i] + str(down) + state[i+1:])
        
        return neighbors
    
    queue = deque([("0000", 0)])
    visited = {"0000"}
    
    while queue:
        state, turns = queue.popleft()
        
        for neighbor in get_neighbors(state):
            if neighbor == target:
                return turns + 1
            
            if neighbor not in visited and neighbor not in dead_set:
                visited.add(neighbor)
                queue.append((neighbor, turns + 1))
    
    return -1


def solve_bidirectional(deadends: List[str], target: str) -> int:
    """
    Bidirectional BFS for optimization.
    """
    dead_set = set(deadends)
    
    if "0000" in dead_set:
        return -1
    if target == "0000":
        return 0
    if target in dead_set:
        return -1
    
    def neighbors(s):
        result = []
        for i in range(4):
            d = int(s[i])
            for delta in [1, -1]:
                nd = (d + delta) % 10
                result.append(s[:i] + str(nd) + s[i+1:])
        return result
    
    start_set = {"0000"}
    end_set = {target}
    visited = set()
    turns = 0
    
    while start_set and end_set:
        if len(start_set) > len(end_set):
            start_set, end_set = end_set, start_set
        
        next_set = set()
        turns += 1
        
        for state in start_set:
            for neighbor in neighbors(state):
                if neighbor in end_set:
                    return turns
                
                if neighbor not in visited and neighbor not in dead_set:
                    visited.add(neighbor)
                    next_set.add(neighbor)
        
        start_set = next_set
    
    return -1
```

---

## Phase 4: Dry Run

**Input:** 
- deadends = ["0201", "0101", "0102", "1212", "2002"]
- target = "0202"

**BFS from "0000":**

| Turns | States | Notable |
|-------|--------|---------|
| 0 | {"0000"} | Start |
| 1 | {9000,1000,0900,0100...} | 8 neighbors |
| 2 | {..., 0200, 0001, ...} | Expanding |

"0000" → "1000" → "1100" → "1200" → "0200" → "0201"(dead) or "0202"

**Result:** 6 turns

---

## Phase 5: Complexity Analysis

### Time Complexity: O(10^N × N²)
N = number of wheels (4). State space × neighbor generation.

### Space Complexity: O(10^N)
Visited set.

---

## Phase 6: Follow-Up Questions

1. **"Variable number of wheels?"**
   → Same approach; adjust neighbor generation.

2. **"Minimize specific wheel movements?"**
   → Weighted BFS or Dijkstra.

3. **"Return the actual sequence?"**
   → Track parent; reconstruct path.
