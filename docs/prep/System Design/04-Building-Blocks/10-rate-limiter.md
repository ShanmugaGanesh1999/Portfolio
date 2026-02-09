# Rate Limiter

> Controlling the rate of requests to protect systems

---

## 📖 What is a Rate Limiter?

A **Rate Limiter** controls how many requests a client can make in a given time window. It protects services from:
- DoS attacks
- Resource exhaustion
- Noisy neighbors
- Cascading failures

```
Without Rate Limiting:
Client ────────────────────────► Server (overwhelmed)
       [10,000 requests/sec]

With Rate Limiting:
Client ─────► Rate Limiter ─────► Server (protected)
              [allows 100/sec]
              [rejects rest]
```

---

## 🎯 Rate Limiting Dimensions

```
Who to limit:
├── User ID (authenticated users)
├── IP Address (anonymous users)
├── API Key (developer apps)
├── Region/Country
└── Combination of above

What to limit:
├── Requests per second/minute/hour
├── Data transfer (bytes)
├── Concurrent connections
├── Specific expensive operations
└── Cost-based (API credits)
```

---

## 🔧 Rate Limiting Algorithms

### 1. Token Bucket

```
Most flexible and widely used

Bucket:
├── Holds tokens (capacity = max burst)
├── Tokens added at fixed rate
├── Request consumes 1 token
├── If no tokens: reject

        [●●●●○○○○○○] Bucket (10 capacity)
             │
             ▼
        Add 5 tokens/sec
        
Request arrives:
├── Token available → Allow, remove token
└── No token → Reject (429 Too Many Requests)

Allows bursts up to bucket capacity
```

```python
import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity      # Max tokens
        self.tokens = capacity         # Current tokens
        self.refill_rate = refill_rate # Tokens/sec
        self.last_refill = time.time()
    
    def allow_request(self):
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
    
    def _refill(self):
        now = time.time()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now
```

### 2. Leaky Bucket

```
Smooths out bursts, constant output rate

Bucket = Queue:
├── Requests enter bucket (queue)
├── Processed at fixed rate
├── If bucket full: reject

Requests:  ▼ ▼ ▼ ▼ ▼ (bursty input)
           │ │ │ │ │
         ┌─┴─┴─┴─┴─┴─┐
         │  [queue]  │ ← Bucket
         └─────┬─────┘
               │
               ▼ ▼ ▼ (constant output)
            Process at fixed rate

Difference from Token Bucket:
├── Token: allows bursts
└── Leaky: no bursts, constant rate
```

### 3. Fixed Window Counter

```
Simple but has edge problem

Window: 1 minute
Limit: 100 requests

Time: 00:00 - 00:59 → Count requests
Time: 01:00 - 01:59 → Reset, new count

Problem - boundary burst:
├── 00:59 → 100 requests (allowed)
├── 01:00 → 100 requests (allowed)
└── 200 requests in 2 seconds! ❌

[────────Window 1────────][────────Window 2────────]
                   100   │100
                    ^────┴────^
                    Edge burst problem
```

```python
import time

class FixedWindowCounter:
    def __init__(self, limit, window_seconds):
        self.limit = limit
        self.window = window_seconds
        self.count = 0
        self.window_start = time.time()
    
    def allow_request(self):
        now = time.time()
        # Check if new window
        if now - self.window_start >= self.window:
            self.count = 0
            self.window_start = now
        
        if self.count < self.limit:
            self.count += 1
            return True
        return False
```

### 4. Sliding Window Log

```
Accurate but memory intensive

Keep log of all request timestamps:
[1:00:01, 1:00:02, 1:00:05, 1:00:30, ...]

For each request:
├── Remove timestamps older than window
├── Count remaining timestamps
├── If count < limit → Allow, add timestamp
└── Else → Reject

Pros: Accurate, no edge problem
Cons: Stores all timestamps (memory)
```

### 5. Sliding Window Counter

```
Best balance: accurate + low memory

Combine fixed window with sliding calculation:

Window 1 (prev): 70 requests
Window 2 (curr): 30 requests so far

Current request at 40% into Window 2:
Weighted count = 30 + (70 × 60%) = 30 + 42 = 72

If limit = 100 → 72 < 100 → Allow

[────────Window 1────────][────────Window 2────────]
        70 requests       │    30 requests
                          │ ◄──40% into window
                          
Estimated count in sliding window:
= current + (previous × overlap%)
```

### Algorithm Comparison

| Algorithm | Memory | Accuracy | Burst Handling |
|-----------|--------|----------|----------------|
| Token Bucket | Low | Good | Allows controlled bursts |
| Leaky Bucket | Low | Good | Smooths all bursts |
| Fixed Window | Very Low | Poor at edges | Allows boundary bursts |
| Sliding Log | High | Exact | No bursts |
| Sliding Counter | Low | Good approximation | Some burst control |

---

## 🔧 Where to Implement

