// ============================================================
// VALIDATION SYSTEM — Low-Level Design (LLD) data
// NIO-Based Record Validation System
// ============================================================

export const LLD_META = {
  title: "NIO-Based Record Validation System",
  subtitle: "Low-Level Design · CompletableFuture + Strategy Pattern",
  tags: ["JAVA 17", "NIO", "COMPLETABLE FUTURE", "CIRCUIT BREAKER", "STRATEGY"],
};

// ─── Problem Scope & Assumptions ────────────────────────────

export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "High-Throughput Bulk Validation",
      detail:
        "Handle 1M+ records/hour via bulk APIs with non-blocking I/O using CompletableFuture and fixed thread pools",
    },
    {
      title: "Dual Validation Modes",
      detail:
        "Support synchronous validation (<50ms for form submissions) and asynchronous batch validation (bulk APIs)",
    },
    {
      title: "Extensible Rule Engine",
      detail:
        "Rules are pre-registered and immutable; support Regex, Criteria, Custom Function, and External API validation types",
    },
    {
      title: "Fault-Tolerant External Calls",
      detail:
        "External API validators (phone/email) have <500ms SLA with circuit breaker fallback after 5 consecutive failures",
    },
  ],
  assumptions: [
    {
      label: "Immutable Rules",
      detail: "ValidationRule is a Java 17 record — thread-safe by design; updates require new rule registration",
    },
    {
      label: "ConcurrentHashMap Registry",
      detail: "Lock-free reads for 1M+ validation lookups/hour with occasional rule registration writes",
    },
    {
      label: "Fixed Thread Pool",
      detail: "CPU cores × 2 threads for mixed workload (CPU-bound regex + I/O-bound external APIs)",
    },
    {
      label: "AtomicLong Metrics",
      detail: "Lock-free counters for real-time validation/error tracking without synchronization overhead",
    },
  ],
  coreEntities: [
    {
      name: "ValidationRule",
      description: "Immutable record: id, RuleType (REGEX/CRITERIA/CUSTOM/EXTERNAL_API), expression, priority",
      color: "accent",
    },
    {
      name: "ValidationContext",
      description: "Input record with fields map, module, trigger point (FORM/API/BULK/WORKFLOW)",
      color: "variable",
    },
    {
      name: "ValidationResult",
      description: "Outcome record: valid/invalid, error list, execution time, rule ID",
      color: "success",
    },
    {
      name: "AsyncValidationService",
      description: "Core service with NIO executor, rule registry, strategy-based validation dispatch",
      color: "func",
    },
  ],
};

// ─── Key APIs ────────────────────────────────────────────────

export const KEY_APIS = [
  {
    signature: "ValidationResult validate(String ruleId, ValidationContext context)",
    description: "Synchronous validation for form submissions — O(1) lookup + O(r) eval",
    method: "SYNC",
    color: "accent",
  },
  {
    signature: "CompletableFuture<List<ValidationResult>> validateBatch(List<ValidationContext> contexts)",
    description: "Async batch validation — non-blocking, returns immediately",
    method: "ASYNC",
    color: "success",
  },
  {
    signature: "void registerRule(ValidationRule rule)",
    description: "Thread-safe rule registration via ConcurrentHashMap.put()",
    method: "WRITE",
    color: "keyword",
  },
];

// ─── UML Class Diagram data ─────────────────────────────────

