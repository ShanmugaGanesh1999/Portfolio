// ============================================================
// MARKET DATA AGGREGATION PLATFORM — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "Market Data Aggregation Platform",
  subtitle: "System Design Deep Dive",
  company: "Musk and Gale",
  role: "Software Engineer",
  period: "JUN 2025 – PRESENT",
  tags: ["PYTHON", "DJANGO", "KAFKA", "TIMESCALEDB", "REDIS", "AWS"],
  status: "DEPLOYED",
};

export const REQUIREMENTS = {
  functional: [
    {
      title: "Real-time Market Data Ingestion",
      detail:
        "Consume streaming price feeds from 10+ financial data providers via WebSockets with <500ms latency",
    },
    {
      title: "Multi-source Data Aggregation",
      detail:
        "Normalize, deduplicate, and aggregate price data across exchanges with conflict resolution (last-write-wins with timestamp)",
    },
    {
      title: "Historical Query API",
      detail:
        "Serve time-series queries for price history, analytics, and compliance auditing with <100ms p95 latency",
    },
  ],
  nonFunctional: [
    {
      label: "Consistency",
      value:
        "Eventual consistency for ingestion (accept temporary staleness for availability); Strong consistency for compliance queries",
    },
    {
      label: "Latency",
      value:
        "<500ms ingestion-to-storage, <100ms read queries (p95), <5s for complex analytics",
    },
    {
      label: "Availability",
      value: "99.98% uptime (4.3 min/month downtime)",
    },
  ],
  scaleEstimates: `Ingestion Rate:
10 providers × 5,000 symbols × 1 update/sec = 50,000 QPS (writes)
Peak Load (3x): 150,000 QPS

Storage (1 year retention):
50,000 updates/sec × 500 bytes × 86,400 sec/day × 365 days
= 788 TB/year ≈ 2.2 TB/day

Query Load:
100K active users × 50 queries/day / 86,400 = 58 QPS reads
Peak (3x): 174 QPS`,
};

export const DIAGRAM_NODES = [
  {
    id: "client",
    label: "Client",
    sublabel: "React SPA",
    x: 400,
    y: 20,
    color: "accent",
    description:
      "React single-page application rendering real-time market dashboards. Receives Server-Sent Events for live price feeds.",
    connections: ["cdn"],
  },
  {
    id: "cdn",
    label: "CDN",
    sublabel: "CloudFront",
    x: 400,
    y: 110,
    color: "comment",
    description:
      "AWS CloudFront CDN for static assets and edge caching. Reduces latency for geographically distributed clients.",
    connections: ["alb"],
  },
  {
    id: "alb",
    label: "Load Balancer",
    sublabel: "ALB",
    x: 400,
    y: 200,
    color: "comment",
    description:
      "AWS Application Load Balancer distributing traffic across API Gateway instances with health checks and SSL termination.",
    connections: ["api"],
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Kong",
    x: 400,
    y: 290,
    color: "variable",
    description:
      "Central entry point handling authentication, rate limiting, and routing. Routes REST queries to the Query Service.",
    connections: ["query"],
  },
  {
    id: "ws1",
    label: "WS Handler",
    sublabel: "Provider Streams",
    x: 80,
    y: 200,
    color: "success",
    description:
      "WebSocket handler instances maintaining persistent connections to financial data providers (NYSE, NASDAQ, etc.). Publishes raw events to Kafka.",
    connections: ["kafka"],
  },
  {
    id: "kafka",
    label: "Kafka Cluster",
    sublabel: "3 Brokers",
    x: 80,
    y: 340,
    color: "success",
    description:
      "Distributed message broker with 3 brokers across availability zones. Topics partitioned by symbol hash for ordered processing. Replication factor 3 for durability.",
    connections: ["ingest"],
  },
  {
    id: "ingest",
    label: "Ingestion Svc",
    sublabel: "Python",
    x: 80,
    y: 470,
    color: "keyword",
    description:
      "Consumes raw events from Kafka, validates data integrity, and normalizes across provider formats. Publishes normalized events back to Kafka.",
    connections: ["norm"],
  },
  {
    id: "norm",
    label: "Normalization",
    sublabel: "Service",
    x: 280,
    y: 470,
    color: "func",
    description:
      "Standardizes price formats, currency conversions, and symbol mappings across exchanges. Publishes to normalized Kafka topic.",
    connections: ["kafka_norm"],
  },
  {
    id: "agg",
    label: "Aggregation Svc",
    sublabel: "Python",
    x: 480,
    y: 470,
    color: "keyword",
    description:
      "Core component: maintains in-memory OHLCV sliding windows per symbol, deduplicates cross-provider data via Redis, and batch-writes completed buckets to TimescaleDB every 10 seconds.",
    connections: ["timescale", "rabbitmq"],
  },
  {
    id: "query",
    label: "Query Service",
    sublabel: "Django REST",
    x: 620,
    y: 290,
    color: "accent",
    description:
      "Django REST framework serving time-series queries. Checks Redis cache first, queries TimescaleDB for recent data, falls back to S3 for historical data.",
    connections: ["redis", "timescale", "s3"],
  },
  {
    id: "redis",
    label: "Redis Cluster",
    sublabel: "Cache",
    x: 800,
    y: 200,
    color: "keyword",
    description:
      "Sub-millisecond cache for hot-path queries and deduplication keys. Stores recent price snapshots and idempotency keys with 60s TTL.",
    connections: [],
  },
  {
    id: "timescale",
    label: "TimescaleDB",
    sublabel: "Primary Store",
    x: 800,
    y: 340,
    color: "accent",
    description:
      "PostgreSQL extension optimized for time-series. Hypertables auto-partition by time (1-hour chunks for raw, 1-day for aggregated). Supports complex SQL aggregations with ACID guarantees for compliance.",
    connections: [],
  },
  {
    id: "s3",
    label: "S3",
    sublabel: "Cold Storage",
    x: 800,
    y: 470,
    color: "variable",
    description:
      "AWS S3 for archival storage. Data older than 90 days compressed into Parquet files. Cost-optimized with S3 Intelligent-Tiering.",
    connections: [],
  },
  {
    id: "rabbitmq",
    label: "RabbitMQ",
    sublabel: "Task Queue",
    x: 480,
    y: 580,
    color: "func",
    description:
      "Message broker for async background jobs. Routes archival tasks to Celery workers for S3 migration.",
    connections: ["celery"],
  },
  {
    id: "celery",
    label: "Celery Workers",
    sublabel: "Async Jobs",
    x: 660,
    y: 580,
    color: "string",
    description:
      "Distributed task workers compressing and migrating data older than 90 days from TimescaleDB to S3 Parquet files. Runs periodic cleanup and analytics pre-computation.",
    connections: ["s3_archive"],
  },
];

