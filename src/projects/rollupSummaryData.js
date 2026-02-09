// ============================================================
// ROLLUP SUMMARY SYSTEM DESIGN — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "Zoho CRM Rollup Summary Field System",
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
      title: "Aggregate Calculations",
      detail:
        "Support Sum, Count, Average, Max, Min, and Date functions (Earliest, Latest, Recent, Upcoming) on related records with optional filter criteria",
    },
    {
      title: "Real-time Updates",
      detail:
        "Propagate changes from child record modifications (create/edit/delete) to parent rollup fields within 100ms for interactive workflows",
    },
    {
      title: "Batch Initialization",
      detail:
        "Populate rollup fields with historical data when new rollup definitions are created, processing existing relationships",
    },
  ],
  nonFunctional: [
    {
      label: "Consistency",
      value:
        "Eventual consistency acceptable (users tolerate 100-500ms delay for rollup updates after child record changes)",
    },
    {
      label: "Latency",
      value: "P99 < 100ms for rollup recalculation, P99 < 50ms for rollup field reads",
    },
    {
      label: "Availability",
      value: "99.9% uptime for read path; async write path tolerates brief degradation",
    },
  ],
  scaleEstimates: `Child Record Modifications:
1M users × 40% DAU × 20 writes/day / 86400 = ~93 QPS write events
Peak (3x) = 280 QPS triggering rollup recalculations

Rollup Reads (embedded in parent record fetches):
1M users × 40% DAU × 50 reads/day / 86400 = ~232 QPS
Peak = 700 QPS rollup field reads

Storage (per organization):
500K accounts × 10 rollup fields × 8 bytes = 40 MB rollup values
5M child records × 200 bytes metadata = 1 GB child data
Total: ~1 GB/org → 100 TB across 100K orgs`,
};

export const DIAGRAM_NODES = [
  {
    id: "client",
    label: "Client",
    sublabel: "Web/Mobile",
    x: 400,
    y: 30,
    color: "accent",
    description:
      "End-user interface (browser or mobile app) that sends HTTPS requests to the API Gateway and receives real-time updates via WebSocket.",
    connections: ["api"],
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Kong",
    x: 400,
    y: 130,
    color: "variable",
    description:
      "Central entry point handling authentication, rate limiting, and routing. Routes requests to the Record Service.",
    connections: ["recsvc"],
  },
  {
    id: "recsvc",
    label: "Record Service",
    sublabel: "Java",
    x: 400,
    y: 240,
    color: "keyword",
    description:
      "Core service handling child record CRUD operations. Writes to PostgreSQL, publishes events to Kafka, and reads rollup values from Redis cache.",
    connections: ["pg", "kafka", "redis_read"],
  },
  {
    id: "kafka",
    label: "Kafka",
    sublabel: "Record Change Stream",
    x: 700,
    y: 240,
    color: "success",
    description:
      "Distributed message broker. Partitioned by parent_record_id to ensure ordered processing per parent and avoid race conditions.",
    connections: ["rollupsvc"],
  },
  {
    id: "rollupsvc",
    label: "Rollup Engine",
    sublabel: "Java",
    x: 700,
    y: 370,
    color: "func",
    description:
      "Core processing engine. Consumes Kafka events, fetches rollup definitions, executes incremental or full aggregations, updates PostgreSQL + Redis, and triggers workflows.",
    connections: ["cstore", "pg_agg", "redis_write", "pg_update", "wms"],
  },
  {
    id: "pg",
    label: "PostgreSQL",
    sublabel: "Transactional Data",
    x: 200,
    y: 370,
    color: "accent",
    description:
      "Primary RDBMS for strong consistency on record writes. Stores parent and child module records. Sharded by org_id for tenant isolation.",
    connections: [],
  },
  {
    id: "redis",
    label: "Redis",
    sublabel: "Rollup Cache",
    x: 400,
    y: 480,
    color: "keyword",
    description:
      "Sub-millisecond cache for rollup values. Key pattern: rollup:{org_id}:{parent_id}:{field}. TTL-based invalidation (1 hour), invalidated on child record changes.",
    connections: [],
  },
  {
    id: "cstore",
    label: "Column Store",
    sublabel: "Rollup Definitions",
    x: 900,
    y: 480,
    color: "variable",
    description:
      "Optimized analytical storage (e.g., ClickHouse) for rollup field configurations. Stores aggregation function, target fields, filter criteria. Cached in-memory via Caffeine.",
    connections: [],
  },
  {
    id: "batch",
    label: "Batch Processor",
    sublabel: "Spark",
    x: 100,
    y: 480,
    color: "success",
    description:
      "Handles initial rollup population when new rollup definitions are created. Performs bulk aggregation over historical child records and warms the Redis cache.",
    connections: ["cstore_batch", "pg_batch", "redis_batch"],
  },
  {
    id: "wms",
    label: "Workflow Mgmt",
    sublabel: "Service",
    x: 900,
    y: 370,
    color: "string",
    description:
      "Triggered when rollup values cross configured thresholds. Sends in-app notifications via WebSocket to connected clients.",
    connections: ["notif"],
  },
];

