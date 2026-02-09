# Distributed Cache

> Speeding up data access with in-memory caching

---

## 📖 What is a Distributed Cache?

A **Distributed Cache** stores frequently accessed data in memory across multiple nodes, providing fast access without hitting the database.

```
Without Cache:
Request → Database (slow, 10-100ms)

With Cache:
Request → Cache (fast, <1ms) → [if miss] → Database
```

---

## 🎯 Why Use Caching?

1. **Reduce latency** - Memory is 1000x faster than disk
2. **Reduce database load** - Fewer queries to DB
3. **Handle traffic spikes** - Absorb sudden load
4. **Cost savings** - Less database scaling needed

---

## 📊 Caching Strategies

### 1. Cache-Aside (Lazy Loading)

```python
def get_user(user_id):
    # 1. Check cache first
    user = cache.get(f"user:{user_id}")
    if user:
        return user  # Cache hit!
    
    # 2. Cache miss - fetch from DB
    user = database.get_user(user_id)
    
    # 3. Store in cache for next time
    cache.set(f"user:{user_id}", user, ttl=3600)
    
    return user
```

**Pros**: Only caches what's needed
**Cons**: First request is slow (cache miss)
**Best for**: Read-heavy workloads

### 2. Write-Through

```python
def update_user(user_id, data):
    # 1. Write to cache
    cache.set(f"user:{user_id}", data)
    
    # 2. Write to database
    database.update_user(user_id, data)
    
    return "OK"
```

**Pros**: Cache always consistent with DB
**Cons**: Higher write latency (two writes)
**Best for**: Data that's read soon after writing

### 3. Write-Behind (Write-Back)

```python
def update_user(user_id, data):
    # 1. Write to cache only
    cache.set(f"user:{user_id}", data)
    
    # 2. Queue async write to database
    queue.push({"type": "update_user", "id": user_id, "data": data})
    
    return "OK"  # Return immediately

# Background worker
def process_writes():
    while True:
        item = queue.pop()
        database.update_user(item["id"], item["data"])
```

**Pros**: Low write latency
**Cons**: Data can be lost if cache fails before DB write
**Best for**: High write throughput, eventual consistency OK

### 4. Read-Through

```
Cache handles DB reads automatically:

Request → Cache → [if miss] → Cache fetches from DB → Returns

Application only talks to cache
Cache manages data loading
```

### 5. Refresh-Ahead

```
Proactively refresh before expiration:

TTL = 60 seconds
Refresh at 50 seconds (before expiry)

Avoids cache miss when item expires
Background refresh keeps data fresh
```

---

## 🔧 Cache Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cache Cluster                             │
│                                                              │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│   │  Node 1  │   │  Node 2  │   │  Node 3  │               │
│   │ Keys A-G │   │ Keys H-N │   │ Keys O-Z │               │
│   └──────────┘   └──────────┘   └──────────┘               │
│                                                              │
│   Consistent Hashing for key distribution                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
└─────────────────────────────────────────────────────────────┘
```

### Data Partitioning

```
Consistent Hashing:

hash("user:123") → Node 2
hash("user:456") → Node 1
hash("user:789") → Node 3

Adding/removing nodes moves minimal keys
```

### Replication

```
Replicate for availability:

Write → Primary Node → Replica 1
                    → Replica 2

Read from any replica
Survive node failures
```

---

## 📊 Eviction Policies

When cache is full, what to remove?

### LRU (Least Recently Used)

```
Access order: A, B, C, D, A, E
Cache size: 4

State after E:
├── Keep: A (recently used)
├── Keep: D
├── Keep: C
├── Keep: E (new)
└── Evict: B (least recently used)
```

### LFU (Least Frequently Used)

```
Access counts: A(10), B(2), C(5), D(1)
Cache size: 3

New item E arrives:
├── Keep: A (10 accesses)
├── Keep: C (5 accesses)
├── Keep: E (new)
└── Evict: D (1 access, least frequent)
```

### TTL (Time To Live)

```
Set expiration on each item:

cache.set("user:123", data, ttl=3600)  # 1 hour

After 1 hour → automatically removed
Ensures data freshness
```

### Random

```
Randomly select item to evict
Simple, low overhead
Surprisingly effective
```

### Comparison

| Policy | Best For | Overhead |
|--------|----------|----------|
| LRU | General use | Medium |
| LFU | Frequency matters | High |
| TTL | Time-sensitive data | Low |
| Random | Simple systems | Very Low |

---

## ⚠️ Caching Challenges

### 1. Cache Invalidation

```
"There are only two hard things in CS:
cache invalidation and naming things"