export const DIAGRAM_EDGES = [
  { from: "client", to: "cdn", label: "HTTPS", color: "comment" },
  { from: "cdn", to: "alb", label: "", color: "comment" },
  { from: "alb", to: "api", label: "", color: "comment" },
  { from: "api", to: "query", label: "REST Queries", color: "accent" },
  { from: "ws1", to: "kafka", label: "Raw Events", color: "success" },
  { from: "kafka", to: "ingest", label: "Consume", color: "success" },
  { from: "ingest", to: "norm", label: "Normalized", color: "func" },
  { from: "norm", to: "kafka", label: "Publish", color: "success", offset: 15 },
  { from: "kafka", to: "agg", label: "Aggregated Stream", color: "success" },
  { from: "agg", to: "timescale", label: "Batch Write", color: "accent" },
  { from: "agg", to: "rabbitmq", label: "Async Jobs", color: "func" },
  { from: "rabbitmq", to: "celery", label: "Tasks", color: "string" },
  { from: "celery", to: "s3", label: "Archive", color: "variable" },
  { from: "query", to: "redis", label: "Cache Check", color: "keyword" },
  { from: "query", to: "timescale", label: "Query Recent", color: "accent" },
  { from: "query", to: "s3", label: "Query Historical", color: "variable" },
  { from: "redis", to: "timescale", label: "Cache Miss", color: "comment", dashed: true },
];

export const DATA_FLOWS = {
  write: {
    label: "Ingestion Path",
    color: "success",
    path: ["ws1", "kafka", "ingest", "norm", "agg", "timescale"],
    description:
      "WebSocket Handlers → Kafka → Ingestion Service → Normalization → Aggregation Service → TimescaleDB (batch write every 10s)",
  },
  read: {
    label: "Read Path",
    color: "accent",
    path: ["client", "cdn", "alb", "api", "query", "redis", "timescale", "s3"],
    description:
      "Client → CDN → ALB → API Gateway → Query Service → Redis (cache) → TimescaleDB (recent) → S3 (historical)",
  },
  archive: {
    label: "Archive Path",
    color: "variable",
    path: ["agg", "rabbitmq", "celery", "s3"],
    description:
      "Aggregation Service → RabbitMQ → Celery Workers → S3 Parquet (data >90 days old)",
  },
};

