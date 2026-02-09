# Design Uber

> Real-time ride matching and dispatch system

---

## 📋 Problem Statement

Design a ride-hailing platform like Uber that matches riders with nearby drivers in real-time, tracks rides, and handles payments.

---

## R - Requirements

### Functional Requirements

```
1. Riders request rides with pickup/dropoff locations
2. Match riders with nearby available drivers
3. Real-time location tracking during ride
4. Fare calculation and payment processing
5. Rating system for riders and drivers
6. Ride history for both parties
7. Driver earnings and payouts
```

### Non-Functional Requirements

```
1. Low latency matching (<30 seconds)
2. Accurate real-time location tracking
3. High availability (24/7 service)
4. Scalable to millions of concurrent users
5. Handle surge pricing dynamically
```

### Capacity Estimation

```
Users:
├── 100M monthly active riders
├── 5M drivers
├── 20M rides per day

Traffic:
├── Ride requests: 20M / 86400 ≈ 230/second
├── Peak: 230 × 10 = 2300/second
├── Location updates: 5M drivers × 1 update/3sec = 1.7M/second

Storage:
├── Each ride: ~2KB metadata
├── Location history: ~100 points/ride × 50 bytes = 5KB
├── Daily: 20M × 7KB = 140GB
```

---

## H - High-Level Design

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌───────────────────────────────────────────────────────┐ │
│   │                   Load Balancer                        │ │
│   └───────────────────────────┬───────────────────────────┘ │
│                               │                              │
│   ┌───────────┬───────────────┼───────────────┬───────────┐ │
│   ▼           ▼               ▼               ▼           ▼ │
│ ┌──────┐  ┌──────┐     ┌───────────┐   ┌──────────┐ ┌─────┐│
│ │ Ride │  │Match │     │  Location │   │ Payment  │ │Trip ││
│ │Service│ │Service│    │  Service  │   │ Service  │ │Svc  ││
│ └──┬───┘  └──┬───┘     └─────┬─────┘   └────┬─────┘ └──┬──┘│
│    │         │               │              │          │    │
│    │         ▼               ▼              │          │    │
│    │  ┌────────────┐  ┌────────────┐        │          │    │
│    │  │  Location  │  │   Kafka    │        │          │    │
│    │  │   Index    │  │ (events)   │        │          │    │
│    │  │ (Geospatial)│ └────────────┘        │          │    │
│    │  └────────────┘                        │          │    │
│    │                                        │          │    │
│    ▼                                        ▼          ▼    │
│ ┌──────────────────────────────────────────────────────────┐│
│ │                      Data Layer                           ││
│ │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  ││
│ │  │ MySQL   │  │  Redis  │  │ Cassandra│ │ Stripe/Pay  │  ││
│ │  │(Rides)  │  │ (Cache) │  │(Location)│ │   Gateway   │  ││
│ │  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## S - Storage Schema

### Data Models

```
Users:
┌─────────────────────────────────────────────────────────────┐
│ user_id      │ BIGINT    │ PRIMARY KEY                      │
│ type         │ ENUM      │ rider/driver                     │
│ name         │ VARCHAR   │                                  │
│ phone        │ VARCHAR   │ UNIQUE                           │
│ email        │ VARCHAR   │ UNIQUE                           │
│ rating       │ DECIMAL   │ 4.85                             │
│ status       │ ENUM      │ active/inactive/banned           │
└─────────────────────────────────────────────────────────────┘

Drivers (extends Users):
┌─────────────────────────────────────────────────────────────┐
│ driver_id    │ BIGINT    │ FK to users                      │
│ vehicle_id   │ BIGINT    │ FK to vehicles                   │
│ license      │ VARCHAR   │                                  │
│ availability │ ENUM      │ online/offline/busy              │
│ current_lat  │ DECIMAL   │                                  │
│ current_lng  │ DECIMAL   │                                  │
│ last_updated │ TIMESTAMP │                                  │
└─────────────────────────────────────────────────────────────┘

Rides:
┌─────────────────────────────────────────────────────────────┐
│ ride_id      │ BIGINT    │ PRIMARY KEY                      │
│ rider_id     │ BIGINT    │ FK                               │
│ driver_id    │ BIGINT    │ FK                               │
│ status       │ ENUM      │ requested/matched/started/done   │
│ pickup_lat   │ DECIMAL   │                                  │
│ pickup_lng   │ DECIMAL   │                                  │
│ dropoff_lat  │ DECIMAL   │                                  │
│ dropoff_lng  │ DECIMAL   │                                  │
│ fare         │ DECIMAL   │ Calculated                       │
│ surge_mult   │ DECIMAL   │ 1.0 = no surge                   │
│ created_at   │ TIMESTAMP │                                  │
│ started_at   │ TIMESTAMP │                                  │
│ completed_at │ TIMESTAMP │                                  │
└─────────────────────────────────────────────────────────────┘

Location_History (Cassandra):
┌─────────────────────────────────────────────────────────────┐
│ ride_id      │ BIGINT    │ Partition Key                    │
│ timestamp    │ TIMESTAMP │ Clustering Key                   │
│ lat          │ DECIMAL   │                                  │
│ lng          │ DECIMAL   │                                  │
│ speed        │ INT       │ mph                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### Location Indexing

```
┌─────────────────────────────────────────────────────────────┐
│                Geospatial Indexing                           │
│                                                              │
│   Challenge: Find drivers near a location quickly           │
│                                                              │
│   Approach 1: Geohash                                        │
│   ├── Encode lat/lng into string prefix                     │
│   ├── Same prefix = nearby                                  │
│   ├── Easy to query "starts with"                          │
│   └── Example: 37.7749, -122.4194 → "9q8yy"                │
│                                                              │
│   Approach 2: Quadtree                                       │
│   ├── Divide space into 4 quadrants recursively            │
│   ├── Efficient for varying density                        │
│   └── More complex implementation                          │
│                                                              │
│   Approach 3: S2/H3 Cells                                   │
│   ├── Divide sphere into hierarchical cells                │
│   ├── Used by Uber (H3) and Google (S2)                    │
│   ├── Handles edge cases better                            │
│   └── Efficient for "nearby" queries                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Geohash Implementation

