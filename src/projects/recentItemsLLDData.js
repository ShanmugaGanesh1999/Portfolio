// ============================================================
// RECENT ITEMS — Low-Level Design (LLD) data
// Recent Items Tracker (Redis Sorted Set + Kafka)
// ============================================================

export const LLD_META = {
  title: "Recent Items Tracker",
  subtitle: "Low-Level Design · Redis Sorted Set + Kafka",
  tags: ["JAVA 17", "REDIS", "KAFKA", "SORTED SET", "REPOSITORY"],
};

// ─── Problem Scope & Assumptions ────────────────────────────

export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "Track User Activity",
      detail:
        "Record which CRM items (Leads, Deals, Contacts) each user views, creates, or modifies",
    },
    {
      title: "Fast Retrieval",
      detail:
        "Return user's 20 most recent items in <100ms for dropdown display",
    },
    {
      title: "Module Filtering",
      detail:
        "Support filtering recent items by CRM module type (Leads, Deals, etc.)",
    },
    {
      title: "Bounded Storage",
      detail:
        "Maintain only the latest 20 items per user — automatically evict oldest entries",
    },
  ],
  assumptions: [
    {
      label: "Event-Driven Writes",
      detail: "Kafka streams user activity events asynchronously from Record Service",
    },
    {
      label: "Cache-First Reads",
      detail: "Redis Sorted Sets serve all reads; PostgreSQL is the durable source of truth",
    },
    {
      label: "Eventual Consistency",
      detail: "1-2 second lag between activity and cache update is acceptable",
    },
    {
      label: "Fixed Cardinality",
      detail: "Max 20 recent items per user, enforced by ZREMRANGEBYRANK after every insert",
    },
  ],
  coreEntities: [
    {
      name: "RecentItem",
      description: "Record holding one recent activity entry (recordId, module, name, action, timestamp)",
      color: "accent",
    },
    {
      name: "ModuleType",
      description: "Enum of CRM modules: LEADS, DEALS, CONTACTS, ACCOUNTS, TASKS",
      color: "success",
    },
    {
      name: "RecentItemsCache",
      description: "Redis Sorted Set wrapper with ZADD, ZREVRANGE, ZREMRANGEBYRANK",
      color: "keyword",
    },
  ],
};

// ─── Key APIs ────────────────────────────────────────────────

export const KEY_APIS = [
  {
    signature: "List<RecentItem> getRecentItems(String userId, int limit)",
    description: "Cache-first retrieval, falls back to PostgreSQL on cache miss",
    method: "GET",
    color: "accent",
  },
  {
    signature: "List<RecentItem> getRecentByModule(String userId, ModuleType module, int limit)",
    description: "Filtered retrieval by CRM module type",
    method: "GET",
    color: "variable",
  },
  {
    signature: "void trackActivity(RecentItem item)",
    description: "Async write via Kafka → consumer updates cache + DB",
    method: "POST",
    color: "success",
  },
];

// ─── UML Class Diagram data ─────────────────────────────────

