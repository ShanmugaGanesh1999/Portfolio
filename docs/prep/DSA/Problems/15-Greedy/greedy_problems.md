# 💚 Greedy - Complete Problem Set

## Problem 1: Maximum Subarray (Easy)
**LeetCode 53**

### Problem
Find contiguous subarray with largest sum.

### Intuition
Kadane's algorithm: extend current or start fresh.

### Solution
```python
def maxSubArray(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    max_sum = current = nums[0]
    
    for num in nums[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)
    
    return max_sum
```

---

## Problem 2: Jump Game (Medium)
**LeetCode 55**

### Problem
Check if you can reach the last index.

### Intuition
Track farthest reachable position.

### Solution
```python
def canJump(nums: list[int]) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    farthest = 0
    
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    
    return True
```

---

## Problem 3: Jump Game II (Medium)
**LeetCode 45**

### Problem
Minimum jumps to reach last index.

### Intuition
BFS-like: count levels (jumps) needed.

### Solution
```python
def jump(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    jumps = 0
    current_end = 0
    farthest = 0
    
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        
        if i == current_end:
            jumps += 1
            current_end = farthest
    
    return jumps
```

---

## Problem 4: Gas Station (Medium)
**LeetCode 134**

### Problem
Find starting gas station for circular route.

### Intuition
If total gas >= total cost, solution exists. Start after deficit point.

### Solution
```python
def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    total_tank = 0
    current_tank = 0
    start = 0
    
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_tank += diff
        current_tank += diff
        
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    return start if total_tank >= 0 else -1
```

---

## Problem 5: Hand of Straights (Medium)
**LeetCode 846**

### Problem
Rearrange cards into groups of W consecutive cards.

### Intuition
Start from smallest card, greedily form groups.

### Solution
```python
from collections import Counter

def isNStraightHand(hand: list[int], groupSize: int) -> bool:
    """
    Time: O(n log n)
    Space: O(n)
    """
    if len(hand) % groupSize != 0:
        return False
    
    count = Counter(hand)
    
    for card in sorted(count):
        if count[card] > 0:
            need = count[card]
            
            for i in range(card, card + groupSize):
                if count[i] < need:
                    return False
                count[i] -= need
    
    return True
```

---

## Problem 6: Merge Triplets to Form Target Triplet (Medium)
**LeetCode 1899**

### Problem
Check if target triplet can be formed by merging triplets (taking max of each position).

### Intuition
Filter triplets that could contribute (no value exceeds target). Check if all targets covered.

### Solution
```python
def mergeTriplets(triplets: list[list[int]], target: list[int]) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    good = set()
    
    for triplet in triplets:
        # Skip if any value exceeds target
        if (triplet[0] <= target[0] and 
            triplet[1] <= target[1] and 
            triplet[2] <= target[2]):
            
            for i in range(3):
                if triplet[i] == target[i]:
                    good.add(i)
    
    return len(good) == 3
```

---

## Problem 7: Partition Labels (Medium)
**LeetCode 763**

### Problem
Partition string so each letter appears in at most one part.

### Intuition
Track last occurrence. Extend partition to include all characters.

### Solution
```python
def partitionLabels(s: str) -> list[int]:
    """
    Time: O(n)
    Space: O(1) - max 26 chars
    """
    last = {c: i for i, c in enumerate(s)}
    
    result = []
    start = end = 0
    
    for i, c in enumerate(s):
        end = max(end, last[c])
        
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    
    return result
```

---

## Problem 8: Valid Parenthesis String (Medium)
**LeetCode 678**

### Problem
Check if string with '(', ')', '*' is valid (* can be '(', ')', or empty).

### Intuition
Track range of possible open counts [low, high].

### Solution
```python
def checkValidString(s: str) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    low = high = 0  # Range of possible open parentheses count
    
    for c in s:
        if c == '(':
            low += 1
            high += 1
        elif c == ')':
            low = max(0, low - 1)
            high -= 1
        else:  # '*'
            low = max(0, low - 1)  # * as )
            high += 1              # * as (
        
        if high < 0:
            return False
    
    return low == 0
```

---

## Problem 9: Maximum Length of Pair Chain (Medium)
**LeetCode 646**

### Problem
Find longest chain where each pair [a,b] connects to [c,d] if b < c.

### Intuition
Sort by end. Greedily pick pair that ends earliest.

### Solution
```python
def findLongestChain(pairs: list[list[int]]) -> int:
    """
    Time: O(n log n)
    Space: O(1)
    """
    pairs.sort(key=lambda x: x[1])
    
    count = 0
    current_end = float('-inf')
    
    for start, end in pairs:
        if start > current_end:
            count += 1
            current_end = end
    
    return count
```

---

## Problem 10: Minimum Number of Arrows (Medium)
**LeetCode 452**

### Problem
Minimum arrows to burst all balloons.

