# Sequencer (Unique ID Generator)

> Generating unique identifiers in distributed systems

---

## 📖 What is a Sequencer?

A **Sequencer** (or ID Generator) creates unique identifiers for objects across a distributed system. Every tweet, order, user, and message needs a unique ID.

---

## 🎯 Requirements for Unique IDs

```
Must Have:
├── Uniqueness: No collisions ever
├── Available: High throughput
└── Scalable: Work across many servers

Nice to Have:
├── Sortable: IDs roughly in order by time
├── Compact: Reasonable size
└── Unpredictable: Hard to guess (security)
```

---

## 📊 ID Generation Strategies

### 1. Auto-Increment (Single Database)

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,  -- Auto-increment
    ...
);
-- IDs: 1, 2, 3, 4, 5, ...
```

**Pros**:
- Simple
- Sortable
- Compact

**Cons**:
- Single point of failure
- Doesn't scale horizontally
- Predictable (security risk)

### 2. UUID (Universally Unique Identifier)

```
Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Example: 550e8400-e29b-41d4-a716-446655440000
Size: 128 bits (36 characters with hyphens)
```

```python
import uuid
id = uuid.uuid4()  # Random UUID
```

**Pros**:
- Simple to generate
- No coordination needed
- Globally unique

**Cons**:
- 128 bits is large
- Not sortable (random)
- Poor database index performance

### 3. Snowflake ID (Twitter)

```
┌─────────────────────────────────────────────────────────────┐
│                     64-bit Snowflake ID                      │
├──────────────────┬────────────┬──────────────┬──────────────┤
│   Timestamp      │ Datacenter │   Machine    │   Sequence   │
│   (41 bits)      │  (5 bits)  │   (5 bits)   │  (12 bits)   │
└──────────────────┴────────────┴──────────────┴──────────────┘

41 bits timestamp: ~69 years of milliseconds
 5 bits datacenter: 32 datacenters
 5 bits machine: 32 machines per datacenter
12 bits sequence: 4096 IDs per millisecond per machine
```

**Example**:
```python
def generate_snowflake_id():
    timestamp = current_millis() - EPOCH  # Custom epoch
    datacenter_id = 1
    machine_id = 5
    sequence = get_next_sequence()  # 0-4095, resets each ms
    
    id = (timestamp << 22) | (datacenter_id << 17) | \
         (machine_id << 12) | sequence
    return id

# Result: 175928847299117063
```

**Pros**:
- Time-sortable
- 64 bits (fits in long)
- No coordination between machines
- 4M IDs/sec per machine

**Cons**:
- Clock sync required
- Clock going backward is problematic

### 4. ULID (Universally Unique Lexicographically Sortable ID)

```
Format: 01ARZ3NDEKTSV4RRFFQ69G5FAV
Size: 128 bits (26 characters)

┌─────────────────┬──────────────────────────┐
│   Timestamp     │      Randomness          │
│   (48 bits)     │      (80 bits)           │
└─────────────────┴──────────────────────────┘
```

**Pros**:
- Sortable by creation time
- Case-insensitive
- URL safe

**Cons**:
- Larger than Snowflake
- Random component adds entropy

### 5. Database Ticket Server

```
┌─────────────────────────────────────────────┐
│           Ticket Server (Primary)            │
│                                             │
│   REPLACE INTO tickets (stub) VALUES ('a')  │
│   SELECT LAST_INSERT_ID()                   │
│                                             │
│   Returns: 1, 2, 3, 4, 5, ...               │
└─────────────────────────────────────────────┘
```

**Flickr Approach** (two servers):
```
Server A: 1, 3, 5, 7, 9, ...  (odd)
Server B: 2, 4, 6, 8, 10, ... (even)

IDs unique across servers
```

**Pros**:
- Guaranteed unique
- Simple to understand
- Numeric IDs

**Cons**:
- Ticket server is SPOF
- Network latency for each ID

---

## 🔧 Designing a Distributed ID Generator

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ID Generator Service                      │
│                                                              │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│   │  Worker 1   │   │  Worker 2   │   │  Worker 3   │      │
│   │  ID: 001    │   │  ID: 002    │   │  ID: 003    │      │
│   └─────────────┘   └─────────────┘   └─────────────┘      │
│                                                              │
│   Each worker generates IDs independently                    │
│   Worker ID embedded in generated ID                         │
└─────────────────────────────────────────────────────────────┘
```

