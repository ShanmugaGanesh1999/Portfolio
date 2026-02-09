# Design Instagram

> Photo sharing platform with feed and stories

---

## 📋 Problem Statement

Design a photo and video sharing social media platform like Instagram where users can share posts, follow others, and browse a personalized feed.

---

## R - Requirements

### Functional Requirements

```
1. Upload photos and videos (posts)
2. Follow/unfollow users
3. View home feed (posts from followees)
4. Like and comment on posts
5. View user profiles
6. Stories (24-hour expiring content)
7. Direct messaging (simplified)
```

### Non-Functional Requirements

```
1. High availability
2. Low latency feed loading (<500ms)
3. Reliable media upload (never lose photos)
4. Fast image loading (CDN)
5. Support 2B users, 500M DAU
```

### Capacity Estimation

```
Users:
├── 2B total users
├── 500M daily active users
├── Average 500 followers per user

Posts:
├── 100M photos/videos per day
├── Write: 100M / 86400 ≈ 1200 uploads/second
├── Average photo size: 2MB
├── Storage: 100M × 2MB = 200TB/day

Feed reads:
├── Each user checks feed 5 times/day
├── 500M × 5 = 2.5B feed reads/day
├── Read: 2.5B / 86400 ≈ 30,000/second
```

---

## H - High-Level Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                              │
│                            │                                 │
│                            ▼                                 │
│   ┌────────────────────────────────────────────────────────┐│
│   │                    CDN (Images)                         ││
│   └────────────────────────────────────────────────────────┘│
│                            │                                 │
│                            ▼                                 │
│   ┌────────────────────────────────────────────────────────┐│
│   │                   Load Balancer                         ││
│   └─────────────────────────┬──────────────────────────────┘│
│                             │                                │
│   ┌──────────┬──────────────┼──────────────┬──────────────┐ │
│   ▼          ▼              ▼              ▼              ▼ │
│ ┌──────┐  ┌──────┐    ┌──────────┐   ┌──────────┐  ┌─────┐ │
│ │Upload│  │ Feed │    │  User    │   │  Story   │  │ DM  │ │
│ │Service│ │Service│   │ Service  │   │ Service  │  │Svc  │ │
│ └──┬───┘  └──┬───┘    └────┬─────┘   └────┬─────┘  └──┬──┘ │
│    │         │             │              │            │     │
│    ▼         ▼             ▼              ▼            ▼     │
│ ┌──────────────────────────────────────────────────────────┐│
│ │                      Data Layer                           ││
│ │  ┌─────────┐  ┌─────────┐  ┌────────┐  ┌──────────────┐  ││
│ │  │   S3    │  │  MySQL  │  │ Redis  │  │ Cassandra    │  ││
│ │  │ (Media) │  │(Metadata)│ │(Cache) │  │(Feed/Stories)│  ││
│ │  └─────────┘  └─────────┘  └────────┘  └──────────────┘  ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## S - Storage Schema

### Data Models

```
Users:
┌─────────────────────────────────────────────────────────────┐
│ user_id      │ BIGINT    │ PRIMARY KEY                      │
│ username     │ VARCHAR   │ UNIQUE                           │
│ email        │ VARCHAR   │ UNIQUE                           │
│ profile_pic  │ VARCHAR   │ S3 URL                           │
│ bio          │ TEXT      │                                  │
│ followers_count│ INT     │ Denormalized                     │
│ following_count│ INT     │ Denormalized                     │
└─────────────────────────────────────────────────────────────┘

Posts:
┌─────────────────────────────────────────────────────────────┐
│ post_id      │ BIGINT    │ PRIMARY KEY                      │
│ user_id      │ BIGINT    │ FK, Indexed                      │
│ media_url    │ VARCHAR   │ S3 URL                           │
│ thumbnail_url│ VARCHAR   │ S3 URL                           │
│ caption      │ TEXT      │                                  │
│ location     │ VARCHAR   │ Optional                         │
│ created_at   │ TIMESTAMP │ Indexed                          │
│ like_count   │ INT       │ Denormalized                     │
│ comment_count│ INT       │ Denormalized                     │
└─────────────────────────────────────────────────────────────┘

Follows:
┌─────────────────────────────────────────────────────────────┐
│ follower_id  │ BIGINT    │ Composite PK                     │
│ followee_id  │ BIGINT    │ Composite PK                     │
│ created_at   │ TIMESTAMP │                                  │
└─────────────────────────────────────────────────────────────┘

Feed (Cassandra):
┌─────────────────────────────────────────────────────────────┐
│ user_id      │ BIGINT    │ Partition Key                    │
│ post_id      │ BIGINT    │ Clustering Key (DESC)            │
│ created_at   │ TIMESTAMP │                                  │
│ author_id    │ BIGINT    │                                  │
└─────────────────────────────────────────────────────────────┘
```

