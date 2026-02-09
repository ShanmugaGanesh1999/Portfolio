# Distributed Monitoring

> Observing system health, performance, and behavior

---

## 📖 What is Distributed Monitoring?

**Distributed Monitoring** is the practice of collecting, storing, and visualizing metrics, traces, and health data from all components of a distributed system.

```
The Three Pillars of Observability:

┌─────────────────────────────────────────────────────────────┐
│                      Observability                           │
│                                                              │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│   │   Metrics   │   │    Logs     │   │   Traces    │       │
│   │             │   │             │   │             │       │
│   │  Numbers    │   │   Events    │   │   Request   │       │
│   │  over time  │   │   text      │   │   flow      │       │
│   └─────────────┘   └─────────────┘   └─────────────┘       │
│                                                              │
│   "CPU is 80%"      "Error at X"    "Request took           │
│                                       100ms across           │
│                                       3 services"            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Why Monitoring?

```
Without Monitoring:
├── "Is the system healthy?" → "I think so?"
├── "Why is it slow?" → "Let me check logs..."
├── "When did it break?" → "Users complained 2 hours ago"
└── Firefighting mode

With Monitoring:
├── Proactive alerting before users notice
├── Dashboards show system health at a glance
├── Historical data for trend analysis
├── Root cause analysis with metrics
└── Capacity planning with data
```

---

## 🔧 Types of Metrics

### The Four Golden Signals

```
Google SRE's recommended metrics:

1. Latency
   ├── How long requests take
   └── p50, p95, p99 percentiles

2. Traffic
   ├── How much demand
   └── Requests/second, concurrent users

3. Errors
   ├── Rate of failed requests
   └── HTTP 5xx rate, exception count

4. Saturation
   ├── How "full" the system is
   └── CPU%, memory%, queue depth
```

### RED Method (Request-focused)

```
For microservices:

R - Rate:     Requests per second
E - Errors:   Failed requests per second
D - Duration: Request latency distribution
```

### USE Method (Resource-focused)

```
For infrastructure:

U - Utilization: % time resource is busy
S - Saturation:  Queue length, waiting
E - Errors:      Error count
```

---

## 📊 Metrics Architecture

### Pull vs Push Model

```
Pull Model (Prometheus):
├── Monitoring server scrapes targets
├── Targets expose /metrics endpoint
├── Server controls scrape interval
└── Simpler for dynamic environments

┌──────────────┐     scrape      ┌──────────────┐
│  Prometheus  │ ◄─────────────► │   Service    │
│              │     /metrics    │              │
└──────────────┘                 └──────────────┘

Push Model (StatsD, InfluxDB):
├── Services push metrics to collector
├── Works behind firewalls
├── Better for short-lived processes
└── Higher volume support

┌──────────────┐     push        ┌──────────────┐
│   Service    │ ───────────────►│  Collector   │
│              │                 │              │
└──────────────┘                 └──────────────┘
```

### Prometheus Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Monitoring Stack                         │
│                                                              │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐                 │
│   │Service A│    │Service B│    │Service C│                 │
│   │ /metrics│    │ /metrics│    │ /metrics│                 │
│   └────┬────┘    └────┬────┘    └────┬────┘                 │
│        │              │              │                       │
│        └──────────────┼──────────────┘                       │
│                       ▼                                      │
│              ┌────────────────┐                              │
│              │   Prometheus   │                              │
│              │  (scrape/store)│                              │
│              └───────┬────────┘                              │
│                      │                                       │
│          ┌───────────┼───────────┐                          │
│          ▼           ▼           ▼                          │
│   ┌───────────┐ ┌──────────┐ ┌────────────┐                 │
│   │  Grafana  │ │Alertmanager│ │  PromQL   │                 │
│   │(dashboard)│ │  (alerts) │ │ (queries) │                 │
│   └───────────┘ └──────────┘ └────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Metric Types

### Counter

```
Only goes up (resets on restart)

Use for: Requests, errors, completed tasks

http_requests_total{method="GET", path="/api"} 12345

Rate calculation:
rate(http_requests_total[5m]) = requests per second
```

### Gauge

```
Goes up and down

Use for: Current values, temperatures, queue sizes

