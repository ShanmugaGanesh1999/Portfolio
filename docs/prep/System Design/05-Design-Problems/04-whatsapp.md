# Design WhatsApp

> Real-time messaging platform with delivery guarantees

---

## 📋 Problem Statement

Design a messaging platform like WhatsApp that allows users to send real-time messages, create group chats, and share media with end-to-end encryption.

---

## R - Requirements

### Functional Requirements

```
1. One-on-one messaging
2. Group messaging (up to 256 members)
3. Message delivery status (sent, delivered, read)
4. Online/offline status
5. Media sharing (images, videos, documents)
6. End-to-end encryption
7. Push notifications
```

### Non-Functional Requirements

```
1. Real-time delivery (<100ms when online)
2. Message ordering (within a chat)
3. No message loss (at-least-once delivery)
4. High availability
5. Scale to 2B users, 100B messages/day
```

### Capacity Estimation

```
Users:
├── 2B registered users
├── 500M daily active
├── Each user in ~10 groups

Messages:
├── 100B messages/day
├── Write: 100B / 86400 ≈ 1.2M messages/second
├── Peak: 1.2M × 5 = 6M messages/second
├── Average message: 100 bytes
├── Daily storage: 100B × 100 bytes = 10TB

Connections:
├── 500M concurrent connections
├── Long-lived WebSocket connections
```

---

## H - High-Level Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌───────────┐        ┌───────────────────────────────────┐│
│   │  Client   │◄──────►│       WebSocket Gateway           ││
│   │ (Mobile)  │        │   (Long-lived connections)        ││
│   └───────────┘        └───────────────┬───────────────────┘│
│                                        │                     │
│                        ┌───────────────┴───────────────┐    │
│                        │       Message Router          │    │
│                        └───────────────┬───────────────┘    │
│                                        │                     │
│      ┌─────────────────┬───────────────┼───────────────┐    │
│      ▼                 ▼               ▼               ▼    │
│  ┌─────────┐    ┌───────────┐   ┌───────────┐   ┌─────────┐│
│  │  User   │    │  Message  │   │   Group   │   │  Media  ││
│  │ Service │    │  Service  │   │  Service  │   │ Service ││
│  └────┬────┘    └─────┬─────┘   └─────┬─────┘   └────┬────┘│
│       │               │               │              │      │
│       ▼               ▼               ▼              ▼      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Data Layer                            ││
│  │  ┌─────────┐  ┌─────────────┐  ┌─────────┐  ┌─────────┐ ││
│  │  │  MySQL  │  │  Cassandra  │  │  Redis  │  │   S3    │ ││
│  │  │ (Users) │  │  (Messages) │  │ (Cache) │  │ (Media) │ ││
│  │  └─────────┘  └─────────────┘  └─────────┘  └─────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## S - Storage Schema

### Data Models

```
Users:
┌─────────────────────────────────────────────────────────────┐
│ user_id       │ BIGINT    │ PRIMARY KEY                     │
│ phone_number  │ VARCHAR   │ UNIQUE                          │
│ display_name  │ VARCHAR   │                                 │
│ profile_pic   │ VARCHAR   │ S3 URL                          │
│ public_key    │ BLOB      │ For E2E encryption              │
│ last_seen     │ TIMESTAMP │                                 │
│ status        │ VARCHAR   │ "Hey there! I'm using WhatsApp" │
└─────────────────────────────────────────────────────────────┘

Messages (Cassandra):
┌─────────────────────────────────────────────────────────────┐
│ chat_id       │ UUID      │ Partition Key                   │
│ message_id    │ TIMEUUID  │ Clustering Key                  │
│ sender_id     │ BIGINT    │                                 │
│ content       │ BLOB      │ Encrypted                       │
│ media_url     │ VARCHAR   │ Optional, encrypted             │
│ created_at    │ TIMESTAMP │                                 │
│ status        │ TINYINT   │ sent/delivered/read             │
└─────────────────────────────────────────────────────────────┘

Chats:
┌─────────────────────────────────────────────────────────────┐
│ chat_id       │ UUID      │ PRIMARY KEY                     │
│ type          │ ENUM      │ one-on-one, group               │
│ participants  │ LIST      │ User IDs                        │
│ created_at    │ TIMESTAMP │                                 │
│ last_message  │ TIMESTAMP │ For sorting chat list           │
└─────────────────────────────────────────────────────────────┘

User_Chats (for chat list):
┌─────────────────────────────────────────────────────────────┐
│ user_id       │ BIGINT    │ Partition Key                   │
│ chat_id       │ UUID      │ Clustering Key                  │
│ last_message  │ TIMESTAMP │ For ordering                    │
│ unread_count  │ INT       │                                 │
└─────────────────────────────────────────────────────────────┘
```

