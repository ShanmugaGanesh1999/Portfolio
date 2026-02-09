# Message Queues

> Decoupling services with asynchronous communication

---

## 📖 What is a Message Queue?

A **Message Queue** is a form of asynchronous communication between services where messages are stored until they're processed.

```
Synchronous (Without Queue):
Service A ──request──► Service B ──processing──► Response
           Blocks and waits...

Asynchronous (With Queue):
Service A ──message──► Queue ──► Service B
           Returns immediately    Processes later
```

---

## 🎯 Why Use Message Queues?

1. **Decoupling** - Services don't need to know about each other
2. **Resilience** - Messages persist if consumer is down
3. **Scalability** - Add consumers to handle load
4. **Traffic smoothing** - Handle spikes without overloading
5. **Async processing** - Long tasks don't block users

---

## 📊 Message Queue Concepts

### Core Components

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Producer   │────►│   Message Queue │────►│   Consumer   │
│              │     │                 │     │              │
│  Sends msgs  │     │  Stores msgs    │     │  Processes   │
│              │     │  until consumed │     │  msgs        │
└──────────────┘     └─────────────────┘     └──────────────┘
```

### Queue vs Topic

```
Queue (Point-to-Point):
├── One message → One consumer
├── Message removed after processing
└── Load balancing across consumers

                ┌─────────────┐
Producer ──────►│    Queue    │──────► Consumer A
                └─────────────┘        (gets message)
                                       Consumer B
                                       (waiting)

Topic (Pub-Sub):
├── One message → All subscribers
├── Each subscriber gets a copy
└── Broadcasting to many

                ┌─────────────┐──────► Consumer A (copy)
Publisher ─────►│    Topic    │──────► Consumer B (copy)
                └─────────────┘──────► Consumer C (copy)
```

---

## 🔧 Message Queue Patterns

### 1. Work Queue (Task Distribution)

```
Distribute tasks across workers:

              ┌─────────────┐
              │    Queue    │
Producer ────►│ ┌─┬─┬─┬─┬─┐ │
              │ │1│2│3│4│5│ │
              │ └─┴─┴─┴─┴─┘ │
              └──────┬──────┘
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    Worker A    Worker B    Worker C
    (gets 1,4)  (gets 2,5)  (gets 3)
```

### 2. Request-Reply

```
Synchronous-style over async:

Client ──request──► Request Queue ──► Server
                                         │
Client ◄──reply──── Reply Queue ◄────────┘

Include correlation ID to match replies
```

### 3. Priority Queue

```
Process important messages first:

Incoming:
├── Order placed (priority: HIGH)
├── Email notification (priority: LOW)
├── Payment (priority: HIGH)
└── Analytics (priority: LOW)

Processing order: Order, Payment, Email, Analytics
```

### 4. Dead Letter Queue (DLQ)

```
Handle failed messages:

Message → Process → Fail
                      │
                      ▼
                    Retry (3 times)
                      │
                      ▼ (still fails)
                Dead Letter Queue
                      │
                      ▼
           Manual investigation
```

---

## 📈 Message Delivery Guarantees

### At-Most-Once

```
Send message → Maybe received, maybe not

Client ──msg──► Queue ──deliver──► Consumer
               No retry

Pros: Simple, fast
Cons: Messages can be lost
Use: Metrics, logs (loss acceptable)
```

### At-Least-Once

```
Send message → Guaranteed delivery, maybe duplicates

Client ──msg──► Queue ──deliver──► Consumer
                  │                   │
                  └──no ACK? retry!───┘

Pros: No message loss
Cons: Duplicates possible
Use: Most applications (with idempotency)
```

### Exactly-Once

```
Send message → Guaranteed delivery, no duplicates

Achieved through:
├── Idempotent consumers
├── Transactional messaging
└── Deduplication

Very hard to achieve perfectly!
Most systems use at-least-once + idempotency
```

---

## 🔧 Making Consumers Idempotent

```python
# Bad: Not idempotent
def process_order(order_id, amount):
    user = get_user(order_id)
    user.balance -= amount  # Duplicate processing = double charge!
    save(user)

# Good: Idempotent
def process_order(order_id, amount):
    # Check if already processed
    if db.exists(f"processed:{order_id}"):
        return "Already processed"
    
    user = get_user(order_id)
    user.balance -= amount
    
    # Mark as processed (atomically)
    with transaction():
        save(user)
        db.set(f"processed:{order_id}", True)
```

---

## 📊 Message Queue Technologies

### Apache Kafka

```
Type: Distributed log / streaming platform
Throughput: Millions of messages/sec
Retention: Configurable (hours to forever)

Best for:
├── Event streaming
├── Log aggregation
├── Real-time analytics
├── Event sourcing
└── High throughput
```

### RabbitMQ

```
Type: Traditional message broker
Protocol: AMQP
Features: Rich routing, exchanges

