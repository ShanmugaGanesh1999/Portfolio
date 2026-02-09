# Design Twitter

> Real-time social media platform with timeline and fan-out

---

## 📋 Problem Statement

Design a social media platform like Twitter where users can post tweets, follow other users, and see a timeline of tweets from people they follow.

---

## R - Requirements

### Functional Requirements

```
1. Post a tweet (280 characters, images optional)
2. Follow/unfollow users
3. View home timeline (tweets from people you follow)
4. View user profile and their tweets
5. Like and retweet
6. Search tweets and users
```

### Non-Functional Requirements

```
1. High availability (always accessible)
2. Low latency timeline (<200ms)
3. Eventual consistency is acceptable
4. Support viral tweets (millions of likes)
5. Scale to 500M users, 300M DAU
```

### Capacity Estimation

```
Users:
├── 500M total users
├── 300M daily active users
├── Average 200 followers per user

Tweets:
├── 500M tweets/day
├── Write: 500M / 86400 ≈ 6000 tweets/second
├── Peak: 6000 × 10 = 60,000 tweets/second

Timeline reads:
├── Each user checks timeline 10 times/day
├── 300M × 10 = 3B timeline reads/day
├── Read: 3B / 86400 ≈ 35,000/second
├── Peak: 350,000/second

Storage:
├── Tweet: 280 chars + metadata ≈ 500 bytes
├── 500M tweets × 500 bytes = 250 GB/day
├── 5 years: 250 × 365 × 5 = 450 TB
```

---

## H - High-Level Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌───────────────────────────────────────────────────────┐ │
│   │                  Load Balancer                         │ │
│   └────────────────────────┬──────────────────────────────┘ │
│                            │                                 │
│   ┌────────────┬───────────┴────────────┬────────────────┐  │
│   ▼            ▼                        ▼                ▼  │
│ ┌──────┐   ┌──────┐              ┌──────────┐     ┌───────┐ │
│ │Tweet │   │Follow│              │ Timeline │     │Search │ │
│ │Service│  │Service│             │ Service  │     │Service│ │
│ └──┬───┘   └───┬──┘              └────┬─────┘     └───┬───┘ │
│    │           │                      │               │      │
│    │     ┌─────┴──────────────────────┘               │      │
│    │     │                                            │      │
│    ▼     ▼                                            ▼      │
│ ┌────────────────┐   ┌────────────────┐    ┌──────────────┐ │
│ │   Tweet DB     │   │  Timeline      │    │Elasticsearch │ │
│ │   (Tweets)     │   │  Cache (Redis) │    │  (Search)    │ │
│ └────────────────┘   └────────────────┘    └──────────────┘ │
│                              ▲                               │
│                              │                               │
│                     ┌────────┴────────┐                     │
│                     │   Fan-out       │                     │
│                     │   Service       │                     │
│                     └─────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## S - Storage Schema

### Data Models

```
Users Table:
┌─────────────────────────────────────────────────────────────┐
│ user_id     │ BIGINT    │ PRIMARY KEY                       │
│ username    │ VARCHAR   │ UNIQUE                            │
│ email       │ VARCHAR   │ UNIQUE                            │
│ created_at  │ TIMESTAMP │                                   │
│ followers   │ INT       │ Count (denormalized)              │
│ following   │ INT       │ Count (denormalized)              │
└─────────────────────────────────────────────────────────────┘

Tweets Table:
┌─────────────────────────────────────────────────────────────┐
│ tweet_id    │ BIGINT    │ PRIMARY KEY (Snowflake ID)        │
│ user_id     │ BIGINT    │ FOREIGN KEY                       │
│ content     │ VARCHAR   │ 280 chars                         │
│ created_at  │ TIMESTAMP │ Indexed                           │
│ like_count  │ INT       │ Denormalized                      │
│ retweet_count│ INT      │ Denormalized                      │
│ media_urls  │ JSON      │ Optional                          │
└─────────────────────────────────────────────────────────────┘

Follows Table:
┌─────────────────────────────────────────────────────────────┐
│ follower_id │ BIGINT    │ PRIMARY KEY (composite)           │
│ followee_id │ BIGINT    │ PRIMARY KEY (composite)           │
│ created_at  │ TIMESTAMP │                                   │
└─────────────────────────────────────────────────────────────┘
Index: (followee_id, follower_id) for "who follows me"
```

### Database Choices

```
Tweets/Users: 
├── PostgreSQL or MySQL (relational)
├── Sharded by user_id

Follows:
├── Graph database or NoSQL
├── Or sharded SQL

Timeline Cache:
├── Redis (sorted set per user)

Counters:
├── Redis (sharded counters)

Search:
├── Elasticsearch
```

