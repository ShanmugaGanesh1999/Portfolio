# Design Yelp

> Local business search and review platform

---

## 📋 Problem Statement

Design a location-based service like Yelp that allows users to search for businesses, view ratings/reviews, and find places near them.

---

## R - Requirements

### Functional Requirements

```
1. Search businesses by location, category, name
2. View business details (hours, phone, photos)
3. Read and write reviews
4. Rate businesses (1-5 stars)
5. Filter/sort results (rating, distance, price)
6. "Near me" discovery
```

### Non-Functional Requirements

```
1. Low latency search (<200ms)
2. Handle location queries efficiently
3. Read-heavy (100:1 read to write ratio)
4. Eventually consistent (reviews can take time)
```

---

## E - Estimation

```
Users: 100M monthly active users
Businesses: 50M businesses
Reviews: 500M reviews total
Photos: 200M photos

Read traffic:
├── 10M searches/day
├── 115 searches/second average
├── 500 searches/second peak

Write traffic:
├── 100K new reviews/day
├── 50K new photos/day

Storage:
├── Business data: 50M × 5KB = 250GB
├── Reviews: 500M × 2KB = 1TB
├── Photos: 200M × 500KB = 100TB
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌─────────┐                         ┌─────────┐           │
│   │  Users  │                         │   CDN   │           │
│   └────┬────┘                         │(Photos) │           │
│        │                              └────┬────┘           │
│        ▼                                   │                │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  API Gateway                         │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│   ┌──────────┬───────────┼───────────┬───────────┐          │
│   ▼          ▼           ▼           ▼           ▼          │
│ ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────┐  ┌──────────┐   │
│ │Search│  │ Biz  │  │  Review  │  │ User │  │  Photo   │   │
│ │ Svc  │  │ Svc  │  │   Svc    │  │ Svc  │  │   Svc    │   │
│ └──┬───┘  └──┬───┘  └────┬─────┘  └──┬───┘  └────┬─────┘   │
│    │         │           │           │           │          │
│    ▼         ▼           ▼           ▼           ▼          │
│ ┌──────┐  ┌──────────────────────────────────┐  ┌───────┐  │
│ │Elastic│ │              PostgreSQL          │  │ Blob  │  │
│ │Search │ │   (Businesses, Reviews, Users)   │  │ Store │  │
│ └───────┘ └──────────────────────────────────┘  └───────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Geospatial Indexing

```
┌─────────────────────────────────────────────────────────────┐
│              Location-Based Search                           │
│                                                              │
│   Option 1: Geohash                                          │
│   ├── Encode lat/lng to string: "9q8yy"                    │
│   ├── Prefix matching: "9q8y*" = nearby                    │
│   ├── Easy to index and query                              │
│   └── Used in Redis, DynamoDB                              │
│                                                              │
│   Option 2: QuadTree                                         │
│   ├── Recursive subdivision of space                       │
│   ├── Leaf nodes contain businesses                        │
│   ├── Good for density-varying data                        │
│   └── In-memory, fast lookups                              │
│                                                              │
│   Option 3: PostGIS (PostgreSQL)                            │
│   ├── ST_DWithin(location, point, radius)                  │
│   ├── GiST index for fast queries                          │
│   └── Battle-tested, feature-rich                          │
│                                                              │
│   Choice: Elasticsearch with geo_point                       │
│   ├── Native geo_distance queries                          │
│   ├── Combined with text search                            │
│   ├── geo_bounding_box for viewport                        │
│   └── Scalable and fast                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Search Service

