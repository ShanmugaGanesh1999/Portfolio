# 🔺 Heap / Priority Queue - Complete Problem Set

## Problem 1: Kth Largest Element in a Stream (Easy)
**LeetCode 703**

### Problem
Design class to find kth largest element in a stream.

### Intuition
Maintain min-heap of size k. Top is always kth largest.

### Solution
```python
import heapq

class KthLargest:
    """
    __init__: O(n log k)
    add: O(log k)
    Space: O(k)
    """
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        
        # Keep only k largest
        while len(self.heap) > k:
            heapq.heappop(self.heap)
    
    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        
        return self.heap[0]
```

---

## Problem 2: Last Stone Weight (Easy)
**LeetCode 1046**

### Problem
Smash two heaviest stones. Remaining weight is difference.

### Intuition
Max-heap to always get two heaviest. Use negative values in Python.

### Solution
```python
def lastStoneWeight(stones: list[int]) -> int:
    """
    Time: O(n log n)
    Space: O(n)
    """
    # Max-heap using negative values
    heap = [-s for s in stones]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        first = -heapq.heappop(heap)
        second = -heapq.heappop(heap)
        
        if first != second:
            heapq.heappush(heap, -(first - second))
    
    return -heap[0] if heap else 0
```

---

## Problem 3: K Closest Points to Origin (Medium)
**LeetCode 973**

### Problem
Find k points closest to origin.

### Intuition
Max-heap of size k (by distance). Keep k smallest distances.

### Solution
```python
def kClosest(points: list[list[int]], k: int) -> list[list[int]]:
    """
    Time: O(n log k)
    Space: O(k)
    """
    # Max-heap of size k (negative distance for max behavior)
    heap = []
    
    for x, y in points:
        dist = -(x*x + y*y)  # Negative for max-heap
        
        if len(heap) < k:
            heapq.heappush(heap, (dist, x, y))
        elif dist > heap[0][0]:
            heapq.heapreplace(heap, (dist, x, y))
    
    return [[x, y] for _, x, y in heap]

# Alternative: Min-heap with all points
def kClosest_v2(points: list[list[int]], k: int) -> list[list[int]]:
    """
    Time: O(n + k log n)
    Space: O(n)
    """
    heap = [(x*x + y*y, x, y) for x, y in points]
    heapq.heapify(heap)
    
    return [[x, y] for _, x, y in heapq.nsmallest(k, heap)]
```

---

## Problem 4: Kth Largest Element in Array (Medium)
**LeetCode 215**

### Problem
Find kth largest element in unsorted array.

### Intuition
Min-heap of size k. Or use QuickSelect for O(n) average.

### Solution
```python
def findKthLargest(nums: list[int], k: int) -> int:
    """
    Heap approach
    Time: O(n log k)
    Space: O(k)
    """
    heap = []
    
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    
    return heap[0]

def findKthLargest_quickselect(nums: list[int], k: int) -> int:
    """
    QuickSelect approach
    Time: O(n) average, O(n²) worst
    Space: O(1)
    """
    k = len(nums) - k  # Convert to kth smallest
    
    def quickselect(left, right):
        pivot = nums[right]
        p = left
        
        for i in range(left, right):
            if nums[i] <= pivot:
                nums[p], nums[i] = nums[i], nums[p]
                p += 1
        
        nums[p], nums[right] = nums[right], nums[p]
        
        if p < k:
            return quickselect(p + 1, right)
        elif p > k:
            return quickselect(left, p - 1)
        else:
            return nums[p]
    
    return quickselect(0, len(nums) - 1)
```

---

## Problem 5: Task Scheduler (Medium)
**LeetCode 621**

### Problem
Schedule tasks with cooling period n between same tasks.

### Intuition
Most frequent task determines minimum time. Fill gaps with other tasks.

### Solution
```python
from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    """
    Time: O(n)
    Space: O(1) - max 26 characters
    """
    # Count frequencies
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for f in freq.values() if f == max_freq)
    
    # Formula: (max_freq - 1) * (n + 1) + max_count
    # This calculates minimum slots needed
    min_length = (max_freq - 1) * (n + 1) + max_count
    
    # Result is max of formula and total tasks
    return max(min_length, len(tasks))

# Heap simulation approach
def leastInterval_heap(tasks: list[str], n: int) -> int:
    """
    Time: O(total_time)
    Space: O(26) = O(1)
    """
    freq = Counter(tasks)
    max_heap = [-f for f in freq.values()]
    heapq.heapify(max_heap)
    
    time = 0
    cooldown = []  # (available_time, count)
    
    while max_heap or cooldown:
        time += 1
        
        if max_heap:
            count = heapq.heappop(max_heap) + 1
            if count < 0:
                cooldown.append((time + n, count))
        
        if cooldown and cooldown[0][0] == time:
            heapq.heappush(max_heap, cooldown.pop(0)[1])
    
    return time
```

