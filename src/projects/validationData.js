// ============================================================
// RECORD VALIDATION SYSTEM DESIGN — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "Record Validation System at Scale",
  subtitle: "NIO Async Processing Pipeline",
  company: "Zoho Corporation",
  role: "MTS Full Stack Developer",
  period: "JAN 2022 – DEC 2023",
  tags: ["JAVA", "KAFKA", "REDIS", "POSTGRESQL", "NIO"],
  status: "PRODUCTION",
};

export const REQUIREMENTS = {
  functional: [
    {
      title: "Real-time Validation",
      detail:
        "Validate records on create/edit operations across forms, layouts, and APIs with <200ms latency. Support regex, criteria-based, custom function, and external API rules.",
    },
    {
      title: "Bulk Validation",
      detail:
        "Process batch validation jobs (up to 5M records/hour) via async processing pipeline using NIO workers with Kafka-based job distribution.",
    },
    {
      title: "Rule Management",
      detail:
        "Support CRUD operations for validation rules — regex patterns, criteria-based checks, custom functions, and external API calls with priority ordering.",
    },
  ],
  nonFunctional: [
    {
      label: "Consistency",
      value:
        "Strong consistency for rule updates (prevent stale rules); Eventual consistency for validation telemetry/metrics",
    },
    {
      label: "Latency",
      value:
        "<100ms for real-time validation, <1 hour for bulk validation of 5M records",
    },
    {
      label: "Availability",
      value: "99.9% uptime for validation API",
    },
  ],
  scaleEstimates: `Assumptions:
- 500K DAU, 80% create/edit records, 15 operations/day/user

Real-time QPS:
500,000 × 0.8 × 15 / 86,400 = 69 QPS
Peak (3x) = ~210 QPS

Bulk Validation Throughput:
5M records/hour = 1,389 records/sec
NIO workers process 1,000 records/batch concurrently

Storage Estimates:
- Validation rules: 10K active rules × 5KB avg = 50 MB (negligible)
- Validation logs (30 days):
  500K DAU × 15 ops × 30 days × 2KB/log = 450 GB`,
};

export const DIAGRAM_NODES = [
  {
    id: "client",
    label: "Client",
    sublabel: "Web/Mobile/API",
    x: 440,
    y: 20,
    color: "accent",
    description:
      "End-user interface (browser, mobile, or API consumer). Sends validation requests through the API Gateway for real-time or bulk operations.",
  },
  {
    id: "lb",
    label: "Load Balancer",
    sublabel: "AWS ALB",
    x: 440,
    y: 110,
    color: "comment",
    description:
      "AWS Application Load Balancer distributing traffic across API Gateway instances with health checks and SSL termination.",
  },
  {
    id: "gateway",
    label: "API Gateway",
    sublabel: "Kong",
    x: 440,
    y: 200,
    color: "variable",
    description:
      "Central entry point handling authentication, rate limiting, and routing. Routes requests to Validation API or Rule Management API.",
  },
  {
    id: "valapi",
    label: "Validation API",
    sublabel: "Java",
    x: 240,
    y: 310,
    color: "keyword",
    description:
      "Real-time validation service. Fetches rules from Redis, applies validation logic, and returns results in <100ms. Queues bulk jobs to Kafka.",
  },
  {
    id: "ruleapi",
    label: "Rule Mgmt API",
    sublabel: "Java",
    x: 640,
    y: 310,
    color: "func",
    description:
      "Manages CRUD operations for validation rules. Writes to PostgreSQL, invalidates Redis cache via pub/sub to ensure strong consistency for rule updates.",
  },
  {
    id: "rulecache",
    label: "Redis",
    sublabel: "Rule Cache",
    x: 440,
    y: 420,
    color: "keyword",
    description:
      "Caches compiled validation rules per module with 5-min TTL. Pub/sub invalidation on rule updates ensures workers always fetch latest rules. Clustered across 3 AZs.",
  },
  {
    id: "ruledb",
    label: "PostgreSQL",
    sublabel: "Rules & Metadata",
    x: 780,
    y: 420,
    color: "accent",
    description:
      "Primary RDBMS for validation rules. Strong consistency guarantees prevent stale rules causing data integrity issues. JSONB for flexible rule configs.",
  },
  {
    id: "queue",
    label: "Kafka",
    sublabel: "Validation Jobs",
    x: 80,
    y: 420,
    color: "success",
    description:
      "Distributed message broker for bulk validation jobs. Partitioned by module for parallel processing. Enables backpressure handling and retry with DLQ.",
  },
  {
    id: "worker",
    label: "NIO Workers",
    sublabel: "Async (Python)",
    x: 80,
    y: 540,
    color: "func",
    description:
      "Non-blocking I/O validation workers consuming from Kafka partitions. Each worker processes 1,000 records/batch concurrently using asyncio. Horizontally scalable.",
  },
  {
    id: "extapi",
    label: "External APIs",
    sublabel: "Phone/Email Verify",
    x: 240,
    y: 640,
    color: "string",
    description:
      "Third-party verification services (phone, email, address). Circuit breaker pattern with 1.5s timeout. Negative results cached for 1 hour to reduce calls by 60%.",
  },
  {
    id: "results",
    label: "S3",
    sublabel: "Bulk Results",
    x: 80,
    y: 660,
    color: "success",
    description:
      "Object storage for bulk validation results. Streamed in 10K record chunks to avoid memory overflow. Pre-signed URL for client download.",
  },
  {
    id: "logdb",
    label: "PostgreSQL",
    sublabel: "Validation Logs",
    x: 440,
    y: 560,
    color: "accent",
    description:
      "Time-series partitioned table for validation logs (monthly partitions). 450 GB over 30 days at 69 QPS sustained. Async writes for eventual consistency.",
  },
  {
    id: "metrics",
    label: "CloudWatch",
    sublabel: "Metrics & Alerts",
    x: 640,
    y: 560,
    color: "variable",
    description:
      "Monitoring and alerting. SLO: 99.9% of validations <100ms. Alerts on p99 > 150ms. Tracks QPS, rule cache hit rate, external API latency, and bulk job throughput.",
  },
];

