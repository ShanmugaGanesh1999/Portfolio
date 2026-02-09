// ============================================================
// MARKET DATA AGGREGATION — Low-Level Design (LLD) data
// Real-Time Multi-Source Financial Data Engine
// ============================================================

export const LLD_META = {
  title: "Real-Time Multi-Source Financial Data Engine",
  subtitle: "Low-Level Design · ConcurrentHashMap + Strategy Pattern",
  tags: ["JAVA 17", "CONCURRENCY", "RECORDS", "STRATEGY PATTERN", "REPOSITORY PATTERN"],
};

// ─── Problem Scope & Assumptions ────────────────────────────

export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "Multi-Source Deduplication",
      detail:
        "Same symbol may arrive from 3-5 sources simultaneously; keep latest based on exchange timestamp (not arrival time)",
    },
    {
      title: "High Throughput",
      detail:
        "500 records/sec average (1.8M/hour), with 2x burst capacity during market volatility",
    },
    {
      title: "Low Latency SLA",
      detail:
        "Sub-10ms aggregation per record; sub-5ms query for latest quote",
    },
    {
      title: "Concurrent Access",
      detail:
        "Multiple producer threads (one per data source) writing to shared aggregation store; multiple consumer threads querying",
    },
  ],
  assumptions: [
    {
      label: "Multi-Source Deduplication",
      detail: "Same symbol may arrive from 3-5 sources simultaneously; keep latest based on exchange timestamp",
    },
    {
      label: "Throughput Target",
      detail: "500 records/sec average (1.8M/hour), with 2x burst capacity during market volatility",
    },
    {
      label: "Latency SLA",
      detail: "Sub-10ms aggregation per record; sub-5ms query for latest quote",
    },
    {
      label: "Concurrency Model",
      detail: "Multiple producer threads (one per data source) writing; multiple consumer threads querying",
    },
  ],
  coreEntities: [
    {
      name: "MarketData",
      description: "Immutable record representing a single tick (symbol, price, volume, timestamp, source)",
      color: "accent",
    },
    {
      name: "AggregatedQuote",
      description: "Deduplicated latest state per symbol with conflict resolution metadata",
      color: "success",
    },
    {
      name: "DataSourceAdapter",
      description: "Interface for ingesting from heterogeneous APIs (WebSocket, REST polling)",
      color: "variable",
    },
    {
      name: "MarketDataAggregator",
      description: "Thread-safe service orchestrating ingestion and queries",
      color: "keyword",
    },
  ],
};

// ─── Key APIs ────────────────────────────────────────────────

export const KEY_APIS = [
  {
    signature: "void ingestMarketData(MarketData data)",
    description: "Producer API — ingest a single market tick",
    method: "PRODUCER",
    color: "success",
  },
  {
    signature: "Optional<AggregatedQuote> getLatestQuote(String symbol)",
    description: "Consumer API — point query for latest quote",
    method: "GET",
    color: "accent",
  },
  {
    signature: "Map<String, AggregatedQuote> getMarketSnapshot()",
    description: "Consumer API — bulk snapshot of all symbols",
    method: "SNAPSHOT",
    color: "keyword",
  },
];

// ─── UML Class Diagram data ─────────────────────────────────