### Database Choices

```
Users: MySQL/PostgreSQL
├── Relational for user data
├── Phone number lookups
└── Sharded by user_id

Messages: Cassandra
├── High write throughput
├── Time-series data (messages)
├── Partition by chat_id
└── Easy horizontal scaling

Presence: Redis
├── Online/offline status
├── Low latency
├── TTL for auto-expire

Media: S3
├── Images, videos, documents
├── Encrypted before upload
```

---

## D - Detailed Design

### WebSocket Connection Management

```
┌─────────────────────────────────────────────────────────────┐
│              Connection Management                           │
│                                                              │
│   Client connects:                                           │
│   1. TCP/TLS handshake                                      │
│   2. WebSocket upgrade                                      │
│   3. Authentication (JWT)                                   │
│   4. Register connection in Redis                           │
│                                                              │
│   Redis: user:{user_id}:connection → server_id              │
│                                                              │
│   Connection Pool:                                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Gateway Server 1                                    │   │
│   │  ├── Connection for User A                          │   │
│   │  ├── Connection for User B                          │   │
│   │  └── Connection for User C                          │   │
│   └─────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Gateway Server 2                                    │   │
│   │  ├── Connection for User D                          │   │
│   │  └── Connection for User E                          │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   500M connections ÷ 100K per server = 5000 servers         │
└─────────────────────────────────────────────────────────────┘
```

### Message Delivery Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 Message Flow                                 │
│                                                              │
│   1. Alice sends message to Bob                             │
│      ┌─────────┐                                            │
│      │  Alice  │ ── WebSocket ──► Gateway Server A          │
│      └─────────┘                         │                  │
│                                          ▼                  │
│                              ┌───────────────────┐          │
│                              │  Message Service  │          │
│                              └─────────┬─────────┘          │
│                                        │                    │
│   2. Store in Cassandra               ▼                    │
│      messages[chat_id][msg_id] = {...}                     │
│                                        │                    │
│   3. Look up Bob's connection         ▼                    │
│      Redis: user:bob:connection → Server B                 │
│                                        │                    │
│   4. Route to Bob's gateway           ▼                    │
│                              ┌───────────────────┐          │
│                              │  Gateway Server B │          │
│                              └─────────┬─────────┘          │
│                                        │                    │
│   5. Push via WebSocket               ▼                    │
│                                  ┌─────────┐                │
│                                  │   Bob   │                │
│                                  └─────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Delivery Acknowledgments

```
Message States:
├── ✓  Sent (server received)
├── ✓✓ Delivered (recipient device received)
└── ✓✓ Blue: Read (recipient opened chat)

┌─────────────────────────────────────────────────────────────┐
│             Acknowledgment Flow                              │
│                                                              │
│   Alice → Server: Send message                              │
│   Server → Alice: ACK (sent) ✓                              │
│                                                              │
│   Server → Bob: Deliver message                             │
│   Bob → Server: ACK (delivered)                             │
│   Server → Alice: Delivery receipt ✓✓                       │
│                                                              │
│   Bob opens chat                                             │
│   Bob → Server: Read receipt                                │
│   Server → Alice: Read receipt ✓✓ (blue)                    │
└─────────────────────────────────────────────────────────────┘
```

### Offline Message Handling

```
┌─────────────────────────────────────────────────────────────┐
│             Offline Delivery                                 │
│                                                              │
│   Bob is offline:                                            │
│   1. Check Redis: user:bob:connection → null                │
│   2. Store message in Cassandra (persisted)                 │
│   3. Queue push notification                                │
│                                                              │
│   Bob comes online:                                          │
│   1. Connect to gateway                                      │
│   2. Fetch undelivered messages from Cassandra              │
│   3. Deliver pending messages                               │
│   4. Send delivery ACKs                                     │
│                                                              │
│   Query:                                                     │
│   SELECT * FROM messages                                    │
│   WHERE chat_id IN (user's chats)                          │
│   AND status = 'sent'                                       │
│   AND sender_id != user_id                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## A - API Design

### WebSocket Events

```javascript
// Client → Server
{
    "type": "message",
    "chat_id": "uuid-123",
    "content": "encrypted_content_base64",
    "client_msg_id": "local-uuid"  // For deduplication
}

