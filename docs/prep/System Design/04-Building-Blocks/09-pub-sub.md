# Pub-Sub (Publish-Subscribe)

> Broadcasting messages to multiple subscribers

---

## 📖 What is Pub-Sub?

**Pub-Sub (Publish-Subscribe)** is a messaging pattern where publishers send messages to a topic, and all subscribers to that topic receive the message.

```
                    ┌─────────────┐
Publisher ─────────►│    Topic    │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      Subscriber A    Subscriber B    Subscriber C
      (gets copy)     (gets copy)     (gets copy)
```

---

## 🎯 Pub-Sub vs Message Queue

```
Message Queue:
├── One message → One consumer
├── Point-to-point
├── Load balancing

                    Queue
Producer ─────────► [msg] ─────────► Consumer A (gets it)
                                     Consumer B (waiting)

Pub-Sub:
├── One message → All subscribers  
├── Broadcast
├── Fan-out

                    Topic
Publisher ────────► [msg] ─────────► Subscriber A (copy)
                         ─────────► Subscriber B (copy)
                         ─────────► Subscriber C (copy)
```

---

## 🔧 Pub-Sub Components

### Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Pub-Sub System                          │
│                                                              │
│   Publishers          Topics            Subscribers          │
│                                                              │
│   ┌─────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │   App   │────►│   orders    │────►│  Inventory  │       │
│   └─────────┘     └─────────────┘     ├─────────────┤       │
│                         │             │  Billing    │       │
│   ┌─────────┐           │             ├─────────────┤       │
│   │   API   │           │             │ Analytics   │       │
│   └─────────┘           │             └─────────────┘       │
│                         │                                    │
│                   ┌─────────────┐     ┌─────────────┐       │
│                   │   users     │────►│   Email     │       │
│                   └─────────────┘     ├─────────────┤       │
│                                       │   Search    │       │
│                                       └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Subscriptions

```
Topic: user-events

Subscription Types:

Push Subscription:
Topic ──push──► Subscriber's endpoint (webhook)

Pull Subscription:
Subscriber ──poll──► Topic (subscriber controls pace)
```

---

## 📊 Pub-Sub Patterns

### 1. Fan-Out

```
One event triggers multiple actions:

User Signs Up
      │
      ▼
 "user.created"
      │
      ├──► Welcome Email Service
      ├──► Analytics Service
      ├──► CRM Service
      ├──► Recommendation Service
      └──► Audit Log Service
```

### 2. Event-Driven Architecture

```
Services communicate only through events:

┌────────────┐     ┌────────────┐     ┌────────────┐
│   Order    │────►│   Event    │◄────│  Payment   │
│  Service   │     │    Bus     │     │  Service   │
└────────────┘     └─────┬──────┘     └────────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │Inventory │ │Shipping  │ │  Email   │
      │ Service  │ │ Service  │ │ Service  │
      └──────────┘ └──────────┘ └──────────┘
```

### 3. CQRS (Command Query Responsibility Segregation)

```
Commands:                    Queries:
   │                            │
   ▼                            ▼
Write Model              Read Model (optimized)
   │                            ▲
   └───► Events ─────────────────┘
         
Write → Event → Update multiple read models
Each query type has its own optimized view
```

### 4. Event Sourcing

```
Instead of storing current state:
├── Store all events
├── Replay events to get current state
└── Complete audit trail

Events:
1. OrderCreated {id: 1, items: [...]}
2. ItemRemoved {id: 1, item: "book"}
3. PaymentReceived {id: 1, amount: 50}
4. OrderShipped {id: 1, tracking: "..."}

Current state = replay all events
```

---

## 📈 Pub-Sub Technologies

### Google Cloud Pub/Sub

```
Type: Managed, global
Features:
├── Push and pull subscriptions
├── At-least-once delivery
├── Message ordering (with key)
├── Dead letter topics
└── Exactly-once (with client dedup)

Best for: GCP apps, global distribution
```

### Apache Kafka

```
Type: Distributed log
Features:
├── Topics with partitions
├── Consumer groups
├── Message replay
├── High throughput
└── Long retention

Best for: High throughput, event sourcing
```

### AWS SNS + SQS

