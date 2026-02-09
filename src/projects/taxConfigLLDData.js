// ============================================================
// TAX CONFIGURATION — Low-Level Design (LLD) data
// Zoho CRM Tax Configuration System
// ============================================================

export const LLD_META = {
  title: "Tax Configuration System",
  subtitle: "Low-Level Design · Concurrency + Strategy Pattern",
  tags: ["JAVA 17", "CONCURRENCY", "BIGDECIMAL", "RECORDS", "STRATEGY"],
};

// ─── Problem Scope & Assumptions ────────────────────────────

export const PROBLEM_SCOPE = {
  coreRequirements: [
    {
      title: "Concurrent Access",
      detail:
        "Multiple admins can configure taxes while users create records simultaneously — requires thread-safe tax registry",
    },
    {
      title: "Financial Precision",
      detail:
        "Tax values stored as BigDecimal with scale=2 for financial accuracy; no floating-point rounding errors",
    },
    {
      title: "API Versioning",
      detail:
        "API versions (v2, v8) maintained via immutable snapshots; breaking changes trigger new versions without disrupting existing clients",
    },
    {
      title: "Cross-Document Scope",
      detail:
        "System applies to Quotes, Sales Orders, Invoices via shared tax repository with compound calculation support",
    },
  ],
  assumptions: [
    {
      label: "Immutable Tax Records",
      detail: "Tax is a Java 17 record (immutable value object); thread-safety via immutability",
    },
    {
      label: "ReadWriteLock for Registry",
      detail: "Multiple concurrent reads (getActiveTaxes) or exclusive writes (addTax/reorder) via ReentrantReadWriteLock",
    },
    {
      label: "Snapshot Isolation",
      detail: "Transactions freeze tax config at start; completed documents reference historical snapshot, not live config",
    },
    {
      label: "Compound Tax Model",
      detail: "Taxes apply sequentially — each tax calculated on base + previous taxes (tax-on-tax)",
    },
  ],
  coreEntities: [
    {
      name: "Tax",
      description: "Immutable value object (id, label, rate, displayOrder, userModifiable, autoPopulate)",
      color: "accent",
    },
    {
      name: "TaxConfiguration",
      description: "Thread-safe registry with ConcurrentHashMap, ReadWriteLock, AtomicInteger",
      color: "func",
    },
    {
      name: "LineItem",
      description: "Product line record with quantity, unitPrice, and applied taxes list",
      color: "variable",
    },
    {
      name: "TaxableDocument",
      description: "Interface for Quote/SalesOrder/Invoice with default calculation methods",
      color: "keyword",
    },
  ],
};

// ─── Key APIs ────────────────────────────────────────────────

export const KEY_APIS = [
  {
    signature: "Tax addTax(String label, BigDecimal rate, boolean userModifiable, boolean autoPopulate)",
    description: "Write-locked tax creation with atomic order sequence",
    method: "WRITE",
    color: "keyword",
  },
  {
    signature: "List<Tax> getActiveTaxes(String apiVersion)",
    description: "Read-locked retrieval with version snapshot support",
    method: "GET",
    color: "accent",
  },
  {
    signature: "BigDecimal calculate(LineItem item, List<Tax> taxes)",
    description: "Compound tax calculation via Strategy Pattern",
    method: "CALC",
    color: "success",
  },
];

// ─── UML Class Diagram data ─────────────────────────────────