memory_usage_bytes 1073741824
active_connections 42
```

### Histogram

```
Distribution of values in buckets

Use for: Latencies, request sizes

http_request_duration_seconds_bucket{le="0.1"} 1000
http_request_duration_seconds_bucket{le="0.5"} 1800
http_request_duration_seconds_bucket{le="1"}   1950
http_request_duration_seconds_bucket{le="+Inf"} 2000

Calculate percentiles:
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Summary

```
Pre-calculated quantiles (client-side)

Use for: When you know needed percentiles upfront

http_request_duration_seconds{quantile="0.5"} 0.05
http_request_duration_seconds{quantile="0.95"} 0.2
http_request_duration_seconds{quantile="0.99"} 0.5
```

---

## 📈 Implementing Metrics

### Application Metrics (Python Example)

```python
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Define metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['endpoint'],
    buckets=[.01, .05, .1, .25, .5, 1, 2.5, 5, 10]
)

ACTIVE_REQUESTS = Gauge(
    'http_requests_active',
    'Active HTTP requests'
)

# Use in application
def handle_request(method, endpoint):
    ACTIVE_REQUESTS.inc()
    start_time = time.time()
    
    try:
        # Process request
        result = process()
        REQUEST_COUNT.labels(method, endpoint, '200').inc()
        return result
    except Exception:
        REQUEST_COUNT.labels(method, endpoint, '500').inc()
        raise
    finally:
        ACTIVE_REQUESTS.dec()
        REQUEST_LATENCY.labels(endpoint).observe(time.time() - start_time)

# Start metrics endpoint
start_http_server(8000)  # /metrics on port 8000
```

### Infrastructure Metrics

```yaml
# Node Exporter for system metrics
node_cpu_seconds_total
node_memory_MemAvailable_bytes
node_disk_io_time_seconds_total
node_network_receive_bytes_total

# Kubernetes metrics
kube_pod_status_ready
kube_deployment_status_replicas_available
container_cpu_usage_seconds_total
container_memory_usage_bytes
```

---

## 🔧 Alerting

### Alert Rules

```yaml
# Prometheus alerting rules
groups:
  - name: example
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) 
          / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"
      
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95, 
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "P95 latency is above 1 second"
```

### Alert Best Practices

```
Good Alerts:
├── Actionable (someone can fix it)
├── Urgent (needs attention now)
├── Rare (not noisy)
└── Clear (what's wrong, how to fix)

Bad Alerts:
├── Too sensitive (alert fatigue)
├── Not actionable (so what?)
├── No context (what service? what impact?)
└── Duplicates (same issue, many alerts)

Structure:
├── Page (wake someone up): System down
├── Ticket (fix tomorrow): Degraded performance
├── Log (informational): Unusual but ok
```

---

## 📊 Dashboards

### Dashboard Design

```
Executive Dashboard:
├── Overall system health (green/yellow/red)
├── Key business metrics
├── SLA compliance
└── High-level trends

Service Dashboard:
├── Request rate, error rate, latency
├── Resource usage (CPU, memory)
├── Dependencies health
├── Recent deployments marker

Debugging Dashboard:
├── Detailed breakdowns
├── Individual endpoint metrics
├── Queue depths
├── Database query times
```

### Grafana Dashboard Example

```
┌─────────────────────────────────────────────────────────────┐
│  Service: User API                                    🟢     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Requests/s   │  │  Error Rate    │  │  P95 Latency   │ │
│  │                │  │                │  │                │ │
│  │     1,234      │  │     0.1%       │  │     45ms       │ │
│  │    ▁▃▅▇▅▃▁    │  │    ▁▁▁▂▁▁▁    │  │    ▂▂▃▂▂▂▂    │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Request Rate                         │ │
│  │  ▁▂▃▅▇▅▃▂▁▂▃▅▇▅▃▂▁▂▃▅▇▅▃▂▁▂▃▅▇▅▃▂▁                    │ │
│  │  └──────────────────────────────────────────────────►   │ │
│  │   00:00        06:00        12:00        18:00  Now     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Distributed Tracing

### What is Tracing?

```
Track a request across multiple services:

User Request
    │
    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ API Gateway │───►│User Service │───►│  Database   │
