// ============================================================
// ML LEAD SCORING & CRM PIPELINE — Project detail data
// ============================================================

export const PROJECT_META = {
  title: "ML Lead Scoring & CRM Pipeline",
  subtitle: "System Design Deep Dive",
  company: "Augusta HiTech Software Solution",
  role: "Junior Associate (Full Stack Developer)",
  period: "NOV 2018 – DEC 2021",
  tags: ["PYTHON", "SCIKIT-LEARN", "ANGULAR", "POSTGRESQL", "REDIS", "CELERY"],
  status: "OPERATIONAL",
};

export const REQUIREMENTS = {
  functional: [
    {
      title: "ML-Driven Lead Scoring",
      detail:
        "Train and serve a Gradient Boosting model on 50+ lead features (firmographics, engagement signals, behavioral data) to predict conversion probability with >82% accuracy",
    },
    {
      title: "Intelligent Lead Allocation",
      detail:
        "Auto-assign scored leads to sales reps based on lead quality tier, rep capacity, expertise matching, and round-robin fairness — reducing manual allocation errors by 22%",
    },
    {
      title: "CRM Workflow Automation",
      detail:
        "Trigger automated follow-up sequences, task creation, and pipeline stage transitions based on lead score thresholds and engagement events",
    },
  ],
  nonFunctional: [
    {
      label: "Latency",
      value:
        "<200ms for real-time lead scoring API, <500ms for allocation decisions, <2s for bulk re-scoring batches of 1,000 leads",
    },
    {
      label: "Accuracy",
      value:
        ">82% classification accuracy, <5% false positive rate on high-quality leads (prevents wasted rep time)",
    },
    {
      label: "Availability",
      value:
        "99.5% uptime for scoring API; batch training pipeline tolerates overnight maintenance windows",
    },
  ],
  scaleEstimates: `Lead Volume:
15,000 new leads/month × 12 months = 180,000 leads/year
Peak: 800 leads/day during campaign launches

Scoring Requests:
180K leads × 3 re-scores/lifecycle = 540K scoring requests/year
~1,500/day → ~0.02 QPS avg, peak burst: 50 QPS

Feature Computation:
50 features × 180K leads = 9M feature values/year
Real-time features: 12 (engagement-based)
Batch features: 38 (firmographic + historical)

Model Training:
Weekly retrain on 180K labeled records
Training time: ~45 min (Gradient Boosting, 500 estimators)`,
};