export const DIAGRAM_EDGES = [
  { from: "client", to: "api", label: "HTTPS", color: "comment" },
  { from: "api", to: "recsvc", label: "", color: "comment" },
  { from: "recsvc", to: "pg", label: "Write Child Record", color: "accent" },
  { from: "recsvc", to: "kafka", label: "Publish Event", color: "success" },
  { from: "kafka", to: "rollupsvc", label: "Consume", color: "success" },
  { from: "rollupsvc", to: "cstore", label: "Read Metadata", color: "variable" },
  { from: "rollupsvc", to: "pg", label: "Aggregate Query", color: "accent" },
  { from: "rollupsvc", to: "redis", label: "Cache Result", color: "keyword" },
  { from: "rollupsvc", to: "pg", label: "Update Parent", color: "accent", offset: 20 },
  { from: "rollupsvc", to: "wms", label: "Trigger", color: "string" },
  { from: "recsvc", to: "redis", label: "Read Rollup", color: "keyword" },
  { from: "redis", to: "pg", label: "Cache Miss", color: "comment", dashed: true },
  { from: "batch", to: "pg", label: "Bulk Aggregate", color: "accent" },
  { from: "batch", to: "redis", label: "Warm Cache", color: "keyword" },
  { from: "batch", to: "cstore", label: "Initial Rollup", color: "variable" },
  { from: "wms", to: "client", label: "WebSocket", color: "string" },
];

export const DATA_FLOWS = {
  write: {
    label: "Write Path",
    color: "keyword",
    path: ["client", "api", "recsvc", "pg", "kafka", "rollupsvc", "redis", "pg"],
    description: "Client → Record Service → PostgreSQL → Kafka → Rollup Engine → Redis/PostgreSQL",
  },
  read: {
    label: "Read Path",
    color: "accent",
    path: ["client", "api", "recsvc", "redis", "pg"],
    description: "Client → Record Service → Redis (cache) → PostgreSQL (miss)",
  },
  batch: {
    label: "Batch Path",
    color: "success",
    path: ["batch", "cstore", "pg", "redis"],
    description:
      "Scheduled Job → Spark → PostgreSQL → Redis (for new rollup definitions)",
  },
};

export const APIS = [
  {
    title: "Create/Update Child Record (Triggers Rollup)",
    method: "POST",
    endpoint: "/api/v1/modules/{module}/records",
    request: `{
  "parent_id": "acc_12345",
  "fields": {
    "invoice_amount": 5000.00,
    "status": "Paid",
    "invoice_date": "2026-01-15"
  }
}`,
    response: `{
  "record_id": "inv_67890",
  "parent_rollups_triggered": [
    "total_revenue",
    "paid_invoice_count"
  ],
  "status": "processing"
}`,
  },
  {
    title: "Read Parent Record with Rollups",
    method: "GET",
    endpoint: "/api/v1/modules/accounts/records/acc_12345?fields=name,total_revenue,avg_deal_size",
    request: null,
    response: `{
  "record_id": "acc_12345",
  "name": "Acme Corp",
  "total_revenue": 125000.00,
  "avg_deal_size": 25000.00,
  "_rollup_metadata": {
    "total_revenue": {
      "last_updated": "2026-01-23T10:30:15Z",
      "record_count": 5
    },
    "avg_deal_size": {
      "last_updated": "2026-01-23T09:15:42Z",
      "record_count": 12
    }
  }
}`,
  },
];

