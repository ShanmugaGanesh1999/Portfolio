# Musk and Gale - Software Engineer (Fintech)

**Period:** June 2025 - Present  
**Location:** Cleveland, OH  
**Tags:** `JAVA` · `PYTHON` · `DJANGO` · `REACT` · `AWS`

---

## Role Summary

Software Engineer (Fintech) building a Java and Python based Market Data Aggregation Platform, focusing on market data processing, backend APIs, governance/compliance workflows, React integration, and secure financial data models.

---

## Key Accomplishments

- Led a **Java and Python based Market Data Aggregation Platform**, achieving **95% sprint feature clarity** by translating market data, compliance, governance, and business rules into scalable engineering deliverables.
- Built a **Python Django REST backend** with React, reducing **API latency by 32%** through query optimization, payload tuning, and cleaner frontend service calls.
- Engineered **real time API data streams** using WebSockets and Celery, reaching **1.8M records per hour** with reliable ingestion, retry handling, and timeout resilient integrations.
- Designed **PostgreSQL data models** for secure financial aggregation, improving **query performance by 41%** through indexing, normalized schemas, and encrypted data handling.

---

## Project: Market Data Aggregation Platform

**Status:** DEPLOYED  
**Tech Stack:** Java, Python, Django, React, WebSockets, Celery, PostgreSQL, AWS

> Java and Python based fintech platform with a Python Django REST backend and React frontend. Reaches 1.8M records per hour via WebSockets and Celery, reduces API latency by 32%, and improves PostgreSQL query performance by 41%.

### Functional Requirements

| Requirement                     | Details                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Real-time Market Data Ingestion | Consume streaming price feeds from 10+ financial data providers via WebSockets with <500ms latency                 |
| Multi-source Data Aggregation   | Normalize, deduplicate, and aggregate price data across exchanges with conflict resolution (last-write-wins with timestamp) |
| Historical Query API            | Serve time-series queries for price history, analytics, and compliance auditing with <100ms p95 latency            |

### Non-Functional Requirements

| Attribute    | Target                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| Consistency  | Eventual consistency for ingestion (accept temporary staleness for availability); Strong consistency for compliance queries |
| Latency      | <500ms ingestion-to-storage, <100ms read queries (p95), <5s for complex analytics                                      |
| Availability | 99.98% uptime (4.3 min/month downtime)                                                                                |

### Scale Estimates

```
Ingestion Rate:
  10 providers × 5,000 symbols × 1 update/sec = 50,000 QPS (writes)
  Peak Load (3x): 150,000 QPS

Storage (1 year retention):
  50,000 updates/sec × 500 bytes × 86,400 sec/day × 365 days
  = 788 TB/year ≈ 2.2 TB/day

Query Load:
  100K active users × 50 queries/day / 86,400 = 58 QPS reads
  Peak (3x): 174 QPS
```

### System Architecture (High-Level)

```
Client (React SPA)
    ↓
CDN (CloudFront)
    ↓
ALB (Load Balancer)
    ↓
API Gateway (Kong) → Query Service → TimescaleDB / Redis
    ↑
WS Handler (Provider Streams) → Kafka Cluster (3 Brokers)
    ↓
Ingestion Service (Python) → Normalization Service
    ↓
Kafka (Normalized) → Persistence Worker → TimescaleDB
                   → Analytics Worker → Materialized Views
                   → SSE Broadcaster → Clients
```

**Key Components:**

| Component            | Technology       | Description                                                                                         |
| -------------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| WS Handler           | Python           | WebSocket connections to financial data providers (NYSE, NASDAQ), publishes raw events to Kafka       |
| Kafka Cluster        | 3 Brokers        | Distributed message broker partitioned by symbol hash for ordered processing. Replication factor 3   |
| Ingestion Service    | Python           | Consumes raw events, validates data integrity, normalizes across provider formats                    |
| Normalization Service| Python           | Standardizes price formats, currency conversions, and symbol mappings across exchanges               |
| Query Service        | Django           | Serves time-series queries from TimescaleDB with Redis caching                                       |
| API Gateway          | Kong             | Authentication, rate limiting, and routing                                                           |

### Low-Level Design Highlights

**Pattern:** ConcurrentHashMap + Strategy Pattern (Java 17)

| Entity               | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| MarketData           | Immutable record — symbol, price, volume, timestamp, source                                |
| AggregatedQuote      | Deduplicated latest state per symbol with conflict resolution metadata                     |
| DataSourceAdapter    | Interface for ingesting from heterogeneous APIs (WebSocket, REST polling)                  |
| MarketDataAggregator | Thread-safe service orchestrating ingestion and queries                                     |

**Performance Targets:**
- 500 records/sec average (1.8M/hour) with 2x burst capacity
- Sub-10ms aggregation per record
- Sub-5ms query for latest quote
- Multiple producer threads (one per data source), multiple consumer threads querying

---