export const UML_CLASSES = [
  {
    name: "RecentItem",
    stereotype: "record",
    color: "accent",
    fields: [
      { visibility: "+", name: "String recordId", type: "field" },
      { visibility: "+", name: "ModuleType module", type: "field" },
      { visibility: "+", name: "String recordName", type: "field" },
      { visibility: "+", name: "String action", type: "field" },
      { visibility: "+", name: "Instant timestamp", type: "field" },
      { visibility: "+", name: "String userId", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "toCacheMember()", type: "method" },
      { visibility: "+", name: "fromCacheMember(String, double)", type: "method" },
    ],
  },
  {
    name: "ModuleType",
    stereotype: "enumeration",
    color: "success",
    fields: [
      { visibility: "", name: "LEADS", type: "enum" },
      { visibility: "", name: "DEALS", type: "enum" },
      { visibility: "", name: "CONTACTS", type: "enum" },
      { visibility: "", name: "ACCOUNTS", type: "enum" },
      { visibility: "", name: "TASKS", type: "enum" },
    ],
    methods: [],
  },
  {
    name: "RecentItemsService",
    stereotype: null,
    color: "func",
    fields: [
      { visibility: "-", name: "RecentItemsCache cache", type: "field" },
      { visibility: "-", name: "RecentItemsRepository repo", type: "field" },
      { visibility: "-", name: "int MAX_ITEMS = 20", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "getRecentItems(String, int)", type: "method" },
      { visibility: "+", name: "getRecentByModule(String, ModuleType, int)", type: "method" },
      { visibility: "+", name: "trackActivity(RecentItem)", type: "method" },
    ],
  },
  {
    name: "RecentItemsCache",
    stereotype: null,
    color: "keyword",
    fields: [
      { visibility: "-", name: "RedisTemplate<String, String> redis", type: "field" },
      { visibility: "-", name: "int MAX_ITEMS = 20", type: "field" },
      { visibility: "-", name: "Duration TTL = 24h", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "addItem(String, RecentItem)", type: "method" },
      { visibility: "+", name: "getItems(String, int)", type: "method" },
      { visibility: "+", name: "evictOldest(String)", type: "method" },
    ],
  },
  {
    name: "RecentItemsRepository",
    stereotype: "interface",
    color: "variable",
    fields: [],
    methods: [
      { visibility: "+", name: "save(RecentItem)", type: "method" },
      { visibility: "+", name: "findByUserId(String, int)", type: "method" },
      { visibility: "+", name: "findByUserIdAndModule(String, ModuleType, int)", type: "method" },
    ],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "RecentItemsService", to: "RecentItemsCache", label: "delegates caching" },
  { from: "RecentItemsService", to: "RecentItemsRepository", label: "delegates persistence" },
  { from: "RecentItemsService", to: "RecentItem", label: "processes" },
  { from: "RecentItem", to: "ModuleType", label: "contains" },
  { from: "RecentItemsCache", to: "RecentItem", label: "serializes/deserializes" },
];

// ─── Java 17 Code ────────────────────────────────────────────

