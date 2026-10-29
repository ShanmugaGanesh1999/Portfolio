# Sherwin-Williams - Senior Software Engineer - FullStack AI FDE

**Period:** August 2026 - Present

**Location:** Cleveland, OH

**Tags:** `PYSPARK` · `DATABRICKS` · `LAKEBASE` · `ENTITY MATCHING` · `AI`

## Key accomplishments

- Led a team of 5 engineers on Cover the Codebase, an AI-SDLC platform for 2K+ learners. Owned design reviews, code reviews, and pipeline standards while building configurable intake across GitHub, Copilot, Claude, Codex, SonarQube/SonarCloud, ServiceNow, and Jira.

- Built an entity matching service that resolved 2M+ records from GitHub, Entra ID, Pluralsight, and Copilot into canonical learner IDs. Deterministic and fuzzy matching, deduplication, and identity mapping achieved a 98% match rate.

- Architected Databricks Medallion pipelines processing 1.3M+ daily events with PySpark, Delta Lake, Unity Catalog, and Lakeflow Jobs. Partitioning, broadcast joins, skew handling, and Z-ordering cut runtime by 33% across 23 adoption metrics.

- Designed Lakebase PostgreSQL schemas with data quality scoring, status assignment, and correction-aware upserts for downstream dashboards. Load-tested at 5.4M rows and 2K concurrent queries.

## Project: Cover the Codebase

The AI-SDLC platform supports 2K+ learners and 23 adoption metrics.

### Configurable data intake

Sources include GitHub, Copilot, Claude, Codex, SonarQube/SonarCloud, ServiceNow, and Jira.

### Entity resolution

The matching service resolves GitHub, Entra ID, Pluralsight, and Copilot records into canonical learner IDs. Deterministic and fuzzy matching, deduplication, and identity mapping achieved a 98% match rate across 2M+ records.

### Data engineering

Databricks Medallion pipelines process 1.3M+ events daily with PySpark, Delta Lake, Unity Catalog, and Lakeflow Jobs. Spark partitioning, broadcast joins, skew handling, and Z-ordering reduced runtime by 33%.

### Lakebase data model

Lakebase PostgreSQL schemas support data quality scoring, status assignment, and correction-aware upserts. Resolved entities sync to downstream dashboards. Load tests covered 5.4M rows and 2K concurrent queries.

Detailed implementation remains proprietary to Sherwin-Williams.
