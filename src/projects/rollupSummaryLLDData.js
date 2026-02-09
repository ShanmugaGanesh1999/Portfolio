// ============================================================
// ROLLUP SUMMARY — Low-Level Design (LLD) data
// Real-Time Rollup Summary Engine (Kafka + Redis)
// ============================================================

export const LLD_META = {
  title: "Real-Time Rollup Summary Engine",
  subtitle: "Low-Level Design · Kafka + Redis",
  tags: ["JAVA 17", "KAFKA", "REDIS", "CONCURRENCY", "RECORDS"],
};

// ─── Problem Scope & Assumptions ────────────────────────────

export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "Real-Time Aggregation",
      detail:
        "Aggregate child records (invoices, contacts, deals) to parent (Account) in real-time",
    },
    {
      title: "Multi-Function Support",
      detail:
        "Support Sum, Count, Average, Max, Min, Earliest/Latest date operations",
    },
    {
      title: "High Throughput",
      detail:
        "Handle 6,500+ aggregations/week with <3s latency",
    },
    {
      title: "Thread Safety",
      detail:
        "Thread-safe concurrent updates when child records change",
    },
  ],
  assumptions: [
    {
      label: "Event-Driven Architecture",
      detail: "Kafka streams child record events (CREATE/UPDATE/DELETE)",
    },
    {
      label: "Cache-First Strategy",
      detail: "Redis stores computed rollups; DB is source of truth",
    },
    {
      label: "Eventual Consistency",
      detail: "5-second window for rollup convergence acceptable",
    },
    {
      label: "Bounded Cardinality",
      detail: "Max 10,000 child records per parent entity",
    },
  ],
  coreEntities: [
    {
      name: "RollupDefinition",
      description: "Configuration (parentModule, childModule, aggregateField, function)",
      color: "accent",
    },
    {
      name: "RollupEvent",
      description: "Kafka message payload (entityId, operation, changedFields)",
      color: "success",
    },
    {
      name: "AggregatedResult",
      description: "Cached rollup value with metadata (timestamp, recordCount)",
      color: "variable",
    },
  ],
};

// ─── Key APIs ────────────────────────────────────────────────

export const KEY_APIS = [
  {
    signature: "void processRollupEvent(RollupEvent event)",
    description: "Kafka consumer entry point",
    method: "CONSUMER",
    color: "success",
  },
  {
    signature: "AggregatedResult getRollup(String parentId, String field)",
    description: "Retrieval API",
    method: "GET",
    color: "accent",
  },
  {
    signature: "void refreshRollup(String parentId, String field)",
    description: "Manual recalculation",
    method: "POST",
    color: "keyword",
  },
];

// ─── UML Class Diagram data ─────────────────────────────────

export const UML_CLASSES = [
  {
    name: "RollupEngine",
    stereotype: null,
    color: "keyword",
    fields: [
      { visibility: "-", name: "RedisTemplate redis", type: "field" },
      { visibility: "-", name: "RollupRepository repo", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "processRollupEvent(RollupEvent)", type: "method" },
      { visibility: "+", name: "getRollup(String, String)", type: "method" },
    ],
  },
  {
    name: "RollupDefinition",
    stereotype: "record",
    color: "accent",
    fields: [
      { visibility: "+", name: "String id", type: "field" },
      { visibility: "+", name: "String parentModule", type: "field" },
      { visibility: "+", name: "String childModule", type: "field" },
      { visibility: "+", name: "AggregateFunction function", type: "field" },
    ],
    methods: [],
  },
  {
    name: "RollupEvent",
    stereotype: "record",
    color: "success",
    fields: [
      { visibility: "+", name: "String entityId", type: "field" },
      { visibility: "+", name: "Operation operation", type: "field" },
      { visibility: "+", name: "Map<String,Object> changedFields", type: "field" },
    ],
    methods: [],
  },
  {
    name: "AggregatedResult",
    stereotype: "record",
    color: "variable",
    fields: [
      { visibility: "+", name: "Object value", type: "field" },
      { visibility: "+", name: "long recordCount", type: "field" },
      { visibility: "+", name: "Instant lastUpdated", type: "field" },
    ],
    methods: [],
  },
  {
    name: "AggregateFunction",
    stereotype: "enumeration",
    color: "func",
    fields: [
      { visibility: "", name: "SUM", type: "enum" },
      { visibility: "", name: "COUNT", type: "enum" },
      { visibility: "", name: "AVERAGE", type: "enum" },
      { visibility: "", name: "MAX", type: "enum" },
      { visibility: "", name: "MIN", type: "enum" },
    ],
    methods: [],
  },
  {
    name: "RedisCache",
    stereotype: null,
    color: "keyword",
    fields: [
      { visibility: "-", name: "ConcurrentHashMap<String,ReentrantLock> locks", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "computeIfAbsent(String, Function)", type: "method" },
      { visibility: "+", name: "invalidate(String)", type: "method" },
    ],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "RollupEngine", to: "RollupDefinition", label: "uses" },
  { from: "RollupEngine", to: "RollupEvent", label: "consumes" },
  { from: "RollupEngine", to: "AggregatedResult", label: "produces" },
  { from: "RollupEngine", to: "RedisCache", label: "delegates" },
  { from: "RollupDefinition", to: "AggregateFunction", label: "contains" },
];

