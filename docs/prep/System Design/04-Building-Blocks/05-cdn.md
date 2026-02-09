# Content Delivery Network (CDN)

> Delivering content faster by bringing it closer to users

---

## 📖 What is a CDN?

A **Content Delivery Network (CDN)** is a geographically distributed network of servers that delivers content to users from the nearest location.

```
Without CDN:
User (Tokyo) ──────────────────────► Origin (New York)
              10,000+ miles, slow

With CDN:
User (Tokyo) ──► CDN Edge (Tokyo) ──► Origin (New York)
              Fast!            Only if cache miss
```

---

## 🎯 Why Use a CDN?

1. **Lower latency** - Content served from nearby
2. **Reduced origin load** - Edge servers cache content
3. **Higher availability** - Multiple edge locations
4. **Better user experience** - Faster page loads
5. **DDoS protection** - Distributed attack absorption

---

## 📊 CDN Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN Network                           │
│                                                              │
│    ┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐ │
│    │Edge EU │     │Edge US │     │Edge Asia│    │Edge SA │ │
│    └────┬───┘     └────┬───┘     └────┬───┘     └────┬───┘ │
│         │              │              │              │      │
│         └──────────────┴──────────────┴──────────────┘      │
│                              │                               │
│                              ▼                               │
│                    ┌──────────────────┐                     │
│                    │   Origin Server  │                     │
│                    └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### Edge Locations

```
User request flow:

1. User requests image.jpg
2. DNS resolves to nearest edge
3. Edge checks cache:
   ├── HIT: Return cached content
   └── MISS: Fetch from origin, cache, return

User ──► DNS ──► Edge Server ──► (if miss) ──► Origin
                    │
                 ┌──┴──┐
                 │Cache│
                 └─────┘
```

---

## 🔧 CDN Operations

### Push CDN

```
Content pushed to CDN before requests

Origin ──push──► CDN Edge 1
       ──push──► CDN Edge 2
       ──push──► CDN Edge 3

Pros: Content always available, no cache miss
Cons: Must manage what to push, uses storage
Best for: Static content, predictable access
```

### Pull CDN

```
Content pulled on first request

User ──request──► CDN Edge ──cache miss──► Origin
                     │
                     └── cache content
                     
User2 ──request──► CDN Edge ──cache hit!

Pros: Only caches what's needed
Cons: First request slow (origin fetch)
Best for: Large content libraries, unpredictable access
```

---

## 📊 Cache Behavior

### Cache Headers

```http
# Cache for 1 day, revalidate after
Cache-Control: max-age=86400, must-revalidate

# Cache forever (use for versioned assets)
Cache-Control: max-age=31536000, immutable

# Never cache
Cache-Control: no-cache, no-store

# Check with origin (ETag/Last-Modified)
Cache-Control: no-cache
ETag: "abc123"
```

### TTL (Time To Live)

```
Short TTL (minutes):
├── News articles
├── API responses
├── Dynamic content

Long TTL (days/forever):
├── Images with version in URL
├── JavaScript bundles
├── CSS files
```

### Cache Invalidation

```
Methods:
1. Time-based: Wait for TTL to expire
2. Purge: Explicitly delete from cache
3. Versioning: Change URL (image-v2.jpg)
4. Soft purge: Mark stale, serve while fetching new

Best practice: Use versioned URLs
/assets/app-abc123.js  ← Hash in filename
```

---

## 🌍 CDN Routing

### Anycast

```
Same IP advertised from multiple locations
Internet routes to nearest one

User (Tokyo) ─┐
              ├──► 1.2.3.4 ──► Nearest Edge
User (Paris) ─┘

Fast, automatic failover
```

### GeoDNS

```
Different IPs based on user location

User (Tokyo)  ──► DNS ──► asia.cdn.example.com
User (Paris)  ──► DNS ──► eu.cdn.example.com
User (NYC)    ──► DNS ──► us-east.cdn.example.com
```

---

## 📈 CDN Features

### Edge Computing

```
Run code at edge, not just cache

Examples:
├── A/B testing
├── Authentication
├── Image optimization
├── Personalization
├── API gateway functions

Providers: Cloudflare Workers, Lambda@Edge
```

### Image Optimization

