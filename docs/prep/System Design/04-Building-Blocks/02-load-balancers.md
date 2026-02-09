# Load Balancers

> Distributing traffic across multiple servers for scalability and reliability

---

## 📖 What is a Load Balancer?

A **Load Balancer** distributes incoming network traffic across multiple servers to ensure no single server bears too much load.

```
                    Without Load Balancer:
                    
Users ─────────────► Single Server ──► Overloaded!
                         │
                         ▼
                      Crashes

                    With Load Balancer:
                    
                    ┌─────────────┐
Users ─────────────►│Load Balancer│
                    └──────┬──────┘
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
       ┌────────┐    ┌────────┐    ┌────────┐
       │Server 1│    │Server 2│    │Server 3│
       └────────┘    └────────┘    └────────┘
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    Load distributed!
```

---

## 🎯 Why Load Balancers Matter

1. **Scalability** - Handle more traffic by adding servers
2. **Availability** - Redirect traffic away from failed servers
3. **Performance** - Reduce latency by distributing load
4. **Flexibility** - Perform maintenance without downtime

---

## 🔧 Load Balancer Algorithms

### 1. Round Robin

```
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A  (cycle repeats)

Pros: Simple, even distribution
Cons: Ignores server capacity and current load
```

### 2. Weighted Round Robin

```
Server A (weight: 3) → Gets 3 requests
Server B (weight: 2) → Gets 2 requests
Server C (weight: 1) → Gets 1 request
                       (then repeat)

Use when: Servers have different capacities
```

### 3. Least Connections

```
Server A: 10 active connections
Server B: 5 active connections  ← Next request goes here
Server C: 8 active connections

Use when: Request processing time varies
```

### 4. Least Response Time

```
Server A: avg 50ms response
Server B: avg 30ms response  ← Next request goes here
Server C: avg 45ms response

Use when: Performance is critical
```

### 5. IP Hash

```
hash(client_IP) % num_servers = target_server

Client 1 (IP: 1.2.3.4) → always Server A
Client 2 (IP: 5.6.7.8) → always Server B

Use when: Session affinity needed without cookies
```

### 6. Consistent Hashing

```
Servers and requests mapped to a hash ring
Minimizes redistribution when servers added/removed

        Server A
           │
    ┌──────┴──────┐
    │   Hash Ring │
    └─────────────┘
   ╱              ╲
Server C        Server B

Use when: Stateful services, caching
```

---

## 📊 Types of Load Balancers

### Layer 4 (Transport Layer)

```
Operates at: TCP/UDP level
Sees: IP addresses, ports
Fast: Minimal processing

┌───────────────────────────────────────────┐
│            Layer 4 Load Balancer          │
│                                           │
│  Source: 1.2.3.4:54321                    │
│  Dest: 10.0.0.1:80                        │
│                                           │
│  Decision based on: IP + Port only        │
│  Cannot see: HTTP headers, cookies, URL   │
└───────────────────────────────────────────┘
```

### Layer 7 (Application Layer)

```
Operates at: HTTP/HTTPS level
Sees: URLs, headers, cookies, content
Slower: More processing required

┌───────────────────────────────────────────┐
│            Layer 7 Load Balancer          │
│                                           │
│  Can route based on:                      │
│  ├── URL path (/api vs /static)           │
│  ├── HTTP headers (Host, Accept)          │
│  ├── Cookies (session affinity)           │
│  ├── Request content                      │
│  └── User agent                           │
└───────────────────────────────────────────┘
```

### L4 vs L7 Comparison

| Aspect | Layer 4 | Layer 7 |
|--------|---------|---------|
| Speed | Faster | Slower |
| Features | Basic | Rich |
| SSL Termination | No | Yes |
| Content-based routing | No | Yes |
| Cost | Lower | Higher |
| Use case | Simple TCP | HTTP applications |

---

## 🌍 Global vs Local Load Balancing

### Global Load Balancing (GSLB)

```
Distributes traffic across data centers worldwide

                     User
                       │
                       ▼
              ┌─────────────────┐
              │  Global DNS LB  │
              └────────┬────────┘
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   US-East         US-West          Europe
   ┌─────┐         ┌─────┐         ┌─────┐
   │ DC  │         │ DC  │         │ DC  │
   └─────┘         └─────┘         └─────┘
```

### Local Load Balancing

```
Distributes traffic within a single data center

                     Traffic
                        │
                        ▼
               ┌─────────────────┐
               │  Local LB       │
               └────────┬────────┘
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌────────┐     ┌────────┐     ┌────────┐
   │Server 1│     │Server 2│     │Server 3│
   └────────┘     └────────┘     └────────┘
```

---

## 🔄 Load Balancer Features

### Health Checks