export const DIAGRAM_NODES = [
  {
    id: "crm_ui",
    label: "CRM Frontend",
    sublabel: "Angular SPA",
    x: 400,
    y: 20,
    color: "accent",
    description:
      "Angular single-page application for sales reps. Displays lead scores, allocation queue, and conversion analytics. Real-time updates via WebSocket.",
    connections: ["gateway"],
  },
  {
    id: "gateway",
    label: "API Gateway",
    sublabel: "Nginx + Flask",
    x: 400,
    y: 120,
    color: "variable",
    description:
      "Nginx reverse proxy with Flask API backend. Handles authentication, rate limiting, and routes requests to microservices. JWT-based auth for sales reps.",
    connections: ["scoring_svc", "alloc_engine", "lead_svc"],
  },
  {
    id: "lead_svc",
    label: "Lead Ingestion",
    sublabel: "Flask API",
    x: 100,
    y: 120,
    color: "success",
    description:
      "Ingests leads from web forms, email campaigns, social media APIs, and manual CSV uploads. Validates, deduplicates, and enriches raw lead data before publishing to the processing queue.",
    connections: ["rabbitmq", "crm_db"],
  },
  {
    id: "rabbitmq",
    label: "RabbitMQ",
    sublabel: "Message Queue",
    x: 100,
    y: 250,
    color: "func",
    description:
      "Message broker decoupling lead ingestion from scoring. Queues: lead.new, lead.score, lead.allocate, lead.notify. DLQ for failed scoring attempts with 3x retry.",
    connections: ["feature_svc"],
  },
  {
    id: "feature_svc",
    label: "Feature Engine",
    sublabel: "Python / Pandas",
    x: 100,
    y: 380,
    color: "keyword",
    description:
      "Computes 50+ ML features per lead: firmographic (company size, industry, revenue), behavioral (page visits, email opens, content downloads), and engagement (recency, frequency, monetary value). Stores in Feature Store.",
    connections: ["feature_store", "scoring_svc"],
  },
  {
    id: "feature_store",
    label: "Feature Store",
    sublabel: "Redis + PostgreSQL",
    x: 100,
    y: 510,
    color: "keyword",
    description:
      "Dual-layer feature store: Redis for real-time features (12 engagement signals, TTL 1hr) and PostgreSQL for batch features (38 firmographic/historical attributes). Ensures training-serving consistency.",
    connections: [],
  },
  {
    id: "scoring_svc",
    label: "Scoring Service",
    sublabel: "Flask + scikit-learn",
    x: 400,
    y: 250,
    color: "accent",
    description:
      "Core ML inference service. Loads trained model from Model Registry, fetches features from Feature Store, returns calibrated probability score (0.0–1.0) and lead tier (A/B/C/D). Sub-200ms latency.",
    connections: ["model_reg", "feature_store", "alloc_engine"],
  },
  {
    id: "model_reg",
    label: "Model Registry",
    sublabel: "MLflow",
    x: 650,
    y: 120,
    color: "variable",
    description:
      "MLflow model registry storing versioned scikit-learn models with metadata (accuracy, F1, feature importance). Supports A/B testing via champion/challenger model promotion.",
    connections: [],
  },
  {
    id: "training",
    label: "Training Pipeline",
    sublabel: "Celery + scikit-learn",
    x: 650,
    y: 250,
    color: "success",
    description:
      "Weekly automated retraining pipeline: fetches labeled data from CRM DB, computes features, trains Gradient Boosting (500 estimators), evaluates on holdout set, registers model if accuracy improves.",
    connections: ["model_reg", "crm_db", "feature_store"],
  },
  {
    id: "alloc_engine",
    label: "Allocation Engine",
    sublabel: "Python",
    x: 400,
    y: 380,
    color: "func",
    description:
      "Assigns scored leads to sales reps using weighted algorithm: 40% lead-rep expertise match, 30% rep capacity (current pipeline load), 20% round-robin fairness, 10% geographic proximity.",
    connections: ["crm_db", "notif_svc"],
  },
  {
    id: "crm_db",
    label: "PostgreSQL",
    sublabel: "CRM Database",
    x: 650,
    y: 380,
    color: "accent",
    description:
      "Primary relational database storing leads, contacts, accounts, opportunities, activities, and ML scores. Partitioned by lead_date for efficient historical queries. 500K+ records.",
    connections: [],
  },
  {
    id: "notif_svc",
    label: "Notification Svc",
    sublabel: "Celery Workers",
    x: 400,
    y: 510,
    color: "string",
    description:
      "Sends real-time notifications to assigned sales reps via WebSocket push, email alerts, and in-app CRM notifications. Triggers automated follow-up task creation.",
    connections: ["crm_ui"],
  },
  {
    id: "analytics",
    label: "Analytics Engine",
    sublabel: "Pandas + Plotly",
    x: 650,
    y: 510,
    color: "variable",
    description:
      "Generates conversion analytics, model performance reports (precision/recall curves), rep productivity dashboards, and revenue attribution. Weekly batch reports + real-time dashboards.",
    connections: ["crm_db"],
  },
];