export const DIAGRAM_EDGES = [
  { from: "client", to: "lb", label: "HTTPS", color: "comment" },
  { from: "lb", to: "gateway", label: "", color: "comment" },
  { from: "gateway", to: "valapi", label: "Validate", color: "keyword" },
  { from: "gateway", to: "ruleapi", label: "Rule CRUD", color: "func" },
  { from: "valapi", to: "rulecache", label: "Fetch Rules", color: "keyword" },
  { from: "valapi", to: "queue", label: "Queue Bulk Job", color: "success" },
  { from: "valapi", to: "logdb", label: "Log Results", color: "accent" },
  { from: "ruleapi", to: "ruledb", label: "Write Rules", color: "accent" },
  {
    from: "ruleapi",
    to: "rulecache",
    label: "Invalidate",
    color: "keyword",
  },
  { from: "queue", to: "worker", label: "Consume", color: "success" },
  { from: "worker", to: "rulecache", label: "Read Rules", color: "keyword" },
  { from: "worker", to: "extapi", label: "Verify", color: "string" },
  { from: "worker", to: "results", label: "Stream", color: "success" },
  { from: "worker", to: "logdb", label: "Async Log", color: "accent", dashed: true },
  { from: "valapi", to: "metrics", label: "Emit", color: "variable", dashed: true },
  { from: "worker", to: "metrics", label: "Emit", color: "variable", dashed: true },
  {
    from: "rulecache",
    to: "ruledb",
    label: "Cache Miss",
    color: "comment",
    dashed: true,
  },
];

export const DATA_FLOWS = {
  realtime: {
    label: "Real-time Path",
    color: "keyword",
    path: ["client", "lb", "gateway", "valapi", "rulecache", "logdb"],
    description:
      "Client → API Gateway → Validation API → Redis (rule fetch) → Response + async log",
  },
  bulk: {
    label: "Bulk Path",
    color: "success",
    path: ["client", "lb", "gateway", "valapi", "queue", "worker", "rulecache", "extapi", "results"],
    description:
      "Client → API Gateway → Kafka → NIO Workers (parallel processing) → S3 results",
  },
  ruleUpdate: {
    label: "Rule Update",
    color: "func",
    path: ["client", "lb", "gateway", "ruleapi", "ruledb", "rulecache"],
    description:
      "Rule API → PostgreSQL → Redis invalidation (ensure consistency)",
  },
};

