# Augusta HiTech Software Solution — Junior Associate (Full Stack Developer)

**Period:** November 2018 – December 2021  
**Location:** Coimbatore, India  
**Tags:** `PYTHON` · `ANGULAR` · `FLUTTER` · `ML`

---

## Role Summary

Junior Associate (Full Stack Developer) at Augusta HiTech, building ML-powered lead scoring and CRM pipeline automation systems that significantly boosted sales conversion and revenue.

---

## Key Accomplishments

- Implemented **ML-driven lead allocation** using Python & scikit-learn, reducing manual errors by **22%**
- Built **backend APIs and data pipelines** powering CRM workflows
- Improved lead conversion from **5,500 to 8,800 annually** (+60% increase)
- Generated **$240,000 additional annual revenue** through automation

---

## Project: ML Lead Scoring & CRM Pipeline

**Status:** OPERATIONAL  
**Tech Stack:** Python, scikit-learn, Angular, PostgreSQL, Redis, Celery, RabbitMQ

> Python + scikit-learn ML-driven lead allocation integrated into CRM workflows. Boosted lead conversion from 5,500 to 8,800 annually (+60%), generating $240K additional revenue.

### Functional Requirements

| Requirement                  | Details                                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ML-Driven Lead Scoring       | Train and serve a Gradient Boosting model on 50+ lead features (firmographics, engagement, behavioral data) with >82% accuracy |
| Intelligent Lead Allocation  | Auto-assign scored leads to sales reps based on lead quality tier, rep capacity, expertise matching, and round-robin fairness — reducing manual allocation errors by 22% |
| CRM Workflow Automation      | Trigger automated follow-up sequences, task creation, and pipeline stage transitions based on lead score thresholds and engagement events |

### Non-Functional Requirements

| Attribute    | Target                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Latency      | <200ms for real-time lead scoring API, <500ms for allocation decisions, <2s for bulk re-scoring (1,000 leads)      |
| Accuracy     | >82% classification accuracy, <5% false positive rate on high-quality leads (prevents wasted rep time)             |
| Availability | 99.5% uptime for scoring API; batch training pipeline tolerates overnight maintenance windows                      |

### Scale Estimates

```
Lead Volume:
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
  Training time: ~45 min (Gradient Boosting, 500 estimators)
```

### System Architecture (High-Level)

```
CRM Frontend (Angular SPA)
  ↓
API Gateway (Nginx + Flask)
  ├── Lead Ingestion (Flask API) → RabbitMQ → Feature Engine (Python/Pandas) → Feature Store (Redis + PostgreSQL)
  ├── Scoring Service (Flask + scikit-learn) → Model Registry (MLflow) + Feature Store
  └── Allocation Engine (Flask) → Allocation DB (PostgreSQL) + Redis (Rep Capacity Cache)
                                    ↓
                              Notification Service → Email/Slack/CRM Task Creation
```

**Key Components:**

| Component        | Technology            | Description                                                                                               |
| ---------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| Lead Ingestion   | Flask API             | Ingests leads from web forms, email campaigns, social media APIs, and CSV uploads. Validates and deduplicates |
| Feature Engine   | Python / Pandas       | Computes 50+ ML features per lead — firmographic, behavioral, and engagement signals                       |
| Feature Store    | Redis + PostgreSQL    | Dual-layer: Redis for 12 real-time engagement signals (1hr TTL), PostgreSQL for 38 batch features          |
| Scoring Service  | Flask + scikit-learn  | Core ML inference — loads trained model, fetches features, returns probability score (0.0–1.0) and tier (A/B/C/D). Sub-200ms latency |
| Model Registry   | MLflow                | Tracks model versions with accuracy/F1 metrics for champion/challenger promotion                           |
| Allocation Engine| Flask                 | Assigns scored leads via weighted multi-factor algorithm (expertise, capacity, fairness, geography)        |
| RabbitMQ         | Message Queue         | Decouples scoring from allocation. Queues: lead.new, lead.score, lead.allocate, lead.notify. 3x retry DLQ |

### Low-Level Design Highlights

**Pattern:** Python + scikit-learn Strategy Pattern

| Entity             | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| Lead               | CRM lead record with features, ML score, tier, and allocation status                |
| FeatureVector      | 50+ computed features (firmographic + behavioral + engagement)                       |
| ScoringResult      | ML prediction output — probability, tier, confidence, and feature importance        |
| AllocationDecision | Rep assignment result with match score and allocation rationale                      |

**ML Pipeline:**
- Gradient Boosting classifier with 500 estimators
- Weekly automated retraining with champion/challenger promotion and rollback
- Historical CRM data with 5,500+ conversions/year provides training labels
- RabbitMQ decouples scoring from allocation — scoring API returns immediately, allocation runs async

---