export const DIAGRAM_EDGES = [
  { from: "crm_ui", to: "gateway", label: "HTTPS", color: "comment" },
  { from: "lead_svc", to: "rabbitmq", label: "Publish Lead", color: "success" },
  { from: "lead_svc", to: "crm_db", label: "Store Raw Lead", color: "accent" },
  { from: "rabbitmq", to: "feature_svc", label: "Consume", color: "func" },
  { from: "feature_svc", to: "feature_store", label: "Write Features", color: "keyword" },
  { from: "feature_svc", to: "scoring_svc", label: "Trigger Score", color: "accent" },
  { from: "scoring_svc", to: "model_reg", label: "Load Model", color: "variable" },
  { from: "scoring_svc", to: "feature_store", label: "Read Features", color: "keyword" },
  { from: "scoring_svc", to: "alloc_engine", label: "Score + Tier", color: "func" },
  { from: "gateway", to: "scoring_svc", label: "Score API", color: "accent" },
  { from: "gateway", to: "alloc_engine", label: "Allocate API", color: "func" },
  { from: "gateway", to: "lead_svc", label: "Ingest API", color: "success" },
  { from: "training", to: "model_reg", label: "Register Model", color: "variable" },
  { from: "training", to: "crm_db", label: "Fetch Labels", color: "accent" },
  { from: "training", to: "feature_store", label: "Read Features", color: "keyword", offset: 15 },
  { from: "alloc_engine", to: "crm_db", label: "Update Assignment", color: "accent" },
  { from: "alloc_engine", to: "notif_svc", label: "Notify Rep", color: "string" },
  { from: "notif_svc", to: "crm_ui", label: "WebSocket Push", color: "string" },
  { from: "analytics", to: "crm_db", label: "Query Data", color: "variable" },
  { from: "feature_store", to: "crm_db", label: "Batch Sync", color: "comment", dashed: true },
];

export const DATA_FLOWS = {
  ingest: {
    label: "Lead Ingestion",
    color: "success",
    path: ["lead_svc", "rabbitmq", "feature_svc", "feature_store", "scoring_svc", "alloc_engine", "crm_db"],
    description:
      "Lead Ingestion → RabbitMQ → Feature Engine → Feature Store → Scoring Service → Allocation Engine → CRM DB",
  },
  scoring: {
    label: "Scoring Path",
    color: "accent",
    path: ["gateway", "scoring_svc", "model_reg", "feature_store", "alloc_engine"],
    description:
      "API Gateway → Scoring Service → Model Registry + Feature Store → Allocation Engine",
  },
  training: {
    label: "Training Path",
    color: "variable",
    path: ["crm_db", "training", "feature_store", "model_reg"],
    description:
      "CRM DB (labeled data) → Training Pipeline → Feature Store → Model Registry (new version)",
  },
};

export const APIS = [
  {
    title: "Score a Lead",
    method: "POST",
    endpoint: "/api/v1/leads/{lead_id}/score",
    request: `{
  "lead_id": "lead_82341",
  "force_rescore": false
}`,
    response: `{
  "lead_id": "lead_82341",
  "score": 0.847,
  "tier": "A",
  "confidence": 0.92,
  "top_features": [
    { "feature": "email_opens_7d", "impact": 0.18 },
    { "feature": "company_revenue", "impact": 0.15 },
    { "feature": "page_visits_30d", "impact": 0.12 }
  ],
  "model_version": "v3.2.1",
  "scored_at": "2021-08-15T14:23:45Z"
}`,
  },
  {
    title: "Allocate Lead to Sales Rep",
    method: "POST",
    endpoint: "/api/v1/leads/{lead_id}/allocate",
    request: `{
  "lead_id": "lead_82341",
  "score": 0.847,
  "tier": "A",
  "preferred_rep_id": null,
  "urgency": "high"
}`,
    response: `{
  "allocation_id": "alloc_94521",
  "lead_id": "lead_82341",
  "assigned_rep": {
    "rep_id": "rep_042",
    "name": "Sarah Chen",
    "specialization": "enterprise",
    "current_pipeline": 23,
    "capacity_score": 0.72
  },
  "match_score": 0.89,
  "allocation_reason": "expertise_match + capacity",
  "sla_deadline": "2021-08-16T14:23:45Z"
}`,
  },
  {
    title: "Get Lead Conversion Analytics",
    method: "GET",
    endpoint: "/api/v1/analytics/conversion?period=monthly&year=2021",
    request: null,
    response: `{
  "period": "2021-08",
  "total_leads": 1250,
  "scored_leads": 1248,
  "conversions": 734,
  "conversion_rate": 0.588,
  "revenue_generated": 21500.00,
  "tier_breakdown": {
    "A": { "leads": 312, "converted": 268, "rate": 0.859 },
    "B": { "leads": 425, "converted": 298, "rate": 0.701 },
    "C": { "leads": 350, "converted": 140, "rate": 0.400 },
    "D": { "leads": 163, "converted": 28, "rate": 0.172 }
  },
  "model_accuracy": 0.843
}`,
  },
];