```
┌─────────────────────────────────────────────────────────────┐
│              Search Architecture                             │
│                                                              │
│   Elasticsearch Index:                                       │
│   {                                                          │
│     "business_id": "biz123",                                │
│     "name": "Joe's Pizza",                                  │
│     "categories": ["pizza", "italian"],                     │
│     "location": {"lat": 40.74, "lon": -73.99},              │
│     "geohash": "dr5ru7",                                    │
│     "rating": 4.5,                                          │
│     "review_count": 234,                                    │
│     "price_level": 2,                                       │
│     "is_open": true                                         │
│   }                                                          │
│                                                              │
│   Query: "pizza near Times Square"                          │
│   ├── Text match on name/categories                        │
│   ├── Geo filter within 5km                                │
│   ├── Boost by rating and review_count                     │
│   └── Filter by is_open if requested                       │
│                                                              │
│   Sort options:                                              │
│   ├── Best match (relevance + rating)                      │
│   ├── Distance (closest first)                             │
│   ├── Rating (highest first)                               │
│   └── Review count (most reviewed)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Businesses table
CREATE TABLE businesses (
    id              UUID PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    address         VARCHAR(500),
    city            VARCHAR(100),
    state           VARCHAR(50),
    zip_code        VARCHAR(20),
    country         VARCHAR(100),
    phone           VARCHAR(20),
    website         VARCHAR(500),
    location        GEOGRAPHY(POINT, 4326),
    price_level     INT,
    
    -- Denormalized for performance
    avg_rating      DECIMAL(2,1) DEFAULT 0,
    review_count    INT DEFAULT 0,
    
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id              UUID PRIMARY KEY,
    business_id     UUID REFERENCES businesses(id),
    user_id         UUID REFERENCES users(id),
    rating          INT CHECK (rating BETWEEN 1 AND 5),
    text            TEXT,
    helpful_votes   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Sync to Elasticsearch on write
```

### Rating Aggregation

```
┌─────────────────────────────────────────────────────────────┐
│              Rating Calculation                              │
│                                                              │
│   On new review:                                             │
│   1. Insert review to PostgreSQL                            │
│   2. Update business aggregate:                             │
│      UPDATE businesses                                       │
│      SET avg_rating = (                                      │
│        SELECT AVG(rating) FROM reviews                      │
│        WHERE business_id = $1                               │
│      ),                                                      │
│      review_count = review_count + 1                        │
│      WHERE id = $1;                                         │
│   3. Push update to Elasticsearch                           │
│                                                              │
│   Optimization:                                              │
│   ├── Store sum and count, calculate on read               │
│   ├── Async update with message queue                      │
│   └── Eventually consistent (few seconds delay)            │
│                                                              │
│   Weighted rating (like IMDB):                              │
│   WR = (v/(v+m)) × R + (m/(v+m)) × C                        │
│   ├── v = number of votes                                  │
│   ├── m = minimum votes required (e.g., 10)                │
│   ├── R = average rating for this business                 │
│   └── C = average rating across all businesses             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Photo Service

```
┌─────────────────────────────────────────────────────────────┐
│              Photo Upload Flow                               │
│                                                              │
│   1. Client requests upload URL                             │
│   2. Server returns presigned S3 URL                        │
│   3. Client uploads directly to S3                          │
│   4. S3 triggers Lambda for processing:                     │
│      ├── Resize to multiple sizes (thumb, medium, large)   │
│      ├── Extract EXIF data                                 │
│      ├── Run content moderation                            │
│      └── Update photo metadata in DB                       │
│   5. Photos served via CDN                                  │
│                                                              │
│   Photo metadata:                                            │
│   {                                                          │
│     "photo_id": "p123",                                     │
│     "business_id": "biz456",                                │
│     "user_id": "user789",                                   │
│     "caption": "Best pizza ever!",                          │
│     "urls": {                                               │
│       "thumb": "cdn.../p123_thumb.jpg",                     │
│       "medium": "cdn.../p123_medium.jpg",                   │
│       "large": "cdn.../p123_large.jpg"                      │
│     }                                                        │
│   }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 API Design

```
# Search businesses
GET /v1/businesses/search
    ?query=pizza
    &lat=40.74&lng=-73.99
    &radius=5000  # meters
    &sort=rating
    &open_now=true
    
# Get business details
GET /v1/businesses/{business_id}

# Get reviews for business
GET /v1/businesses/{business_id}/reviews
    ?sort=helpful

# Create review
POST /v1/businesses/{business_id}/reviews
{
    "rating": 4,
    "text": "Great food!"
}

# Upload photo
POST /v1/businesses/{business_id}/photos/upload
→ Returns presigned URL
```

---

## 📊 Summary

```
Key Components:
├── Elasticsearch: Geo + text search combined
├── PostgreSQL: Primary data store with PostGIS
├── CDN: Photo delivery
├── S3: Photo storage

Key Decisions:
├── Elasticsearch for combined geo + text search
├── Denormalized ratings in business record
├── Async photo processing
├── Weighted rating formula

Scale:
├── 50M businesses indexed
├── Sub-200ms search latency
├── CDN for global photo delivery
├── Read replicas for review reads
```
