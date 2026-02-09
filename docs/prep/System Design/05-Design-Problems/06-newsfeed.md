# Design Newsfeed

> Personalized content ranking and delivery

---

## 📋 Problem Statement

Design a newsfeed system like Facebook's News Feed that displays personalized content from friends and pages, ranked by relevance.

---

## R - Requirements

### Functional Requirements

```
1. Display personalized feed of posts
2. Posts from friends, followed pages, groups
3. Ranking by relevance (not just chronological)
4. Support text, images, videos, links
5. Like, comment, share interactions
6. Real-time updates for new content
```

### Non-Functional Requirements

```
1. Low latency feed loading (<500ms)
2. Personalized ranking per user
3. Fresh content (new posts appear quickly)
4. Scalable to billions of users
5. Handle viral content gracefully
```

### Capacity Estimation

```
Users:
├── 3B total users
├── 2B daily active

Posts:
├── 1B new posts per day
├── Each user has ~500 friends average

Feed reads:
├── Each user checks feed 10 times/day
├── 2B × 10 = 20B feed reads/day
├── 230K reads/second average
├── Peak: 2M reads/second
```

---

## H - High-Level Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────────────────────────────────────┐│
│   │                   Load Balancer                         ││
│   └─────────────────────────┬──────────────────────────────┘│
│                             │                                │
│              ┌──────────────┴──────────────┐                │
│              ▼                             ▼                │
│   ┌──────────────────┐          ┌──────────────────┐        │
│   │   Post Service   │          │   Feed Service   │        │
│   │  (Create posts)  │          │  (Build feeds)   │        │
│   └────────┬─────────┘          └────────┬─────────┘        │
│            │                             │                   │
│            ▼                             ▼                   │
│   ┌──────────────────┐          ┌──────────────────┐        │
│   │   Fan-out        │          │   Feed Cache     │        │
│   │   Service        │          │   (Redis)        │        │
│   └────────┬─────────┘          └────────┬─────────┘        │
│            │                             │                   │
│            ▼                             ▼                   │
│   ┌────────────────────────────────────────────────────────┐│
│   │                   Ranking Service                       ││
│   │              (ML-based relevance scoring)               ││
│   └────────────────────────────────────────────────────────┘│
│                             │                                │
│   ┌─────────────────────────┴─────────────────────────────┐ │
│   │                    Data Layer                          │ │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────┐ │ │
│   │  │  Posts  │  │ Social  │  │  Feed   │  │  ML Model │ │ │
│   │  │   DB    │  │  Graph  │  │  Cache  │  │  Features │ │ │
│   │  └─────────┘  └─────────┘  └─────────┘  └───────────┘ │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Feed Generation Approaches

```
Approach 1: Pull Model (Fan-out on Read)
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   User requests feed:                                        │
│   1. Get list of friends (500 avg)                          │
│   2. Fetch recent posts from each friend                    │
│   3. Merge and rank                                         │
│   4. Return top N posts                                     │
│                                                              │
│   Pros: No pre-computation, always fresh                    │
│   Cons: Slow (500 queries per request), latency issue       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Approach 2: Push Model (Fan-out on Write)
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   User creates post:                                         │
│   1. Save post to database                                  │
│   2. Get all followers                                       │
│   3. Push post_id to each follower's feed cache             │
│                                                              │
│   User requests feed:                                        │
│   1. Read pre-built feed from cache                         │
│   2. Fetch post details                                     │
│   3. Return                                                  │
│                                                              │
│   Pros: Fast reads (O(1) feed fetch)                        │
│   Cons: Slow writes for popular users, storage heavy        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Approach 3: Hybrid (Facebook's Approach)
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   Regular users: Push (fan-out on write)                    │
│   Celebrities/Pages: Pull (fan-out on read)                 │
│                                                              │
│   User feed = Pre-built feed + Celebrity posts merged       │
│                                                              │
│   Why? Celebrities have millions of followers               │
│   Can't push to millions on every post                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Feed Cache Structure

```
Redis Sorted Set per user:

ZADD feed:{user_id} {ranking_score} {post_id}

feed:123
├── score: 0.95, member: "post:789"  (high relevance)
├── score: 0.87, member: "post:456"
├── score: 0.72, member: "post:123"
└── ... (keep ~1000 posts)

