// ============================================================
// CAMPUS IAM PLATFORM — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "Campus-Wide IAM Platform",
  subtitle: "System Design Deep Dive",
  company: "Case Western Reserve University",
  role: "Access Services Specialist",
  period: "JAN 2024 – MAY 2025",
  tags: ["JAVA", "SPRING BOOT", "OAUTH2", "KAFKA", "POSTGRESQL"],
  status: "DEPLOYED",
};

export const REQUIREMENTS = {
  functional: [
    {
      title: "Single Sign-On (SSO)",
      detail:
        "Users authenticate once via OAuth2/OIDC and access all campus services (dining, parking, library, labs) without re-login",
    },
    {
      title: "Fine-Grained Access Control",
      detail:
        'Support RBAC and ABAC policies for physical access (door readers, parking gates), digital resources, and time-bound permissions (e.g., "CS lab access Mon-Fri 8am-10pm")',
    },
    {
      title: "Real-Time Provisioning & Deprovisioning",
      detail:
        "Sync user attributes (enrollment status, department, roles) from LDAP/AD to downstream systems within 5 minutes; revoke access immediately on termination",
    },
  ],
  nonFunctional: [
    {
      label: "Consistency",
      value:
        "Strong Consistency for authentication/authorization decisions (cannot grant access based on stale revocation data); Eventual Consistency acceptable for audit logs",
    },
    {
      label: "Latency",
      value:
        "<200ms p95 for AuthZ API calls, <500ms for SSO token issuance",
    },
    {
      label: "Availability",
      value: "99.9% uptime (campus lockout is unacceptable)",
    },
  ],
  scaleEstimates: `Assumptions:
50,000 total users (students/faculty/staff)
70% DAU, 15 auth checks/day/user (door swipes, app logins, API calls)

Total Auth Requests/sec:
50,000 × 0.7 × 15 / 86,400 ≈ 6 QPS avg
Peak (3x): ~20 QPS

Storage (1-year retention):
Auth events: 6 QPS × 86,400 × 365 × 500 bytes ≈ 95 GB/year
User profiles + policies: 50K users × 10 KB ≈ 500 MB (negligible)

Justification:
Low QPS allows single-region deployment; focus is on sub-200ms
latency via aggressive caching and optimized DB queries, not
horizontal scale.`,
};

