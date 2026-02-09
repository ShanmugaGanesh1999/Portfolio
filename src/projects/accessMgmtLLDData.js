// ============================================================
// CAMPUS IAM PLATFORM — Low-Level Design data
// ============================================================

export const LLD_META = {
  title: "Centralized IAM Platform with OAuth2 SSO",
  subtitle: "Low-Level Design Deep Dive",
};

// ── Problem Scope & Assumptions ──────────────────────────────
export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "OAuth2 Token Lifecycle",
      detail:
        "JWT access tokens expire in 3600s; refresh tokens in 7 days; single active session per user with atomic token generation via AtomicLong CAS.",
    },
    {
      title: "Hybrid RBAC + ABAC Policy Evaluation",
      detail:
        "Policy Decision Point evaluates role-based (RBAC) and attribute-based (ABAC) conditions in-memory using Predicate<Map> strategy; policies cached for 5 minutes.",
    },
    {
      title: "Thread-Safe Concurrent Access",
      detail:
        "ConcurrentHashMap for lock-free token reads (95% workload); ReentrantReadWriteLock for policy cache to allow concurrent authorize() with exclusive provisionRole() writes.",
    },
    {
      title: "Authorization Performance",
      detail:
        "<200ms p95 for token validation and authz decisions; cache-first strategy with O(1) token lookup and bounded O(R×P) policy evaluation.",
    },
  ],
  assumptions: [
    {
      label: "Token Lifecycle",
      detail:
        "JWT access tokens expire in 3600s; refresh tokens in 7 days; single active session per user.",
    },
    {
      label: "Policy Model",
      detail:
        "Hybrid RBAC + ABAC evaluated in-memory; policies cached for 5 minutes with full refresh on provisionRole().",
    },
    {
      label: "Concurrency",
      detail:
        "10K concurrent users; read-heavy workload (95% reads); policy updates are rare (<1% writes).",
    },
    {
      label: "Performance",
      detail:
        "<200ms p95 for token validation/authz decisions; cache-first strategy with Redis-like in-memory store.",
    },
  ],
  coreEntities: [
    {
      name: "User",
      description: "Immutable identity record with userId, roles, and attributes from LDAP/AD",
      color: "accent",
    },
    {
      name: "AuthToken",
      description: "JWT with tokenId, expiry, claims, and signature for session management",
      color: "variable",
    },
    {
      name: "AccessPolicy",
      description: "RBAC role + ABAC conditions with resource pattern matching and Predicate evaluation",
      color: "keyword",
    },
    {
      name: "AuthorizationDecision",
      description: "PERMIT/DENY result with reason and list of applied policy IDs",
      color: "success",
    },
  ],
};

export const KEY_APIS = [
  {
    method: "SYNC",
    signature: "AuthToken authenticate(String username, String password)",
    description:
      "Validates credentials against user store, generates JWT via AtomicLong CAS, caches in ConcurrentHashMap",
    color: "success",
  },
  {
    method: "SYNC",
    signature:
      "AuthorizationDecision authorize(String token, String resource, String action, Map context)",
    description:
      "Evaluates RBAC+ABAC policies under read lock; O(R×P) where R=roles, P=policies per role",
    color: "accent",
  },
  {
    method: "WRITE",
    signature: "void provisionRole(String userId, String role)",
    description:
      "Acquires write lock, refreshes policy cache atomically, blocks all concurrent reads during update",
    color: "keyword",
  },
];

