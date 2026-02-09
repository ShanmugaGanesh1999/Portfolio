# Zoho Corporation — MTS Full Stack Developer

**Period:** January 2022 – December 2023  
**Location:** Chennai, India  
**Tags:** `JAVA` · `KAFKA` · `REDIS` · `MICROSERVICES`

---

## Role Summary

Member of Technical Staff (MTS) Full Stack Developer at Zoho Corporation, building high-scale CRM backend systems including tax configuration engines, validation pipelines, rollup aggregation services, and user activity tracking features.

---

## Key Accomplishments

- Enhanced **Tax Configuration system** with API versioning, reducing compatibility issues across 7 integrated systems
- Built **NIO-based validation engine** processing **2.3M records/hour**
- Developed **Kafka/Redis-powered rollup** automating **6,500+ weekly aggregation tasks**
- Implemented data pipeline achieving **99.9% uptime** with **36% latency improvement**
- Designed **Recent Items feature** tracking user activity across all CRM modules with **sub-100ms retrieval**

---

## Project 1: Tax Configuration & Calculation Service

**Status:** PRODUCTION  
**Tech Stack:** Java, PostgreSQL, Redis, Kafka, DynamoDB

> API-versioned tax system across 7 integrated systems with NIO-based validation at 2.3M records/hour. Kafka/Redis rollup automating 6,500+ weekly aggregation tasks.

### Functional Requirements

| Requirement                  | Details                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Dynamic Tax Configuration    | Administrators create, update, reorder, delete tax rules with labels, rates (up to 2 decimals), and auto-population prefs  |
| Multi-Tax Calculation        | Apply multiple tax rates to line items across Quotes, Sales Orders, Invoices with real-time calculation and version-aware APIs |
| Cross-System Synchronization | Ensure mobile/web/API consistency for tax configurations with eventual consistency across distributed systems               |

### Non-Functional Requirements

| Attribute    | Target                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Consistency  | Eventual Consistency for config reads (1-2s propagation); Strong Consistency for financial calculations    |
| Latency      | <50ms for tax calculation API, <200ms for configuration update propagation                                 |
| Availability | 99.95% uptime (21.9 min downtime/month)                                                                   |

### Scale Estimates

```
Tax Calculation QPS:
  20,000 active orgs × 50 ops × 3 calcs / 86,400s = 34.7 QPS
  Peak (3x) = ~105 QPS

Configuration Update QPS: ~0.46 QPS (negligible)

Storage (Tax Configuration):
  100,000 orgs × 10 tax rules/org × 500 bytes/rule = 500 MB

Storage (Audit Trail):
  20,000 orgs × 50 ops × 365 days × 2 KB/record = 730 GB/year
```

### Architecture

```
Client (Web/Mobile)
  ↓
ALB → API Gateway (Kong + Rate Limiter)
  ├── Tax Config Service (Java) → Redis (Config Cache) + PostgreSQL (Tax Configs) + Kafka
  ├── Tax Calc Service (Java) → Redis (Calc Cache) + Tax Config Service
  └── Invoice/Quote Service (Java) → Transaction DB (PostgreSQL)
                                        ↓
                                   Kafka → Config Propagation → Event Store (DynamoDB)
```

---

## Project 2: Record Validation System at Scale

**Status:** PRODUCTION  
**Tech Stack:** Java, Kafka, Redis, PostgreSQL, NIO

> NIO-based async validation processing pipeline handling 2.3M records/hour with <100ms real-time validation latency.

### Functional Requirements

| Requirement          | Details                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Real-time Validation | Validate records on create/edit across forms, layouts, and APIs with <200ms latency. Supports regex, criteria, custom functions, external API rules |
| Bulk Validation      | Process batch jobs (up to 5M records/hour) via async NIO workers with Kafka-based job distribution                   |
| Rule Management      | CRUD operations for validation rules — regex, criteria-based, custom functions, external API calls with priority ordering |

### Non-Functional Requirements

| Attribute    | Target                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- |
| Consistency  | Strong consistency for rule updates; Eventual consistency for validation telemetry/metrics |
| Latency      | <100ms for real-time validation, <1 hour for bulk validation of 5M records                |
| Availability | 99.9% uptime for validation API                                                          |

### Scale Estimates

```
Real-time QPS:
  500,000 DAU × 0.8 × 15 ops / 86,400 = 69 QPS
  Peak (3x) = ~210 QPS

Bulk Validation Throughput:
  5M records/hour = 1,389 records/sec
  NIO workers process 1,000 records/batch concurrently

Storage (30-day logs):
  500K DAU × 15 ops × 30 days × 2KB/log = 450 GB
```

