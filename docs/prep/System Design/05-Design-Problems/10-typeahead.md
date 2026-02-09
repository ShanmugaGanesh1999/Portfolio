# Design Typeahead / Autocomplete

> Real-time search suggestions as you type

---

## 📋 Problem Statement

Design an autocomplete system that shows search suggestions as users type, like Google Search or Amazon product search.

---

## R - Requirements

### Functional Requirements

```
1. Show top suggestions as user types
2. Update suggestions with each keystroke
3. Suggestions ordered by relevance/popularity
4. Support personalization (optional)
5. Handle typos gracefully
```

### Non-Functional Requirements

```
1. Ultra-low latency (<100ms, ideally <50ms)
2. High availability (99.99%)
3. Scalable (millions of QPS)
4. Real-time updates for trending queries
```

---

## E - Estimation

```
Daily users: 500M users
Searches per user per day: 5
Average characters per search: 15
Suggestions per keystroke: 10

Traffic:
├── 500M × 5 × 15 = 37.5B requests/day
├── ~450K requests/second average
├── ~1M requests/second peak

Data:
├── 5 billion unique queries
├── Average query: 20 characters
├── Total: 5B × 20 = 100GB of queries
├── With metadata: ~500GB
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   User: types "how t"                                        │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────────────────────────────────┐                  │
│   │           API Gateway                 │                  │
│   └──────────────────┬───────────────────┘                  │
│                      │                                       │
│   ┌──────────────────▼───────────────────┐                  │
│   │      Typeahead Service (Stateless)    │                  │
│   │  ┌───────────────────────────────┐   │                  │
│   │  │    In-Memory Trie Cache       │   │                  │
│   │  │    (Redis / Local Memory)     │   │                  │
│   │  └───────────────────────────────┘   │                  │
│   └──────────────────┬───────────────────┘                  │
│                      │                                       │
│   ┌──────────────────▼───────────────────┐                  │
│   │        Suggestion Store               │                  │
│   │   ┌────────────┬────────────────┐    │                  │
│   │   │   Redis    │   PostgreSQL   │    │                  │
│   │   │  (Hot)     │  (Historical)  │    │                  │
│   │   └────────────┴────────────────┘    │                  │
│   └──────────────────────────────────────┘                  │
│                                                              │
│   ┌──────────────────────────────────────┐                  │
│   │      Analytics Pipeline (Async)       │                  │
│   │  ┌─────────┐  ┌──────┐  ┌─────────┐  │                  │
│   │  │ Kafka   │→ │Spark │→ │Trie     │  │                  │
│   │  │(Queries)│  │ Job  │  │Builder  │  │                  │
│   │  └─────────┘  └──────┘  └─────────┘  │                  │
│   └──────────────────────────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Trie Data Structure

```
┌─────────────────────────────────────────────────────────────┐
│              Trie Structure                                  │
│                                                              │
│   Example: Queries "tree", "try", "true", "toy"             │
│                                                              │
│                    (root)                                    │
│                      │                                       │
│                    ┌─┴─┐                                     │
│                    │ t │                                     │
│                    └┬─┬┘                                     │
│                 ┌──┘ └──┐                                   │
│               ┌─┴─┐   ┌─┴─┐                                 │
│               │ r │   │ o │                                 │
│               └─┬─┘   └─┬─┘                                 │
│             ┌───┼───┐   │                                   │
│           ┌─┴┐┌─┴┐┌─┴┐ ┌┴─┐                                │
│           │e ││u ││y │ │y │                                 │
│           └┬─┘└┬─┘└──┘ └──┘                                 │
│            │   │  [try] [toy]                               │
│           ┌┴─┐┌┴─┐                                          │
│           │e ││e │                                          │
│           └──┘└──┘                                          │
│          [tree][true]                                        │
│                                                              │
│   Each node stores:                                          │
│   ├── Children (map of char → node)                        │
│   ├── Is terminal (end of word)                            │
│   ├── Top K suggestions for this prefix                    │
│   └── Popularity score                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Optimized Trie Node

```python
class TrieNode:
    def __init__(self):
        self.children = {}  # char → TrieNode
        self.is_word = False
        self.top_k = []     # Pre-computed top suggestions
        self.count = 0      # Popularity score

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word, count):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            # Update top-k at each prefix node
            self._update_top_k(node, word, count)
        node.is_word = True
        node.count = count
    
    def _update_top_k(self, node, word, count, k=10):
        # Maintain sorted list of top-k suggestions
        node.top_k.append((word, count))
        node.top_k.sort(key=lambda x: -x[1])
        node.top_k = node.top_k[:k]
    
    def search(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        return [word for word, _ in node.top_k]
```

