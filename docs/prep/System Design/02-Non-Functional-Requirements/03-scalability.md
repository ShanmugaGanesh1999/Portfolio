# Scalability

> Designing systems that handle growth gracefully

---

## 📖 What is Scalability?

**Scalability** is a system's ability to handle increased load by adding resources while maintaining (or improving) performance.

A scalable system can grow:
- **Users**: 1K → 1M → 1B users
- **Data**: 1GB → 1TB → 1PB storage
- **Traffic**: 100 → 100K → 100M requests/second

---

## 📊 Types of Scaling

### Vertical Scaling (Scale Up)

Add more power to existing machines.

```
Before:           After:
┌─────────┐       ┌─────────────┐
│ 4 CPU   │       │ 32 CPU      │
│ 8GB RAM │  ───► │ 256GB RAM   │
│ 500GB   │       │ 10TB SSD    │
└─────────┘       └─────────────┘
```

**Pros**:
- Simple implementation
- No code changes needed
- No distributed system complexity

**Cons**:
- Hardware limits (can't scale infinitely)
- Single point of failure
- Expensive at high end
- Requires downtime to upgrade

### Horizontal Scaling (Scale Out)

Add more machines.

```
Before:                  After:
┌─────────┐       ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Server  │       │ Server  │ │ Server  │ │ Server  │
│    1    │  ───► │    1    │ │    2    │ │    3    │
└─────────┘       └─────────┘ └─────────┘ └─────────┘
```

**Pros**:
- Near-infinite scalability
- No single point of failure
- Can use commodity hardware
- Can scale incrementally

**Cons**:
- More complex architecture
- Requires load balancing
- Data consistency challenges
- Network overhead

---

## 🎯 Scalability Dimensions

### 1. Handling More Users

```
1 User           1000 Users        1M Users
   │                  │                │
   ▼                  ▼                ▼
┌─────┐         ┌───────────┐    ┌──────────────┐
│ App │         │    LB     │    │   CDN/Edge   │
│ + DB│         │ ┌───┬───┐ │    │   ┌─────┐    │
└─────┘         │ │App│App│ │    │   │ LB  │    │
                │ └───┴───┘ │    │ ┌─┴─┬─┬─┴─┐  │
                │   ┌───┐   │    │ │App│App│App││
                │   │DB │   │    │ │Cache│ │ DB││
                │   └───┘   │    │ │Cluster│    │
                └───────────┘    └──────────────┘
```

### 2. Handling More Data

```
Small Data (< 100GB)
└─► Single database

Medium Data (100GB - 10TB)
└─► Primary + Read replicas

Large Data (> 10TB)
└─► Sharded database cluster

Massive Data (> 1PB)
└─► Distributed data lake
```

### 3. Handling More Traffic

```
Low Traffic (< 100 RPS)
└─► Single server

Medium Traffic (100 - 10K RPS)
└─► Load balanced servers

High Traffic (10K - 1M RPS)
└─► Multi-layer caching + LB

Extreme Traffic (> 1M RPS)
└─► Edge computing + CDN + sharding
```

---

## 🔧 Scalability Patterns

### 1. Load Balancing

Distribute traffic across multiple servers.

```
             ┌──────────────┐
             │Load Balancer │
             └──────┬───────┘
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │Server 1│ │Server 2│ │Server 3│
   └────────┘ └────────┘ └────────┘
```

**Algorithms**:
- Round Robin: Rotate through servers
- Least Connections: Send to least busy
- IP Hash: Consistent routing by client IP
- Weighted: More traffic to more powerful servers

### 2. Database Replication

Scale reads by adding replicas.

```
        Writes
           │
           ▼
      ┌────────┐
      │Primary │
      │   DB   │
      └────┬───┘
   ┌───────┼───────┐
   ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐
│Read │ │Read │ │Read │
│Rep 1│ │Rep 2│ │Rep 3│
└─────┘ └─────┘ └─────┘
   ▲       ▲       ▲
   └───────┴───────┘
         Reads
```

### 3. Database Sharding

Partition data across multiple databases.

```
User ID: 12345
Shard = hash(12345) % 4 = 1

Shard 0        Shard 1        Shard 2        Shard 3
Users 0,4,8    Users 1,5,9    Users 2,6,10   Users 3,7,11
   ...            ...            ...            ...
```

**Sharding Strategies**:
- **Hash-based**: hash(key) % num_shards
- **Range-based**: A-M on shard1, N-Z on shard2
- **Geographic**: Users by region
- **Tenant-based**: Each customer on own shard

### 4. Caching

Reduce database load with in-memory cache.

```
Request Flow:
1. Check cache → HIT → Return cached data
       │
       └── MISS
              │
              ▼
2. Query database
3. Store in cache
4. Return data
```

**Caching Layers**:
```
┌─────────────────────────────────────────────────────┐
│ L1: Browser Cache (client-side)                     │
├─────────────────────────────────────────────────────┤
│ L2: CDN Cache (edge)                                │
├─────────────────────────────────────────────────────┤
│ L3: Application Cache (Redis/Memcached)             │
├─────────────────────────────────────────────────────┤
│ L4: Database Cache (query cache)                    │
└─────────────────────────────────────────────────────┘
```

### 5. Asynchronous Processing

Handle spikes with message queues.

```
Synchronous (blocks):
User → API → Process → DB → Response

Asynchronous (returns immediately):
User → API → Queue → Response
               │
               ▼ (async)
           Worker → DB
```

### 6. CDN (Content Delivery Network)

Serve static content from edge locations.

```
Without CDN:
User (Tokyo) ──────────────────► Server (New York)
              Long distance, slow

With CDN:
User (Tokyo) ──► CDN Edge (Tokyo) ──► Server (New York)
              Fast!            Only if cache miss
```

---

## 📈 Scaling Strategies by Component

### Scaling the Web Layer

```
Strategy: Stateless servers + Load balancer

┌──────────┐
│    LB    │
└────┬─────┘
  ┌──┴──┐
  ▼     ▼
┌───┐ ┌───┐   Stateless!
│ S │ │ S │   Any server can
└───┘ └───┘   handle any request

Session data stored externally (Redis)
```

### Scaling the Database Layer

```
Read-heavy:    Add read replicas
Write-heavy:   Shard the database
Both:          Combination + caching

Evolution:
1. Single DB
2. Primary + Replicas
3. Sharded Primary + Replicas per shard
4. Multi-region clusters
```

### Scaling the Cache Layer

```
Single Cache:
┌───────────────┐
│    Redis      │
└───────────────┘

Clustered Cache:
┌───────┐ ┌───────┐ ┌───────┐
│Redis 1│ │Redis 2│ │Redis 3│
└───────┘ └───────┘ └───────┘
    └─────────┴─────────┘
       Consistent Hashing
```

---

## ⚠️ Scalability Challenges

### 1. Stateful Services

```
Problem: Server stores user session
         User routed to different server → Lost state

Solutions:
├── Sticky sessions (route same user to same server)
├── External session store (Redis)
└── Stateless design (JWT tokens)
```

### 2. Database Bottlenecks

```
Symptoms:
├── Slow queries
├── Connection pool exhaustion
├── High CPU on DB server

Solutions:
├── Query optimization
├── Indexing
├── Read replicas
├── Caching
├── Sharding
└── Switch to appropriate DB type
```

### 3. Hotspots

```
Problem: Uneven load distribution

Celebrity with 100M followers posts
└─► All reads hit same shard

Solutions:
├── Add redundant copies for hot data
├── Use cache more aggressively
└── Distribute across more shards
```

### 4. Cross-Shard Operations

```
Problem: Query needs data from multiple shards

"SELECT * FROM orders WHERE user_id IN (1, 5, 9)"
                                          │
        ┌─────────────────────────────────┘
        ▼
Shard 0: user 1
Shard 1: user 5
Shard 2: user 9

Solutions:
├── Query all shards in parallel
├── Scatter-gather pattern
└── Denormalize to avoid cross-shard
```

---

## 📊 Scaling Numbers

### Quick Estimation Guide

| Component | Single Instance | Scaled |
|-----------|----------------|--------|
| Web Server | ~1K RPS | ~50K RPS (50 servers) |
| MySQL | ~5K RPS | ~100K RPS (sharded) |
| Redis | ~100K RPS | ~1M RPS (clustered) |
| Elasticsearch | ~10K RPS | ~100K RPS (clustered) |

### Traffic Examples

| Scale | Example | Architecture |
|-------|---------|--------------|
| Small | Blog | 1 server, 1 DB |
| Medium | Startup | LB + 3 servers + DB + Cache |
| Large | Twitter | Thousands of servers, multiple DCs |
| Massive | Google | Millions of servers, custom everything |

---

## 🛠️ Auto-Scaling

### Horizontal Auto-Scaling

```python
# Pseudo-code for auto-scaling policy
def check_scaling():
    cpu_usage = get_average_cpu()
    
    if cpu_usage > 80%:
        add_instances(2)
    elif cpu_usage < 30% and instance_count > min_instances:
        remove_instances(1)
```

### Scaling Metrics

```
Scale based on:
├── CPU utilization
├── Memory usage
├── Request queue length
├── Request latency
├── Custom application metrics
└── Time of day (predictive)
```

---

## 💡 Interview Tips

### Questions to Ask
1. What's the expected user growth?
2. What's the read:write ratio?
3. Are there traffic spikes (e.g., events)?
4. What's the data growth rate?
5. What's the latency budget?

### Points to Discuss
1. Start simple, scale as needed
2. Identify bottlenecks first
3. Scale the right component
4. Consider cost implications
5. Plan for failure during scaling

---

## ✅ Key Takeaways

1. **Scale what matters** - Identify bottlenecks first
2. **Horizontal > Vertical** - For true scalability
3. **Stateless is key** - Enables easy horizontal scaling
4. **Cache aggressively** - Reduce database load
5. **Shard when necessary** - But it adds complexity
6. **Async for spikes** - Queue work, process later
7. **Monitor and measure** - Can't improve what you don't measure
