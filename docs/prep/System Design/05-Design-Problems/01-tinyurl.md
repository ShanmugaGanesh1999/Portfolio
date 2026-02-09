# Design TinyURL

> URL shortening service - The classic entry-level design problem

---

## 📋 Problem Statement

Design a URL shortening service like TinyURL, bit.ly, or goo.gl that creates short aliases for long URLs and redirects users to the original URL.

---

## R - Requirements

### Functional Requirements

```
1. Given a long URL, generate a short URL
2. Given a short URL, redirect to the original long URL
3. Users can optionally create custom short URLs
4. URLs should expire after a configurable time (optional)
5. Analytics: Track click counts (optional)
```

### Non-Functional Requirements

```
1. High availability (redirects must work)
2. Low latency for redirects (<100ms)
3. Short URLs should not be predictable
4. System should be highly scalable
```

### Capacity Estimation

```
Assumptions:
├── 100M new URLs per month
├── Read:Write ratio = 100:1
├── URLs kept for 5 years

Traffic:
├── Write: 100M / (30 × 24 × 3600) ≈ 40 URLs/second
├── Read: 40 × 100 = 4000 redirects/second
└── Peak: 4000 × 10 = 40,000/second

Storage:
├── Each URL: ~500 bytes (original + short + metadata)
├── 5 years: 100M × 12 × 5 = 6 billion URLs
└── Total: 6B × 500 bytes = 3 TB

Bandwidth:
├── Incoming: 40 × 500 = 20 KB/s
└── Outgoing: 4000 × 500 = 2 MB/s
```

---

## E - Estimation

### Short URL Length

```
Characters: a-z, A-Z, 0-9 = 62 characters

Length 6: 62^6 = 56.8 billion URLs ✓
Length 7: 62^7 = 3.5 trillion URLs

6 characters is sufficient for our scale
```

---

## S - Storage Schema

### Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                        URL Table                             │
├─────────────────────────────────────────────────────────────┤
│ short_code  │ VARCHAR(7)  │ PRIMARY KEY                      │
│ original_url│ VARCHAR(2048)│ NOT NULL                        │
│ user_id     │ BIGINT      │ NULLABLE (for analytics)         │
│ created_at  │ TIMESTAMP   │ DEFAULT NOW()                    │
│ expires_at  │ TIMESTAMP   │ NULLABLE                         │
│ click_count │ BIGINT      │ DEFAULT 0                        │
└─────────────────────────────────────────────────────────────┘

Index: original_url (for deduplication)
```

### Database Choice

```
Options:
├── SQL (PostgreSQL, MySQL)
│   ├── ACID compliance
│   ├── Indexes for lookups
│   └── Easier for analytics
│
└── NoSQL (DynamoDB, Cassandra)
    ├── Higher write throughput
    ├── Better horizontal scaling
    └── Key-value pattern fits well

Recommendation: NoSQL (DynamoDB)
├── Simple key-value pattern
├── High availability
├── Low latency reads
└── Easy scaling
```

---

## H - High-Level Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   User                                                       │
│     │                                                        │
│     ▼                                                        │
│   ┌─────────────────────────────────────────┐               │
│   │            Load Balancer                 │               │
│   └─────────────────┬───────────────────────┘               │
│                     │                                        │
│           ┌─────────┴─────────┐                             │
│           ▼                   ▼                              │
│   ┌───────────────┐   ┌───────────────┐                     │
│   │ App Server 1  │   │ App Server 2  │                     │
│   └───────┬───────┘   └───────┬───────┘                     │
│           │                   │                              │
│           └─────────┬─────────┘                             │
│                     │                                        │
│           ┌─────────┴─────────┐                             │
│           ▼                   ▼                              │
│   ┌───────────────┐   ┌───────────────┐                     │
│   │    Redis      │   │   Database    │                     │
│   │   (Cache)     │   │  (DynamoDB)   │                     │
│   └───────────────┘   └───────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Create Short URL:
1. Client sends long URL
2. Generate unique short code
3. Store mapping in database
4. Return short URL

Redirect:
1. Client requests short URL
2. Check cache for mapping
3. If miss, query database
4. Return 301/302 redirect
```

---

## A - API Design

### Create Short URL

```
POST /api/shorten
{
    "url": "https://www.example.com/very/long/path/to/resource",
    "custom_alias": "my-link",  // optional
    "expires_at": "2025-01-01"  // optional
}

Response: 201 Created
{
    "short_url": "https://tiny.url/abc123",
    "original_url": "https://www.example.com/...",
    "expires_at": "2025-01-01"
}
```

### Redirect

```
GET /{short_code}

Response: 301 Moved Permanently
Location: https://www.example.com/very/long/path/to/resource
```

### Get Analytics

```
GET /api/stats/{short_code}

Response: 200 OK
{
    "short_url": "https://tiny.url/abc123",
    "original_url": "https://www.example.com/...",
    "click_count": 1234,
    "created_at": "2024-01-01T00:00:00Z"
}
```

---

## D - Detailed Design

### Short Code Generation

#### Option 1: Base62 Encoding

```python
import hashlib

ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

def encode_base62(num):
    if num == 0:
        return ALPHABET[0]
    
    result = []
    while num:
        result.append(ALPHABET[num % 62])
        num //= 62
    return ''.join(reversed(result))

def generate_short_code(url, counter):
    # Use auto-increment counter
    return encode_base62(counter)
```

#### Option 2: MD5 Hash + Collision Handling