// Server → Client (message delivered)
{
    "type": "message",
    "chat_id": "uuid-123",
    "message_id": "server-uuid",
    "sender_id": "user-456",
    "content": "encrypted_content_base64",
    "timestamp": "2024-01-15T10:30:00Z"
}

// Acknowledgments
{
    "type": "ack",
    "message_id": "server-uuid",
    "status": "delivered"  // or "read"
}

// Presence
{
    "type": "presence",
    "user_id": "user-456",
    "status": "online",  // or "last_seen:timestamp"
}
```

### REST APIs

```
# Get chat list
GET /api/chats
Response: [
    {
        "chat_id": "uuid-123",
        "type": "one-on-one",
        "participants": [...],
        "last_message": {...},
        "unread_count": 5
    }
]

# Get messages (pagination)
GET /api/chats/{chat_id}/messages?before={msg_id}&limit=50
Response: {
    "messages": [...],
    "has_more": true
}

# Create group
POST /api/groups
{
    "name": "Family",
    "participants": ["user-1", "user-2", "user-3"]
}
```

---

## D - Detailed Design (Continued)

### Group Messaging

```
┌─────────────────────────────────────────────────────────────┐
│                  Group Message Fan-out                       │
│                                                              │
│   Group: [Alice, Bob, Charlie, Diana]                       │
│                                                              │
│   Alice sends message:                                       │
│   1. Store message once in Cassandra                        │
│   2. Fan-out to all group members:                          │
│                                                              │
│      ┌─────────────────────────────────────────────────┐    │
│      │           Message Router                         │    │
│      │                                                  │    │
│      │   For each member:                              │    │
│      │   ├── Is online? → Push via WebSocket          │    │
│      │   └── Is offline? → Queue push notification    │    │
│      └─────────────────────────────────────────────────┘    │
│                                                              │
│   Optimization for large groups:                            │
│   ├── Async fan-out via message queue                      │
│   ├── Batch push notifications                             │
│   └── Rate limit per group                                 │
└─────────────────────────────────────────────────────────────┘
```

### End-to-End Encryption

```
┌─────────────────────────────────────────────────────────────┐
│              E2E Encryption (Signal Protocol)                │
│                                                              │
│   Key Exchange (first message):                             │
│                                                              │
│   1. Alice gets Bob's public key from server                │
│   2. Alice generates shared secret                          │
│   3. Messages encrypted with AES-256                        │
│   4. Server only sees encrypted blob                        │
│                                                              │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐      │
│   │  Alice  │         │ Server  │         │   Bob   │      │
│   │         │         │         │         │         │      │
│   │ Encrypt │─────────│ Relay   │─────────│ Decrypt │      │
│   │ with    │  [blob] │ (can't  │  [blob] │ with    │      │
│   │ Bob's   │         │  read)  │         │ private │      │
│   │ pubkey  │         │         │         │ key     │      │
│   └─────────┘         └─────────┘         └─────────┘      │
│                                                              │
│   Group encryption:                                         │
│   ├── Each member has own key pair                         │
│   ├── Sender encrypts for each recipient                   │
│   └── Or: Use group key, re-encrypt on member change       │
└─────────────────────────────────────────────────────────────┘
```

### Presence System

```
┌─────────────────────────────────────────────────────────────┐
│                 Presence (Online/Offline)                    │
│                                                              │
│   Redis Store:                                               │
│   user:{user_id}:online → timestamp (TTL: 30s)              │
│                                                              │
│   Heartbeat:                                                 │
│   ├── Client sends ping every 15 seconds                   │
│   ├── Server updates Redis TTL                             │
│   └── No ping for 30s → considered offline                 │
│                                                              │
│   Privacy settings:                                         │
│   ├── Everyone can see                                     │
│   ├── My contacts only                                     │
│   └── Nobody                                               │
│                                                              │
│   Last seen:                                                │
│   ├── Store timestamp on disconnect                        │
│   └── "Last seen today at 3:45 PM"                        │
└─────────────────────────────────────────────────────────────┘
```

### Media Handling

```
┌─────────────────────────────────────────────────────────────┐
│                  Media Upload Flow                           │
│                                                              │
│   1. Client encrypts media locally                          │
│   2. Upload encrypted blob to S3                            │
│   3. Get S3 URL                                             │
│   4. Send message with encrypted URL + decryption key       │
│                                                              │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐            │
│   │  Alice  │      │   S3    │      │   Bob   │            │
│   │         │      │         │      │         │            │
│   │ Encrypt │─────►│ [blob]  │◄─────│ Download│            │
│   │ Upload  │      │         │      │ Decrypt │            │
│   └─────────┘      └─────────┘      └─────────┘            │
│        │                                  ▲                 │
│        └── Send encrypted URL + key ──────┘                │
│                                                              │
│   Server never has decryption key!                          │
└─────────────────────────────────────────────────────────────┘
```

---

## E - Evaluation

### Bottlenecks

```
1. WebSocket connection management
   → Load balance by user hash
   → Multiple gateway tiers

2. Message fan-out for large groups
   → Async processing
   → Rate limiting

3. Hot chats (viral groups)
   → Partition by time windows
   → Dedicated shards

4. Presence updates
   → Pub-sub for contacts only
   → Batch updates
```

### Message Ordering

```
Problem: Messages may arrive out of order

Solutions:
1. Timestamp-based ordering:
   ├── Use server timestamp
   └── Client reorders by timestamp

2. Sequence numbers:
   ├── Per-chat sequence
   └── Fill gaps on display

3. Vector clocks:
   ├── For distributed ordering
   └── Overkill for most cases

WhatsApp approach:
├── TIMEUUID as message ID
├── Ordered within partition
└── Client displays by timestamp
```

### Reliability

```
At-least-once delivery:
├── Store before acknowledge
├── Retry on failure
├── Client dedupe by message ID

No message loss:
├── Cassandra replication (RF=3)
├── Multi-DC deployment
├── Client stores messages locally

Recovery:
├── Client syncs from server on reconnect
├── Server keeps messages until delivered
```

---

## D - Distinctive Features

### Push Notifications

```
When user is offline:

1. Message stored in Cassandra
2. Push notification queued
3. APNs (iOS) / FCM (Android) delivery

Notification payload (encrypted summary):
{
    "title": "John",
    "body": "You have a new message",
    "badge": 5,
    "data": {
        "chat_id": "uuid-123"
    }
}

Note: Actual content encrypted,
notification just triggers app wake
```

### Multi-Device Sync

```
WhatsApp Web / Desktop:

┌─────────────────────────────────────────────────────────────┐
│                Multi-Device Architecture                     │
│                                                              │
│   Primary (Phone):                                           │
│   ├── Holds master keys                                     │
│   ├── Required for initial setup                            │
│   └── Can work independently                                │
│                                                              │
│   Secondary (Web/Desktop):                                  │
│   ├── Gets own key pair                                     │
│   ├── Syncs messages from primary                           │
│   └── Can now work independently                            │
│                                                              │
│   Message routing:                                           │
│   ├── Server delivers to ALL linked devices                 │
│   └── Each device can decrypt                               │
└─────────────────────────────────────────────────────────────┘
```

### Typing Indicators

```
"Alice is typing..."

┌─────────────────────────────────────────────────────────────┐
│             Typing Indicator Flow                            │
│                                                              │
│   Alice starts typing:                                       │
│   → Send typing_start to server                             │
│   → Server forwards to Bob (if online)                      │
│   → Bob's app shows "typing..."                             │
│                                                              │
│   Debouncing:                                                │
│   ├── Don't send on every keystroke                        │
│   ├── Batch: typing_start, then silence for 3s             │
│   └── Auto-expire after 5 seconds                          │
│                                                              │
│   Privacy:                                                   │
│   ├── Only send if recipient is online                     │
│   └── Respect "read receipts" privacy setting              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary

```
Key Components:
├── WebSocket Gateway: Long-lived connections
├── Message Router: Route to correct server
├── Message Service: Store, deliver, acknowledge
├── Presence Service: Online/offline tracking
├── Push Service: Offline notifications

Key Decisions:
├── WebSocket for real-time
├── Cassandra for message storage
├── Redis for presence & connection mapping
├── E2E encryption (Signal Protocol)
├── At-least-once delivery

Scale:
├── 500M concurrent connections
├── 1M+ messages/second
├── ~5000 gateway servers
├── Multi-DC for availability
```
