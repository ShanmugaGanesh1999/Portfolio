# Task Scheduler

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 621 | Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Schedule tasks with cooldown between same tasks. Find minimum time.

### Constraints & Clarifying Questions
1. **Cooldown n between same tasks?** Yes.
2. **Idle slots allowed?** Yes, when needed.
3. **Tasks can be reordered?** Yes.
4. **n = 0?** Tasks can be consecutive.

### Edge Cases
1. **n = 0:** Return len(tasks)
2. **All unique tasks:** Return len(tasks)
3. **All same tasks:** Return len(tasks) + idles

---

## Phase 2: High-Level Approach

### Approach: Greedy - Most Frequent First
Schedule most frequent tasks first, fill gaps with others.
Minimum time = max(len(tasks), (max_freq - 1) * (n + 1) + num_max_freq)

**Core Insight:** Most frequent task determines the frame.

---

## Phase 3: Python Code

```python
from typing import List
from collections import Counter


def solve(tasks: List[str], n: int) -> int:
    """
    Find minimum time to schedule all tasks.
    
    Args:
        tasks: List of task identifiers
        n: Cooldown period
    
    Returns:
        Minimum time units
    """
    if n == 0:
        return len(tasks)
    
    freq = Counter(tasks)
    max_freq = max(freq.values())
    
    # Count tasks with maximum frequency
    num_max = sum(1 for f in freq.values() if f == max_freq)
    
    # Frame: (max_freq - 1) slots of size (n + 1), plus final slot for max freq tasks
    min_time = (max_freq - 1) * (n + 1) + num_max
    
    # Can't be less than total tasks
    return max(len(tasks), min_time)


def solve_simulation(tasks: List[str], n: int) -> int:
    """
    Simulation with heap (more intuitive).
    """
    import heapq
    
    freq = Counter(tasks)
    # Max heap (negate for Python)
    heap = [-f for f in freq.values()]
    heapq.heapify(heap)
    
    time = 0
    
    while heap:
        cycle = []
        
        # Process n+1 tasks (or idle)
        for _ in range(n + 1):
            if heap:
                count = heapq.heappop(heap)
                if count < -1:  # More instances remaining
                    cycle.append(count + 1)
        
        # Push back remaining tasks
        for count in cycle:
            heapq.heappush(heap, count)
        
        # If heap is empty, we only count tasks done
        # Otherwise, we count full cycle (n+1)
        if heap:
            time += n + 1
        else:
            time += len(cycle)
    
    return time


def solve_verbose(tasks: List[str], n: int) -> int:
    """
    Detailed explanation.
    """
    freq = Counter(tasks)
    frequencies = sorted(freq.values(), reverse=True)
    
    max_freq = frequencies[0]
    
    # Number of "frames" between max frequency tasks
    # Frame: [A, _, _, _] if n=3, max_freq times
    # Last frame doesn't need full idle slots
    idle_slots = (max_freq - 1) * n
    
    # Fill idle slots with other tasks
    for f in frequencies[1:]:
        # Can fill at most (max_freq - 1) slots per task type
        # (last occurrence goes in final frame)
        idle_slots -= min(f, max_freq - 1)
    
    # Can't have negative idle (tasks fill everything)
    idle_slots = max(0, idle_slots)
    
    return len(tasks) + idle_slots
```

---

## Phase 4: Dry Run

**Input:** `tasks = ["A","A","A","B","B","B"], n = 2`

**Frequencies:** A:3, B:3, max_freq=3, num_max=2

**Formula:** (3-1) * (2+1) + 2 = 2 * 3 + 2 = 8

**Schedule:**
```
| A | B | _ | A | B | _ | A | B |
  1   2   3   4   5   6   7   8
```

**Result:** 8

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Count frequencies and compute.

### Space Complexity: O(1)
At most 26 task types.

---

## Phase 6: Follow-Up Questions

1. **"Return actual schedule?"**
   → Use heap simulation, output order.

2. **"Variable cooldown per task?"**
   → Different data structure needed.

3. **"Tasks have durations?"**
   → More complex scheduling problem.