### Architecture

```
Client (Web/Mobile/API)
  ↓
ALB → API Gateway (Kong)
  ├── Validation API (Java) → Redis (Rule Cache) + Kafka (Bulk Jobs)
  └── Rule Mgmt API (Java) → PostgreSQL (Rules & Metadata) + Redis Pub/Sub invalidation
                                  ↓
                            Kafka → NIO Workers (Async Batch Processing)
                                  ↓
                            PostgreSQL (Validation Results) + S3 (Reports)
```

---

## Project 3: Zoho CRM Rollup Summary Field System

**Status:** PRODUCTION  
**Tech Stack:** Java, Kafka, Redis, PostgreSQL, Microservices

> Event-driven rollup aggregation system automating 6,500+ weekly tasks with P99 <100ms recalculation and P99 <50ms reads.

### Functional Requirements

| Requirement            | Details                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| Aggregate Calculations | Sum, Count, Average, Max, Min, and Date functions (Earliest, Latest, Recent, Upcoming) with filter criteria |
| Real-time Updates      | Propagate child record changes to parent rollup fields within 100ms for interactive workflows               |
| Batch Initialization   | Populate rollup fields with historical data when new rollup definitions are created                        |

### Non-Functional Requirements

| Attribute    | Target                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ |
| Consistency  | Eventual consistency acceptable (100-500ms delay tolerated for rollup updates)              |
| Latency      | P99 < 100ms for rollup recalculation, P99 < 50ms for rollup field reads                   |
| Availability | 99.9% uptime for read path; async write path tolerates brief degradation                   |

### Scale Estimates

```
Write Events:
  1M users × 40% DAU × 20 writes/day / 86400 = ~93 QPS
  Peak (3x) = 280 QPS triggering rollup recalculations

Rollup Reads:
  1M users × 40% DAU × 50 reads/day / 86400 = ~232 QPS
  Peak = 700 QPS rollup field reads

Storage:
  ~1 GB/org → 100 TB across 100K organizations
```

### Architecture

```
Client (Web/Mobile)
  ↓
API Gateway (Kong) → Record Service (Java) → PostgreSQL (Transactional Data)
                                            → Kafka (Record Change Stream)
                                                ↓
                                          Rollup Engine (Java) → Column Store (Rollup Definitions)
                                                               → PostgreSQL (Aggregated Values)
                                                               → Redis (Rollup Cache)
                                                               → Workflow Management Service
```

---

## Project 4: Zoho CRM Recent Items Feature

**Status:** PRODUCTION  
**Tech Stack:** Java, Kafka, Redis, PostgreSQL, Microservices

> User activity tracking across all CRM modules with sub-100ms retrieval using Redis Sorted Sets.

### Functional Requirements

| Requirement          | Details                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Track User Activity  | Record the last 20 viewed/modified records per user across all CRM modules                      |
| Real-time Retrieval  | Fetch recent items list in <100ms when user opens the dropdown, sorted by timestamp             |
| Module Filtering     | Display record type, ID, name, and timestamp with direct navigation to record detail page       |

### Non-Functional Requirements

| Attribute    | Target                                                                               |
| ------------ | ------------------------------------------------------------------------------------ |
| Consistency  | Eventual Consistency (1-2 second delay acceptable for recent items to appear)        |
| Latency      | P95 read latency <100ms, write latency <50ms (async acceptable)                      |
| Availability | 99.9% uptime (brief staleness acceptable over downtime)                              |

### Scale Estimates

```
Write Load (Activity Tracking):
  500K users × 50 actions/day / 86400 ≈ 290 writes/sec
  Peak (3x): ~870 writes/sec

Read Load (Dropdown Opens):
  500K users × 10 opens/day / 86400 ≈ 58 reads/sec
  Peak (3x): ~175 reads/sec

Storage (Per User):
  20 items × 200 bytes = 4 KB/user
  500K users × 4 KB = 2 GB active storage
```

### Architecture

```
Client (React)
  ↓
ALB → API Gateway (Kong)
  ├── Auth Service (JWT Validation)
  ├── Recent Items Service → Redis Sorted Sets (ZADD/ZREVRANGE) + PostgreSQL (Activity Table)
  └── Record Service (CRUD) → Record DB + Kafka (Activity Events)
                                             ↓
                                       Kafka → Activity Consumer → Redis + PostgreSQL
```

---
