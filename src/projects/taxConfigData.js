// ============================================================
// TAX CONFIGURATION SYSTEM DESIGN — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "Tax Configuration & Calculation Service",
  subtitle: "Multi-Tenant CRM",
  company: "Zoho Corporation",
  role: "MTS Full Stack Developer",
  period: "JAN 2022 – DEC 2023",
  tags: ["JAVA", "POSTGRESQL", "REDIS", "KAFKA", "DYNAMODB"],
  status: "PRODUCTION",
};

export const REQUIREMENTS = {
  functional: [
    {
      title: "Dynamic Tax Configuration",
      detail:
        "Administrators can create, update, reorder, and delete tax rules with labels, rates (up to 2 decimals), and auto-population preferences per organization",
    },
    {
      title: "Multi-Tax Calculation",
      detail:
        "Apply multiple tax rates to line items across Quotes, Sales Orders, Invoices with real-time calculation and version-aware API responses",
    },
    {
      title: "Cross-System Synchronization",
      detail:
        "Ensure mobile/web/API consistency for tax configurations and calculations with eventual consistency across distributed systems",
    },
  ],
  nonFunctional: [
    {
      label: "Consistency",
      value:
        "Eventual Consistency for config reads (1-2s propagation); Strong Consistency for financial calculations (tax amounts must be accurate)",
    },
    {
      label: "Latency",
      value: "<50ms for tax calculation API, <200ms for configuration updates propagation",
    },
    {
      label: "Availability",
      value: "99.95% uptime (21.9 min downtime/month)",
    },
  ],
  scaleEstimates: `Assumptions:
- 100,000 organizations (tenants)
- 20% DAU organizations = 20,000 active orgs/day
- Average 50 invoice/quote operations per org per day
- Each operation requires 3 tax calculations (view, edit, save)

Tax Calculation QPS:
20,000 orgs × 50 ops × 3 calcs / 86,400s = 34.7 QPS
Peak (3x) = ~105 QPS

Configuration Update QPS:
20,000 orgs × 2 config changes/day / 86,400 = 0.46 QPS (negligible)

Storage (Tax Configuration):
100,000 orgs × 10 tax rules/org × 500 bytes/rule = 500 MB (minimal)

Storage (Audit Trail):
20,000 orgs × 50 ops × 365 days × 2 KB/record = 730 GB/year`,
};

