# Shortest Path to Get All Keys

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 864 | BFS + Bitmask State |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find shortest path to collect all keys in a grid with locks.

### Constraints & Clarifying Questions
1. **Keys/locks?** a-f keys, A-F locks.
2. **Lock needs matching key?** Yes, 'A' needs 'a'.
3. **Start position?** '@'.
4. **Walls?** '#'.

### Edge Cases
1. **No keys:** Return 0
2. **Key behind lock:** Must get other key first
3. **Impossible:** Return -1

---

## Phase 2: High-Level Approach

### Approach: BFS with State = (position, keys bitmask)
Track visited as (row, col, keys). Keys represented as bitmask.

**Core Insight:** Same cell with different keys = different states.

---

## Phase 3: Python Code

```python
from typing import List
from collections import deque


def solve(grid: List[str]) -> int:
    """
    Find shortest path to collect all keys.
    
    Args:
        grid: Grid with keys (a-f), locks (A-F), walls (#), start (@)
    
    Returns:
        Minimum steps, -1 if impossible
    """
    rows, cols = len(grid), len(grid[0])
    
    # Find start and count keys
    start_r, start_c = 0, 0
    total_keys = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif grid[r][c].islower():
                total_keys += 1
    
    # Target: all keys collected
    target_keys = (1 << total_keys) - 1
    
    # BFS: (row, col, keys_bitmask, steps)
    queue = deque([(start_r, start_c, 0, 0)])
    visited = {(start_r, start_c, 0)}
    
    while queue:
        r, c, keys, steps = queue.popleft()
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            
            cell = grid[nr][nc]
            
            # Wall
            if cell == '#':
                continue
            
            # Lock without key
            if cell.isupper() and not (keys & (1 << (ord(cell) - ord('A')))):
                continue
            
            new_keys = keys
            
            # Pick up key
            if cell.islower():
                new_keys |= (1 << (ord(cell) - ord('a')))
            
            # Check if all keys collected
            if new_keys == target_keys:
                return steps + 1
            
            if (nr, nc, new_keys) not in visited:
                visited.add((nr, nc, new_keys))
                queue.append((nr, nc, new_keys, steps + 1))
    
    return -1


def solve_verbose(grid: List[str]) -> int:
    """
    More explicit version with comments.
    """
    rows, cols = len(grid), len(grid[0])
    
    start = None
    keys = []
    
    for r in range(rows):
        for c in range(cols):
            ch = grid[r][c]
            if ch == '@':
                start = (r, c)
            elif 'a' <= ch <= 'f':
                keys.append(ch)
    
    num_keys = len(keys)
    all_keys = (1 << num_keys) - 1
    
    # State: (row, col, key_mask)
    initial_state = (start[0], start[1], 0)
    queue = deque([(initial_state, 0)])
    visited = {initial_state}
    
    while queue:
        (r, c, key_mask), dist = queue.popleft()
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            
            ch = grid[nr][nc]
            
            if ch == '#':
                continue
            
            # Check lock
            if 'A' <= ch <= 'F':
                key_bit = 1 << (ord(ch) - ord('A'))
                if not (key_mask & key_bit):
                    continue
            
            # Compute new key mask
            new_mask = key_mask
            if 'a' <= ch <= 'f':
                new_mask |= (1 << (ord(ch) - ord('a')))
            
            if new_mask == all_keys:
                return dist + 1
            
            new_state = (nr, nc, new_mask)
            if new_state not in visited:
                visited.add(new_state)
                queue.append((new_state, dist + 1))
    
    return -1
```

---

## Phase 4: Dry Run

**Input:**
```
["@.a.#",
 "###.#",
 "b.A.B"]
```

Keys: 'a' (bit 0), 'b' (bit 1). Target = 0b11 = 3.

**BFS:**

| State | Steps | Action |
|-------|-------|--------|
| (0,0,0b00) | 0 | Start |
| (0,1,0b00) | 1 | Move right |
| (0,2,0b01) | 2 | Pick up 'a' |
| (0,3,0b01) | 3 | Move right |
| ... continue through valid paths ... |
| (2,0,0b11) | ? | Pick up 'b', have all keys |

**Result:** Minimum steps to get both keys.

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N × 2^K)
M×N positions, 2^K key states.

### Space Complexity: O(M × N × 2^K)
Visited states.

---

## Phase 6: Follow-Up Questions

1. **"Keys/locks up to z/Z (26)?"**
   → Same algorithm; bitmask with 26 bits.

2. **"Weighted edges?"**
   → Dijkstra instead of BFS.

3. **"Optional keys (need at least k)?"**
   → Check if popcount(keys) >= k.
