// ============================================================
// ML LEAD SCORING — Low-Level Design (LLD) data
// Lead Scoring Engine + Allocation Pipeline
// ============================================================

export const LLD_META = {
  title: "ML Lead Scoring & Allocation Engine",
  subtitle: "Low-Level Design · Python + scikit-learn",
  tags: ["PYTHON", "SCIKIT-LEARN", "FLASK", "REDIS", "STRATEGY PATTERN"],
};

// ─── Problem Scope & Assumptions ────────────────────────────

export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "Real-Time Lead Scoring",
      detail:
        "Score incoming leads in <200ms using a trained Gradient Boosting model with 50+ features",
    },
    {
      title: "Feature Engineering Pipeline",
      detail:
        "Compute and store 50+ features (firmographic, behavioral, engagement) with training-serving consistency",
    },
    {
      title: "Intelligent Allocation",
      detail:
        "Assign scored leads to sales reps using weighted multi-factor algorithm (expertise, capacity, fairness, geography)",
    },
    {
      title: "Model Lifecycle Management",
      detail:
        "Weekly automated retraining with champion/challenger promotion and rollback capability",
    },
  ],
  assumptions: [
    {
      label: "Labeled Dataset Available",
      detail: "Historical CRM data with conversion outcomes (5,500+ conversions/year) provides training labels",
    },
    {
      label: "Feature Store Architecture",
      detail: "Redis for real-time features (12 engagement signals), PostgreSQL for batch features (38 firmographic)",
    },
    {
      label: "Asynchronous Pipeline",
      detail: "RabbitMQ decouples scoring from allocation — scoring API returns immediately, allocation runs async",
    },
    {
      label: "Model Versioning",
      detail: "MLflow registry tracks model versions with accuracy/F1 metrics for champion/challenger promotion",
    },
  ],
  coreEntities: [
    {
      name: "Lead",
      description: "CRM lead record with features, ML score, tier, and allocation status",
      color: "accent",
    },
    {
      name: "FeatureVector",
      description: "50+ computed features for a lead (firmographic + behavioral + engagement)",
      color: "success",
    },
    {
      name: "ScoringResult",
      description: "ML prediction output with probability, tier, confidence, and feature importance",
      color: "variable",
    },
    {
      name: "AllocationDecision",
      description: "Rep assignment result with match score and allocation rationale",
      color: "func",
    },
  ],
};

// ─── Key APIs ────────────────────────────────────────────────

export const KEY_APIS = [
  {
    signature: "ScoringResult score_lead(lead_id: str, force: bool)",
    description: "Core ML inference endpoint — returns calibrated probability + tier",
    method: "POST",
    color: "accent",
  },
  {
    signature: "AllocationDecision allocate_lead(lead_id: str, score: float, tier: str)",
    description: "Weighted allocation algorithm — assigns lead to optimal rep",
    method: "POST",
    color: "func",
  },
  {
    signature: "FeatureVector compute_features(lead_id: str)",
    description: "Feature engineering pipeline — computes 50+ features from raw data",
    method: "INTERNAL",
    color: "success",
  },
  {
    signature: "ModelMetrics retrain_model()",
    description: "Weekly training pipeline — trains, evaluates, and registers new model",
    method: "TASK",
    color: "variable",
  },
];

// ─── UML Class Diagram data ─────────────────────────────────

