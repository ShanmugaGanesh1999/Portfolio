# Numbers Everyone Should Know

> Essential numbers for back-of-the-envelope calculations

---

## 📊 Latency Numbers

### Memory and Storage Latency

| Operation | Latency | Notes |
|-----------|---------|-------|
| L1 cache reference | 0.5 ns | Fastest |
| Branch mispredict | 5 ns | |
| L2 cache reference | 7 ns | |
| Mutex lock/unlock | 25 ns | |
| **Main memory reference** | **100 ns** | Important! |
| Compress 1KB with Snappy | 3 μs | |
| **SSD random read** | **150 μs** | ~1000x memory |
| Read 1MB sequentially from memory | 250 μs | |
| Round trip within datacenter | 500 μs | |
| Read 1MB sequentially from SSD | 1 ms | |
| **HDD disk seek** | **10 ms** | ~100x SSD |
| Read 1MB sequentially from HDD | 20 ms | |
| Send packet CA → Netherlands → CA | 150 ms | |

### Key Takeaways

```
Memory vs Disk:
├── Memory: ~100 ns
├── SSD: ~150 μs (1,500x slower)
├── HDD: ~10 ms (100,000x slower)

Local vs Network:
├── Memory: ~100 ns
├── Same datacenter: ~500 μs (5,000x slower)
├── Cross-continent: ~150 ms (1.5M x slower)
```

---

## 📈 Throughput Numbers

### Component Capacity

| Component | Capacity | Notes |
|-----------|----------|-------|
| Single web server | 1,000-10,000 RPS | Depends on complexity |
| MySQL/PostgreSQL | 5,000-10,000 RPS | With indexing |
| Redis | 100,000+ RPS | In-memory |
| Kafka | 100,000+ messages/sec | Per broker |
| Elasticsearch | 10,000+ queries/sec | Per node |

### Network Throughput

| Network | Bandwidth | Per Second |
|---------|-----------|------------|
| 1 Gbps | 1 Gigabit/s | ~125 MB/s |
| 10 Gbps | 10 Gigabit/s | ~1.25 GB/s |

---

## 💾 Storage Numbers

### Data Size Estimates

| Data Type | Size |
|-----------|------|
| Character (ASCII) | 1 byte |
| Character (UTF-8) | 1-4 bytes |
| Integer | 4-8 bytes |
| UUID | 16 bytes |
| Timestamp | 8 bytes |
| IPv4 address | 4 bytes |
| IPv6 address | 16 bytes |

### Common Objects

| Object | Typical Size |
|--------|--------------|
| User ID (int64) | 8 bytes |
| URL | ~100 bytes |
| Email | ~50 bytes |
| Tweet (280 chars) | ~1 KB (with metadata) |
| Profile photo (compressed) | 200 KB |
| High-res photo | 2-5 MB |
| Minute of video (compressed) | 5-10 MB |
| Hour of video (HD) | 1-3 GB |

### Database Row Sizes

| Table Type | Row Size |
|------------|----------|
| User (basic) | ~500 bytes |
| Tweet/Post | ~1 KB |
| Message | ~500 bytes |
| Transaction | ~200 bytes |

---

## 🔢 Conversion Helpers

### Time Conversions

```
Seconds in:
├── 1 minute:  60
├── 1 hour:    3,600
├── 1 day:     86,400     (round to ~100,000)
├── 1 week:    604,800    (round to ~600,000)
├── 1 month:   2,592,000  (round to ~2.5 million)
├── 1 year:    31,536,000 (round to ~30 million)
```

### Traffic Conversion

```
Daily to Per Second = Daily ÷ 86,400

Quick estimates:
├── 1M/day    ≈ 12/sec
├── 10M/day   ≈ 120/sec
├── 100M/day  ≈ 1,200/sec
├── 1B/day    ≈ 12,000/sec

Peak traffic = 2-3x average
```

### Storage Conversion