```
Original: image.jpg (2MB)

CDN transforms on the fly:
├── image.jpg?w=200     → Resize to 200px
├── image.jpg?format=webp → Convert to WebP
├── image.jpg?quality=80  → Compress

Saves bandwidth, improves performance
```

### DDoS Protection

```
Attack traffic distributed across edge network

               DDoS Attack
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Edge 1    Edge 2    Edge 3
          │         │         │
          └─────────┴─────────┘
                    │
           (filtered traffic)
                    │
                    ▼
               Origin Server
```

---

## 🛠️ CDN Providers

| Provider | Strengths |
|----------|-----------|
| **CloudFlare** | Free tier, DDoS protection, Workers |
| **AWS CloudFront** | AWS integration, Lambda@Edge |
| **Akamai** | Enterprise, largest network |
| **Fastly** | Real-time purging, edge computing |
| **Google Cloud CDN** | GCP integration |
| **Azure CDN** | Azure integration |

---

## 📊 What to Put on CDN

### Good Candidates

```
✓ Static assets (JS, CSS, fonts)
✓ Images and videos
✓ Downloads (PDFs, installers)
✓ Public API responses
✓ HTML pages (with short TTL)
```

### Poor Candidates

```
✗ User-specific content (unless with authentication)
✗ Real-time data
✗ Highly dynamic content
✗ Content requiring server-side processing
```

---

## 💡 CDN in System Design

### Video Streaming Design

```
User requests video:
1. DNS routes to nearest CDN edge
2. Edge checks cache for video segments
3. Cache hit: Stream from edge
4. Cache miss: Fetch from origin, cache, stream

Benefits:
├── Low latency start time
├── Reduced origin bandwidth
├── Handles traffic spikes
└── Global reach
```

### Static Website Design

```
┌─────────────────────────────────────────┐
│              CDN Edge                    │
│   ┌─────────────────────────────────┐   │
│   │        Cached Content            │   │
│   │  ├── index.html                  │   │
│   │  ├── app.js                      │   │
│   │  ├── styles.css                  │   │
│   │  └── images/*                    │   │
│   └─────────────────────────────────┘   │
└──────────────────┬──────────────────────┘
                   │
           (origin for cache miss)
                   │
           ┌───────▼───────┐
           │  S3 / Storage │
           └───────────────┘
```

### API Caching Design

```python
# Cache public API responses at CDN

# Response headers from origin:
Cache-Control: public, max-age=60

# CDN caches for 60 seconds
# Same request from different users → served from cache

# For user-specific: use Vary header
Vary: Authorization
```

---

## ⚠️ CDN Challenges

### Cache Invalidation

```
"There are only two hard things in CS:
cache invalidation and naming things"

Problem: Content updated, but CDN still serves old

Solutions:
├── Versioned URLs (best): app-v1.2.3.js
├── Short TTL (costly): More origin requests
├── Purge API (slow): Can take time to propagate
└── Soft purge: Serve stale while fetching
```

### Cache Stampede

```
Problem:
Cache expires → Many users request simultaneously
→ All requests hit origin → Origin overloaded

Solutions:
├── Stale-while-revalidate
├── Probabilistic early expiration
├── Locking (one request fetches)
└── Pre-warming cache
```

### Origin Protection

```
Problem: CDN origin requests overwhelm backend

Solutions:
├── Origin shield (intermediate cache layer)
├── Request collapsing (dedupe simultaneous requests)
├── Longer TTLs
└── Async origin fetch
```

---

## 📊 CDN Metrics

| Metric | Good Target |
|--------|-------------|
| Cache Hit Ratio | > 95% |
| Time to First Byte | < 100ms |
| Origin Shield Hit Ratio | > 80% |
| Error Rate | < 0.1% |
| Bandwidth Savings | > 90% |

---

## ✅ Key Takeaways

1. **CDN = caching at the edge** - Content closer to users
2. **Reduces latency** - Typically 50-80% faster
3. **Reduces origin load** - Fewer requests to your servers
4. **Push vs Pull** - Push for known content, pull for large catalogs
5. **Cache invalidation is hard** - Use versioned URLs
6. **Essential for global services** - Required at scale
7. **More than caching** - Edge compute, DDoS protection

---

## 📖 Next Steps

→ Continue to [Sequencer](./06-sequencer.md)