export const DATA_MODEL = {
  postgres: `-- Parent Module (e.g., Accounts)
accounts (
  id UUID PRIMARY KEY,
  org_id BIGINT,
  name VARCHAR(255),
  total_revenue DECIMAL(15,2),   -- Rollup field
  paid_invoice_count INT,         -- Rollup field
  updated_at TIMESTAMP,
  INDEX(org_id, updated_at)
)

-- Child Module (e.g., Invoices)
invoices (
  id UUID PRIMARY KEY,
  org_id BIGINT,
  account_id UUID,               -- FK → accounts
  amount DECIMAL(15,2),
  status VARCHAR(50),
  invoice_date DATE,
  created_at TIMESTAMP,
  INDEX(account_id, status),
  FOREIGN KEY(account_id) REFERENCES accounts(id)
)`,
  columnStore: `-- Rollup field configurations
rollup_definitions (
  id BIGINT PRIMARY KEY,
  org_id BIGINT,                 -- Partition Key
  parent_module VARCHAR(100),
  child_module VARCHAR(100),
  field_name VARCHAR(100),
  aggregation_function ENUM(
    'SUM','COUNT','AVG','MAX','MIN'
  ),
  child_field VARCHAR(100),
  filter_criteria JSON,
  created_at TIMESTAMP
)`,
  redis: `Key Pattern:
  rollup:{org_id}:{parent_record_id}:{rollup_field_name}

Value:
  {
    "value": 125000.00,
    "updated_at": "2026-01-23T10:30:15Z",
    "record_count": 5
  }

TTL: 3600s (invalidated on child record changes)`,
  kafka: `Topic: record.changes.{module_name}
Partition Key: parent_record_id
  → Ensures ordered processing per parent

Payload: {
  "event_type": "CREATE|UPDATE|DELETE",
  "record_id": "...",
  "parent_id": "...",
  "changed_fields": {...},
  "org_id": "..."
}`,
};

export const ENGINE_PSEUDOCODE = `class RollupEngine:
    def __init__(self):
        self.rollup_def_cache = InMemoryCache()  # Caffeine
        self.redis = RedisClient()
        self.postgres = PostgreSQLClient()

    def process_record_change_event(self, event):
        parent_id = event['parent_id']
        org_id = event['org_id']
        child_module = event['module']
        changed_fields = event['changed_fields']
        event_type = event['event_type']

        # Fetch rollup definitions
        rollup_defs = self.get_rollup_definitions(
            org_id, child_module
        )

        for rollup_def in rollup_defs:
            # Decide incremental vs full
            if self.can_use_incremental(
                rollup_def, event_type, changed_fields
            ):
                new_value = self.incremental_update(
                    rollup_def, event, parent_id
                )
            else:
                new_value = self.full_aggregation(
                    rollup_def, parent_id
                )

            # Atomic update: PostgreSQL + Redis
            with self.postgres.transaction():
                self.postgres.update(
                    f"UPDATE {rollup_def.parent_module} "
                    f"SET {rollup_def.field_name} = %s "
                    f"WHERE id = %s",
                    (new_value, parent_id)
                )
                self.redis.set(
                    f"rollup:{org_id}:{parent_id}:"
                    f"{rollup_def.field_name}",
                    json.dumps({
                        "value": new_value,
                        "updated_at": now(),
                        "record_count": event['child_count']
                    }),
                    ex=3600
                )

            # Trigger workflows if threshold crossed
            self.check_and_trigger_workflows(
                parent_id, rollup_def.field_name, new_value
            )

    def incremental_update(self, rollup_def, event, parent_id):
        cached = self.redis.get(
            f"rollup:{event['org_id']}:{parent_id}:"
            f"{rollup_def.field_name}"
        )
        current = json.loads(cached)['value'] if cached else 0

        if rollup_def.function == 'SUM':
            delta = event['changed_fields'].get(
                rollup_def.child_field, 0
            )
            if event['event_type'] == 'DELETE':
                delta = -delta
            return current + delta

        elif rollup_def.function == 'COUNT':
            return current + (
                1 if event['event_type'] == 'CREATE' else -1
            )

    def full_aggregation(self, rollup_def, parent_id):
        query = f"""
            SELECT {rollup_def.function}({rollup_def.child_field})
            FROM {rollup_def.child_module}
            WHERE parent_id = %s
            AND {self.build_filter(rollup_def.filter_criteria)}
        """
        result = self.postgres.execute(query, (parent_id,))
        return result[0][0] if result else 0

    def can_use_incremental(self, rollup_def, event_type, fields):
        return (
            rollup_def.function in ['SUM', 'COUNT']
            and not rollup_def.filter_criteria
            and rollup_def.child_field in fields
        )`;

