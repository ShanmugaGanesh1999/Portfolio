# Availability

> Ensuring systems are accessible when users need them

---

## 📖 What is Availability?

**Availability** is the percentage of time a system is operational and accessible to users.

```
                 Uptime
Availability = ─────────────────
               Uptime + Downtime
```

---

## 📊 The Nines of Availability

| Availability | Downtime/Year | Downtime/Month | Downtime/Day |
|--------------|---------------|----------------|--------------|
| 99% (two nines) | 3.65 days | 7.3 hours | 14.4 min |
| 99.9% (three nines) | 8.76 hours | 43.8 min | 1.44 min |
| 99.99% (four nines) | 52.6 min | 4.38 min | 8.6 sec |
| 99.999% (five nines) | 5.26 min | 26.3 sec | 0.86 sec |

---

## 🎯 Availability in Practice

### Real-World Targets

| Service | Target | Why |
|---------|--------|-----|
| AWS S3 | 99.99% | Critical data storage |
| Google Search | 99.99% | Revenue per second |
| Netflix | 99.9% | User experience |
| Internal tools | 99% | Lower cost, acceptable |
| Payment systems | 99.99%+ | Financial impact |

### SLA vs SLO vs SLI

```
SLI (Indicator): What we measure
  └─► Example: Request success rate

SLO (Objective): What we target internally
  └─► Example: 99.9% success rate

SLA (Agreement): What we promise customers
  └─► Example: 99.5% uptime or credits issued
```

---

## 🔧 Achieving High Availability

### 1. Eliminate Single Points of Failure (SPOF)

```
Bad (SPOF):
User → Single Server → Single Database

Good (Redundant):
User → Load Balancer → [Server 1, Server 2, Server 3]
                           ↓
                    [Primary DB ↔ Replica DB]
```

### 2. Redundancy Patterns

**Active-Active**:
```
┌─────────────────────────────────────┐
│            Load Balancer            │
│         ┌────────┴────────┐         │
│         ▼                 ▼         │
│     Server A          Server B      │
│    (handling          (handling     │
│     traffic)          traffic)      │
└─────────────────────────────────────┘
Both active, traffic split 50/50
Failure: Other takes 100% load
```

**Active-Passive**:
```
┌─────────────────────────────────────┐
│            Load Balancer            │
│                 │                   │
│                 ▼                   │
│     Server A (active)               │
│         │                           │
│         ├─── heartbeat ───┐         │
│                           ▼         │
│               Server B (standby)    │
└─────────────────────────────────────┘
A handles traffic, B is standby
Failure: B promoted to active
```

### 3. Geographic Distribution

```
┌────────────────────────────────────────────────────────────┐
│                     Global DNS                              │
│    ┌──────────────────┼──────────────────┐                 │
│    ▼                  ▼                  ▼                 │
│ US-East            US-West            EU-West              │
│ Region             Region             Region               │
│    │                  │                  │                 │
│ ┌──┴──┐           ┌──┴──┐           ┌──┴──┐               │
│ │Servers│         │Servers│         │Servers│              │
│ │  DB  │ ←sync→  │  DB  │ ←sync→  │  DB  │               │
│ └─────┘          └─────┘          └─────┘                 │
└────────────────────────────────────────────────────────────┘
```

### 4. Health Checks and Auto-Recovery

```python
# Health check endpoint
@app.get("/health")
def health_check():
    checks = {
        "database": check_db_connection(),
        "cache": check_cache_connection(),
        "disk": check_disk_space(),
    }
    
    if all(checks.values()):
        return {"status": "healthy"}, 200
    return {"status": "unhealthy", "checks": checks}, 503
```

---

## 📈 Calculating System Availability

### Serial Components
If components are in series (all must work):

```
A → B → C

Total = A × B × C
```

**Example**: Web server (99.9%) → App server (99.9%) → DB (99.9%)
```
Total = 0.999 × 0.999 × 0.999 = 99.7%
```

### Parallel Components
If components are in parallel (any can work):