Score = ranking score (not timestamp)
Updated as new posts arrive or scores change
```

### Ranking Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│                    Ranking Pipeline                          │
│                                                              │
│   1. Candidate Generation                                    │
│      ├── Friend posts (last 24h)                            │
│      ├── Page posts (followed)                              │
│      ├── Group posts                                        │
│      └── Ads (injected later)                               │
│                                                              │
│   2. Feature Extraction                                      │
│      ├── Post features:                                     │
│      │   ├── Type (text, image, video)                     │
│      │   ├── Age (recency)                                 │
│      │   ├── Engagement (likes, comments, shares)          │
│      │   └── Content quality signals                       │
│      ├── User features:                                     │
│      │   ├── Interests                                     │
│      │   ├── Past behavior                                 │
│      │   └── Relationship strength                         │
│      └── Contextual features:                               │
│          ├── Time of day                                   │
│          ├── Device type                                   │
│          └── Network condition                             │
│                                                              │
│   3. Scoring                                                 │
│      ├── ML model predicts P(engagement)                    │
│      ├── Combines hundreds of signals                       │
│      └── Real-time scoring with cached features            │
│                                                              │
│   4. Final Ranking                                           │
│      ├── Sort by score                                      │
│      ├── Apply diversity rules                              │
│      ├── Inject ads at intervals                           │
│      └── Return top N                                       │
└─────────────────────────────────────────────────────────────┘
```

### Ranking Formula (Simplified)

```
Score = Σ (P(action) × Value(action))

Where:
├── P(like) × 1.0
├── P(comment) × 5.0
├── P(share) × 10.0
├── P(click) × 2.0
└── Recency decay factor

P(action) = ML model prediction
Value(action) = Business-defined weights

Edge Rank (Facebook's original):
Score = Affinity × Weight × Decay

Affinity: How close are you to the author?
Weight: Type of content (video > photo > text)
Decay: How old is the post?
```

### Real-time Updates

```
┌─────────────────────────────────────────────────────────────┐
│              Real-time Feed Updates                          │
│                                                              │
│   Option 1: Polling                                          │
│   ├── Client polls every 30 seconds                         │
│   ├── Simple but not real-time                              │
│   └── Wastes resources if no new content                    │
│                                                              │
│   Option 2: Long Polling                                     │
│   ├── Request waits until new content                       │
│   ├── Better but still has overhead                         │
│                                                              │
│   Option 3: WebSocket                                        │
│   ├── Persistent connection                                 │
│   ├── Push updates instantly                                │
│   └── Best UX, higher server cost                           │
│                                                              │
│   Option 4: Hybrid (Facebook's approach)                     │
│   ├── WebSocket for active users                            │
│   ├── "New posts available" notification                    │
│   └── User clicks to refresh (saves computation)            │
└─────────────────────────────────────────────────────────────┘
```

---

## A - API Design

### Get Feed

```
GET /api/feed?cursor={last_post_id}&limit=20
Authorization: Bearer {token}

Response:
{
    "posts": [
        {
            "post_id": "123",
            "author": {
                "id": "456",
                "name": "John Doe",
                "avatar": "..."
            },
            "content": "Hello world!",
            "media": [...],
            "created_at": "2024-01-15T10:00:00Z",
            "like_count": 100,
            "comment_count": 20,
            "viewer_liked": true,
            "ranking_reason": "friend_posted"  // optional
        }
    ],
    "next_cursor": "789",
    "has_more": true
}
```

### Create Post

```
POST /api/posts
{
    "content": "My new post!",
    "media_ids": ["media-123"],
    "visibility": "friends"
}

Response:
{
    "post_id": "new-post-id",
    "created_at": "..."
}
```

---

## D - Detailed Design (Continued)

### Social Graph Storage

```
┌─────────────────────────────────────────────────────────────┐
│                   Social Graph                               │
│                                                              │
│   Storage: Graph database or NoSQL                          │
│                                                              │
│   Friendships (bidirectional):                              │
│   user:123:friends → [456, 789, ...]                        │
│                                                              │
│   Followers (unidirectional - pages):                       │
│   page:ABC:followers → [123, 456, ...]                      │
│   user:123:follows → [page:ABC, page:XYZ, ...]              │
│                                                              │
│   Interaction strength (for ranking):                       │
│   interaction:123:456 → {                                   │
│       messages: 50,                                         │
│       likes: 20,                                            │
│       comments: 10,                                         │
│       last_interaction: "2024-01-15"                        │
│   }                                                          │
│                                                              │
│   Used for: Affinity scoring in ranking                     │
└─────────────────────────────────────────────────────────────┘
```