---

## D - Detailed Design

### The Fan-out Problem

```
When user posts a tweet:
├── All followers need to see it
├── Average user: 200 followers (manageable)
├── Celebrity: 50M followers (disaster!)

Two approaches:
1. Fan-out on Write (Push)
2. Fan-out on Read (Pull)
```

### Fan-out on Write (Push)

```
User posts tweet:
1. Save tweet to database
2. Get follower list
3. Push tweet ID to each follower's timeline cache

┌─────────────┐        ┌─────────────────────────────────────┐
│ User tweets │───────►│ Fan-out Service                     │
└─────────────┘        │                                     │
                       │ For each follower:                  │
                       │   LPUSH timeline:{follower_id} tid  │
                       └─────────────────────────────────────┘

Pros:
├── Fast reads (timeline pre-built)
├── O(1) timeline fetch

Cons:
├── Slow writes for celebrities
├── Wasted space for inactive users
├── Hot spots during viral content
```

### Fan-out on Read (Pull)

```
User opens timeline:
1. Get list of people user follows
2. Fetch recent tweets from each
3. Merge and sort

┌─────────────┐        ┌─────────────────────────────────────┐
│ User reads  │───────►│ Timeline Service                    │
│ timeline    │        │                                     │
└─────────────┘        │ 1. Get followees                    │
                       │ 2. For each: get recent tweets      │
                       │ 3. Merge sort, return top N         │
                       └─────────────────────────────────────┘

Pros:
├── Fast writes (just save tweet)
├── No wasted storage
├── Works for celebrities

Cons:
├── Slow reads (must fetch and merge)
├── High read amplification
```

### Hybrid Approach (Twitter's Actual Solution)

```
┌─────────────────────────────────────────────────────────────┐
│                    Hybrid Fan-out                            │
│                                                              │
│   Regular users (< 10K followers):                          │
│   └── Fan-out on Write (push to followers)                  │
│                                                              │
│   Celebrities (> 10K followers):                            │
│   └── Fan-out on Read (pull at read time)                   │
│                                                              │
│   Timeline = Prebuilt cache + Celebrity tweets merged       │
└─────────────────────────────────────────────────────────────┘
```

```python
def get_timeline(user_id):
    # Get prebuilt timeline (from fan-out on write)
    timeline = redis.lrange(f"timeline:{user_id}", 0, 100)
    
    # Get celebrities user follows
    celebrities = get_celebrity_followees(user_id)
    
    # Fetch celebrity tweets
    for celeb in celebrities:
        celeb_tweets = redis.lrange(f"tweets:{celeb}", 0, 10)
        timeline.extend(celeb_tweets)
    
    # Merge and sort by timestamp
    timeline = merge_and_sort(timeline)
    
    # Return top 100
    return timeline[:100]
```

### Timeline Cache Structure

```
Redis sorted set per user:

ZADD timeline:{user_id} {timestamp} {tweet_id}

user:123:timeline
├── score: 1705320000, member: "tweet:456"
├── score: 1705319000, member: "tweet:455"
├── score: 1705318000, member: "tweet:454"
└── ... (keep last 800 tweets)

Operations:
├── ZADD: Add tweet to timeline
├── ZREVRANGE: Get recent tweets
├── ZREMRANGEBYRANK: Trim old tweets
```

---

## A - API Design

### Post Tweet

```
POST /api/tweets
Authorization: Bearer {token}
{
    "content": "Hello, Twitter!",
    "media_ids": ["12345"]  // optional
}

Response: 201 Created
{
    "tweet_id": "1234567890",
    "content": "Hello, Twitter!",
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Home Timeline

```
GET /api/timeline?cursor={last_tweet_id}&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
    "tweets": [
        {
            "tweet_id": "123",
            "user": {"id": "456", "username": "john"},
            "content": "...",
            "like_count": 100,
            "created_at": "..."
        }
    ],
    "next_cursor": "tweet_id_789"
}
```

### Follow User

```
POST /api/users/{user_id}/follow
Authorization: Bearer {token}