export const UML_CLASSES = [
  {
    name: "Tax",
    stereotype: "record",
    color: "accent",
    fields: [
      { visibility: "+", name: "String id", type: "field" },
      { visibility: "+", name: "String label", type: "field" },
      { visibility: "+", name: "BigDecimal rate", type: "field" },
      { visibility: "+", name: "int displayOrder", type: "field" },
      { visibility: "+", name: "boolean userModifiable", type: "field" },
      { visibility: "+", name: "boolean autoPopulate", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "create(String, BigDecimal, int, boolean, boolean)", type: "method" },
    ],
  },
  {
    name: "TaxConfigurationService",
    stereotype: null,
    color: "func",
    fields: [
      { visibility: "-", name: "ConcurrentHashMap<String,Tax> taxRegistry", type: "field" },
      { visibility: "-", name: "ReentrantReadWriteLock lock", type: "field" },
      { visibility: "-", name: "AtomicInteger orderSequence", type: "field" },
      { visibility: "-", name: "Map<String,TaxConfigSnapshot> versionSnapshots", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "addTax(String, BigDecimal, boolean, boolean)", type: "method" },
      { visibility: "+", name: "removeTax(String)", type: "method" },
      { visibility: "+", name: "reorderTaxes(List<String>)", type: "method" },
      { visibility: "+", name: "getActiveTaxes(String)", type: "method" },
      { visibility: "+", name: "createVersionSnapshot(String)", type: "method" },
    ],
  },
  {
    name: "LineItem",
    stereotype: "record",
    color: "variable",
    fields: [
      { visibility: "+", name: "String productId", type: "field" },
      { visibility: "+", name: "BigDecimal quantity", type: "field" },
      { visibility: "+", name: "BigDecimal unitPrice", type: "field" },
      { visibility: "+", name: "List<Tax> appliedTaxes", type: "field" },
    ],
    methods: [
      { visibility: "+", name: "subtotal()", type: "method" },
    ],
  },
  {
    name: "TaxableDocument",
    stereotype: "interface",
    color: "keyword",
    fields: [],
    methods: [
      { visibility: "+", name: "getLineItems()", type: "method" },
      { visibility: "+", name: "calculateSubtotal()", type: "method" },
      { visibility: "+", name: "calculateTotalTax()", type: "method" },
    ],
  },
  {
    name: "TaxCalculationStrategy",
    stereotype: "interface",
    color: "success",
    fields: [],
    methods: [
      { visibility: "+", name: "calculate(LineItem, List<Tax>)", type: "method" },
    ],
  },
  {
    name: "CompoundTaxStrategy",
    stereotype: null,
    color: "string",
    fields: [],
    methods: [
      { visibility: "+", name: "calculate(LineItem, List<Tax>)", type: "method" },
    ],
  },
  {
    name: "TaxConfigSnapshot",
    stereotype: "record",
    color: "comment",
    fields: [
      { visibility: "+", name: "String version", type: "field" },
      { visibility: "+", name: "List<Tax> taxes", type: "field" },
      { visibility: "+", name: "Instant createdAt", type: "field" },
    ],
    methods: [],
  },
];

export const UML_RELATIONSHIPS = [
  { from: "TaxConfigurationService", to: "Tax", label: "contains (1:many)" },
  { from: "TaxConfigurationService", to: "TaxCalculationStrategy", label: "uses" },
  { from: "TaxConfigurationService", to: "TaxConfigSnapshot", label: "creates" },
  { from: "LineItem", to: "Tax", label: "applies (many:many)" },
  { from: "TaxableDocument", to: "LineItem", label: "aggregates (1:many)" },
  { from: "CompoundTaxStrategy", to: "TaxCalculationStrategy", label: "implements" },
];

// ─── Java 17 Code ────────────────────────────────────────────