export const DIAGRAM_NODES = [
  {
    id: "client",
    label: "Client",
    sublabel: "Web/Mobile",
    shape: "stadium",
    x: 440,
    y: 20,
    color: "accent",
    description:
      "End-user interface (browser or mobile app). Sends HTTPS requests through the load balancer and receives real-time config updates.",
  },
  {
    id: "lb",
    label: "Load Balancer",
    sublabel: "AWS ALB",
    shape: "rect",
    x: 440,
    y: 110,
    color: "comment",
    description:
      "AWS Application Load Balancer distributing traffic across API Gateway instances with health checks and SSL termination.",
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Kong + Rate Limiter",
    shape: "rect",
    x: 440,
    y: 200,
    color: "variable",
    description:
      "Central entry point handling authentication, rate limiting, and request routing. Routes to Tax Config, Tax Calc, and Invoice services.",
  },
  {
    id: "taxconfigsvc",
    label: "Tax Config Svc",
    sublabel: "Java",
    shape: "rect",
    x: 160,
    y: 310,
    color: "func",
    description:
      "Manages CRUD operations for tax rules per organization. Writes to PostgreSQL, publishes change events to Kafka, and maintains Redis config cache.",
  },
  {
    id: "taxcalcsvc",
    label: "Tax Calc Svc",
    sublabel: "Java",
    shape: "rect",
    x: 440,
    y: 310,
    color: "keyword",
    description:
      "Core calculation engine. Handles compound tax logic, API version-specific rules, and caches results aggressively. Sub-50ms latency at 105 QPS peak.",
  },
  {
    id: "invoicesvc",
    label: "Invoice/Quote Svc",
    sublabel: "Java",
    shape: "rect",
    x: 720,
    y: 310,
    color: "string",
    description:
      "Manages Invoice, Quote, and Sales Order records. Calls Tax Calc Service for line-item tax computation and stores results in transaction DB.",
  },
  {
    id: "configcache",
    label: "Redis",
    sublabel: "Config Cache",
    shape: "cyl",
    x: 60,
    y: 430,
    color: "keyword",
    description:
      "L1 cache for tax configurations with 30s TTL. Reduces PostgreSQL load by 95%. Deployed in cluster mode with 3 replicas across AZs.",
  },
  {
    id: "configdb",
    label: "PostgreSQL",
    sublabel: "Tax Configs",
    shape: "cyl",
    x: 260,
    y: 430,
    color: "accent",
    description:
      "Primary RDBMS for tax configurations. ACID-compliant for financial accuracy. Sharded by org_id for tenant isolation. Optimistic locking via version column.",
  },
  {
    id: "eventbus",
    label: "Kafka",
    sublabel: "Config Change Events",
    shape: "das",
    x: 160,
    y: 540,
    color: "success",
    description:
      "Event bus for tax configuration changes. Enables async propagation to mobile sync workers and API version handlers without blocking config writes.",
  },
  {
    id: "calccache",
    label: "Redis",
    sublabel: "Calc Result Cache",
    shape: "cyl",
    x: 440,
    y: 430,
    color: "keyword",
    description:
      "Caches calculation results by hash(org_id + line_items + tax_ids) with 5-min TTL. Handles idempotent operations without re-computation.",
  },
  {
    id: "txndb",
    label: "PostgreSQL",
    sublabel: "Invoices/Quotes",
    shape: "cyl",
    x: 720,
    y: 430,
    color: "accent",
    description:
      "Transaction database storing invoice, quote, and sales order records with their calculated tax breakdowns. Partitioned by created_at for audit trail.",
  },
  {
    id: "syncworker",
    label: "Sync Worker",
    sublabel: "Version Handler",
    shape: "fr-rect",
    x: 60,
    y: 640,
    color: "func",
    description:
      "Consumes Kafka config change events. Handles mobile offline DB synchronization and API version mapping updates for backward compatibility.",
  },
  {
    id: "versionstore",
    label: "DynamoDB",
    sublabel: "API Version Maps",
    shape: "cyl",
    x: 260,
    y: 640,
    color: "variable",
    description:
      "NoSQL store for API version mappings. Sub-10ms reads for backward compatibility routing. Maps v2/v8 field structures without burdening primary DB.",
  },
  {
    id: "auditlog",
    label: "Audit Log Svc",
    sublabel: "",
    shape: "rect",
    x: 720,
    y: 540,
    color: "comment",
    description:
      "Captures all tax calculation snapshots for compliance. Async processing via Kafka with 1-2s acceptable delay.",
  },
  {
    id: "s3",
    label: "S3",
    sublabel: "Compliance Archive",
    shape: "lin-cyl",
    x: 900,
    y: 540,
    color: "success",
    description:
      "Long-term cold storage for audit trail. Cost-effective archival of 730 GB/year of calculation records with lifecycle policies.",
  },
  {
    id: "replicadb",
    label: "PostgreSQL",
    sublabel: "Read Replica",
    shape: "cyl",
    x: 440,
    y: 540,
    color: "accent",
    description:
      "Read replica for tax config lookups during cache misses. WAL-based replication from primary with <1s lag. Absorbs read traffic during Redis failures.",
  },
];