export const APIS = [
  {
    title: "Real-time Validation",
    method: "POST",
    endpoint: "/api/v2/validation/validate",
    request: `{
  "module": "Leads",
  "operation": "create",
  "records": [
    {
      "Email": "test@example.com",
      "Phone": "1234567890",
      "Country": "US"
    }
  ]
}`,
    response: `{
  "results": [
    {
      "record_id": 0,
      "valid": false,
      "errors": [
        {
          "field": "Phone",
          "rule_id": "rule_123",
          "message": "Invalid US phone format"
        }
      ]
    }
  ],
  "latency_ms": 87
}`,
  },
  {
    title: "Bulk Validation Job",
    method: "POST",
    endpoint: "/api/v2/validation/bulk",
    request: `{
  "job_id": "bulk_20260123_001",
  "module": "Contacts",
  "criteria": "Created_Time > '2026-01-01'",
  "rule_ids": ["rule_123", "rule_456"],
  "callback_url": "https://webhook.example.com/results"
}`,
    response: `{
  "job_id": "bulk_20260123_001",
  "status": "queued",
  "estimated_records": 2500000,
  "eta_minutes": 45
}`,
  },
];

export const DATA_MODEL = {
  postgres: `-- Validation Rules (Strong Consistency)
TABLE validation_rules (
  rule_id UUID PRIMARY KEY,
  module VARCHAR(50) NOT NULL,
  field_name VARCHAR(100),
  rule_type VARCHAR(20),           -- 'regex', 'criteria', 'function', 'external_api'
  rule_config JSONB,               -- {pattern: "^\\\\d{10}$", api_endpoint: "..."}
  priority INT,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  INDEX idx_module_active (module, is_active)
)`,
  logs: `-- Time-series Partitioned Validation Logs
TABLE validation_logs (
  log_id BIGSERIAL,
  record_id BIGINT,
  module VARCHAR(50),
  rule_id UUID,
  result VARCHAR(10),              -- 'pass', 'fail'
  error_message TEXT,
  validated_at TIMESTAMP,          -- Partition Key
  PRIMARY KEY (validated_at, log_id)
) PARTITION BY RANGE (validated_at)

-- Monthly partitions auto-managed
-- 450 GB over 30 days at 69 QPS sustained`,
  redis: `Rule Cache:
  Key:  rules:{module}:{is_active}
  TTL:  300 seconds (5 min)
  Value: [
    { rule_id, field_name, rule_type, rule_config, priority },
    ...
  ]
  Invalidation: Redis pub/sub on rule updates

External API Negative Cache:
  Key:  ext_neg:{api}:{field_value_hash}
  TTL:  3600 seconds (1 hour)
  Value: { valid: false, reason: "..." }
  → Reduces external API calls by 60%`,
  kafka: `Topic: validation.jobs.{module}
Partition Key: module
  → Parallel processing per module

Payload: {
  "job_id": "bulk_20260123_001",
  "module": "Contacts",
  "records": [...],            -- 1,000 per batch
  "rule_ids": ["rule_123", "rule_456"],
  "callback_url": "https://..."
}

Topic: validation.dlq (Dead Letter Queue)
  → Failed batches for manual retry
  → Prevents consumer lag propagation`,
};