### Data Collection Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│              Query Collection                                │
│                                                              │
│   1. User completes search                                  │
│   2. Log query to Kafka                                     │
│   3. Spark aggregates counts (hourly/daily)                 │
│   4. Build new trie with updated frequencies                │
│   5. Deploy to serving layer                                │
│                                                              │
│   Kafka Message:                                             │
│   {                                                          │
│     "query": "how to learn python",                         │
│     "timestamp": 1699900000,                                │
│     "user_id": "u123",                                      │
│     "location": "US"                                        │
│   }                                                          │
│                                                              │
│   Aggregation (Spark):                                       │
│   GROUP BY query                                             │
│   COUNT(*) as search_count                                  │
│   Apply time decay: recent searches weighted more           │
│                                                              │
│   Output: query → score mapping                             │
│   "how to learn python" → 50000                             │
│   "how to make money" → 45000                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Serving Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Serving Layer                                   │
│                                                              │
│   Option 1: In-Memory Trie (Best for latency)               │
│   ├── Each server loads trie into memory                   │
│   ├── ~10-20GB per server                                  │
│   ├── Periodic refresh from blob storage                   │
│   └── Consistent hashing for routing                       │
│                                                              │
│   Option 2: Redis                                            │
│   ├── Store prefix → suggestions mapping                   │
│   ├── ZSET for ranked suggestions                          │
│   ├── ZRANGEBYLEX for prefix matching                      │
│   └── Good for updates, slightly higher latency            │
│                                                              │
│   Option 3: Hybrid                                           │
│   ├── Local memory for hot prefixes (top 1M)              │
│   ├── Redis for tail queries                               │
│   └── Best of both worlds                                  │
│                                                              │
│   Sharding strategy:                                         │
│   ├── By first character (26 shards)                       │
│   ├── By hash of prefix                                    │
│   └── Geographic sharding for localized results            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Ranking Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│              Ranking Suggestions                             │
│                                                              │
│   Score = f(popularity, recency, personalization)           │
│                                                              │
│   1. Popularity (global)                                    │
│      - Historical search count                              │
│      - Click-through rate                                   │
│                                                              │
│   2. Recency                                                 │
│      - Time decay: score × e^(-λ × age)                    │
│      - Boost trending queries                              │
│                                                              │
│   3. Personalization (optional)                             │
│      - User's search history                               │
│      - User's location                                     │
│      - User's language                                     │
│                                                              │
│   4. Freshness (for news/trending)                          │
│      - Inject trending topics                              │
│      - Breaking news boost                                 │
│                                                              │
│   Final blend:                                               │
│   score = 0.6 × popularity +                                │
│           0.2 × recency +                                   │
│           0.2 × personalization                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Client-Side Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│              Client Optimizations                            │
│                                                              │
│   1. Debouncing                                              │
│      - Wait 50-100ms after last keystroke                  │
│      - Reduces requests by ~60%                            │
│                                                              │
│   2. Local caching                                           │
│      - Cache prefix → suggestions in browser               │
│      - "ho" results reused for "how"                       │
│                                                              │
│   3. Preload common prefixes                                │
│      - Load top prefixes on page load                      │
│                                                              │
│   4. Progressive request                                     │
│      - Cancel in-flight request on new keystroke           │
│      - Use AbortController in fetch                        │
│                                                              │
│   JavaScript example:                                        │
│   let controller = new AbortController();                   │
│                                                              │
│   function getSuggestions(prefix) {                         │
│     controller.abort();                                     │
│     controller = new AbortController();                     │
│                                                              │
│     fetch(`/suggest?q=${prefix}`, {                         │
│       signal: controller.signal                             │
│     });                                                      │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 API Design

```
GET /v1/suggestions?q=how+to&limit=10

Response:
{
    "query": "how to",
    "suggestions": [
        {"text": "how to learn python", "score": 0.95},
        {"text": "how to make money", "score": 0.92},
        {"text": "how to lose weight", "score": 0.90},
        ...
    ],
    "latency_ms": 15
}
```

---

## 📊 Summary

```
Key Components:
├── Trie: Core data structure with pre-computed top-K
├── Analytics Pipeline: Aggregate query frequencies
├── In-memory cache: Ultra-low latency serving
├── Redis: Fallback for long-tail queries

Key Decisions:
├── Pre-compute top-K at each node
├── Hybrid in-memory + Redis approach
├── Client-side debouncing
├── Time-decay for freshness

Performance:
├── <50ms p99 latency
├── 1M+ QPS with horizontal scaling
├── Hourly trie updates
├── Local caching for popular prefixes
```

---

## 📖 Next Steps

→ Continue to [Design Web Crawler](./11-web-crawler.md)