export const APIS = [
  {
    title: "Get Real-Time Price Feed",
    method: "GET",
    endpoint: "/api/v1/market-data/stream?symbols=AAPL,MSFT&providers=nasdaq,nyse",
    request: null,
    response: `{
  "symbol": "AAPL",
  "price": 178.45,
  "volume": 125000,
  "timestamp": "2026-01-23T14:32:15.234Z",
  "provider": "nasdaq",
  "exchange": "NASDAQ"
}`,
  },
  {
    title: "Query Historical Aggregated Data",
    method: "POST",
    endpoint: "/api/v1/analytics/query",
    request: `{
  "symbols": ["AAPL", "MSFT"],
  "start_time": "2026-01-20T00:00:00Z",
  "end_time": "2026-01-23T23:59:59Z",
  "interval": "1m",
  "aggregation": "OHLCV"
}`,
    response: `{
  "data": [
    {
      "symbol": "AAPL",
      "timestamp": "2026-01-23T14:30:00Z",
      "open": 178.20,
      "high": 178.50,
      "low": 178.10,
      "close": 178.45,
      "volume": 1250000
    }
  ]
}`,
  },
];

export const DATA_MODEL = {
  timescaleRaw: `-- Raw ingestion table (hypertable partitioned by time)
CREATE TABLE market_data_raw (
    time           TIMESTAMPTZ NOT NULL,
    symbol         VARCHAR(10) NOT NULL,
    provider       VARCHAR(50) NOT NULL,
    price          DECIMAL(18,6),
    volume         BIGINT,
    metadata       JSONB,
    PRIMARY KEY (time, symbol, provider)
);

SELECT create_hypertable(
  'market_data_raw', 'time',
  chunk_time_interval => INTERVAL '1 hour'
);

CREATE INDEX idx_symbol_time
  ON market_data_raw (symbol, time DESC);`,
  timescaleAgg: `-- Aggregated OHLCV table (1-minute buckets)
CREATE TABLE market_data_1m (
    bucket         TIMESTAMPTZ NOT NULL,
    symbol         VARCHAR(10) NOT NULL,
    open           DECIMAL(18,6),
    high           DECIMAL(18,6),
    low            DECIMAL(18,6),
    close          DECIMAL(18,6),
    volume         BIGINT,
    provider_count INT,
    PRIMARY KEY (bucket, symbol)
);

SELECT create_hypertable(
  'market_data_1m', 'bucket',
  chunk_time_interval => INTERVAL '1 day'
);`,
  redis: `Key Patterns:

1. Deduplication Keys:
   dedup:{provider}:{symbol}:{timestamp}
   Value: "1"  |  TTL: 60s

2. Price Cache (hot symbols):
   price:{symbol}:latest
   Value: {
     "price": 178.45,
     "volume": 125000,
     "timestamp": "2026-01-23T14:32:15Z",
     "provider": "nasdaq"
   }
   TTL: 10s (auto-refresh on new events)

3. Query Cache:
   query:{hash(params)}
   Value: serialized query result
   TTL: 60s`,
  kafka: `Topics:

1. market-data-raw
   Partition Key: symbol (hash)
   Partitions: 50 (matches symbol cardinality)
   Retention: 24 hours
   → Raw events from WebSocket handlers

2. market-data-normalized
   Partition Key: symbol (hash)
   Partitions: 50
   Retention: 12 hours
   → Normalized events after format standardization

Consumer Groups:
  ingestion-service   → reads from market-data-raw
  aggregation-service → reads from market-data-normalized`,
};