// ── UML Class Diagram ────────────────────────────────────────
export const UML_CLASSES = [
  {
    name: "User",
    stereotype: "record",
    color: "accent",
    fields: [
      { visibility: "+", name: "String userId" },
      { visibility: "+", name: "String username" },
      { visibility: "+", name: "Set<String> roles" },
      { visibility: "+", name: "Map<String,Object> attributes" },
    ],
    methods: [{ visibility: "+", name: "hasRole(String): boolean" }],
  },
  {
    name: "AuthToken",
    stereotype: "record",
    color: "variable",
    fields: [
      { visibility: "+", name: "String tokenId" },
      { visibility: "+", name: "String userId" },
      { visibility: "+", name: "Instant issuedAt" },
      { visibility: "+", name: "Instant expiresAt" },
      { visibility: "+", name: "Map<String,Object> claims" },
    ],
    methods: [{ visibility: "+", name: "isExpired(): boolean" }],
  },
  {
    name: "AccessPolicy",
    stereotype: "record",
    color: "keyword",
    fields: [
      { visibility: "+", name: "String policyId" },
      { visibility: "+", name: "String role" },
      { visibility: "+", name: "String resource" },
      { visibility: "+", name: "String action" },
      { visibility: "+", name: "Predicate<Map> condition" },
    ],
    methods: [
      { visibility: "+", name: "matches(String, String): boolean" },
      { visibility: "-", name: "matchesPattern(String, String): boolean" },
    ],
  },
  {
    name: "AuthorizationDecision",
    stereotype: "record",
    color: "success",
    fields: [
      { visibility: "+", name: "boolean permitted" },
      { visibility: "+", name: "String reason" },
      { visibility: "+", name: "List<String> appliedPolicies" },
    ],
    methods: [
      { visibility: "+", name: "permit(String, List): AuthorizationDecision" },
      { visibility: "+", name: "deny(String): AuthorizationDecision" },
    ],
  },
  {
    name: "AuthenticationService",
    stereotype: "interface",
    color: "func",
    fields: [],
    methods: [
      { visibility: "+", name: "authenticate(String, String): AuthToken" },
      { visibility: "+", name: "validateToken(String): Optional<AuthToken>" },
      { visibility: "+", name: "refreshToken(String): AuthToken" },
    ],
  },
  {
    name: "OAuth2TokenManager",
    stereotype: null,
    color: "accent",
    fields: [
      { visibility: "-", name: "ConcurrentHashMap<String,AuthToken> tokenCache" },
      { visibility: "-", name: "ConcurrentHashMap<String,User> userStore" },
      { visibility: "-", name: "AtomicLong tokenCounter" },
    ],
    methods: [
      { visibility: "+", name: "authenticate(String, String): AuthToken" },
      { visibility: "+", name: "validateToken(String): Optional<AuthToken>" },
      { visibility: "+", name: "refreshToken(String): AuthToken" },
      { visibility: "+", name: "getUserByToken(String): User" },
      { visibility: "-", name: "generateToken(User): AuthToken" },
    ],
  },
  {
    name: "PolicyDecisionPoint",
    stereotype: null,
    color: "keyword",
    fields: [
      { visibility: "-", name: "OAuth2TokenManager tokenManager" },
      { visibility: "-", name: "ConcurrentHashMap<String,List<AccessPolicy>> policyCache" },
      { visibility: "-", name: "ReentrantReadWriteLock cacheLock" },
    ],
    methods: [
      { visibility: "+", name: "authorize(String, String, String, Map): AuthorizationDecision" },
      { visibility: "+", name: "provisionRole(String, String): void" },
      { visibility: "-", name: "initializePolicies(): void" },
      { visibility: "-", name: "refreshPolicies(): void" },
    ],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "AuthenticationService", to: "OAuth2TokenManager", label: "implements" },
  { from: "AuthorizationService", to: "PolicyDecisionPoint", label: "implements" },
  { from: "OAuth2TokenManager", to: "AuthToken", label: "creates" },
  { from: "OAuth2TokenManager", to: "User", label: "validates" },
  { from: "PolicyDecisionPoint", to: "AccessPolicy", label: "evaluates" },
  { from: "PolicyDecisionPoint", to: "AuthorizationDecision", label: "returns" },
  { from: "PolicyDecisionPoint", to: "User", label: "checks roles" },
];