// ─── Java 17 Code ────────────────────────────────────────────

export const CODE_FILES = {
  "RollupDefinition.java": {
    path: "model/RollupDefinition.java",
    lang: "JAVA",
    description: "Configuration record for rollup field definitions",
    code: `package model;

public record RollupDefinition(
    String id,
    String parentModule,      // e.g., "Account"
    String childModule,       // e.g., "Invoice"
    String aggregateField,    // e.g., "amount"
    AggregateFunction function,
    String criteriaFilter     // Optional: "status = 'paid'"
) {}

enum AggregateFunction {
    SUM, COUNT, AVERAGE, MAX, MIN, EARLIEST, LATEST
}`,
  },
  "RollupEvent.java": {
    path: "model/RollupEvent.java",
    lang: "JAVA",
    description: "Kafka message payload record",
    code: `package model;

import java.util.Map;

public record RollupEvent(
    String entityId,          // Child record ID
    String module,            // "Invoice"
    Operation operation,      // CREATE/UPDATE/DELETE
    Map<String, Object> changedFields
) {}

enum Operation { CREATE, UPDATE, DELETE }`,
  },
  "AggregatedResult.java": {
    path: "model/AggregatedResult.java",
    lang: "JAVA",
    description: "Cached rollup value with metadata",
    code: `package model;

import java.time.Instant;

public record AggregatedResult(
    Object value,             // BigDecimal for SUM, Long for COUNT, etc.
    long recordCount,
    Instant lastUpdated
) {}`,
  },
  "RollupService.java": {
    path: "api/RollupService.java",
    lang: "JAVA",
    description: "Service interface defining rollup operations",
    code: `package api;

import model.*;

public interface RollupService {
    void processRollupEvent(RollupEvent event);
    AggregatedResult getRollup(String parentId, String rollupField);
    void refreshRollup(String parentId, String rollupField); // Batch recalc
}`,
  },
  "RollupEngine.java": {
    path: "service/RollupEngine.java",
    lang: "JAVA",
    description: "Core aggregation engine with thread-safe caching",
    code: `package service;

import api.RollupService;
import model.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;

public class RollupEngine implements RollupService {
    
    // Thread-safe cache: parentId:rollupField -> AggregatedResult
    // ConcurrentHashMap chosen over synchronized map for better
    // read concurrency
    private final ConcurrentHashMap<String, AggregatedResult> cache
        = new ConcurrentHashMap<>();
    
    // Per-parent locks to prevent race conditions during aggregation
    // ReentrantLock over synchronized block for try-lock timeout
    private final ConcurrentHashMap<String, ReentrantLock> locks
        = new ConcurrentHashMap<>();
    
    private final RollupRepository repository; // DB access
    private final Map<String, RollupDefinition> definitions; // Config
    
    public RollupEngine(
        RollupRepository repository,
        List<RollupDefinition> defs
    ) {
        this.repository = repository;
        this.definitions = defs.stream()
            .collect(Collectors.toMap(
                RollupDefinition::id, d -> d
            ));
    }
    
    @Override
    public void processRollupEvent(RollupEvent event) {
        // Strategy Pattern: Find applicable rollup definitions
        definitions.values().stream()
            .filter(def ->
                def.childModule().equals(event.module())
            )
            .forEach(def -> updateRollup(event, def));
    }
    
    private void updateRollup(
        RollupEvent event, RollupDefinition def
    ) {
        String parentId = repository.getParentId(
            event.entityId(), def.parentModule()
        );
        String cacheKey = parentId + ":" + def.id();
        
        // Acquire lock for this parent to ensure
        // atomic read-modify-write
        ReentrantLock lock = locks.computeIfAbsent(
            cacheKey, k -> new ReentrantLock()
        );
        
        try {
            // tryLock with timeout to avoid deadlock
            if (!lock.tryLock(500, TimeUnit.MILLISECONDS)) {
                throw new IllegalStateException(
                    "Failed to acquire lock for " + cacheKey
                );
            }
            
            try {
                // Fetch child records (apply filter if present)
                List<Map<String, Object>> children =
                    repository.getChildRecords(
                        parentId,
                        def.childModule(),
                        def.criteriaFilter()
                    );
                
                // Template Method Pattern: Delegate to
                // function-specific aggregator
                Object aggregatedValue =
                    aggregate(children, def);
                
                AggregatedResult result =
                    new AggregatedResult(
                        aggregatedValue,
                        children.size(),
                        Instant.now()
                    );
                
                // Update cache and persist to DB
                // (write-through strategy)
                cache.put(cacheKey, result);
                repository.saveRollup(
                    parentId, def.id(), result
                );
                
            } finally {
                lock.unlock();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(
                "Interrupted while acquiring lock", e
            );
        }
    }
    
    private Object aggregate(
        List<Map<String, Object>> records,
        RollupDefinition def
    ) {
        String field = def.aggregateField();
        
        return switch (def.function()) {
            case SUM -> records.stream()
                .map(r -> (BigDecimal) r.get(field))
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            case COUNT -> (long) records.size();
            
            case AVERAGE -> {
                BigDecimal sum = (BigDecimal) aggregate(
                    records,
                    new RollupDefinition(
                        def.id(),
                        def.parentModule(),
                        def.childModule(),
                        field,
                        AggregateFunction.SUM,
                        def.criteriaFilter()
                    )
                );
                yield records.isEmpty()
                    ? BigDecimal.ZERO
                    : sum.divide(
                        BigDecimal.valueOf(records.size()),
                        2, BigDecimal.ROUND_HALF_UP
                      );
            }
            
            case MAX -> records.stream()
                .map(r -> (Comparable) r.get(field))
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);
                
            case MIN -> records.stream()
                .map(r -> (Comparable) r.get(field))
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null);
                
            case EARLIEST, LATEST -> records.stream()
                .map(r -> (Instant) r.get(field))
                .filter(Objects::nonNull)
                .sorted(
                    def.function() ==
                        AggregateFunction.EARLIEST
                        ? Comparator.naturalOrder()
                        : Comparator.reverseOrder()
                )
                .findFirst()
                .orElse(null);
        };
    }
    
    @Override
    public AggregatedResult getRollup(
        String parentId, String rollupField
    ) {
        String cacheKey = parentId + ":" + rollupField;
        
        // Read-through cache with computeIfAbsent
        return cache.computeIfAbsent(cacheKey, key -> {
            AggregatedResult dbResult =
                repository.getRollup(parentId, rollupField);
            return dbResult != null
                ? dbResult
                : new AggregatedResult(
                    null, 0L, Instant.now()
                  );
        });
    }
    
    @Override
    public void refreshRollup(
        String parentId, String rollupField
    ) {
        // Force recalculation by invalidating cache
        String cacheKey = parentId + ":" + rollupField;
        cache.remove(cacheKey);
        
        RollupDefinition def = definitions.get(rollupField);
        if (def != null) {
            // Trigger full aggregation
            RollupEvent syntheticEvent = new RollupEvent(
                parentId,
                def.childModule(),
                Operation.UPDATE,
                Map.of()
            );
            updateRollup(syntheticEvent, def);
        }
    }
}

// Stub repository interface
interface RollupRepository {
    String getParentId(
        String childId, String parentModule
    );
    List<Map<String, Object>> getChildRecords(
        String parentId,
        String childModule,
        String filter
    );
    void saveRollup(
        String parentId,
        String rollupId,
        AggregatedResult result
    );
    AggregatedResult getRollup(
        String parentId, String rollupField
    );
}`,
  },
  "Demo.java": {
    path: "Demo.java",
    lang: "JAVA",
    description: "Runnable example with mock repository",
    code: `import model.*;
import service.*;
import java.math.BigDecimal;
import java.util.*;

public class Demo {
    public static void main(String[] args) {
        // Setup
        RollupRepository mockRepo = new MockRepository();
        RollupDefinition totalRevenue = new RollupDefinition(
            "total_revenue", "Account", "Invoice",
            "amount", AggregateFunction.SUM,
            "status = 'paid'"
        );
        
        RollupEngine engine = new RollupEngine(
            mockRepo, List.of(totalRevenue)
        );
        
        // Simulate Kafka events
        RollupEvent invoice1 = new RollupEvent(
            "inv-001", "Invoice", Operation.CREATE,
            Map.of("amount", new BigDecimal("1500.00"))
        );
        
        engine.processRollupEvent(invoice1);
        
        // Retrieve rollup
        AggregatedResult result =
            engine.getRollup("acc-123", "total_revenue");
        System.out.println(
            "Total Revenue: " + result.value() +
            " (Records: " + result.recordCount() + ")"
        );
    }
}

class MockRepository implements RollupRepository {
    public String getParentId(
        String childId, String parentModule
    ) {
        return "acc-123"; // Mock parent ID
    }
    
    public List<Map<String, Object>> getChildRecords(
        String parentId, String module, String filter
    ) {
        return List.of(
            Map.of("amount", new BigDecimal("1500.00")),
            Map.of("amount", new BigDecimal("2300.00"))
        );
    }
    
    public void saveRollup(
        String parentId, String rollupId,
        AggregatedResult result
    ) {
        System.out.println(
            "Saved to DB: " + parentId +
            " -> " + result.value()
        );
    }
    
    public AggregatedResult getRollup(
        String parentId, String field
    ) {
        return null; // Force cache miss
    }
}`,
  },
};

