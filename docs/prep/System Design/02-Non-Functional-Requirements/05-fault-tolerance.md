# Fault Tolerance

> Building systems that continue operating despite failures

---

## 📖 What is Fault Tolerance?

**Fault Tolerance** is a system's ability to continue functioning correctly even when some of its components fail.

```
Fault Tolerant System:
Component fails → System continues → User unaffected

Non-Fault Tolerant System:
Component fails → System crashes → User impacted
```

---

## 🎯 Faults vs Failures

| Term | Definition | Example |
|------|------------|---------|
| **Fault** | A component not working correctly | Server disk dies |
| **Error** | Wrong behavior caused by fault | Can't read file |
| **Failure** | System not providing expected service | Website down |

**Goal**: Prevent faults from becoming failures.

```
Fault ──► Error ──► Failure
  │                    │
  └── Fault Tolerance ─┘
       (breaks the chain)
```

---

## 🔧 Fault Tolerance Techniques

### 1. Redundancy

Have backups for critical components.

**Hardware Redundancy**:
```
Single Point of Failure:
[Single Server] ──► If it dies, system dies

Redundant:
[Server 1] ←──┐
              ├── Load Balancer ──► Users
[Server 2] ←──┘
              If one dies, other continues
```

**Data Redundancy**:
```
Primary Database ──► Replica 1
        │
        └──────────► Replica 2
        │
        └──────────► Replica 3

Data on multiple nodes
Survive N-1 failures
```

**Geographic Redundancy**:
```
US-East Region ◄──────► US-West Region
     │                        │
  [Servers]               [Servers]
  [Database] ◄─sync──► [Database]

Survive entire data center failure
```

### 2. Replication

Keep multiple copies of data.

**Synchronous Replication**:
```
Write ──► Primary ──► Wait for replicas ──► ACK
               │
          ┌────┴────┐
          ▼         ▼
       Replica 1  Replica 2

Pros: No data loss
Cons: Higher latency
```

**Asynchronous Replication**:
```
Write ──► Primary ──► ACK (immediate)
               │
               └───► Background replication
                         │
                    ┌────┴────┐
                    ▼         ▼
                 Replica 1  Replica 2

Pros: Lower latency
Cons: Possible data loss on failure
```

### 3. Failover

Automatically switch to backup on failure.

**Active-Passive Failover**:
```
Normal:
Primary ──► Traffic
Standby ──► (idle, receiving replication)

After Primary Failure:
Primary ──X (dead)
Standby ──► Traffic (promoted to primary)
```

**Active-Active Failover**:
```
Normal:
Server A ──► 50% Traffic
Server B ──► 50% Traffic

After A Failure:
Server A ──X (dead)
Server B ──► 100% Traffic
```

### 4. Graceful Degradation

Provide reduced functionality instead of total failure.

```python
def get_product_page(product_id):
    # Core functionality - must work
    product = get_product(product_id)  # From database
    
    # Non-critical - can fail gracefully
    try:
        recommendations = get_recommendations(product_id)
    except ServiceUnavailable:
        recommendations = []  # Show page without recommendations
    
    try:
        reviews = get_reviews(product_id)
    except ServiceUnavailable:
        reviews = None  # Show "Reviews temporarily unavailable"
    
    return render_page(product, recommendations, reviews)
```

### 5. Circuit Breaker

Stop calling failing services.

```
┌─────────────────────────────────────────────────────────────┐
│                    CIRCUIT BREAKER                          │
│                                                              │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐           │
│   │  CLOSED  │────▶│   OPEN   │────▶│HALF-OPEN │           │
│   │          │     │          │     │          │           │
│   │ Normal   │     │ Fail fast│     │  Test    │           │
│   │ operation│     │ (no calls)│    │ a call   │           │
│   └────┬─────┘     └────┬─────┘     └────┬─────┘           │
│        │                │                │                  │
│        │                │                │                  │
│   failures >       timeout           success?               │
│   threshold        expires              │                   │
│                         │         ┌─────┴─────┐            │
│                         │         │           │            │
│                         ▼         ▼           ▼            │
│                      CLOSED    CLOSED       OPEN           │
└─────────────────────────────────────────────────────────────┘
```

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        self.failures = 0
        self.state = "CLOSED"
        self.last_failure_time = None
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
    
    def call(self, func):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitOpenError()
        
        try:
            result = func()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _on_success(self):
        self.failures = 0
        self.state = "CLOSED"
    
    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"
```

### 6. Bulkhead Pattern

Isolate failures to prevent cascade.

```
Without Bulkhead:
┌────────────────────────────────────┐
│         Shared Thread Pool         │
│  [Service A calls] [Service B calls]│
│                                    │
│  If B is slow, all threads blocked │
│  Service A calls also fail!        │
└────────────────────────────────────┘

With Bulkhead:
┌──────────────┐  ┌──────────────┐
│  Pool for A  │  │  Pool for B  │
│  [A calls]   │  │  [B calls]   │
│              │  │              │
│  If B slow,  │  │  Only B pool │
│  A unaffected│  │  is blocked  │
└──────────────┘  └──────────────┘
```

### 7. Timeouts and Retries

Don't wait forever; retry intelligently.

```python
def call_with_retry(func, max_retries=3, base_delay=1):
    """Retry with exponential backoff and jitter"""
    for attempt in range(max_retries):
        try:
            return func()
        except TransientError as e:
            if attempt == max_retries - 1:
                raise
            
            # Exponential backoff with jitter
            delay = base_delay * (2 ** attempt)
            jitter = random.uniform(0, delay * 0.1)
            time.sleep(delay + jitter)
    
    raise MaxRetriesExceeded()
