# Musk and Gale - Software Engineer (Fintech)

**Period:** June 2025 - Present

**Location:** Cleveland, OH

**Tags:** `JAVA` · `PYTHON` · `DJANGO` · `REACT` · `MDM`

## Key accomplishments

- Led a 3-engineer team on a Java and Python Market Data Aggregation Platform, owning architecture and design reviews. Built a security master matching 3.1M+ instruments across 40 vendor feeds by CUSIP, ISIN, and ticker into canonical IDs.

- Built Django REST APIs and React interfaces for customer-facing and internal self-service tools. Query optimization, payload tuning, and cleaner service calls reduced API latency by 32%.

- Engineered configurable ingestion with WebSockets and Celery to onboard vendor feeds through schema reconciliation without code changes. Processed 1.8M records per hour, or 43M+ daily, with retry handling and fault tolerance.

- Designed PostgreSQL data models over 45M+ rows with validation and quality scoring rules. Improved query performance by 41% and set data-modeling standards for the team.

## Project: Market Data Aggregation Platform

**Status:** DEPLOYED
**Tech Stack:** Java, Python, Django, React, WebSockets, Celery, PostgreSQL, AWS

Java and Python fintech platform with a security master matching 3.1M+ instruments across 40 vendor feeds. The platform processes 1.8M records per hour, or 43M+ daily. PostgreSQL models cover 45M+ rows. API latency decreased by 32%, and query performance improved by 41%.

### Security master and configurable ingestion

The security master matches instruments by CUSIP, ISIN, and ticker into canonical IDs. Vendor feeds use schema reconciliation for onboarding without code changes. WebSockets and Celery provide ingestion, retry handling, and fault tolerance. Validation and quality scoring rules support the PostgreSQL data model.

### Illustrative system design

The design targets and scale estimates below explain architecture tradeoffs. They are not measured production results from the resume.

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