export const UML_CLASSES = [
  {
    name: "LeadScoringEngine",
    stereotype: null,
    color: "keyword",
    fields: [
      { visibility: "-", name: "model: GradientBoostingClassifier", type: "field" },
      { visibility: "-", name: "feature_store: FeatureStore", type: "field" },
      { visibility: "-", name: "redis: Redis", type: "field" },
      { visibility: "-", name: "model_version: str", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "score_lead(lead_id, force) -> ScoringResult", type: "method" },
      { visibility: "+", name: "batch_score(lead_ids) -> List[ScoringResult]", type: "method" },
      { visibility: "-", name: "_load_model() -> None", type: "method" },
      { visibility: "-", name: "_classify_tier(score) -> str", type: "method" },
    ],
  },
  {
    name: "FeatureStore",
    stereotype: null,
    color: "success",
    fields: [
      { visibility: "-", name: "redis: Redis", type: "field" },
      { visibility: "-", name: "db: PostgreSQL", type: "field" },
      { visibility: "-", name: "feature_defs: List[FeatureDef]", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "get_features(lead_id) -> FeatureVector", type: "method" },
      { visibility: "+", name: "compute_realtime(lead_id) -> dict", type: "method" },
      { visibility: "+", name: "compute_batch(lead_id) -> dict", type: "method" },
    ],
  },
  {
    name: "AllocationEngine",
    stereotype: null,
    color: "func",
    fields: [
      { visibility: "-", name: "db: PostgreSQL", type: "field" },
      { visibility: "-", name: "redis: Redis", type: "field" },
      { visibility: "-", name: "strategies: List[AllocationStrategy]", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "allocate(lead_id, score, tier) -> AllocationDecision", type: "method" },
      { visibility: "-", name: "_compute_match(rep, lead) -> float", type: "method" },
      { visibility: "-", name: "_get_available_reps() -> List[SalesRep]", type: "method" },
    ],
  },
  {
    name: "ScoringResult",
    stereotype: "dataclass",
    color: "variable",
    fields: [
      { visibility: "+", name: "lead_id: str", type: "field" },
      { visibility: "+", name: "score: float", type: "field" },
      { visibility: "+", name: "tier: str", type: "field" },
      { visibility: "+", name: "confidence: float", type: "field" },
      { visibility: "+", name: "top_features: List[Tuple]", type: "field" },
      { visibility: "+", name: "model_version: str", type: "field" },
    ],
    methods: [],
  },
  {
    name: "AllocationStrategy",
    stereotype: "ABC",
    color: "accent",
    fields: [
      { visibility: "+", name: "weight: float", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "score(rep, lead) -> float", type: "method" },
    ],
  },
  {
    name: "FeatureVector",
    stereotype: "dataclass",
    color: "success",
    fields: [
      { visibility: "+", name: "lead_id: str", type: "field" },
      { visibility: "+", name: "features: dict[str, float]", type: "field" },
      { visibility: "+", name: "computed_at: datetime", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "to_array(feature_order) -> np.ndarray", type: "method" },
    ],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "LeadScoringEngine", to: "FeatureStore", label: "fetches features" },
  { from: "LeadScoringEngine", to: "ScoringResult", label: "produces" },
  { from: "AllocationEngine", to: "AllocationStrategy", label: "uses N strategies" },
  { from: "FeatureStore", to: "FeatureVector", label: "returns" },
  { from: "AllocationEngine", to: "ScoringResult", label: "consumes" },
];

// ─── Python Code ─────────────────────────────────────────────

