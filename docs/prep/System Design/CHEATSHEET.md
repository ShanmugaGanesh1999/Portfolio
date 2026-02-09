# System Design Cheatsheet

> Quick reference for System Design interviews

---

## 🎯 The RESHADED Framework

```
R - Requirements (Functional & Non-Functional)
E - Estimation (Back-of-envelope calculations)
S - Storage Schema (Data models)
H - High-Level Design (Architecture diagram)
A - API Design (Endpoints & contracts)
D - Detailed Design (Deep dive)
E - Evaluation (Trade-offs & bottlenecks)
D - Distinctive Features (Edge cases)
```

---

## 📊 Numbers Everyone Should Know

### Latency Comparisons
| Operation | Time |
|-----------|------|
| L1 cache reference | 0.5 ns |
| L2 cache reference | 7 ns |
| Main memory reference | 100 ns |
| SSD random read | 150 μs |
| HDD seek | 10 ms |
| Send 1KB over 1 Gbps network | 10 μs |
| Round trip within datacenter | 500 μs |
| Round trip cross-continent | 150 ms |

### Storage & Traffic
| Metric | Value |
|--------|-------|
| 1 Million requests/day | ~12 requests/second |
| 1 Billion requests/day | ~12,000 requests/second |
| 1 KB | 1,000 bytes |
| 1 MB | 1,000 KB |
| 1 GB | 1,000 MB |
| 1 TB | 1,000 GB |

### Time Conversions
| Period | Seconds |
|--------|---------|
| 1 day | 86,400 |
| 1 week | 604,800 |
| 1 month | 2.5 million |
| 1 year | 31 million |

---

## 🏗️ Building Blocks Quick Reference

### Load Balancer
```
Purpose: Distribute traffic across servers
Algorithms: Round Robin, Least Connections, IP Hash, Weighted
Layers: L4 (Transport) or L7 (Application)
```

### Database
```
SQL: Strong consistency, ACID, complex queries
NoSQL: Flexible schema, horizontal scaling
- Document: MongoDB, CouchDB
- Key-Value: Redis, DynamoDB
- Wide-Column: Cassandra, HBase
- Graph: Neo4j
```

### Cache
```
Purpose: Reduce latency, reduce DB load
Strategies:
- Cache-aside: App manages cache
- Write-through: Write to cache and DB
- Write-behind: Write to cache, async to DB
Eviction: LRU, LFU, TTL
```

### Message Queue
```
Purpose: Async communication, decoupling
Examples: Kafka, RabbitMQ, SQS
Use cases: Order processing, notifications, event streaming
```

### CDN
```
Purpose: Serve static content closer to users
Types: Push (upload content) vs Pull (cache on request)
Use cases: Images, videos, CSS, JavaScript
```

---

## 📐 Common Patterns

### Scaling Patterns
```
Horizontal Scaling: Add more machines
Vertical Scaling: Upgrade machine resources
Database Sharding: Partition data by key
Read Replicas: Scale read operations
Caching Layers: L1 (local) → L2 (distributed) → L3 (CDN)
```

### Data Partitioning Strategies
```
Hash-based: hash(key) % num_partitions
Range-based: A-M on server1, N-Z on server2
Geographic: Users by region
Consistent Hashing: Minimize redistribution on scaling
```

### Consistency Patterns
```
Strong: All reads return most recent write
Eventual: System converges to consistent state
Causal: Causally related ops appear in order
Read-your-writes: User sees their own writes
```

### Availability Patterns
```
Active-Active: Multiple active nodes serving traffic
Active-Passive: Standby takes over on failure
Master-Slave: One write node, multiple read nodes
Multi-region: Deploy across geographic regions
```

---

## 🔧 Common System Components

### For Real-time Features
```
WebSockets: Bidirectional persistent connection
Server-Sent Events: Server → Client streaming
Long Polling: Client repeatedly polls server
```

### For Search
```
Elasticsearch: Full-text search, analytics
Inverted Index: Map words → documents
Trie: Prefix-based autocomplete
```

### For Unique IDs
```
UUID: 128-bit universally unique
Auto-increment: Simple but doesn't scale
Snowflake: Timestamp + machine ID + sequence
```

### For Rate Limiting
```
Token Bucket: Smooth bursting allowed
Leaky Bucket: Fixed rate output
Fixed Window: Count per time window
Sliding Window: Rolling time window
```

---

## 🎨 Common Design Patterns

### URL Shortener
```
Requirements: Shorten URL, redirect, analytics
Key Design:
- Base62 encoding for short URLs
- Distributed ID generator
- Cache popular URLs
- Analytics via async logging
```

### Chat Application
```
Requirements: 1:1 chat, group chat, online status
Key Design:
- WebSocket for real-time
- Message queue for delivery
- Read receipts via separate channel
- Fan-out for group messages
```

### Social Media Feed
```
Requirements: Post, follow, timeline
Key Design:
- Push model: Fan-out on write
- Pull model: Fan-out on read
- Hybrid: Push for normal users, pull for celebrities
```

### Video Streaming
```
Requirements: Upload, transcode, stream
Key Design:
- Chunked upload
- Async transcoding pipeline
- Adaptive bitrate streaming (HLS/DASH)
- CDN for delivery
```

---

## ⚠️ Common Trade-offs

### CAP Theorem
```
Consistency: All nodes see same data
Availability: Every request gets a response
Partition Tolerance: System works despite network failures

Pick 2: CP or AP (P is non-negotiable in distributed systems)
```

### PACELC Theorem
```
If Partition:
  Choose Availability or Consistency
Else (normal operation):
  Choose Latency or Consistency
```

### SQL vs NoSQL
```
SQL: ACID, complex queries, joins, structured data
NoSQL: Horizontal scale, flexible schema, high throughput

Choose SQL when: Data relationships matter, ACID required
Choose NoSQL when: Scale > consistency, schema flexibility needed
```

---

## 🚨 Red Flags to Avoid

❌ Jumping to solution without clarifying requirements
❌ Not considering scale (users, data, traffic)
❌ Ignoring failure scenarios
❌ Over-engineering simple problems
❌ Not discussing trade-offs
❌ Single points of failure
❌ Not considering security
❌ Forgetting monitoring and logging

---

## ✅ Interview Do's

✔️ Clarify requirements and constraints
✔️ Make reasonable assumptions (and state them)
✔️ Start with high-level design
✔️ Use proper notation in diagrams
✔️ Discuss trade-offs at each decision
✔️ Consider failure modes
✔️ Talk about monitoring and alerts
✔️ Mention security considerations
✔️ Leave time for deep dives

---

## 📝 Quick Estimation Template

```
1. Daily Active Users (DAU): ___
2. Read:Write Ratio: ___:___
3. Average request size: ___ KB
4. Storage per user: ___ MB

Calculations:
- Requests/second = DAU × actions/day / 86,400
- Storage/year = Users × storage/user × 365
- Bandwidth = Requests/sec × request size

Rule of thumb:
- 1M DAU with 10 actions/day = ~115 requests/sec
- Peak traffic = 2-3× average
```