export const CODE_FILES = {
  "RecentItem.java": {
    path: "model/RecentItem.java",
    lang: "JAVA",
    description: "Immutable record representing a recent activity entry",
    code: `package model;

import java.time.Instant;

public record RecentItem(
    String recordId,
    ModuleType module,
    String recordName,
    String action,         // "viewed", "modified", "created"
    Instant timestamp,
    String userId
) {
    /**
     * Serialize to Redis Sorted Set member string.
     * Format: "recordId|MODULE|recordName|action"
     * Score: epoch millis of timestamp
     */
    public String toCacheMember() {
        return String.join("|",
            recordId,
            module.name(),
            recordName,
            action
        );
    }

    /**
     * Deserialize from Redis Sorted Set member + score.
     */
    public static RecentItem fromCacheMember(
        String member, double score, String userId
    ) {
        String[] parts = member.split("\\\\|", 4);
        return new RecentItem(
            parts[0],                          // recordId
            ModuleType.valueOf(parts[1]),       // module
            parts[2],                          // recordName
            parts[3],                          // action
            Instant.ofEpochMilli((long) score), // timestamp
            userId
        );
    }
}`,
  },
  "ModuleType.java": {
    path: "model/ModuleType.java",
    lang: "JAVA",
    description: "Enum of supported CRM module types",
    code: `package model;

public enum ModuleType {
    LEADS("Leads"),
    DEALS("Deals"),
    CONTACTS("Contacts"),
    ACCOUNTS("Accounts"),
    TASKS("Tasks");

    private final String displayName;

    ModuleType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}`,
  },
  "RecentItemsRepository.java": {
    path: "repository/RecentItemsRepository.java",
    lang: "JAVA",
    description: "Data access interface for PostgreSQL persistence",
    code: `package repository;

import model.ModuleType;
import model.RecentItem;
import java.util.List;

public interface RecentItemsRepository {

    /** Upsert activity — ON CONFLICT updates timestamp + action. */
    void save(RecentItem item);

    /**
     * Fetch top N recent items for a user, ordered by
     * timestamp DESC.
     */
    List<RecentItem> findByUserId(String userId, int limit);

    /**
     * Fetch top N recent items filtered by module type.
     */
    List<RecentItem> findByUserIdAndModule(
        String userId, ModuleType module, int limit
    );
}`,
  },
  "RecentItemsCache.java": {
    path: "cache/RecentItemsCache.java",
    lang: "JAVA",
    description: "Redis Sorted Set wrapper for recent items caching",
    code: `package cache;

import model.RecentItem;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

public class RecentItemsCache {

    private final RedisTemplate<String, String> redis;
    private static final int MAX_ITEMS = 20;
    private static final Duration TTL = Duration.ofHours(24);
    private static final String KEY_PREFIX = "recent_items:";

    public RecentItemsCache(
        RedisTemplate<String, String> redis
    ) {
        this.redis = redis;
    }

    /**
     * Add item to user's recent items sorted set.
     * Uses ZADD with timestamp as score, then trims
     * to MAX_ITEMS and resets TTL.
     *
     * Time:  O(log N) for ZADD + O(log N) for ZREMRANGEBYRANK
     * Space: O(1) — bounded to 20 items per user
     */
    public void addItem(String userId, RecentItem item) {
        String key = KEY_PREFIX + userId;
        double score = item.timestamp().toEpochMilli();
        String member = item.toCacheMember();

        // Pipeline: ZADD + TRIM + EXPIRE in 1 round trip
        redis.executePipelined(connection -> {
            connection.zAdd(
                key.getBytes(), score, member.getBytes()
            );
            // Keep only top MAX_ITEMS (remove oldest)
            connection.zRemRangeByRank(
                key.getBytes(), 0, -(MAX_ITEMS + 1)
            );
            connection.expire(
                key.getBytes(), TTL.getSeconds()
            );
            return null;
        });
    }

    /**
     * Retrieve top N recent items from cache.
     *
     * Time:  O(log N + M) where M = limit (ZREVRANGE)
     * Space: O(M) for result list
     */
    public List<RecentItem> getItems(
        String userId, int limit
    ) {
        String key = KEY_PREFIX + userId;

        // ZREVRANGEBYSCORE returns newest first
        Set<ZSetOperations.TypedTuple<String>> results =
            redis.opsForZSet()
                .reverseRangeWithScores(key, 0, limit - 1);

        if (results == null || results.isEmpty()) {
            return Collections.emptyList();
        }

        return results.stream()
            .map(tuple -> RecentItem.fromCacheMember(
                tuple.getValue(),
                tuple.getScore(),
                userId
            ))
            .collect(Collectors.toList());
    }

    /**
     * Evict oldest entries beyond MAX_ITEMS.
     * Called after batch consumer inserts.
     */
    public void evictOldest(String userId) {
        String key = KEY_PREFIX + userId;
        redis.opsForZSet()
            .removeRange(key, 0, -(MAX_ITEMS + 1));
    }
}

// Stub interfaces for compilation
interface RedisTemplate<K, V> {
    void executePipelined(PipelineCallback callback);
    ZSetOperations<K, V> opsForZSet();
}
interface PipelineCallback {
    Object doInRedis(RedisConnection connection);
}
interface RedisConnection {
    void zAdd(byte[] key, double score, byte[] member);
    void zRemRangeByRank(byte[] key, long start, long end);
    void expire(byte[] key, long seconds);
}
interface ZSetOperations<K, V> {
    Set<TypedTuple<V>> reverseRangeWithScores(
        K key, long start, long end
    );
    void removeRange(K key, long start, long end);
    interface TypedTuple<V> {
        V getValue();
        Double getScore();
    }
}`,
  },
  "RecentItemsService.java": {
    path: "service/RecentItemsService.java",
    lang: "JAVA",
    description: "Core service with cache-first reads and async writes",
    code: `package service;

import cache.RecentItemsCache;
import model.*;
import repository.RecentItemsRepository;
import java.util.List;
import java.util.stream.Collectors;

public class RecentItemsService {

    private final RecentItemsCache cache;
    private final RecentItemsRepository repository;
    private static final int MAX_ITEMS = 20;

    public RecentItemsService(
        RecentItemsCache cache,
        RecentItemsRepository repository
    ) {
        this.cache = cache;
        this.repository = repository;
    }

    /**
     * Cache-first retrieval with DB fallback.
     *
     * 1. Try Redis ZREVRANGE → O(log N + M)
     * 2. On cache miss → query PostgreSQL → O(N log N)
     * 3. Lazy-load: populate cache from DB result
     *
     * Latency: ~15ms (cache hit) vs ~200ms (cache miss)
     */
    public List<RecentItem> getRecentItems(
        String userId, int limit
    ) {
        // 1. Try cache first
        List<RecentItem> cached =
            cache.getItems(userId, limit);

        if (!cached.isEmpty()) {
            return cached;  // Cache hit: ~15ms
        }

        // 2. Cache miss — fallback to PostgreSQL
        List<RecentItem> fromDb =
            repository.findByUserId(userId, limit);

        // 3. Lazy-load cache for next request
        if (!fromDb.isEmpty()) {
            fromDb.forEach(item ->
                cache.addItem(userId, item)
            );
        }

        return fromDb;
    }

    /**
     * Module-filtered retrieval.
     * Fetches all recent items from cache, then
     * filters in-memory (MAX 20 items, so O(20) filter).
     *
     * Alternative: Maintain per-module sorted sets
     *   → more Redis memory but O(1) filtered reads.
     * Trade-off: Chose in-memory filter because
     *   20 items is trivially small.
     */
    public List<RecentItem> getRecentByModule(
        String userId, ModuleType module, int limit
    ) {
        List<RecentItem> allItems =
            getRecentItems(userId, MAX_ITEMS);

        return allItems.stream()
            .filter(item ->
                item.module() == module
            )
            .limit(limit)
            .collect(Collectors.toList());
    }

    /**
     * Track user activity (called by Kafka consumer).
     * Write-through: update both cache and DB.
     *
     * 1. Persist to PostgreSQL (source of truth)
     * 2. Update Redis sorted set (ZADD + TRIM)
     */
    public void trackActivity(RecentItem item) {
        // 1. Persist to DB
        repository.save(item);

        // 2. Update cache
        cache.addItem(item.userId(), item);
    }
}`,
  },
  "Demo.java": {
    path: "Demo.java",
    lang: "JAVA",
    description: "Runnable example demonstrating the Recent Items API",
    code: `import model.*;
import service.*;
import cache.*;
import repository.*;
import java.time.Instant;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        // Setup
        RecentItemsCache cache =
            new RecentItemsCache(new MockRedis());
        RecentItemsRepository repo =
            new MockRepository();
        RecentItemsService service =
            new RecentItemsService(cache, repo);

        // Track user activity
        RecentItem viewedLead = new RecentItem(
            "lead_12345",
            ModuleType.LEADS,
            "Acme Corp - Enterprise Deal",
            "viewed",
            Instant.now(),
            "user_789"
        );
        service.trackActivity(viewedLead);

        RecentItem modifiedDeal = new RecentItem(
            "deal_67890",
            ModuleType.DEALS,
            "Q1 2026 Cloud Migration",
            "modified",
            Instant.now(),
            "user_789"
        );
        service.trackActivity(modifiedDeal);

        // Retrieve all recent items
        List<RecentItem> recent =
            service.getRecentItems("user_789", 20);
        System.out.println(
            "Recent items: " + recent.size()
        );

        // Filter by module
        List<RecentItem> leads =
            service.getRecentByModule(
                "user_789", ModuleType.LEADS, 10
            );
        System.out.println(
            "Recent leads: " + leads.size()
        );
    }
}`,
  },
};