// ── Java 17 Code Files ───────────────────────────────────────
export const CODE_FILES = {
  "User.java": {
    path: "model/User.java",
    description: "Immutable identity record with defensive copies",
    code: `package model;

import java.util.*;

public record User(
    String userId,
    String username,
    Set<String> roles,
    Map<String, Object> attributes
) {
    public User {
        roles = Set.copyOf(roles);
        attributes = Map.copyOf(attributes);
    }
    
    public boolean hasRole(String role) {
        return roles.contains(role);
    }
}`,
  },
  "AuthToken.java": {
    path: "model/AuthToken.java",
    description: "JWT token record with expiry check",
    code: `package model;

import java.time.Instant;
import java.util.Map;

public record AuthToken(
    String tokenId,
    String userId,
    Instant issuedAt,
    Instant expiresAt,
    Map<String, Object> claims
) {
    public AuthToken {
        claims = Map.copyOf(claims);
    }
    
    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }
}`,
  },
  "AccessPolicy.java": {
    path: "model/AccessPolicy.java",
    description: "RBAC role + ABAC condition with resource pattern matching",
    code: `package model;

import java.util.Map;
import java.util.function.Predicate;

public record AccessPolicy(
    String policyId,
    String role,           // RBAC: required role
    String resource,       // Resource pattern (e.g., "parking:*", "dining:hall-a")
    String action,         // Action (e.g., "read", "write", "access")
    Predicate<Map<String, Object>> condition  // ABAC: contextual condition
) {
    public boolean matches(String targetResource, String targetAction) {
        return matchesPattern(resource, targetResource)
            && action.equals(targetAction);
    }
    
    private boolean matchesPattern(String pattern, String target) {
        return pattern.equals("*") || 
               pattern.endsWith(":*")
                 && target.startsWith(pattern.substring(0, pattern.length() - 1)) ||
               pattern.equals(target);
    }
}`,
  },
  "AuthorizationDecision.java": {
    path: "model/AuthorizationDecision.java",
    description: "PERMIT/DENY result with factory methods",
    code: `package model;

import java.util.List;

public record AuthorizationDecision(
    boolean permitted,
    String reason,
    List<String> appliedPolicies
) {
    public static AuthorizationDecision permit(String reason, List<String> policies) {
        return new AuthorizationDecision(true, reason, policies);
    }
    
    public static AuthorizationDecision deny(String reason) {
        return new AuthorizationDecision(false, reason, List.of());
    }
}`,
  },
  "OAuth2TokenManager.java": {
    path: "service/OAuth2TokenManager.java",
    description: "Thread-safe token lifecycle with ConcurrentHashMap + AtomicLong",
    code: `package service;

import api.AuthenticationService;
import model.AuthToken;
import model.User;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe OAuth2 token management using ConcurrentHashMap.
 * ConcurrentHashMap chosen for:
 * - Lock-free reads (validateToken is 95% of requests)
 * - Segmented locking for writes (concurrent authenticate)
 * - O(1) lookup for token validation
 */
public class OAuth2TokenManager implements AuthenticationService {
    
    private final ConcurrentHashMap<String, AuthToken> tokenCache
        = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, User> userStore
        = new ConcurrentHashMap<>();
    private final AtomicLong tokenCounter = new AtomicLong(0);
    
    private static final long TOKEN_EXPIRY_SECONDS = 3600;
    
    public OAuth2TokenManager() {
        userStore.put("alice", new User("u1", "alice",
            Set.of("ADMIN", "EMPLOYEE"),
            Map.of("department", "IT", "clearance", "L3")));
        userStore.put("bob", new User("u2", "bob",
            Set.of("EMPLOYEE"),
            Map.of("department", "HR", "clearance", "L1")));
    }
    
    @Override
    public AuthToken authenticate(String username, String password) {
        User user = userStore.get(username);
        if (user == null) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return generateToken(user);
    }
    
    /**
     * AtomicLong.getAndIncrement() — lock-free CAS operation
     * for unique tokenId generation.
     */
    private AuthToken generateToken(User user) {
        String tokenId = "tkn_" + tokenCounter.getAndIncrement();
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(TOKEN_EXPIRY_SECONDS);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", user.userId());
        claims.put("roles", user.roles());
        claims.put("iat", now.getEpochSecond());
        claims.put("exp", expiry.getEpochSecond());
        
        AuthToken token = new AuthToken(
            tokenId, user.userId(), now, expiry, claims);
        
        tokenCache.putIfAbsent(tokenId, token);
        return token;
    }
    
    @Override
    public Optional<AuthToken> validateToken(String tokenId) {
        AuthToken token = tokenCache.get(tokenId);
        if (token == null || token.isExpired()) {
            tokenCache.remove(tokenId);
            return Optional.empty();
        }
        return Optional.of(token);
    }
    
    @Override
    public AuthToken refreshToken(String tokenId) {
        AuthToken old = validateToken(tokenId)
            .orElseThrow(() ->
                new IllegalArgumentException("Invalid or expired token"));
        User user = userStore.get(old.userId());
        tokenCache.remove(tokenId);
        return generateToken(user);
    }
    
    public User getUserByToken(String tokenId) {
        AuthToken token = validateToken(tokenId)
            .orElseThrow(() ->
                new IllegalArgumentException("Invalid token"));
        return userStore.get(token.userId());
    }
}`,
  },
  "PolicyDecisionPoint.java": {
    path: "service/PolicyDecisionPoint.java",
    description: "RBAC/ABAC engine with ReentrantReadWriteLock for concurrent reads",
    code: `package service;

import api.AuthorizationService;
import model.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Thread-safe RBAC/ABAC policy evaluation engine.
 * ReentrantReadWriteLock chosen because:
 * - authorize() is read-heavy (95%): concurrent reads allowed
 * - provisionRole() is rare (<5%): write lock blocks all
 * - Better than synchronized for read-dominated patterns
 */
public class PolicyDecisionPoint implements AuthorizationService {
    
    private final OAuth2TokenManager tokenManager;
    private final ConcurrentHashMap<String, List<AccessPolicy>> policyCache
        = new ConcurrentHashMap<>();
    private final ReentrantReadWriteLock cacheLock
        = new ReentrantReadWriteLock();
    
    public PolicyDecisionPoint(OAuth2TokenManager tokenManager) {
        this.tokenManager = tokenManager;
        initializePolicies();
    }
    
    private void initializePolicies() {
        List<AccessPolicy> adminPolicies = List.of(
            new AccessPolicy("p1", "ADMIN", "*", "*", ctx -> true),
            new AccessPolicy("p2", "ADMIN", "parking:*", "access",
                ctx -> "L3".equals(ctx.get("clearance")))
        );
        List<AccessPolicy> employeePolicies = List.of(
            new AccessPolicy("p3", "EMPLOYEE", "dining:*", "access",
                ctx -> true),
            new AccessPolicy("p4", "EMPLOYEE", "parking:visitor", "access",
                ctx -> "IT".equals(ctx.get("department")))
        );
        policyCache.put("ADMIN", adminPolicies);
        policyCache.put("EMPLOYEE", employeePolicies);
    }
    
    @Override
    public AuthorizationDecision authorize(
            String tokenId, String resource, String action,
            Map<String, Object> context) {
        User user = tokenManager.getUserByToken(tokenId);
        
        // READ lock: allows concurrent authorize() calls
        cacheLock.readLock().lock();
        try {
            List<String> appliedPolicies = new ArrayList<>();
            
            for (String role : user.roles()) {
                List<AccessPolicy> policies =
                    policyCache.getOrDefault(role, List.of());
                
                for (AccessPolicy policy : policies) {
                    if (policy.matches(resource, action)) {
                        Map<String, Object> evalCtx =
                            new HashMap<>(context);
                        evalCtx.putAll(user.attributes());
                        
                        if (policy.condition().test(evalCtx)) {
                            appliedPolicies.add(policy.policyId());
                            return AuthorizationDecision.permit(
                                "Authorized via " + policy.policyId(),
                                appliedPolicies);
                        }
                    }
                }
            }
            
            return AuthorizationDecision.deny(
                "No matching policy for " + resource + ":" + action);
        } finally {
            cacheLock.readLock().unlock();
        }
    }
    
    @Override
    public void provisionRole(String userId, String role) {
        // WRITE lock: blocks all reads/writes
        cacheLock.writeLock().lock();
        try {
            refreshPolicies();
            System.out.println(
                "Provisioned role " + role + " to user " + userId);
        } finally {
            cacheLock.writeLock().unlock();
        }
    }
    
    private void refreshPolicies() {
        policyCache.clear();
        initializePolicies();
    }
}`,
  },
  "Demo.java": {
    path: "Demo.java",
    description: "End-to-end demo: authenticate → authorize (RBAC+ABAC) → provision",
    code: `import api.*;
import model.*;
import service.*;

import java.util.Map;

public class Demo {
    public static void main(String[] args) {
        OAuth2TokenManager authService = new OAuth2TokenManager();
        PolicyDecisionPoint authzService =
            new PolicyDecisionPoint(authService);
        
        System.out.println("=== IAM Platform Demo ===\\n");
        
        // 1. Authentication
        System.out.println("1. AUTHENTICATION");
        AuthToken aliceToken = authService.authenticate("alice", "pw");
        System.out.println("✓ Alice: " + aliceToken.tokenId());
        
        AuthToken bobToken = authService.authenticate("bob", "pw");
        System.out.println("✓ Bob: " + bobToken.tokenId());
        
        // 2. Authorization — RBAC
        System.out.println("\\n2. AUTHORIZATION (RBAC)");
        AuthorizationDecision d1 = authzService.authorize(
            aliceToken.tokenId(), "parking:lot-a", "access", Map.of());
        System.out.println("Alice parking: " + d1.permitted()
            + " (" + d1.reason() + ")");
        
        AuthorizationDecision d2 = authzService.authorize(
            bobToken.tokenId(), "parking:lot-a", "access", Map.of());
        System.out.println("Bob parking: " + d2.permitted()
            + " (" + d2.reason() + ")");
        
        // 3. Authorization — ABAC
        System.out.println("\\n3. AUTHORIZATION (ABAC)");
        AuthorizationDecision d3 = authzService.authorize(
            bobToken.tokenId(), "parking:visitor", "access",
            Map.of("time", "09:00", "location", "campus"));
        System.out.println("Bob visitor parking (IT dept): "
            + d3.permitted() + " (" + d3.reason() + ")");
        
        // 4. Token Validation
        System.out.println("\\n4. TOKEN VALIDATION");
        boolean valid = authService.validateToken(
            aliceToken.tokenId()).isPresent();
        System.out.println("Alice token valid: " + valid);
        
        // 5. Role Provisioning
        System.out.println("\\n5. ROLE PROVISIONING");
        authzService.provisionRole("u2", "MANAGER");
        
        System.out.println("\\n=== Demo Complete ===");
    }
}`,
  },
};

