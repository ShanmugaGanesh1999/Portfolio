# 📅 Intervals - Complete Problem Set

## Problem 1: Meeting Rooms (Easy)
**LeetCode 252**

### Problem
Check if person can attend all meetings (no overlaps).

### Intuition
Sort by start time. Check if any end > next start.

### Solution
```python
def canAttendMeetings(intervals: list[list[int]]) -> bool:
    """
    Time: O(n log n)
    Space: O(1)
    """
    intervals.sort()
    
    for i in range(1, len(intervals)):
        if intervals[i-1][1] > intervals[i][0]:
            return False
    
    return True
```

---

## Problem 2: Insert Interval (Medium)
**LeetCode 57**

### Problem
Insert new interval, merging if necessary.

### Intuition
Add all before, merge overlapping, add all after.

### Solution
```python
def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
    """
    Time: O(n)
    Space: O(n)
    """
    result = []
    i = 0
    n = len(intervals)
    
    # Add all intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    
    result.append(newInterval)
    
    # Add all intervals after
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
```

---

## Problem 3: Merge Intervals (Medium)
**LeetCode 56**

### Problem
Merge all overlapping intervals.

### Intuition
Sort by start. Extend current interval or start new.

### Solution
```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    """
    Time: O(n log n)
    Space: O(n)
    """
    intervals.sort()
    result = [intervals[0]]
    
    for start, end in intervals[1:]:
        if start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    
    return result
```

---

## Problem 4: Non-overlapping Intervals (Medium)
**LeetCode 435**

### Problem
Minimum intervals to remove to make rest non-overlapping.

### Intuition
Sort by end. Greedy: keep intervals that end earliest.

### Solution
```python
def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    """
    Time: O(n log n)
    Space: O(1)
    """
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    prev_end = float('-inf')
    
    for start, end in intervals:
        if start >= prev_end:
            prev_end = end
        else:
            count += 1
    
    return count
```

---

## Problem 5: Meeting Rooms II (Medium)
**LeetCode 253**

### Problem
Find minimum meeting rooms required.

### Intuition
Track start/end events. Max concurrent = rooms needed.

### Solution
```python
def minMeetingRooms(intervals: list[list[int]]) -> int:
    """
    Time: O(n log n)
    Space: O(n)
    """
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)
    
    rooms = 0
    max_rooms = 0
    s = e = 0
    
    while s < len(starts):
        if starts[s] < ends[e]:
            rooms += 1
            s += 1
        else:
            rooms -= 1
            e += 1
        
        max_rooms = max(max_rooms, rooms)
    
    return max_rooms

# Alternative: Heap approach
import heapq

def minMeetingRooms_heap(intervals: list[list[int]]) -> int:
    """
    Time: O(n log n)
    Space: O(n)
    """
    if not intervals:
        return 0
    
    intervals.sort()
    heap = []  # End times of ongoing meetings
    
    for start, end in intervals:
        # If earliest ending meeting has ended, reuse room
        if heap and heap[0] <= start:
            heapq.heappop(heap)
        
        heapq.heappush(heap, end)
    
    return len(heap)
```

---

## Problem 6: Minimum Interval to Include Each Query (Hard)
**LeetCode 1851**

### Problem
For each query, find smallest interval containing it.

### Intuition
Sort intervals by size. Process queries with Union-Find or sorted order.

### Solution
```python
import heapq

def minInterval(intervals: list[list[int]], queries: list[int]) -> list[int]:
    """
    Time: O((n + q) log n)
    Space: O(n + q)
    """
    # Sort intervals by start
    intervals.sort()
    
    # Process queries in sorted order, remember original index
    sorted_queries = sorted(enumerate(queries), key=lambda x: x[1])
    
    result = [-1] * len(queries)
    heap = []  # (size, end)
    i = 0
    
    for idx, q in sorted_queries:
        # Add all intervals that start <= query
        while i < len(intervals) and intervals[i][0] <= q:
            start, end = intervals[i]
            heapq.heappush(heap, (end - start + 1, end))
            i += 1
        
        # Remove intervals that ended before query
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        
        if heap:
            result[idx] = heap[0][0]
    
    return result
```

---

## Problem 7: Employee Free Time (Hard)
**LeetCode 759**

### Problem
Find common free time intervals for all employees.

### Intuition
Flatten and sort all intervals. Find gaps between merged intervals.

### Solution
```python
class Interval:
    def __init__(self, start=0, end=0):
        self.start = start
        self.end = end

def employeeFreeTime(schedule: list[list[Interval]]) -> list[Interval]:
    """
    Time: O(n log n)
    Space: O(n)
    """
    # Flatten all intervals
    all_intervals = []
    for employee in schedule:
        for interval in employee:
            all_intervals.append((interval.start, interval.end))
    
    all_intervals.sort()
    
    # Merge intervals and find gaps
    result = []
    prev_end = all_intervals[0][1]
    
    for start, end in all_intervals[1:]:
        if start > prev_end:
            result.append(Interval(prev_end, start))
        prev_end = max(prev_end, end)
    
    return result

# Alternative: Heap approach (without flattening)
def employeeFreeTime_heap(schedule: list[list[Interval]]) -> list[Interval]:
    """
    Time: O(n log k) where k = employees
    Space: O(k)
    """
    # Min heap: (start, employee_idx, interval_idx)
    heap = []
    for i, employee in enumerate(schedule):
        if employee:
            heapq.heappush(heap, (employee[0].start, i, 0))
    
    result = []
    prev_end = float('-inf')
    
    while heap:
        start, emp_idx, int_idx = heapq.heappop(heap)
        
        if prev_end != float('-inf') and start > prev_end:
            result.append(Interval(prev_end, start))
        
        prev_end = max(prev_end, schedule[emp_idx][int_idx].end)
        
        # Add next interval from same employee
        if int_idx + 1 < len(schedule[emp_idx]):
            next_interval = schedule[emp_idx][int_idx + 1]
            heapq.heappush(heap, (next_interval.start, emp_idx, int_idx + 1))
    
    return result
```

---

## 📊 Intervals Summary

| Problem | Sorting | Key Technique |
|---------|---------|---------------|
| Meeting Rooms | By start | Check overlaps |
| Insert Interval | Already sorted | Three phases |
| Merge Intervals | By start | Extend or new |
| Non-overlapping | By end | Greedy keep earliest end |
| Meeting Rooms II | Separate start/end | Count concurrent |
| Min Interval Query | By start + heap | Process queries sorted |
| Employee Free Time | All intervals | Find gaps |

### Interval Patterns:

**Check Overlap:**
```python
def overlaps(a, b):
    return a[0] < b[1] and b[0] < a[1]
```

**Merge Pattern:**
```python
intervals.sort()
merged = [intervals[0]]
for start, end in intervals[1:]:
    if start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])
```

**Concurrent Events (Sweep Line):**
```python
events = []
for start, end in intervals:
    events.append((start, 1))   # Start
    events.append((end, -1))    # End
events.sort()

count = max_count = 0
for time, delta in events:
    count += delta
    max_count = max(max_count, count)
```

**Heap for Active Intervals:**
```python
intervals.sort()
heap = []  # End times of active intervals
for start, end in intervals:
    while heap and heap[0] <= start:
        heappop(heap)
    heappush(heap, end)
    # len(heap) = current active intervals
```

### When to Sort by:
- **Start time**: Merging, inserting, processing in order
- **End time**: Maximizing non-overlapping (greedy)
- **Duration/Size**: Prioritizing smaller intervals