export const DIAGRAM_NODES = [
  {
    id: "client",
    label: "Client",
    sublabel: "Web/Mobile/Card",
    shape: "stadium",
    x: 400,
    y: 20,
    color: "accent",
    description:
      "End-user clients including web portal, mobile app, and physical card readers (door swipes, parking gates). All communicate via HTTPS.",
    connections: ["lb"],
  },
  {
    id: "lb",
    label: "Load Balancer",
    sublabel: "AWS ALB",
    shape: "rect",
    x: 400,
    y: 110,
    color: "comment",
    description:
      "AWS Application Load Balancer distributing traffic across API Gateway instances with health checks and SSL termination. Deployed across 3 AZs.",
    connections: ["api"],
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Kong + OAuth2",
    shape: "rect",
    x: 400,
    y: 200,
    color: "variable",
    description:
      "Central entry point with OAuth2 plugin for token validation, rate limiting, and request routing to downstream microservices.",
    connections: ["auth", "authz", "prov"],
  },
  {
    id: "auth",
    label: "Auth Service",
    sublabel: "Spring Boot",
    shape: "rect",
    x: 150,
    y: 310,
    color: "success",
    description:
      "Handles OAuth2 token issuance (password grant, refresh token rotation). Validates credentials against PostgreSQL, caches JWTs in Redis. Spring Security framework.",
    connections: ["userdb", "redis", "s3"],
  },
  {
    id: "authz",
    label: "Authz Service",
    sublabel: "Spring Boot",
    shape: "rect",
    x: 400,
    y: 310,
    color: "keyword",
    description:
      "Policy Decision Point (PDP) evaluating RBAC + ABAC policies. Two-tier cache: L1 in-memory Caffeine (60s TTL) → L2 Redis (5min TTL) → PostgreSQL fallback. <200ms p95.",
    connections: ["policycache", "policydb", "s3"],
  },
  {
    id: "prov",
    label: "Provisioning Svc",
    sublabel: "Spring Boot",
    shape: "rect",
    x: 650,
    y: 310,
    color: "func",
    description:
      "Syncs user attributes from LDAP/Active Directory every 15 minutes. Publishes UserUpdated events to Kafka for downstream propagation. Handles enrollment changes and role assignments.",
    connections: ["ldap", "userdb", "kafka"],
  },
  {
    id: "userdb",
    label: "User Store",
    sublabel: "PostgreSQL",
    shape: "cyl",
    x: 80,
    y: 440,
    color: "accent",
    description:
      "Primary user database storing users, user_roles, and credentials. Strong consistency for auth decisions. Indexed on user_id (partition key) and status.",
    connections: [],
  },
  {
    id: "redis",
    label: "Token Cache",
    sublabel: "Redis",
    shape: "cyl",
    x: 230,
    y: 440,
    color: "keyword",
    description:
      "Caches JWT access tokens and refresh tokens with configurable TTLs. Also serves as L2 cache for authorization policy evaluation results (5-min TTL).",
    connections: [],
  },
  {
    id: "policycache",
    label: "Policy Cache",
    sublabel: "Redis",
    shape: "cyl",
    x: 380,
    y: 440,
    color: "keyword",
    description:
      "Dedicated Redis instance caching authorization decisions. Key: authz:{user_id}:{resource}:{action}. Invalidated on policy updates via Kafka events. 95% cache hit rate.",
    connections: [],
  },
  {
    id: "policydb",
    label: "Policy Store",
    sublabel: "PostgreSQL",
    shape: "cyl",
    x: 530,
    y: 440,
    color: "accent",
    description:
      "Stores RBAC policies, resource definitions, and ABAC conditions (JSONB). Queried on cache miss. Read replicas handle policy evaluation queries.",
    connections: [],
  },
  {
    id: "ldap",
    label: "LDAP / AD",
    sublabel: "Identity Source",
    shape: "cyl",
    x: 780,
    y: 310,
    color: "string",
    description:
      "University's Active Directory / LDAP server. Source of truth for enrollment status, department, and organizational roles. Polled every 15 minutes by the Provisioning Service.",
    connections: [],
  },
  {
    id: "kafka",
    label: "Kafka",
    sublabel: "Event Bus",
    shape: "das",
    x: 700,
    y: 440,
    color: "success",
    description:
      "Message broker for UserUpdated, PolicyChanged, and AccessRevoked events. Enables async propagation to downstream systems and cache invalidation.",
    connections: ["syncworker"],
  },
  {
    id: "syncworker",
    label: "Sync Worker",
    sublabel: "K8s CronJob",
    shape: "fr-rect",
    x: 700,
    y: 560,
    color: "func",
    description:
      "Kubernetes CronJob that consumes Kafka events and pushes user/role updates to downstream campus systems (Dining, Parking APIs). Idempotent retries with exponential backoff.",
    connections: ["downstream"],
  },
  {
    id: "downstream",
    label: "Downstream",
    sublabel: "Dining/Parking",
    shape: "rect",
    x: 530,
    y: 560,
    color: "variable",
    description:
      "Campus downstream systems (Dining API, Parking API, Library system) that receive provisioned user data and enforce local access rules.",
    connections: [],
  },
  {
    id: "s3",
    label: "Audit Store",
    sublabel: "S3 + Athena",
    shape: "lin-cyl",
    x: 230,
    y: 560,
    color: "variable",
    description:
      "Audit logs written asynchronously via Kafka. S3 for durable storage, Athena for ad-hoc compliance queries. Eventual consistency acceptable (1-2 min lag).",
    connections: [],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    sublabel: "CloudWatch",
    shape: "rect",
    x: 80,
    y: 560,
    color: "comment",
    description:
      "CloudWatch + Prometheus for metrics, dashboards, and alerting. Real-time alarms for anomalies (100+ failed logins, latency spikes, auth failures).",
    connections: [],
  },
];

export const DIAGRAM_EDGES = [
  { from: "client", to: "lb", label: "HTTPS", color: "comment" },
  { from: "lb", to: "api", label: "", color: "comment" },
  { from: "api", to: "auth", label: "POST /oauth/token", color: "success" },
  { from: "api", to: "authz", label: "GET /authz/check", color: "keyword" },
  { from: "api", to: "prov", label: "POST /provision", color: "func" },
  { from: "auth", to: "userdb", label: "Read", color: "accent" },
  { from: "auth", to: "redis", label: "Cache JWT", color: "keyword" },
  { from: "authz", to: "policycache", label: "L2 Cache", color: "keyword" },
  { from: "authz", to: "policydb", label: "Fallback", color: "accent", dashed: true },
  { from: "prov", to: "ldap", label: "Pull", color: "string" },
  { from: "prov", to: "userdb", label: "Write", color: "accent" },
  { from: "prov", to: "kafka", label: "Publish", color: "success" },
  { from: "kafka", to: "syncworker", label: "Consume", color: "success" },
  { from: "syncworker", to: "downstream", label: "Push", color: "variable" },
  { from: "auth", to: "s3", label: "Audit Logs", color: "variable", dashed: true },
  { from: "authz", to: "s3", label: "Audit Logs", color: "variable", dashed: true, offset: -10 },
  { from: "monitoring", to: "auth", label: "Metrics", color: "comment", dashed: true },
  { from: "monitoring", to: "authz", label: "Metrics", color: "comment", dashed: true },
];