// ── Complexity Analysis ──────────────────────────────────────
export const COMPLEXITY = {
  time: [
    {
      method: "authenticate",
      complexity: "O(1)",
      detail: "HashMap user lookup + AtomicLong.getAndIncrement() CAS operation",
    },
    {
      method: "validateToken",
      complexity: "O(1)",
      detail: "ConcurrentHashMap.get() — lock-free read, lazy cleanup on expiry",
    },
    {
      method: "authorize",
      complexity: "O(R × P)",
      detail: "R = user roles (avg 2-3), P = policies per role (avg 3-5); bounded, typically <15 iterations",
    },
    {
      method: "provisionRole",
      complexity: "O(P_total)",
      detail: "Write lock + full policy cache refresh; blocks all concurrent reads during update",
    },
  ],
  space: [
    {
      component: "Token Cache",
      complexity: "O(N)",
      detail: "N = active tokens; ~98% hit rate with 3600s TTL and lazy cleanup",
    },
    {
      component: "Policy Cache",
      complexity: "O(R × P)",
      detail: "R = roles, P = policies per role; in-memory, 5-minute refresh interval",
    },
  ],
  concurrency: [
    {
      label: "ConcurrentHashMap",
      detail: "Lock-free reads for validateToken(); segmented locking for writes — 95% read workload",
    },
    {
      label: "ReentrantReadWriteLock",
      detail: "Multiple concurrent authorize() reads; exclusive provisionRole() writes; no read starvation",
    },
    {
      label: "AtomicLong",
      detail: "Lock-free CAS for unique tokenId generation; no synchronized block needed",
    },
  ],
};