```python
import hashlib

def generate_short_code(url):
    # Hash the URL
    hash_digest = hashlib.md5(url.encode()).hexdigest()
    
    # Take first 6 characters (in base62)
    short_code = encode_base62(int(hash_digest[:8], 16))[:6]
    
    # Check for collision, regenerate if needed
    while exists_in_db(short_code):
        hash_digest = hashlib.md5((url + random_salt()).encode()).hexdigest()
        short_code = encode_base62(int(hash_digest[:8], 16))[:6]
    
    return short_code
```

#### Option 3: Pre-generated Keys (Key Generation Service)

```
┌───────────────────────────────────────────────────────────┐
│              Key Generation Service                        │
│                                                            │
│   Pre-generate millions of unique keys                    │
│   Store in database with "used" flag                      │
│   App servers fetch batch of keys                         │
│   Mark as used when consumed                              │
│                                                            │
│   ┌─────────────────────────────────────────────────────┐ │
│   │ key     │ used   │ reserved_by  │ reserved_at       │ │
│   │ abc123  │ false  │ null         │ null              │ │
│   │ xyz789  │ true   │ server-1     │ 2024-01-01        │ │
│   └─────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘

Advantages:
├── No collision handling
├── No counter synchronization
└── Can pre-validate uniqueness
```

### Caching Strategy

```
┌──────────────────────────────────────────────────────────┐
│                   Caching Layer                           │
│                                                           │
│   Read Path:                                              │
│   1. Check Redis cache                                    │
│   2. If hit → return immediately                          │
│   3. If miss → query database                             │
│   4. Store in cache with TTL                              │
│                                                           │
│   Cache Eviction:                                         │
│   ├── LRU (Least Recently Used)                          │
│   ├── TTL: 24 hours for popular URLs                     │
│   └── Capacity: ~20% of database                         │
│                                                           │
│   Hit Rate Target: 90%+                                   │
└──────────────────────────────────────────────────────────┘
```

```python
def get_original_url(short_code):
    # Check cache first
    cached = redis.get(f"url:{short_code}")
    if cached:
        return cached
    
    # Cache miss - query database
    result = db.query("SELECT original_url FROM urls WHERE short_code = %s", short_code)
    
    if result:
        # Cache for 24 hours
        redis.setex(f"url:{short_code}", 86400, result.original_url)
        return result.original_url
    
    return None
```

### 301 vs 302 Redirect

```
301 (Permanent Redirect):
├── Browser caches redirect
├── Reduces server load
├── Loses analytics (subsequent requests don't hit server)
└── Better for SEO

302 (Temporary Redirect):
├── Browser doesn't cache
├── Every request hits server
├── Full analytics
└── Higher server load

Recommendation: 302 for analytics, 301 for simple redirects
```

---

## E - Evaluation

### Bottlenecks

```
1. Database writes during peak
   Solution: Use NoSQL with high write throughput

2. Cache misses for unpopular URLs
   Solution: Larger cache, optimize database reads

3. Key generation collisions
   Solution: Pre-generated key service

4. Single point of failure
   Solution: Replicate everything
```

### Scaling

```
Horizontal Scaling:
├── Stateless app servers behind load balancer
├── Redis cluster for caching
├── Database sharding by short_code

Read Replicas:
├── 99% reads → multiple read replicas
├── Master for writes only

CDN:
├── Cache redirects at edge (if 301)
├── Reduce latency globally
```

### Availability

```
┌─────────────────────────────────────────────────────────────┐
│                Multi-Region Setup                            │
│                                                              │
│   Region A (Primary)              Region B (Secondary)       │
│   ┌─────────────────┐            ┌─────────────────┐        │
│   │ App + Cache + DB│  ──sync──► │ App + Cache + DB│        │
│   └─────────────────┘            └─────────────────┘        │
│                                                              │
│   Global Load Balancer routes to nearest healthy region     │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Distinctive Features

### URL Deduplication

```
Don't create multiple short URLs for same long URL:

1. Check if long URL exists
2. If exists, return existing short URL
3. If not, create new mapping

Implementation:
├── Secondary index on original_url
├── Or hash of URL as partition key
└── Trade-off: Storage vs uniqueness
```

### Custom Aliases

```
User-provided short codes:
├── Validate format (alphanumeric, length)
├── Check availability
├── Reserve atomically
└── Premium feature (rate limit)
```

### Analytics

```
Track per-click:
├── Timestamp
├── User agent (device type)
├── Referer
├── IP → Location

Store in:
├── Real-time: Redis (increment counter)
├── Batch: S3/Kinesis → Analytics warehouse
```

### Link Expiration

```
Options:
1. Active expiration:
   ├── Background job deletes expired
   └── Check expiry on read

2. Lazy expiration:
   ├── Check expiry on read only
   └── Return 404 if expired
   └── Clean up periodically

3. TTL in database:
   ├── DynamoDB TTL auto-deletes
   └── No extra logic needed
```

---

## 📊 Summary

```
Components:
├── Load Balancer: Distribute traffic
├── App Servers: Stateless, horizontally scaled
├── Cache (Redis): 90%+ hit rate for redirects
├── Database (DynamoDB): URL mappings
├── Key Service: Pre-generated short codes

Key Decisions:
├── NoSQL for high write throughput
├── Pre-generated keys to avoid collisions
├── Cache-heavy for read performance
├── 302 redirects for analytics

Scalability:
├── 40,000+ redirects/second with caching
├── Multi-region for global availability
├── Shard by short_code for database
```