export const DATA_FLOWS = {
  auth: {
    label: "Authentication",
    color: "success",
    path: ["client", "lb", "api", "auth", "userdb", "redis"],
    description:
      "Client → Kong → Auth Service → PostgreSQL (validate credentials) → Redis (cache JWT) → Client receives access token",
  },
  authz: {
    label: "Authorization",
    color: "keyword",
    path: ["client", "lb", "api", "authz", "policycache", "policydb"],
    description:
      "Card Reader → Kong → Authz Service → Redis (cache hit 95%) → Response in <50ms; on cache miss, query PostgreSQL policies + user roles",
  },
  provision: {
    label: "Provisioning",
    color: "func",
    path: ["ldap", "prov", "userdb", "kafka", "syncworker", "downstream"],
    description:
      "CronJob pulls LDAP every 15 min → Publishes UserUpdated events to Kafka → Sync Worker pushes to downstream APIs (idempotent retries)",
  },
};

export const APIS = [
  {
    title: "Token Issuance (OAuth2 Password Grant)",
    method: "POST",
    endpoint: "/oauth/token",
    request: `grant_type=password
&username=abc123
&password=***
&client_id=campus_portal`,
    response: `{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
  "scope": "dining parking library"
}`,
  },
  {
    title: "Authorization Check (Policy Decision Point)",
    method: "GET",
    endpoint: "/authz/check?user_id=abc123&resource=cs_lab_door_3&action=swipe",
    request: null,
    response: `{
  "allowed": true,
  "reason": "Policy: CS_Students + Time: Mon-Fri 8am-10pm",
  "ttl": 300
}`,
  },
];

export const DATA_MODEL = {
  users: `-- User identity table (Partition Key: user_id)
CREATE TABLE users (
    user_id       VARCHAR(50) PRIMARY KEY,
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    email         VARCHAR(255),
    department    VARCHAR(100),
    status        ENUM('active','suspended','graduated')
                  DEFAULT 'active',
    mfa_enabled   BOOLEAN DEFAULT false,
    last_sync_at  TIMESTAMP,
    INDEX idx_status (status)
);`,
  policies: `-- RBAC + ABAC policy definitions
CREATE TABLE policies (
    policy_id  UUID PRIMARY KEY,
    resource   VARCHAR(255) NOT NULL,
    -- e.g., "cs_lab_door_3", "parking_lot_a"
    role       VARCHAR(100),
    -- e.g., "CS_Student", "Faculty"
    action     VARCHAR(50),
    -- e.g., "swipe", "reserve"
    conditions JSONB,
    -- {"time_window": "Mon-Fri 08:00-22:00"}
    effect     ENUM('allow','deny') DEFAULT 'allow',
    INDEX idx_resource (resource)
);`,
  userRoles: `-- Many-to-many user → role assignment
CREATE TABLE user_roles (
    user_id    VARCHAR(50) REFERENCES users(user_id),
    role       VARCHAR(100),
    granted_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role),
    INDEX idx_role (role)
);`,
  redis: `Key Patterns:

1. JWT Token Cache:
   token:{user_id}:access
   Value: serialized JWT
   TTL: 3600s (1 hour)

2. Refresh Token:
   token:{user_id}:refresh
   Value: refresh token string
   TTL: 86400s (24 hours)

3. AuthZ Decision Cache (L2):
   authz:{user_id}:{resource}:{action}
   Value: {
     "allowed": true,
     "reason": "Policy: CS_Students",
     "computed_at": "2025-03-15T10:30:00Z"
   }
   TTL: 300s (5 minutes)

4. L1 In-Memory (Caffeine):
   Same key pattern, TTL: 60s
   10K most frequent (user_id, resource) tuples`,
};