export const CODE_FILES = {
  "Tax.java": {
    path: "model/Tax.java",
    lang: "JAVA",
    description: "Immutable tax definition record with validation",
    code: `package model;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Immutable tax definition. Thread-safety via immutability.
 */
public record Tax(
    String id,
    String label,
    BigDecimal rate,           // Scale=2 enforced at creation
    int displayOrder,
    boolean userModifiable,
    boolean autoPopulate
) {
    public Tax {
        if (rate.scale() > 2) {
            throw new IllegalArgumentException(
                "Tax rate must have max 2 decimal places"
            );
        }
        if (rate.compareTo(BigDecimal.ZERO) < 0
            || rate.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException(
                "Tax rate must be 0-100%"
            );
        }
    }

    public static Tax create(
        String label, BigDecimal rate, int order,
        boolean userMod, boolean autoPopulate
    ) {
        return new Tax(
            UUID.randomUUID().toString(),
            label,
            rate.setScale(2),
            order,
            userMod,
            autoPopulate
        );
    }
}`,
  },
  "LineItem.java": {
    path: "model/LineItem.java",
    lang: "JAVA",
    description: "Product line record with subtotal calculation",
    code: `package model;

import java.math.BigDecimal;
import java.util.List;

public record LineItem(
    String productId,
    BigDecimal quantity,
    BigDecimal unitPrice,
    List<Tax> appliedTaxes    // Taxes selected for this line
) {
    public BigDecimal subtotal() {
        return quantity
            .multiply(unitPrice)
            .setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}`,
  },
  "TaxConfigSnapshot.java": {
    path: "model/TaxConfigSnapshot.java",
    lang: "JAVA",
    description: "Immutable snapshot for API version compatibility",
    code: `package model;

import java.time.Instant;
import java.util.List;

/**
 * Immutable snapshot for API version compatibility.
 * Created when API version is frozen; v2 clients
 * always see the same tax set regardless of live changes.
 */
public record TaxConfigSnapshot(
    String version,           // e.g., "v2", "v8"
    List<Tax> taxes,
    Instant createdAt
) {}`,
  },
  "TaxCalculationStrategy.java": {
    path: "api/TaxCalculationStrategy.java",
    lang: "JAVA",
    description: "Strategy pattern for tax calculation algorithms",
    code: `package api;

import model.Tax;
import model.LineItem;
import java.math.BigDecimal;
import java.util.List;

@FunctionalInterface
public interface TaxCalculationStrategy {
    BigDecimal calculate(LineItem item, List<Tax> taxes);
}

/**
 * STRATEGY PATTERN: Compound tax calculation.
 * Example: Item=$100, Tax1=10%, Tax2=5%
 *   Tax1 = $100 × 10% = $10
 *   Tax2 = $110 × 5%  = $5.50  (tax on tax)
 *   Total Tax = $15.50
 */
class CompoundTaxStrategy
    implements TaxCalculationStrategy {

    @Override
    public BigDecimal calculate(
        LineItem item, List<Tax> taxes
    ) {
        BigDecimal base = item.subtotal();
        BigDecimal totalTax = BigDecimal.ZERO;

        for (Tax tax : taxes) {
            BigDecimal taxAmount = base
                .multiply(tax.rate())
                .divide(
                    new BigDecimal("100"), 2,
                    BigDecimal.ROUND_HALF_UP
                );
            totalTax = totalTax.add(taxAmount);
            // Compound: next tax applies on
            // base + previous taxes
            base = base.add(taxAmount);
        }
        return totalTax;
    }
}`,
  },
  "TaxConfigurationService.java": {
    path: "service/TaxConfigurationService.java",
    lang: "JAVA",
    description: "Thread-safe tax config manager with 3 concurrency primitives",
    code: `package service;

import model.Tax;
import model.TaxConfigSnapshot;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.time.Instant;

/**
 * Thread-safe tax configuration manager.
 *
 * CONCURRENCY DESIGN:
 * - ConcurrentHashMap: lock-free reads during
 *   high-concurrency tax lookups
 * - ReentrantReadWriteLock: write lock for
 *   add/delete/reorder (rare admin ops),
 *   read lock for getActiveTaxes (frequent)
 * - AtomicInteger: thread-safe sequence generation
 */
public class TaxConfigurationService {

    private final ConcurrentHashMap<String, Tax>
        taxRegistry = new ConcurrentHashMap<>();

    private final ReentrantReadWriteLock lock =
        new ReentrantReadWriteLock();

    private final AtomicInteger orderSequence =
        new AtomicInteger(0);

    private final Map<String, TaxConfigSnapshot>
        versionSnapshots = new ConcurrentHashMap<>();

    /**
     * Add tax. WRITE LOCK prevents concurrent
     * add/reorder conflicts.
     */
    public Tax addTax(
        String label, BigDecimal rate,
        boolean userModifiable, boolean autoPopulate
    ) {
        lock.writeLock().lock();
        try {
            int order =
                orderSequence.incrementAndGet();
            Tax tax = Tax.create(
                label, rate, order,
                userModifiable, autoPopulate
            );
            taxRegistry.put(tax.id(), tax);
            return tax;
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Reorder taxes. WRITE LOCK ensures atomic
     * reordering visible to all readers.
     */
    public void reorderTaxes(List<String> orderedIds) {
        lock.writeLock().lock();
        try {
            for (int i = 0; i < orderedIds.size(); i++) {
                String id = orderedIds.get(i);
                Tax existing = taxRegistry.get(id);
                if (existing != null) {
                    Tax reordered = new Tax(
                        existing.id(),
                        existing.label(),
                        existing.rate(),
                        i + 1,
                        existing.userModifiable(),
                        existing.autoPopulate()
                    );
                    taxRegistry.put(id, reordered);
                }
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Get active taxes. READ LOCK allows concurrent
     * reads, blocks during writes.
     */
    public List<Tax> getActiveTaxes(String apiVersion) {
        lock.readLock().lock();
        try {
            if (versionSnapshots
                    .containsKey(apiVersion)) {
                return new ArrayList<>(
                    versionSnapshots
                        .get(apiVersion).taxes()
                );
            }
            return taxRegistry.values().stream()
                .sorted(Comparator.comparingInt(
                    Tax::displayOrder
                ))
                .toList();
        } finally {
            lock.readLock().unlock();
        }
    }

    /**
     * Create immutable snapshot for API version.
     */
    public void createVersionSnapshot(String version) {
        lock.readLock().lock();
        try {
            List<Tax> current =
                new ArrayList<>(taxRegistry.values());
            versionSnapshots.put(
                version,
                new TaxConfigSnapshot(
                    version, current, Instant.now()
                )
            );
        } finally {
            lock.readLock().unlock();
        }
    }

    public boolean removeTax(String taxId) {
        lock.writeLock().lock();
        try {
            return taxRegistry.remove(taxId) != null;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public Optional<Tax> getTaxById(String id) {
        // ConcurrentHashMap allows lock-free get
        return Optional.ofNullable(
            taxRegistry.get(id)
        );
    }
}`,
  },
  "Demo.java": {
    path: "Demo.java",
    lang: "JAVA",
    description: "Runnable example with tax config, calculation, and thread safety demo",
    code: `import model.*;
import service.TaxConfigurationService;
import api.*;
import java.math.BigDecimal;
import java.util.*;

public class Demo {
    public static void main(String[] args) {
        TaxConfigurationService taxService =
            new TaxConfigurationService();

        // Admin: Configure taxes
        Tax vat = taxService.addTax(
            "VAT", new BigDecimal("20.00"), false, true
        );
        Tax gst = taxService.addTax(
            "GST", new BigDecimal("5.00"), true, false
        );
        Tax serviceTax = taxService.addTax(
            "Service Tax",
            new BigDecimal("10.00"), true, false
        );

        System.out.println("=== Tax Configuration ===");
        taxService.getActiveTaxes("v8").forEach(t ->
            System.out.printf(
                "%s: %.2f%% (Order: %d)%n",
                t.label(), t.rate(), t.displayOrder()
            )
        );

        // Create version snapshot
        taxService.createVersionSnapshot("v2");

        // Reorder taxes
        taxService.reorderTaxes(List.of(
            serviceTax.id(), vat.id(), gst.id()
        ));

        System.out.println("\\n=== After Reordering ===");
        taxService.getActiveTaxes("v8").forEach(t ->
            System.out.printf(
                "%s: %.2f%% (Order: %d)%n",
                t.label(), t.rate(), t.displayOrder()
            )
        );

        // User: Create invoice with line items
        LineItem item1 = new LineItem(
            "PROD-001",
            new BigDecimal("2"),
            new BigDecimal("100.00"),
            List.of(vat, gst)
        );
        LineItem item2 = new LineItem(
            "PROD-002",
            new BigDecimal("1"),
            new BigDecimal("50.00"),
            List.of(serviceTax)
        );

        // Calculate compound taxes
        CompoundTaxStrategy strategy =
            new CompoundTaxStrategy();
        BigDecimal tax1 = strategy.calculate(
            item1, item1.appliedTaxes()
        );
        BigDecimal tax2 = strategy.calculate(
            item2, item2.appliedTaxes()
        );

        System.out.println(
            "\\n=== Invoice Calculation ==="
        );
        System.out.printf(
            "Item1 Tax: $%.2f%n", tax1
        );
        System.out.printf(
            "Item2 Tax: $%.2f%n", tax2
        );
        System.out.printf(
            "Total Tax: $%.2f%n", tax1.add(tax2)
        );

        // Demonstrate thread safety
        System.out.println(
            "\\n=== Concurrent Access Test ==="
        );
        Thread admin = new Thread(() -> {
            taxService.addTax(
                "Luxury Tax",
                new BigDecimal("15.00"), false, true
            );
            System.out.println(
                "Admin added Luxury Tax"
            );
        });

        Thread user = new Thread(() -> {
            List<Tax> taxes =
                taxService.getActiveTaxes("v8");
            System.out.println(
                "User retrieved " +
                taxes.size() + " taxes"
            );
        });

        admin.start();
        user.start();
    }
}`,
  },
};

