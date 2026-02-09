# Failure Models in Distributed Systems

> Understanding how systems fail and how to design for resilience

---

## 📖 Why Failure Models Matter

In distributed systems, failures are **not exceptions—they are the norm**.

> "Everything fails, all the time." — Werner Vogels, CTO of Amazon

Understanding failure modes helps you:
- Design resilient systems
- Choose appropriate fault tolerance strategies
- Make trade-offs between complexity and reliability

---

## 🎯 Types of Failures

### The Failure Spectrum

```
Easy to Handle ◄──────────────────────────► Hard to Handle

Crash-Stop → Omission → Timing → Byzantine
    ▲                                  ▲
    │                                  │
 Predictable                      Unpredictable
 (node dies)                   (node lies/corrupts)
```

---

## 📊 Failure Models Explained

### 1. Crash-Stop Failures

**Definition**: A node stops working and never recovers.

```
Normal:    Node A ──────────────────────►
                         
Crashed:   Node A ─────────X (dead forever)
```

**Characteristics**:
- Simplest failure model
- Node either works correctly or is completely dead
- No partial failures or incorrect behavior

**Examples**:
- Server hardware failure
- Process killed by OOM
- Data center power outage

**Detection**:
- Heartbeat timeouts
- Health checks fail

**Handling**:
```python
# Simple retry to another node
def read(key):
    for node in healthy_nodes:
        try:
            return node.read(key)
        except NodeUnreachable:
            mark_unhealthy(node)
    raise AllNodesDown()
```

---

### 2. Crash-Recovery Failures

**Definition**: A node crashes but can recover and resume operation.

```
Normal:    Node A ────────────────────────────►
                         
Crashed:   Node A ───────X     ○───────────────►
                    crash   recovery
                         
           State may be lost between crash and recovery
```

**Characteristics**:
- Node may lose volatile (in-memory) state
- Persistent state survives
- Need to handle recovery scenarios

**Examples**:
- Process restart after crash
- Server reboot
- Container restart

**Challenges**:
- What was the node's last known state?
- Were there uncommitted operations?
- How to rejoin the cluster?

**Handling**:
```python
# Write-Ahead Log for recovery
def write(key, value):
    # 1. Write to persistent log first
    wal.append({"op": "write", "key": key, "value": value})
    wal.flush()
    
    # 2. Apply to in-memory state
    memory[key] = value
    
    return "OK"

def recover():
    # Replay log to rebuild state
    for entry in wal.read_all():
        apply(entry)
```

---

### 3. Omission Failures

**Definition**: Messages are lost (not sent or not received).

```
Send Omission:
    Node A ──(message)──X    Node B
              Lost in sending
              
Receive Omission:  
    Node A ──(message)──────X Node B
                     Lost in receiving
```

**Characteristics**:
- Node is alive but communication fails
- Can be transient or persistent
- Hard to distinguish from slow responses

**Examples**:
- Network packet loss
- Queue overflow
- Firewall blocking

**Handling**:
```python
# Acknowledgment and retry
def send_reliable(node, message):
    for attempt in range(MAX_RETRIES):
        try:
            response = node.send(message, timeout=TIMEOUT)
            if response.ack:
                return response
        except Timeout:
            continue
    raise MessageDeliveryFailed()
```

---

### 4. Timing Failures

**Definition**: Operations complete outside expected time bounds.

```
Expected: ──────[────]────────────────►
                 ↑
            Should complete here
            
Actual:    ─────────────[────]────────►
                           ↑
                    Actually completes here
```

**Characteristics**:
- Node is correct but too slow
- Response arrives after timeout
- Can cause duplicate processing

**Examples**:
- GC pauses in Java
- CPU overload
- Network congestion
- Disk I/O delays

**Danger - Duplicate Processing**:
```
Client ──request──▶ Server
Client ──timeout──┐
Client ──retry────▶ Server
                   (processes twice!)
Server ──response1──▶ (ignored, client gave up)
Server ──response2──▶ Client
```

**Handling**:
```python
# Idempotent operations
def process_request(request):
    request_id = request.idempotency_key
    
    # Check if already processed
    if cache.exists(request_id):
        return cache.get(request_id)
    
    # Process and cache result
    result = do_work(request)
    cache.set(request_id, result, ttl=3600)
    
    return result
```

---

### 5. Byzantine Failures

**Definition**: Node behaves arbitrarily—may lie, send conflicting messages, or act maliciously.

```
Normal:    Node A says X = 5 to everyone

Byzantine: Node A says X = 5 to Node B
           Node A says X = 7 to Node C
           Node A says X = 3 to Node D
```

**Characteristics**:
- Hardest failure model
- Node can be malicious or corrupted
- Can send conflicting information
- Requires special protocols (PBFT)

**Examples**:
- Security breaches
- Hardware memory corruption
- Software bugs causing wrong output
- Malicious actors in public networks

**Handling**:
- Byzantine Fault Tolerant (BFT) protocols
- Need 3f+1 nodes to tolerate f failures
- Used in blockchain systems

