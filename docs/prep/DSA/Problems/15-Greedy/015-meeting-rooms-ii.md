# Meeting Rooms II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 253 | Greedy + Sorting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum number of meeting rooms needed.

### Constraints & Clarifying Questions
1. **[0, 30] and [30, 40] overlap?** No, can use same room.
2. **Empty intervals?** Return 0.
3. **All overlapping?** Need n rooms.
4. **Start always < end?** Yes.

### Edge Cases
1. **No meetings:** 0
2. **Single meeting:** 1
3. **All sequential:** 1

---

## Phase 2: High-Level Approach

### Approach: Greedy - Event Sorting
Split into start/end events. Process chronologically.
Track concurrent meetings.

**Core Insight:** +1 room at start, -1 room at end; max concurrent = rooms needed.

---

## Phase 3: Python Code

```python
from typing import List
import heapq


def solve(intervals: List[List[int]]) -> int:
    """
    Find minimum meeting rooms needed.
    
    Args:
        intervals: List of [start, end]
    
    Returns:
        Minimum rooms
    """
    if not intervals:
        return 0
    
    # Separate start and end times
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)
    
    rooms = 0
    max_rooms = 0
    e = 0  # End pointer
    
    for s in starts:
        # Start new meeting
        rooms += 1
        
        # End meetings that finished
        while e < len(ends) and ends[e] <= s:
            rooms -= 1
            e += 1
        
        max_rooms = max(max_rooms, rooms)
    
    return max_rooms


def solve_heap(intervals: List[List[int]]) -> int:
    """
    Min heap to track earliest ending meeting.
    """
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min heap of end times
    heap = []
    
    for start, end in intervals:
        # If earliest ending meeting has ended, reuse room
        if heap and heap[0] <= start:
            heapq.heappop(heap)
        
        # Add current meeting's end time
        heapq.heappush(heap, end)
    
    return len(heap)


def solve_events(intervals: List[List[int]]) -> int:
    """
    Event-based approach.
    """
    events = []
    
    for start, end in intervals:
        events.append((start, 1))   # Meeting starts
        events.append((end, -1))    # Meeting ends
    
    # Sort by time, then by type (end before start if same time)
    events.sort(key=lambda x: (x[0], x[1]))
    
    rooms = 0
    max_rooms = 0
    
    for time, delta in events:
        rooms += delta
        max_rooms = max(max_rooms, rooms)
    
    return max_rooms
```

---

## Phase 4: Dry Run

**Input:** `[[0,30],[5,10],[15,20]]`

**Events:** [(0,+1), (5,+1), (10,-1), (15,+1), (20,-1), (30,-1)]

| Time | Event | Rooms |
|------|-------|-------|
| 0 | +1 | 1 |
| 5 | +1 | 2 |
| 10 | -1 | 1 |
| 15 | +1 | 2 |
| 20 | -1 | 1 |
| 30 | -1 | 0 |

**Max rooms:** 2

**Result:** 2

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting dominates.

### Space Complexity: O(N)
Events array or heap.

---

## Phase 6: Follow-Up Questions

1. **"Return room assignments?"**
   → Track which room each meeting uses.

2. **"Rooms have different capacities?"**
   → Match meeting sizes to room capacities.

3. **"Minimize gaps between meetings?"**
   → Different optimization objective.