```
1. Client-side:
   ├── Prevents wasted requests
   └── Can be bypassed (not secure)

2. API Gateway:
   ├── Centralized
   ├── Before hitting services
   └── Most common location

3. Load Balancer:
   ├── Network level
   └── IP-based limiting

4. Application:
   ├── Fine-grained control
   ├── Can access user context
   └── Each server has own view

5. Middleware:
   ├── Before request processing
   └── Easy to add/remove
```

```
Typical architecture:

Client ──► CDN ──► API Gateway ──► Service
            │           │
      IP limit    User/API key limit
```

---

## 📊 Distributed Rate Limiting

### Challenge

```
Multiple servers, shared limit:

User: 100 req/min limit

Server A: counts 50
Server B: counts 50
                      = User made 100 requests ✓

But if not synchronized:
Server A: allows 100
Server B: allows 100
                      = User made 200 requests ❌
```

### Solution: Centralized Counter

```
                ┌─────────────┐
           ┌────│    Redis    │────┐
           │    └─────────────┘    │
           ▼                       ▼
      ┌─────────┐             ┌─────────┐
      │Server A │             │Server B │
      └─────────┘             └─────────┘

Each request:
1. INCR user:{id}:count
2. Check if over limit
3. Redis handles atomicity
```

```python
# Distributed rate limiter with Redis
import redis
import time

class DistributedRateLimiter:
    def __init__(self, redis_client, limit, window_seconds):
        self.redis = redis_client
        self.limit = limit
        self.window = window_seconds
    
    def allow_request(self, user_id):
        key = f"ratelimit:{user_id}"
        
        # Atomic increment and expire
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, self.window)
        results = pipe.execute()
        
        count = results[0]
        return count <= self.limit
```

### Sliding Window with Redis

```lua
-- Lua script for atomic sliding window
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- Remove old entries
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

-- Count current entries
local count = redis.call('ZCARD', key)

if count < limit then
    -- Add new entry
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, window)
    return 1  -- Allowed
else
    return 0  -- Rejected
end
```

---

## 📈 Rate Limiting Response

### HTTP Headers

```
Standard headers to include:

X-RateLimit-Limit: 100        # Max requests
X-RateLimit-Remaining: 23     # Requests left
X-RateLimit-Reset: 1672531200 # When limit resets (epoch)
Retry-After: 60               # Seconds to wait (if limited)

Response when limited:
HTTP/1.1 429 Too Many Requests
Retry-After: 60
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

### Graceful Degradation

```
Instead of hard reject:

1. Throttle: Slow down response
2. Queue: Add to queue, process later
3. Deprioritize: Serve after premium users
4. Degrade: Return cached/simplified response
```

---

## 💡 Rate Limiting Strategies

### 1. User-based

```
Each user has own limit:
├── Free tier: 100 req/hour
├── Pro tier: 1000 req/hour
├── Enterprise: 10,000 req/hour

Key: user:{user_id}
```

### 2. API Key based

```
Each application has limit:
├── App A: 5000 req/day
├── App B: 10000 req/day

Key: api:{api_key}
```

### 3. Endpoint-based

```
Different limits per endpoint:
├── GET /users: 1000/min (read, cheap)
├── POST /upload: 10/min (write, expensive)
├── POST /analyze: 5/min (compute-heavy)
```

### 4. Cost-based

```
Different requests cost different amounts:

Budget: 1000 credits/minute

Request costs:
├── GET: 1 credit
├── POST: 5 credits
├── Complex query: 50 credits

User uses 20 GETs (20) + 10 POSTs (50) = 70 credits
970 credits remaining
```

---

## 💡 In System Design Interviews

### When to Use

```
1. "How do you prevent abuse?"
2. "What if a user sends too many requests?"
3. "How do you protect against DoS?"
4. "How do you ensure fair usage?"
```

### Design Discussion Points

```
1. Where to rate limit?
   → API Gateway for global, app for granular

2. Which algorithm?
   → Token bucket (most versatile)
   → Sliding window counter (good accuracy)

3. How to handle distributed?
   → Redis for centralized counting

4. What to return?
   → 429 with Retry-After header

5. Rate limit by what?
   → User ID, API key, IP (fallback)

6. Different limits?
   → Per endpoint, per tier
```

---

## ⚠️ Edge Cases

### Race Conditions

```
Problem: Check-then-increment not atomic

Thread A: count = 99, 99 < 100 → Allow
Thread B: count = 99, 99 < 100 → Allow
Both increment → count = 101 ❌

Solution: Use atomic operations
├── Redis INCR
├── Compare-and-swap
└── Lua scripts
```

### Clock Synchronization

```
Problem: Different servers, different clocks

Solution:
├── Use single time source (Redis time)
├── NTP synchronization
└── Small tolerance window
```

### Hot Keys

```
Problem: Celebrity user overwhelms Redis

Solutions:
├── Local cache with short TTL
├── Probabilistic check
└── Dedicated rate limit for hot users
```

---

## ✅ Key Takeaways

1. **Token bucket** is most versatile (allows bursts)
2. **Sliding window counter** is good balance
3. **Use Redis** for distributed rate limiting
4. **Include headers** to help clients
5. **Rate limit at API Gateway** for centralized control
6. **Different limits** for different endpoints/tiers
7. **Use atomic operations** to prevent race conditions