---

## Problem 6: Design Twitter (Medium)
**LeetCode 355**

### Problem
Design simplified Twitter with follow, unfollow, postTweet, getNewsFeed.

### Intuition
HashMap for followers, list of tweets. Merge k sorted lists for feed.

### Solution
```python
from collections import defaultdict

class Twitter:
    """
    All operations except getNewsFeed: O(1)
    getNewsFeed: O(n log k) where k = followees
    """
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)  # userId -> [(time, tweetId)]
        self.following = defaultdict(set)  # userId -> set of followeeIds
    
    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets[userId].append((self.time, tweetId))
        self.time -= 1  # Negative for max-heap behavior
    
    def getNewsFeed(self, userId: int) -> list[int]:
        # Include own tweets and followees' tweets
        followees = self.following[userId] | {userId}
        
        # Min-heap with most recent from each user
        heap = []
        for followee in followees:
            if self.tweets[followee]:
                idx = len(self.tweets[followee]) - 1
                time, tweet_id = self.tweets[followee][idx]
                heap.append((time, tweet_id, followee, idx))
        
        heapq.heapify(heap)
        
        feed = []
        while heap and len(feed) < 10:
            time, tweet_id, followee, idx = heapq.heappop(heap)
            feed.append(tweet_id)
            
            if idx > 0:
                time, tweet_id = self.tweets[followee][idx - 1]
                heapq.heappush(heap, (time, tweet_id, followee, idx - 1))
        
        return feed
    
    def follow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].add(followeeId)
    
    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following[followerId].discard(followeeId)
```

---

## Problem 7: IPO (Hard)
**LeetCode 502**

### Problem
Maximize capital after k projects. Each project has profit and capital requirement.

### Intuition
Greedy: always pick most profitable project we can afford. Two heaps.

### Solution
```python
def findMaximizedCapital(k: int, w: int, profits: list[int], capital: list[int]) -> int:
    """
    Time: O(n log n)
    Space: O(n)
    """
    # Min-heap of (capital_needed, profit) - projects we can't afford yet
    unavailable = [(c, p) for c, p in zip(capital, profits)]
    heapq.heapify(unavailable)
    
    # Max-heap of profits - projects we can afford
    available = []
    
    for _ in range(k):
        # Move all affordable projects to available heap
        while unavailable and unavailable[0][0] <= w:
            c, p = heapq.heappop(unavailable)
            heapq.heappush(available, -p)  # Max-heap
        
        if not available:
            break
        
        # Pick most profitable
        w += -heapq.heappop(available)
    
    return w
```

---

## Problem 8: Top K Frequent Words (Medium)
**LeetCode 692**

### Problem
Return k most frequent words, sorted by frequency then alphabetically.

### Intuition
Min-heap of size k with custom comparator.

### Solution
```python
from collections import Counter

def topKFrequent(words: list[str], k: int) -> list[str]:
    """
    Time: O(n log k)
    Space: O(n)
    """
    freq = Counter(words)
    
    # Custom class for heap comparison
    class WordFreq:
        def __init__(self, word, freq):
            self.word = word
            self.freq = freq
        
        def __lt__(self, other):
            if self.freq != other.freq:
                return self.freq < other.freq
            return self.word > other.word  # Reversed for min-heap
    
    heap = []
    for word, f in freq.items():
        heapq.heappush(heap, WordFreq(word, f))
        if len(heap) > k:
            heapq.heappop(heap)
    
    # Pop in reverse order
    result = []
    while heap:
        result.append(heapq.heappop(heap).word)
    
    return result[::-1]
```

---

## Problem 9: Reorganize String (Medium)
**LeetCode 767**

### Problem
Rearrange string so no two adjacent characters are same.

### Intuition
Greedy: always place most frequent char that's not same as previous.