export const AGG_PSEUDOCODE = `from collections import defaultdict
from datetime import datetime, timedelta
import redis
import psycopg2

# In-memory state: {(symbol, bucket): OHLCV}
windows = defaultdict(lambda: {
    'open': None, 'high': -inf,
    'low': inf, 'close': None,
    'volume': 0, 'count': 0
})
redis_client = redis.StrictRedis(host='redis-cluster')
db_conn = psycopg2.connect("timescaledb_connection")

def process_event(event):
    symbol = event['symbol']
    price = event['price']
    volume = event['volume']
    timestamp = datetime.fromisoformat(event['timestamp'])
    provider = event['provider']

    # Deduplication check
    dedup_key = f"dedup:{provider}:{symbol}:{timestamp}"
    if redis_client.exists(dedup_key):
        return  # Skip duplicate
    redis_client.setex(dedup_key, 60, "1")

    # Calculate 1-minute bucket
    bucket = timestamp.replace(second=0, microsecond=0)
    key = (symbol, bucket)

    # Update OHLCV incrementally
    window = windows[key]
    if window['open'] is None:
        window['open'] = price
    window['high'] = max(window['high'], price)
    window['low'] = min(window['low'], price)
    window['close'] = price  # Last price in window
    window['volume'] += volume
    window['count'] += 1

def flush_completed_buckets():
    """Flush buckets older than 2 min to TimescaleDB"""
    current_time = datetime.utcnow()
    cutoff = current_time - timedelta(minutes=2)

    batch = []
    for (symbol, bucket), data in list(windows.items()):
        if bucket < cutoff:
            batch.append((
                bucket, symbol,
                data['open'], data['high'],
                data['low'], data['close'],
                data['volume'], data['count']
            ))
            del windows[(symbol, bucket)]

    if batch:
        cursor = db_conn.cursor()
        cursor.executemany(
            """INSERT INTO market_data_1m
               (bucket, symbol, open, high,
                low, close, volume, provider_count)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
               ON CONFLICT (bucket, symbol) DO UPDATE SET
               high = GREATEST(
                 market_data_1m.high, EXCLUDED.high
               ),
               low = LEAST(
                 market_data_1m.low, EXCLUDED.low
               ),
               close = EXCLUDED.close,
               volume = market_data_1m.volume
                        + EXCLUDED.volume""",
            batch
        )
        db_conn.commit()`;

export const OPTIMIZATIONS = [
  {
    title: "In-Memory Windowing",
    detail:
      "Maintain OHLCV sliding windows per symbol in memory — update incrementally as events arrive, flush to DB only when window closes. Avoids 50K individual DB writes/sec.",
    icon: "⚡",
  },
  {
    title: "Batch Writes",
    detail:
      "Flush completed 1-minute buckets every 10 seconds (~30K rows per batch). TimescaleDB's hypertable partitioning handles bulk inserts efficiently.",
    icon: "📦",
  },
  {
    title: "Redis Deduplication",
    detail:
      "Idempotency keys (dedup:{provider}:{symbol}:{ts}) with 60s TTL prevent duplicate processing across multi-provider data for the same symbol.",
    icon: "🔄",
  },
  {
    title: "Async Archival",
    detail:
      "Celery workers compress data >90 days into S3 Parquet files via RabbitMQ task queue — keeps TimescaleDB lean for real-time queries.",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Kafka Cluster",
    problem:
      "If Kafka brokers fail, the ingestion pipeline halts — no buffering for WebSocket data, causing data loss from financial providers.",
    mitigations: [
      "Deploy Kafka across 3 Availability Zones with replication factor 3",
      "Use Kafka MirrorMaker for disaster recovery to standby region",
      "Configure producer acknowledgment acks=all to ensure durability",
      "WebSocket handlers include local disk buffering (10-minute ring buffer) to survive transient Kafka outages",
    ],
  },
  tradeoff: {
    title: "Eventual vs Strong Consistency",
    decision:
      "Eventual Consistency for real-time ingestion path, Strong Consistency for compliance queries.",
    rationale: [
      "Availability Priority: During network partitions, the ingestion pipeline must continue accepting data from providers (choosing A over C in CAP)",
      "Partition Tolerance: Multi-region deployment requires tolerating network splits between Kafka clusters and TimescaleDB",
      "Performance: Accepting eventual consistency reduced ingestion latency from 2.1s (synchronous writes) to 480ms (batch writes), meeting the <500ms SLA",
      "When Strong Consistency Applies: Compliance queries (/api/v1/compliance/audit-trail) use TimescaleDB READ COMMITTED isolation with synchronous read replicas",
    ],
    rejected:
      "Synchronous writes to TimescaleDB on every event would guarantee strong consistency but reduce throughput from 150K QPS to ~8K QPS (18x reduction), making the platform unable to handle peak ingestion load from 10+ providers.",
  },
};

export const SUMMARY =
  "This platform processes 50K events/sec from 10+ financial data providers with <500ms ingestion latency and <100ms query response (p95). The architecture decouples ingestion via Kafka, uses in-memory OHLCV windowing to avoid per-event DB writes, and batch-flushes to TimescaleDB every 10 seconds. Redis handles deduplication and query caching, while Celery workers archive cold data to S3 Parquet. The system achieves 99.98% uptime with eventual consistency on the write path and strong consistency for compliance queries — processing 1.8M records/hour with 2.2 TB/day storage throughput.";
