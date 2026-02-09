# Case Western Reserve University — Access Services Specialist

**Period:** January 2024 – May 2025  
**Location:** Cleveland, OH  
**Tags:** `JAVA` · `SPRING BOOT` · `OAUTH2` · `AWS` · `ORACLE`

---

## Role Summary

Access Services Specialist responsible for designing and building a centralized Identity & Access Management (IAM) platform for campus-wide services, using Java microservices and Spring Security with OAuth2 SSO.

---

## Education

- **Degree:** MS Computer Science
- **GPA:** 3.78 / 4.0
- **Graduation:** 2025
- **Coursework:** Distributed Systems, Advanced Algorithms, OS, Networking, Database Management, Software Engineering

---

## Key Accomplishments

- Led migration to a **centralized IAM platform** implementing OAuth2 SSO with Spring Security & Java microservices
- Reduced **duplicate logins by 60%** through unified authentication architecture
- Engineered **RBAC and attribute-based access policies**, cutting manual reviews by **50%**
- Achieved **sub-200ms response times** and **99.9% uptime** across all identity services

---

## Project: Campus-Wide IAM Platform

**Status:** DEPLOYED  
**Tech Stack:** Java, Spring Boot, OAuth2, Kafka, PostgreSQL

> Centralized Identity & Access Management using Spring Security, OAuth2/OIDC, and Java microservices. Reduced duplicate logins by 60%, authentication tickets by 35%, sub-200ms response times.

### Functional Requirements

| Requirement                             | Details                                                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single Sign-On (SSO)                    | Users authenticate once via OAuth2/OIDC and access all campus services (dining, parking, library, labs) without re-login                             |
| Fine-Grained Access Control             | RBAC and ABAC policies for physical access (door readers, parking gates), digital resources, and time-bound permissions (e.g., "CS lab Mon-Fri 8am-10pm") |
| Real-Time Provisioning & Deprovisioning | Sync user attributes (enrollment status, department, roles) from LDAP/AD to downstream systems within 5 minutes; revoke access immediately on termination |

### Non-Functional Requirements

| Attribute    | Target                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Consistency  | Strong Consistency for authentication/authorization decisions (cannot grant access based on stale revocation data); Eventual Consistency for audit logs |
| Latency      | <200ms p95 for AuthZ API calls, <500ms for SSO token issuance                                                                       |
| Availability | 99.9% uptime (campus lockout is unacceptable)                                                                                       |

### Scale Estimates

```
Assumptions:
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
  latency via aggressive caching and optimized DB queries, not horizontal scale.
```

### System Architecture (High-Level)

```
Client (Web / Mobile / Card Readers)
    ↓
AWS ALB (Load Balancer)
    ↓
API Gateway (Kong + OAuth2)
    ├── Auth Service (Spring Boot) → User Store (PostgreSQL) + Token Cache (Redis) + S3
    ├── Authz Service (Spring Boot) → Policy Cache (Caffeine/Redis) + Policy DB (PostgreSQL)
    └── Provisioning Service (Spring Boot) → LDAP/AD + Kafka
                                                ↓
                                          Kafka → Downstream Services
                                                ↓
                                          Audit Logger → DynamoDB (Audit Trail)
```

**Key Components:**

| Component          | Technology    | Description                                                                                                      |
| ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Auth Service       | Spring Boot   | OAuth2 token issuance (password grant, refresh rotation). Validates credentials against PostgreSQL, caches JWTs in Redis |
| Authz Service      | Spring Boot   | Policy Decision Point — evaluates RBAC + ABAC. Two-tier cache: L1 Caffeine (60s TTL) → L2 Redis (5min TTL) → PostgreSQL |
| Provisioning Svc   | Spring Boot   | Syncs user attributes from LDAP/AD every 15 minutes. Publishes UserUpdated events to Kafka                        |
| User Store         | PostgreSQL    | Primary user database — users, user_roles, credentials. Indexed on user_id and status                             |
| Token Cache        | Redis         | Session/token cache for O(1) lookups                                                                              |
| Audit Logger       | DynamoDB      | Immutable audit trail for compliance                                                                              |

### Low-Level Design Highlights

**Pattern:** OAuth2 Token Lifecycle + Hybrid RBAC/ABAC Policy Evaluation

| Entity                | Description                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------- |
| User                  | Immutable identity record with userId, roles, and attributes from LDAP/AD                    |
| AuthToken             | JWT with tokenId, expiry, claims, and signature for session management                       |
| AccessPolicy          | RBAC role + ABAC conditions with resource pattern matching and Predicate evaluation          |
| AuthorizationDecision | PERMIT/DENY result with reason and list of applied policy IDs                                |

**Concurrency Model:**
- ConcurrentHashMap for lock-free token reads (95% workload)
- ReentrantReadWriteLock for policy cache — concurrent `authorize()` with exclusive `provisionRole()` writes
- 10K concurrent users; read-heavy workload (95% reads); policy updates <1% writes
- JWT access tokens: 3600s expiry; refresh tokens: 7 days; single active session per user

---