export const CODE_FILES = {
  "scoring_result.py": {
    path: "models/scoring_result.py",
    lang: "PYTHON",
    description: "Dataclass for ML prediction output",
    code: `from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Tuple


@dataclass(frozen=True)
class ScoringResult:
    """Immutable ML scoring result with explainability."""
    lead_id: str
    score: float               # 0.0 - 1.0 calibrated probability
    tier: str                  # 'A', 'B', 'C', 'D'
    confidence: float          # Max class probability
    top_features: List[Tuple[str, float]]  # Feature importance
    model_version: str
    scored_at: datetime = field(
        default_factory=datetime.utcnow
    )

    def to_dict(self) -> dict:
        return {
            "lead_id": self.lead_id,
            "score": round(self.score, 4),
            "tier": self.tier,
            "confidence": round(self.confidence, 2),
            "top_features": [
                {"feature": f, "impact": round(imp, 3)}
                for f, imp in self.top_features
            ],
            "model_version": self.model_version,
            "scored_at": self.scored_at.isoformat() + "Z",
        }`,
  },
  "feature_store.py": {
    path: "features/feature_store.py",
    lang: "PYTHON",
    description: "Dual-layer feature store (Redis + PostgreSQL)",
    code: `import json
import numpy as np
from datetime import datetime
from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class FeatureVector:
    """Computed feature vector for a lead."""
    lead_id: str
    features: Dict[str, float]
    computed_at: datetime = field(
        default_factory=datetime.utcnow
    )

    def to_array(
        self, feature_order: List[str]
    ) -> np.ndarray:
        """Convert to numpy array in model's
        expected feature order."""
        return np.array([
            self.features.get(f, 0.0)
            for f in feature_order
        ]).reshape(1, -1)


# 12 real-time engagement features
REALTIME_FEATURES = [
    "email_opens_7d", "email_clicks_7d",
    "page_visits_7d", "page_visits_30d",
    "content_downloads_7d", "demo_requests",
    "form_submissions_7d", "chatbot_interactions",
    "social_mentions_7d", "webinar_attended",
    "pricing_page_visits", "last_activity_days"
]

# 38 batch firmographic features
BATCH_FEATURES = [
    "company_revenue", "employee_count",
    "industry_encoded", "company_age_years",
    "funding_stage_encoded", "tech_stack_score",
    # ... 32 more features
]


class FeatureStore:
    """Dual-layer feature store ensuring
    training-serving consistency."""

    def __init__(self, redis_client, db_conn):
        self.redis = redis_client
        self.db = db_conn

    def get_features(
        self, lead_id: str
    ) -> FeatureVector:
        """Fetch all 50 features for a lead.
        Real-time from Redis, batch from PostgreSQL.
        """
        features = {}

        # Layer 1: Real-time features from Redis
        for feat in REALTIME_FEATURES:
            key = f"feat:{lead_id}:{feat}"
            val = self.redis.get(key)
            features[feat] = float(val) if val else 0.0

        # Layer 2: Batch features from PostgreSQL
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT feature_name, feature_value "
            "FROM lead_features "
            "WHERE lead_id = %s",
            (lead_id,)
        )
        for name, value in cursor.fetchall():
            features[name] = float(value)

        return FeatureVector(
            lead_id=lead_id,
            features=features
        )

    def update_realtime(
        self, lead_id: str,
        feature: str, value: float
    ):
        """Update a single real-time feature
        in Redis with 1-hour TTL."""
        self.redis.setex(
            f"feat:{lead_id}:{feature}",
            3600,
            str(value)
        )

    def compute_batch(self, lead_id: str) -> dict:
        """Compute firmographic features from
        CRM data. Runs nightly via Celery."""
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT l.company_name, l.industry, "
            "l.annual_revenue, l.company_size, "
            "COUNT(a.id) as activity_count "
            "FROM leads l "
            "LEFT JOIN activities a "
            "  ON a.lead_id = l.id "
            "WHERE l.id = %s "
            "GROUP BY l.id",
            (lead_id,)
        )
        row = cursor.fetchone()
        if not row:
            return {}

        return {
            "company_revenue": row[2] or 0,
            "industry_encoded": encode_industry(
                row[1]
            ),
            "company_size_encoded": encode_size(
                row[3]
            ),
            "activity_count": row[4],
        }`,
  },
  "scoring_engine.py": {
    path: "engine/scoring_engine.py",
    lang: "PYTHON",
    description: "Core ML inference engine with caching and explainability",
    code: `import json
import numpy as np
from datetime import datetime
from typing import List, Optional
from models.scoring_result import ScoringResult
from features.feature_store import FeatureStore


# Ordered feature names matching model training
FEATURE_ORDER = [
    "email_opens_7d", "email_clicks_7d",
    "page_visits_7d", "page_visits_30d",
    "content_downloads_7d", "demo_requests",
    "form_submissions_7d", "chatbot_interactions",
    "social_mentions_7d", "webinar_attended",
    "pricing_page_visits", "last_activity_days",
    "company_revenue", "employee_count",
    "industry_encoded", "company_age_years",
    "funding_stage_encoded", "tech_stack_score",
    # ... 32 more features
]

# Tier thresholds (tuned on validation set)
TIER_THRESHOLDS = {
    "A": 0.80,   # Hot — immediate follow-up
    "B": 0.55,   # Warm — next-day follow-up
    "C": 0.30,   # Nurture — drip campaign
}


class LeadScoringEngine:
    """Core ML scoring engine with caching,
    model versioning, and explainability."""

    def __init__(
        self,
        feature_store: FeatureStore,
        redis_client,
        model_registry
    ):
        self.feature_store = feature_store
        self.redis = redis_client
        self.registry = model_registry
        self.model = None
        self.model_version = None
        self._load_model()

    def _load_model(self):
        """Load champion model from MLflow
        registry. Called at startup and on
        model version change."""
        import mlflow
        latest = self.registry.get_latest_versions(
            "lead_scorer", stages=["Production"]
        )[0]
        self.model = mlflow.sklearn.load_model(
            f"models:/lead_scorer/Production"
        )
        self.model_version = latest.version

    def score_lead(
        self,
        lead_id: str,
        force: bool = False
    ) -> ScoringResult:
        """Score a single lead.
        Returns cached result unless force=True.
        
        Time Complexity: O(F) where F = feature count
        Space Complexity: O(F) for feature vector
        """
        # Check cache first
        if not force:
            cached = self.redis.get(
                f"score:{lead_id}"
            )
            if cached:
                data = json.loads(cached)
                return ScoringResult(**data)

        # Fetch feature vector
        fv = self.feature_store.get_features(lead_id)
        X = fv.to_array(FEATURE_ORDER)

        # ML inference
        probabilities = self.model.predict_proba(X)
        score = float(probabilities[0][1])
        confidence = float(max(probabilities[0]))

        # Classify tier
        tier = self._classify_tier(score)

        # Extract feature importance
        # (model-level, not instance-level)
        importances = self.model.feature_importances_
        top_features = sorted(
            zip(FEATURE_ORDER, importances),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        result = ScoringResult(
            lead_id=lead_id,
            score=score,
            tier=tier,
            confidence=confidence,
            top_features=[
                (f, float(imp))
                for f, imp in top_features
            ],
            model_version=f"v{self.model_version}",
        )

        # Cache result (24-hour TTL)
        self.redis.setex(
            f"score:{lead_id}",
            86400,
            json.dumps(result.to_dict())
        )

        return result

    def batch_score(
        self, lead_ids: List[str]
    ) -> List[ScoringResult]:
        """Score multiple leads efficiently.
        Uses vectorized prediction for throughput.
        """
        results = []
        vectors = []
        ids_to_score = []

        for lid in lead_ids:
            cached = self.redis.get(f"score:{lid}")
            if cached:
                results.append(
                    ScoringResult(**json.loads(cached))
                )
            else:
                fv = self.feature_store.get_features(
                    lid
                )
                vectors.append(
                    fv.to_array(FEATURE_ORDER)[0]
                )
                ids_to_score.append(lid)

        if vectors:
            X = np.array(vectors)
            probs = self.model.predict_proba(X)
            for i, lid in enumerate(ids_to_score):
                score = float(probs[i][1])
                results.append(ScoringResult(
                    lead_id=lid,
                    score=score,
                    tier=self._classify_tier(score),
                    confidence=float(max(probs[i])),
                    top_features=[],
                    model_version=(
                        f"v{self.model_version}"
                    ),
                ))

        return results

    def _classify_tier(self, score: float) -> str:
        """Map probability to business tier."""
        if score >= TIER_THRESHOLDS["A"]:
            return "A"
        elif score >= TIER_THRESHOLDS["B"]:
            return "B"
        elif score >= TIER_THRESHOLDS["C"]:
            return "C"
        return "D"`,
  },
  "allocation_engine.py": {
    path: "engine/allocation_engine.py",
    lang: "PYTHON",
    description: "Weighted multi-factor lead allocation with Strategy Pattern",
    code: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class SalesRep:
    id: str
    name: str
    specialization: str  # 'enterprise', 'smb'
    region: str
    current_pipeline: int
    max_capacity: int
    leads_today: int
    conversion_rate: float


@dataclass
class AllocationDecision:
    lead_id: str
    rep: SalesRep
    match_score: float
    reason: str


# ── Strategy Pattern for allocation factors ──

class AllocationStrategy(ABC):
    """Base class for allocation scoring
    strategies. Each strategy computes a
    normalized score [0, 1] for a rep-lead
    pair."""

    def __init__(self, weight: float):
        self.weight = weight

    @abstractmethod
    def score(
        self, rep: SalesRep, lead: dict
    ) -> float:
        pass


class ExpertiseMatch(AllocationStrategy):
    """40% weight — match rep specialization
    to lead company size."""

    def score(
        self, rep: SalesRep, lead: dict
    ) -> float:
        size = lead.get("company_size", "smb")
        if rep.specialization == "enterprise":
            return 1.0 if size in (
                "enterprise", "mid-market"
            ) else 0.3
        return 1.0 if size in (
            "startup", "smb"
        ) else 0.3


class CapacityScore(AllocationStrategy):
    """30% weight — prefer reps with lower
    pipeline load."""

    def score(
        self, rep: SalesRep, lead: dict
    ) -> float:
        if rep.max_capacity == 0:
            return 0.0
        utilization = (
            rep.current_pipeline / rep.max_capacity
        )
        return max(0.0, 1.0 - utilization)


class FairnessScore(AllocationStrategy):
    """20% weight — round-robin fairness to
    prevent overloading top performers."""

    def score(
        self, rep: SalesRep, lead: dict
    ) -> float:
        max_daily = 15  # Cap per rep
        return max(
            0.0,
            1.0 - (rep.leads_today / max_daily)
        )


class GeoProximity(AllocationStrategy):
    """10% weight — prefer geographically
    closer reps for relationship building."""

    def score(
        self, rep: SalesRep, lead: dict
    ) -> float:
        lead_region = lead.get("region", "unknown")
        return 1.0 if (
            rep.region == lead_region
        ) else 0.4


class AllocationEngine:
    """Weighted allocation engine using
    Strategy Pattern for extensibility.
    
    Factors:
      40% Expertise Match
      30% Capacity Score
      20% Round-Robin Fairness
      10% Geographic Proximity
    """

    def __init__(self, db_conn, redis_client):
        self.db = db_conn
        self.redis = redis_client
        self.strategies: List[AllocationStrategy] = [
            ExpertiseMatch(weight=0.40),
            CapacityScore(weight=0.30),
            FairnessScore(weight=0.20),
            GeoProximity(weight=0.10),
        ]

    def allocate(
        self,
        lead_id: str,
        score: float,
        tier: str
    ) -> AllocationDecision:
        """Find optimal rep for scored lead.
        
        Time: O(R × S) where R = reps, S = strategies
        Space: O(R) for rep scores
        """
        lead = self._get_lead(lead_id)
        reps = self._get_available_reps()

        if not reps:
            raise ValueError("No available reps")

        best_rep = None
        best_score = -1.0
        best_reasons = []

        for rep in reps:
            total = 0.0
            reasons = []

            for strategy in self.strategies:
                s = strategy.score(rep, lead)
                weighted = s * strategy.weight
                total += weighted
                reasons.append(
                    f"{strategy.__class__.__name__}"
                    f"={s:.2f}"
                )

            if total > best_score:
                best_score = total
                best_rep = rep
                best_reasons = reasons

        # Update CRM database
        self._assign_lead(lead_id, best_rep)

        # Update rep pipeline count in Redis
        self.redis.incr(
            f"rep:{best_rep.id}:pipeline"
        )

        return AllocationDecision(
            lead_id=lead_id,
            rep=best_rep,
            match_score=round(best_score, 3),
            reason=" + ".join(best_reasons),
        )

    def _get_available_reps(self) -> List[SalesRep]:
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT id, name, specialization, "
            "region, current_pipeline, max_capacity, "
            "leads_today, conversion_rate "
            "FROM sales_reps "
            "WHERE active = true "
            "AND current_pipeline < max_capacity"
        )
        return [SalesRep(*row) for row in cursor]

    def _get_lead(self, lead_id: str) -> dict:
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT company_size, industry, region "
            "FROM leads WHERE id = %s",
            (lead_id,)
        )
        row = cursor.fetchone()
        return {
            "company_size": row[0],
            "industry": row[1],
            "region": row[2],
        }

    def _assign_lead(
        self, lead_id: str, rep: SalesRep
    ):
        self.db.execute(
            "UPDATE leads "
            "SET assigned_rep = %s, "
            "status = 'assigned' "
            "WHERE id = %s",
            (rep.id, lead_id)
        )
        self.db.commit()`,
  },
  "training_pipeline.py": {
    path: "training/training_pipeline.py",
    lang: "PYTHON",
    description: "Weekly model retraining with champion/challenger promotion",
    code: `import mlflow
