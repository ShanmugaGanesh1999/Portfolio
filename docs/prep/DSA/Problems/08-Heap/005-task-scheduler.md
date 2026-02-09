# Task Scheduler

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 621 | Heap / Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Given tasks and cooldown n, find minimum time to complete all. Same task needs n intervals gap.

### Constraints & Clarifying Questions
1. **Task order matters?** No, we choose order.
2. **Can insert idle?** Yes, if no task available.
3. **n = 0?** No cooldown, just count tasks.
4. **What's a time unit?** One task or one idle.

### Edge Cases
1. **n = 0:** Return task count
2. **All same tasks:** Need many idles
3. **Many distinct tasks:** Likely no idles

---

## Phase 2: High-Level Approach

### Approach: Max Heap + Cooldown Queue
Greedy: always execute most frequent available task.
Use max heap for available tasks, queue for cooling tasks.

**Core Insight:** Process most frequent tasks first to minimize idle time.

---

## Phase 3: Python Code

```python
import heapq
from collections import Counter, deque
from typing import List


def solve(tasks: List[str], n: int) -> int:
    """
    Minimum time to complete all tasks with cooldown.
    
    Args:
        tasks: List of task labels
        n: Cooldown period
    
    Returns:
        Minimum time units
    """
    # Count task frequencies
    counts = Counter(tasks)
    
    # Max heap of remaining counts
    heap = [-c for c in counts.values()]
    heapq.heapify(heap)
    
    # Queue: (count, available_time)
    queue = deque()
    time = 0
    
    while heap or queue:
        time += 1
        
        if heap:
            # Execute most frequent available task
            count = heapq.heappop(heap) + 1  # Add 1 (negative)
            
            if count < 0:  # Still has remaining
                queue.append((count, time + n))
        
        # Check if cooled tasks can be added back
        if queue and queue[0][1] == time:
            heapq.heappush(heap, queue.popleft()[0])
    
    return time


def solve_math(tasks: List[str], n: int) -> int:
    """
    Mathematical approach - O(N).
    """
    counts = Counter(tasks)
    max_freq = max(counts.values())
    
    # Count tasks with max frequency
    max_count = sum(1 for c in counts.values() if c == max_freq)
    
    # Frame calculation:
    # (max_freq - 1) full frames of (n + 1) slots
    # + max_count tasks in final frame
    result = (max_freq - 1) * (n + 1) + max_count
    
    # At minimum, need len(tasks) time
    return max(result, len(tasks))
```

---

## Phase 4: Dry Run

**Input:** `tasks = ["A","A","A","B","B","B"], n = 2`

**Math Approach:**
- max_freq = 3 (A and B both appear 3 times)
- max_count = 2 (both A and B)
- result = (3-1) * 3 + 2 = 6 + 2 = 8

**Schedule:** `A B _ A B _ A B` = 8 units

**Heap Approach:**

| Time | Heap | Queue | Action |
|------|------|-------|--------|
| 1 | [-2,-2] | [(−2,3)] | Execute A |
| 2 | [-2,-1] | [(−2,4)] | Execute B |
| 3 | [-1,-1] | [] | A ready, idle if needed |
| ... | | | |

**Result:** `8`

---

## Phase 5: Complexity Analysis

### Heap Approach:
- **Time:** O(N × n) worst case, where N = tasks
- **Space:** O(26) = O(1) for task types

### Math Approach:
- **Time:** O(N)
- **Space:** O(26) = O(1)

---

## Phase 6: Follow-Up Questions

1. **"Return actual schedule?"**
   → Track which task executed each time unit.

2. **"Different cooldowns per task?"**
   → Need per-task tracking; more complex.

3. **"Minimize total time with priorities?"**
   → Factor priority into heap ordering.
