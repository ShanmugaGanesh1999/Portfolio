# Building Blocks of System Design

> Essential components for building scalable distributed systems

---

## 📚 Topics Covered

| # | Topic | Description |
|---|-------|-------------|
| 1 | [DNS](./01-dns.md) | Domain Name System |
| 2 | [Load Balancers](./02-load-balancers.md) | Traffic distribution |
| 3 | [Databases](./03-databases.md) | Data storage and querying |
| 4 | [Key-Value Stores](./04-key-value-stores.md) | Simple, fast data storage |
| 5 | [CDN](./05-cdn.md) | Content Delivery Networks |
| 6 | [Sequencer](./06-sequencer.md) | Unique ID generation |
| 7 | [Distributed Cache](./07-distributed-cache.md) | In-memory data caching |
| 8 | [Message Queues](./08-message-queues.md) | Asynchronous communication |
| 9 | [Pub-Sub](./09-pub-sub.md) | Publish-Subscribe pattern |
| 10 | [Rate Limiter](./10-rate-limiter.md) | Traffic control |
| 11 | [Blob Store](./11-blob-store.md) | Binary large object storage |
| 12 | [Distributed Search](./12-distributed-search.md) | Full-text search |
| 13 | [Distributed Logging](./13-distributed-logging.md) | Log aggregation |
| 14 | [Distributed Monitoring](./14-distributed-monitoring.md) | System observability |
| 15 | [Task Scheduler](./15-task-scheduler.md) | Job scheduling |
| 16 | [Sharded Counters](./16-sharded-counters.md) | High-throughput counting |

---

## 🎯 Why Building Blocks Matter

Every large-scale system is composed of the same fundamental building blocks:

```
┌─────────────────────────────────────────────────────────────┐
│                    Any Large System                          │
│                                                              │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐     │
│   │ DNS │  │ LB  │  │Cache│  │ DB  │  │Queue│  │ CDN │     │
│   └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘     │
│                                                              │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐     │
│   │Search│ │Blob │  │Log  │  │Rate │  │Task │  │Monitor│    │
│   └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘     │
└─────────────────────────────────────────────────────────────┘
```

Master these building blocks → Design any system.

---

## 📊 Building Blocks at a Glance

| Building Block | Purpose | Examples |
|----------------|---------|----------|
| **DNS** | Name to IP resolution | Route53, Cloudflare |
| **Load Balancer** | Distribute traffic | Nginx, HAProxy, ELB |
| **Database** | Persistent storage | PostgreSQL, MongoDB |
| **Key-Value Store** | Fast lookups | Redis, DynamoDB |
| **CDN** | Static content delivery | CloudFront, Akamai |
| **Sequencer** | Unique IDs | Snowflake, UUID |
| **Cache** | Speed up reads | Redis, Memcached |
| **Message Queue** | Async processing | Kafka, RabbitMQ, SQS |
| **Pub-Sub** | Event distribution | Kafka, Pub/Sub |
| **Rate Limiter** | Traffic control | Custom, API Gateway |
| **Blob Store** | Large file storage | S3, GCS, Azure Blob |
| **Search** | Full-text search | Elasticsearch, Solr |
| **Logging** | Log aggregation | ELK, Splunk |
| **Monitoring** | Metrics & alerts | Prometheus, Datadog |
| **Scheduler** | Job management | Airflow, cron |
| **Counters** | High-throughput counting | Sharded counters |

---

## 🔧 Typical System Architecture

```
                            ┌─────────────┐
                            │     CDN     │
                            │ (Static)    │
                            └──────┬──────┘
                                   │
                            ┌──────▼──────┐
          ┌─────────────────│     DNS     │─────────────────┐
          │                 └─────────────┘                 │
          │                                                 │
          ▼                                                 ▼
   ┌─────────────┐                                   ┌─────────────┐
   │ Rate Limiter│                                   │ Rate Limiter│
   └──────┬──────┘                                   └──────┬──────┘
          │                                                 │
   ┌──────▼──────┐                                   ┌──────▼──────┐
   │Load Balancer│                                   │Load Balancer│
   └──────┬──────┘                                   └──────┬──────┘
          │                                                 │
   ┌──────┼──────┐                                   ┌──────┼──────┐
   ▼      ▼      ▼                                   ▼      ▼      ▼
┌────┐ ┌────┐ ┌────┐                              ┌────┐ ┌────┐ ┌────┐
│Svc │ │Svc │ │Svc │                              │Svc │ │Svc │ │Svc │
└──┬─┘ └──┬─┘ └──┬─┘                              └──┬─┘ └──┬─┘ └──┬─┘
   │      │      │                                   │      │      │
   └──────┼──────┘                                   └──────┼──────┘
          │                                                 │
   ┌──────▼──────┐         ┌─────────────┐         ┌──────▼──────┐
   │    Cache    │◄───────►│Message Queue│◄───────►│    Cache    │
   └──────┬──────┘         └─────────────┘         └──────┬──────┘
          │                                                │
   ┌──────▼──────┐                                  ┌──────▼──────┐
   │  Database   │◄────────────sync────────────────►│  Database   │
   └─────────────┘                                  └─────────────┘
```

---

## 📈 Study Strategy

### Week 1: Core Components
1. DNS - How the internet finds things
2. Load Balancers - Distributing traffic
3. Databases - Storing data

### Week 2: Performance Components
4. Key-Value Stores - Fast data access
5. Distributed Cache - Speed up everything
6. CDN - Global content delivery

### Week 3: Communication Components
7. Message Queues - Async processing
8. Pub-Sub - Event-driven architecture
9. Rate Limiter - Traffic control

### Week 4: Infrastructure Components
10. Blob Store - Large file storage
11. Distributed Search - Finding data
12. Logging & Monitoring - Observability

### Week 5: Advanced Components
13. Sequencer - Unique ID generation
14. Task Scheduler - Job management
15. Sharded Counters - High-throughput counting

---

## ⏱️ Estimated Study Time

- Core components (DNS, LB, DB): 4 hours
- Performance components: 3 hours
- Communication components: 3 hours
- Infrastructure components: 3 hours
- Advanced components: 2 hours

**Total: ~15 hours**