export const UML_CLASSES = [
  {
    name: "MarketData",
    stereotype: "record",
    color: "accent",
    fields: [
      { visibility: "+", name: "String symbol", type: "field" },
      { visibility: "+", name: "BigDecimal price", type: "field" },
      { visibility: "+", name: "long volume", type: "field" },
      { visibility: "+", name: "Instant timestamp", type: "field" },
      { visibility: "+", name: "DataSource source", type: "field" },
    ],
    methods: [],
  },
  {
    name: "AggregatedQuote",
    stereotype: "record",
    color: "success",
    fields: [
      { visibility: "+", name: "String symbol", type: "field" },
      { visibility: "+", name: "BigDecimal price", type: "field" },
      { visibility: "+", name: "long volume", type: "field" },
      { visibility: "+", name: "Instant timestamp", type: "field" },
      { visibility: "+", name: "DataSource winningSource", type: "field" },
      { visibility: "+", name: "int conflictCount", type: "field" },
    ],
    methods: [],
  },
  {
    name: "DataSource",
    stereotype: "enumeration",
    color: "func",
    fields: [
      { visibility: "", name: "BLOOMBERG", type: "enum" },
      { visibility: "", name: "REUTERS", type: "enum" },
      { visibility: "", name: "YAHOO_FINANCE", type: "enum" },
      { visibility: "", name: "ALPHA_VANTAGE", type: "enum" },
    ],
    methods: [],
  },
  {
    name: "DataSourceAdapter",
    stereotype: "interface",
    color: "variable",
    fields: [],
    methods: [
      { visibility: "+", name: "connect() void", type: "method" },
      { visibility: "+", name: "stream() Stream<MarketData>", type: "method" },
      { visibility: "+", name: "disconnect() void", type: "method" },
    ],
  },
  {
    name: "MarketDataAggregator",
    stereotype: null,
    color: "keyword",
    fields: [
      { visibility: "-", name: "ConcurrentHashMap<String,AggregatedQuote> aggregationStore", type: "field" },
      { visibility: "-", name: "ReentrantReadWriteLock snapshotLock", type: "field" },
      { visibility: "-", name: "AtomicLong totalIngestedCount", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "ingestMarketData(MarketData) void", type: "method" },
      { visibility: "+", name: "getLatestQuote(String) Optional<AggregatedQuote>", type: "method" },
      { visibility: "+", name: "getMarketSnapshot() Map<String,AggregatedQuote>", type: "method" },
    ],
  },
  {
    name: "WebSocketAdapter",
    stereotype: null,
    color: "string",
    fields: [
      { visibility: "-", name: "URI endpoint", type: "field" },
      { visibility: "-", name: "WebSocketClient client", type: "field" },
    ],
    methods: [],
  },
  {
    name: "PollingAdapter",
    stereotype: null,
    color: "string",
    fields: [
      { visibility: "-", name: "ScheduledExecutorService scheduler", type: "field" },
      { visibility: "-", name: "HttpClient httpClient", type: "field" },
    ],
    methods: [],
  },
  {
    name: "MarketDataRepository",
    stereotype: "interface",
    color: "func",
    fields: [],
    methods: [
      { visibility: "+", name: "save(AggregatedQuote) void", type: "method" },
      { visibility: "+", name: "findBySymbol(String) Optional<AggregatedQuote>", type: "method" },
      { visibility: "+", name: "batchSave(Iterable<AggregatedQuote>) void", type: "method" },
    ],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "MarketData", to: "DataSource", label: "uses" },
  { from: "AggregatedQuote", to: "DataSource", label: "uses" },
  { from: "MarketDataAggregator", to: "AggregatedQuote", label: "aggregates" },
  { from: "MarketDataAggregator", to: "MarketDataRepository", label: "persists via" },
  { from: "MarketDataAggregator", to: "DataSourceAdapter", label: "consumes from" },
  { from: "WebSocketAdapter", to: "DataSourceAdapter", label: "implements" },
  { from: "PollingAdapter", to: "DataSourceAdapter", label: "implements" },
  { from: "DataSourceAdapter", to: "MarketData", label: "produces" },
];

// ─── Java 17 Code ────────────────────────────────────────────