export const AUTHZ_PSEUDOCODE = `@PreAuthorize("hasAuthority('SCOPE_authz_check')")
def check_authorization(
    user_id: str, resource: str, action: str
) -> AuthzResponse:

    # L1: In-memory cache (Caffeine, TTL 60s)
    cache_key = f"authz:{user_id}:{resource}:{action}"
    cached = caffeine_cache.get(cache_key)
    if cached and (now() - cached.computed_at) < 60:
        return cached

    # L2: Redis cache (TTL 5min)
    redis_cached = redis.get(cache_key)
    if redis_cached:
        result = json.loads(redis_cached)
        caffeine_cache.put(cache_key, result)
        return result

    # Cache miss: Evaluate policy from DB
    user = db.query(
        "SELECT department, status FROM users "
        "WHERE user_id = ?", user_id
    )
    if user.status != 'active':
        return AuthzResponse(
            allowed=False, reason="User inactive"
        )

    roles = db.query(
        "SELECT role FROM user_roles "
        "WHERE user_id = ?", user_id
    )
    policies = db.query("""
        SELECT effect, conditions FROM policies
        WHERE resource = ? AND action = ?
        AND role IN (?)
    """, resource, action, roles)

    # ABAC: Evaluate time/location conditions
    for policy in policies:
        if policy.effect == 'deny':
            return AuthzResponse(
                allowed=False, reason="Explicit deny"
            )
        if evaluate_conditions(
            policy.conditions, context={'time': now()}
        ):
            result = AuthzResponse(
                allowed=True,
                reason=f"Policy: {policy.role}"
            )
            # Populate both caches
            redis.setex(cache_key, 300, json.dumps(result))
            caffeine_cache.put(cache_key, result)
            return result

    # Default deny (no matching policy)
    return AuthzResponse(
        allowed=False, reason="No matching policy"
    )

def evaluate_conditions(conditions, context):
    """Example: {"time_window": "Mon-Fri 08:00-22:00"}"""
    if 'time_window' in conditions:
        window = parse_time_window(
            conditions['time_window']
        )
        return window.contains(context['time'])
    return True`;

export const OPTIMIZATIONS = [
  {
    title: "Two-Tier Cache (L1 + L2)",
    detail:
      "Caffeine in-memory (60s TTL, 10K entries) → Redis (5min TTL). 95% cache hit rate avoids DB queries on door swipes. Cache invalidated via Kafka PolicyChanged events.",
    icon: "⚡",
  },
  {
    title: "Cache Warming CronJob",
    detail:
      "K8s CronJob pre-populates Redis with common (user, resource) pairs from access logs — ensures cold starts don't spike latency at 8am class start.",
    icon: "🔥",
  },
  {
    title: "PostgreSQL Read Replicas",
    detail:
      "Policy evaluation queries routed to read replicas. <10 QPS write load stays on primary. Complex JOINs (user → roles → policies) benefit from relational model.",
    icon: "📖",
  },
  {
    title: "Async Audit Logging",
    detail:
      "Auth events written to Kafka → S3 asynchronously instead of synchronous DB writes. Reduces AuthZ p95 latency from ~250ms to <150ms.",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Kong API Gateway",
    problem:
      "All auth requests flow through Kong; if it crashes, no SSO or access checks possible (campus-wide outage affecting 50K users).",
    mitigations: [
      "Deploy Kong in HA mode across 3 AWS AZs with ALB health checks (/health endpoint)",
      "Use PostgreSQL for Kong's config store (not in-memory) to enable stateless horizontal scaling",
      "Implement retry logic in clients (card readers) with exponential backoff",
      "Circuit breaker on card readers: fail-open after 3 consecutive timeouts to prevent campus lockout",
    ],
  },
  tradeoff: {
    title: "Eventual Consistency in Audit Logs vs. Strong Consistency in AuthZ",
    decision:
      "Write audit events (login attempts, access decisions) to Kafka → S3 asynchronously instead of synchronous DB writes.",
    rationale: [
      "CAP Theorem: Chose AP (Availability + Partition Tolerance) for audit logs — accept 1-2 min lag in audit visibility to keep AuthZ latency <200ms",
      "Async audit logging reduces AuthZ Service p95 latency from ~250ms to <150ms",
      "Security team must accept delayed audit reports — mitigated by real-time CloudWatch alarms for anomalies (100+ failed logins)",
      "Strong Consistency maintained for all authorization decisions — cannot grant access based on stale revocation data",
    ],
    rejected:
      "Write audit logs to PostgreSQL with NOWAIT locks + background vacuum. Rejected because it risks lock contention during peak (8am class start when 5K students swipe cards simultaneously).",
  },
};

export const SUMMARY =
  "This platform provides unified identity and access management for 50K campus users with <200ms authorization checks (p95) and 99.9% uptime. The architecture uses a two-tier cache strategy (Caffeine L1 + Redis L2) achieving 95% hit rate for door-swipe authorization, Spring Boot microservices for auth/authz/provisioning separation, and Kafka-driven async provisioning from LDAP to downstream campus systems within 5 minutes. Strong consistency is enforced for all auth decisions while audit logs use eventual consistency via S3 — reducing AuthZ latency by 40% compared to synchronous writes. The system handles peak loads of 20 QPS during class transitions with sub-50ms cached responses.";
