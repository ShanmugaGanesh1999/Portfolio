# Databases

> Storing and querying data at scale

---

## 📖 What is a Database?

A **Database** is an organized collection of data that can be easily accessed, managed, and updated. It's the heart of almost every application.

---

## 📊 Types of Databases

### SQL (Relational) Databases

```
Organized in tables with rows and columns
Strict schema, ACID compliant

┌────────────────────────────────────────────┐
│                   Users                     │
├──────┬──────────┬────────────┬─────────────┤
│  id  │   name   │   email    │  created_at │
├──────┼──────────┼────────────┼─────────────┤
│  1   │  Alice   │ a@mail.com │ 2024-01-01  │
│  2   │  Bob     │ b@mail.com │ 2024-01-02  │
└──────┴──────────┴────────────┴─────────────┘
```

**Examples**: PostgreSQL, MySQL, Oracle, SQL Server

**Best for**:
- Complex queries with JOINs
- Transactions (banking, e-commerce)
- Structured data with relationships
- Data integrity is critical

### NoSQL Databases

#### Document Stores

```json
{
  "_id": "user_123",
  "name": "Alice",
  "email": "a@mail.com",
  "orders": [
    {"id": "ord_1", "total": 99.99},
    {"id": "ord_2", "total": 149.99}
  ]
}
```

**Examples**: MongoDB, CouchDB

**Best for**: Flexible schema, embedded documents, rapid development

#### Key-Value Stores

```
Key              Value
─────────────────────────────────────
user:123         {"name": "Alice", "email": "..."}
session:abc      {"user_id": 123, "expires": ...}
cache:home       "<html>...</html>"
```

**Examples**: Redis, DynamoDB, Memcached

**Best for**: Caching, sessions, simple lookups

#### Wide-Column Stores

```
Row Key    │  Column Family: Info    │  Column Family: Activity
───────────┼─────────────────────────┼──────────────────────────
user_123   │  name: Alice            │  login: 2024-01-01
           │  email: a@mail.com      │  purchase: 2024-01-02
```

**Examples**: Cassandra, HBase, ScyllaDB

**Best for**: Time-series, write-heavy workloads, large scale

#### Graph Databases

```
    (Alice)──FOLLOWS──▶(Bob)
       │                 │
    LIKES              POSTED
       │                 │
       ▼                 ▼
    (Photo1)         (Photo2)
```

**Examples**: Neo4j, Amazon Neptune

**Best for**: Social networks, recommendations, fraud detection

---

## 🔄 SQL vs NoSQL

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Schema | Fixed | Flexible |
| Scaling | Vertical (mostly) | Horizontal |
| Transactions | ACID | BASE (usually) |
| Joins | Built-in | Application-level |
| Query Language | SQL | Varies |
| Data Model | Tables | Document/Key-Value/Graph |
| Consistency | Strong | Often eventual |

### When to Use SQL

```
✓ Complex relationships between entities
✓ Need for ACID transactions
✓ Structured data that rarely changes
✓ Complex queries with aggregations
✓ Data integrity is critical
```

### When to Use NoSQL

```
✓ Rapid iteration, schema changes
✓ Massive scale (millions of RPS)
✓ Flexible or hierarchical data
✓ Geographic distribution
✓ High write throughput
```

---

## 📈 Database Scaling

### Vertical Scaling (Scale Up)

```
Before:              After:
┌─────────┐          ┌─────────────┐
│ 4 CPU   │          │ 64 CPU      │
│ 16GB RAM│   ──►    │ 512GB RAM   │
│ 500GB   │          │ 10TB SSD    │
└─────────┘          └─────────────┘

Pros: Simple, no code changes
Cons: Hardware limits, expensive, downtime
```

### Horizontal Scaling (Scale Out)

```
┌─────────┐     ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Single │     │  Shard  │ │  Shard  │ │  Shard  │
│    DB   │ ──► │    1    │ │    2    │ │    3    │
└─────────┘     └─────────┘ └─────────┘ └─────────┘

Pros: Near-infinite scale
Cons: Complex, cross-shard queries hard
```

---

## 🔄 Replication

### Primary-Replica (Master-Slave)

```
         Writes
            │
            ▼
       ┌────────┐
       │Primary │
       │   DB   │
       └────┬───┘
     ┌──────┼──────┐
     ▼      ▼      ▼
  ┌─────┐┌─────┐┌─────┐
  │Read ││Read ││Read │
  │Rep 1││Rep 2││Rep 3│
  └─────┘└─────┘└─────┘
     ▲      ▲      ▲
     └──────┴──────┘
         Reads
```

**Benefits**:
- Scale reads by adding replicas
- Failover if primary dies
- Geographic distribution

**Challenges**:
- Replication lag (stale reads)
- Single write bottleneck

### Synchronous vs Asynchronous Replication

```
Synchronous:
Write ──► Primary ──► Wait for replicas ──► ACK
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 Replica 1    Replica 2

Pros: No data loss
Cons: Higher latency

Asynchronous:
Write ──► Primary ──► ACK (immediate)
               │
               └────► Replicate in background

Pros: Lower latency
Cons: Potential data loss on failure
```

---

## 🗂️ Partitioning (Sharding)

### Why Shard?