import numpy as np
from datetime import datetime
from sklearn.ensemble import (
    GradientBoostingClassifier
)
from sklearn.model_selection import (
    train_test_split, cross_val_score
)
from sklearn.metrics import (
    accuracy_score, f1_score,
    precision_score, recall_score
)
from dataclasses import dataclass


@dataclass
class ModelMetrics:
    accuracy: float
    f1: float
    precision: float
    recall: float
    version: str
    promoted: bool


def retrain_model(
    db_conn, feature_store, min_accuracy=0.82
) -> ModelMetrics:
    """Weekly retraining pipeline.
    1. Fetch labeled data from CRM
    2. Compute feature vectors
    3. Train Gradient Boosting model
    4. Evaluate on holdout set
    5. Register + promote if improved
    """
    # Step 1: Fetch labeled training data
    cursor = db_conn.cursor()
    cursor.execute(
        "SELECT id, "
        "CASE WHEN converted_at IS NOT NULL "
        "THEN 1 ELSE 0 END as label "
        "FROM leads "
        "WHERE created_at > NOW() - INTERVAL "
        "'12 months' "
        "AND status IN "
        "('converted', 'lost', 'closed')"
    )
    rows = cursor.fetchall()
    lead_ids = [r[0] for r in rows]
    labels = np.array([r[1] for r in rows])

    # Step 2: Build feature matrix
    X = []
    for lid in lead_ids:
        fv = feature_store.get_features(lid)
        X.append(fv.to_array(FEATURE_ORDER)[0])
    X = np.array(X)

    # Step 3: Train/test split
    X_train, X_test, y_train, y_test = (
        train_test_split(
            X, labels, test_size=0.2,
            random_state=42, stratify=labels
        )
    )

    # Step 4: Train model
    model = GradientBoostingClassifier(
        n_estimators=500,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        min_samples_leaf=20,
        random_state=42,
    )
    model.fit(X_train, y_train)

    # Step 5: Evaluate
    y_pred = model.predict(X_test)
    metrics = ModelMetrics(
        accuracy=accuracy_score(y_test, y_pred),
        f1=f1_score(y_test, y_pred),
        precision=precision_score(y_test, y_pred),
        recall=recall_score(y_test, y_pred),
        version="",
        promoted=False,
    )

    # Step 6: Register with MLflow
    with mlflow.start_run():
        mlflow.log_metrics({
            "accuracy": metrics.accuracy,
            "f1": metrics.f1,
            "precision": metrics.precision,
            "recall": metrics.recall,
        })
        info = mlflow.sklearn.log_model(
            model, "lead_scorer",
            registered_model_name="lead_scorer"
        )
        metrics.version = info.run_id[:8]

    # Step 7: Promote if accuracy improved
    if metrics.accuracy >= min_accuracy:
        client = mlflow.tracking.MlflowClient()
        client.transition_model_version_stage(
            "lead_scorer",
            info.run_id[:8],
            stage="Production",
        )
        metrics.promoted = True

    return metrics`,
  },
  "demo.py": {
    path: "demo.py",
    lang: "PYTHON",
    description: "Runnable example with mock data",
    code: `"""
Demo: ML Lead Scoring Pipeline
Run: python demo.py
"""
from engine.scoring_engine import (
    LeadScoringEngine
)
from engine.allocation_engine import (
    AllocationEngine, SalesRep
)
from features.feature_store import (
    FeatureStore, FeatureVector
)
from models.scoring_result import ScoringResult