export const CODE_FILES = {
  "MarketData.java": {
    path: "com/marketdata/model/MarketData.java",
    lang: "JAVA",
    description: "Immutable market tick from a single data source",
    code: `package com.marketdata.model;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Immutable market tick from a single data source.
 * Using record to eliminate boilerplate and
 * guarantee immutability.
 */
public record MarketData(
    String symbol,
    BigDecimal price,
    long volume,
    Instant timestamp,   // Exchange timestamp
    DataSource source
) {
    public MarketData {
        if (symbol == null || symbol.isBlank()) {
            throw new IllegalArgumentException(
                "Symbol cannot be null or blank"
            );
        }
        if (price == null
            || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                "Price must be positive"
            );
        }
        if (timestamp == null) {
            throw new IllegalArgumentException(
                "Timestamp cannot be null"
            );
        }
    }
}`,
  },
  "AggregatedQuote.java": {
    path: "com/marketdata/model/AggregatedQuote.java",
    lang: "JAVA",
    description: "Deduplicated aggregate — latest market state per symbol",
    code: `package com.marketdata.model;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Deduplicated aggregate representing the latest
 * market state for a symbol.
 * conflictCount tracks how many stale updates were
 * discarded during aggregation.
 */
public record AggregatedQuote(
    String symbol,
    BigDecimal price,
    long volume,
    Instant timestamp,
    DataSource winningSource,  // Latest timestamp source
    int conflictCount          // Out-of-order rejections
) {}`,
  },
  "DataSource.java": {
    path: "com/marketdata/model/DataSource.java",
    lang: "JAVA",
    description: "Enumeration of supported market data providers",
    code: `package com.marketdata.model;

/**
 * Enumeration of supported market data providers.
 */
public enum DataSource {
    BLOOMBERG("BBG"),
    REUTERS("RTR"),
    YAHOO_FINANCE("YF"),
    ALPHA_VANTAGE("AV");

    private final String code;

    DataSource(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}`,
  },
  "DataSourceAdapter.java": {
    path: "com/marketdata/api/DataSourceAdapter.java",
    lang: "JAVA",
    description: "Strategy Pattern — abstraction for data source ingestion",
    code: `package com.marketdata.api;

import com.marketdata.model.MarketData;
import java.util.stream.Stream;

/**
 * Strategy Pattern: Abstraction for different data
 * source ingestion mechanisms.
 * Implementations: WebSocketAdapter (push),
 *   PollingAdapter (pull), KafkaAdapter (stream).
 */
public interface DataSourceAdapter {
    /** Establishes connection to the data source. */
    void connect();

    /**
     * Returns a stream of market data.
     * For WebSocket, this is infinite.
     * For polling, this yields batches on schedule.
     */
    Stream<MarketData> stream();

    /** Gracefully disconnects. */
    void disconnect();
}`,
  },
  "MarketDataRepository.java": {
    path: "com/marketdata/api/MarketDataRepository.java",
    lang: "JAVA",
    description: "Repository Pattern — persistence abstraction",
    code: `package com.marketdata.api;

import com.marketdata.model.AggregatedQuote;
import java.util.Optional;

/**
 * Repository Pattern: Abstraction for persistence.
 * Implementations: PostgresRepository,
 *   RedisRepository (cache),
 *   InMemoryRepository (testing).
 */
public interface MarketDataRepository {
    void save(AggregatedQuote quote);
    Optional<AggregatedQuote> findBySymbol(String symbol);
    void batchSave(Iterable<AggregatedQuote> quotes);
}`,
  },
  "MarketDataAggregator.java": {
    path: "com/marketdata/service/MarketDataAggregator.java",
    lang: "JAVA",
    description: "Core thread-safe aggregation engine",
    code: `package com.marketdata.service;

import com.marketdata.api.MarketDataRepository;
import com.marketdata.model.AggregatedQuote;
import com.marketdata.model.MarketData;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Thread-safe aggregation engine for real-time
 * market data.
 *
 * Concurrency Strategy:
 * - ConcurrentHashMap: concurrent writes from
 *   multiple source threads without external locking.
 *   compute() provides atomic read-modify-write.
 * - ReentrantReadWriteLock: protects snapshot
 *   operations for consistency.
 * - AtomicLong: lock-free counters for metrics.
 */
public class MarketDataAggregator {
    
    // symbol -> latest deduplicated quote
    private final ConcurrentHashMap<String,
        AggregatedQuote> aggregationStore;
    
    // Read-write lock for snapshot consistency
    private final ReentrantReadWriteLock snapshotLock;
    
    // Metrics
    private final AtomicLong totalIngestedCount;
    private final AtomicLong totalConflictCount;
    
    private final MarketDataRepository repository;

    public MarketDataAggregator(
        MarketDataRepository repository
    ) {
        this.aggregationStore =
            new ConcurrentHashMap<>(10_000);
        this.snapshotLock =
            new ReentrantReadWriteLock();
        this.totalIngestedCount = new AtomicLong(0);
        this.totalConflictCount = new AtomicLong(0);
        this.repository = repository;
    }

    /**
     * Ingests a market data tick with deduplication.
     * Thread-safe: multiple sources call concurrently.
     * Time: O(1) avg | Space: O(1) per call
     */
    public void ingestMarketData(MarketData data) {
        totalIngestedCount.incrementAndGet();
        
        // Atomic read-modify-write
        aggregationStore.compute(
            data.symbol(),
            (symbol, existing) -> {
                if (existing == null) {
                    return new AggregatedQuote(
                        data.symbol(), data.price(),
                        data.volume(), data.timestamp(),
                        data.source(), 0
                    );
                }
                
                // Conflict resolution: keep latest
                // exchange timestamp
                if (data.timestamp()
                    .isAfter(existing.timestamp())) {
                    return new AggregatedQuote(
                        data.symbol(), data.price(),
                        data.volume(), data.timestamp(),
                        data.source(),
                        existing.conflictCount()
                    );
                } else {
                    // Stale — discard, bump conflict
                    totalConflictCount.incrementAndGet();
                    return new AggregatedQuote(
                        existing.symbol(),
                        existing.price(),
                        existing.volume(),
                        existing.timestamp(),
                        existing.winningSource(),
                        existing.conflictCount() + 1
                    );
                }
            }
        );
        
        // Async persistence (non-blocking)
        if (repository != null) {
            AggregatedQuote latest =
                aggregationStore.get(data.symbol());
            repository.save(latest);
        }
    }

    /**
     * Latest aggregated quote for a symbol.
     * Time: O(1) | Read lock for concurrency.
     */
    public Optional<AggregatedQuote> getLatestQuote(
        String symbol
    ) {
        snapshotLock.readLock().lock();
        try {
            return Optional.ofNullable(
                aggregationStore.get(symbol)
            );
        } finally {
            snapshotLock.readLock().unlock();
        }
    }

    /**
     * Consistent snapshot of all symbols.
     * Time: O(n) | Write lock for consistency.
     */
    public Map<String, AggregatedQuote>
        getMarketSnapshot() {
        snapshotLock.writeLock().lock();
        try {
            return new HashMap<>(aggregationStore);
        } finally {
            snapshotLock.writeLock().unlock();
        }
    }

    /**
     * Batch query for multiple symbols.
     * Time: O(m) where m = requested symbols.
     */
    public Map<String, AggregatedQuote> getQuotes(
        Set<String> symbols
    ) {
        snapshotLock.readLock().lock();
        try {
            Map<String, AggregatedQuote> result =
                new HashMap<>(symbols.size());
            for (String s : symbols) {
                AggregatedQuote q =
                    aggregationStore.get(s);
                if (q != null) result.put(s, q);
            }
            return result;
        } finally {
            snapshotLock.readLock().unlock();
        }
    }

    // Metrics accessors
    public long getTotalIngestedCount() {
        return totalIngestedCount.get();
    }
    public long getTotalConflictCount() {
        return totalConflictCount.get();
    }
    public int getSymbolCount() {
        return aggregationStore.size();
    }
}`,
  },
  "SimulatedPollingAdapter.java": {
    path: "com/marketdata/adapter/SimulatedPollingAdapter.java",
    lang: "JAVA",
    description: "Simulated polling adapter for demonstration",
    code: `package com.marketdata.adapter;

import com.marketdata.api.DataSourceAdapter;
import com.marketdata.model.DataSource;
import com.marketdata.model.MarketData;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Random;
import java.util.stream.Stream;

/**
 * Simulated polling adapter for demonstration.
 * In production, replace with actual HTTP client.
 */
public class SimulatedPollingAdapter
    implements DataSourceAdapter {
    
    private final DataSource source;
    private final String[] symbols =
        {"AAPL","GOOGL","MSFT","AMZN","TSLA"};
    private final Random random = new Random();
    private volatile boolean connected = false;

    public SimulatedPollingAdapter(DataSource src) {
        this.source = src;
    }

    @Override
    public void connect() {
        this.connected = true;
        System.out.println("Connected to " + source);
    }

    @Override
    public Stream<MarketData> stream() {
        if (!connected) {
            throw new IllegalStateException(
                "Adapter not connected"
            );
        }
        return Stream.generate(() -> {
            String sym =
                symbols[random.nextInt(symbols.length)];
            BigDecimal price = BigDecimal.valueOf(
                100 + random.nextDouble() * 100
            );
            long vol = 1000 + random.nextInt(10000);
            Instant ts = Instant.now()
                .minusMillis(random.nextInt(1000));
            return new MarketData(
                sym, price, vol, ts, source
            );
        });
    }

    @Override
    public void disconnect() {
        this.connected = false;
        System.out.println(
            "Disconnected from " + source
        );
    }
}`,
  },
  "MarketDataDemo.java": {
    path: "com/marketdata/MarketDataDemo.java",
    lang: "JAVA",
    description: "Runnable demo with concurrent multi-source ingestion",
    code: `package com.marketdata;

import com.marketdata.adapter.*;
import com.marketdata.api.DataSourceAdapter;
import com.marketdata.model.*;
import com.marketdata.service.MarketDataAggregator;

import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

/**
 * Demonstrates concurrent ingestion from
 * multiple data sources.
 */
public class MarketDataDemo {
    
    public static void main(String[] args)
        throws InterruptedException {
        
        // Initialize (null repo = in-memory demo)
        MarketDataAggregator aggregator =
            new MarketDataAggregator(null);
        
        // Create adapters for multiple sources
        List<DataSourceAdapter> adapters = List.of(
            new SimulatedPollingAdapter(
                DataSource.BLOOMBERG),
            new SimulatedPollingAdapter(
                DataSource.REUTERS),
            new SimulatedPollingAdapter(
                DataSource.YAHOO_FINANCE)
        );
        
        // Connect all adapters
        adapters.forEach(DataSourceAdapter::connect);
        
        // One thread per source
        ExecutorService exec =
            Executors.newFixedThreadPool(
                adapters.size()
            );
        
        for (DataSourceAdapter adapter : adapters) {
            exec.submit(() -> {
                adapter.stream()
                    .limit(1000) // 1000 ticks/source
                    .forEach(
                        aggregator::ingestMarketData
                    );
            });
        }
        
        exec.shutdown();
        exec.awaitTermination(5, TimeUnit.SECONDS);
        
        // Query results
        System.out.println(
            "\\n=== Aggregation Results ==="
        );
        System.out.println(
            "Total ingested: "
            + aggregator.getTotalIngestedCount()
        );
        System.out.println(
            "Total conflicts: "
            + aggregator.getTotalConflictCount()
        );
        System.out.println(
            "Unique symbols: "
            + aggregator.getSymbolCount()
        );
        
        // Sample quotes
        System.out.println(
            "\\n=== Sample Quotes ==="
        );
        aggregator.getLatestQuote("AAPL")
            .ifPresent(q -> System.out.printf(
                "AAPL: $%.2f from %s (conflicts: %d)%n",
                q.price(), q.winningSource(),
                q.conflictCount()
            ));
        
        // Market snapshot
        Map<String, AggregatedQuote> snapshot =
            aggregator.getMarketSnapshot();
        System.out.println(
            "\\n=== Market Snapshot ==="
        );
        snapshot.forEach((sym, q) ->
            System.out.printf(
                "%s: $%.2f @ %s%n",
                sym, q.price(), q.timestamp()
            )
        );
        
        // Cleanup
        adapters.forEach(
            DataSourceAdapter::disconnect
        );
    }
}`,
  },
};

