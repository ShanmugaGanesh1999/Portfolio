# Key-Value Stores

> Simple, fast, and scalable data storage

---

## 📖 What is a Key-Value Store?

A **Key-Value Store** is the simplest type of database that stores data as pairs of keys and values, like a giant hash map.

```
Key                    Value
────────────────────────────────────────────
user:123               {"name": "Alice", "age": 30}
session:abc123         {"user_id": 123, "expires": 1234567890}
cache:homepage         "<html>...</html>"
counter:page_views     42000000
```

---

## 🎯 Why Use Key-Value Stores?

1. **Speed** - Sub-millisecond latency
2. **Simplicity** - Simple API (GET, SET, DELETE)
3. **Scalability** - Easy horizontal scaling
4. **Flexibility** - Value can be any data type

---

## 🔧 Basic Operations

```python
# SET - Store a value
kv.set("user:123", {"name": "Alice"})

# GET - Retrieve a value
user = kv.get("user:123")

# DELETE - Remove a value
kv.delete("user:123")

# EXISTS - Check if key exists
exists = kv.exists("user:123")

# TTL - Set expiration
kv.set("session:abc", data, ttl=3600)  # Expires in 1 hour
```

---

## 📊 Popular Key-Value Stores

### Redis

```
Type: In-memory with optional persistence
Speed: ~100,000 operations/second
Features: Data structures, pub/sub, Lua scripting

Best for:
├── Caching
├── Session storage
├── Real-time leaderboards
├── Rate limiting
└── Pub/sub messaging
```

### Memcached

```
Type: Pure in-memory cache
Speed: ~100,000+ operations/second
Features: Simple, multi-threaded

Best for:
├── Simple caching
├── Session storage
└── When you don't need persistence
```

### DynamoDB (AWS)

```
Type: Managed, persistent
Speed: Single-digit millisecond
Features: Auto-scaling, global tables

Best for:
├── Serverless applications
├── Gaming leaderboards
├── IoT data
└── When you need managed service
```

### etcd

```
Type: Distributed, consistent
Features: Strong consistency, watch API

Best for:
├── Configuration storage
├── Service discovery
├── Distributed locks
└── Kubernetes metadata
```

---

## 🏗️ Designing a Key-Value Store

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Clients                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   Load Balancer                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │  Node 1   │   │  Node 2   │   │  Node 3   │
   │           │   │           │   │           │
   │  Partition│   │  Partition│   │  Partition│
   │   A, B    │   │   C, D    │   │   E, F    │
   └───────────┘   └───────────┘   └───────────┘
```

### Key Components

#### 1. Data Partitioning

```
How to distribute keys across nodes?

Consistent Hashing:
├── Map keys and nodes to a hash ring
├── Key assigned to first node clockwise
├── Adding/removing nodes moves minimal keys

Example:
hash("user:123") = position on ring
Find first node clockwise → Node 2
```

#### 2. Replication

```
Replicate data for fault tolerance

         Write
           │
           ▼
       ┌───────┐
       │Node A │ (Primary)
       └───┬───┘
     ┌─────┴─────┐
     ▼           ▼
 ┌───────┐   ┌───────┐
 │Node B │   │Node C │ (Replicas)
 └───────┘   └───────┘
 
 N = 3 replicas
 Survive 2 failures
```

#### 3. Consistency

```
Quorum System:
├── N = Total replicas
├── W = Write quorum (successful writes needed)
├── R = Read quorum (successful reads needed)

Strong consistency: W + R > N
├── Example: N=3, W=2, R=2
├── Always see latest write

Eventual consistency: W + R <= N
├── Example: N=3, W=1, R=1
├── Faster, but may see stale data
```

#### 4. Conflict Resolution

```
When replicas disagree, how to resolve?

Last-Write-Wins (LWW):
├── Attach timestamp to each write
├── Latest timestamp wins
└── Simple but can lose data

Vector Clocks:
├── Track causal history
├── Detect conflicts
└── Let application resolve

CRDTs (Conflict-free):
├── Data structures that merge automatically
├── Counters, sets, maps
└── No conflicts possible
```

---

## 📈 Scalability Features

### Consistent Hashing

```
Add/Remove nodes with minimal data movement

        Node A                    Node A
           │                         │
    ┌──────┴──────┐           ┌──────┴──────┐
    │  Hash Ring │    ──►     │  Hash Ring │
    └─────────────┘           └─────────────┘
   ╱              ╲          ╱    │         ╲