export const DIAGRAM_EDGES = [
  { from: "client", to: "lb", label: "HTTPS", color: "comment" },
  { from: "lb", to: "api", label: "", color: "comment" },
  { from: "api", to: "taxconfigsvc", label: "Config CRUD", color: "func" },
  { from: "api", to: "taxcalcsvc", label: "Calculate", color: "keyword" },
  { from: "api", to: "invoicesvc", label: "Invoice Ops", color: "string" },
  { from: "taxconfigsvc", to: "configcache", label: "Cache Config", color: "keyword" },
  { from: "taxconfigsvc", to: "configdb", label: "Write Config", color: "accent" },
  { from: "taxconfigsvc", to: "eventbus", label: "Publish Event", color: "success" },
  { from: "taxcalcsvc", to: "configcache", label: "Read Config", color: "keyword" },
  { from: "taxcalcsvc", to: "calccache", label: "Cache Result", color: "keyword" },
  { from: "invoicesvc", to: "txndb", label: "Store Invoice", color: "accent" },
  { from: "invoicesvc", to: "taxcalcsvc", label: "Calc Request", color: "keyword" },
  { from: "eventbus", to: "syncworker", label: "Consume", color: "success" },
  { from: "syncworker", to: "versionstore", label: "Update Versions", color: "variable" },
  { from: "txndb", to: "auditlog", label: "Audit Events", color: "comment" },
  { from: "auditlog", to: "s3", label: "Archive", color: "success" },
  { from: "configdb", to: "replicadb", label: "WAL Replication", color: "accent", dashed: true },
  { from: "calccache", to: "replicadb", label: "Cache Miss", color: "comment", dashed: true },
];

export const DATA_FLOWS = {
  config: {
    label: "Config Update",
    color: "func",
    path: ["client", "lb", "api", "taxconfigsvc", "configdb", "configcache", "eventbus", "syncworker", "versionstore"],
    description: "Client → API → Tax Config Service → PostgreSQL + Redis → Kafka → Sync Worker → DynamoDB",
  },
  calc: {
    label: "Tax Calculation",
    color: "keyword",
    path: ["client", "lb", "api", "invoicesvc", "taxcalcsvc", "configcache", "calccache", "txndb"],
    description: "Client → Invoice Service → Tax Calc Service → Redis (config + result cache) → PostgreSQL",
  },
  audit: {
    label: "Audit Trail",
    color: "success",
    path: ["txndb", "auditlog", "s3"],
    description: "Transaction DB → Audit Log Service → S3 (compliance archive)",
  },
};

export const APIS = [
  {
    title: "Update Tax Configuration",
    method: "PUT",
    endpoint: "/api/v2/settings/organizations/{org_id}/taxes/{tax_id}",
    request: `{
  "label": "GST",
  "rate": 18.50,
  "is_compound": false,
  "auto_populate": true,
  "allow_user_edit": true,
  "display_order": 2
}`,
    response: `{
  "tax_id": "tx_9f8e7d6c",
  "version": 3,
  "updated_at": "2026-01-23T10:30:00Z",
  "propagation_status": "pending"
}`,
  },
  {
    title: "Calculate Multi-Tax for Line Items",
    method: "POST",
    endpoint: "/api/v2/calculations/taxes",
    request: `{
  "org_id": "org_abc123",
  "line_items": [
    {
      "item_id": "prod_123",
      "quantity": 10,
      "unit_price": 100.00,
      "tax_ids": ["tx_gst", "tx_cess"]
    }
  ],
  "api_version": "v2"
}`,
    response: `{
  "line_items": [
    {
      "item_id": "prod_123",
      "subtotal": 1000.00,
      "taxes": [
        {
          "tax_id": "tx_gst",
          "label": "GST",
          "rate": 18.50,
          "amount": 185.00
        },
        {
          "tax_id": "tx_cess",
          "label": "Cess",
          "rate": 2.00,
          "amount": 20.00
        }
      ],
      "total": 1205.00
    }
  ],
  "calculation_timestamp": "2026-01-23T10:30:01Z"
}`,
  },
];