```python
# Geohash-based location indexing

# Driver goes online
def driver_online(driver_id, lat, lng):
    geohash = encode_geohash(lat, lng, precision=6)  # ~1.2km
    
    # Store in Redis sorted set (score = timestamp)
    redis.zadd(f"drivers:{geohash}", {driver_id: time.time()})
    
    # Store exact location
    redis.geoadd("driver_locations", lng, lat, driver_id)

# Find nearby drivers
def find_nearby_drivers(lat, lng, radius_km=5):
    # Get neighboring geohash cells
    center_hash = encode_geohash(lat, lng, precision=5)
    neighbors = get_geohash_neighbors(center_hash)
    
    candidates = []
    for cell in [center_hash] + neighbors:
        # Get drivers in each cell
        drivers = redis.zrange(f"drivers:{cell}*", 0, -1)
        candidates.extend(drivers)
    
    # Filter by exact distance
    nearby = []
    for driver_id in candidates:
        pos = redis.geopos("driver_locations", driver_id)
        dist = haversine(lat, lng, pos.lat, pos.lng)
        if dist <= radius_km:
            nearby.append((driver_id, dist))
    
    return sorted(nearby, key=lambda x: x[1])
```

### Real-time Location Updates

```
┌─────────────────────────────────────────────────────────────┐
│             Location Update Pipeline                         │
│                                                              │
│   Driver app sends location every 3-5 seconds               │
│                                                              │
│   ┌──────────┐     ┌─────────┐     ┌────────────────┐       │
│   │  Driver  │────►│  Kafka  │────►│ Location       │       │
│   │   App    │     │         │     │ Processor      │       │
│   └──────────┘     └─────────┘     └───────┬────────┘       │
│                                            │                 │
│                           ┌────────────────┼────────────────┐│
│                           ▼                ▼                ▼│
│                    ┌───────────┐    ┌───────────┐    ┌─────┐│
│                    │  Redis    │    │ Cassandra │    │Push ││
│                    │(Geo Index)│    │ (History) │    │to   ││
│                    └───────────┘    └───────────┘    │Rider││
│                                                      └─────┘│
│                                                              │
│   Optimizations:                                             │
│   ├── Only update if moved significantly (>50m)             │
│   ├── Batch updates for history storage                     │
│   ├── WebSocket push to rider only during active ride       │
│   └── Compress location data (delta encoding)               │
└─────────────────────────────────────────────────────────────┘
```

### Matching Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│                  Ride Matching                               │
│                                                              │
│   Rider requests ride:                                       │
│                                                              │
│   1. Find nearby available drivers (geospatial query)       │
│   2. Score each driver                                       │
│   3. Send request to best driver                            │
│   4. Wait for response (20 seconds timeout)                 │
│   5. If declined/timeout → next driver                      │
│   6. Repeat until matched or no drivers                     │
│                                                              │
│   Scoring factors:                                           │
│   ├── Distance to pickup (primary)                          │
│   ├── Driver rating                                         │
│   ├── ETA (considering traffic)                             │
│   ├── Vehicle type match                                    │
│   └── Driver acceptance rate                                │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Score = α(distance) + β(rating) + γ(acceptance)    │   │
│   │                                                      │   │
│   │  Sort by score, offer to top driver first           │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

