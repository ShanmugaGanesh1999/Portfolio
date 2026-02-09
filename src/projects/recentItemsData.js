// ============================================================
// RECENT ITEMS SYSTEM DESIGN — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "Zoho CRM Recent Items Feature",
  subtitle: "System Design Deep Dive",
  company: "Zoho Corporation",
  role: "MTS Full Stack Developer",
  period: "JAN 2022 – DEC 2023",
  tags: ["JAVA", "KAFKA", "REDIS", "POSTGRESQL", "MICROSERVICES"],
  status: "PRODUCTION",
};

export const REQUIREMENTS = {
  functional: [
    {
      title: "Track User Activity",
      detail:
        "Record the last 20 viewed/modified records per user across all CRM modules (Leads, Contacts, Deals, Tasks, etc.)",
    },
    {
      title: "Real-time Retrieval",
      detail:
        "Fetch recent items list in <100ms when user opens the dropdown, sorted by timestamp",
    },
    {
      title: "Module Filtering",
      detail:
        "Display record type, ID, name, and timestamp with ability to navigate directly to record detail page",
    },
  ],
  nonFunctional: [
    {
      label: "Consistency",
      value:
        "Eventual Consistency (acceptable 1-2 second delay for recent items to appear; immediate navigation is more critical)",
    },
    {
      label: "Latency",
      value: "P95 read latency <100ms, write latency <50ms (async acceptable)",
    },
    {
      label: "Availability",
      value: "99.9% uptime (brief staleness acceptable over downtime)",
    },
  ],
  scaleEstimates: `Write Load (Activity Tracking):
500K users × 50 actions/day / 86400 seconds ≈ 290 writes/sec
Peak (3x): ~870 writes/sec

Read Load (Dropdown Opens):
500K users × 10 dropdown opens/day / 86400 ≈ 58 reads/sec
Peak (3x): ~175 reads/sec

Storage (Per User):
20 items × 200 bytes/item = 4 KB/user
500K users × 4 KB = 2 GB active storage (recent items only)
Historical archive (1 year): ~365 TB (if retaining all activity logs)

Key Insight: Read-heavy on recent 20 items, write-heavy
on activity stream. Redis cache absorbs 90%+ of reads.`,
};