// ─── Complexity Analysis ─────────────────────────────────────

export const COMPLEXITY = {
  time: [
    {
      method: "addTax",
      complexity: "O(1)",
      detail: "ConcurrentHashMap put + AtomicInteger increment; write-locked",
    },
    {
      method: "reorderTaxes",
      complexity: "O(n)",
      detail: "Linear scan through n tax IDs with in-place record replacement",
    },
    {
      method: "getActiveTaxes",
      complexity: "O(n log n)",
      detail: "Stream sort by displayOrder across n taxes; read-locked",
    },
    {
      method: "calculate (compound)",
      complexity: "O(m·k)",
      detail: "m lineItems × k taxes per item, sequential compound calculation",
    },
    {
      method: "createVersionSnapshot",
      complexity: "O(n)",
      detail: "Copy all n taxes into immutable snapshot list",
    },
  ],
  space: [
    {
      component: "Tax Registry",
      complexity: "O(n)",
      detail: "n = active tax configurations in ConcurrentHashMap",
    },
    {
      component: "Version Snapshots",
      complexity: "O(v·n)",
      detail: "v = API versions × n taxes per snapshot; grows with version count",
    },
  ],
  concurrency: [
    {
      label: "ConcurrentHashMap",
      detail: "Lock-free reads for tax lookups (getTaxById) — no contention during high-concurrency record creation",
    },
    {
      label: "ReentrantReadWriteLock",
      detail: "Multiple concurrent readers (getActiveTaxes) OR single writer (addTax/reorder) — prevents dirty reads during reordering",
    },
    {
      label: "AtomicInteger",
      detail: "Thread-safe displayOrder sequence generation without synchronization overhead",
    },
  ],
};