export const DATA_MODEL = {
  leads: `-- Core leads table
CREATE TABLE leads (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source         VARCHAR(50) NOT NULL,       -- 'web_form', 'email', 'social', 'manual'
    company_name   VARCHAR(255),
    contact_name   VARCHAR(255) NOT NULL,
    email          VARCHAR(255),
    phone          VARCHAR(50),
    industry       VARCHAR(100),
    company_size   VARCHAR(50),                -- 'startup', 'smb', 'mid-market', 'enterprise'
    annual_revenue DECIMAL(15,2),
    ml_score       DECIMAL(5,4),               -- 0.0000 - 1.0000
    tier           CHAR(1),                    -- 'A', 'B', 'C', 'D'
    status         VARCHAR(50) DEFAULT 'new',  -- 'new', 'scored', 'assigned', 'contacted', 'converted', 'lost'
    assigned_rep   UUID REFERENCES sales_reps(id),
    created_at     TIMESTAMP DEFAULT NOW(),
    scored_at      TIMESTAMP,
    converted_at   TIMESTAMP,
    INDEX idx_score (ml_score DESC),
    INDEX idx_status_created (status, created_at)
) PARTITION BY RANGE (created_at);`,
  features: `-- ML Feature Store (batch features)
CREATE TABLE lead_features (
    lead_id        UUID NOT NULL REFERENCES leads(id),
    feature_name   VARCHAR(100) NOT NULL,
    feature_value  DECIMAL(18,6),
    computed_at    TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (lead_id, feature_name)
);

-- Feature definitions
CREATE TABLE feature_definitions (
    name           VARCHAR(100) PRIMARY KEY,
    category       VARCHAR(50),            -- 'firmographic', 'behavioral', 'engagement'
    data_type      VARCHAR(20),            -- 'numeric', 'categorical', 'boolean'
    computation    TEXT,                   -- SQL or Python expression
    refresh_freq   VARCHAR(20),           -- 'realtime', 'hourly', 'daily', 'weekly'
    importance     DECIMAL(5,4)           -- Feature importance from model
);

-- Pre-computed feature vectors
-- 50 features per lead stored as flat columns
CREATE TABLE feature_vectors (
    lead_id            UUID PRIMARY KEY,
    email_opens_7d     INT,
    email_opens_30d    INT,
    page_visits_7d     INT,
    page_visits_30d    INT,
    content_downloads  INT,
    demo_requests      INT,
    company_revenue    DECIMAL(15,2),
    employee_count     INT,
    industry_encoded   INT,
    ...                -- 40+ more features
    computed_at        TIMESTAMP
);`,
  redis: `Key Patterns:

1. Real-time Engagement Features (12 signals):
   feat:{lead_id}:email_opens_7d
   Value: 14  |  TTL: 3600s (1 hour)

2. Latest Lead Score Cache:
   score:{lead_id}
   Value: {
     "score": 0.847,
     "tier": "A",
     "model_version": "v3.2.1",
     "scored_at": "2021-08-15T14:23:45Z"
   }
   TTL: 86400s (24 hours)

3. Rep Capacity Tracking:
   rep:{rep_id}:pipeline
   Value: 23  |  TTL: none (updated on allocation)

4. Model Artifact Cache:
   model:champion:artifacts
   Value: serialized model binary (pickle)
   TTL: 604800s (7 days, refreshed on new version)`,
  celery: `Task Queues:

1. lead.score (priority: high)
   → Triggered on new lead ingestion
   → Computes features + runs ML inference
   → Publishes to lead.allocate on completion

2. lead.allocate (priority: high)
   → Triggered after scoring
   → Runs allocation algorithm
   → Updates CRM DB + sends notification

3. model.train (priority: low)
   → Weekly scheduled task (Sunday 2am)
   → Full retrain on labeled dataset
   → Registers new model if accuracy improves

4. analytics.compute (priority: low)
   → Daily batch computation
   → Generates conversion metrics + reports`,
};

