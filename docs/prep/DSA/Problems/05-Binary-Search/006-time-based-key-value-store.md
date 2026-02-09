# Time Based Key-Value Store

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 981 | Binary Search + Hash Map |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design key-value store supporting set with timestamp and get with timestamp (return value at largest timestamp ≤ given).

### Constraints & Clarifying Questions
1. **Timestamps always increasing?** Yes for same key.
2. **No value for key at timestamp?** Return "".
3. **Same key, same timestamp?** Won't happen (timestamps increase).
4. **Case sensitivity?** Keys and values are case-sensitive.
5. **Expected time for get?** O(log N).

### Edge Cases
1. **Get before any set:** Return ""
2. **Get at exact timestamp:** Return that value
3. **Get between timestamps:** Return earlier timestamp's value

---

## Phase 2: High-Level Approach

### Approach: Hash Map + Binary Search
Store list of (timestamp, value) pairs per key. Binary search for largest timestamp ≤ query.

**Core Insight:** Since timestamps are increasing, list is sorted; use binary search.

---

## Phase 3: Python Code

```python
from collections import defaultdict
import bisect

class TimeMap:
    """
    Key-value store with timestamp-based retrieval.
    """
    
    def __init__(self):
        """Initialize empty store."""
        self.store = defaultdict(list)  # key -> [(timestamp, value), ...]
    
    def set(self, key: str, value: str, timestamp: int) -> None:
        """
        Store key-value pair at timestamp. O(1)
        
        Args:
            key: Key string
            value: Value string
            timestamp: Timestamp (always increasing for same key)
        """
        self.store[key].append((timestamp, value))
    
    def get(self, key: str, timestamp: int) -> str:
        """
        Get value at largest timestamp <= given timestamp. O(log N)
        
        Args:
            key: Key to look up
            timestamp: Query timestamp
        
        Returns:
            Value at or before timestamp, or "" if none
        """
        if key not in self.store:
            return ""
        
        pairs = self.store[key]
        
        # Binary search for largest timestamp <= query
        left, right = 0, len(pairs) - 1
        result = ""
        
        while left <= right:
            mid = (left + right) // 2
            if pairs[mid][0] <= timestamp:
                result = pairs[mid][1]  # Valid, try larger
                left = mid + 1
            else:
                right = mid - 1
        
        return result


class TimeMapBisect:
    """
    Using Python's bisect module.
    """
    
    def __init__(self):
        self.store = defaultdict(list)
    
    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))
    
    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        
        pairs = self.store[key]
        
        # bisect_right finds insertion point for timestamp
        idx = bisect.bisect_right(pairs, (timestamp, chr(127)))
        
        if idx == 0:
            return ""  # All timestamps > query
        
        return pairs[idx - 1][1]
```

---

## Phase 4: Dry Run

**Operations:**
```
set("foo", "bar", 1)
get("foo", 1)
get("foo", 3)
set("foo", "bar2", 4)
get("foo", 4)
get("foo", 5)
```

| Operation | store["foo"] | Result |
|-----------|--------------|--------|
| set("foo", "bar", 1) | [(1, "bar")] | - |
| get("foo", 1) | [(1, "bar")] | "bar" (exact) |
| get("foo", 3) | [(1, "bar")] | "bar" (1 ≤ 3) |
| set("foo", "bar2", 4) | [(1, "bar"), (4, "bar2")] | - |
| get("foo", 4) | same | "bar2" (exact) |
| get("foo", 5) | same | "bar2" (4 ≤ 5) |

**get("foo", 0)** → "" (no timestamp ≤ 0)

---

## Phase 5: Complexity Analysis

### Time Complexity:
- **set:** O(1) amortized (list append)
- **get:** O(log N) where N = number of timestamps for key

### Space Complexity: O(Total entries)
Stores all key-value-timestamp triples.

---

## Phase 6: Follow-Up Questions

1. **"What if timestamps aren't always increasing?"**
   → Need to insert in sorted order: O(N) per set, or use balanced BST.

2. **"How to delete entries?"**
   → Mark as deleted or actually remove; removal is O(N) for list.

3. **"Memory-bounded version?"**
   → Evict old entries; use LRU per key or global TTL.