// ─── Complexity Analysis ─────────────────────────────────────

export const COMPLEXITY = {
  time: [
    {
      method: "processRollupEvent",
      complexity: "O(N)",
      detail: "where N = child records per parent (DB query + aggregation)",
    },
    {
      method: "getRollup",
      complexity: "O(1) amortized",
      detail: "cache hit, or O(N) on cache miss",
    },
    {
      method: "refreshRollup",
      complexity: "O(N)",
      detail: "forces full recalculation",
    },
  ],
  space: [
    {
      component: "Cache",
      complexity: "O(P × R)",
      detail: "P = unique parents, R = rollup definitions per parent",
    },
    {
      component: "Locks",
      complexity: "O(P × R)",
      detail: "one lock per cache key",
    },
  ],
  concurrency: [
    {
      label: "Lock Granularity",
      detail: "Per-parent locks avoid global contention",
    },
    {
      label: "Read Scalability",
      detail: "ConcurrentHashMap allows multiple concurrent reads without blocking",
    },
  ],
};

// ─── Follow-Up Questions ────────────────────────────────────

export const FOLLOW_UPS = [
  {
    question: "How would you handle a parent with 100,000 child records exceeding memory limits?",
    answer:
      "Implement incremental aggregation with chunked DB queries (batch of 1,000) and merge results using associative properties (e.g., SUM(chunk1) + SUM(chunk2)).",
  },
  {
    question: "What if Kafka consumer lag causes stale rollups during high traffic?",
    answer:
      "Add versioning to AggregatedResult (sequence number from Kafka offset) and reject out-of-order updates; use Kafka Streams for exactly-once processing.",
  },
  {
    question: "How do you prevent Redis memory explosion with millions of rollups?",
    answer:
      "Set TTL on cache entries (e.g., 24 hours), use Redis LRU eviction policy, and implement lazy loading with getRollup as write-through.",
  },
  {
    question: "How would you support cross-module rollups (e.g., Account → Opportunity → Quote)?",
    answer:
      "Introduce RollupChain with topological sorting to process dependencies in order; cache intermediate results at each level.",
  },
  {
    question: "How do you ensure consistency if DB write fails after Redis update?",
    answer:
      "Use distributed transactions (2PC) or implement compensating transactions with a retry queue (dead-letter topic in Kafka) to replay failed DB writes.",
  },
];

// ─── Design Justification ───────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    pattern: "Strategy Pattern",
    location: "aggregate() method",
    detail:
      "Delegates to function-specific logic via switch expression — each AggregateFunction (SUM, COUNT, etc.) has its own computation path",
  },
  {
    pattern: "Template Method Pattern",
    location: "updateRollup() method",
    detail:
      "Defines the skeleton algorithm (lock → fetch → aggregate → cache → persist); aggregate() is the customizable step",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Single Responsibility Principle (SRP)",
  detail:
    "RollupEngine solely manages aggregation logic; persistence is delegated to RollupRepository, caching to ConcurrentHashMap, ensuring each class has one reason to change.",
};
