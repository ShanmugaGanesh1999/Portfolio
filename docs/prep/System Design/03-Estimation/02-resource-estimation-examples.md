# Resource Estimation Examples

> Practical examples of back-of-the-envelope calculations

---

## 📝 Example 1: Twitter-like Service

### Requirements
Design a service like Twitter with:
- 300 million monthly active users (MAU)
- 50% are daily active users (DAU)

### Traffic Estimation

```
DAU = 300M × 50% = 150M users

Actions per day per user:
├── View timeline: 10 times
├── Post tweet: 0.5 tweets (avg)
├── Like/RT: 5 times

Total daily requests:
├── Timeline views: 150M × 10 = 1.5B
├── Post tweets: 150M × 0.5 = 75M
├── Engagement: 150M × 5 = 750M
└── Total: ~2.3B requests/day

Requests per second:
├── Average: 2.3B ÷ 86,400 = ~27,000 RPS
├── Peak (3x): ~81,000 RPS
```

### Storage Estimation

```
New tweets per day: 75M

Tweet size:
├── Tweet ID: 8 bytes
├── User ID: 8 bytes
├── Text (280 chars): 280 bytes
├── Timestamp: 8 bytes
├── Metadata: ~200 bytes
└── Total: ~500 bytes

Daily tweet storage:
75M × 500 bytes = 37.5 GB/day

Yearly tweet storage:
37.5 GB × 365 = ~14 TB/year

With 3x replication: ~42 TB/year
```

### Media Storage

```
Assume 10% of tweets have images:
├── 75M × 10% = 7.5M images/day
├── Average image: 200 KB
└── Daily: 7.5M × 200KB = 1.5 TB/day

With video (1% of tweets):
├── 75M × 1% = 750K videos/day
├── Average video: 5 MB
└── Daily: 750K × 5MB = 3.75 TB/day

Total media per day: ~5.25 TB
Yearly: ~1.9 PB
```

### Bandwidth Estimation

```
Read-heavy (100:1 read:write ratio):

Outgoing (reads):
├── Timeline: 1.5B × 10 tweets × 500 bytes = 7.5 TB/day
├── Media views: Assume 50% of tweets viewed have media
├── Images: 7.5B × 50% × 200KB = 750 TB/day

Peak bandwidth:
├── Average: 750 TB ÷ 86,400s = 8.7 GB/s
├── Peak (3x): ~26 GB/s = ~210 Gbps
```

---

## 📝 Example 2: URL Shortener (TinyURL)

### Requirements
- 100 million new URLs per month
- 10:1 read:write ratio
- URLs stored for 5 years

### Traffic Estimation

```
Writes:
├── 100M URLs/month
├── 100M ÷ 30 days = 3.3M URLs/day
├── 3.3M ÷ 86,400 = ~40 URLs/second

Reads (10:1 ratio):
├── 400 reads/second average
├── Peak (5x): 2,000 reads/second
```

### Storage Estimation

```
URL record:
├── Short URL (7 chars): 7 bytes
├── Long URL (avg 200 chars): 200 bytes
├── User ID: 8 bytes
├── Timestamp: 8 bytes
├── Click count: 4 bytes
└── Total: ~230 bytes (round to 250)

Monthly storage:
100M × 250 bytes = 25 GB/month

5-year storage:
25 GB × 60 months = 1.5 TB

With 3x replication: 4.5 TB
```

### URL Key Space

```
How many unique short URLs needed?

5 years × 100M/month = 6 billion URLs

Base62 encoding (a-z, A-Z, 0-9):
├── 6 chars: 62⁶ = 56.8 billion ✓
├── 7 chars: 62⁷ = 3.5 trillion ✓✓

7 characters is more than enough
```

### Cache Estimation

```
80/20 rule: 20% of URLs = 80% of traffic

Hot URLs to cache:
├── Total URLs (5 years): 6 billion
├── 20% hot: 1.2 billion URLs
├── Size: 1.2B × 250 bytes = 300 GB

Can fit in memory with a few servers!
```

---

## 📝 Example 3: Instagram/Photo Sharing

### Requirements
- 500 million DAU
- Users upload 2 photos/day on average
- Users view 100 photos/day

### Traffic Estimation

```
Uploads:
├── 500M × 2 = 1 billion photos/day
├── 1B ÷ 86,400 = ~12,000 uploads/second

Views:
├── 500M × 100 = 50 billion views/day
├── 50B ÷ 86,400 = ~580,000 views/second
├── Peak (3x): ~1.7 million views/second
```

### Storage Estimation

```
Photo sizes (store multiple versions):
├── Original: 2 MB
├── High-res: 500 KB
├── Medium: 200 KB
├── Thumbnail: 20 KB
└── Total per photo: ~2.7 MB

Daily storage:
1B × 2.7 MB = 2.7 PB/day

With 3x replication: 8.1 PB/day

Yearly: ~3,000 PB = 3 EB (Exabytes!)
```

### Bandwidth Estimation

```
Assuming most views are medium size (200KB):

Views bandwidth:
├── 50B × 200 KB = 10 PB/day
├── 10 PB ÷ 86,400 = 116 GB/s
├── Peak: ~350 GB/s = 2.8 Tbps

This is why CDNs are essential!
```

