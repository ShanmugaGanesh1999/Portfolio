# Design Quora

> Q&A platform with content ranking and recommendations

---

## 📋 Problem Statement

Design a question-and-answer platform like Quora where users can ask questions, write answers, and discover relevant content.

---

## R - Requirements

### Functional Requirements

```
1. Post questions and answers
2. Upvote/downvote answers
3. Follow topics, questions, and users
4. Personalized feed of Q&A
5. Search questions and answers
6. Comments on answers
7. Notifications
```

### Non-Functional Requirements

```
1. Read-heavy (100:1 read to write)
2. Low latency feed (<200ms)
3. Eventually consistent
4. Handle viral content (spikes)
```

---

## E - Estimation

```
Users: 300M monthly active
Questions: 50M total
Answers: 500M total

Daily activity:
├── 100K new questions/day
├── 500K new answers/day
├── 10M votes/day
├── 1B feed views/day

Storage:
├── Questions: 50M × 2KB = 100GB
├── Answers: 500M × 5KB = 2.5TB
├── User data: 300M × 1KB = 300GB
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │                 API Gateway / LB                    │    │
│   └────────────────────────┬───────────────────────────┘    │
│                            │                                 │
│   ┌────────┬───────────────┼───────────────┬──────────┐     │
│   ▼        ▼               ▼               ▼          ▼     │
│ ┌────┐  ┌──────┐     ┌──────────┐    ┌───────┐  ┌───────┐  │
│ │Q&A │  │ Feed │     │  Search  │    │ User  │  │Notif  │  │
│ │Svc │  │ Svc  │     │   Svc    │    │  Svc  │  │ Svc   │  │
│ └─┬──┘  └──┬───┘     └────┬─────┘    └───┬───┘  └───┬───┘  │
│   │        │              │              │          │       │
│   ▼        ▼              ▼              ▼          ▼       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │                      Data Layer                          ││
│ │  ┌────────┐  ┌─────┐  ┌────────┐  ┌──────┐  ┌────────┐  ││
│ │  │Postgres│  │Redis│  │Elastic │  │ Neo4j│  │ Kafka  │  ││
│ │  │(Q&A)   │  │Cache│  │Search  │  │(Graph)│ │(Events)│  ││
│ │  └────────┘  └─────┘  └────────┘  └──────┘  └────────┘  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Data Model

```sql
-- Questions
CREATE TABLE questions (
    id              UUID PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    body            TEXT,
    author_id       UUID REFERENCES users(id),
    topic_ids       UUID[],
    
    -- Denormalized counts
    answer_count    INT DEFAULT 0,
    follower_count  INT DEFAULT 0,
    view_count      INT DEFAULT 0,
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Answers
CREATE TABLE answers (
    id              UUID PRIMARY KEY,
    question_id     UUID REFERENCES questions(id),
    author_id       UUID REFERENCES users(id),
    content         TEXT NOT NULL,
    
    -- Voting
    upvotes         INT DEFAULT 0,
    downvotes       INT DEFAULT 0,
    score           INT DEFAULT 0,  -- upvotes - downvotes
    
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Votes (for deduplication)
CREATE TABLE votes (
    user_id         UUID,
    answer_id       UUID,
    vote_type       INT,  -- 1 = upvote, -1 = downvote
    created_at      TIMESTAMP,
    PRIMARY KEY (user_id, answer_id)
);

-- Follows
CREATE TABLE follows (
    follower_id     UUID,
    target_id       UUID,
    target_type     VARCHAR(20),  -- 'user', 'topic', 'question'
    created_at      TIMESTAMP,
    PRIMARY KEY (follower_id, target_id, target_type)
);
```

### Answer Ranking

```
┌─────────────────────────────────────────────────────────────┐
│              Answer Ranking                                  │
│                                                              │
│   Goal: Show best answers first                             │
│                                                              │
│   Signals:                                                   │
│   ├── Vote score (upvotes - downvotes)                     │
│   ├── Author credibility (follower count, expertise)       │
│   ├── Recency                                              │
│   ├── Answer length / quality                              │
│   └── Engagement (comments, shares)                        │
│                                                              │
│   Simple formula:                                            │
│   score = votes + log(1 + followers) ×                      │
│           time_decay(age) × quality_factor                  │
│                                                              │
│   Time decay:                                                │
│   decay = 1 / (1 + hours_old / 24)^1.5                      │
│                                                              │
│   Quality signals:                                           │
│   ├── Length > 200 chars → +1                              │
│   ├── Has images/links → +0.5                              │
│   ├── Verified author → +2                                 │
│   └── Spam score < 0.1 → proceed                           │
│                                                              │
│   Implementation:                                            │
│   ├── Store pre-computed score                             │
│   ├── Recompute on vote/engagement                         │
│   ├── Sort by score descending                             │
│   └── Cache top answers per question                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Feed Generation

```
┌─────────────────────────────────────────────────────────────┐
│              Personalized Feed                               │
│                                                              │
│   Feed sources:                                              │
│   1. Questions from followed topics                         │
│   2. Answers from followed users                            │
│   3. Questions I'm following                               │
│   4. Trending in my topics                                  │
│   5. Recommended based on history                           │
│                                                              │
│   Architecture:                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                   Feed Service                       │   │
│   │                                                      │   │
│   │  1. Get user's follows (topics, users, questions)   │   │
│   │  2. Fetch candidates from each source              │   │
│   │  3. Merge and rank                                  │   │
│   │  4. Filter (already seen, blocked)                 │   │
│   │  5. Return top N                                   │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Ranking signals:                                           │
│   ├── Affinity to author (past engagement)                 │
│   ├── Topic relevance                                      │
│   ├── Content freshness                                    │
│   ├── Engagement (votes, comments)                         │
│   └── Diversity (don't show same topic repeatedly)         │
│                                                              │
│   Caching:                                                   │
│   ├── Pre-compute for active users                         │
│   ├── Cache in Redis with TTL                              │
│   └── Invalidate on new content from follows               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Search System

```
┌─────────────────────────────────────────────────────────────┐
│              Search Architecture                             │
│                                                              │
│   Elasticsearch indices:                                     │
│                                                              │
│   Questions index:                                           │
│   {                                                          │
│     "id": "q123",                                           │
│     "title": "How do I learn Python?",                      │
│     "body": "I want to start programming...",               │
│     "topics": ["python", "programming"],                    │
│     "answer_count": 15,                                     │
│     "follower_count": 100                                   │
│   }                                                          │
│                                                              │
│   Answers index:                                             │
│   {                                                          │
│     "id": "a456",                                           │
│     "question_id": "q123",                                  │
│     "content": "The best way to learn...",                  │
│     "author": "expert_user",                                │
│     "score": 500                                            │
│   }                                                          │
│                                                              │
│   Search query:                                              │
│   - Match title and body                                    │
│   - Boost by follower_count and answer_count               │
│   - Filter by topics if specified                          │
│                                                              │
│   Duplicate detection:                                       │
│   - Show "Similar questions" on ask                        │
│   - Use semantic similarity                                │
│   - Merge duplicate questions                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Topic System

```
┌─────────────────────────────────────────────────────────────┐
│              Topic Graph                                     │
│                                                              │
│   Topics form a hierarchy/graph:                            │
│                                                              │
│   Programming                                                │
│   ├── Python                                                │
│   │   ├── Django                                           │
│   │   └── Flask                                            │
│   ├── JavaScript                                            │
│   │   ├── React                                            │
│   │   └── Node.js                                          │
│   └── Java                                                  │
│                                                              │
│   Storage: Neo4j or PostgreSQL with ltree                   │
│                                                              │
│   Use cases:                                                 │
│   ├── Topic suggestions when asking question               │
│   ├── Related topics on topic page                         │
│   ├── Feed includes parent/child topics                    │
│   └── Expert identification per topic                      │
│                                                              │
│   Topic experts:                                             │
│   ├── Users with high-voted answers in topic               │
│   ├── Computed weekly                                      │
│   └── Shown on topic page, invited to answer              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Notification System

```
┌─────────────────────────────────────────────────────────────┐
│              Notifications                                   │
│                                                              │
│   Notification types:                                        │
│   ├── New answer to my question                            │
│   ├── New answer to question I follow                      │
│   ├── Upvote on my answer                                  │
│   ├── Comment on my answer                                 │
│   ├── New question in topic I follow                       │
│   └── Someone I follow answered                            │
│                                                              │
│   Event flow:                                                │
│   1. Action occurs (answer posted)                          │
│   2. Publish event to Kafka                                 │
│   3. Notification service consumes                          │
│   4. Determine recipients                                   │
│   5. Create notification records                            │
│   6. Push via WebSocket / store for pull                   │
│                                                              │
│   Aggregation:                                               │
│   ├── "5 people upvoted your answer"                       │
│   ├── Don't spam with every upvote                         │
│   ├── Batch similar notifications                          │
│   └── Digest emails (daily/weekly)                         │
│                                                              │
│   Priority:                                                  │
│   ├── High: Direct mentions, answers to my questions       │
│   ├── Medium: Follows activity                             │
│   └── Low: Topic activity                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 API Design

```
# Questions
POST /v1/questions
{
    "title": "How do I learn Python?",
    "body": "I'm a beginner...",
    "topic_ids": ["python", "learning"]
}

GET /v1/questions/{id}
GET /v1/questions/{id}/answers?sort=votes

# Answers
POST /v1/questions/{id}/answers
{
    "content": "The best way is..."
}

# Voting
POST /v1/answers/{id}/vote
{
    "type": "upvote"  # or "downvote"
}

# Following
POST /v1/follow
{
    "target_id": "topic_python",
    "target_type": "topic"
}

# Feed
GET /v1/feed?cursor=abc123

# Search
GET /v1/search?q=learn+python&type=questions
```

---

## 📊 Summary

```
Key Components:
├── Q&A Service: CRUD for questions/answers
├── Feed Service: Personalized content ranking
├── Search Service: Elasticsearch-powered discovery
├── Topic Graph: Hierarchical topic organization

Key Decisions:
├── Pre-compute answer scores
├── Fan-out on read for feed (no pre-materialization)
├── Elasticsearch for search + duplicate detection
├── Kafka for async notifications

Ranking:
├── Vote score + author credibility + recency
├── Personalization based on follows
├── Diversity rules in feed
```