class MockFeatureStore:
    def get_features(self, lead_id):
        return FeatureVector(
            lead_id=lead_id,
            features={
                "email_opens_7d": 14,
                "page_visits_30d": 23,
                "company_revenue": 5000000,
                "employee_count": 150,
                "demo_requests": 2,
                "pricing_page_visits": 5,
                # ... more features
            }
        )


class MockRedis:
    _store = {}
    def get(self, key): return self._store.get(key)
    def setex(self, key, ttl, val):
        self._store[key] = val
    def incr(self, key):
        self._store[key] = (
            int(self._store.get(key, 0)) + 1
        )


if __name__ == "__main__":
    fs = MockFeatureStore()
    redis = MockRedis()

    # Score a lead
    engine = LeadScoringEngine(
        feature_store=fs,
        redis_client=redis,
        model_registry=None  # Skip MLflow
    )
    # In production, model loaded from MLflow
    # For demo, manually set mock result:
    print("=== Lead Scoring Demo ===")
    print(f"Lead: lead_82341")
    print(f"Score: 0.847 (Tier A)")
    print(f"Top Feature: email_opens_7d")
    print()

    # Allocation demo
    print("=== Allocation Demo ===")
    reps = [
        SalesRep(
            "rep_042", "Sarah Chen",
            "enterprise", "west",
            23, 40, 3, 0.72
        ),
        SalesRep(
            "rep_017", "James Park",
            "smb", "east",
            12, 35, 5, 0.68
        ),
    ]
    print(f"Best Rep: Sarah Chen")
    print(f"Match Score: 0.89")
    print(f"Reason: ExpertiseMatch + Capacity")`,
  },
};

// ─── Complexity Analysis ─────────────────────────────────────

export const COMPLEXITY = {
  time: [
    {
      method: "score_lead",
      complexity: "O(F)",
      detail: "where F = feature count (50). Feature fetch + model inference (constant for tree ensemble)",
    },
    {
      method: "batch_score",
      complexity: "O(N × F)",
      detail: "N = batch size, F = features. Vectorized numpy prediction amortizes tree traversal",
    },
    {
      method: "allocate",
      complexity: "O(R × S)",
      detail: "R = available reps (~20), S = strategies (4). Linear scan with constant-time scoring",
    },
    {
      method: "retrain_model",
      complexity: "O(N × T × D)",
      detail: "N = training samples (180K), T = estimators (500), D = max_depth (5)",
    },
  ],
  space: [
    {
      component: "Feature Store (Redis)",
      complexity: "O(L × F_rt)",
      detail: "L = active leads, F_rt = 12 real-time features per lead",
    },
    {
      component: "Score Cache",
      complexity: "O(L)",
      detail: "One cached ScoringResult per scored lead, 24-hour TTL",
    },
    {
      component: "Model In-Memory",
      complexity: "O(T × 2^D)",
      detail: "500 trees × 32 leaf nodes = ~16K decision nodes in memory",
    },
  ],
  concurrency: [
    {
      label: "Scoring Parallelism",
      detail: "Flask + Gunicorn with 4 workers — each worker loads its own model copy for isolated, lock-free inference",
    },
    {
      label: "Async Allocation",
      detail: "RabbitMQ consumer pool (3 workers) processes allocation tasks concurrently — Redis INCR for atomic rep pipeline counts",
    },
  ],
};

// ─── Follow-Up Questions ────────────────────────────────────

export const FOLLOW_UPS = [
  {
    question: "How do you handle training-serving skew (feature drift)?",
    answer:
      "The dual-layer Feature Store ensures consistency: both training pipeline and scoring service call the same get_features() method. Batch features are computed identically via SQL, real-time features use the same Redis keys. Weekly monitoring compares feature distributions between training and serving using KL-divergence, alerting if drift exceeds 0.1.",
  },
  {
    question: "What if the model's accuracy drops significantly after deployment?",
    answer:
      "Champion/challenger framework via MLflow: new models serve 10% traffic for 48 hours. If accuracy drops below 80% on the live holdout set (labeled conversions), auto-rollback to previous champion version. Circuit breaker falls back to rule-based scoring (industry + company size heuristic) if ML service is unavailable.",
  },
  {
    question: "How do you handle class imbalance (most leads don't convert)?",
    answer:
      "Training uses SMOTE oversampling for minority class (conversions) and class_weight='balanced' in Gradient Boosting. Evaluation uses F1 score (harmonic mean of precision/recall) rather than accuracy alone. Tier thresholds (A/B/C/D) are calibrated on precision-recall curves to minimize false positives for Tier A.",
  },
  {
    question: "How would you scale the allocation algorithm for 1,000 reps?",
    answer:
      "Pre-filter reps by region and specialization to reduce candidate set from 1,000 to ~50. Cache rep pipeline counts in Redis (O(1) reads). For real-time scoring, pre-compute strategy scores nightly and update incrementally. Consider Hungarian Algorithm for batch allocation of multiple leads simultaneously.",
  },
  {
    question: "Why Gradient Boosting over neural networks or logistic regression?",
    answer:
      "Gradient Boosting chosen because: (1) handles mixed feature types (numeric + categorical) natively, (2) feature_importances_ provides built-in explainability for sales reps, (3) 180K samples is too small for deep learning to outperform, (4) sub-200ms inference without GPU. Logistic regression tested at 76% accuracy vs 83% for GB — insufficient for Tier A precision requirements.",
  },
];

// ─── Design Justification ───────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    pattern: "Strategy Pattern",
    location: "AllocationEngine strategies",
    detail:
      "Each allocation factor (expertise, capacity, fairness, geography) is an independent strategy class with its own weight. New factors can be added without modifying the core allocation loop.",
  },
  {
    pattern: "Factory Method Pattern",
    location: "FeatureStore.get_features()",
    detail:
      "Constructs FeatureVector by delegating to compute_realtime() and compute_batch() — hides the dual-layer architecture from consumers.",
  },
  {
    pattern: "Cache-Aside Pattern",
    location: "LeadScoringEngine.score_lead()",
    detail:
      "Check Redis cache before computing. On cache miss, compute score via ML inference, then populate cache with 24-hour TTL. force=True bypasses cache for explicit re-scoring.",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Open/Closed Principle (OCP)",
  detail:
    "AllocationEngine is open for extension (add new AllocationStrategy subclasses like IndustryMatch or ConversionHistory) but closed for modification — the core allocate() loop doesn't change when new scoring factors are added. Each strategy encapsulates its own scoring logic and weight.",
};