```
# Simplified Byzantine voting
def consensus(value):
    votes = collect_votes_from_all_nodes()
    
    # Need > 2/3 agreement
    for candidate in unique(votes):
        if votes.count(candidate) > (2/3 * total_nodes):
            return candidate
    
    raise NoConsensus()
```

---

## 📊 Failure Model Comparison

| Model | Behavior | Detection | Tolerance | Use Case |
|-------|----------|-----------|-----------|----------|
| **Crash-Stop** | Dies permanently | Easy | N/2 nodes | Internal services |
| **Crash-Recovery** | Dies, may restart | Medium | N/2 + logging | Databases |
| **Omission** | Drops messages | Hard | Retries + acks | Networks |
| **Timing** | Slow responses | Medium | Timeouts | Any system |
| **Byzantine** | Arbitrary behavior | Very Hard | N/3 nodes | Blockchain |

---

## 🛠️ Failure Detection

### Heartbeat Mechanism

```python
class HeartbeatMonitor:
    def __init__(self, interval=1, timeout=5):
        self.interval = interval
        self.timeout = timeout
        self.last_seen = {}
    
    def send_heartbeat(self, node):
        while True:
            node.send("ping")
            sleep(self.interval)
    
    def receive_heartbeat(self, node_id):
        self.last_seen[node_id] = now()
    
    def is_alive(self, node_id):
        return now() - self.last_seen[node_id] < self.timeout
```

### Phi Accrual Failure Detector

```
Instead of binary alive/dead:
├── Phi = 0.5  → Probably alive
├── Phi = 1.0  → Uncertain
├── Phi = 2.0  → Probably dead
├── Phi = 5.0  → Almost certainly dead

Adaptive based on historical heartbeat patterns
Used by Cassandra, Akka
```

---

## 🔧 Failure Handling Strategies

### 1. Redundancy

```
┌─────────────────────────────────────┐
│           Load Balancer             │
│               │                     │
│    ┌──────────┼──────────┐          │
│    ▼          ▼          ▼          │
│ Server 1  Server 2  Server 3        │
│    │          │          │          │
│    ▼          ▼          ▼          │
│   DB 1  ◄──► DB 2  ◄──► DB 3        │
│            (replicated)              │
└─────────────────────────────────────┘
```

### 2. Checkpointing

```python
def long_running_job(data):
    checkpoint = load_checkpoint()
    
    for i, item in enumerate(data[checkpoint.index:]):
        process(item)
        
        if i % 1000 == 0:
            save_checkpoint(index=i)
    
    clear_checkpoint()
```

### 3. Circuit Breaker

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=30):
        self.failures = 0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.last_failure = None
    
    def call(self, func, *args):
        if self.state == "OPEN":
            if now() - self.last_failure > self.reset_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitOpenError()
        
        try:
            result = func(*args)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise
    
    def on_success(self):
        self.failures = 0
        self.state = "CLOSED"
    
    def on_failure(self):
        self.failures += 1
        self.last_failure = now()
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"
```

### 4. Bulkhead Pattern

```
┌──────────────────────────────────────────────┐
│                  Application                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Pool A   │  │ Pool B   │  │ Pool C   │   │
│  │ (10 conn)│  │ (10 conn)│  │ (10 conn)│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │          │
│       ▼             ▼             ▼          │
│   Service A    Service B    Service C        │
└──────────────────────────────────────────────┘

If Service A fails, only Pool A is affected.
Services B and C continue working.
```

---

## 💡 Design Principles for Fault Tolerance

### 1. Expect Failures
```
# Instead of
if response:
    process(response)

# Use
try:
    response = service.call(timeout=5)
    process(response)
except Timeout:
    use_cached_value()
except ServiceDown:
    use_fallback()
```

### 2. Fail Fast
```python
def validate_and_process(request):
    # Check quickly if we can proceed
    if not has_capacity():
        raise ServiceOverloaded()  # Fail fast
    
    if not request.is_valid():
        raise InvalidRequest()  # Fail fast
    
    # Only then do expensive work
    return process(request)
```

### 3. Graceful Degradation
```python
def get_recommendations(user_id):
    try:
        # Try personalized recommendations
        return ml_service.recommend(user_id)
    except MLServiceDown:
        # Fall back to popular items
        return cache.get("popular_items")
    except CacheDown:
        # Fall back to static list
        return DEFAULT_RECOMMENDATIONS
```

---

## ✅ Key Takeaways

1. **Failures are inevitable** - Design for them, don't ignore them
2. **Know your failure model** - Different failures need different handling
3. **Detect failures quickly** - Heartbeats, timeouts, monitoring
4. **Isolate failures** - Bulkheads, circuit breakers
5. **Recover gracefully** - Fallbacks, retries, degraded modes
6. **Test failure scenarios** - Chaos engineering, fault injection

---

## 📖 Next Steps

→ Continue to [Non-Functional Requirements](../02-Non-Functional-Requirements/README.md)