// ─── Follow-Up Questions ────────────────────────────────────

export const FOLLOW_UPS = [
  {
    question: "How would you handle distributed deployments with tax config sync across multiple CRM instances?",
    answer:
      "Implement event-driven architecture using Kafka: tax config changes publish TaxConfigUpdatedEvent, all instances consume and update local cache; use Redis for distributed lock during admin updates to prevent split-brain scenarios.",
  },
  {
    question: "Tax rates change mid-transaction (user creating invoice while admin updates VAT 20%→18%). How to ensure consistency?",
    answer:
      "Apply snapshot isolation: Capture TaxConfigSnapshot at transaction start (invoice creation), freeze applied taxes using snapshot version; completed invoices reference historical snapshot, not live config.",
  },
  {
    question: "API versioning breaks when v2 clients expect 3 taxes but v8 added 2 more. How to prevent data loss?",
    answer:
      "Use schema evolution with defaults: v2 snapshot filters to original 3 taxes; new taxes flagged with sinceVersion=v8 metadata; v2 API responses omit newer taxes but preserve them in DB with null placeholders for backward compatibility.",
  },
  {
    question: "Mobile sync conflict: User edited line-item taxes offline, admin deleted that tax online. Resolution strategy?",
    answer:
      "Implement last-write-wins with validation: On sync, check if referenced tax IDs exist; if deleted, apply fallback strategy (use default tax or prompt user); log conflict event for audit trail and admin review dashboard.",
  },
  {
    question: "Compound tax calculation causes rounding errors ($0.01 discrepancies) in multi-currency invoices. Solution?",
    answer:
      "Use banker's rounding (RoundingMode.HALF_EVEN) consistently; store intermediate tax amounts as BigDecimal with scale=4 during calculation, round final tax total to scale=2; add TaxLineItem entity to persist per-tax breakdown for audit reconciliation.",
  },
];

// ─── Design Justification ───────────────────────────────────

export const DESIGN_PATTERNS = [
  {
    pattern: "Strategy Pattern",
    location: "CompoundTaxStrategy",
    detail:
      "Encapsulates tax calculation algorithms behind TaxCalculationStrategy interface — allows runtime swapping (e.g., SimpleAdditive vs. Compound) without modifying calling code.",
  },
  {
    pattern: "Template Method Pattern",
    location: "createVersionSnapshot()",
    detail:
      "Defines the snapshot creation skeleton (read-lock → copy → store); extensible hook for version-specific filtering logic (e.g., v2 excludes autoPopulate taxes).",
  },
];

export const SOLID_PRINCIPLE = {
  principle: "Open/Closed Principle (OCP)",
  detail:
    "TaxableDocument interface is open for extension (new document types: PurchaseOrder, CreditNote) but closed for modification. New tax calculation strategies (SimpleTaxStrategy, ExemptionStrategy) can be added without changing existing code — just implement TaxCalculationStrategy.",
};
