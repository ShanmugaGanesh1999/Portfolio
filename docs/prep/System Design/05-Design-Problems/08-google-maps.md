# Design Google Maps

> Navigation, routing, and location services

---

## 📋 Problem Statement

Design a mapping and navigation service like Google Maps that provides directions, real-time traffic, and location-based search.

---

## R - Requirements

### Functional Requirements

```
1. Display maps at various zoom levels
2. Calculate routes (driving, walking, transit)
3. Provide turn-by-turn navigation
4. Show real-time traffic conditions
5. Search for places (restaurants, gas stations, etc.)
6. Show ETAs and alternative routes
```

### Non-Functional Requirements

```
1. Low latency map tile loading (<100ms)
2. Accurate traffic data (updated every few minutes)
3. Global coverage
4. Works offline (downloaded maps)
5. Battery efficient for mobile
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────────────────────────────────────┐│
│   │                     CDN (Map Tiles)                     ││
│   └────────────────────────────────────────────────────────┘│
│                            │                                 │
│   ┌────────────────────────┴───────────────────────────────┐│
│   │                   API Gateway                           ││
│   └─────────────────────────┬──────────────────────────────┘│
│                             │                                │
│   ┌──────────┬──────────────┼──────────────┬──────────────┐ │
│   ▼          ▼              ▼              ▼              ▼ │
│ ┌──────┐  ┌──────┐    ┌───────────┐   ┌──────────┐  ┌─────┐│
│ │ Tile │  │Route │    │  Traffic  │   │  Search  │  │ ETA ││
│ │Service│ │Service│   │  Service  │   │  Service │  │ Svc ││
│ └──┬───┘  └──┬───┘    └─────┬─────┘   └────┬─────┘  └──┬──┘│
│    │         │              │              │           │    │
│    ▼         ▼              ▼              ▼           ▼    │
│ ┌──────────────────────────────────────────────────────────┐│
│ │                      Data Layer                           ││
│ │  ┌─────────┐  ┌─────────────┐  ┌─────────┐  ┌──────────┐ ││
│ │  │Map Tiles│  │ Road Graph  │  │ Traffic │  │  Places  │ ││
│ │  │  (CDN)  │  │ (Neo4j/PG)  │  │ (Redis) │  │   (ES)   │ ││
│ │  └─────────┘  └─────────────┘  └─────────┘  └──────────┘ ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Map Tile System

```
┌─────────────────────────────────────────────────────────────┐
│                    Map Tiles                                 │
│                                                              │
│   World divided into tiles at each zoom level:              │
│                                                              │
│   Zoom 0: 1 tile (whole world)                              │
│   Zoom 1: 4 tiles (2×2)                                     │
│   Zoom 2: 16 tiles (4×4)                                    │
│   ...                                                        │
│   Zoom 20: ~1 trillion tiles (very detailed)                │
│                                                              │
│   Each tile: 256×256 pixels                                 │
│   Format: PNG or vector (PBF)                               │
│                                                              │
│   URL: /tiles/{z}/{x}/{y}.png                               │
│   Example: /tiles/15/5241/12345.png                         │
│                                                              │
│   Vector tiles (modern):                                     │
│   ├── Smaller file size                                     │
│   ├── Client-side rendering                                 │
│   ├── Smooth zoom                                           │
│   └── Dynamic styling                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Road Network Graph