```
SNS (Simple Notification Service):
├── Pub-sub topics
├── Push to HTTP, email, SMS, SQS
└── Fan-out pattern

SNS + SQS combo:
SNS Topic → SQS Queue 1 → Consumer A
         → SQS Queue 2 → Consumer B
         
Each consumer has own queue (independent)
```

### Redis Pub/Sub

```
Type: In-memory, fire-and-forget
Features:
├── Very low latency
├── Pattern matching
└── No persistence

Best for: Real-time updates, notifications
Caveat: No durability, subscriber must be online
```

### Comparison

| Feature | Kafka | Pub/Sub | SNS | Redis |
|---------|-------|---------|-----|-------|
| Persistence | Yes | Yes | No (use SQS) | No |
| Ordering | Partition | Key-based | No | No |
| Replay | Yes | Limited | No | No |
| Latency | Medium | Medium | Low | Very Low |
| Managed | No | Yes | Yes | Varies |

---

## 🔧 Message Ordering

```
Problem: Messages arrive out of order

Order Created → Order Paid → Order Shipped
                    ↓ (arrives late)
Received: Order Created → Order Shipped → Order Paid ❌

Solutions:

1. Ordering Key:
   All messages for order-123 go to same partition
   Within partition, order guaranteed
   
2. Timestamps:
   Include timestamp in message
   Consumer reorders based on time

3. Sequence Numbers:
   Include sequence in message
   Consumer waits for missing sequences
```

---

## ⚠️ Pub-Sub Challenges

### 1. At-Least-Once Delivery

```
Message may be delivered multiple times

Subscriber must be idempotent:
├── Use unique message IDs
├── Track processed IDs
└── Make operations idempotent
```

### 2. Subscriber Failures

```
What if subscriber is down?

Durable subscriptions:
├── Messages stored until acknowledged
├── Retry with backoff
├── Dead letter after max retries

Ephemeral subscriptions:
├── Messages lost if subscriber offline
├── Use for real-time only
```

### 3. Message Schema Evolution

```
Problem: Message format changes

Solutions:
├── Schema registry (Avro, Protobuf)
├── Backward compatible changes
├── Version in message
└── Graceful handling of unknown fields
```

### 4. Backpressure

```
Problem: Subscriber can't keep up

Solutions:
├── Pull-based consumption (subscriber controls rate)
├── Batching messages
├── Multiple consumers
├── Rate limiting publishers
└── Alert on growing backlog
```

---

## 💡 Pub-Sub Use Cases

### 1. Microservice Communication

```
Order Service publishes: OrderCreated
├── Inventory Service subscribes
├── Payment Service subscribes
├── Notification Service subscribes
└── Analytics Service subscribes

Loose coupling, easy to add new services
```

### 2. Real-Time Updates

```
User posts comment:
├── Publish to "comments" topic
├── Web clients subscribed receive update
└── All active users see new comment instantly

WebSocket servers subscribe to topic
Push to connected clients
```

### 3. Data Sync

```
User updates profile:
├── Primary DB updated
├── Event published
├── Search index subscribes → updates index
├── Cache service subscribes → invalidates cache
├── Analytics subscribes → updates metrics
```

### 4. Audit Logging

```
All services publish events:
├── user.login
├── order.created  
├── payment.processed
├── ...

Audit service subscribes to all
Creates complete audit trail
```

---

## 💡 In System Design Interviews

### When to Use Pub-Sub

```
1. "Multiple services need to react to an event"
2. "We need loose coupling between services"
3. "Events should be broadcast to all interested parties"
4. "We want to add new consumers without changing publishers"
```

### Key Points to Mention

```
├── Why pub-sub? (fan-out, decoupling)
├── Delivery guarantee (at-least-once + idempotency)
├── How to handle ordering (partition key)
├── What if subscriber is down (durability)
├── Schema management (evolution)
└── Monitoring (lag, errors)
```

---

## ✅ Key Takeaways

1. **Pub-Sub = broadcast** - One message to many subscribers
2. **Loose coupling** - Publishers don't know subscribers
3. **Fan-out pattern** - One event triggers multiple actions
4. **At-least-once delivery** - Make subscribers idempotent
5. **Ordering via keys** - Same key = same partition
6. **Kafka for replay** - Event sourcing, audit trails
7. **SNS+SQS for AWS** - Managed, reliable combination