Node D          Node B     Node D │       Node B
                                  │
                              Node E (new)
                              
Only keys between D and E move to E
```

### Virtual Nodes

```
Problem: Uneven distribution with few nodes

Solution: Each physical node = many virtual nodes

Physical Node 1 → V1, V4, V7
Physical Node 2 → V2, V5, V8
Physical Node 3 → V3, V6, V9

Better distribution!
```

---

## 🛡️ Fault Tolerance

### Failure Detection

```
Gossip Protocol:
├── Nodes periodically exchange state
├── "Have you heard from Node B?"
├── If no one has → Mark as failed
├── Decentralized, scalable
```

### Handling Failures

```
Hinted Handoff:
├── Node A handles write for failed Node B
├── Stores "hint" to forward later
├── When B recovers, A sends data
└── Temporary coverage during outage

Read Repair:
├── Read from multiple replicas
├── If values differ, repair stale replicas
├── Background consistency
```

---

## 💡 Key-Value Store Patterns

### Caching Pattern

```python
def get_user(user_id):
    # Try cache first
    cached = redis.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    
    # Cache miss - fetch from DB
    user = database.get_user(user_id)
    
    # Store in cache for next time
    redis.set(f"user:{user_id}", json.dumps(user), ex=3600)
    
    return user
```

### Counter Pattern

```python
# Atomic increment (no race conditions)
redis.incr("page_views")
redis.incrby("likes:post:123", 1)

# Get current count
views = redis.get("page_views")
```

### Rate Limiting Pattern

```python
def is_rate_limited(user_id, limit=100, window=60):
    key = f"rate:{user_id}:{current_minute()}"
    
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, window)
    
    return count > limit
```

### Session Storage Pattern

```python
def create_session(user_id):
    session_id = generate_uuid()
    session_data = {"user_id": user_id, "created": now()}
    
    redis.set(f"session:{session_id}", json.dumps(session_data), ex=86400)
    return session_id

def get_session(session_id):
    data = redis.get(f"session:{session_id}")
    return json.loads(data) if data else None
```

---

## ⚠️ Key-Value Store Limitations

```
1. No Complex Queries
   ✗ Cannot do: SELECT * FROM users WHERE age > 25
   ✓ Can only do: GET user:123

2. No Relationships
   ✗ No JOINs between tables
   ✓ Must denormalize or query multiple keys

3. Limited Transaction Support
   ✗ No multi-key ACID transactions (usually)
   ✓ Some support Lua scripting for atomicity

4. Memory Constraints
   ✗ In-memory stores limited by RAM
   ✓ Use eviction policies, or disk-based stores
```

---

## 📊 Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| Data Structures | Yes (lists, sets, hashes) | No (strings only) |
| Persistence | Yes | No |
| Replication | Yes | No |
| Clustering | Yes | Client-side |
| Pub/Sub | Yes | No |
| Lua Scripting | Yes | No |
| Multi-threaded | No (single-threaded) | Yes |

**Choose Redis when**: You need data structures, persistence, or pub/sub
**Choose Memcached when**: Simple caching, multi-threaded performance

---

## 💡 In System Design Interviews

### Common Use Cases to Mention

```
1. "We'll use Redis for caching to reduce database load"
2. "Session storage in Redis for stateless web servers"
3. "Rate limiting with Redis counters"
4. "Real-time leaderboard using Redis sorted sets"
5. "Distributed locks with Redis for coordination"
```

### Design Questions to Consider

```
├── In-memory or persistent?
├── What's the eviction policy?
├── How many replicas?
├── Consistency requirements?
├── TTL for cached items?
└── Estimated memory requirements?
```

---

## ✅ Key Takeaways

1. **Simple API** - GET, SET, DELETE
2. **Blazing fast** - Sub-millisecond latency
3. **Great for caching** - Reduce database load
4. **Scales horizontally** - Consistent hashing + sharding
5. **Limited queries** - Only key-based lookups
6. **Redis is versatile** - Data structures, pub/sub, persistence
7. **Consider memory** - In-memory stores need enough RAM

---

## 📖 Next Steps

→ Continue to [CDN](./05-cdn.md)