```
Single DB limits:
├── Storage: Can't fit all data
├── Write throughput: Single point bottleneck
├── Query performance: Too much data to scan
└── Availability: Single point of failure
```

### Sharding Strategies

#### Hash-Based Sharding

```python
shard = hash(user_id) % num_shards

user_123 → hash(123) % 4 = 3 → Shard 3
user_456 → hash(456) % 4 = 0 → Shard 0
```

**Pros**: Even distribution
**Cons**: Resharding is expensive

#### Range-Based Sharding

```
Shard 1: Users A-G
Shard 2: Users H-N
Shard 3: Users O-T
Shard 4: Users U-Z
```

**Pros**: Range queries efficient
**Cons**: Hotspots (popular ranges)

#### Geographic Sharding

```
Shard US: All US users
Shard EU: All EU users
Shard Asia: All Asia users
```

**Pros**: Data locality, compliance
**Cons**: Uneven distribution

### Sharding Challenges

```
1. Cross-shard queries
   Query needs data from multiple shards
   Solution: Scatter-gather, denormalization

2. Cross-shard transactions
   ACID across shards is hard
   Solution: Sagas, eventual consistency

3. Resharding
   Adding/removing shards is complex
   Solution: Consistent hashing

4. Hotspots
   Some shards get more traffic
   Solution: Better partition key, more shards
```

---

## 🔒 ACID Properties

```
A - Atomicity
    All operations succeed or all fail
    No partial updates

C - Consistency
    Database moves from one valid state to another
    Constraints always satisfied

I - Isolation
    Concurrent transactions don't interfere
    Each sees consistent view

D - Durability
    Once committed, data persists
    Survives crashes
```

### ACID Example

```sql
-- Transfer $100 from Account A to Account B
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;

-- Either both happen or neither
-- Never in inconsistent state
```

---

## 🌐 BASE Properties

```
B - Basically Available
    System always responds (might be stale)

A - Soft state
    State may change over time (even without input)

E - Eventually consistent
    System will become consistent given time
```

### ACID vs BASE

| ACID | BASE |
|------|------|
| Strong consistency | Eventual consistency |
| Pessimistic | Optimistic |
| Lower availability | Higher availability |
| Vertical scaling | Horizontal scaling |
| Banking | Social media |

---

## 📊 Database Indexes

### What is an Index?

```
Without Index:
Query: SELECT * FROM users WHERE email = 'alice@mail.com'
Process: Scan ALL rows (slow!)

With Index:
Index: email → row_id
Query: Look up in index → Go directly to row (fast!)
```

### Index Types

```
B-Tree Index (default):
├── Good for: range queries, sorting
├── Example: WHERE age > 25 AND age < 35

Hash Index:
├── Good for: exact matches only
├── Example: WHERE id = 123

Full-Text Index:
├── Good for: text search
├── Example: WHERE content LIKE '%search term%'

Composite Index:
├── Good for: queries on multiple columns
├── Example: INDEX(user_id, created_at)
```

### Index Trade-offs

```
Pros:
├── Faster reads
├── Faster sorts
└── Faster joins

Cons:
├── Slower writes (index must be updated)
├── Storage overhead
└── Maintenance cost
```

---

## 💾 Database Selection Guide

| Use Case | Database | Why |
|----------|----------|-----|
| E-commerce orders | PostgreSQL | ACID transactions |
| User sessions | Redis | Fast, ephemeral |
| Product catalog | MongoDB | Flexible schema |
| Analytics | ClickHouse | Column-oriented |
| Social graph | Neo4j | Relationship queries |
| Time-series metrics | TimescaleDB | Time-based queries |
| Chat messages | Cassandra | Write-heavy, distributed |

---

## 💡 Databases in System Design

### Questions to Consider

```
1. What's the data model?
   └─► Structured (SQL) or flexible (NoSQL)?

2. What's the read:write ratio?
   └─► Read-heavy: replicas, caching
   └─► Write-heavy: sharding, Cassandra

3. What's the consistency requirement?
   └─► Strong: SQL with transactions
   └─► Eventual: NoSQL acceptable

4. What's the scale?
   └─► < 1TB: Single instance works
   └─► > 10TB: Consider sharding

5. What queries are needed?
   └─► Complex JOINs: SQL
   └─► Simple lookups: Key-Value
   └─► Full-text: Elasticsearch
```

### Example Design Statement

```
"For our chat application:

1. Messages: Cassandra
   - Write-heavy (millions of messages/day)
   - Partitioned by conversation_id
   - Eventually consistent is acceptable

2. User profiles: PostgreSQL
   - Structured data with relationships
   - Need ACID for account changes
   - Read replicas for scaling

3. Recent messages cache: Redis
   - Sub-millisecond latency
   - TTL-based expiration
   - Reduce Cassandra load"
```

---

## ✅ Key Takeaways

1. **Choose based on use case** - No one-size-fits-all
2. **SQL for relationships and transactions** - ACID when needed
3. **NoSQL for scale and flexibility** - When schema changes often
4. **Replication for read scaling** - Master + read replicas
5. **Sharding for write scaling** - But adds complexity
6. **Indexes speed up reads** - But slow down writes
7. **Consider multiple databases** - Right tool for each job

---

## 📖 Next Steps

→ Continue to [Key-Value Stores](./04-key-value-stores.md)
