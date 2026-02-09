# Top K Frequent Words

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 692 | Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find k most frequent words. If same frequency, sort alphabetically.

### Constraints & Clarifying Questions
1. **Tie-breaker?** Lexicographically smaller first.
2. **Case sensitive?** Assume yes (lowercase).
3. **Return order?** Frequency desc, then alpha asc.
4. **k always valid?** Yes.

### Edge Cases
1. **All same frequency:** Alphabetical order
2. **k = 1:** Most frequent (or first alpha if tie)
3. **Single word repeated:** Return that word

---

## Phase 2: High-Level Approach

### Approach: Min Heap with Custom Comparator
Use heap of size k; custom comparison for (frequency, word).

**Core Insight:** Need custom ordering: low frequency bad, high alpha bad (for min heap).

---

## Phase 3: Python Code

```python
import heapq
from collections import Counter
from typing import List


class WordFreq:
    """Custom class for heap comparison."""
    def __init__(self, word: str, freq: int):
        self.word = word
        self.freq = freq
    
    def __lt__(self, other):
        # Min heap: want to keep high freq, low alpha
        # So "bad" items should be < (popped first)
        if self.freq != other.freq:
            return self.freq < other.freq  # Lower freq is "worse"
        return self.word > other.word  # Higher alpha is "worse"


def solve(words: List[str], k: int) -> List[str]:
    """
    Find k most frequent words with alphabetical tie-breaker.
    
    Args:
        words: List of words
        k: Number of words to return
    
    Returns:
        k most frequent words in order
    """
    count = Counter(words)
    
    heap = []
    for word, freq in count.items():
        heapq.heappush(heap, WordFreq(word, freq))
        if len(heap) > k:
            heapq.heappop(heap)
    
    # Extract in reverse order (heap gives worst first)
    result = []
    while heap:
        result.append(heapq.heappop(heap).word)
    
    return result[::-1]


def solve_sort(words: List[str], k: int) -> List[str]:
    """
    Using sort. O(N log N)
    """
    count = Counter(words)
    
    # Sort by (-frequency, word) for correct ordering
    sorted_words = sorted(count.keys(), key=lambda w: (-count[w], w))
    
    return sorted_words[:k]


def solve_bucket(words: List[str], k: int) -> List[str]:
    """
    Bucket sort approach. O(N)
    """
    count = Counter(words)
    
    # Buckets by frequency
    buckets = [[] for _ in range(len(words) + 1)]
    for word, freq in count.items():
        buckets[freq].append(word)
    
    # Sort each bucket alphabetically
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        bucket = sorted(buckets[freq])
        for word in bucket:
            result.append(word)
            if len(result) == k:
                return result
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `words = ["i","love","leetcode","i","love","coding"], k = 2`

**Counts:** {"i": 2, "love": 2, "leetcode": 1, "coding": 1}

**Heap (using custom comparator):**

| Word | Freq | Heap State |
|------|------|------------|
| i | 2 | [(i,2)] |
| love | 2 | [(love,2), (i,2)] - love > i so love is "worse" |
| leetcode | 1 | pop (love,2)? No, (leetcode,1) is worse |

Wait, let me trace more carefully. With min heap where lower freq is worse:
- Add (i,2)
- Add (love,2): love > i alphabetically, so love is "worse", heap = [(love,2), (i,2)]
- Add (leetcode,1): freq 1 < 2, so (leetcode,1) is "worse", pop it, heap = [(love,2), (i,2)]
- Add (coding,1): similar, popped

Final heap: [(love,2), (i,2)]
Pop order: love, then i
Reverse: [i, love]

**Result:** `["i", "love"]`

---

## Phase 5: Complexity Analysis

### Heap Approach:
- **Time:** O(N log k)
- **Space:** O(N)

### Sort Approach:
- **Time:** O(N log N)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Streaming words?"**
   → Maintain counter and heap; update on each word.

2. **"Case insensitive?"**
   → Convert to lowercase when counting.

3. **"Bigrams instead of words?"**
   → Count consecutive word pairs.