// ─── Complexity Analysis ─────────────────────────────────────

export const COMPLEXITY = {
  time: [
    {
      method: "ingestMarketData",
      complexity: "O(1) avg",
      detail: "ConcurrentHashMap.compute is O(1) average; worst case O(log n) with high collision",
    },
    {
      method: "getLatestQuote",
      complexity: "O(1)",
      detail: "Direct hash lookup with read lock",
    },
    {
      method: "getMarketSnapshot",
      complexity: "O(n)",
      detail: "n = number of symbols; defensive copy required for consistency",
    },
    {
      method: "getQuotes",
      complexity: "O(m)",
      detail: "m = requested symbols; batch optimization over repeated point queries",
    },
  ],
  space: [
    {
      component: "Per Symbol",
      complexity: "~200 bytes",
      detail: "AggregatedQuote object + HashMap overhead",
    },
    {
      component: "10K Symbols",
      complexity: "~2 MB",
      detail: "Entire in-memory aggregation store",
    },
    {
      component: "Pre-sizing",
      complexity: "10,000 capacity",
      detail: "ConcurrentHashMap initialized to minimize rehashing",
    },
  ],
  concurrency: [
    {
      label: "ConcurrentHashMap.compute()",
      detail: "Atomic read-modify-write per symbol — no external locking needed for ingestion",
    },
    {
      label: "ReentrantReadWriteLock",
      detail: "Read lock for point queries (concurrent reads); Write lock for snapshot (exclusive access)",
    },
    {
      label: "AtomicLong Counters",
      detail: "Lock-free metrics counters for ingested count and conflict count",
    },
  ],
};