// ─── Complexity Analysis ─────────────────────────────────────

export const COMPLEXITY = {
  time: [
    {
      method: "getRecentItems",
      complexity: "O(log N + M)",
      detail: "ZREVRANGE on Redis Sorted Set; M = limit (20), N = set size (bounded to 20)",
    },
    {
      method: "trackActivity",
      complexity: "O(log N)",
      detail: "ZADD + ZREMRANGEBYRANK on Redis; amortized with pipelining",
    },
    {
      method: "getRecentByModule",
      complexity: "O(log N + M)",
      detail: "Same as getRecentItems + O(20) in-memory filter (trivial)",
    },
  ],
  space: [
    {
      component: "Redis (per user)",
      complexity: "O(20)",
      detail: "Bounded sorted set — ZREMRANGEBYRANK enforces max 20 items per user",
    },
    {
      component: "Total Redis",
      complexity: "O(U × 20)",
      detail: "U = active users; 500K DAU × 20 items × ~200 bytes ≈ 2GB",
    },
  ],
  concurrency: [
    {
      label: "Kafka Partitioning",
      detail: "Partition by user_id hash → all events for a user go to same consumer → in-order processing without distributed locking",
    },
    {
      label: "Redis Pipelining",
      detail: "ZADD + ZREMRANGEBYRANK + EXPIRE in single pipeline → atomic per-user update, 5x throughput vs sequential",
    },
  ],
};