```
┌─────────────────────────────────────────────────────────────┐
│              Road Network as Graph                           │
│                                                              │
│   Nodes: Intersections, endpoints                            │
│   Edges: Road segments                                       │
│                                                              │
│   Edge attributes:                                           │
│   ├── Length (meters)                                       │
│   ├── Road type (highway, local)                            │
│   ├── Speed limit                                           │
│   ├── One-way / bidirectional                              │
│   ├── Turn restrictions                                     │
│   └── Current traffic speed                                 │
│                                                              │
│   Storage:                                                   │
│   ├── Graph database (Neo4j) or                            │
│   ├── PostgreSQL with PostGIS or                           │
│   └── Custom format optimized for routing                  │
│                                                              │
│   Global scale: ~1 billion nodes, ~2 billion edges          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Routing Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│              Route Calculation                               │
│                                                              │
│   Algorithms:                                                │
│                                                              │
│   1. Dijkstra's: Simple, works, but slow for long routes   │
│                                                              │
│   2. A* (A-star):                                           │
│      ├── Dijkstra + heuristic (straight-line distance)     │
│      ├── Faster, explores fewer nodes                       │
│      └── Good for shorter routes                            │
│                                                              │
│   3. Contraction Hierarchies (used by Google):              │
│      ├── Pre-compute "shortcuts"                           │
│      ├── Queries run on simplified graph                   │
│      ├── Millisecond responses                              │
│      └── Requires preprocessing (hours)                    │
│                                                              │
│   Edge weight = f(distance, speed_limit, traffic, road_type)│
│                                                              │
│   Multiple routes:                                           │
│   ├── Fastest (default)                                    │
│   ├── Shortest distance                                     │
│   ├── Avoid highways                                        │
│   └── Avoid tolls                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Real-time Traffic

```
┌─────────────────────────────────────────────────────────────┐
│              Traffic Data Sources                            │
│                                                              │
│   Data collection:                                           │
│   ├── GPS from phones (millions of users)                  │
│   ├── Partner data (taxi, delivery fleets)                 │
│   ├── Traffic sensors and cameras                          │
│   └── Historical patterns                                   │
│                                                              │
│   Processing:                                                │
│   1. Aggregate GPS points by road segment                   │
│   2. Calculate average speed                                │
│   3. Compare to free-flow speed                             │
│   4. Classify: Green/Yellow/Red                             │
│   5. Update every 1-2 minutes                               │
│                                                              │
│   Storage:                                                   │
│   ├── Redis for current traffic                            │
│   ├── Time-series DB for historical                        │
│   └── Segment ID → current speed mapping                   │
│                                                              │
│   Traffic prediction:                                        │
│   ├── ML models on historical data                         │
│   ├── Account for time of day, day of week                 │
│   └── Special events, weather                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Place Search

```
┌─────────────────────────────────────────────────────────────┐
│              Place Search                                    │
│                                                              │
│   Index: Elasticsearch with geo queries                     │
│                                                              │
│   Place document:                                            │
│   {                                                          │
│     "place_id": "abc123",                                   │
│     "name": "Starbucks",                                    │
│     "category": ["coffee", "cafe"],                         │
│     "location": {"lat": 37.77, "lng": -122.42},             │
│     "address": "123 Market St",                             │
│     "rating": 4.5,                                          │
│     "hours": {...}                                          │
│   }                                                          │
│                                                              │
│   Query types:                                               │
│   ├── Nearby: "coffee near me" → geo_distance query        │
│   ├── In viewport: Places visible on current map           │
│   └── Text search: "Starbucks San Francisco"               │
│                                                              │
│   Ranking:                                                   │
│   ├── Distance                                              │
│   ├── Relevance to query                                   │
│   ├── Rating and review count                              │
│   └── Personalization (past visits)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary

```
Key Components:
├── Tile Server: Pre-rendered map tiles on CDN
├── Routing Engine: Contraction hierarchies for fast routes
├── Traffic Service: Aggregate GPS data for real-time conditions
├── Search Service: Elasticsearch for place search

Key Decisions:
├── Vector tiles for flexible styling
├── Contraction hierarchies for millisecond routing
├── Crowdsourced traffic data
├── Heavy CDN usage for tiles

Scale:
├── Billions of tile requests/day
├── Millisecond route calculations
├── 1-2 minute traffic updates
├── Global coverage
```

---

## 📖 Next Steps

→ Continue to [Design Yelp](./09-yelp.md)