export const DIAGRAM_NODES = [
  {
    id: "client",
    label: "Web Client",
    sublabel: "React",
    shape: "stadium",
    x: 400,
    y: 30,
    color: "accent",
    description:
      "End-user interface (React) that sends HTTPS requests to the API Gateway and renders the recent items dropdown.",
    connections: ["lb"],
  },
  {
    id: "lb",
    label: "Load Balancer",
    sublabel: "ALB",
    shape: "rect",
    x: 400,
    y: 130,
    color: "comment",
    description:
      "AWS Application Load Balancer distributing traffic across API Gateway instances with health checks.",
    connections: ["api"],
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Kong",
    shape: "rect",
    x: 400,
    y: 230,
    color: "variable",
    description:
      "Central entry point handling authentication, rate limiting, and routing. Routes requests to Auth, Recent Items, and Record services.",
    connections: ["auth", "recent", "records"],
  },
  {
    id: "auth",
    label: "Auth Service",
    sublabel: "JWT Validation",
    shape: "rect",
    x: 130,
    y: 230,
    color: "func",
    description:
      "Validates JWT tokens on every request. Extracts user_id for downstream services.",
    connections: [],
  },
  {
    id: "recent",
    label: "Recent Items",
    sublabel: "Service",
    shape: "rect",
    x: 250,
    y: 370,
    color: "accent",
    description:
      "Core service for fetching a user's recent items. First checks Redis Sorted Set cache, falls back to PostgreSQL on cache miss. Returns top 20 items in 10-20ms (cache hit).",
    connections: ["redis", "pg_activity"],
  },
  {
    id: "records",
    label: "Record Service",
    sublabel: "CRUD for Leads/Deals",
    shape: "rect",
    x: 580,
    y: 370,
    color: "keyword",
    description:
      "Handles all CRUD operations on CRM records (Leads, Deals, Contacts, etc.). Writes to RecordDB and publishes activity events to Kafka.",
    connections: ["recorddb", "kafka"],
  },
  {
    id: "redis",
    label: "Redis Cluster",
    sublabel: "Sorted Sets",
    shape: "cyl",
    x: 100,
    y: 490,
    color: "keyword",
    description:
      "Redis Sorted Sets keyed by user_id, scored by timestamp. ZADD for insert, ZREVRANGE 0 19 to fetch top 20, ZREMRANGEBYRANK to cap at 20 items. Sub-millisecond reads.",
    connections: [],
  },
  {
    id: "pg_activity",
    label: "PostgreSQL",
    sublabel: "Activity Table",
    shape: "cyl",
    x: 380,
    y: 490,
    color: "accent",
    description:
      "Primary persistent store for user_activity table. Partitioned by user_id hash for horizontal scaling. Index on (user_id, timestamp DESC) for efficient recent item queries.",
    connections: [],
  },
  {
    id: "kafka",
    label: "Kafka",
    sublabel: "record.activity",
    shape: "das",
    x: 680,
    y: 490,
    color: "success",
    description:
      "Kafka topic 'record.activity' receives events from Record Service. Partitioned by user_id hash for ordered processing per user.",
    connections: ["consumer"],
  },
  {
    id: "consumer",
    label: "Activity Consumer",
    sublabel: "Async Writer",
    shape: "fr-rect",
    x: 500,
    y: 600,
    color: "func",
    description:
      "Consumes Kafka events, deduplicates rapid repeated actions via batch buffer (100ms window), batch-inserts into PostgreSQL, and updates Redis cache via pipelining. Critical bottleneck component.",
    connections: ["pg_write", "redis_write"],
  },
  {
    id: "recorddb",
    label: "PostgreSQL",
    sublabel: "Leads, Deals, Contacts",
    shape: "cyl",
    x: 800,
    y: 370,
    color: "accent",
    description:
      "Primary database for CRM records — Leads, Deals, Contacts, Tasks, etc. Source of truth for record data.",
    connections: [],
  },
];

export const DIAGRAM_EDGES = [
  { from: "client", to: "lb", label: "HTTPS", color: "comment" },
  { from: "lb", to: "api", label: "", color: "comment" },
  { from: "api", to: "auth", label: "JWT", color: "func" },
  { from: "api", to: "recent", label: "GET recent", color: "accent" },
  { from: "api", to: "records", label: "CRUD", color: "keyword" },
  { from: "recent", to: "redis", label: "Read Cache", color: "keyword" },
  { from: "recent", to: "pg_activity", label: "Cache Miss", color: "accent", dashed: true },
  { from: "records", to: "recorddb", label: "Write Record", color: "accent" },
  { from: "records", to: "kafka", label: "Publish Event", color: "success" },
  { from: "kafka", to: "consumer", label: "Consume", color: "success" },
  { from: "consumer", to: "pg_activity", label: "Batch Upsert", color: "accent" },
  { from: "consumer", to: "redis", label: "Update Cache", color: "keyword" },
];

export const DATA_FLOWS = {
  write: {
    label: "Write Path",
    color: "keyword",
    path: ["client", "lb", "api", "records", "recorddb", "kafka", "consumer", "pg_activity", "redis"],
    description:
      "User modifies Lead → Record Service writes to RecordDB → Publishes event to Kafka → Consumer updates PostgreSQL activity table + updates Redis cache",
  },
  read: {
    label: "Read Path",
    color: "accent",
    path: ["client", "lb", "api", "recent", "redis", "pg_activity"],
    description:
      "User opens dropdown → Recent Items Service checks Redis (Sorted Set with timestamp scores) → Returns top 20 items in 10-20ms",
  },
};