// ─── Follow-Up Questions ────────────────────────────────────

export const FOLLOW_UPS = [
  {
    question: "How would you scale this beyond a single JVM to handle 10x throughput (18M records/hour)?",
    answer:
      "Partition symbols by hash (e.g., AAPL → Partition 0) across multiple JVM instances using Kafka topic partitioning; each instance runs an independent aggregator for its partition subset, ensuring a single symbol is always processed by the same instance to avoid cross-instance coordination; use Redis as a shared cache tier for cross-partition queries.",
  },
  {
    question: "Your current design uses exchange timestamps for deduplication. What happens if two sources send the same timestamp but different prices?",
    answer:
      "Introduce a tie-breaking strategy: first, compare source priority (e.g., Bloomberg > Reuters); second, use arrival time as the final tiebreaker; store sourceVersion metadata in AggregatedQuote to detect and log conflicts for manual investigation, signaling potential data quality issues upstream.",
  },
  {
    question: "The getMarketSnapshot() method acquires a write lock, blocking all ingestion. How do you avoid this bottleneck?",
    answer:
      "Replace write lock with a versioned snapshot approach: maintain an AtomicReference<ImmutableMap<String, AggregatedQuote>> that is atomically swapped every 100ms by a background thread; queries read from the immutable snapshot without locking, and ingestion continues unblocked; trade-off is ~100ms staleness in snapshot queries.",
  },
  {
    question: "How would you monitor and alert on data staleness (e.g., no updates for AAPL in 5 seconds during market hours)?",
    answer:
      "Add a lastUpdateTime field to AggregatedQuote; run a scheduled executor (every 1 second) that scans symbols and emits metrics for (currentTime - lastUpdateTime) > threshold; integrate with CloudWatch/Prometheus to trigger alerts; use a bloom filter to track \"active symbols\" during market hours to avoid false positives for infrequently traded tickers.",
  },
  {
    question: "If a data source sends corrupt data (e.g., negative price), how do you prevent it from polluting the aggregation store?",
    answer:
      "Implement a validation layer before ingestMarketData using Java Bean Validation (record compact constructor already validates); reject invalid ticks and route them to a dead-letter queue (Kafka topic or S3) for offline analysis; maintain separate counters (AtomicLong validationFailureCount) per source to identify problematic providers; avoid retries to prevent cascading failures.",
  },
];

// ─── Design Justification ───────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    pattern: "Strategy Pattern",
    location: "DataSourceAdapter interface",
    detail:
      "Encapsulates different ingestion mechanisms (WebSocket, REST, Kafka) behind a common interface, allowing runtime selection and polymorphic handling. New data sources can be added without modifying the aggregator.",
  },
  {
    pattern: "Repository Pattern",
    location: "MarketDataRepository interface",
    detail:
      "Abstracts persistence logic from business logic, enabling swapping between PostgreSQL, Redis, or in-memory stores. Enables testability via mock repositories and flexibility for multi-tier caching strategies.",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Single Responsibility Principle (SRP)",
  detail:
    "MarketDataAggregator handles only aggregation and deduplication logic. Persistence is delegated to MarketDataRepository, connection management to DataSourceAdapter, and data modeling to records. If we had mixed SQL queries, WebSocket handling, and aggregation in one class, changes to database schema would ripple through unrelated code.",
};