Response: 200 OK
```

---

## D - Detailed Design (Continued)

### Tweet ID Generation

```
Use Snowflake IDs (Twitter's invention):

64-bit ID:
├── 1 bit: sign (always 0)
├── 41 bits: timestamp (milliseconds, ~69 years)
├── 10 bits: machine ID
└── 12 bits: sequence number

Benefits:
├── Roughly time-ordered
├── No coordination needed
├── Unique across data centers
├── K-sortable
```

```python
class SnowflakeGenerator:
    EPOCH = 1288834974657  # Twitter's epoch
    
    def __init__(self, machine_id):
        self.machine_id = machine_id
        self.sequence = 0
        self.last_timestamp = -1
    
    def next_id(self):
        timestamp = current_time_millis()
        
        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 0xFFF
            if self.sequence == 0:
                # Wait for next millisecond
                timestamp = wait_next_millis(self.last_timestamp)
        else:
            self.sequence = 0
        
        self.last_timestamp = timestamp
        
        return ((timestamp - self.EPOCH) << 22) | \
               (self.machine_id << 12) | \
               self.sequence
```

### Sharding Strategy

```
Tweets:
├── Shard by user_id (all user's tweets together)
├── Makes user timeline queries efficient
└── Celebrity shards may be hot

Follows:
├── Shard by follower_id
├── Efficient for "who do I follow?"
└── Replicate for "who follows me?"

Timeline Cache:
├── Shard by user_id
├── Even distribution
```

### Search Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                  Search Architecture                         │
│                                                              │
│   Tweet Created                                              │
│        │                                                     │
│        ▼                                                     │
│   ┌───────────┐        ┌───────────────────┐                │
│   │   Kafka   │───────►│  Search Indexer   │                │
│   └───────────┘        └─────────┬─────────┘                │
│                                  │                           │
│                                  ▼                           │
│                        ┌───────────────────┐                │
│                        │  Elasticsearch    │                │
│                        │  (Tweet Index)    │                │
│                        └───────────────────┘                │
│                                  ▲                           │
│                                  │                           │
│   User Search ───────────────────┘                          │
└─────────────────────────────────────────────────────────────┘

Index fields:
├── content (analyzed)
├── hashtags (keyword)
├── user mentions
├── timestamp
└── engagement signals
```

### Like/Retweet Counters

```
Problem: Viral tweet = millions of likes = hot row

Solution: Sharded counters

┌────────────────────────────────────────┐
│ tweet:123:likes:shard:0 = 10000        │
│ tweet:123:likes:shard:1 = 10234        │
│ tweet:123:likes:shard:2 = 9876         │
│ ...                                    │
│ tweet:123:likes:shard:99 = 10123       │
└────────────────────────────────────────┘

Total likes = SUM(all shards)
Display: "~1M likes" (approximate)
```

---

## E - Evaluation

### Bottlenecks

```
1. Celebrity tweets (fan-out nightmare)
   → Hybrid approach (pull for celebrities)

2. Hot tweets (viral content)
   → Sharded counters, caching

3. Timeline generation at scale
   → Pre-compute + cache in Redis

4. Search at scale
   → Dedicated Elasticsearch cluster
```

### Failure Scenarios

```
Cache failure:
├── Fallback to database
├── Degrade gracefully (slower timeline)

Database failure:
├── Failover to replica
├── Queue writes during outage

Fan-out service failure:
├── Queue tweets in Kafka
├── Process when recovered

Search failure:
├── Disable search feature
├── Core functionality still works
```

### Scaling

```
Read scaling:
├── Redis cluster for timelines
├── Read replicas for tweets
├── CDN for media

Write scaling:
├── Partition fan-out workers
├── Rate limit tweet posting
├── Async processing via queues
```

---

## D - Distinctive Features

### Real-time Notifications

```
WebSocket for live updates:

User online → WebSocket connection
Tweet from followee → Push to WebSocket

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Tweet Posted │────►│    Kafka     │────►│  WebSocket   │
│              │     │              │     │   Server     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                         Push to connected users
```

### Trending Topics

```
Sliding window algorithm:

1. Count hashtag occurrences in last hour
2. Compare to normal baseline
3. Abnormal spike = trending

Redis implementation:
├── Increment hashtag counter
├── Decay over time (sorted set with timestamp)
├── Calculate velocity
└── Rank by velocity/engagement
```

---

## 📊 Summary

```
Key Components:
├── Tweet Service: CRUD for tweets
├── Timeline Service: Build/serve timelines
├── Fan-out Service: Push to followers (async)
├── Search Service: Elasticsearch
├── Notification Service: WebSocket push

Key Decisions:
├── Hybrid fan-out (push + pull)
├── Snowflake IDs for tweet ordering
├── Redis for timeline caching
├── Sharded counters for viral content
├── Kafka for async processing

Trade-offs:
├── Push for fast reads, Pull for celebrities
├── Eventual consistency acceptable
├── Approximate counts for display
```

---

## 📖 Next Steps

→ Continue to [Design Instagram](./03-instagram.md)