### Database Choices

```
User Metadata: MySQL/PostgreSQL
├── ACID transactions for follows
├── Relational for user data
└── Sharded by user_id

Media: S3 + CloudFront
├── Unlimited storage
├── High durability
├── CDN for fast delivery

Feed: Cassandra
├── High write throughput
├── Wide column for timeline
├── Easy horizontal scaling

Cache: Redis
├── Hot posts
├── User sessions
├── Feed cache
```

---

## D - Detailed Design

### Photo Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Upload Flow                               │
│                                                              │
│   1. Client requests upload URL                             │
│   ┌──────────┐      ┌────────────────┐                      │
│   │  Client  │─────►│ Upload Service │                      │
│   └──────────┘      └───────┬────────┘                      │
│        │                    │                                │
│        │              Generate presigned URL                │
│        │                    │                                │
│        │◄───────────────────┘                                │
│        │                                                     │
│   2. Client uploads directly to S3                          │
│        │                                                     │
│        └─────────────────────────────────────►┌─────────┐   │
│                                               │   S3    │   │
│   3. S3 triggers processing                   └────┬────┘   │
│                                                    │         │
│        ┌───────────────────────────────────────────┘         │
│        ▼                                                     │
│   ┌────────────────────┐                                    │
│   │  Lambda/Worker     │                                    │
│   │  - Resize images   │                                    │
│   │  - Generate thumbs │                                    │
│   │  - Extract EXIF    │                                    │
│   │  - Update DB       │                                    │
│   └────────────────────┘                                    │
│                                                              │
│   4. Fan-out to followers' feeds                            │
└─────────────────────────────────────────────────────────────┘
```

### Image Processing Pipeline

```
Original Upload
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                 Image Processing                             │
│                                                              │
│   Original (4000×3000) → Store in S3 (archive)              │
│         │                                                    │
│         ├──► Large (1080×1080) → Feed display               │
│         ├──► Medium (640×640)  → Grid view                  │
│         ├──► Small (320×320)   → Thumbnails                 │
│         └──► Blur (20×20)      → Placeholder                │
│                                                              │
│   Formats:                                                   │
│   ├── WebP (modern browsers)                                │
│   ├── JPEG (fallback)                                       │
│   └── AVIF (cutting edge)                                   │
│                                                              │
│   CDN URLs:                                                  │
│   cdn.instagram.com/p/{post_id}/1080.webp                   │
│   cdn.instagram.com/p/{post_id}/640.jpg                     │
└─────────────────────────────────────────────────────────────┘
```

### Feed Generation

```
Hybrid Approach (similar to Twitter):

Regular Users (< 10K followers):
├── Fan-out on Write
├── Post → Push to all followers' feed table
└── Fast reads

