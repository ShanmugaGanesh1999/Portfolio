# Distributed Logging

> Collecting, storing, and analyzing logs at scale

---

## 📖 What is Distributed Logging?

**Distributed Logging** is a system that collects, aggregates, stores, and analyzes logs from multiple services across a distributed system.

```
Without Centralized Logging:
├── SSH into each server
├── grep through local files
├── Manually correlate across services
└── Nightmare to debug!

With Distributed Logging:
├── Single dashboard for all logs
├── Search across all services
├── Correlate with request IDs
└── Alerts on patterns
```

---

## 🎯 Why Distributed Logging?

```
Challenges in Distributed Systems:
├── Many services generate logs
├── Containers are ephemeral (logs disappear)
├── Need to trace requests across services
├── Debug issues across multiple components
└── Compliance and audit requirements

Benefits:
├── Single pane of glass
├── Fast search and filtering
├── Pattern detection and alerting
├── Historical analysis
└── Debugging production issues
```

---

## 🔧 Logging Architecture

### Basic Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Logging Pipeline                          │
│                                                              │
│   Generate        Collect        Process       Store         │
│                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐   ┌─────────┐   │
│  │Service A│───►│         │    │         │   │         │   │
│  └─────────┘    │         │    │         │   │         │   │
│                 │ Agent/  │───►│ Process │──►│ Storage │   │
│  ┌─────────┐    │ Shipper │    │ (Parse) │   │ (Index) │   │
│  │Service B│───►│         │    │         │   │         │   │
│  └─────────┘    │         │    │         │   │         │   │
│                 │ Fluentd │    │ Logstash│   │  Elastic│   │
│  ┌─────────┐    │ Filebeat│    │         │   │         │   │
│  │Service C│───►│ etc.    │    │         │   │         │   │
│  └─────────┘    └─────────┘    └─────────┘   └─────────┘   │
│                                                     │        │
│                                              ┌──────▼──────┐ │
│                                              │   Kibana    │ │
│                                              │ (Visualize) │ │
│                                              └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### ELK Stack (Most Common)

```
E - Elasticsearch: Storage & Search
L - Logstash: Processing & Transformation
K - Kibana: Visualization & Dashboards

Also: EFK (Fluentd instead of Logstash)

┌─────────┐    ┌──────────┐    ┌───────────────┐    ┌────────┐
│ Services│───►│ Filebeat │───►│   Logstash    │───►│Elastic │
│  (logs) │    │ (ship)   │    │(parse/filter) │    │search  │
└─────────┘    └──────────┘    └───────────────┘    └───┬────┘
                                                        │
                                                        ▼
                                                   ┌────────┐
                                                   │ Kibana │
                                                   └────────┘
```

---

## 📊 Log Collection

### Collection Methods

```
1. File-based:
   Service writes to file → Agent tails file
   ├── Filebeat, Fluentd, Logstash
   └── Most common for traditional apps

2. Sidecar Container (Kubernetes):
   App container → Shared volume → Sidecar → Ship
   └── Good for containerized apps

3. Direct Shipping:
   App → SDK → Logging Service
   └── More control, higher coupling

4. Stdout/Stderr (Containers):
   Container logs → Docker/K8s → Ship
   └── Native container logging
```

### Agent Configuration (Filebeat Example)

```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log
    fields:
      service: user-service
      environment: production
    
    # Multiline logs (stack traces)
    multiline.pattern: '^\d{4}-\d{2}-\d{2}'
    multiline.negate: true
    multiline.match: after

output.logstash:
  hosts: ["logstash:5044"]
```

---

## 🔧 Log Processing

### Parsing Unstructured Logs

```
Raw log:
2024-01-15 10:30:45 INFO [user-service] User 123 logged in from 192.168.1.1

Parsed (structured):
{
  "timestamp": "2024-01-15T10:30:45Z",
  "level": "INFO",
  "service": "user-service",
  "message": "User 123 logged in from 192.168.1.1",
  "user_id": "123",
  "ip": "192.168.1.1"
}
```