Best for:
├── Complex routing
├── Request-reply patterns
├── Traditional messaging
└── Lower latency requirements
```

### Amazon SQS

```
Type: Managed queue service
Throughput: Unlimited (scales automatically)
Features: Dead letter queues, FIFO queues

Best for:
├── AWS applications
├── No management overhead
├── Decoupling microservices
└── Simple queue needs
```

### Comparison

| Feature | Kafka | RabbitMQ | SQS |
|---------|-------|----------|-----|
| Throughput | Very High | High | High |
| Latency | Higher | Low | Medium |
| Ordering | Partition-level | Queue-level | FIFO queues |
| Replay | Yes | No | No |
| Management | Complex | Medium | None |
| Persistence | Yes | Yes | Yes |

---

## 🏗️ Kafka Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Kafka Cluster                           │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                  Topic: orders                        │  │
│   │  ┌───────────┐  ┌───────────┐  ┌───────────┐        │  │
│   │  │Partition 0│  │Partition 1│  │Partition 2│        │  │
│   │  │[0,1,2,3] │  │[0,1,2,3] │  │[0,1,2]   │        │  │
│   │  └───────────┘  └───────────┘  └───────────┘        │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
│   Broker 1          Broker 2          Broker 3              │
└─────────────────────────────────────────────────────────────┘

Producers write to partitions
Consumers read from partitions
Partitions spread across brokers
```

### Consumer Groups

```
Topic with 3 partitions
Consumer Group A: 3 consumers (1 partition each)
Consumer Group B: 2 consumers (1 gets 2 partitions)

Group A:               Group B:
├── Consumer 1 → P0    ├── Consumer 1 → P0, P1
├── Consumer 2 → P1    └── Consumer 2 → P2
└── Consumer 3 → P2

Each group gets all messages
Within group, partitions distributed
```

---

## 💡 Message Queue Use Cases

### 1. Order Processing

```
User places order:
1. API → Order Queue (returns immediately)
2. Order Service → validates, saves
3. → Payment Queue
4. Payment Service → charges card
5. → Notification Queue
6. Notification Service → sends email/SMS

Decoupled, each service can fail independently
```

### 2. Email/Notification Sending

```
User action → Notification Queue → Email Worker
                                 → SMS Worker
                                 → Push Worker

Benefits:
├── User doesn't wait for email to send
├── Retry failed sends
├── Rate limit to email providers
└── Scale workers independently
```

### 3. Log Aggregation

```
Server 1 ─┐
Server 2 ─┼──► Kafka ──► Log Processor ──► Elasticsearch
Server 3 ─┘

High throughput, no data loss
```

### 4. Event-Driven Architecture

```
Order Created Event:
├── Inventory Service (reserve items)
├── Analytics Service (track metrics)
├── Recommendation Service (update model)
└── Notification Service (send confirmation)

Each service reacts independently
Add new services without changing existing
```

---

## ⚠️ Message Queue Challenges

### 1. Message Ordering

```
Problem: Messages processed out of order

Solution: Partition by key
hash(order_id) → same partition
All events for order_id in order
```

### 2. Poison Messages

```
Problem: Message that always fails, blocks queue

Solution: 
├── Retry limit (3 attempts)
├── Dead letter queue
├── Circuit breaker
└── Alert for investigation
```

### 3. Consumer Lag

```
Problem: Consumers can't keep up with producers

Solution:
├── Add more consumers
├── Optimize consumer processing
├── Increase partitions
├── Monitor lag metrics
└── Alert on high lag
```

---

## 💡 In System Design Interviews

### When to Use Message Queues

```
1. "We need to decouple the payment service"
2. "User shouldn't wait for email to send"
3. "We need to handle traffic spikes"
4. "Multiple services need to react to events"
5. "Long-running tasks shouldn't block the API"
```

### Key Points to Mention

```
├── Why async? (decoupling, resilience)
├── Which technology? (Kafka for high throughput, SQS for managed)
├── Delivery guarantee? (at-least-once usually)
├── How to handle duplicates? (idempotency)
├── How to handle failures? (DLQ, retries)
└── How to maintain order? (partition key)
```

---

## ✅ Key Takeaways

1. **Queues decouple services** - Independent scaling and failure
2. **At-least-once + idempotency** - Practical delivery guarantee
3. **Kafka for streaming** - High throughput, replay capability
4. **SQS for simple queuing** - Managed, no maintenance
5. **Handle poison messages** - DLQ + monitoring
6. **Partition for ordering** - Same key = same partition
7. **Monitor consumer lag** - Early warning for problems

---

## 📖 Next Steps

→ Continue to [Pub-Sub](./09-pub-sub.md)