export const ENGINE_PSEUDOCODE = `class NIOValidationWorker:
    def __init__(self, kafka_topic, redis_url):
        self.consumer = aiokafka.AIOKafkaConsumer(kafka_topic)
        self.redis = aioredis.from_url(redis_url)
        self.http_session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=2)
        )
        self.rule_cache = {}  # Compiled regex patterns

    async def process_batch(self, records, rules):
        # Non-blocking validation of 1000 records concurrently
        tasks = [
            self.validate_record(rec, rules)
            for rec in records
        ]
        results = await asyncio.gather(
            *tasks, return_exceptions=True
        )
        return [
            r for r in results
            if not isinstance(r, Exception)
        ]

    async def validate_record(self, record, rules):
        errors = []
        for rule in rules:
            if rule['type'] == 'regex':
                pattern = self.rule_cache.get(rule['id']) \\
                    or re.compile(rule['pattern'])
                self.rule_cache[rule['id']] = pattern
                if not pattern.match(
                    record.get(rule['field'], '')
                ):
                    errors.append({
                        'field': rule['field'],
                        'rule_id': rule['id']
                    })

            elif rule['type'] == 'external_api':
                # Circuit breaker: skip if API down
                try:
                    async with self.http_session.post(
                        rule['api_endpoint'],
                        json={
                            rule['field']: record[rule['field']]
                        },
                        timeout=1.5
                    ) as resp:
                        if resp.status != 200:
                            errors.append({
                                'field': rule['field'],
                                'rule_id': rule['id']
                            })
                except asyncio.TimeoutError:
                    pass  # Fallback: skip rule (logged)

        return {
            'record_id': record['id'],
            'valid': len(errors) == 0,
            'errors': errors
        }

    async def run(self):
        async for msg in self.consumer:
            job = json.loads(msg.value)
            rules = await self.redis.get(
                f"rules:{job['module']}"
            )

            # 1,000 records/batch (memory/throughput balance)
            for batch in chunk(job['records'], 1000):
                results = await self.process_batch(
                    batch, rules
                )
                await self.write_to_s3(
                    job['job_id'], results
                )`;

export const OPTIMIZATIONS = [
  {
    title: "Compiled Rule Caching",
    detail:
      "Regex patterns compiled once per batch and cached in-memory. Amortizes compilation cost across 1,000 records, reducing per-record validation time by 40%.",
    icon: "⚡",
  },
  {
    title: "NIO Concurrent Processing",
    detail:
      "asyncio.gather validates 1,000 records in parallel batches. Non-blocking I/O prevents thread starvation on external API calls — achieving 2.3M records/hour.",
    icon: "🔄",
  },
  {
    title: "External API Negative Cache",
    detail:
      "Cache invalid results (e.g., invalid emails) for 1 hour in Redis. Reduces external API calls by 60%, cutting bulk job duration and third-party costs.",
    icon: "📦",
  },
  {
    title: "Streaming S3 Writes",
    detail:
      "Stream results to S3 in 10K record chunks to avoid memory overflow. Workers maintain constant ~200MB heap regardless of job size (5M+ records).",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Redis Rule Cache",
    problem:
      "If Redis cluster fails, workers cannot fetch validation rules, halting all validation — both real-time (210 QPS peak) and bulk (1,389 rec/s) paths.",
    mitigations: [
      "Deploy Redis in clustered mode with 3 replicas across AZs (automatic failover in <30s)",
      "Implement fallback to PostgreSQL with local in-memory cache (LRU, 10K rules max) in workers",
      "Circuit breaker: if Redis latency exceeds 100ms for 5 consecutive requests, switch to PostgreSQL for 60s",
    ],
  },
  tradeoff: {
    title: "Eventual Consistency for Telemetry vs Strong Consistency for Rules",
    decision:
      "Validation logs/metrics use eventual consistency (async writes); rule updates require strong consistency (sync PostgreSQL + Redis invalidation).",
    rationale: [
      "Async logging prevents validation latency from coupling to database write latency (maintains <100ms target)",
      "Under network partitions, prioritize Availability for validation requests (serve from Redis cache even if PostgreSQL unreachable) but prioritize Consistency for rule updates (reject rule updates if PostgreSQL is down to prevent split-brain scenarios)",
      "Validation metrics dashboard may lag by 5-10s, but critical rule changes (e.g., fixing a bug in phone regex) are reflected across all workers within 5s via Redis pub/sub invalidation",
    ],
    rejected:
      "Synchronous logging would guarantee real-time metrics but add 15-30ms to every validation request, pushing p99 from 87ms to 120ms and risking SLO breaches at peak 210 QPS.",
  },
};

export const SUMMARY =
  "This system processes 2.3M records/hour for bulk validation and handles 210 QPS peak real-time requests at <100ms latency. The NIO worker architecture — using asyncio for non-blocking concurrent processing — is the key differentiator, enabling horizontal scaling via Kafka partition assignment while maintaining constant memory footprint through S3 streaming. Strong consistency for rule updates (Redis pub/sub invalidation) ensures workers never apply stale validation logic, while eventual consistency for telemetry keeps the critical path fast.";