Celebrities (> 10K followers):
├── Fan-out on Read
├── Merge celebrity posts at read time
└── Avoids write amplification
```

```python
def get_feed(user_id, cursor=None, limit=20):
    # Get precomputed feed from Cassandra
    feed_posts = cassandra.execute("""
        SELECT post_id, author_id, created_at
        FROM feed
        WHERE user_id = %s
        AND created_at < %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (user_id, cursor or datetime.max, limit))
    
    # Get celebrity followees
    celebrities = get_celebrity_followees(user_id)
    
    # Fetch recent celebrity posts
    if celebrities:
        celeb_posts = get_recent_posts(celebrities, limit=10)
        feed_posts = merge_by_time(feed_posts, celeb_posts)
    
    # Enrich with full post data
    post_ids = [p.post_id for p in feed_posts[:limit]]
    full_posts = get_posts_with_authors(post_ids)
    
    return full_posts
```

### CDN Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CDN Layer                                 │
│                                                              │
│   User Request: cdn.instagram.com/p/123/1080.webp           │
│         │                                                    │
│         ▼                                                    │
│   ┌─────────────────────────────────────────┐               │
│   │          Edge Location (POP)            │               │
│   │                                         │               │
│   │   Cache Hit? ───Yes──► Return image     │               │
│   │       │                                 │               │
│   │      No                                 │               │
│   │       │                                 │               │
│   │       ▼                                 │               │
│   │   Fetch from Origin (S3)                │               │
│   │   Cache for future requests             │               │
│   └─────────────────────────────────────────┘               │
│                                                              │
│   Benefits:                                                  │
│   ├── ~50ms image load (vs 200ms+ from origin)             │
│   ├── 95%+ cache hit rate                                   │
│   ├── Reduced S3 costs                                      │
│   └── Global availability                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## A - API Design

### Upload Photo

```
# Step 1: Get upload URL
POST /api/posts/upload-url
Authorization: Bearer {token}

Response:
{
    "upload_url": "https://s3.amazonaws.com/bucket/...",
    "post_id": "123456789"
}

# Step 2: Client uploads to S3
PUT {upload_url}
Content-Type: image/jpeg
Body: <binary image data>

# Step 3: Confirm post
POST /api/posts/{post_id}/publish
{
    "caption": "Beautiful sunset! #photography",
    "location": "San Francisco, CA"
}
```

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
                "user_id": "456",
                "username": "john",
                "profile_pic": "cdn.instagram.com/u/456/150.jpg"
            },
            "media_url": "cdn.instagram.com/p/123/1080.webp",
            "thumbnail_url": "cdn.instagram.com/p/123/320.webp",
            "caption": "Beautiful sunset!",
            "like_count": 1234,
            "comment_count": 56,
            "liked_by_viewer": false,
            "created_at": "2024-01-15T10:30:00Z"
        }
    ],
    "next_cursor": "post_id_789"
}
```

### Like Post

```
POST /api/posts/{post_id}/like
Authorization: Bearer {token}

Response: 200 OK
```

---

## D - Detailed Design (Continued)

### Stories System

```
┌─────────────────────────────────────────────────────────────┐
│                    Stories Architecture                      │
│                                                              │
│   Stories expire after 24 hours:                            │
│                                                              │
│   Upload:                                                    │
│   1. Upload media to S3                                      │
│   2. Save story metadata with TTL = 24 hours                │
│   3. Push to followers' story tray                          │
│                                                              │
│   Storage (Redis with TTL):                                 │
│   story:{story_id} → metadata (TTL: 24h)                    │
│   user:{user_id}:stories → [story_ids] (TTL: 24h)           │
│                                                              │
│   Story Tray (users with active stories):                   │
│   user:{user_id}:story_tray → sorted set of user_ids        │
│                                                              │
│   Media Cleanup:                                             │
│   ├── S3 lifecycle policy                                   │
│   └── Delete after 24 hours                                 │
└─────────────────────────────────────────────────────────────┘
```

### Like Counter Optimization

```
Problem: Popular posts get millions of likes

Solution: Sharded counters + async aggregation

Write Path:
├── Random shard increment
├── INCR post:123:likes:shard:{0-99}

Read Path (display):
├── Cached total with 1-minute TTL
├── Approximate is fine ("1.2M likes")

Background Job:
├── Periodically sum shards
├── Update cached total
├── Write to database
```

### Search and Discovery

```
┌─────────────────────────────────────────────────────────────┐
│                    Discovery System                          │
│                                                              │
│   Explore Page:                                              │
│   ├── Trending posts (engagement velocity)                  │
│   ├── Personalized recommendations                          │
│   └── Categorized by interest                               │
│                                                              │
│   Search:                                                    │
│   ├── Users (by username)                                   │
│   ├── Hashtags                                              │
│   └── Locations                                             │
│                                                              │
│   Implementation:                                            │
│   ├── Elasticsearch for search                              │
│   ├── ML ranking for explore                                │
│   └── Graph analysis for recommendations                    │
└─────────────────────────────────────────────────────────────┘
```

---

## E - Evaluation

### Bottlenecks

```
1. Hot posts (celebrity uploads)
   → Sharded counters
   → Cache aggressively

2. Feed generation for users following many
   → Hybrid fan-out
   → Limit feed to recent posts

3. Image processing at scale
   → Dedicated worker fleet
   → Queue with backpressure

4. Storage costs
   → Tiered storage
   → Intelligent compression
```

### Reliability

```
Media Upload:
├── Never lose uploaded photos
├── Multi-region S3 replication
├── Retry failed processing

Database:
├── MySQL: Primary + replicas
├── Cassandra: 3x replication
├── Regular backups

CDN:
├── Multiple edge locations
├── Fallback to origin
├── Health checks
```

### Scaling

```
Read Path:
├── CDN handles 95% of media
├── Redis caches hot data
├── Cassandra scales horizontally

Write Path:
├── Async processing via queues
├── Batch fan-out
├── Rate limiting uploads
```

---

## D - Distinctive Features

### Image Filters

```
Client-side vs Server-side:

Client-side:
├── Instant preview
├── No server load
└── Filter applied before upload

Server-side:
├── Consistent across devices
├── Advanced filters
└── Applied during processing

Instagram uses client-side for preview,
applies on server for consistency.
```

### Spam & Content Moderation

```
┌─────────────────────────────────────────────────────────────┐
│                 Content Moderation                           │
│                                                              │
│   Upload → ML Classifier → Flag if suspicious              │
│                                                              │
│   Checks:                                                    │
│   ├── NSFW detection                                        │
│   ├── Copyright (perceptual hash)                           │
│   ├── Spam patterns                                         │
│   └── Violent content                                       │
│                                                              │
│   Actions:                                                   │
│   ├── Auto-remove (high confidence)                         │
│   ├── Queue for human review                                │
│   └── Reduce distribution (low confidence)                  │
└─────────────────────────────────────────────────────────────┘
```

### Video Handling

```
Videos add complexity:

1. Larger files (up to 60 seconds, 4K)
2. Transcoding to multiple formats
3. Adaptive bitrate streaming (HLS/DASH)
4. Longer processing time

Pipeline:
Upload → Queue → Transcode → 
├── 1080p
├── 720p
├── 480p
└── 240p (mobile)

Streaming: HLS with .m3u8 playlist
Client picks quality based on bandwidth
```

---

## 📊 Summary

```
Key Components:
├── Upload Service: Direct to S3
├── Image Processing: Resize, compress, thumbnails
├── Feed Service: Hybrid fan-out
├── CDN: CloudFront for media delivery
├── Story Service: Redis with TTL

Key Decisions:
├── S3 for media storage (unlimited, durable)
├── Cassandra for feed (write-heavy)
├── Hybrid fan-out (push + pull)
├── CDN for 95% of media requests
├── Sharded counters for likes

Storage:
├── MySQL: Users, follows, posts metadata
├── Cassandra: Feed timeline
├── S3: All media files
├── Redis: Cache, sessions, stories
├── Elasticsearch: Search
```

---

## 📖 Next Steps

→ Continue to [Design WhatsApp](./04-whatsapp.md)