export const SCORING_PSEUDOCODE = `import numpy as np
import joblib
import redis
from flask import Flask, request, jsonify
from feature_store import FeatureStore

app = Flask(__name__)
redis_client = redis.StrictRedis(host='redis-cluster')
feature_store = FeatureStore(redis_client, db_conn)

# Load champion model from registry
model = None
model_version = None

def load_model():
    """Load latest champion model from MLflow registry"""
    global model, model_version
    import mlflow
    client = mlflow.tracking.MlflowClient()
    latest = client.get_latest_versions(
        "lead_scorer", stages=["Production"]
    )[0]
    model = mlflow.sklearn.load_model(
        f"models:/lead_scorer/Production"
    )
    model_version = latest.version

load_model()

@app.route('/api/v1/leads/<lead_id>/score', methods=['POST'])
def score_lead(lead_id):
    # Check cache first
    cached = redis_client.get(f"score:{lead_id}")
    if cached and not request.json.get('force_rescore'):
        return jsonify(json.loads(cached))

    # Fetch feature vector (real-time + batch)
    features = feature_store.get_features(lead_id)
    feature_vector = np.array(
        [features[f] for f in FEATURE_ORDER]
    ).reshape(1, -1)

    # ML Inference
    probability = model.predict_proba(feature_vector)[0][1]
    tier = classify_tier(probability)

    # Feature importance for explainability
    importances = model.feature_importances_
    top_features = sorted(
        zip(FEATURE_ORDER, importances),
        key=lambda x: x[1], reverse=True
    )[:5]

    result = {
        "lead_id": lead_id,
        "score": round(float(probability), 4),
        "tier": tier,
        "confidence": round(
            float(max(
                model.predict_proba(feature_vector)[0]
            )), 2
        ),
        "top_features": [
            {"feature": f, "impact": round(float(imp), 3)}
            for f, imp in top_features
        ],
        "model_version": f"v{model_version}",
        "scored_at": datetime.utcnow().isoformat() + "Z"
    }

    # Cache result
    redis_client.setex(
        f"score:{lead_id}",
        86400,
        json.dumps(result)
    )

    # Update CRM database
    db.execute(
        "UPDATE leads SET ml_score=%s, tier=%s, "
        "scored_at=NOW(), status='scored' WHERE id=%s",
        (probability, tier, lead_id)
    )

    return jsonify(result)

def classify_tier(score):
    """Tier classification with business thresholds"""
    if score >= 0.80:
        return 'A'  # Hot lead - immediate follow-up
    elif score >= 0.55:
        return 'B'  # Warm lead - next-day follow-up
    elif score >= 0.30:
        return 'C'  # Nurture - drip campaign
    else:
        return 'D'  # Low priority - monthly check-in

# ── Allocation Engine ──

def allocate_lead(lead_id, score, tier):
    """Weighted allocation algorithm"""
    reps = get_available_reps()

    best_rep = None
    best_match = -1

    for rep in reps:
        # 40% expertise match
        expertise = compute_expertise_match(
            rep, lead_industry, lead_size
        )
        # 30% capacity (inverse of pipeline load)
        capacity = 1 - (rep.current_pipeline / rep.max_capacity)
        # 20% round-robin fairness
        fairness = 1 - (rep.leads_today / max_leads_today)
        # 10% geographic proximity
        geo = compute_geo_score(rep.region, lead_region)

        match = (
            0.40 * expertise +
            0.30 * capacity +
            0.20 * fairness +
            0.10 * geo
        )

        if match > best_match:
            best_match = match
            best_rep = rep

    # Update CRM
    db.execute(
        "UPDATE leads SET assigned_rep=%s, "
        "status='assigned' WHERE id=%s",
        (best_rep.id, lead_id)
    )

    # Notify assigned rep
    notify_rep(best_rep, lead_id, score, tier)
    return best_rep, best_match`;