### Handling Viral Posts

```
Problem: Viral post from celebrity = millions of fans to notify

Solution:
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   1. Don't fan-out for celebrities (>10K followers)         │
│      ├── Mark as "pull on read"                            │
│      └── Fetch at query time                                │
│                                                              │
│   2. Lazy fan-out                                           │
│      ├── Push to online users only                         │
│      └── Others get it when they come online               │
│                                                              │
│   3. Rate limiting                                          │
│      ├── Max N posts per user per hour in feed             │
│      └── Prevents single source domination                 │
│                                                              │
│   4. Engagement-based propagation                           │
│      ├── Initial push to sample                            │
│      ├── If high engagement → push to more                 │
│      └── Viral detection                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Feed Freshness vs Latency

```
Trade-off:
├── More fresh → Higher latency (more computation)
├── Pre-computed → Stale but fast

Solution: Tiered freshness

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   Layer 1: Hot Cache (Redis)                                │
│   ├── Last 1 hour of ranked content                        │
│   ├── Refresh every few minutes                            │
│   └── Serves 90% of requests                               │
│                                                              │
│   Layer 2: Warm Cache                                        │
│   ├── Last 24 hours                                         │
│   ├── Refresh hourly                                        │
│   └── For scrolling back                                    │
│                                                              │
│   Layer 3: Cold Storage                                      │
│   ├── Full history                                          │
│   ├── On-demand computation                                 │
│   └── For deep scrolling                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## E - Evaluation

### Bottlenecks

```
1. Fan-out for popular users
   → Hybrid push/pull approach
   → Async processing via queues

2. Ranking computation cost
   → Pre-compute features
   → Cache model predictions
   → Limit re-ranking frequency

3. Cache invalidation
   → Time-based expiry
   → Event-driven updates for interactions

4. Real-time updates at scale
   → WebSocket for engaged users
   → Polling for background
```

### Metrics to Track

```
Latency:
├── Feed load time (p50, p95, p99)
├── Time to first post visible

Engagement:
├── Time spent in feed
├── Interaction rate (likes, comments)
├── Scroll depth

Quality:
├── Diversity score
├── Freshness of content
├── User satisfaction surveys
```

---

## D - Distinctive Features

### Content Diversity

```
Problem: Echo chamber, filter bubble

Solutions:
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   1. Diversity rules:                                        │
│      ├── Max 2 posts from same author in a row             │
│      ├── Mix content types (text, image, video)            │
│      └── Include some unexpected content                    │
│                                                              │
│   2. Exploration vs exploitation:                            │
│      ├── 90% ranked content (exploitation)                 │
│      ├── 10% random/new sources (exploration)              │
│      └── Learn from user feedback                          │
│                                                              │
│   3. Negative signals:                                       │
│      ├── "Hide post" → reduce similar content              │
│      ├── Unfollow → remove from candidates                 │
│      └── Report → content quality signal                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### A/B Testing Framework

```
┌─────────────────────────────────────────────────────────────┐
│              Ranking A/B Testing                             │
│                                                              │
│   Each user assigned to experiment bucket:                  │
│   ├── Control: Current ranking algorithm                   │
│   └── Treatment: New ranking algorithm                     │
│                                                              │
│   Metrics compared:                                          │
│   ├── Time spent                                            │
│   ├── Engagement rate                                       │
│   ├── User retention                                        │
│   └── Business metrics (ad revenue)                        │
│                                                              │
│   Gradual rollout:                                          │
│   1% → 5% → 10% → 50% → 100%                               │
│   Monitor for regressions at each stage                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary

```
Key Components:
├── Fan-out Service: Push posts to follower feeds
├── Feed Cache: Pre-built feeds in Redis
├── Ranking Service: ML-based relevance scoring
├── Social Graph: Relationship storage

Key Decisions:
├── Hybrid fan-out (push for regular, pull for celebrities)
├── ML ranking with hundreds of features
├── Tiered caching for freshness/latency trade-off
├── WebSocket for real-time engaged users

Scale:
├── 2M feed reads/second at peak
├── ~1000 posts per user feed cache
├── Real-time updates for active users
├── A/B testing for continuous improvement
```

---

## 📖 Next Steps

→ Continue to [Design Uber](./07-uber.md)