```python
def match_rider_to_driver(ride_request):
    # Find nearby available drivers
    nearby_drivers = find_nearby_drivers(
        ride_request.pickup_lat,
        ride_request.pickup_lng,
        radius_km=5
    )
    
    # Filter for available drivers
    available = [d for d in nearby_drivers 
                 if get_driver_status(d.id) == 'online']
    
    # Score and sort
    scored = []
    for driver in available:
        score = calculate_match_score(driver, ride_request)
        scored.append((driver, score))
    
    scored.sort(key=lambda x: x[1], reverse=True)
    
    # Offer to drivers in order
    for driver, score in scored:
        response = send_ride_offer(driver.id, ride_request, timeout=20)
        if response == 'accepted':
            return create_match(ride_request, driver)
    
    return None  # No drivers available
```

---

## A - API Design

### Rider APIs

```
# Request ride
POST /api/rides/request
{
    "pickup": {"lat": 37.7749, "lng": -122.4194},
    "dropoff": {"lat": 37.3861, "lng": -122.0839},
    "ride_type": "uberx"
}

Response:
{
    "ride_id": "123",
    "status": "matching",
    "estimated_fare": {"min": 25, "max": 35},
    "surge_multiplier": 1.5
}

# Get ride status
GET /api/rides/{ride_id}
Response:
{
    "ride_id": "123",
    "status": "matched",
    "driver": {
        "id": "456",
        "name": "John",
        "photo": "...",
        "rating": 4.9,
        "vehicle": {"make": "Toyota", "model": "Camry", "plate": "ABC123"}
    },
    "eta_minutes": 5,
    "driver_location": {"lat": 37.77, "lng": -122.42}
}
```

### Driver APIs

```
# Go online/offline
PUT /api/drivers/status
{
    "status": "online"
}

# Update location
POST /api/drivers/location
{
    "lat": 37.7749,
    "lng": -122.4194,
    "heading": 90,
    "speed": 30
}

# Accept/decline ride
POST /api/rides/{ride_id}/respond
{
    "action": "accept"  // or "decline"
}
```

### WebSocket Events

```javascript
// Rider subscribes to ride updates
ws.on('ride_update', {
    ride_id: '123',
    type: 'driver_location',
    data: {lat: 37.77, lng: -122.42}
});

ws.on('ride_update', {
    ride_id: '123',
    type: 'status_change',
    data: {status: 'driver_arrived'}
});

// Driver receives ride offers
ws.on('ride_offer', {
    ride_id: '123',
    pickup: {...},
    dropoff: {...},
    estimated_fare: 25,
    expires_in: 20  // seconds
});
```

---

## D - Detailed Design (Continued)

### Surge Pricing

```
┌─────────────────────────────────────────────────────────────┐
│                  Surge Pricing                               │
│                                                              │
│   Calculate supply/demand ratio per area:                   │
│                                                              │
│   Demand = Recent ride requests in area                     │
│   Supply = Available drivers in area                        │
│                                                              │
│   If demand >> supply → increase prices                     │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                      │   │
│   │   Demand/Supply Ratio    │    Surge Multiplier      │   │
│   │   ─────────────────────────────────────────────────  │   │
│   │           < 1.0          │         1.0x             │   │
│   │         1.0 - 1.5        │         1.25x            │   │
│   │         1.5 - 2.0        │         1.5x             │   │
│   │         2.0 - 3.0        │         2.0x             │   │
│   │           > 3.0          │         2.5x+            │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Implementation:                                            │
│   ├── Divide city into hexagonal cells (H3)                │
│   ├── Count requests and drivers per cell                  │
│   ├── Update surge every 1-2 minutes                       │
│   ├── Show surge on map before booking                     │
│   └── Rider confirms surge before ride                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Fare Calculation

```
┌─────────────────────────────────────────────────────────────┐
│                  Fare Calculation                            │
│                                                              │
│   Base fare formula:                                         │
│                                                              │
│   Fare = Base + (Per Mile × Miles) + (Per Min × Minutes)    │
│         + Booking Fee + Tolls + Tips                         │
│         × Surge Multiplier                                   │
│                                                              │
│   Example rates (UberX):                                    │
│   ├── Base fare: $2.00                                      │
│   ├── Per mile: $1.50                                       │
│   ├── Per minute: $0.25                                     │
│   ├── Booking fee: $2.50                                    │
│   └── Minimum fare: $7.00                                   │
│                                                              │
│   Distance calculated:                                       │
│   ├── Estimated: Routing API before ride                   │
│   ├── Actual: GPS points during ride                       │
│   └── Use actual for final fare                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