│   (50ms)    │    │   (30ms)    │    │   (20ms)    │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │Cache Service│
                   │   (5ms)     │
                   └─────────────┘

Total: 105ms (but where's the bottleneck?)
Trace shows: Most time in API Gateway (50ms)
```

### Trace Structure

```
Trace: A complete request flow (trace_id)
Span: A single operation within trace (span_id)

Trace ID: abc-123
├── Span: API Gateway (parent=none)
│   ├── start: 0ms
│   ├── end: 50ms
│   └── tags: {method: GET, path: /users/1}
├── Span: User Service (parent=API Gateway)
│   ├── start: 50ms
│   ├── end: 80ms
│   └── tags: {user_id: 1}
├── Span: Database Query (parent=User Service)
│   ├── start: 55ms
│   ├── end: 75ms
│   └── tags: {query: SELECT...}
└── Span: Cache Lookup (parent=User Service)
    ├── start: 80ms
    ├── end: 85ms
    └── tags: {hit: true}
```

### Tracing Tools

```
Jaeger (CNCF):
├── Open source
├── Native Kubernetes support
├── Good for microservices

Zipkin:
├── Originally from Twitter
├── Simple, mature
├── Wide language support

AWS X-Ray:
├── Native AWS integration
├── Managed service
├── Good for AWS workloads

OpenTelemetry:
├── Unified standard
├── Vendor neutral
├── Future of observability
└── Combines traces, metrics, logs
```

---

## 📈 Monitoring Technologies

### Time-Series Databases

```
Prometheus:
├── Pull-based
├── PromQL query language
├── Good for Kubernetes
├── Local storage (limited retention)

InfluxDB:
├── Push-based
├── Flux query language
├── Better for IoT, high cardinality

TimescaleDB:
├── PostgreSQL extension
├── SQL queries
├── Good for existing SQL users

VictoriaMetrics:
├── Prometheus compatible
├── Better performance/compression
├── Long-term storage
```

### Managed Services

```
Datadog:
├── All-in-one (metrics, logs, traces)
├── Excellent UX
├── Expensive at scale

New Relic:
├── APM focused
├── Good for application monitoring
├── Full-stack observability

AWS CloudWatch:
├── Native AWS integration
├── Basic but sufficient
├── Pay per metric/alarm

Grafana Cloud:
├── Managed Grafana + Prometheus
├── Open source friendly
├── Good pricing
```

---

## 💡 Monitoring Best Practices

### What to Monitor

```
Application Layer:
├── Request rate, error rate, latency
├── Business metrics (orders, signups)
├── Feature flag usage
└── Cache hit rates

Infrastructure Layer:
├── CPU, memory, disk, network
├── Container health
├── Pod restarts, OOM kills
└── Node availability

Dependencies:
├── Database connections, query times
├── External API latency
├── Message queue depth
└── Third-party service health
```

### Labeling Strategy

```
Good labels:
├── service: "user-api"
├── environment: "production"
├── version: "v1.2.3"
├── endpoint: "/api/users"
├── method: "GET"
└── status_code: "200"

Avoid high cardinality:
├── user_id (millions of values)
├── request_id (unique per request)
├── timestamp in label
└── These explode metric storage!
```

---

## 💡 In System Design Interviews

### When to Discuss

```
1. "How do you know if the system is healthy?"
2. "How do you detect and debug issues?"
3. "What happens when things go wrong?"
4. "How do you ensure SLAs?"
```

### Key Points

```
1. Three pillars: Metrics, Logs, Traces
2. Four golden signals: Latency, Traffic, Errors, Saturation
3. Prometheus + Grafana is common stack
4. Alert on symptoms, not causes
5. Correlation IDs link everything together
6. SLIs/SLOs for reliability targets
```

---

## ✅ Key Takeaways

1. **Three pillars**: Metrics, Logs, Traces
2. **Four golden signals**: Latency, Traffic, Errors, Saturation
3. **Prometheus** is the standard for metrics
4. **Grafana** for visualization
5. **Distributed tracing** for request flow
6. **Alert on symptoms** (high latency) not causes (CPU)
7. **Avoid high cardinality** labels
8. **Dashboards** for different audiences