```
    ┌─ A ─┐
────┤     ├────
    └─ B ─┘

Total = 1 - (1-A) × (1-B)
```

**Example**: Two servers, each 99%
```
Total = 1 - (1-0.99) × (1-0.99) = 1 - 0.0001 = 99.99%
```

### Practical Example

```
                    LB (99.99%)
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
      Server 1     Server 2     Server 3
       (99%)        (99%)        (99%)
           │            │            │
           └────────────┼────────────┘
                        ▼
                    DB Primary (99.9%)
                        │
                    DB Replica (99.9%)

Servers (parallel): 1 - (0.01)³ = 99.9999%
DB (parallel): 1 - (0.001)² = 99.9999%
Total (serial): 0.9999 × 0.999999 × 0.999999 = 99.99%
```

---

## ⚠️ Availability Anti-Patterns

### 1. Hidden Single Points of Failure

```
Obvious SPOF: Single database server
Hidden SPOF:  
  - Single load balancer
  - Shared configuration server
  - DNS single point
  - Single cloud region
  - One person who knows the system
```

### 2. Correlated Failures

```
Bad: All servers on same rack
     └─► Rack power failure = all down

Bad: All instances same version
     └─► Bug affects all instances

Good: Spread across:
     - Multiple racks
     - Multiple data centers
     - Multiple versions (canary)
```

### 3. Cascading Failures

```
Service A depends on Service B
Service B goes down
Service A's requests pile up
Service A exhausts resources
Service A goes down
Service C depends on A...

Prevention:
- Timeouts
- Circuit breakers
- Bulkheads
- Graceful degradation
```

---

## 🛠️ Availability Patterns

### 1. Failover

```python
class FailoverClient:
    def __init__(self, primary, secondary):
        self.primary = primary
        self.secondary = secondary
    
    def request(self, data):
        try:
            return self.primary.send(data)
        except ConnectionError:
            return self.secondary.send(data)
```

### 2. Replication

```
Write → Primary
         │
    ┌────┴────┬────────┐
    ▼         ▼        ▼
 Replica 1  Replica 2  Replica 3

Reads distributed across replicas
If primary fails, promote a replica
```

### 3. Graceful Degradation

```python
def get_recommendations(user_id):
    try:
        # Full personalized recommendations
        return ml_service.get_recommendations(user_id)
    except MLServiceUnavailable:
        # Fall back to cached popular items
        return cache.get("popular_items")
    except CacheUnavailable:
        # Final fallback to static list
        return STATIC_RECOMMENDATIONS
```

---

## 📊 Monitoring Availability

### Key Metrics

| Metric | Description | Formula |
|--------|-------------|---------|
| **Uptime** | Time system is operational | Total time - downtime |
| **Error Rate** | Failed requests / total | Errors / requests |
| **MTBF** | Mean time between failures | Uptime / failures |
| **MTTR** | Mean time to recovery | Total repair time / repairs |

### Availability Formula with MTBF/MTTR

```
                    MTBF
Availability = ─────────────
               MTBF + MTTR
```

**Example**: MTBF = 30 days, MTTR = 1 hour
```
Availability = (30 × 24) / (30 × 24 + 1) = 720/721 = 99.86%
```

---

## 💡 Interview Tips

### Questions to Ask
1. What's the availability target? (99.9%? 99.99%?)
2. What's the cost of downtime?
3. Are there maintenance windows?
4. What's the recovery time objective (RTO)?

### Points to Mention
- Single points of failure and how to eliminate
- Redundancy strategy (active-active vs active-passive)
- Geographic distribution for disaster recovery
- Health checks and auto-scaling
- Graceful degradation for partial failures

---

## ✅ Key Takeaways

1. **Availability is a spectrum** - 99.9% vs 99.99% is 10x difference
2. **Eliminate SPOFs** - Redundancy at every layer
3. **Plan for failure** - Assume components will fail
4. **Monitor proactively** - Detect issues before users do
5. **Graceful degradation** - Partial service is better than none
6. **Consider cost** - Higher availability = higher cost