### Logstash Pipeline

```ruby
# Input
input {
  beats {
    port => 5044
  }
}

# Filter (parse/transform)
filter {
  # Parse timestamp and fields
  grok {
    match => { 
      "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} \[%{DATA:service}\] %{GREEDYDATA:msg}" 
    }
  }
  
  # Parse date
  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }
  
  # Add geo info from IP
  geoip {
    source => "client_ip"
  }
  
  # Remove sensitive data
  mutate {
    remove_field => ["password", "credit_card"]
  }
}

# Output
output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

---

## 📈 Structured Logging

### Why Structured Logs?

```
Unstructured (bad for parsing):
"User john@email.com placed order #12345 for $99.99"

Structured (JSON - easy to parse):
{
  "event": "order_placed",
  "user_email": "john@email.com",
  "order_id": "12345",
  "amount": 99.99,
  "currency": "USD",
  "timestamp": "2024-01-15T10:30:45Z"
}

Benefits:
├── No parsing needed
├── Easy to search/filter
├── Consistent schema
└── Better analytics
```

### Application Logging Best Practices

```python
import structlog
import uuid

# Configure structured logging
logger = structlog.get_logger()

# Add correlation ID for request tracing
def process_order(order_id, user_id):
    correlation_id = str(uuid.uuid4())
    
    log = logger.bind(
        correlation_id=correlation_id,
        order_id=order_id,
        user_id=user_id
    )
    
    log.info("processing_order_started")
    
    try:
        # Process...
        log.info("payment_processed", amount=99.99)
        log.info("order_completed", status="success")
    except Exception as e:
        log.error("order_failed", error=str(e))
        raise
```

---

## 🔧 Log Levels

```
┌────────┬─────────────────────────────────────────────────┐
│ Level  │ When to Use                                     │
├────────┼─────────────────────────────────────────────────┤
│ TRACE  │ Very detailed debugging (not for production)    │
│ DEBUG  │ Detailed flow, useful for debugging             │
│ INFO   │ Normal operations, milestones                   │
│ WARN   │ Potential issues, degraded but working          │
│ ERROR  │ Failures that need attention                    │
│ FATAL  │ System crash, immediate attention needed        │
└────────┴─────────────────────────────────────────────────┘

Production typically: INFO and above
Debugging: DEBUG and above
Never in prod: TRACE (too verbose)
```

---

## 📊 Log Storage

### Index Strategy

```
Time-based indices:
logs-2024.01.15
logs-2024.01.16
logs-2024.01.17

Benefits:
├── Easy retention management (delete old indices)
├── Better query performance (search specific days)
└── Can have different policies per age

Index Lifecycle Management (ILM):
Hot    (0-7 days):   Fast storage, all replicas
Warm   (7-30 days):  Fewer replicas, slower storage
Cold   (30-90 days): Minimal resources, compressed
Delete (90+ days):   Remove
```

### Retention Policies

```
Consider:
├── Compliance requirements (GDPR, SOC2, HIPAA)
├── Storage costs
├── Query patterns (how far back do you search?)
└── Legal hold requirements

Typical:
├── Application logs: 30-90 days
├── Security logs: 1 year
├── Audit logs: 7 years
└── Debug logs: 7 days
```

---

## 💡 Distributed Tracing Integration

### Correlation IDs

```
Track a request across services:

Request → API Gateway → User Service → Order Service → DB
     │         │              │              │
     └─────────┴──────────────┴──────────────┘
              correlation_id: abc-123

All logs include same correlation_id
Easy to search: correlation_id:abc-123
See entire request flow
```

```python
# Middleware to propagate correlation ID
def correlation_middleware(request, next):
    correlation_id = (
        request.headers.get('X-Correlation-ID') or 
        str(uuid.uuid4())
    )
    
    # Store in thread local for this request
    context.correlation_id = correlation_id
    
    # Pass to downstream services
    response = next(request)
    response.headers['X-Correlation-ID'] = correlation_id
    
    return response
```

### With Distributed Tracing

```
Logs + Traces together:

Trace ID: abc-123
├── Span: API Gateway (50ms)
│   └── Logs: "Request received", "Auth passed"
├── Span: User Service (30ms)
│   └── Logs: "User fetched", "Permissions checked"
└── Span: Order Service (100ms)
    └── Logs: "Order created", "Payment processed"

Tools: Jaeger, Zipkin, AWS X-Ray
Link logs to traces for full context
```

---

## 🔧 Alerting

### Log-based Alerts

```
Alert on patterns:

1. Error rate spike:
   "More than 100 ERROR logs in 5 minutes"

2. Specific error:
   "OutOfMemoryError detected"

3. Security events:
   "Multiple failed login attempts from same IP"

4. Business events:
   "Payment failure rate > 5%"
```

### Alert Configuration (ElastAlert Example)

```yaml
name: High Error Rate
type: frequency
index: logs-*
num_events: 100
timeframe:
  minutes: 5

filter:
  - term:
      level: ERROR

alert:
  - slack:
      slack_webhook_url: "https://hooks.slack.com/..."
      
alert_text: |
  High error rate detected!
  Errors in last 5 min: {0}
  
realert:
  minutes: 30  # Don't spam
```

---

## 📈 Log Management Services

### Self-Hosted

```
ELK/EFK Stack:
├── Full control
├── No data leaves your infra
├── Operational overhead
└── Scaling complexity

Loki (Grafana):
├── Log aggregation for Prometheus users
├── Labels-based (like Prometheus)
├── Cost-effective (no full-text index)
└── Good for Kubernetes
```

### Managed Services

```
Datadog:
├── Logs + Metrics + Traces
├── Easy setup
├── Expensive at scale
└── Great UI/UX

Splunk:
├── Enterprise standard
├── Powerful SPL query language
├── Very expensive
└── Great for security

AWS CloudWatch:
├── Native AWS integration
├── Pay per ingestion/storage
├── Limited query capabilities
└── Good for AWS-native

Others: Sumo Logic, Papertrail, Loggly
```

### Comparison

| Service | Best For | Cost | Query Power |
|---------|----------|------|-------------|
| ELK | Full control | Medium | High |
| Loki | K8s + Prometheus | Low | Medium |
| Datadog | All-in-one | High | High |
| Splunk | Enterprise/Security | Very High | Very High |
| CloudWatch | AWS native | Medium | Low |

---

## 💡 Best Practices

### What to Log

```
DO log:
├── Request/response metadata (not bodies)
├── Errors with context
├── Business events
├── Performance metrics
├── Security events
└── State transitions

DON'T log:
├── Sensitive data (passwords, tokens)
├── PII without redaction
├── High-frequency debug in prod
├── Large payloads (use sampling)
└── Secrets, API keys
```

### Performance Considerations

```
1. Async logging (don't block app)
2. Batch writes to reduce I/O
3. Sample high-volume logs
4. Compress before shipping
5. Use structured logging (less parsing)
6. Index only what you search
```

---

## 💡 In System Design Interviews

### When to Discuss

```
1. "How do you debug issues in production?"
2. "How do you trace requests across services?"
3. "How do you monitor for errors?"
4. "Audit trail requirements?"
```

### Key Points

```
1. Centralized logging is essential for microservices
2. Use structured logging (JSON)
3. Correlation IDs for request tracing
4. Log levels appropriate for environment
5. Retention based on requirements
6. Alert on patterns, not individual logs
7. Don't log sensitive data
```

---

## ✅ Key Takeaways

1. **Centralized logging** is essential for distributed systems
2. **ELK/EFK stack** is the most common solution
3. **Structured logging** (JSON) eliminates parsing issues
4. **Correlation IDs** link logs across services
5. **Time-based indices** for easy retention
6. **Log levels** - INFO+ in production
7. **Never log** passwords, tokens, PII
8. **Alert on patterns** not individual logs

---

## 📖 Next Steps

→ Continue to [Distributed Monitoring](./14-distributed-monitoring.md)