export const UML_CLASSES = [
  {
    name: "ValidationRule",
    stereotype: "record",
    color: "accent",
    fields: [
      { visibility: "+", name: "String id", type: "field" },
      { visibility: "+", name: "RuleType type", type: "field" },
      { visibility: "+", name: "String expression", type: "field" },
      { visibility: "+", name: "Function<ValidationContext, ValidationResult> validator", type: "field" },
      { visibility: "+", name: "int priority", type: "field" },
    ],
    methods: [],
  },
  {
    name: "ValidationContext",
    stereotype: "record",
    color: "variable",
    fields: [
      { visibility: "+", name: "String recordId", type: "field" },
      { visibility: "+", name: "String module", type: "field" },
      { visibility: "+", name: "Map<String,Object> fields", type: "field" },
      { visibility: "+", name: "TriggerPoint trigger", type: "field" },
      { visibility: "+", name: "long timestamp", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "getField(String)", type: "method" },
    ],
  },
  {
    name: "ValidationResult",
    stereotype: "record",
    color: "success",
    fields: [
      { visibility: "+", name: "String recordId", type: "field" },
      { visibility: "+", name: "boolean valid", type: "field" },
      { visibility: "+", name: "List<String> errors", type: "field" },
      { visibility: "+", name: "long executionTimeMs", type: "field" },
      { visibility: "+", name: "String ruleId", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "success(String, String, long)", type: "method" },
      { visibility: "+", name: "failure(String, String, List, long)", type: "method" },
    ],
  },
  {
    name: "ValidationExecutor",
    stereotype: "interface",
    color: "keyword",
    fields: [],
    methods: [
      { visibility: "+", name: "validate(ValidationRule, ValidationContext)", type: "method" },
      { visibility: "+", name: "validateAsync(ValidationRule, ValidationContext)", type: "method" },
    ],
  },
  {
    name: "AsyncValidationService",
    stereotype: null,
    color: "func",
    fields: [
      { visibility: "-", name: "ConcurrentHashMap<String,ValidationRule> ruleRegistry", type: "field" },
      { visibility: "-", name: "ExecutorService nioExecutor", type: "field" },
      { visibility: "-", name: "Map<RuleType,ValidationExecutor> executors", type: "field" },
      { visibility: "-", name: "AtomicLong validationCount", type: "field" },
      { visibility: "-", name: "AtomicLong errorCount", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "registerRule(ValidationRule)", type: "method" },
      { visibility: "+", name: "validate(String, ValidationContext)", type: "method" },
      { visibility: "+", name: "validateBatch(List<ValidationContext>)", type: "method" },
      { visibility: "+", name: "getMetrics()", type: "method" },
    ],
  },
  {
    name: "RegexValidator",
    stereotype: null,
    color: "string",
    fields: [],
    methods: [
      { visibility: "+", name: "validate(ValidationRule, ValidationContext)", type: "method" },
    ],
  },
  {
    name: "ExternalAPIValidator",
    stereotype: null,
    color: "comment",
    fields: [
      { visibility: "-", name: "CircuitBreaker breaker (5 failures, 60s timeout)", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "validate(ValidationRule, ValidationContext)", type: "method" },
    ],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "AsyncValidationService", to: "ValidationExecutor", label: "composition (Strategy)" },
  { from: "AsyncValidationService", to: "ValidationRule", label: "aggregation (registry)" },
  { from: "AsyncValidationService", to: "ValidationContext", label: "uses" },
  { from: "AsyncValidationService", to: "ValidationResult", label: "produces" },
  { from: "RegexValidator", to: "ValidationExecutor", label: "implements" },
  { from: "ExternalAPIValidator", to: "ValidationExecutor", label: "implements" },
];

// ─── Java 17 Code ────────────────────────────────────────────

