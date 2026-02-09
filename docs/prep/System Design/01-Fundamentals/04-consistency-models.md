# Consistency Models

> Understanding data consistency in distributed systems

---

## 📖 What is Consistency?

**Consistency** defines the rules about when and how updates to data become visible to readers in a distributed system.

When you have data replicated across multiple nodes, the fundamental question is:
> "When I read data, what guarantees do I have about what I'll see?"

---

## 🎯 Why Consistency Matters

### The Challenge

```
Time: T1
┌─────────────────────────────────────────────────┐
│  User writes X = 5 to Node A                    │
│  Node A: X = 5                                  │
│  Node B: X = ?  (old value or 5?)               │
│  Node C: X = ?  (old value or 5?)               │
└─────────────────────────────────────────────────┘

Time: T2
┌─────────────────────────────────────────────────┐
│  User reads X from Node B                       │
│  What value should they see?                    │
└─────────────────────────────────────────────────┘
```

Different consistency models give different answers.

---

## 📊 The Consistency Spectrum

```
Strong ◄─────────────────────────────────────────► Weak
                                                    
Linearizable → Sequential → Causal → Eventual
     ▲                                    ▲
     │                                    │
  Easiest to                          Fastest
  reason about                        performance
```

---

## 🔧 Consistency Models Explained

### 1. Strong Consistency (Linearizability)

**Guarantee**: All reads return the most recent write. The system behaves as if there's only one copy of the data.

```
Timeline:
├─────────────────────────────────────────────────►
│
│  Write(X=5)      Read(X)
│  ────┬────       ────┬────
│      │               │
│      ▼               ▼
│   X = 5    ─────►  Returns 5 (guaranteed!)
```

**Characteristics**:
- Every read sees the latest write
- All operations appear instantaneous
- Total ordering of all operations

**Pros**:
- Simplest to reason about
- No stale reads
- Predictable behavior

**Cons**:
- High latency (coordination required)
- Lower availability (CAP theorem)
- Doesn't scale well geographically

**Use Cases**:
- Financial transactions
- Inventory management
- Leader election

**Implementation**:
- Single leader with synchronous replication
- Consensus protocols (Paxos, Raft)

---

### 2. Sequential Consistency

**Guarantee**: Operations appear in some sequential order, and each process's operations appear in program order.

```
Process A: Write(X=1) → Write(X=2)
Process B: Read(X) → Read(X)

Valid: B reads 1, then 2
Valid: B reads 2, then 2
Invalid: B reads 2, then 1 (violates order)
```

**Characteristics**:
- Global ordering of operations
- Respects per-process ordering
- Different processes may see operations at different times

**Difference from Linearizability**:
- Doesn't require real-time ordering
- Weaker guarantee, but still strong

---

### 3. Causal Consistency

**Guarantee**: Causally related operations are seen in the same order by all nodes.

```
Causally Related:
A: Write(X=1)
A: Write(Y=X+1)  ← Depends on X, so causally related

Independent:
A: Write(X=1)
B: Write(Z=5)    ← No relationship, can be reordered
```

**Example - Social Media Comments**:
```
User A posts: "What's the weather?"
User B replies: "It's sunny!"

All users must see the question before the answer.
But concurrent posts by C and D can appear in any order.
```

**Characteristics**:
- Preserves cause-effect relationships
- Allows concurrent operations to be reordered
- Stronger than eventual, weaker than sequential

**Implementation**:
- Vector clocks
- Logical timestamps

---

### 4. Eventual Consistency

**Guarantee**: If no new updates are made, eventually all replicas will converge to the same value.

```
Write X = 5 to Node A
├────────────────────────────────────────►
│                                    Time
│  Node A: 5     5     5     5     5
│  Node B: -     -     5     5     5
│  Node C: -     -     -     5     5
│                            ▲
│                    Eventually consistent
```

**Characteristics**:
- Highest availability
- Lowest latency
- Temporary inconsistencies are possible
- No guarantees on convergence time

**Pros**:
- High performance
- High availability
- Works across regions

**Cons**:
- Complex application logic
- Conflict resolution needed
- Unpredictable read results

