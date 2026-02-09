import { useState } from "react";
import { Icon } from "../components/ui";
import ValidationDiagram from "./ValidationDiagram";
import ValidationLLD from "./ValidationLLD";
import {
  PROJECT_META,
  REQUIREMENTS,
  APIS,
  DATA_MODEL,
  ENGINE_PSEUDOCODE,
  OPTIMIZATIONS,
  BOTTLENECKS,
  SUMMARY,
} from "./validationData";

// ──────────────────────────────────────
// Section wrapper — collapsible terminal-style
// ──────────────────────────────────────
function Section({ id, command, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="space-y-3" id={id}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-lg font-bold w-full text-left group"
      >
        <span className="text-success">➜</span>
        <span className="text-text group-hover:text-white transition-colors">
          {command}
        </span>
        <Icon
          name={open ? "expand_more" : "chevron_right"}
          size="text-sm"
          className="text-comment"
        />
      </button>
      {open && (
        <div className="animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          {children}
        </div>
      )}
    </section>
  );
}

// ──────────────────────────────────────
// CodeBlock
// ──────────────────────────────────────
function CodeBlock({ lang, children, title }) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      {title && (
        <div className="bg-border/30 px-3 py-1.5 text-xs text-comment border-b border-border flex items-center gap-2">
          <span className="text-variable">{lang}</span>
          <span className="text-comment/50">—</span>
          <span>{title}</span>
        </div>
      )}
      <pre className="p-3 text-xs leading-relaxed overflow-x-auto bg-sidebar/30">
        <code className="text-text">{children}</code>
      </pre>
    </div>
  );
}

