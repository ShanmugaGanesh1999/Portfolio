# System Design Mastery

> A comprehensive guide to System Design from fundamentals to real-world examples

## 📚 Course Structure

| Week | Topic | Focus |
|------|-------|-------|
| 1-2 | [Fundamentals](./01-Fundamentals/) | Core concepts, abstractions, consistency models |
| 3-4 | [Non-Functional Requirements](./02-Non-Functional-Requirements/) | Availability, scalability, reliability |
| 5-6 | [Estimation](./03-Estimation/) | Back-of-envelope calculations |
| 7-12 | [Building Blocks](./04-Building-Blocks/) | DNS, Load Balancers, Databases, Caches, Queues |
| 13-16 | [Design Problems](./05-Design-Problems/) | Real system designs (YouTube, Twitter, Uber) |
| 17-18 | [Case Studies](./06-Case-Studies/) | Real-world examples and failures |

---

## 🎯 How to Use This Guide

### For Interview Prep (2-3 months)
1. **Week 1-2**: Master fundamentals and non-functional requirements
2. **Week 3-4**: Study all building blocks thoroughly
3. **Week 5-8**: Practice 2-3 design problems per week
4. **Week 9-12**: Mock interviews and case study analysis

### For Quick Review (1-2 weeks)
1. Read the [Cheatsheet](./CHEATSHEET.md)
2. Review building blocks summaries
3. Practice top 5 design problems

---

## 🏗️ The RESHADED Framework

Use this framework to tackle any System Design problem:

| Letter | Step | Description |
|--------|------|-------------|
| **R** | Requirements | Clarify functional & non-functional requirements |
| **E** | Estimation | Back-of-envelope calculations |
| **S** | Storage Schema | Design data models and schemas |
| **H** | High-Level Design | Draw system architecture |
| **A** | API Design | Define APIs and interfaces |
| **D** | Detailed Design | Deep dive into components |
| **E** | Evaluation | Analyze trade-offs and bottlenecks |
| **D** | Distinctive Features | Handle edge cases and unique aspects |

---

## 📁 Directory Structure

```
System Design/
├── README.md (this file)
├── CHEATSHEET.md
├── 01-Fundamentals/
│   ├── README.md
│   ├── 01-introduction.md
│   ├── 02-abstractions.md
│   ├── 03-network-abstractions-rpc.md
│   ├── 04-consistency-models.md
│   └── 05-failure-models.md
├── 02-Non-Functional-Requirements/
│   ├── README.md
│   ├── 01-availability.md
│   ├── 02-reliability.md
│   ├── 03-scalability.md
│   ├── 04-maintainability.md
│   └── 05-fault-tolerance.md
├── 03-Estimation/
│   ├── README.md
│   ├── 01-numbers-to-know.md
│   └── 02-resource-estimation-examples.md
├── 04-Building-Blocks/
│   ├── README.md
│   ├── 01-dns.md
│   ├── 02-load-balancers.md
│   ├── 03-databases.md
│   ├── 04-key-value-stores.md
│   ├── 05-cdn.md
│   ├── 06-sequencer.md
│   ├── 07-distributed-cache.md
│   ├── 08-message-queues.md
│   ├── 09-pub-sub.md
│   ├── 10-rate-limiter.md
│   ├── 11-blob-store.md
│   ├── 12-distributed-search.md
│   ├── 13-distributed-logging.md
│   ├── 14-distributed-monitoring.md
│   ├── 15-task-scheduler.md
│   └── 16-sharded-counters.md
├── 05-Design-Problems/
│   ├── README.md
│   ├── 01-youtube.md
│   ├── 02-twitter.md
│   ├── 03-instagram.md
│   ├── 04-whatsapp.md
│   ├── 05-uber.md
│   ├── 06-google-maps.md
│   ├── 07-yelp.md
│   ├── 08-tinyurl.md
│   ├── 09-web-crawler.md
│   ├── 10-typeahead.md
│   ├── 11-google-docs.md
│   ├── 12-newsfeed.md
│   ├── 13-quora.md
│   ├── 14-payment-system.md
│   ├── 15-deployment-system.md
│   └── 16-chatgpt.md
└── 06-Case-Studies/
    ├── README.md
    ├── 01-spotify-wrapped.md
    ├── 02-amazon-prime-day.md
    ├── 03-dropbox.md
    ├── 04-ticketmaster.md
    └── 05-system-failures.md
```

---

## 🔑 Key Concepts at a Glance

### Scalability Patterns
- **Horizontal Scaling**: Add more machines
- **Vertical Scaling**: Add more power to existing machines
- **Database Sharding**: Partition data across multiple databases
- **Caching**: Store frequently accessed data in memory
- **Load Balancing**: Distribute traffic across servers

### Data Consistency
- **Strong Consistency**: All nodes see the same data at the same time
- **Eventual Consistency**: All nodes will eventually have the same data
- **Causal Consistency**: Causally related operations are seen in order

### Communication Patterns
- **Synchronous**: Request-Response (REST, gRPC)
- **Asynchronous**: Message Queues, Pub-Sub
- **Real-time**: WebSockets, SSE, Long Polling

---

## 📖 Recommended Study Order

### Beginners
1. Start with [01-Fundamentals](./01-Fundamentals/)
2. Master [02-Non-Functional-Requirements](./02-Non-Functional-Requirements/)
3. Learn estimation in [03-Estimation](./03-Estimation/)
4. Study building blocks one by one

### Intermediate
1. Quick review of fundamentals
2. Deep dive into [04-Building-Blocks](./04-Building-Blocks/)
3. Practice design problems

### Advanced
1. Focus on [05-Design-Problems](./05-Design-Problems/)
2. Study [06-Case-Studies](./06-Case-Studies/)
3. Practice mock interviews

---

## 💡 Tips for Success

1. **Always clarify requirements first** - Don't jump into solutions
2. **Think out loud** - Interviewers want to see your thought process
3. **Start with high-level design** - Then drill into details
4. **Consider trade-offs** - There's no perfect solution
5. **Practice estimation** - Numbers matter in real systems
6. **Know your building blocks** - They're the foundation of every design

---

## 📚 Additional Resources

- [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer)
- [Designing Data-Intensive Applications (Book)](https://dataintensive.net/)
- [High Scalability Blog](http://highscalability.com/)
- [Martin Fowler's Blog](https://martinfowler.com/)
