# Sharded Counters

> Counting at massive scale without bottlenecks

---

## 📖 What is a Sharded Counter?

A **Sharded Counter** distributes a single counter across multiple shards to avoid contention and enable high-throughput writes.

```
Problem: Single counter bottleneck

All writes to one row:
Thread 1 ─┐
Thread 2 ─┼──► [counter: 1234] ← Lock contention!
Thread 3 ─┘

Solution: Spread across shards

Thread 1 ──► [shard_0: 400]
Thread 2 ──► [shard_1: 412]  ──► Total = 1234
Thread 3 ──► [shard_2: 422]
```

---

## 🎯 When to Use

```
Use Cases:
├── Like counts on viral posts
├── View counts on popular videos
├── Real-time vote counting
├── Global visitor counters
├── API rate limit counters
└── Inventory decrements (flash sales)

Symptoms you need sharding:
├── Database CPU spikes on counter updates
├── Lock wait timeouts
├── Slow writes during peak traffic
└── Single row becoming hot spot
```

---

## 🔧 How It Works

### Basic Concept

```
Instead of:
┌─────────────────────────┐
│ post_id │ like_count    │
│   123   │   1,000,000   │ ← Hot row
└─────────────────────────┘

Use:
┌─────────────────────────────────────┐
│ post_id │ shard_id │ count         │
│   123   │    0     │   100,523     │
│   123   │    1     │    99,847     │
│   123   │    2     │   100,102     │
│   ...   │   ...    │     ...       │
│   123   │    9     │    99,428     │
└─────────────────────────────────────┘

Total likes = SUM(count) WHERE post_id = 123
            = 1,000,000
```

### Increment Operation

```python
import random

NUM_SHARDS = 10

def increment_counter(post_id):
    # Randomly pick a shard
    shard_id = random.randint(0, NUM_SHARDS - 1)
    
    # Increment that shard
    db.execute("""
        INSERT INTO counters (post_id, shard_id, count)
        VALUES (%s, %s, 1)
        ON CONFLICT (post_id, shard_id)
        DO UPDATE SET count = counters.count + 1
    """, (post_id, shard_id))

def get_counter(post_id):
    # Sum all shards
    result = db.execute("""
        SELECT SUM(count) FROM counters
        WHERE post_id = %s
    """, (post_id,))
    return result[0] or 0
```

### Write Distribution

```
With 10 shards:
├── Each shard gets ~10% of writes
├── 10x reduction in contention per shard
└── Scale by adding more shards

Write pattern (random distribution):

Request 1 ─────► Shard 7 ─┐
Request 2 ─────► Shard 2  │
Request 3 ─────► Shard 9  ├──► Sum on read
Request 4 ─────► Shard 2  │
Request 5 ─────► Shard 5 ─┘
```

---

## 📊 Choosing Number of Shards

```
Too few shards:
├── Still have contention
└── Limited scalability

Too many shards:
├── More rows to aggregate
├── Higher read cost
└── More complexity

Heuristics:
├── Start with 10-100 shards
├── Shards >= expected writes per second
├── More shards for viral content
└── Can dynamically adjust

Example:
├── Normal post: 10 shards
├── Trending post: 100 shards
└── Viral post: 1000 shards
```

---

## 🔧 Shard Selection Strategies

### Random

```python
# Simple, good distribution
shard_id = random.randint(0, NUM_SHARDS - 1)

Pros:
├── Even distribution
└── Simple implementation

Cons:
├── Not deterministic
└── Can't do per-user dedup easily
```

### Hash-based

```python
# Deterministic based on input
shard_id = hash(user_id) % NUM_SHARDS

Pros:
├── Deterministic
├── Same user → same shard
└── Can track per-user actions

Cons:
├── May have uneven distribution
└── Hot users still cause problems
```

### Round-robin (with counter)

```python
# Rotate through shards
import redis

def get_next_shard(counter_id):
    shard = redis.incr(f"shard_counter:{counter_id}")
    return shard % NUM_SHARDS

Pros:
├── Even distribution
├── Predictable

Cons:
├── Requires coordination
└── Extra Redis call
```

---

## 📈 Optimizing Reads

### Problem: Reads Still Slow

```
Every read = SUM across all shards
10 shards = 10 rows to aggregate

For hot content, this is still slow!
```

### Solution 1: Cached Total

```
Periodically aggregate and cache:

┌──────────────┐     ┌──────────────────────────┐
│ Shards (DB)  │     │        Redis             │
│ [100] [99]   │────►│ post:123:likes = 1000000 │
│ [101] [100]  │     │ (cached, TTL: 1 minute)  │
└──────────────┘     └──────────────────────────┘

Read path:
1. Check cache → if hit, return
2. Cache miss → aggregate from DB
3. Cache the result
```

```python
def get_likes(post_id):
    # Try cache first
    cached = redis.get(f"likes:{post_id}")
    if cached:
        return int(cached)
    
    # Cache miss - aggregate from DB
    total = db.execute(
        "SELECT SUM(count) FROM counters WHERE post_id = %s",
        (post_id,)
    )[0]
    
    # Cache for 60 seconds
    redis.setex(f"likes:{post_id}", 60, total)
    return total
```

### Solution 2: Write-through Counter

