# Blob Store

> Storing and retrieving large binary objects at scale

---

## 📖 What is a Blob Store?

A **Blob Store** (Binary Large Object Store) is a storage system optimized for storing unstructured data like images, videos, documents, backups, and logs.

```
Blob Store Characteristics:
├── Flat namespace (no hierarchy in storage)
├── Optimized for large files
├── Immutable objects (replace, not modify)
├── Highly durable (99.999999999% - 11 nines)
└── Globally accessible via HTTP
```

---

## 🎯 Blob vs File vs Block Storage

```
Block Storage (EBS, SAN):
├── Fixed-size blocks
├── Attached to single server
├── Low latency
└── Use: Databases, OS disks

File Storage (NFS, EFS):
├── Hierarchical (folders)
├── Shared access
├── POSIX compatible
└── Use: Shared files, home directories

Blob Storage (S3, GCS):
├── Flat namespace (buckets + keys)
├── HTTP access
├── Massive scale
└── Use: Images, videos, backups
```

```
                   Block            File             Blob
Abstraction:       Blocks           Files            Objects
Access:            Mount            Mount/Network    HTTP API
Scale:             Limited          Medium           Unlimited
Use Case:          Database         Shared Files     Media/Backups
```

---

## 🔧 Blob Store Architecture

### Basic Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Blob Store                            │
│                                                              │
│   Bucket: my-images                                          │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  Object Key           │  Data        │  Metadata      │ │
│   │───────────────────────┼──────────────┼────────────────│ │
│   │  photos/cat.jpg       │  [binary]    │  size, type    │ │
│   │  photos/dog.jpg       │  [binary]    │  size, type    │ │
│   │  avatars/user-123.png │  [binary]    │  size, type    │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                              │
│   Bucket: my-videos                                          │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  videos/intro.mp4     │  [binary]    │  size, type    │ │
│   │  videos/demo.mp4      │  [binary]    │  size, type    │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Access: https://my-images.s3.amazonaws.com/photos/cat.jpg
```

### Internal Architecture

```
                          ┌─────────────────┐
    Client ───REST API───►│   Front-End     │
                          │   (API Layer)   │
                          └────────┬────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                ▼                  ▼                  ▼
         ┌──────────┐       ┌──────────┐       ┌──────────┐
         │ Metadata │       │  Index   │       │   Auth   │
         │  Service │       │ Service  │       │ Service  │
         └────┬─────┘       └────┬─────┘       └──────────┘
              │                  │
              ▼                  ▼
         ┌─────────────────────────────┐
         │      Metadata Database      │
         │   (Object → Location map)   │
         └─────────────────────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │       Storage Layer          │
         │                              │
         │   Chunk 1    Chunk 2         │
         │  [Server A] [Server B]       │
         │  (replica)  (replica)        │
         └─────────────────────────────┘
```

---

## 📊 Key Operations

### Upload (PUT)

```
1. Client sends: PUT /bucket/key with data
2. Front-end validates request
3. Data chunked into parts
4. Each chunk replicated to multiple nodes
5. Metadata stored (key → chunk locations)
6. Return success + ETag

Large File Upload (Multipart):
├── Initiate upload → get upload ID
├── Upload parts in parallel
├── Complete upload → combine parts
└── Abort if failed
```

```python
# AWS S3 multipart upload example
import boto3
from boto3.s3.transfer import TransferConfig

s3 = boto3.client('s3')

# Config for multipart (files > 8MB split into parts)
config = TransferConfig(
    multipart_threshold=8 * 1024 * 1024,  # 8MB
    multipart_chunksize=8 * 1024 * 1024,
    max_concurrency=10
)

s3.upload_file(
    'large_video.mp4',
    'my-bucket',
    'videos/large_video.mp4',
    Config=config
)
```

### Download (GET)

```
1. Client sends: GET /bucket/key
2. Lookup metadata → find chunk locations
3. Fetch chunks from storage nodes
4. Assemble and return data

Range Requests (partial download):
GET /bucket/key
Range: bytes=0-999999

Returns first 1MB only
Used for: Video streaming, resumable downloads
```

### Delete

```
Soft Delete:
├── Mark object as deleted
├── Actually delete after retention period
└── Allows recovery

Hard Delete:
├── Remove immediately
├── May keep versions (if versioning enabled)
```

---

## 🔧 Data Organization

### Chunking

```
Large file split into chunks:

Original: 100MB file
         │
         ▼
   ┌─────┬─────┬─────┬─────┬─────┐
   │16MB │16MB │16MB │16MB │16MB │... (chunks)
   └──┬──┴──┬──┴──┬──┴──┬──┴──┬──┘
      │     │     │     │     │
      ▼     ▼     ▼     ▼     ▼
   Node A Node B Node C Node A Node B

Benefits:
├── Parallel upload/download
├── Efficient storage (dedup)
├── Fault tolerance (lose chunk, not file)
└── Resume from any point
```

### Replication

```
Each chunk replicated N times:

Chunk 1:
├── Replica 1 → Datacenter A, Rack 1, Node 3
├── Replica 2 → Datacenter A, Rack 4, Node 7
└── Replica 3 → Datacenter B, Rack 2, Node 1