Problem: Data changes in DB, cache has old value

Solutions:
├── TTL-based: Let cache expire naturally
├── Active invalidation: Delete on update
├── Pub/sub: Broadcast invalidation
└── Event-driven: Listen for DB changes
```

### 2. Cache Stampede (Thundering Herd)

```
Problem:
Cache expires → Many requests simultaneously
→ All hit database → Database overloaded

Timeline:
T=0: Cache expires
T=0.001: 1000 requests arrive
T=0.001: All 1000 hit database!
T=1: Database crashes

Solutions:
├── Locking: Only one fetches, others wait
├── Stale-while-revalidate: Serve old, refresh async
├── Random TTL: Spread expirations
└── Pre-warm: Refresh before expiry
```

```python
# Locking approach
def get_with_lock(key):
    value = cache.get(key)
    if value:
        return value
    
    # Try to acquire lock
    if cache.setnx(f"lock:{key}", 1, ttl=5):
        # Got lock - fetch and cache
        value = database.get(key)
        cache.set(key, value, ttl=3600)
        cache.delete(f"lock:{key}")
        return value
    else:
        # Wait for other process
        time.sleep(0.1)
        return get_with_lock(key)
```

### 3. Cache Penetration

```
Problem:
Requests for non-existent data bypass cache
→ Always hit database

Example: GET user:999999999 (doesn't exist)
Cache miss → DB miss → Next request repeats

Solutions:
├── Cache null values: cache.set("user:999", NULL, ttl=60)
├── Bloom filter: Quick check if key might exist
└── Validation: Check ID format before lookup
```

### 4. Hot Keys

```
Problem:
One key receives massive traffic
→ Single cache node overloaded

Example: Celebrity posts, viral content

Solutions:
├── Replicate hot keys to multiple nodes
├── Local cache (in-process) for hot keys
├── Add random suffix to spread load
└── Pre-compute and distribute
```

### 5. Cache Consistency

```
Problem:
Cache and database can become inconsistent

Scenarios:
├── Update DB, cache update fails
├── Concurrent updates
├── Stale reads during updates

Strategies:
├── Accept eventual consistency
├── Use transactions where possible
├── Implement cache versioning
└── Always read-through on important ops
```

---

## 🛠️ Cache Technologies

### Redis

```
Type: In-memory, optional persistence
Features: 
├── Data structures (lists, sets, hashes)
├── Pub/sub
├── Lua scripting
├── Clustering
└── Replication

Use for: General caching, sessions, real-time
```

### Memcached

```
Type: Pure in-memory
Features:
├── Multi-threaded
├── Simple key-value
└── Easy to scale

Use for: Simple caching, high throughput
```

### Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| Data types | Many | Strings only |
| Persistence | Yes | No |
| Replication | Yes | No |
| Clustering | Yes | Client-side |
| Memory efficiency | Good | Better |
| Multi-threaded | No | Yes |

---

## 📈 Cache Sizing

```
Estimate cache size:

1. Identify hot data (20% = 80% traffic)
2. Calculate size per item
3. Estimate item count
4. Add overhead (20-30%)

Example:
├── 1M users
├── 20% are hot: 200K users
├── 1KB per user: 200MB
├── 30% overhead: 260MB

Need: ~300MB cache minimum
```

---

## 💡 In System Design Interviews

### When to Mention Caching

```
1. "We'll add Redis cache to reduce database load"
2. "Cache popular items for faster response"
3. "Use caching to handle traffic spikes"
4. "Session data in distributed cache for stateless servers"
```

### Questions to Consider

```
├── What caching strategy? (Cache-aside usually)
├── What eviction policy? (LRU typically)
├── What TTL? (Depends on data freshness needs)
├── How to handle cache misses?
├── How to handle invalidation?
├── How to prevent stampedes?
└── How much memory needed?
```

---

## ✅ Key Takeaways

1. **Cache-aside is most common** - Application manages cache
2. **LRU for eviction** - Good default policy
3. **Set appropriate TTL** - Balance freshness vs hit rate
4. **Handle stampedes** - Locking or stale-while-revalidate
5. **Cache null values** - Prevent penetration attacks
6. **Redis is versatile** - More than just caching
7. **80/20 rule** - Cache hot 20% to serve 80% traffic