```
Keep running total in fast storage:

Write path:
1. Increment shard (DB)
2. Increment total (Redis) INCR

Read path:
1. Read from Redis (O(1))

┌──────────────┐     ┌──────────────────────────┐
│ Shards (DB)  │     │        Redis             │
│ [100] [99]   │     │ post:123:likes = 1000000 │
│ [101] [100]  │     │                          │
└──────────────┘     └──────────────────────────┘
       │                       ▲
       └── Increment both ─────┘
```

### Solution 3: Approximate Counting

```
For display purposes, exact count not needed:

Display: "1.2M likes" instead of "1,234,567 likes"

Can use:
├── Probabilistic counters (HyperLogLog for unique)
├── Cached values with longer TTL
├── Batch updates (aggregate every minute)
└── Acceptable staleness (30 sec lag OK)
```

---

## 🔧 Implementation Patterns

### Database Schema

```sql
-- Sharded counters table
CREATE TABLE counters (
    entity_type VARCHAR(50),   -- 'post', 'video', etc.
    entity_id BIGINT,
    shard_id SMALLINT,
    count BIGINT DEFAULT 0,
    updated_at TIMESTAMP,
    PRIMARY KEY (entity_type, entity_id, shard_id)
);

-- Index for aggregation
CREATE INDEX idx_counters_entity 
ON counters(entity_type, entity_id);
```

### Redis Sharded Counter

```python
import redis

NUM_SHARDS = 100

def increment(entity_id, amount=1):
    shard = random.randint(0, NUM_SHARDS - 1)
    key = f"counter:{entity_id}:shard:{shard}"
    return redis.incrby(key, amount)

def get_total(entity_id):
    keys = [f"counter:{entity_id}:shard:{i}" 
            for i in range(NUM_SHARDS)]
    
    # MGET is atomic and fast
    values = redis.mget(keys)
    return sum(int(v or 0) for v in values)
```

### With Lua Script (Atomic)

```lua
-- Redis Lua script for increment + get approximate total
local entity_id = KEYS[1]
local shard = math.random(0, 99)
local shard_key = "counter:" .. entity_id .. ":shard:" .. shard

-- Increment shard
redis.call('INCRBY', shard_key, 1)

-- Return cached total (may be stale)
local total_key = "counter:" .. entity_id .. ":total"
local total = redis.call('GET', total_key)

if total then
    return tonumber(total)
else
    -- Compute and cache
    local sum = 0
    for i = 0, 99 do
        local k = "counter:" .. entity_id .. ":shard:" .. i
        local v = redis.call('GET', k)
        sum = sum + (tonumber(v) or 0)
    end
    redis.call('SETEX', total_key, 60, sum)  -- Cache 60s
    return sum
end
```

---

## 💡 Real-World Examples

### Facebook Likes

```
When post goes viral:
1. Detect high write rate
2. Dynamically increase shards
3. Use approximate counts for display
4. Aggregate exact count asynchronously

Tiered approach:
├── Normal: 10 shards
├── Popular: 100 shards  
├── Viral: 1000+ shards
└── Cache aggressively
```

### YouTube View Counts

```
Combination of techniques:
├── Sharded writes to counter shards
├── Batch processing (aggregate hourly)
├── Cached display values
├── Eventual consistency (a few min lag OK)
└── Fraud detection before counting
```

### Twitter Likes/Retweets

```
Fan-out considerations:
├── Counter per tweet (sharded)
├── User sees aggregate
├── Celebrity tweets get more shards
└── Rate limiting per user
```

---

## ⚠️ Edge Cases

### Counter Accuracy

```
Problem: Writes can fail after cache but before DB

Solutions:
├── Use transactions where possible
├── Accept eventual consistency
├── Periodic reconciliation
└── Idempotent writes with dedup
```

### Decrement and Negative Values

```
Problem: Unlike/remove vote

Can't just decrement - may go negative during race:
├── User unlikes
├── Meanwhile: aggregation runs
├── Shard shows negative

Solution:
├── Store likes and unlikes separately
├── Net = likes - unlikes
├── Or use signed integers, validate on read
```

### Shard Rebalancing

```
Problem: Need more shards for hot content

Solutions:
├── Pre-allocate more shards (unused shards = 0)
├── Dynamic sharding based on rate
├── Split existing shards
└── Background migration
```

---

## 💡 In System Design Interviews

### When to Use

```
1. "How do you handle millions of likes per second?"
2. "Design a view counter for YouTube"
3. "How do you count votes in real-time?"
4. "Flash sale inventory decrement"
```

### Key Points

```
1. Why shard? Single counter = hot spot = bottleneck
2. How many shards? ~100, scale based on traffic
3. Shard selection: Random or hash-based
4. Read optimization: Cache the total
5. Trade-offs: Exact vs approximate, latency vs consistency
6. Scaling: Add more shards for viral content
```

---

## ✅ Key Takeaways

1. **Single counter = bottleneck** under high load
2. **Shard writes** across multiple rows
3. **Random selection** for even distribution
4. **Sum on read** or cache the total
5. **10-100 shards** is typical starting point
6. **Approximate is OK** for display ("1.2M likes")
7. **Redis INCR** for simple, fast sharding
8. **Combine with caching** for read optimization

---

## 📖 Next Steps

Building Blocks complete! Continue to [Design Problems](../05-Design-Problems/README.md)