export const OPTIMIZATIONS = [
  {
    title: "Feature Store Consistency",
    detail:
      "Dual-layer store ensures training and serving use identical feature computation: Redis for 12 real-time engagement signals, PostgreSQL for 38 batch firmographic features. Eliminates training-serving skew.",
    icon: "⚡",
  },
  {
    title: "Model Caching",
    detail:
      "Serialized model loaded into memory at startup and cached in Redis (7-day TTL). Hot-reloads only when MLflow promotes a new champion model, avoiding cold-start latency.",
    icon: "📦",
  },
  {
    title: "Incremental Feature Updates",
    detail:
      "Real-time features (email opens, page visits) updated via event stream instead of full recomputation. Batch features refreshed nightly via Celery scheduled task.",
    icon: "🔄",
  },
  {
    title: "Async Allocation Pipeline",
    detail:
      "Lead scoring and allocation decoupled via RabbitMQ queues. Scoring completes in <200ms, allocation runs asynchronously to prevent blocking the scoring API.",
    icon: "📋",
  },
];

export const BOTTLENECKS = {
  spof: {
    title: "Scoring Service (Single Model Instance)",
    problem:
      "If the scoring service crashes or the model artifact is corrupted, all new leads queue up in RabbitMQ without scores, stalling the entire allocation pipeline and causing leads to go cold.",
    mitigations: [
      "Run 3 replicas of the scoring service behind the load balancer with health checks (/healthz endpoint verifying model is loaded)",
      "Keep the previous model version warm in Redis as fallback — if champion model fails, auto-promote challenger within 30 seconds",
      "RabbitMQ DLQ with 3x retry + exponential backoff (5s, 30s, 120s) before alerting on-call engineer",
      "Graceful degradation: if scoring unavailable for >5 minutes, route leads to round-robin allocation bypassing ML",
    ],
  },
  tradeoff: {
    title: "Model Freshness vs Training Cost",
    decision:
      "Weekly model retraining (Sunday 2am) with daily incremental feature updates.",
    rationale: [
      "Daily retraining showed diminishing returns: accuracy improved only 0.3% (84.3% → 84.6%) while quadrupling compute cost and introducing deployment risk",
      "Weekly retraining captures seasonal trends and campaign effects with 45-min training window, achieving 82-84% accuracy sustainably",
      "Real-time feature updates (engagement signals) provide freshness where it matters most — behavioral signals are 60% of model importance",
      "Champion/challenger framework via MLflow allows new model versions to be tested on 10% traffic before full promotion",
    ],
    rejected:
      "Real-time online learning (updating model on each conversion event) was rejected due to concept drift risk — adversarial leads could poison the model, and regulatory compliance requires auditable, versioned model snapshots.",
  },
};

export const SUMMARY =
  "This ML-driven pipeline scores 180K leads/year with 82-84% accuracy using a Gradient Boosting model trained on 50+ features spanning firmographic, behavioral, and engagement signals. The weighted allocation algorithm reduced manual assignment errors by 22% and improved lead conversion from 5,500 to 8,800 annually (+60% increase), generating $240K additional revenue. The architecture decouples ingestion, scoring, and allocation via RabbitMQ, uses a dual-layer Feature Store (Redis + PostgreSQL) for training-serving consistency, and achieves <200ms scoring latency with weekly model retraining via MLflow champion/challenger promotion.";