```
Powers of 1000:
├── KB = 10³
├── MB = 10⁶
├── GB = 10⁹
├── TB = 10¹²
├── PB = 10¹⁵

Quick multipliers:
├── 1 KB × 1 million = 1 GB
├── 1 MB × 1 million = 1 TB
├── 1 GB × 1 thousand = 1 TB
```

---

## 📱 Scale Reference Points

### User Counts

| Scale | Example |
|-------|---------|
| 1K users | Small startup |
| 100K users | Growing startup |
| 1M users | Successful product |
| 10M users | Popular service |
| 100M users | Major platform |
| 1B users | Facebook, WhatsApp |

### Request Rates

| RPS | Example |
|-----|---------|
| 10 RPS | Small internal tool |
| 100 RPS | Startup API |
| 1K RPS | Medium service |
| 10K RPS | Large service |
| 100K RPS | Major platform |
| 1M RPS | Google, Facebook |

### Data Volumes

| Volume | Example |
|--------|---------|
| 1 GB | Small database |
| 100 GB | Medium database |
| 1 TB | Large database |
| 10 TB | Data warehouse |
| 1 PB | Big data platform |
| 100 PB | Google, Facebook |

---

## 🧮 Quick Math Tricks

### Powers of 2

```
2¹⁰ = 1,024 ≈ 1 thousand (1KB)
2²⁰ = 1,048,576 ≈ 1 million (1MB)
2³⁰ = 1,073,741,824 ≈ 1 billion (1GB)
2⁴⁰ ≈ 1 trillion (1TB)
```

### 80/20 Rule

```
80% of traffic → 20% of content
80% of queries → 20% of data

Use for cache sizing:
- Cache top 20% of data
- Handle 80% of requests from cache
```

### Rule of 72

```
Doubling time = 72 ÷ growth rate

If data grows 10%/year:
72 ÷ 10 = 7.2 years to double
```

---

## 📊 SLA Numbers

### Availability

| Availability | Downtime/Year | Downtime/Month |
|--------------|---------------|----------------|
| 99% | 3.65 days | 7.3 hours |
| 99.9% | 8.76 hours | 43.8 minutes |
| 99.99% | 52.6 minutes | 4.38 minutes |
| 99.999% | 5.26 minutes | 26.3 seconds |

### Latency Percentiles

```
Common targets:
├── P50: 50% of requests < X ms
├── P90: 90% of requests < X ms
├── P99: 99% of requests < X ms
├── P99.9: 99.9% of requests < X ms

Example SLA:
├── P50: < 50ms
├── P99: < 200ms
├── P99.9: < 1000ms
```

---

## 💡 Interview Tips

### State Your Assumptions

```
"Let me assume:
- 100M daily active users
- Each user makes 10 requests/day
- Average request size is 1KB
- Read:write ratio is 100:1"
```

### Round Generously

```
Instead of: 86,400 seconds/day
Use: ~100,000 seconds/day (easier math)

Instead of: 31,536,000 seconds/year
Use: ~30 million seconds/year
```

### Show Your Work

```
"So, 100M users × 10 requests = 1B requests/day
1B ÷ 100,000 seconds = 10,000 requests/second
With 3x peak factor = 30,000 RPS at peak"
```

### Sanity Check

```
"30,000 RPS requires about:
- 30 servers at 1000 RPS each
- Or 3 servers at 10,000 RPS each

That seems reasonable for this scale."
```

---

## ✅ Numbers to Memorize

### Top 10 Must-Know Numbers

1. **1 day = ~100,000 seconds** (86,400 actual)
2. **1 year = ~30 million seconds** (31.5M actual)
3. **Memory read: 100 ns**
4. **SSD read: 150 μs** (1000x memory)
5. **Network round trip (DC): 500 μs**
6. **HDD seek: 10 ms** (100x SSD)
7. **1M requests/day ≈ 12 RPS**
8. **Redis: 100K RPS**
9. **MySQL: 5-10K RPS**
10. **Web server: 1-10K RPS**