**Use Cases**:
- Social media likes/views
- DNS propagation
- Shopping cart (merge conflicts)
- Session stores

---

## 🎨 Consistency Model Comparison

| Model | Guarantee | Latency | Availability | Use Case |
|-------|-----------|---------|--------------|----------|
| **Strong** | Latest value always | High | Lower | Banking |
| **Sequential** | Ordered operations | Medium | Medium | Distributed locks |
| **Causal** | Cause-effect ordering | Medium | Medium | Social feeds |
| **Eventual** | Converges eventually | Low | Highest | Likes, views |

---

## ⚖️ CAP Theorem

You can only have 2 of 3:

```
        Consistency
           /\
          /  \
         /    \
        /  ??  \
       /________\
Availability    Partition
                Tolerance
```

**In practice** (since partitions are inevitable):
- **CP Systems**: Choose consistency over availability (pause during partition)
- **AP Systems**: Choose availability over consistency (serve stale data)

**Examples**:
- **CP**: MongoDB, HBase, Spanner
- **AP**: Cassandra, DynamoDB, CouchDB

---

## 🔄 Read-Your-Writes Consistency

**Guarantee**: A user always sees their own writes.

```
User A writes a post
User A immediately reads their profile
→ User A MUST see their new post

(Other users might not see it yet - that's OK)
```

**Implementation**:
- Read from the same node that handled the write
- Track version numbers per user
- Use session affinity

---

## 📈 Monotonic Reads

**Guarantee**: Once a user sees a value, they never see an older value.

```
Time: T1  User reads X = 5 from Node A
Time: T2  User reads X = ? from Node B

With Monotonic Reads: X >= 5
Without: X could be 3 (stale)
```

**Implementation**:
- Track highest version seen per user
- Route to same replica
- Quorum reads

---

## 💡 Choosing Consistency Level

### Questions to Ask

1. **What happens if users see stale data?**
   - Annoying but OK → Eventual
   - Causes errors → Strong

2. **What are the latency requirements?**
   - Sub-millisecond → Eventual/Causal
   - Can tolerate delays → Strong

3. **Is data related/ordered?**
   - Comments/replies → Causal
   - Independent counters → Eventual

4. **What's the conflict resolution strategy?**
   - Last-write-wins → Simple eventual
   - Custom merge → CRDT/application logic

---

## 🛠️ Implementation Patterns

### Achieving Strong Consistency

```python
# Synchronous replication
def write(key, value):
    # Write to primary
    primary.write(key, value)
    
    # Wait for all replicas
    for replica in replicas:
        replica.write(key, value)  # Blocks!
    
    return "OK"
```

### Achieving Eventual Consistency

```python
# Asynchronous replication
def write(key, value):
    # Write to primary
    primary.write(key, value)
    
    # Async replicate (don't wait)
    background_task(replicate_to_all, key, value)
    
    return "OK"  # Returns immediately
```

### Tunable Consistency (Quorum)

```python
# W + R > N for strong consistency
# N = 3 replicas
# W = 2 (write to 2 nodes)
# R = 2 (read from 2 nodes)

def write(key, value):
    acks = 0
    for node in nodes:
        if node.write(key, value):
            acks += 1
        if acks >= W:
            return "OK"
```

---

## 📊 Real-World Examples

### DynamoDB
- Configurable: eventual or strong
- Strong reads cost more
- Eventual reads are faster

### Cassandra
- Tunable consistency levels
- `ONE`, `QUORUM`, `ALL`
- Trade-off per query

### Spanner (Google)
- Globally strong consistency
- TrueTime (atomic clocks)
- Higher latency, simpler programming

---

## ✅ Key Takeaways

1. **No free lunch** - Stronger consistency = higher latency
2. **Match consistency to use case** - Don't over-engineer
3. **Understand CAP** - Know what you're giving up
4. **Consider hybrid** - Different consistency for different data
5. **Application logic matters** - Weak consistency needs careful handling

---

## 📖 Next Steps

→ Continue to [Failure Models](./05-failure-models.md)