export const CODE_FILES = {
  "ValidationRule.java": {
    path: "model/ValidationRule.java",
    lang: "JAVA",
    description: "Immutable rule record with RuleType enum and priority",
    code: `package model;

import java.util.function.Function;

public record ValidationRule(
    String id,
    RuleType type,
    String expression,  // Regex pattern or criteria
    Function<ValidationContext, ValidationResult>
        validator,
    int priority  // Lower = higher priority
) {
    public enum RuleType {
        REGEX,           // Pattern matching
        CRITERIA,        // Field conditions
        CUSTOM_FUNCTION, // Business logic
        EXTERNAL_API     // Third-party verification
    }
}`,
  },
  "ValidationContext.java": {
    path: "model/ValidationContext.java",
    lang: "JAVA",
    description: "Input record with fields map and trigger point",
    code: `package model;

import java.util.Map;

public record ValidationContext(
    String recordId,
    String module,  // Leads, Contacts, Products
    Map<String, Object> fields,
    TriggerPoint trigger,
    long timestamp
) {
    public enum TriggerPoint {
        FORM_SUBMIT, API_CREATE,
        BULK_UPDATE, WORKFLOW
    }

    public Object getField(String fieldName) {
        return fields.get(fieldName);
    }
}`,
  },
  "ValidationResult.java": {
    path: "model/ValidationResult.java",
    lang: "JAVA",
    description: "Outcome record with static factory methods",
    code: `package model;

import java.util.List;

public record ValidationResult(
    String recordId,
    boolean valid,
    List<String> errors,
    long executionTimeMs,
    String ruleId
) {
    public static ValidationResult success(
        String recordId, String ruleId, long timeMs
    ) {
        return new ValidationResult(
            recordId, true, List.of(), timeMs, ruleId
        );
    }

    public static ValidationResult failure(
        String recordId, String ruleId,
        List<String> errors, long timeMs
    ) {
        return new ValidationResult(
            recordId, false, errors, timeMs, ruleId
        );
    }
}`,
  },
  "ValidationExecutor.java": {
    path: "api/ValidationExecutor.java",
    lang: "JAVA",
    description: "Strategy interface with default async method",
    code: `package api;

import model.*;
import java.util.concurrent.CompletableFuture;

public interface ValidationExecutor {

    ValidationResult validate(
        ValidationRule rule, ValidationContext context
    );

    /**
     * Default async wrapper using CompletableFuture.
     * Subclasses can override for true non-blocking
     * implementations (e.g., ExternalAPIValidator).
     */
    default CompletableFuture<ValidationResult>
        validateAsync(
            ValidationRule rule,
            ValidationContext context
        ) {
        return CompletableFuture.supplyAsync(
            () -> validate(rule, context)
        );
    }
}`,
  },
  "AsyncValidationService.java": {
    path: "service/AsyncValidationService.java",
    lang: "JAVA",
    description: "Core NIO-based service with CompletableFuture batch processing",
    code: `package service;

import api.ValidationExecutor;
import model.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

public class AsyncValidationService {

    // ConcurrentHashMap: lock-free reads for
    // 1M+ validations/hour
    private final ConcurrentHashMap<String,
        ValidationRule> ruleRegistry;

    // Fixed pool: CPU cores * 2 for mixed workload
    private final ExecutorService nioExecutor;

    // Strategy Pattern: type -> executor mapping
    private final Map<ValidationRule.RuleType,
        ValidationExecutor> executors;

    // Lock-free metrics
    private final AtomicLong validationCount;
    private final AtomicLong errorCount;

    public AsyncValidationService(int poolSize) {
        this.ruleRegistry =
            new ConcurrentHashMap<>();
        this.nioExecutor =
            Executors.newFixedThreadPool(poolSize);
        this.executors =
            new ConcurrentHashMap<>();
        this.validationCount = new AtomicLong(0);
        this.errorCount = new AtomicLong(0);
        initializeExecutors();
    }

    private void initializeExecutors() {
        executors.put(
            ValidationRule.RuleType.REGEX,
            new RegexValidator()
        );
        executors.put(
            ValidationRule.RuleType.CRITERIA,
            new CriteriaValidator()
        );
        executors.put(
            ValidationRule.RuleType.EXTERNAL_API,
            new ExternalAPIValidator()
        );
        executors.put(
            ValidationRule.RuleType.CUSTOM_FUNCTION,
            new CustomFunctionValidator()
        );
    }

    public void registerRule(ValidationRule rule) {
        ruleRegistry.put(rule.id(), rule);
    }

    /**
     * Synchronous: O(1) lookup + O(r) eval
     */
    public ValidationResult validate(
        String ruleId, ValidationContext context
    ) {
        ValidationRule rule =
            ruleRegistry.get(ruleId);
        if (rule == null) {
            throw new IllegalArgumentException(
                "Rule not found: " + ruleId
            );
        }

        ValidationExecutor executor =
            executors.get(rule.type());
        ValidationResult result =
            executor.validate(rule, context);

        validationCount.incrementAndGet();
        if (!result.valid()) {
            errorCount.incrementAndGet();
        }
        return result;
    }

    /**
     * Async batch: O(n * m) parallelized
     * n = contexts, m = rules per context
     */
    public CompletableFuture<List<ValidationResult>>
        validateBatch(
            List<ValidationContext> contexts
        ) {
        List<CompletableFuture<List<
            ValidationResult>>> batchFutures =
            contexts.stream()
                .map(this::validateContextAsync)
                .toList();

        return CompletableFuture.allOf(
            batchFutures.toArray(
                new CompletableFuture[0]
            )
        ).thenApply(v -> batchFutures.stream()
            .flatMap(f -> f.join().stream())
            .collect(Collectors.toList()));
    }

    private CompletableFuture<List<ValidationResult>>
        validateContextAsync(
            ValidationContext context
        ) {
        List<ValidationRule> rules =
            findApplicableRules(context);

        List<CompletableFuture<ValidationResult>>
            futures = rules.stream()
            .map(rule -> {
                ValidationExecutor exec =
                    executors.get(rule.type());
                return CompletableFuture.supplyAsync(
                    () -> exec.validate(rule, context),
                    nioExecutor
                );
            })
            .toList();

        return CompletableFuture.allOf(
            futures.toArray(
                new CompletableFuture[0]
            )
        ).thenApply(v -> futures.stream()
            .map(CompletableFuture::join)
            .collect(Collectors.toList()));
    }

    private List<ValidationRule>
        findApplicableRules(
            ValidationContext context
        ) {
        return ruleRegistry.values().stream()
            .sorted(Comparator.comparingInt(
                ValidationRule::priority
            ))
            .toList();
    }

    public void shutdown() {
        nioExecutor.shutdown();
    }
}`,
  },
  "ExternalAPIValidator.java": {
    path: "service/ExternalAPIValidator.java",
    lang: "JAVA",
    description: "External API validator with circuit breaker pattern",
    code: `package service;

import api.ValidationExecutor;
import model.*;
import java.util.*;

public class ExternalAPIValidator
    implements ValidationExecutor {

    private final CircuitBreaker circuitBreaker =
        new CircuitBreaker(5, 60000);
        // 5 failures → open for 60s

    @Override
    public ValidationResult validate(
        ValidationRule rule,
        ValidationContext context
    ) {
        long start = System.currentTimeMillis();

        if (circuitBreaker.isOpen()) {
            return ValidationResult.failure(
                context.recordId(), rule.id(),
                List.of("Circuit breaker open"),
                System.currentTimeMillis() - start
            );
        }

        try {
            boolean ok = callExternalAPI(
                context.fields().get("email")
            );

            if (!ok) {
                circuitBreaker.recordFailure();
                return ValidationResult.failure(
                    context.recordId(), rule.id(),
                    List.of("Verification failed"),
                    System.currentTimeMillis() - start
                );
            }

            circuitBreaker.recordSuccess();
            return ValidationResult.success(
                context.recordId(), rule.id(),
                System.currentTimeMillis() - start
            );
        } catch (Exception e) {
            circuitBreaker.recordFailure();
            return ValidationResult.failure(
                context.recordId(), rule.id(),
                List.of("API error: " + e.getMessage()),
                System.currentTimeMillis() - start
            );
        }
    }

    private boolean callExternalAPI(Object email)
        throws InterruptedException {
        Thread.sleep(200); // Simulate 200ms call
        return email != null
            && email.toString().contains("@");
    }

    /**
     * Circuit breaker: prevents cascading failures.
     * Opens after N failures, auto-resets after timeout.
     */
    static class CircuitBreaker {
        private final int threshold;
        private final long timeoutMs;
        private int failureCount = 0;
        private long lastFailureTime = 0;

        CircuitBreaker(int threshold, long timeout) {
            this.threshold = threshold;
            this.timeoutMs = timeout;
        }

        synchronized boolean isOpen() {
            if (failureCount >= threshold) {
                if (System.currentTimeMillis()
                    - lastFailureTime > timeoutMs) {
                    failureCount = 0;
                    return false;
                }
                return true;
            }
            return false;
        }

        synchronized void recordFailure() {
            failureCount++;
            lastFailureTime =
                System.currentTimeMillis();
        }

        synchronized void recordSuccess() {
            failureCount = 0;
        }
    }
}`,
  },
  "Demo.java": {
    path: "Demo.java",
    lang: "JAVA",
    description: "Runnable example with sync, async batch, and metrics",
    code: `import model.*;
import service.AsyncValidationService;
import java.util.*;
import java.util.concurrent.*;

public class Demo {

    public static void main(String[] args)
        throws Exception {

        AsyncValidationService service =
            new AsyncValidationService(4);

        // Register rules
        service.registerRule(new ValidationRule(
            "RULE-PHONE",
            ValidationRule.RuleType.REGEX,
            "^\\\\+?1?-?\\\\(?(\\\\d{3})\\\\)?[-.]?"
            + "(\\\\d{3})[-.]?(\\\\d{4})$",
            null, 1
        ));
        service.registerRule(new ValidationRule(
            "RULE-AGE",
            ValidationRule.RuleType.CRITERIA,
            "age >= 18", null, 2
        ));
        service.registerRule(new ValidationRule(
            "RULE-EMAIL",
            ValidationRule.RuleType.EXTERNAL_API,
            "email_verification", null, 3
        ));

        // Synchronous validation
        System.out.println(
            "=== Sync Validation (Form) ==="
        );
        ValidationContext form = new ValidationContext(
            "REC-001", "Leads",
            Map.of(
                "phone", "+1-555-0199",
                "age", 25,
                "email", "test@example.com"
            ),
            ValidationContext.TriggerPoint
                .FORM_SUBMIT,
            System.currentTimeMillis()
        );

        ValidationResult sync =
            service.validate("RULE-PHONE", form);
        System.out.println(
            "Valid: " + sync.valid()
            + " | Time: " + sync.executionTimeMs()
            + "ms"
        );

        // Async batch validation
        System.out.println(
            "\\n=== Async Batch (1000 records) ==="
        );
        List<ValidationContext> batch =
            new ArrayList<>();
        Random rand = new Random();
        for (int i = 0; i < 1000; i++) {
            batch.add(new ValidationContext(
                "REC-" + i, "Contacts",
                Map.of(
                    "phone",
                    rand.nextBoolean()
                        ? "+1-555-019" + (i % 10)
                        : "invalid",
                    "age", 20 + rand.nextInt(50),
                    "email", "u" + i + "@test.com"
                ),
                ValidationContext.TriggerPoint
                    .BULK_UPDATE,
                System.currentTimeMillis()
            ));
        }

        long start = System.currentTimeMillis();
        CompletableFuture<List<ValidationResult>>
            future = service.validateBatch(batch);

        System.out.println("Non-blocking...");
        List<ValidationResult> results =
            future.get();
        long duration =
            System.currentTimeMillis() - start;

        long valid = results.stream()
            .filter(ValidationResult::valid).count();
        System.out.println(
            "Valid: " + valid
            + " | Invalid: "
            + (results.size() - valid)
            + " | Time: " + duration + "ms"
        );

        service.shutdown();
    }
}`,
  },
};