```python
# Load balancer checks server health
def health_check(server):
    try:
        response = http_get(f"{server}/health", timeout=5)
        return response.status == 200
    except Timeout:
        return False

# Remove unhealthy servers from pool
def update_pool():
    for server in all_servers:
        if health_check(server):
            add_to_pool(server)
        else:
            remove_from_pool(server)
```

### Session Persistence (Sticky Sessions)

```
Problem: User sessions stored on one server
         Routing to different server = lost session

Solutions:
├── Cookie-based: Insert LB cookie to track server
├── IP-based: Route same IP to same server
└── Application: Store sessions externally (Redis)
```

### SSL/TLS Termination

```
With SSL Termination at LB:

Client ──HTTPS──► LB ──HTTP──► Server
                  │
            Decrypt here
            (CPU intensive)
            
Pros: Servers don't handle encryption
Cons: Internal traffic unencrypted (add VPN/internal TLS)
```

### Connection Pooling

```
Without pooling:
Client → LB → New connection → Server
Client → LB → New connection → Server
(Many connections)

With pooling:
Client → LB ─┐
Client → LB ─┼─ Shared Pool → Server
Client → LB ─┘   of connections
(Fewer connections, reused)
```

---

## 🏗️ Load Balancer Architectures

### Single LB (Not Recommended for Production)

```
          ┌──────┐
Users ───►│  LB  │───► Servers
          └──────┘
              │
        Single point
        of failure!
```

### Active-Passive LB

```
          ┌──────┐
Users ───►│Active│───► Servers
          │  LB  │
          └───┬──┘
              │ heartbeat
          ┌───▼──┐
          │Passive│
          │  LB   │ (standby)
          └──────┘
```

### Active-Active LB

```
          ┌──────┐
Users ───►│  LB1 │───┐
          └──────┘   │
                     ├───► Servers
          ┌──────┐   │
Users ───►│  LB2 │───┘
          └──────┘
          
Both active, traffic split
```

---

## 🛠️ Popular Load Balancers

### Software Load Balancers

| Name | Type | Best For |
|------|------|----------|
| **Nginx** | L7 | Web apps, reverse proxy |
| **HAProxy** | L4/L7 | High performance |
| **Envoy** | L7 | Service mesh, gRPC |
| **Traefik** | L7 | Kubernetes, dynamic config |

### Cloud Load Balancers

| Provider | Service | Type |
|----------|---------|------|
| AWS | ALB | L7 HTTP/HTTPS |
| AWS | NLB | L4 TCP/UDP |
| AWS | ELB (Classic) | L4/L7 Legacy |
| GCP | Cloud Load Balancing | L4/L7 |
| Azure | Azure Load Balancer | L4/L7 |

### Hardware Load Balancers

```
F5 BIG-IP, Citrix ADC

Pros: High performance, enterprise features
Cons: Expensive, less flexible
```

---

## ⚠️ Load Balancer Challenges

### 1. Load Balancer as SPOF

```
Solution: Multiple LBs with failover
          DNS load balancing across LBs
          Cloud managed LB (built-in redundancy)
```

### 2. Uneven Load Distribution

```
Symptoms: Some servers overloaded, others idle

Causes:
├── Sticky sessions concentrating users
├── Long-running connections
├── Varying request complexity

Solutions:
├── Use least-connections algorithm
├── Implement request queuing
└── Auto-scale based on metrics
```

### 3. Session Management

```
Stateful servers + LB = Problems

Solutions:
├── External session store (Redis)
├── JWT tokens (stateless)
├── Sticky sessions (last resort)
└── Session replication (complex)
```

---

## 💡 Load Balancers in System Design

### When to Mention

1. **Any scalable web service** - "We'll put servers behind a load balancer"
2. **High availability** - "LB health checks remove failed instances"
3. **Microservices** - "Service mesh with Envoy for load balancing"
4. **API design** - "L7 LB routes /api to backend, /static to CDN"

### Design Considerations

```
Questions to consider:
├── L4 or L7? (L7 for HTTP features)
├── Algorithm? (Usually least-connections)
├── Sticky sessions needed? (Avoid if possible)
├── SSL termination? (Usually at LB)
├── How many LBs? (At least 2 for redundancy)
└── Cloud managed or self-hosted?
```

### Example Architecture

```
"For our e-commerce platform:

1. Global DNS routes to nearest region
2. Regional ALB (L7) at edge
3. Route /api/* to API servers
4. Route /static/* to CDN origin
5. Least connections algorithm
6. Health checks every 10 seconds
7. Auto-scaling triggers at 70% CPU"
```

---

## ✅ Key Takeaways

1. **LBs enable horizontal scaling** - Add more servers easily
2. **Use L7 for HTTP apps** - Content-based routing
3. **Health checks are essential** - Remove failed servers
4. **Avoid single LB** - Use pairs or cloud-managed
5. **Choose the right algorithm** - Usually least-connections
6. **Terminate SSL at LB** - Offload from application servers
7. **Think stateless** - Avoid sticky sessions when possible
