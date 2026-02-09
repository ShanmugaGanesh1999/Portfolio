# Case Studies & Real-World Lessons

> Learn from how top companies solve scale problems

---

## 📚 Overview

This section covers real-world case studies, interview-ready system designs, and system failures to learn from production experiences.

---

## 📖 Contents

### Interview-Ready System Designs (45-min Format)

All case studies follow a consistent **45-minute Principal Architect interview format**:

| # | System | Deep Dive Focus |
|---|--------|-----------------|
| 01 | [Spotify](./01-spotify.md) | Audio Streaming & CDN |
| 02 | [Netflix](./02-netflix.md) | Per-Shot Encoding & Adaptive Bitrate |
| 03 | [ChatGPT / AI Inference](./03-chatgpt.md) | Continuous Batching & Paged Attention |
| 04 | [Ticketmaster](./04-ticketmaster.md) | Virtual Queue & Seat Locking |
| 05 | [System Failures](./05-system-failures.md) | Post-Mortems & Circuit Breakers |

| # | System | Deep Dive Focus |
|---|--------|-----------------|
| 06 | [Rate Limiter](./06-rate-limiter.md) | Sliding Window Counter Algorithm |
| 07 | [TinyURL](./07-tinyurl.md) | Key Generation Service (KGS) |
| 08 | [Twitter](./08-twitter.md) | Fan-out Service (Push/Pull Hybrid) |
| 09 | [Discord](./09-discord.md) | WebSocket Gateway & Pub/Sub |
| 10 | [YouTube](./10-youtube.md) | Video Transcoding Pipeline |
| 11 | [Google Drive](./11-google-drive.md) | Chunking & Deduplication |
| 12 | [Google Maps](./12-google-maps.md) | Routing (A* + Geohashing) |
| 13 | [Key-Value Store](./13-key-value-store.md) | Consistent Hashing & LSM Tree |
| 14 | [Message Queue](./14-message-queue.md) | Broker & ISR Replication |
| 15 | [WhatsApp](./15-whatsapp.md) | Message Delivery & E2E Encryption |
| 16 | [Gmail](./16-gmail.md) | Email Ingestion & Search |
| 17 | [Tinder](./17-tinder.md) | Geolocation Matching & Recommendations |
| 18 | [Parking Lot](./18-parking-lot.md) | OOP Design & State Machine |
| 19 | [Hotstar (Live Streaming)](./19-hotstar.md) | HLS/DASH & Transcoding |
| 20 | [Google Docs](./20-google-docs.md) | Operational Transform (OT) |
| 21 | [Uber](./21-uber.md) | Geospatial Matching & Surge Pricing |
| 22 | [WhatsApp Calling](./22-whatsapp-calling.md) | WebRTC & NAT Traversal |
| 23 | [Zoom](./23-zoom.md) | SFU Architecture & Simulcast |
| 24 | [Recommendation Engine](./24-recommendation-engine.md) | Two-Tower Model & ANN |

---

## 🎯 Interview Format (All 06-24)

Each interview case study follows a consistent **45-minute Principal Architect format**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Section 1: Requirements & Estimation (5 min)                   │
│  • 3 Functional + 3 Non-Functional Requirements                 │
│  • Back-of-envelope calculations                                │
├─────────────────────────────────────────────────────────────────┤
│  Section 2: High-Level Architecture (10 min)                    │
│  • Mermaid diagram with specific technologies                   │
│  • Technology choice justification table                        │
├─────────────────────────────────────────────────────────────────┤
│  Section 3: API & Data Model (10 min)                           │
│  • REST/WebSocket API with JSON examples                        │
│  • SQL/NoSQL schema with partition keys                         │
├─────────────────────────────────────────────────────────────────┤
│  Section 4: Component Deep Dive (15 min)                        │
│  • Algorithm explanation with diagrams                          │
│  • Python pseudocode (10-30 lines)                              │
├─────────────────────────────────────────────────────────────────┤
│  Section 5: Bottlenecks & Trade-offs (5 min)                    │
│  • SPOF table with mitigations                                  │
│  • CAP theorem trade-off analysis                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Why Study Case Studies?

```
1. Real-world constraints
   - Budget, timeline, legacy systems
   - Not greenfield design

2. Trade-offs in practice
   - See actual decisions made
   - Understand why not "ideal"

3. Scale challenges
   - Problems at 10M vs 100M users
   - What breaks and when

4. Learn from failures
   - Post-mortems are gold
   - Avoid same mistakes
```

---

## 📖 Study Path

**For Interview Prep:**
1. Start with [Rate Limiter](./06-rate-limiter.md) (foundational)
2. Progress through core systems (URL Shortener, Twitter, etc.)
3. Practice the 45-minute format

**For Deep Understanding:**
1. Read the real-world case studies first
2. Then explore interview formats for similar systems
3. Focus on the "Component Deep Dive" sections

→ Start with [Rate Limiter](./06-rate-limiter.md) for interview prep
→ Or [Spotify Wrapped](./01-spotify-wrapped.md) for real-world insights