// ─── Complexity Analysis ─────────────────────────────────────

export const COMPLEXITY = {
  time: [
    {
      method: "registerRule",
      complexity: "O(1)",
      detail: "ConcurrentHashMap.put() — lock-free for concurrent registrations",
    },
    {
      method: "validate",
      complexity: "O(1) + O(r)",
      detail: "O(1) rule lookup + O(r) regex/criteria evaluation where r = pattern length",
    },
    {
      method: "validateBatch",
      complexity: "O(n·m)",
      detail: "n contexts × m rules per context, parallelized across thread pool",
    },
    {
      method: "findApplicableRules",
      complexity: "O(k log k)",
      detail: "k = total registered rules, sorted by priority",
    },
  ],
  space: [
    {
      component: "Rule Registry",
      complexity: "O(k)",
      detail: "k = number of registered validation rules in ConcurrentHashMap",
    },
    {
      component: "Batch Futures",
      complexity: "O(n)",
      detail: "n CompletableFuture objects for n contexts (results collected lazily)",
    },
  ],
  concurrency: [
    {
      label: "ConcurrentHashMap",
      detail: "Lock-free reads for rule lookups — no contention during high-throughput validation (1M+/hour)",
    },
    {
      label: "CompletableFuture",
      detail: "Non-blocking batch execution — validateBatch returns immediately, results composed via allOf + thenApply",
    },
    {
      label: "AtomicLong Metrics",
      detail: "Lock-free incrementAndGet for real-time validation/error counters without synchronization",
    },
  ],
};