// ──────────────────────────────────────
// Data Model Tabs
// ──────────────────────────────────────
function DataModelTabs() {
  const tabs = [
    { key: "postgres", label: "PostgreSQL", icon: "storage", color: "accent" },
    { key: "logs", label: "Logs (Partitioned)", icon: "schedule", color: "variable" },
    { key: "redis", label: "Redis", icon: "cached", color: "keyword" },
    { key: "kafka", label: "Kafka", icon: "stream", color: "success" },
  ];
  const [active, setActive] = useState("postgres");

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex border-b border-border bg-sidebar/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs border-b-2 transition-all whitespace-nowrap ${
              active === tab.key
                ? "border-current text-white bg-border/20"
                : "border-transparent text-comment hover:text-white"
            }`}
            style={active === tab.key ? { color: `var(--color-${tab.color})` } : {}}
          >
            <Icon name={tab.icon} size="text-[14px]" />
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="p-3 text-xs leading-relaxed overflow-x-auto bg-sidebar/20">
        <code className="text-text">{DATA_MODEL[active]}</code>
      </pre>
    </div>
  );
}

// ──────────────────────────────────────
// DiagramView — Interactive / Static toggle
// ──────────────────────────────────────
function DiagramView({ interactive, staticSrc, staticAlt }) {
  const [mode, setMode] = useState("interactive");
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-comment">View:</span>
        {["interactive", "static"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-2 py-1 rounded border transition-all capitalize ${
              mode === m
                ? "border-accent text-accent bg-accent/10 font-bold"
                : "border-border text-comment hover:text-white"
            }`}
          >
            {m === "interactive" ? "⚡ Interactive" : "🖼️ Static"}
          </button>
        ))}
      </div>
      {mode === "interactive" ? (
        interactive
      ) : (
        <div className="border border-border rounded-md overflow-hidden bg-sidebar/30">
          <div className="bg-border/30 px-3 py-1.5 text-xs text-comment border-b border-border flex items-center gap-2">
            <Icon name="image" size="text-[12px]" className="text-accent" />
            <span className="text-variable">{staticSrc.replace("/", "")}</span>
            <span className="text-comment/50">—</span>
            <span>{staticAlt}</span>
          </div>
          <div className="p-3 bg-[#1a1f2b]">
            <img
              src={staticSrc}
              alt={staticAlt}
              className="w-full rounded border border-border/50 bg-[#232a36]"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────
// ValidationProject — Full project page
// ──────────────────────────────────────
export default function ValidationProject({ onBack }) {
  const [activeTab, setActiveTab] = useState("hld");

  const tabs = [
    { key: "hld", label: "System Design (HLD)", icon: "architecture", color: "accent" },
    { key: "lld", label: "Low-Level Design (LLD)", icon: "code", color: "func" },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Breadcrumb bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 -mt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-comment hover:text-white transition-colors text-xs group"
        >
          <Icon
            name="arrow_back"
            size="text-sm"
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>portfolio/</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-comment">projects/</span>
        <span className="text-xs text-accent font-bold">
          record-validation.md
        </span>
        <div className="ml-auto flex items-center gap-2">
          {PROJECT_META.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold px-1.5 py-0.5 border border-border text-comment hidden sm:inline"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs text-success font-bold border border-success/30 px-1.5 py-0.5 rounded">
            {PROJECT_META.status}
          </span>
        </div>
      </div>

        {/* Title block */}
        <div className="space-y-3">
          <div className="text-xs text-comment tracking-widest uppercase">
            {PROJECT_META.company} · {PROJECT_META.role} · {PROJECT_META.period}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-keyword leading-tight">
            # {PROJECT_META.title}
          </h1>
          <p className="text-sm text-comment leading-relaxed">
            Architecture deep dive into the NIO-based record validation engine
            I built at Zoho — processing 2.3M records/hour via async workers
            while maintaining &lt;100ms real-time validation latency at 210 QPS
            peak.
          </p>
        </div>

        {/* ── HLD / LLD Tab Switcher ── */}
        <div className="border border-border rounded-md overflow-hidden">
          <div className="flex bg-sidebar/60 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-current text-white bg-border/20"
                    : "border-transparent text-comment hover:text-white hover:bg-border/10"
                }`}
                style={
                  activeTab === tab.key
                    ? { color: `var(--color-${tab.color})` }
                    : {}
                }
              >
                <Icon name={tab.icon} size="text-base" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="px-1 py-2 text-[10px] text-comment flex items-center gap-2">
            <Icon name="info" size="text-[12px]" className="text-comment/60" />
            {activeTab === "hld"
              ? "High-level system architecture with NIO workers, data flow, and validation engine deep dive"
              : "Class-level design with Java 17 records, CompletableFuture patterns, and circuit breaker"}
          </div>
        </div>

        {/* ─── Tab Content ─── */}
        {activeTab === "lld" ? (
          <ValidationLLD />
        ) : (
        <>
        {/* ── 1. Requirements ── */}
        <Section id="requirements" command="cat requirements.spec">
          <div className="space-y-4">
            <h3 className="text-sm text-variable font-bold">
              Functional Requirements
            </h3>
            <div className="space-y-2">
              {REQUIREMENTS.functional.map((req, i) => (
                <div
                  key={i}
                  className="border border-border rounded-md p-3 sm:p-4 bg-sidebar/20"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-success text-xs font-bold shrink-0">
                      [{i + 1}]
                    </span>
                    <div>
                      <span className="text-accent text-xs font-bold">
                        {req.title}
                      </span>
                      <p className="text-xs text-comment mt-1 leading-relaxed">
                        {req.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm text-variable font-bold pt-2">
              Non-Functional Requirements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {REQUIREMENTS.nonFunctional.map((nfr) => (
                <div
                  key={nfr.label}
                  className="border border-border rounded-md p-3 sm:p-4 bg-sidebar/20"
                >
                  <div className="text-xs text-keyword font-bold mb-1">
                    {nfr.label}
                  </div>
                  <p className="text-xs text-comment leading-relaxed">
                    {nfr.value}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-sm text-variable font-bold pt-2">
              Scale Estimates
            </h3>
            <CodeBlock lang="CALC" title="Back-of-the-envelope estimates">
              {REQUIREMENTS.scaleEstimates}
            </CodeBlock>
          </div>
        </Section>

        {/* ── 2. Architecture Diagram ── */}
        <Section
          id="architecture"
          command="./render_architecture.sh --interactive"
        >
          <DiagramView
            interactive={<ValidationDiagram />}
            staticSrc="/nio_field_validation.png"
            staticAlt="NIO Record Validation System Architecture"
          />
        </Section>

        {/* ── 3. API & Data Model ── */}
        <Section id="api" command="cat api_spec.yaml">
          <div className="space-y-4">
            {APIS.map((api) => (
              <div key={api.title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      api.method === "POST"
                        ? "bg-success/15 text-success border border-success/30"
                        : api.method === "GET"
                        ? "bg-accent/15 text-accent border border-accent/30"
                        : "bg-variable/15 text-variable border border-variable/30"
                    }`}
                  >
                    {api.method}
                  </span>
                  <span className="text-xs text-text font-bold">
                    {api.title}
                  </span>
                </div>
                <div className="text-xs text-comment font-mono bg-border/20 px-2 py-1 rounded border border-border inline-block">
                  {api.endpoint}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {api.request && (
                    <CodeBlock lang="JSON" title="Request">
                      {api.request}
                    </CodeBlock>
                  )}
                  <CodeBlock lang="JSON" title="Response">
                    {api.response}
                  </CodeBlock>
                </div>
              </div>
            ))}

            <h3 className="text-sm text-variable font-bold pt-4">Data Model</h3>
            <DataModelTabs />

            <div className="border-l-2 border-accent/40 pl-3 mt-3">
              <p className="text-xs text-comment leading-relaxed italic">
                <span className="text-accent font-bold not-italic">
                  DB Choice:
                </span>{" "}
                PostgreSQL for strong consistency on rule updates (critical to
                prevent stale rules causing data integrity issues) and JSONB
                support for flexible rule configurations. Time-series
                partitioning on logs handles high write volume (69 QPS
                sustained) with automatic monthly partition management.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 4. NIO Worker Deep Dive ── */}
        <Section id="engine" command="cat nio_validation_worker.py --annotated">
          <div className="space-y-4">
            <div className="border border-border rounded-md bg-sidebar/20 p-3 space-y-2">
              <h4 className="text-xs text-func font-bold">Internal Workflow</h4>
              <div className="flex flex-wrap items-center gap-1 text-xs">
                {[
                  "Kafka Consume",
                  "Rule Compilation",
                  "Concurrent Validation (1K batch)",
                  "Circuit Breaker (External API)",
                  "Result Aggregation",
                  "S3 Stream (10K chunks)",
                ].map((step, i, arr) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded border border-border text-comment bg-border/20">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-success">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-md bg-sidebar/20 p-3 space-y-2">
              <h4 className="text-xs text-func font-bold">Scaling Strategy</h4>
              <ul className="text-xs text-comment leading-relaxed space-y-1">
                {[
                  [
                    "Horizontal Scaling",
                    "Add workers per Kafka partition — each consumes independently. Scale from 3 to N instances based on consumer lag.",
                  ],
                  [
                    "Rule Caching",
                    "Redis stores compiled rules with 5-min TTL + pub/sub invalidation on rule updates. Regex patterns compiled once per batch.",
                  ],
                  [
                    "External API Optimization",
                    "Cache negative results (invalid emails) for 1 hour, reducing external API calls by 60% and cutting third-party costs.",
                  ],
                  [
                    "Backpressure Handling",
                    "Workers pause Kafka consumption if S3 write latency exceeds 500ms, preventing memory overflow on downstream bottlenecks.",
                  ],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-2">
                    <span className="text-accent shrink-0">▸</span>
                    <span>
                      <span className="text-variable font-bold">{label}:</span>{" "}
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <CodeBlock
              lang="PYTHON"
              title="NIO Validation Worker — asyncio Core Logic"
            >
              {ENGINE_PSEUDOCODE}
            </CodeBlock>

            <h3 className="text-sm text-variable font-bold pt-2">
              Key Optimizations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OPTIMIZATIONS.map((opt) => (
                <div
                  key={opt.title}
                  className="border border-border rounded-md p-4 bg-sidebar/20 flex gap-3"
                >
                  <span className="text-lg shrink-0">{opt.icon}</span>
                  <div>
                    <div className="text-xs text-accent font-bold">
                      {opt.title}
                    </div>
                    <p className="text-xs text-comment mt-1 leading-relaxed">
                      {opt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 5. Bottlenecks & Trade-offs ── */}
        <Section id="tradeoffs" command="cat postmortem_notes.md">
          <div className="space-y-4">
            <div className="border border-keyword/30 rounded-md p-4 bg-keyword/5 space-y-2">
              <h4 className="text-xs text-keyword font-bold">
                ⚠ Single Point of Failure: {BOTTLENECKS.spof.title}
              </h4>
              <p className="text-xs text-comment leading-relaxed">
                {BOTTLENECKS.spof.problem}
              </p>
              <div className="text-xs text-variable font-bold pt-1">
                Mitigations:
              </div>
              <ul className="text-xs text-comment leading-relaxed space-y-1">
                {BOTTLENECKS.spof.mitigations.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-success shrink-0">▸</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-func/30 rounded-md p-4 bg-func/5 space-y-2">
              <h4 className="text-xs text-func font-bold">
                ⚖ Trade-off: {BOTTLENECKS.tradeoff.title}
              </h4>
              <div className="text-xs text-success font-bold">
                Decision: {BOTTLENECKS.tradeoff.decision}
              </div>
              <ol className="text-xs text-comment leading-relaxed space-y-1 list-none">
                {BOTTLENECKS.tradeoff.rationale.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent shrink-0">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
              <div className="border-l-2 border-keyword/40 pl-3 mt-2">
                <p className="text-xs text-comment italic">
                  <span className="text-keyword font-bold not-italic">
                    Rejected Alternative:
                  </span>{" "}
                  {BOTTLENECKS.tradeoff.rejected}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Summary ── */}
        <div className="border-t border-border pt-6 space-y-3">
          <div className="text-lg font-bold">
            <span className="text-success">➜</span> echo $CONCLUSION
          </div>
          <div className="border-l-4 border-success/40 pl-4">
            <p className="text-xs text-comment leading-relaxed">{SUMMARY}</p>
          </div>
        </div>
        </>
        )}

        {/* Back button footer */}
        <div className="pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-comment hover:text-accent transition-colors group"
          >
            <Icon
              name="arrow_back"
              size="text-sm"
              className="group-hover:-translate-x-1 transition-transform"
            />
            cd ../portfolio
          </button>
        </div>
    </div>
  );
}