---

## 📝 Example 4: Chat Application (WhatsApp)

### Requirements
- 500 million DAU
- Average 50 messages sent per user per day
- Message size: 100 bytes (text)

### Traffic Estimation

```
Messages per day:
├── 500M × 50 = 25 billion messages/day

Messages per second:
├── 25B ÷ 86,400 = ~290,000 messages/second
├── Peak: ~900,000 messages/second
```

### Storage Estimation

```
Message record:
├── Message ID: 8 bytes
├── Sender ID: 8 bytes
├── Receiver ID: 8 bytes
├── Text: 100 bytes
├── Timestamp: 8 bytes
├── Status: 1 byte
└── Total: ~135 bytes

Daily storage:
25B × 135 bytes = 3.4 TB/day

Keep 30 days on fast storage:
3.4 TB × 30 = ~100 TB

Archive older messages to cold storage
```

### Connection Estimation

```
Concurrent connections:
├── 500M DAU
├── Peak: 30% online simultaneously
├── 500M × 30% = 150 million connections

Per server (assuming 100K connections each):
├── 150M ÷ 100K = 1,500 servers

Just for WebSocket connections!
```

---

## 📝 Example 5: Video Streaming (YouTube)

### Requirements
- 2 billion MAU, 500M DAU
- Average watch time: 30 minutes/day
- 500K new videos uploaded per day

### Viewing Traffic

```
Total watch time:
├── 500M users × 30 min = 15 billion minutes/day
├── = 250 million hours/day

Assuming average bitrate 5 Mbps:
├── 250M hours × 60 min × 60 sec = 900B seconds
├── 900B × 5 Mbps / 8 = 562 PB/day outbound

Concurrent viewers (peak):
├── Assume peak has 20% DAU watching
├── 500M × 20% = 100 million concurrent
├── 100M × 5 Mbps = 500 Tbps bandwidth
```

### Upload/Storage

```
New videos per day: 500K

Assuming average video is 10 minutes:
├── Upload size: 1 GB (raw)
├── After transcoding: 500 MB (multiple formats)

Daily ingestion:
├── 500K × 1 GB = 500 TB/day uploads

With transcoding (multiple resolutions):
├── 500K × 500 MB = 250 TB/day storage
├── Yearly: ~90 PB
```

---

## 📐 Estimation Template

Use this template for any system:

```markdown
## 1. Requirements
- Users: ___ (DAU/MAU)
- Actions per user: ___
- Data per action: ___
- Retention period: ___

## 2. Traffic
- Daily actions: Users × Actions
- RPS: Daily ÷ 86,400
- Peak RPS: Average × 3 (or 5)
- Read:Write ratio: ___

## 3. Storage
- Per record: ___ bytes
- Daily: Records × Size
- Yearly: Daily × 365
- With replication: × 3

## 4. Bandwidth
- Outgoing: Reads × Size
- Incoming: Writes × Size
- Peak: Average × 3

## 5. Summary Table
| Metric | Value |
|--------|-------|
| Peak RPS | |
| Storage/year | |
| Peak bandwidth | |
| Servers needed | |
```

---

## ⚠️ Common Pitfalls

### 1. Forgetting Replication

```
Raw storage: 10 TB
With 3x replication: 30 TB
With backups: 60 TB

Always multiply for redundancy!
```

### 2. Ignoring Peak Traffic

```
Average: 10,000 RPS
Peak (viral event): 100,000 RPS

Design for peak, not average
But don't over-provision for rare events
```

### 3. Forgetting Metadata

```
Storing 1M photos:
├── Photo data: 1M × 2 MB = 2 TB
├── Metadata (indexes, thumbnails): +500 GB
├── Total: 2.5 TB
```

### 4. Wrong Units

```
Common confusion:
├── Mbps vs MBps (8x difference)
├── 1000 vs 1024 (binary vs decimal)
├── Per second vs per day

Always clarify units!
```

---

## 💡 Interview Tips

### Step-by-Step Approach

1. **State assumptions clearly**
   > "I'll assume 100M DAU with 10 actions per user"

2. **Do math out loud**
   > "100M × 10 = 1B actions per day"

3. **Round appropriately**
   > "1B ÷ 86,400 ≈ 12,000 RPS, let's say 10K for easy math"

4. **Sanity check**
   > "10K RPS is manageable with 10-20 servers"

### Quick Estimation Checks

```
✓ Is RPS reasonable? (10-100K for most systems)
✓ Is storage reasonable? (TBs to PBs for large systems)
✓ Is bandwidth achievable? (Gbps to Tbps)
✓ Are server counts practical? (10s to 1000s)
```

---

## ✅ Key Takeaways

1. **Start with users** - Everything derives from user count
2. **Calculate traffic first** - RPS determines architecture
3. **Storage adds up** - Small records × millions = lots of data
4. **Peak matters** - Design for 3-5x average load
5. **Replication multiplies** - Always factor in redundancy
6. **Round generously** - These are estimates, not exact
