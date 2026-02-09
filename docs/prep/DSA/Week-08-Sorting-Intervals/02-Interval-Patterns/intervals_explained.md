# 🎯 Interval Patterns - Complete Guide

## 📌 What are Interval Problems?

Interval problems deal with ranges defined by [start, end] pairs. Common operations include merging, inserting, and finding overlaps.

---

## 🧠 Key Concepts

### Overlap Detection
Two intervals [a, b] and [c, d] overlap if: `a <= d AND c <= b`

```python
def is_overlapping(int1, int2):
    return int1[0] <= int2[1] and int2[0] <= int1[1]
```

### Merge Two Intervals
```python
def merge_two(int1, int2):
    return [min(int1[0], int2[0]), max(int1[1], int2[1])]
```

---

## 🔥 Pattern 1: Merge Overlapping Intervals (LC 56)

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    """
    Merge all overlapping intervals.
    
    Time: O(n log n) for sorting
    Space: O(n) for result
    
    Algorithm:
    1. Sort by start time
    2. For each interval, either merge with last or add new
    """
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for i in range(1, len(intervals)):
        current = intervals[i]
        last = merged[-1]
        
        # Check if overlapping
        if current[0] <= last[1]:
            # Merge: update end time
            last[1] = max(last[1], current[1])
        else:
            # No overlap: add new interval
            merged.append(current)
    
    return merged

# Example
intervals = [[1,3], [2,6], [8,10], [15,18]]
print(merge(intervals))  # [[1,6], [8,10], [15,18]]
```

### Visual Explanation
```
Input:  [1,3], [2,6], [8,10], [15,18]

Timeline:
1---3
  2-----6
            8--10
                     15--18

Merged:
1-------6  8--10     15--18
```

---

## 🔥 Pattern 2: Insert Interval (LC 57)

```python
def insert(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    """
    Insert a new interval and merge if necessary.
    Assumes intervals are already sorted and non-overlapping.
    
    Time: O(n)
    Space: O(n)
    """
    result = []
    i = 0
    n = len(intervals)
    
    # Step 1: Add all intervals that come before new_interval
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    
    # Step 2: Merge overlapping intervals with new_interval
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    
    result.append(new_interval)
    
    # Step 3: Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result

# Example
intervals = [[1,3], [6,9]]
new_interval = [2,5]
print(insert(intervals, new_interval))  # [[1,5], [6,9]]
```

---

## 🔥 Pattern 3: Non-overlapping Intervals (LC 435)

Find minimum intervals to remove for non-overlapping set.

```python
def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    """
    Find minimum number of intervals to remove.
    
    Greedy approach: Keep interval with earliest end time.
    
    Time: O(n log n)
    Space: O(1)
    """
    if not intervals:
        return 0
    
    # Sort by END time (greedy choice)
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    prev_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < prev_end:
            # Overlap: remove this interval (don't update prev_end)
            count += 1
        else:
            # No overlap: update prev_end
            prev_end = intervals[i][1]
    
    return count

# Example
intervals = [[1,2], [2,3], [3,4], [1,3]]
print(erase_overlap_intervals(intervals))  # 1 (remove [1,3])
```

**Why sort by end time?**
- Keeping intervals with earlier end times leaves more room for future intervals
- This is the **optimal greedy choice**

---

## 🔥 Pattern 4: Meeting Rooms I (LC 252)

```python
def can_attend_meetings(intervals: list[list[int]]) -> bool:
    """
    Check if a person can attend all meetings (no overlap).
    
    Time: O(n log n)
    Space: O(1)
    """
    intervals.sort(key=lambda x: x[0])
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    
    return True

# Example
intervals = [[0,30], [5,10], [15,20]]
print(can_attend_meetings(intervals))  # False (overlap)
```

---

## 🔥 Pattern 5: Meeting Rooms II (LC 253) - Min Rooms

Find minimum meeting rooms required (max concurrent meetings).

### Solution 1: Sweep Line (Optimal)

```python
def min_meeting_rooms(intervals: list[list[int]]) -> int:
    """
    Find minimum meeting rooms required.
    
    Sweep Line technique:
    - +1 at start time (room needed)
    - -1 at end time (room freed)
    - Maximum concurrent = min rooms
    
    Time: O(n log n)
    Space: O(n)
    """
    events = []
    
    for start, end in intervals:
        events.append((start, 1))   # +1 for start
        events.append((end, -1))    # -1 for end
    
    # Sort by time, with end (-1) before start (+1) at same time
    events.sort(key=lambda x: (x[0], x[1]))
    
    max_rooms = 0
    current_rooms = 0
    
    for time, delta in events:
        current_rooms += delta
        max_rooms = max(max_rooms, current_rooms)
    
    return max_rooms

# Example
intervals = [[0,30], [5,10], [15,20]]
print(min_meeting_rooms(intervals))  # 2
```

### Solution 2: Min Heap

```python
import heapq

def min_meeting_rooms_heap(intervals: list[list[int]]) -> int:
    """
    Using min heap to track end times of ongoing meetings.
    
    Time: O(n log n)
    Space: O(n)
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[0])
    
    # Min heap of end times
    heap = []
    heapq.heappush(heap, intervals[0][1])
    
    for i in range(1, len(intervals)):
        # If earliest ending meeting ends before current starts
        if heap[0] <= intervals[i][0]:
            heapq.heappop(heap)  # Reuse that room
        
        heapq.heappush(heap, intervals[i][1])
    
    return len(heap)
```

---

## 🔥 Pattern 6: Interval List Intersections (LC 986)

```python
def interval_intersection(first: list[list[int]], second: list[list[int]]) -> list[list[int]]:
    """
    Find intersection of two interval lists.
    
    Time: O(m + n)
    Space: O(m + n) for result
    """
    result = []
    i = j = 0
    
    while i < len(first) and j < len(second):
        # Find intersection
        start = max(first[i][0], second[j][0])
        end = min(first[i][1], second[j][1])
        
        if start <= end:
            result.append([start, end])
        
        # Move pointer with smaller end time
        if first[i][1] < second[j][1]:
            i += 1
        else:
            j += 1
    
    return result

# Example
first = [[0,2], [5,10], [13,23], [24,25]]
second = [[1,5], [8,12], [15,24], [25,26]]
print(interval_intersection(first, second))
# [[1,2], [5,5], [8,10], [15,23], [24,24], [25,25]]
```

---

## 📋 Interval Pattern Summary

| Pattern | Technique | Key Insight |
|---------|-----------|-------------|
| Merge Intervals | Sort by start | Compare with last merged |
| Insert Interval | Three phases | Before, merge, after |
| Min Removals | Sort by end (greedy) | Keep earliest ending |
| Meeting Rooms I | Sort by start | Check consecutive overlap |
| Meeting Rooms II | Sweep line / heap | Track concurrent count |
| Intersections | Two pointers | Move smaller end |

---

## ⚠️ Common Mistakes

1. **Not sorting first** - most interval problems need sorting
2. **Wrong sort key** - start vs end matters!
3. **Off-by-one at boundaries** - `<` vs `<=`
4. **Modifying input** - sometimes need to preserve original

---

## 🎓 Key Takeaways

1. **Sort first** - usually by start time
2. **Sort by end time** for greedy optimization problems
3. **Sweep line** for counting concurrent events
4. **Two pointers** for comparing two interval lists
5. **Min heap** tracks earliest ending time