// ── Follow-up Questions ──────────────────────────────────────
export const FOLLOW_UPS = [
  {
    question:
      "How would you handle distributed deployments with multiple IAM service instances?",
    answer:
      "Replace in-memory ConcurrentHashMap with Redis Cluster for token cache (TTL-based expiry) and policy cache (pub/sub for invalidation); use distributed locks (Redisson) for provisionRole() to prevent race conditions during policy updates across nodes.",
  },
  {
    question:
      "Current policy evaluation is O(R × P). How would you optimize for 100K policies?",
    answer:
      "Build inverted index: Map<Resource, Map<Action, List<Policy>>> to reduce lookup to O(1) resource match + O(P_matched) where P_matched ≪ P_total; pre-compile ABAC conditions using MVEL/SpEL for faster evaluation; cache authz decisions per (user, resource, action) tuple with 60s TTL.",
  },
  {
    question:
      "How would you prevent token theft and replay attacks?",
    answer:
      "Implement token binding (TLS certificate hash in JWT claims), require mutual TLS for token requests, add jti (JWT ID) with Redis blacklist for revoked tokens, enforce IP whitelisting per user, and use short-lived access tokens (300s) with secure refresh token rotation (RFC 6819).",
  },
  {
    question:
      "PolicyDecisionPoint uses ReentrantReadWriteLock. What if policy updates cause read starvation?",
    answer:
      "Switch to StampedLock with optimistic reads (tryOptimisticRead()) for authorize() to avoid blocking; use versioned policy cache with atomic reference swap during provisionRole() to enable lock-free reads; or separate policy update path to async queue with eventual consistency.",
  },
  {
    question:
      "How would you audit every authorization decision for compliance (SOC2/GDPR)?",
    answer:
      "Add async event publishing in authorize() using Disruptor ring buffer to avoid blocking; stream events to Kafka topic partitioned by userId; sink to Elasticsearch for searchable audit trail with retention policy; include correlation ID, timestamp, user context, decision, and evaluated policies in each audit record.",
  },
];

// ── Design Justification ─────────────────────────────────────
export const DESIGN_PATTERNS = [
  {
    pattern: "Strategy Pattern",
    location: "AccessPolicy.condition → Predicate<Map>",
    detail:
      "Each policy defines pluggable ABAC condition logic via Predicate<Map<String, Object>> — custom evaluation strategies without modifying PolicyDecisionPoint.",
  },
  {
    pattern: "Facade Pattern",
    location: "AuthenticationService / AuthorizationService interfaces",
    detail:
      "Clean abstraction over complex OAuth2TokenManager and PolicyDecisionPoint; client code interacts via simple authenticate()/authorize() without knowing token/policy internals.",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Single Responsibility Principle (SRP)",
  detail:
    "OAuth2TokenManager handles ONLY token lifecycle (generation, validation, refresh), while PolicyDecisionPoint handles ONLY authorization logic (policy evaluation). This separation ensures token invalidation doesn't affect authorization caching strategy, enabling independent scaling and optimization of each concern.",
};