### Clock Synchronization

```
Problem: Snowflake depends on timestamps

Scenarios:
├── Clock skew: Machines have different times
├── Clock backward: NTP adjustment moves time back
└── Clock failure: Time becomes unreliable

Solutions:
├── NTP sync all machines
├── Wait when clock goes backward
├── Reject requests if clock way off
└── Use logical clocks instead
```

### High Availability

```
Multiple ID generators with unique machine IDs:

Zone A:          Zone B:
├── Gen 1        ├── Gen 5
├── Gen 2        ├── Gen 6
├── Gen 3        ├── Gen 7
└── Gen 4        └── Gen 8

Any generator can create IDs
Load balanced across zones
```

---

## 📊 Comparison of Strategies

| Strategy | Sortable | Size | Coordination | Throughput |
|----------|----------|------|--------------|------------|
| Auto-increment | Yes | 32/64 bits | High (single DB) | Low |
| UUID | No | 128 bits | None | High |
| Snowflake | Yes | 64 bits | Low (clock sync) | Very High |
| ULID | Yes | 128 bits | None | High |
| Ticket Server | Yes | 32/64 bits | Medium | Medium |

---

## ⚡ Performance Considerations

### Batch Allocation

```python
# Instead of requesting one ID at a time
# Request a batch and allocate locally

class IDAllocator:
    def __init__(self, batch_size=1000):
        self.current_id = 0
        self.max_id = 0
        self.batch_size = batch_size
    
    def get_id(self):
        if self.current_id >= self.max_id:
            self.fetch_batch()
        
        id = self.current_id
        self.current_id += 1
        return id
    
    def fetch_batch(self):
        start = ticket_server.get_next_batch(self.batch_size)
        self.current_id = start
        self.max_id = start + self.batch_size
```

### Pre-generation

```
Generate IDs ahead of time:

Background thread:
├── Generate 10,000 IDs
├── Store in queue
└── Refill when low

Request thread:
└── Pull from queue (instant)
```

---

## 💡 ID Design Patterns

### Tweet ID (Twitter/X)

```
Snowflake-based:
├── Time-sortable (newest tweets have higher IDs)
├── 64-bit integer
├── ~5M tweets per second capacity
└── Unique across all datacenters
```

### Order ID (E-commerce)

```
Format: ORD-2024-ABCD1234

Components:
├── Prefix: Type identifier (ORD)
├── Year: For partitioning
├── Random: Unique part
└── Check digit: Validation

Why? Human-readable, easy to communicate
```

### Short URL ID (TinyURL)

```
Base62 encoded counter:
Counter: 12345 → Base62: "dnh"

Characters: a-z, A-Z, 0-9 (62 chars)
6 chars: 62^6 = 56.8 billion URLs
7 chars: 62^7 = 3.5 trillion URLs
```

---

## 🔒 Security Considerations

```
Auto-increment dangers:
├── Competitor can estimate your volume
├── Easy to scrape: /users/1, /users/2, ...
├── Information leakage

Solutions:
├── Random IDs (UUID)
├── Encrypted sequential IDs
├── Hash-based obfuscation
└── Use random for external, sequential for internal
```

---

## 💡 In System Design Interviews

### When to Discuss

```
1. "How do we generate unique IDs for tweets?"
   → Snowflake (time-sortable, 64-bit)

2. "How do we create short URLs?"
   → Base62 encoded counter or hash

3. "How do we identify distributed transactions?"
   → UUID or Snowflake with causality tracking

4. "How do we order messages in a chat?"
   → Snowflake (sortable) or vector clocks (causality)
```

### Key Points to Mention

```
├── Why auto-increment won't work (SPOF)
├── Why UUID might be too large
├── Snowflake structure and benefits
├── Clock synchronization challenges
├── Trade-offs between approaches
```

---

## ✅ Key Takeaways

1. **Auto-increment doesn't scale** - Single point of failure
2. **UUID is simple but large** - 128 bits, not sortable
3. **Snowflake is the gold standard** - 64-bit, sortable, distributed
4. **Clock sync is critical** - For time-based IDs
5. **Embed machine ID** - Avoid coordination
6. **Consider security** - Don't leak information via IDs
7. **Match ID to use case** - Sortability, size, readability

---

## 📖 Next Steps

→ Continue to [Distributed Cache](./07-distributed-cache.md)
