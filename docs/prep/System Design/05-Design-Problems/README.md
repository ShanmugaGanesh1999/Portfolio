# 05 - Design Problems

> Real-world system design interview questions

---

## 📋 Section Overview

| System | Category | Key Concepts |
|--------|----------|--------------|
| YouTube | Video Platform | CDN, transcoding, streaming |
| Twitter | Social Network | Fan-out, timeline, real-time |
| Instagram | Photo Sharing | Feed, storage, recommendations |
| WhatsApp | Messaging | WebSocket, encryption, delivery |
| Uber | Ride-sharing | Location, matching, real-time |
| Google Maps | Mapping | Geo-spatial, routing, tiles |
| Yelp | Local Search | Geolocation, search, reviews |
| TinyURL | URL Shortener | Hashing, redirect, analytics |
| Web Crawler | Search Engine | Distributed crawling, politeness |
| Typeahead | Autocomplete | Trie, prefix search, ranking |
| Google Docs | Collaboration | CRDT, OT, real-time sync |
| Newsfeed | Content Ranking | Ranking, personalization |
| Quora | Q&A Platform | Ranking, search, recommendations |
| Payment System | Fintech | Transactions, consistency |
| Deployment | DevOps | CI/CD, rollout strategies |
| ChatGPT | AI/LLM | Streaming, token limits, context |

---

## 🎯 RESHADED Framework

Use this framework for every design:

```
R - Requirements
    ├── Functional: What should system do?
    └── Non-functional: Scale, latency, availability

E - Estimation  
    ├── Traffic: QPS, peak load
    ├── Storage: Data size, growth rate
    └── Bandwidth: Network requirements

S - Storage Schema
    ├── Data models
    ├── Database choice
    └── Relationships

H - High-Level Design
    ├── Components
    ├── Data flow
    └── Architecture diagram

A - API Design
    ├── Endpoints
    ├── Request/Response
    └── Authentication

D - Detailed Design
    ├── Deep dive on components
    ├── Algorithms
    └── Trade-offs

E - Evaluation
    ├── Bottlenecks
    ├── Failure scenarios
    └── Scaling strategies

D - Distinctive Features
    ├── What makes this unique
    ├── Edge cases
    └── Future extensions
```

---

## 📚 Contents

| # | Problem | Key Concepts |
|---|---------|--------------|
| 01 | [TinyURL](./01-tinyurl.md) | URL shortening, hashing, base62 |
| 02 | [Twitter](./02-twitter.md) | Fan-out, timeline, Snowflake ID |
| 03 | [Instagram](./03-instagram.md) | Photo CDN, feed, stories |
| 04 | [WhatsApp](./04-whatsapp.md) | WebSocket, E2E encryption |
| 05 | [YouTube](./05-youtube.md) | Video transcoding, streaming |
| 06 | [Newsfeed](./06-newsfeed.md) | Ranking, personalization |
| 07 | [Uber](./07-uber.md) | Geospatial, matching, surge |
| 08 | [Google Maps](./08-google-maps.md) | Tiles, routing, traffic |
| 09 | [Yelp](./09-yelp.md) | Local search, geohash |
| 10 | [Typeahead](./10-typeahead.md) | Trie, autocomplete |
| 11 | [Web Crawler](./11-web-crawler.md) | Distributed crawl, politeness |
| 12 | [Google Docs](./12-google-docs.md) | CRDT, OT, real-time sync |
| 13 | [Quora](./13-quora.md) | Q&A, ranking, feed |
| 14 | [Payment System](./14-payment-system.md) | ACID, idempotency, saga |
| 15 | [Deployment System](./15-deployment-system.md) | CI/CD, canary, rollback |
| 16 | [ChatGPT](./16-chatgpt.md) | LLM serving, streaming |

---

## 📚 Study Order

### Week 1: Core Systems
1. [TinyURL](./01-tinyurl.md) - Entry-level, great for practice
2. [Twitter](./02-twitter.md) - Fan-out, timeline
3. [Instagram](./03-instagram.md) - Media storage

### Week 2: Messaging & Real-time
4. [WhatsApp](./04-whatsapp.md) - Messaging patterns
5. [YouTube](./05-youtube.md) - Video streaming
6. [Newsfeed](./06-newsfeed.md) - Ranking

### Week 3: Location & Search
7. [Uber](./07-uber.md) - Real-time matching
8. [Google Maps](./08-google-maps.md) - Geo-spatial
9. [Yelp](./09-yelp.md) - Local search
10. [Typeahead](./10-typeahead.md) - Autocomplete

### Week 4: Advanced
11. [Web Crawler](./11-web-crawler.md) - Distributed systems
12. [Google Docs](./12-google-docs.md) - Collaboration
13. [Quora](./13-quora.md) - Q&A platform
14. [Payment System](./14-payment-system.md) - Transactions
15. [Deployment System](./15-deployment-system.md) - DevOps
16. [ChatGPT](./16-chatgpt.md) - LLM serving

---

## 🗺️ Design Categories

### Data-Intensive
- YouTube, Instagram: Large media files
- WhatsApp: High message volume
- Twitter: High fan-out

### Real-Time
- Uber: Location matching
- WhatsApp: Message delivery
- Google Docs: Collaboration

### Search & Discovery
- Yelp: Location search
- Typeahead: Prefix search
- Web Crawler: Indexing

### Transactions
- Payment System: Consistency
- Uber: Booking/payment