Placement rules:
├── Different racks (survive rack failure)
├── Different datacenters (survive DC failure)
└── Different regions (survive region failure)
```

### Erasure Coding

```
Alternative to replication for cold data:

Replication (3 copies): 100MB × 3 = 300MB storage

Erasure Coding (4+2):
├── Split into 4 data chunks
├── Create 2 parity chunks
├── Total: 6 chunks
├── Can lose any 2, still recover
└── Storage: 100MB × 1.5 = 150MB

Trade-off:
├── More CPU for encode/decode
├── Less storage cost
└── Best for rarely accessed data
```

---

## 📈 Blob Store Services

### Amazon S3

```
Features:
├── 11 nines durability (99.999999999%)
├── Storage classes (Standard, IA, Glacier)
├── Versioning
├── Lifecycle policies
├── Cross-region replication
└── Event notifications

Storage Classes:
├── Standard: Frequent access (~$0.023/GB)
├── Infrequent Access: ~$0.0125/GB + retrieval fee
├── Glacier: Archive, ~$0.004/GB, minutes-hours retrieval
└── Glacier Deep Archive: ~$0.00099/GB, 12hr retrieval
```

### Google Cloud Storage

```
Similar to S3:
├── Standard, Nearline, Coldline, Archive classes
├── Object lifecycle management
├── Strong consistency
└── Signed URLs
```

### Azure Blob Storage

```
Tiers:
├── Hot: Frequent access
├── Cool: Infrequent access
├── Archive: Rarely accessed
└── Premium: High performance
```

---

## 🔧 Access Control

### Bucket Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/public/*"
    }
  ]
}
```

### Signed URLs

```
Grant temporary access to private objects:

URL = base + object + signature + expiry

https://my-bucket.s3.amazonaws.com/private/doc.pdf
  ?X-Amz-Signature=abc123...
  &X-Amz-Expires=3600

Anyone with URL can access for 1 hour
No AWS credentials needed
```

```python
# Generate signed URL
import boto3

s3 = boto3.client('s3')
url = s3.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'my-bucket', 'Key': 'private/doc.pdf'},
    ExpiresIn=3600  # 1 hour
)
```

---

## 💡 Common Patterns

### 1. Direct Upload

```
Problem: Uploading through your server is slow

Solution: Client uploads directly to blob store

1. Client requests upload URL from your server
2. Server generates signed PUT URL
3. Client uploads directly to S3
4. S3 notifies your server (optional)

    Client ─────────────────────────► S3
            (direct upload)
       │                               │
       └───────────┐   ┌───────────────┘
                   ▼   ▼ (notification)
                Your Server
```

### 2. CDN Integration

```
    User ──► CDN Edge ──► Origin (S3)
               │
               ▼
           (cached)
           
Subsequent requests served from edge
Lower latency, reduced S3 costs
```

### 3. Image Processing Pipeline

```
Upload ──► S3 ──► Lambda (triggered) ──► Generate Thumbnails
                                               │
                                   ┌───────────┴───────────┐
                                   ▼                       ▼
                          s3://thumbs/small/        s3://thumbs/large/
```

### 4. Data Lake

```
Store everything in blob store:

s3://data-lake/
├── raw/                    # Original data
│   ├── logs/2024/01/01/
│   └── events/2024/01/01/
├── processed/              # Cleaned data
│   └── parquet/
└── curated/               # Analytics-ready
    └── tables/

Query with: Athena, Presto, Spark
```

---

## ⚠️ Considerations

### Naming

```
Object keys are just strings:

Good:
├── photos/{user_id}/{timestamp}_{filename}
├── logs/{year}/{month}/{day}/access.log
└── Use prefixes for organization

Bad:
├── Sequential keys (hot partitions)
├── Special characters that need encoding
└── Very long keys
```

### Consistency

```
S3 is now strongly consistent (since 2020):
├── Read-after-write consistent
├── List operations consistent
└── No more eventual consistency issues

Other systems may vary - check docs!
```

### Cost Optimization

```
1. Choose right storage class
2. Lifecycle policies (auto-move to cheaper class)
3. Enable intelligent tiering
4. Delete incomplete multipart uploads
5. Use transfer acceleration for speed
6. Compress before storing
```

---

## 💡 In System Design Interviews

### When to Use Blob Store

```
1. "Store images/videos/files"
2. "Need cheap, durable storage"
3. "Files accessed via HTTP"
4. "Scale to petabytes"
```

### Design Points

```
1. What to store in blob store vs database?
   → Large files (images, videos) → Blob
   → Metadata → Database

2. Access patterns?
   → Read-heavy → Add CDN
   → Write-heavy → Use multipart upload

3. Security?
   → Private buckets + signed URLs

4. Cost?
   → Lifecycle policies, storage classes
```

---

## ✅ Key Takeaways

1. **Blob store = unstructured data** at massive scale
2. **Flat namespace** - buckets and keys, no real folders
3. **Immutable objects** - replace, don't modify
4. **11 nines durability** - your data is safe
5. **Use CDN** for frequently accessed content
6. **Direct upload** with signed URLs saves bandwidth
7. **Storage classes** for cost optimization
8. **Metadata in database**, files in blob store