// ─── Follow-Up Questions ────────────────────────────────────

export const FOLLOW_UPS = [
  {
    question: "What happens if Redis goes down? How do you handle cache misses for 500K users simultaneously?",
    answer:
      "Circuit breaker pattern: after 3 consecutive Redis timeouts, switch to degraded mode querying PostgreSQL with LIMIT 20. PostgreSQL has an index on (user_id, timestamp DESC) so queries return in ~200ms vs ~15ms. Meanwhile, a background job rebuilds the Redis cache from PostgreSQL at ~10K users/minute.",
  },
  {
    question: "Why not use a per-module sorted set (recent_items:user_789:LEADS) instead of in-memory filtering?",
    answer:
      "With max 20 items per user, in-memory filtering is O(20) — trivially fast. Per-module sets would require 5x more Redis keys (one per module per user), 5× more ZADD operations per write, and complex cross-module queries for the unfiltered dropdown. The memory overhead isn't justified for filtering 20 items.",
  },
  {
    question: "How do you handle duplicate events (user clicks 'Save' 5 times in 2 seconds)?",
    answer:
      "Two-layer deduplication: (1) Kafka consumer batches events in 100ms windows and deduplicates by user_id + record_id key (keeps latest), reducing DB writes by ~60%. (2) Redis ZADD with same member string naturally overwrites the previous score (timestamp), so duplicates are idempotent.",
  },
  {
    question: "What if a user's recent items need to be shared across multiple CRM instances (multi-region)?",
    answer:
      "Use Redis Global Datastore (cross-region replication) for cache consistency. PostgreSQL would use logical replication to a read replica in the secondary region. The 1-2 second replication lag is acceptable since recent items are user-specific and rarely accessed from multiple regions simultaneously.",
  },
  {
    question: "How would you extend this to support 'pinned' items that users want to keep in their recent list permanently?",
    answer:
      "Add a 'pinned' boolean to RecentItem. Pinned items get a score of Double.MAX_VALUE in Redis (always at top). Modify ZREMRANGEBYRANK to exclude pinned items from eviction. In PostgreSQL, add a 'pinned' column and adjust the query to ORDER BY pinned DESC, timestamp DESC.",
  },
];

// ─── Design Justification ───────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    pattern: "Repository Pattern",
    location: "RecentItemsRepository interface",
    detail:
      "Abstracts PostgreSQL persistence behind an interface — allows swapping to any data store without changing service logic. Enables easy unit testing with mock implementations.",
  },
  {
    pattern: "Lazy Initialization (Cache-Aside)",
    location: "RecentItemsService.getRecentItems()",
    detail:
      "Cache is populated on first read miss rather than eagerly. Avoids pre-warming 500K user caches at startup. Cache naturally fills with active users' data within minutes of deployment.",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Single Responsibility Principle (SRP)",
  detail:
    "RecentItemsService handles business logic only; RecentItemsCache manages Redis operations; RecentItemsRepository manages PostgreSQL persistence. Each class has exactly one reason to change — business rules, caching strategy, or data access respectively.",
};