export const DATA_MODEL = {
  postgres: `-- Partition Key: org_id (tenant isolation)
TABLE tax_configurations {
  tax_id UUID PRIMARY KEY,
  org_id VARCHAR(64) NOT NULL,    -- Shard Key
  label VARCHAR(100),
  rate NUMERIC(5,2),               -- Up to 999.99%
  is_compound BOOLEAN,
  auto_populate BOOLEAN,
  allow_user_edit BOOLEAN,
  display_order INT,
  version INT,                     -- Optimistic locking
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_org_active (org_id, is_active)
}

-- Time-series partitioned audit trail
TABLE tax_calculation_audit {
  audit_id BIGSERIAL PRIMARY KEY,
  org_id VARCHAR(64),              -- Partition Key
  invoice_id VARCHAR(64),
  calculation_snapshot JSONB,
  created_at TIMESTAMP,            -- Partition Key
  PARTITION BY RANGE (created_at)
}`,
  dynamodb: `Table: api_version_mappings
Partition Key: org_id
Sort Key: api_version

Attributes:
  tax_field_mappings: MAP
    v2 → { field: "tax", type: "array" }
    v8 → { field: "taxes", type: "object" }

  supported_features: SET
    ["multi_tax", "compound_tax"]

  schema_hash: STRING
    → Used for cache invalidation`,
  redis: `Config Cache:
  Key:  tax_config:{org_id}:{tax_id}
  TTL:  30 seconds
  Value: { label, rate, is_compound, ... }

Calculation Cache:
  Key:  calc:{org_id}:{hash(line_items)}
  TTL:  5 minutes (idempotent ops)
  Value: { line_items: [...], taxes: [...] }`,
  kafka: `Topic: tax.config.changes
Partition Key: org_id
  → All config events for same org go to same partition

Payload: {
  "event_type": "UPDATE|CREATE|DELETE",
  "org_id": "...",
  "tax_id": "...",
  "version": 3,
  "timestamp": "..."
}

Topic: tax.calculations (audit)
  → Fire-and-forget from Tax Calc Service`,
};

export const ENGINE_PSEUDOCODE = `class TaxCalculationService:
    def calculate_taxes(self, org_id, line_items, api_version):
        # 1. Generate deterministic cache key
        cache_key = f"calc:{org_id}:{hash(
            json.dumps(line_items, sort_keys=True)
        )}"

        # 2. Check Redis L1 cache (sub-5ms)
        cached = redis.get(cache_key)
        if cached:
            return json.loads(cached)

        # 3. Fetch tax configs with fallback
        tax_configs = self._get_tax_configs(
            org_id,
            [item['tax_ids'] for item in line_items]
        )

        # 4. Apply versioned calculation logic
        results = []
        for item in line_items:
            subtotal = item['quantity'] * item['unit_price']
            running_total = subtotal
            applied_taxes = []

            # Sort by display_order for compound handling
            taxes = sorted(
                [tax_configs[tid] for tid in item['tax_ids']],
                key=lambda t: t['display_order']
            )

            for tax in taxes:
                if tax['is_compound']:
                    # Compound: tax on subtotal + prev taxes
                    tax_amount = running_total * (tax['rate'] / 100)
                else:
                    # Simple: tax on subtotal only
                    tax_amount = subtotal * (tax['rate'] / 100)

                running_total += tax_amount
                applied_taxes.append({
                    'tax_id': tax['tax_id'],
                    'label': tax['label'],
                    'rate': tax['rate'],
                    'amount': round(tax_amount, 2)
                })

            results.append({
                'item_id': item['item_id'],
                'subtotal': subtotal,
                'taxes': applied_taxes,
                'total': round(running_total, 2)
            })

        # 5. Cache result with 5-min TTL
        redis.setex(cache_key, 300, json.dumps(results))

        # 6. Async audit logging (fire-and-forget)
        kafka.produce('tax.calculations', {
            'org_id': org_id,
            'timestamp': datetime.utcnow(),
            'results': results
        })

        return results

    def _get_tax_configs(self, org_id, tax_ids):
        # L1: Redis (30s TTL)
        pipe = redis.pipeline()
        for tid in tax_ids:
            pipe.get(f"tax_config:{org_id}:{tid}")
        cached = pipe.execute()

        missing = [
            tid for tid, val in zip(tax_ids, cached)
            if not val
        ]

        if missing:
            # L2: PostgreSQL read replica
            configs = db_replica.query(
                "SELECT * FROM tax_configurations "
                "WHERE org_id = %s AND tax_id = ANY(%s)",
                (org_id, missing)
            )
            # Backfill cache
            for cfg in configs:
                redis.setex(
                    f"tax_config:{org_id}:{cfg['tax_id']}",
                    30, json.dumps(cfg)
                )

        return {
            tid: json.loads(val)
            for tid, val in zip(tax_ids, cached) if val
        }`;

