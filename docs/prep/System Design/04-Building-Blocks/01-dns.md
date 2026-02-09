# Domain Name System (DNS)

> The internet's phone book - translating names to addresses

---

## 📖 What is DNS?

**DNS (Domain Name System)** translates human-readable domain names (www.google.com) into IP addresses (142.250.80.46) that computers use to communicate.

```
User types: www.google.com
            │
            ▼
        DNS lookup
            │
            ▼
     142.250.80.46
            │
            ▼
   Connect to Google
```

---

## 🎯 Why DNS Matters in System Design

1. **Entry point** - First step in every web request
2. **Load balancing** - Route users to nearest server
3. **Failover** - Switch traffic during outages
4. **Global distribution** - Direct users by geography

---

## 🔧 How DNS Works

### DNS Hierarchy

```
                    ┌─────────────────┐
                    │   Root Servers  │  (13 root server systems)
                    │        .        │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌───────────┐      ┌───────────┐      ┌───────────┐
    │   .com    │      │   .org    │      │   .io     │
    │   TLD     │      │   TLD     │      │   TLD     │
    └─────┬─────┘      └───────────┘      └───────────┘
          │
    ┌─────▼─────┐
    │ google.com│  Authoritative nameserver
    └─────┬─────┘
          │
    ┌─────▼──────┐
    │www.google  │  Actual IP address
    │.com        │
    └────────────┘
```

### DNS Resolution Steps

```
1. User → Browser Cache
   "Do I already know this IP?"
   
2. Browser → OS Cache
   "Does the OS know?"
   
3. OS → Resolver (ISP)
   "Ask my DNS resolver"
   
4. Resolver → Root Server
   "Who handles .com?"
   
5. Resolver → TLD Server
   "Who handles google.com?"
   
6. Resolver → Authoritative Server
   "What's the IP for www.google.com?"
   
7. Response flows back to user
```

### DNS Query Types

| Type | Description | Example |
|------|-------------|---------|
| **A** | IPv4 address | google.com → 142.250.80.46 |
| **AAAA** | IPv6 address | google.com → 2607:f8b0:4004:800::200e |
| **CNAME** | Alias to another name | www.example.com → example.com |
| **MX** | Mail server | example.com → mail.example.com |
| **NS** | Nameserver | example.com → ns1.example.com |
| **TXT** | Text records | SPF, DKIM verification |

---

## 📊 DNS Caching

### TTL (Time To Live)

```
DNS Response:
{
  "name": "www.google.com",
  "type": "A",
  "value": "142.250.80.46",
  "TTL": 300  // Cache for 300 seconds (5 minutes)
}
```

### Caching Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Caching Layers                        │
│                                                          │
│   Browser Cache (seconds to minutes)                     │
│        │                                                 │
│        ▼                                                 │
│   OS Cache (minutes)                                     │
│        │                                                 │
│        ▼                                                 │
│   Router Cache (minutes to hours)                        │
│        │                                                 │
│        ▼                                                 │
│   ISP Resolver Cache (hours to days)                     │
│        │                                                 │
│        ▼                                                 │
│   Authoritative Server (source of truth)                 │
└─────────────────────────────────────────────────────────┘
```

### TTL Trade-offs

| Short TTL (1-5 min) | Long TTL (hours/days) |
|---------------------|----------------------|
| Quick failover | Better performance |
| More DNS queries | Fewer DNS queries |
| Higher DNS costs | Lower DNS costs |
| Faster propagation | Slower propagation |

---

## 🌍 DNS for Load Balancing

### Round-Robin DNS

```
Query: api.example.com

Response (rotates):
├── Request 1: 10.0.0.1
├── Request 2: 10.0.0.2
├── Request 3: 10.0.0.3
└── Request 4: 10.0.0.1 (repeat)

Simple but no health checks!
```

### Geographic DNS (GeoDNS)

```
User in New York → Query: api.example.com
                         │
                         ▼
                   GeoDNS looks up
                   user's location
                         │
                         ▼
                   Returns US-East IP
                   (closest server)

User in Tokyo → Query: api.example.com
                      │
                      ▼
                Returns Asia-Pacific IP
```

### Weighted DNS

```
Route 90% traffic to production
Route 10% traffic to canary

api.example.com:
├── 10.0.0.1 (weight: 90)  ← Production
└── 10.0.0.2 (weight: 10)  ← Canary
```

### Latency-Based Routing

```
DNS checks latency from user to each region
Routes to lowest latency server

User in California:
├── US-West: 10ms  ← Selected!
├── US-East: 70ms
└── EU-West: 150ms
```

---

## 🛡️ DNS for High Availability

### Health Checks

```
DNS Provider continuously checks endpoints:

┌────────────────────────────────────────────┐
│              DNS Provider                   │
│                                            │
│  Health Check → Server 1 ✓ (healthy)       │
│  Health Check → Server 2 ✓ (healthy)       │
│  Health Check → Server 3 ✗ (unhealthy)     │
│                                            │
│  Only return IPs for healthy servers!      │
└────────────────────────────────────────────┘
```

### Failover Configuration

```
Primary:   us-east-1.api.example.com (10.0.0.1)
Secondary: us-west-2.api.example.com (10.0.0.2)

Normal: DNS returns 10.0.0.1
When primary fails: DNS returns 10.0.0.2
```

---

## ⚠️ DNS Challenges

### 1. Propagation Delay

```
Problem: DNS changes don't take effect immediately

You update: api.example.com → new IP
But users still get old IP (cached)

Solutions:
├── Lower TTL before changes
├── Wait for full TTL to expire
└── Use TTL appropriate for use case
```

### 2. DNS as Single Point of Failure

```
If DNS is down, nothing works!

Solutions:
├── Multiple nameservers
├── Geographic distribution
├── Different providers as backup
└── Monitor DNS availability
```

### 3. DNS Attacks

```
DDoS on DNS: Overwhelm DNS servers
DNS Spoofing: Return fake IPs
DNS Hijacking: Redirect to malicious servers

Mitigations:
├── DNSSEC (authentication)
├── DNS provider DDoS protection
├── Use reputable providers
└── Monitor for anomalies
```

---

## 🏢 DNS Providers

| Provider | Best For |
|----------|----------|
| **Route 53** (AWS) | AWS integration, full features |
| **Cloud DNS** (GCP) | GCP integration |
| **Cloudflare** | Performance, DDoS protection |
| **Google Public DNS** | Fast recursive resolver |

---

## 💡 DNS in System Design Interviews

### When to Mention DNS

1. **Global systems** - "We'll use GeoDNS to route users to nearest region"
2. **High availability** - "DNS health checks will failover to healthy endpoints"
3. **Load balancing** - "First level of load balancing at DNS"
4. **Latency optimization** - "Latency-based routing gets users to fastest server"

### Example Usage

```
"For our global video streaming service:

1. User requests video.example.com
2. Route 53 (GeoDNS) returns IP of nearest CDN edge
3. Short TTL (60s) allows quick failover
4. Health checks remove unhealthy endpoints
5. Weighted routing for gradual rollouts"
```

---

## ✅ Key Takeaways

1. **DNS is the entry point** - First step for every request
2. **Caching is crucial** - Reduces latency and load
3. **TTL is a trade-off** - Short for flexibility, long for performance
4. **Use for load balancing** - Geographic, weighted, latency-based
5. **Plan for failures** - DNS can be a SPOF
6. **Propagation takes time** - Changes aren't instant