```python
def calculate_fare(ride):
    # Get route details
    distance_miles = calculate_distance(ride.location_history)
    duration_minutes = (ride.completed_at - ride.started_at).minutes
    
    # Get rates for ride type and city
    rates = get_rates(ride.ride_type, ride.city)
    
    fare = rates.base_fare
    fare += rates.per_mile * distance_miles
    fare += rates.per_minute * duration_minutes
    fare += rates.booking_fee
    fare += ride.tolls
    
    # Apply surge
    fare *= ride.surge_multiplier
    
    # Apply minimum
    fare = max(fare, rates.minimum_fare)
    
    return round(fare, 2)
```

### Payment Processing

```
┌─────────────────────────────────────────────────────────────┐
│                  Payment Flow                                │
│                                                              │
│   1. Rider requests ride                                     │
│      → Pre-authorize estimated fare on card                 │
│                                                              │
│   2. Ride completes                                          │
│      → Calculate actual fare                                │
│      → Charge rider's card                                  │
│                                                              │
│   3. Split payment                                           │
│      ├── Platform fee: 25%                                  │
│      ├── Driver payout: 75%                                 │
│      └── (minus taxes, insurance, etc.)                     │
│                                                              │
│   4. Driver payout                                           │
│      ├── Instant pay (small fee)                           │
│      └── Weekly direct deposit (free)                       │
│                                                              │
│   Edge cases:                                                │
│   ├── Card declined → retry or use backup                  │
│   ├── Dispute → hold funds, investigate                    │
│   └── Promo codes → apply before charge                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## E - Evaluation

### Bottlenecks

```
1. Location update storm
   → Kafka for ingestion
   → Batch processing
   → Only update if significant movement

2. Matching during surge
   → Pre-compute driver availability
   → Cache nearby drivers
   → Async matching with timeouts

3. Payment failures
   → Retry with exponential backoff
   → Fallback payment methods
   → Hold ride until payment confirmed

4. Real-time tracking
   → WebSocket for active rides only
   → Reduce update frequency when stationary
```

### Failure Handling

```
Driver app crashes during ride:
├── Rider can still see last known location
├── Driver has 2 minutes to reconnect
├── If no reconnect → contact support
└── Fare calculated from last GPS points

Payment system down:
├── Complete ride anyway
├── Queue payment for retry
├── Alert operations team

Matching service down:
├── Fall back to simpler algorithm
├── Increase search radius
├── Accept longer ETAs
```

---

## D - Distinctive Features

### ETA Prediction

```
┌─────────────────────────────────────────────────────────────┐
│                  ETA Prediction                              │
│                                                              │
│   Factors:                                                   │
│   ├── Distance (road network, not straight line)           │
│   ├── Current traffic conditions                           │
│   ├── Historical traffic patterns                          │
│   ├── Time of day, day of week                             │
│   ├── Special events (concerts, sports)                    │
│   └── Weather conditions                                    │
│                                                              │
│   ML Model:                                                  │
│   ├── Input: Origin, destination, time features            │
│   ├── Output: Predicted travel time                        │
│   ├── Training: Historical trip data                       │
│   └── Updated continuously                                  │
│                                                              │
│   Used for:                                                  │
│   ├── Driver arrival estimate                              │
│   ├── Trip duration estimate                               │
│   └── Fare estimation                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Safety Features

```
┌─────────────────────────────────────────────────────────────┐
│                  Safety Systems                              │
│                                                              │
│   Trip sharing:                                              │
│   ├── Share live trip with contacts                        │
│   ├── Real-time location updates                           │
│   └── Notify on arrival                                    │
│                                                              │
│   Emergency button:                                          │
│   ├── One-tap 911 call                                     │
│   ├── Share location with emergency services               │
│   └── Notify Uber safety team                              │
│                                                              │
│   Route monitoring:                                          │
│   ├── Detect significant deviations                        │
│   ├── Alert rider if off-route                             │
│   └── Trigger safety check                                  │
│                                                              │
│   Driver verification:                                       │
│   ├── Background checks                                     │
│   ├── Real-time ID verification                            │
│   └── PIN verification for pickup                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Summary

```
Key Components:
├── Location Service: Geospatial indexing (H3/Geohash)
├── Matching Service: Driver-rider pairing algorithm
├── Pricing Service: Surge calculation, fare estimation
├── Payment Service: Charge rider, pay driver
├── Tracking Service: Real-time location updates

Key Decisions:
├── H3/Geohash for geospatial queries
├── Redis for real-time driver locations
├── Kafka for location update ingestion
├── WebSocket for live tracking
├── Cassandra for location history

Scale:
├── 1.7M location updates/second
├── 2300 ride requests/second at peak
├── 5M concurrent drivers
├── Sub-second matching
```

---

## 📖 Next Steps

→ Continue to [Design Google Maps](./08-google-maps.md)