export const OPTIMIZATIONS = [
  {
    title: "Two-Tier Caching",
    detail:
      "Redis L1 for configs (30s TTL) + calculation results (5min TTL). Reduces DB load by 95% and achieves <5ms lookups at 105 QPS peak.",
    icon: "⚡",
  },
  {
    title: "Compound Tax Engine",
    detail:
      "Ordered tax application via display_order handles tax-on-tax scenarios accurately. Financial precision via round() at each step prevents cascading rounding errors.",
    icon: "🧮",
  },
  {
    title: "API Version Routing",
    detail:
      "DynamoDB-backed version mappings enable backward compatibility across 7 integrated systems (v2 through v8) without code branching.",
    icon: "🔄",
  },
  {
    title: "Async Audit Logging",
    detail:
      "Fire-and-forget to Kafka decouples compliance archival from calculation critical path. 1-2s delay acceptable per compliance requirements.",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Redis Cache Cluster Failure",
    problem:
      "Redis cache cluster failure causes 100% cache miss rate, overwhelming PostgreSQL read replicas (34.7 QPS → 3,470 QPS burst during cold start).",
    mitigations: [
      "Deploy Redis in cluster mode with 3 replicas across AZs (automatic failover in <30s)",
      "Circuit breaker in Tax Calc Service: if Redis unavailable >5s, bypass cache and route directly to DB replicas with request coalescing (deduplicate identical queries within 100ms window)",
      "PostgreSQL connection pooling (PgBouncer) with 500 max connections to absorb spikes",
    ],
  },
  tradeoff: {
    title: "Eventual Consistency for Tax Config Reads vs Strong Consistency",
    decision: "Chose Eventual Consistency with 1-2s propagation delay after tax config updates.",
    rationale: [
      "Availability Priority: During network partitions between primary and read replicas, system remains available for tax calculations using cached/stale configs (acceptable for non-critical reads like invoice previews)",
      "Performance Benefit: Enables 30s Redis cache TTL without synchronous cache invalidation, achieving <5ms config lookups at 105 QPS peak; strong consistency would require distributed locks or 2PC, adding 50-100ms latency",
      "Mitigation: For critical financial operations (final invoice save), force cache bypass with ?consistent_read=true flag to fetch from primary DB",
    ],
    rejected:
      "Strong consistency for all reads would require synchronous cache invalidation and distributed locks, adding 50-100ms latency to every config lookup. Edge case of stale rate affects 0.1% of operations based on telemetry — acceptable given mobile sync already handles offline conflicts with last-write-wins + version vectors.",
  },
};

export const SUMMARY =
  "This multi-tenant tax system handles 105 QPS peak calculations at <50ms latency through two-tier Redis caching and stateless horizontal scaling. The architecture ensures financial precision via compound tax ordering, maintains backward compatibility across 7 API versions using DynamoDB routing, and archives 730 GB/year of audit data to S3. The eventual consistency trade-off for config reads (1-2s propagation) is mitigated by a consistent_read bypass for critical financial operations, striking the right balance between performance and accuracy.";