// ─── Follow-Up Questions ────────────────────────────────────

export const FOLLOW_UPS = [
  {
    question: "How would you scale this to 10M records/hour across distributed nodes?",
    answer:
      "Introduce Kafka for event streaming — producers publish ValidationContext to a topic, consumers run AsyncValidationService. Partition by recordId hash for parallelism, and use Redis to cache the rule registry across nodes for consistent rule lookups.",
  },
  {
    question: "What happens if external API validator takes >5 seconds? How do you prevent thread starvation?",
    answer:
      "Implement timeout on CompletableFuture using orTimeout(5, TimeUnit.SECONDS), use separate thread pool for I/O-bound external API calls (10× thread count), and fail-fast with circuit breaker after 3 consecutive timeouts to prevent cascading resource exhaustion.",
  },
  {
    question: "How do you handle partial failures in batch validation (100 succeed, 50 fail due to API downtime)?",
    answer:
      "Return List<ValidationResult> preserving order with recordId mapping. Mark failed records with error code (API_TIMEOUT). Expose retry endpoint /validateRetry that re-processes only failed recordIds from the original batch using the same rule set.",
  },
  {
    question: "Regex compilation happens on every validation. How would you optimize for 1M identical rules?",
    answer:
      "Add ConcurrentHashMap<String, Pattern> compiled pattern cache in RegexValidator. Compute hash of rule.expression() as key, compile only on cache miss. This reduces CPU by ~60% for repeated patterns since Pattern.compile() is expensive.",
  },
  {
    question: "How would you implement rule versioning to support A/B testing different validation logic on 10% of traffic?",
    answer:
      "Add version and trafficPercentage fields to ValidationRule record. Hash recordId to determine cohort assignment (deterministic). Query ruleRegistry with composite key (ruleId, version) based on cohort — requires CopyOnWriteArrayList for concurrent reads during version updates.",
  },
];

// ─── Design Justification ───────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    pattern: "Strategy Pattern",
    location: "executors Map<RuleType, ValidationExecutor>",
    detail:
      "Different validation strategies (RegexValidator, CriteriaValidator, ExternalAPIValidator, CustomFunctionValidator) implement the same ValidationExecutor interface — runtime selection based on RuleType without conditional branching.",
  },
  {
    pattern: "Template Method Pattern",
    location: "validateBatch() → validateContextAsync()",
    detail:
      "Batch validation defines the algorithmic structure (map contexts → async validate per rule → aggregate results via CompletableFuture.allOf) while delegating specific validation logic to rule-type executors.",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Open/Closed Principle (OCP)",
  detail:
    "The system is open for extension — new validators (BlockchainValidator, GDPRComplianceValidator) can be added by implementing ValidationExecutor and registering in initializeExecutors(). Core AsyncValidationService doesn't change when adding new validation types, critical for a CRM where compliance requirements evolve frequently.",
};