### Intuition
Sort by end. One arrow can burst overlapping balloons.

### Solution
```python
def findMinArrowPoints(points: list[list[int]]) -> int:
    """
    Time: O(n log n)
    Space: O(1)
    """
    points.sort(key=lambda x: x[1])
    
    arrows = 1
    arrow_pos = points[0][1]
    
    for start, end in points[1:]:
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end
    
    return arrows
```

---

## Problem 11: Candy (Hard)
**LeetCode 135**

### Problem
Distribute candy to children in line. Higher rating gets more than neighbors.

### Intuition
Two passes: left to right, then right to left.

### Solution
```python
def candy(ratings: list[int]) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    n = len(ratings)
    candies = [1] * n
    
    # Left to right
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            candies[i] = candies[i-1] + 1
    
    # Right to left
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            candies[i] = max(candies[i], candies[i+1] + 1)
    
    return sum(candies)
```

---

## Problem 12: Maximum Points You Can Obtain from Cards (Medium)
**LeetCode 1423**

### Problem
Take k cards from beginning or end, maximize sum.

### Intuition
Minimize sum of remaining n-k contiguous cards.

### Solution
```python
def maxScore(cardPoints: list[int], k: int) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    n = len(cardPoints)
    window_size = n - k
    
    # Sum of first window
    window_sum = sum(cardPoints[:window_size])
    min_window = window_sum
    
    # Slide window
    for i in range(window_size, n):
        window_sum += cardPoints[i] - cardPoints[i - window_size]
        min_window = min(min_window, window_sum)
    
    return sum(cardPoints) - min_window
```

---

## Problem 13: Boats to Save People (Medium)
**LeetCode 881**

### Problem
Minimum boats needed. Each boat holds 2 people with weight limit.

### Intuition
Sort. Pair heaviest with lightest if possible.

### Solution
```python
def numRescueBoats(people: list[int], limit: int) -> int:
    """
    Time: O(n log n)
    Space: O(1)
    """
    people.sort()
    
    boats = 0
    left, right = 0, len(people) - 1
    
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
    
    return boats
```

---

## Problem 14: Task Scheduler (Medium)
**LeetCode 621**

### Problem
Schedule tasks with cooling time n between same tasks.

### Intuition
Most frequent task determines minimum time.

### Solution
```python
from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for f in freq.values() if f == max_freq)
    
    # (max_freq - 1) intervals of (n + 1) + tasks with max_freq
    min_length = (max_freq - 1) * (n + 1) + max_count
    
    return max(min_length, len(tasks))
```

---

## Problem 15: Minimum Deletions to Make Character Frequencies Unique (Medium)
**LeetCode 1647**

### Problem
Delete minimum characters so no two characters have same frequency.

### Intuition
Track used frequencies. For each frequency, delete until unique.

### Solution
```python
def minDeletions(s: str) -> int:
    """
    Time: O(n)
    Space: O(n)
    """
    freq = Counter(s)
    used = set()
    deletions = 0
    
    for f in freq.values():
        while f > 0 and f in used:
            f -= 1
            deletions += 1
        used.add(f)
    
    return deletions
```

---

## 📊 Greedy Summary

| Problem | Key Insight | Strategy |
|---------|-------------|----------|
| Max Subarray | Kadane | Extend or restart |
| Jump Game | Track farthest | Reachability |
| Jump Game II | BFS levels | Count jumps at boundary |
| Gas Station | Net gain | Start after deficit |
| Hand of Straights | Sort + count | Form groups from smallest |
| Merge Triplets | Filter valid | Check coverage |
| Partition Labels | Last occurrence | Extend partition |
| Valid Parenthesis * | Count range | Track low/high |
| Pair Chain | Sort by end | Pick earliest end |
| Min Arrows | Sort by end | One arrow for overlaps |
| Candy | Two passes | Left-right, right-left |
| Cards | Window | Minimize middle window |
| Boats | Two pointers | Pair heavy with light |
| Task Scheduler | Frequency | Most frequent determines |
| Unique Frequencies | Decrement | Make frequencies unique |

### Greedy Patterns:

**Interval Scheduling:**
```python
# Sort by end time
intervals.sort(key=lambda x: x[1])
# Greedily pick non-overlapping
```

**Two Passes:**
```python
# Forward pass
for i in range(n):
    # Compare with previous
# Backward pass
for i in range(n-1, -1, -1):
    # Compare with next
```

**Reachability:**
```python
# Track farthest reachable
farthest = 0
for i in range(n):
    if i > farthest:
        return False
    farthest = max(farthest, i + reach[i])
```

### When to Use Greedy:
1. **Optimal substructure** - local optimal leads to global optimal
2. **Exchange argument** - can prove greedy choice is at least as good
3. **Sorting helps** - often sort by start, end, or some metric
4. **No future dependency** - decision doesn't affect future choices