export const APIS = [
  {
    title: "Get Recent Items",
    method: "GET",
    endpoint: "/api/v1/users/{user_id}/recent-items?limit=20",
    request: null,
    response: `{
  "items": [
    {
      "record_id": "lead_12345",
      "module": "Leads",
      "name": "Acme Corp - Enterprise Deal",
      "action": "modified",
      "timestamp": "2026-01-23T14:32:10Z",
      "url": "/crm/leads/12345"
    },
    ...
  ],
  "cached": true
}`,
  },
  {
    title: "Track Activity (Internal Async)",
    method: "POST",
    endpoint: "/internal/v1/activity/track",
    request: `{
  "user_id": "user_789",
  "record_id": "deal_67890",
  "module": "Deals",
  "record_name": "Q1 2026 Cloud Migration",
  "action": "viewed",
  "timestamp": "2026-01-23T14:35:22Z"
}`,
    response: `202 Accepted`,
  },
];

export const DATA_MODEL = {
  postgres: `-- Partition by user_id hash for horizontal scaling
CREATE TABLE user_activity (
  id BIGSERIAL,
  user_id VARCHAR(50) NOT NULL,          -- Partition Key
  record_id VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,            -- Leads, Deals, Contacts...
  record_name TEXT,
  action VARCHAR(20),                     -- viewed, modified, created
  timestamp TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, id)
) PARTITION BY HASH (user_id);

-- Index for efficient recent item queries
CREATE INDEX idx_user_timestamp
  ON user_activity (user_id, timestamp DESC);`,
  redis: `Key Pattern: recent_items:{user_id}
Data Structure: Sorted Set (ZSET)

ZADD recent_items:user_789
  1706021732 "lead_12345|Leads|Acme Corp|modified"
  1706021610 "deal_67890|Deals|Q1 Migration|viewed"

Commands:
  ZADD           → insert with timestamp score
  ZREVRANGE 0 19 → fetch top 20 items
  ZREMRANGEBYRANK 0 -21 → keep only 20 items

Complexity:
  Insert:  O(log N)
  Range:   O(log N + M) where M = 20
  Trim:    O(log N + K) where K = items removed`,
  kafka: `Topic: record.activity
Partition Key: user_id (hash)
  → Ensures ordered processing per user

Payload: {
  "user_id": "user_789",
  "record_id": "deal_67890",
  "module": "Deals",
  "record_name": "Q1 2026 Cloud Migration",
  "action": "viewed",
  "timestamp": "2026-01-23T14:35:22Z"
}

Consumer Group: activity-writer
Partitions: 10 (matches consumer count)`,
};

export const CONSUMER_PSEUDOCODE = `class ActivityConsumer:
    def __init__(self):
        self.redis = RedisClient(host='redis-cluster')
        self.pg_conn = PostgreSQLClient("dbname=crm_activity")
        self.batch_buffer = defaultdict(dict)
        self.BATCH_WINDOW_MS = 100
        self.MAX_RECENT_ITEMS = 20

    async def consume_kafka_stream(self):
        consumer = KafkaConsumer(
            'record.activity', group_id='activity-writer'
        )

        while True:
            messages = consumer.poll(
                timeout_ms=self.BATCH_WINDOW_MS
            )

            # Deduplicate: Keep latest action per user+record
            for topic_partition, records in messages.items():
                for record in records:
                    activity = record.value
                    user_id = activity['user_id']
                    record_id = activity['record_id']

                    # Overwrite duplicate activities in window
                    self.batch_buffer[user_id][record_id] = activity

            await self.flush_batch()

    async def flush_batch(self):
        if not self.batch_buffer:
            return

        # Flatten buffer for batch insert
        all_activities = [
            act for user_acts in self.batch_buffer.values()
            for act in user_acts.values()
        ]

        # Batch PostgreSQL insert (1 query for 100+ rows)
        with self.pg_conn.cursor() as cur:
            cur.executemany(
                """INSERT INTO user_activity
                   (user_id, record_id, module,
                    record_name, action, timestamp)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                [(a['user_id'], a['record_id'], a['module'],
                  a['record_name'], a['action'], a['timestamp'])
                 for a in all_activities]
            )

        # Redis pipeline: Update cache atomically per user
        pipe = self.redis.pipeline()
        for user_id, user_activities in self.batch_buffer.items():
            cache_key = f"recent_items:{user_id}"

            for activity in user_activities.values():
                member = (
                    f"{activity['record_id']}|"
                    f"{activity['module']}|"
                    f"{activity['record_name']}|"
                    f"{activity['action']}"
                )
                pipe.zadd(cache_key, {
                    member: activity['timestamp']
                })

            # Keep only top 20 items
            pipe.zremrangebyrank(
                cache_key, 0,
                -(self.MAX_RECENT_ITEMS + 1)
            )
            pipe.expire(cache_key, 86400)  # 24h TTL

        pipe.execute()
        self.batch_buffer.clear()`;