### Solution
```python
def reorganizeString(s: str) -> str:
    """
    Time: O(n log 26) = O(n)
    Space: O(26) = O(1)
    """
    freq = Counter(s)
    
    # Check if possible
    max_freq = max(freq.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max-heap of (-freq, char)
    heap = [(-f, c) for c, f in freq.items()]
    heapq.heapify(heap)
    
    result = []
    prev_freq, prev_char = 0, ''
    
    while heap:
        freq, char = heapq.heappop(heap)
        result.append(char)
        
        # Push back previous char if still has count
        if prev_freq < 0:
            heapq.heappush(heap, (prev_freq, prev_char))
        
        prev_freq = freq + 1  # Used one
        prev_char = char
    
    return ''.join(result)
```

---

## Problem 10: Smallest Number in Infinite Set (Medium)
**LeetCode 2336**

### Problem
Implement set containing all positive integers with popSmallest and addBack.

### Intuition
Track smallest in infinite part. Min-heap for added back numbers.

### Solution
```python
class SmallestInfiniteSet:
    """
    popSmallest: O(log n)
    addBack: O(log n)
    Space: O(n)
    """
    def __init__(self):
        self.smallest = 1  # Smallest in infinite part
        self.added_back = []  # Min-heap of added back numbers
        self.added_set = set()  # For O(1) lookup
    
    def popSmallest(self) -> int:
        if self.added_back:
            num = heapq.heappop(self.added_back)
            self.added_set.remove(num)
            return num
        
        result = self.smallest
        self.smallest += 1
        return result
    
    def addBack(self, num: int) -> None:
        if num < self.smallest and num not in self.added_set:
            heapq.heappush(self.added_back, num)
            self.added_set.add(num)
```

---

## Problem 11: Find Median from Data Stream (Hard)
**LeetCode 295**

### Problem
Design data structure to find median from a stream.

### Intuition
Two heaps: max-heap for lower half, min-heap for upper half.

### Solution
```python
class MedianFinder:
    """
    addNum: O(log n)
    findMedian: O(1)
    Space: O(n)
    """
    def __init__(self):
        self.small = []  # Max-heap (lower half)
        self.large = []  # Min-heap (upper half)
    
    def addNum(self, num: int) -> None:
        # Always add to small first
        heapq.heappush(self.small, -num)
        
        # Move largest from small to large
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Balance: small can have at most 1 more than large
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        
        return (-self.small[0] + self.large[0]) / 2
```

---

## Problem 12: Merge K Sorted Lists (Hard)
**LeetCode 23**

### Problem
Merge k sorted linked lists into one sorted list.

### Intuition
Min-heap to always get smallest next node.

### Solution
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists: list[ListNode]) -> ListNode:
    """
    Time: O(N log k) where N = total nodes
    Space: O(k)
    """
    heap = []
    
    # Add first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
    
    return dummy.next
```

---

## 📊 Heap Summary

| Problem | Difficulty | Heap Type | Key Technique |
|---------|------------|-----------|---------------|
| Kth Largest Stream | Easy | Min-heap (k) | Keep k largest |
| Last Stone Weight | Easy | Max-heap | Always smash heaviest |
| K Closest Points | Medium | Max-heap (k) | Keep k smallest dist |
| Kth Largest Array | Medium | Min-heap (k) | Keep k largest |
| Task Scheduler | Medium | Max-heap | Most frequent first |
| Design Twitter | Medium | Min-heap | Merge k sorted |
| IPO | Hard | Two heaps | Available/unavailable |
| Top K Frequent Words | Medium | Min-heap (k) | Custom comparator |
| Reorganize String | Medium | Max-heap | Alternate placement |
| Smallest Infinite Set | Medium | Min-heap | Track infinite part |
| Find Median | Hard | Two heaps | Balance small/large |
| Merge K Lists | Hard | Min-heap | Multi-way merge |

### Pattern Recognition:

**Kth Largest/Smallest:**
- Use min-heap of size k for kth largest
- Use max-heap of size k for kth smallest

**Two Heaps:**
- Split into two halves (median finding)
- Available/unavailable resources (IPO)

**Top K Frequent:**
- Count frequencies first
- Use heap to get top k

**Stream Processing:**
- Add elements maintaining heap property
- Query in O(1) or O(log n)

### Python Heap Tips:
```python
# Python only has min-heap, for max-heap:
heapq.heappush(heap, -val)  # Negate values
-heapq.heappop(heap)        # Negate back

# heapify is O(n)
heapq.heapify(list)

# heapreplace = pop then push (more efficient)
heapq.heapreplace(heap, new_val)

# nlargest/nsmallest
heapq.nlargest(k, iterable)
heapq.nsmallest(k, iterable)
```