export const OPTIMIZATIONS = [
  {
    title: "Incremental Updates",
    detail:
      "For 80% of cases (Sum/Count), avoid re-scanning millions of child records by applying deltas",
    icon: "⚡",
  },
  {
    title: "Definition Caching",
    detail:
      "In-memory Caffeine cache prevents repeated Column Store lookups (cache hit rate ~95%)",
    icon: "📦",
  },
  {
    title: "Batch Updates",
    detail:
      "Group multiple rollup updates for same parent in single PostgreSQL transaction (reduces lock contention)",
    icon: "🔄",
  },
  {
    title: "Dead Letter Queue",
    detail:
      "Failed aggregations routed to DLQ for manual retry, preventing Kafka consumer lag",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Kafka Consumer Group for Rollup Engine",
    problem:
      "If the Rollup Engine consumer group falls behind (e.g., due to PostgreSQL slowdown or spike in child record writes), rollup updates are delayed, breaking the 100ms real-time SLA and causing stale data in workflows.",
    mitigations: [
      "Auto-scaling Consumers: Deploy Rollup Engine as Kubernetes pods with HPA based on Kafka consumer lag metric (scale from 3 to 20 instances)",
      "Prioritized Processing: Separate Kafka topics for high-priority rollups (e.g., revenue fields) vs low-priority (e.g., contact counts)",
      "Circuit Breaker: If PostgreSQL query latency exceeds 200ms, temporarily pause full aggregations and rely on cached values",
    ],
  },
  tradeoff: {
    title: "Eventual Consistency vs Strong Consistency",
    decision: "Chose Eventual Consistency for rollup updates.",
    rationale: [
      "In a distributed system with Kafka async processing, achieving strong consistency would require 2PC or distributed transactions, adding 50-100ms latency to every child record write",
      "With eventual consistency, child record writes complete in <10ms (PostgreSQL insert + Kafka publish), and rollup updates happen asynchronously within 100-500ms",
      "For critical rollups (e.g., financial totals), implement read-time consistency checks: if Redis cache is >5 seconds stale, trigger synchronous re-aggregation",
    ],
    rejected:
      "Synchronous rollup updates within the child record write transaction would guarantee consistency but degrade P99 write latency from 10ms to 80ms, unacceptable for interactive CRM workflows with 280 QPS peak writes.",
  },
};

export const SUMMARY =
  "This system handles 6,500+ aggregation tasks/week (~15 tasks/minute) at <100ms latency by decoupling writes via Kafka, using incremental updates for 80% of cases, and caching aggressively in Redis. The architecture scales horizontally (partition Kafka by parent ID, shard PostgreSQL by org) and degrades gracefully under load (eventual consistency, circuit breakers). The Rollup Engine's incremental logic is the differentiator, avoiding full table scans for Sum/Count operations while falling back to full aggregation for complex functions.";