export const OPTIMIZATIONS = [
  {
    title: "Batch Deduplication",
    detail:
      "100ms batch window deduplicates rapid repeated actions (user clicks 'Save' 5 times → 1 DB write). Reduces DB writes by ~60%.",
    icon: "🔄",
  },
  {
    title: "Redis Pipelining",
    detail:
      "50 Redis commands in 1 network round trip → 5x throughput vs. sequential commands. ZADD + ZREMRANGEBYRANK atomic per user.",
    icon: "⚡",
  },
  {
    title: "Kafka Partitioning",
    detail:
      "Partition by user_id hash guarantees all activities for a user go to same consumer — in-order processing without distributed locking.",
    icon: "📦",
  },
  {
    title: "Consumer Scaling",
    detail:
      "10 consumer instances (matches partition count): 870 writes/sec / 10 = 87 writes/sec per consumer. Linearly scalable.",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Redis Cluster Failure",
    problem:
      "If Redis goes down, all 175 QPS read requests hit PostgreSQL → query latency spikes from 15ms to 200ms+ (index scan on 2GB table).",
    mitigations: [
      "Deploy Redis in cluster mode with 3 master nodes + 3 replicas across availability zones",
      "Enable automatic failover (Redis Sentinel or AWS ElastiCache with Multi-AZ)",
      "Implement circuit breaker in Recent Items Service: after 3 consecutive Redis timeouts, skip cache and query PostgreSQL with LIMIT 20 (degraded mode)",
    ],
  },
  tradeoff: {
    title: "Eventual Consistency vs Strong Consistency",
    decision: "Chose Eventual Consistency (1-2 second lag between activity and dropdown update).",
    rationale: [
      "CAP Theorem Position: Prioritize Availability + Partition Tolerance over Consistency. During Kafka backlog, users still see recent items (slightly stale) rather than failing requests.",
      "User Experience: Users tolerate 1-2s delay seeing their last action in dropdown — instant dropdown open (<100ms) is more critical than perfect real-time accuracy.",
      "Performance Gain: Async writes via Kafka decouple Record Service from activity logging → Record Service p95 stays <50ms. Synchronous writes would add 20-30ms per request.",
    ],
    rejected:
      "Strong consistency (synchronous write to PostgreSQL + Redis) would increase Record Service latency by 40%+, create tight coupling (activity logging failure blocks core CRM operations), and reduce availability during PostgreSQL maintenance windows.",
  },
};

export const SUMMARY =
  "This system tracks recent items for 500K DAU at <100ms read latency by decoupling writes via Kafka, deduplicating with 100ms batch windows, and caching aggressively in Redis Sorted Sets. The architecture handles 870 peak writes/sec across 10 partitioned consumers and absorbs 90%+ of reads from Redis cache. Eventual consistency is an intentional trade-off: users get instant dropdown access (<15ms cache hits) while activity logging happens asynchronously without impacting core CRM performance.";