```

**Timeout Best Practices**:
```
Service A ─(timeout: 5s)─► Service B ─(timeout: 3s)─► Service C

Each layer's timeout should be less than the caller's
to allow for error handling and retries
```

---

## 📊 Fault Tolerance Patterns Summary

| Pattern | Use When | Trade-off |
|---------|----------|-----------|
| **Redundancy** | Component failure is common | Cost (more resources) |
| **Replication** | Data loss is unacceptable | Complexity, latency |
| **Failover** | Need automatic recovery | Failover delay |
| **Graceful Degradation** | Some features can fail | Reduced functionality |
| **Circuit Breaker** | Dependent services fail | Temporarily unavailable |
| **Bulkhead** | Isolate failure domains | Resource partitioning |
| **Timeout/Retry** | Transient failures occur | Increased latency |

---

## 🎨 Real-World Example: Netflix

Netflix's fault tolerance strategy:

```
┌─────────────────────────────────────────────────────────────┐
│                    Netflix Architecture                      │
│                                                              │
│  Hystrix (Circuit Breaker)                                  │
│  ├── Every service call wrapped                             │
│  ├── Fast failure when downstream is slow                   │
│  └── Fallbacks for degraded experience                      │
│                                                              │
│  Chaos Monkey (Fault Injection)                             │
│  ├── Randomly kills production instances                    │
│  ├── Forces teams to build resilient systems                │
│  └── Failures become non-events                             │
│                                                              │
│  Multi-Region Deployment                                    │
│  ├── Active in multiple AWS regions                         │
│  ├── Traffic shifts if region has issues                    │
│  └── Can evacuate entire regions                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Designing for Fault Tolerance

### Questions to Ask

1. **What can fail?**
   - Hardware, network, software, humans

2. **What's the impact of each failure?**
   - Critical path vs nice-to-have

3. **How do we detect failures?**
   - Health checks, monitoring, alerts

4. **How do we recover?**
   - Automatic failover, manual intervention

5. **How do we prevent cascade?**
   - Isolation, circuit breakers

### Design Process

```
1. Identify failure modes
   └─► List all components that can fail

2. Assess impact
   └─► Rank by severity and likelihood

3. Design mitigation
   └─► Apply appropriate patterns

4. Test failures
   └─► Chaos engineering, fault injection

5. Monitor and iterate
   └─► Track incidents, improve
```

---

## 🧪 Testing Fault Tolerance

### Chaos Engineering

Deliberately inject failures to test resilience.

```
Chaos Engineering Steps:
1. Define steady state (normal behavior)
2. Hypothesize: system will remain stable
3. Inject failure (kill server, network latency, etc.)
4. Observe behavior
5. Fix if hypothesis is wrong
```

### Types of Fault Injection

| Type | Example | Tests |
|------|---------|-------|
| **Instance** | Kill random server | Auto-scaling, failover |
| **Network** | Add latency, drop packets | Timeout handling |
| **Dependency** | Make database slow | Circuit breakers |
| **Resource** | Fill disk, exhaust memory | Resource limits |
| **Time** | Clock skew | Time-sensitive logic |

---

## ⚠️ Common Mistakes

### 1. Retry Storm

```
Problem:
Service down → All clients retry → Massive spike
              → Service overloaded → Stays down

Solution:
├── Exponential backoff
├── Jitter (random delay)
├── Circuit breaker
└── Retry budget (max retries per time window)
```

### 2. Ignoring Partial Failures

```
Problem:
3 out of 5 DB writes succeed
Transaction left in inconsistent state

Solution:
├── Transactions (all or nothing)
├── Sagas with compensating actions
└── Idempotent operations
```

### 3. Single Points of Failure

```
Hidden SPOFs:
├── "Highly available" database with single master
├── Load balancer (who balances the balancer?)
├── Configuration server
├── DNS
└── The one person who knows the system
```

---

## 💡 Interview Tips

### When Discussing Fault Tolerance

1. **Identify failure points**
   - "What happens if this component fails?"

2. **Explain mitigation**
   - "We use replication for data redundancy"
   - "Circuit breakers prevent cascade"

3. **Discuss trade-offs**
   - Consistency vs availability
   - Complexity vs resilience

4. **Mention monitoring**
   - "We detect failures through health checks"
   - "Alerts trigger automatic failover"

---

## ✅ Key Takeaways

1. **Failures are inevitable** - Design for them
2. **Redundancy is key** - No single points of failure
3. **Detect fast** - Quick detection enables quick recovery
4. **Fail gracefully** - Degraded service > no service
5. **Isolate failures** - Prevent cascade with bulkheads
6. **Test failures** - Chaos engineering in production
7. **Automate recovery** - Manual intervention is slow

---

## 📖 Next Steps

→ Continue to [Estimation](../03-Estimation/README.md)
