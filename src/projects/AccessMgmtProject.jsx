import { useState } from "react";
import { Icon } from "../components/ui";
import AccessMgmtDiagram from "./AccessMgmtDiagram";
import AccessMgmtLLD from "./AccessMgmtLLD";
import {
  PROJECT_META,
  REQUIREMENTS,
  APIS,
  DATA_MODEL,
  AUTHZ_PSEUDOCODE,
  OPTIMIZATIONS,
  BOTTLENECKS,
  SUMMARY,
} from "./accessMgmtData";
import { Section, CodeBlock, DiagramView } from "./viewer/parts";

// ──────────────────────────────────────
// Tab system for data model
// ──────────────────────────────────────
function DataModelTabs() {
  const tabs = [
    { key: "users", label: "Users", icon: "person", color: "accent" },
    { key: "policies", label: "Policies", icon: "shield", color: "keyword" },
    { key: "userRoles", label: "User Roles", icon: "group", color: "func" },
    { key: "redis", label: "Redis / Cache", icon: "bolt", color: "keyword" },
  ];
  const [active, setActive] = useState("users");

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex border-b border-border bg-sidebar/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs border-b-2 transition-all whitespace-nowrap ${
              active === tab.key
                ? "border-current text-text bg-border/20"
                : "border-transparent text-comment hover:text-text"
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
// AccessMgmtProject — Full project page
// ──────────────────────────────────────
export default function AccessMgmtProject({ onBack }) {
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
          className="flex items-center gap-1 text-comment hover:text-text transition-colors text-xs group"
        >
          <Icon name="arrow_back" size="text-sm" className="group-hover:-translate-x-0.5 transition-transform" />
          <span>portfolio/</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-comment">projects/</span>
        <span className="text-xs text-accent font-bold">campus-iam-platform.md</span>
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
          A deep dive into the identity and access management platform I designed and built at Case Western Reserve
          University — providing unified OAuth2 SSO and fine-grained RBAC/ABAC policy evaluation for 50K campus users
          with &lt;200ms authorization latency via a two-tier cache strategy.
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
                  ? "border-current text-text bg-border/20"
                  : "border-transparent text-comment hover:text-text hover:bg-border/10"
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
            ? "High-level system architecture with OAuth2 SSO, RBAC/ABAC policy engine, and two-tier cache strategy"
            : "Class-level design with Java 17 records, ConcurrentHashMap token cache, and ReentrantReadWriteLock policy engine"}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === "lld" ? (
          <AccessMgmtLLD />
        ) : (
        <>
      {/* ── 1. Requirements ── */}
      <Section id="requirements" command="cat requirements.spec" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="text-sm text-variable font-bold">Functional Requirements</h3>
          <div className="space-y-2">
            {REQUIREMENTS.functional.map((req, i) => (
              <div key={i} className="border border-border rounded-md p-3 sm:p-4 bg-sidebar/20">
                <div className="flex items-start gap-2">
                  <span className="text-success text-xs font-bold shrink-0">[{i + 1}]</span>
                  <div>
                    <span className="text-accent text-xs font-bold">{req.title}</span>
                    <p className="text-xs text-comment mt-1 leading-relaxed">{req.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm text-variable font-bold pt-2">Non-Functional Requirements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {REQUIREMENTS.nonFunctional.map((nfr) => (
              <div key={nfr.label} className="border border-border rounded-md p-3 sm:p-4 bg-sidebar/20">
                <div className="text-xs text-keyword font-bold mb-1">{nfr.label}</div>
                <p className="text-xs text-comment leading-relaxed">{nfr.value}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm text-variable font-bold pt-2">Scale Estimates</h3>
          <CodeBlock lang="CALC" title="Back-of-the-envelope estimates">
            {REQUIREMENTS.scaleEstimates}
          </CodeBlock>
        </div>
      </Section>

      {/* ── 2. Architecture Diagram ── */}
      <Section id="architecture" command="./render_architecture.sh --interactive" defaultOpen={true}>
        <DiagramView
          interactive={<AccessMgmtDiagram />}
          staticSrc="/access_service_mgmt.png"
          staticAlt="Campus IAM Platform Architecture"
        />
      </Section>

      {/* ── 3. API & Data Model ── */}
      <Section id="api" command="cat api_spec.yaml" defaultOpen={true}>
        <div className="space-y-4">
          {APIS.map((api) => (
            <div key={api.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  api.method === "POST"
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-accent/15 text-accent border border-accent/30"
                }`}>
                  {api.method}
                </span>
                <span className="text-xs text-text font-bold">{api.title}</span>
              </div>
              <div className="text-xs text-comment font-mono bg-border/20 px-2 py-1 rounded border border-border inline-block">
                {api.endpoint}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {api.request && (
                  <CodeBlock lang="HTTP" title="Request">{api.request}</CodeBlock>
                )}
                <CodeBlock lang="JSON" title="Response">{api.response}</CodeBlock>
              </div>
            </div>
          ))}

          <h3 className="text-sm text-variable font-bold pt-4">Data Model</h3>
          <DataModelTabs />

          <div className="border-l-2 border-accent/40 pl-3 mt-3">
            <p className="text-xs text-comment leading-relaxed italic">
              <span className="text-accent font-bold not-italic">DB Choice:</span>{" "}
              PostgreSQL chosen over Cassandra because (1) access patterns require complex JOINs
              (user → roles → policies) unsuitable for wide-column stores, (2) strong consistency
              is mandatory for revocations (cannot allow access after role removal), and (3) &lt;10 QPS
              write load doesn&apos;t require horizontal write scaling.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 4. Authorization Service Deep Dive ── */}
      <Section id="authz-deep-dive" command="cat authz_service.py --annotated" defaultOpen={true}>
        <div className="space-y-4">
          <div className="border border-border rounded-md bg-sidebar/20 p-3 space-y-2">
            <h4 className="text-xs text-func font-bold">Why This Component is Critical</h4>
            <p className="text-xs text-comment leading-relaxed">
              The Authorization Service (Policy Decision Point) is the most architecturally complex component because
              it must evaluate RBAC + ABAC policies (role membership + time/location conditions) in &lt;200ms,
              handle 95% of campus access checks (door swipes dominate traffic), and scale cache invalidation
              without stale denials (security risk).
            </p>
          </div>

          <div className="border border-border rounded-md bg-sidebar/20 p-3 space-y-2">
            <h4 className="text-xs text-func font-bold">Cache Strategy (L1 + L2)</h4>
            <div className="flex flex-wrap items-center gap-1 text-xs">
              {[
                "Request In",
                "L1 Caffeine (60s)",
                "L2 Redis (5min)",
                "DB: Users + Roles",
                "DB: Policies",
                "ABAC Eval",
                "Cache + Return",
              ].map((step, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded border border-border text-comment bg-border/20">
                    {step}
                  </span>
                  {i < arr.length - 1 && <span className="text-success">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-border rounded-md bg-sidebar/20 p-3 space-y-2">
            <h4 className="text-xs text-func font-bold">Scaling Mechanisms</h4>
            <ul className="text-xs text-comment leading-relaxed space-y-1">
              {[
                ["Cache Warming", "K8s CronJob pre-populates Redis with common (user, resource) pairs using access logs — avoids latency spikes at 8am class start"],
                ["Read Replicas", "PostgreSQL read replicas handle policy queries; writes (policy updates) go to primary — complex JOINs benefit from relational model"],
                ["Graceful Degradation", "On Redis failure, serve from PostgreSQL with circuit breaker — fail open after 3 consecutive DB timeouts to prevent campus lockout"],
                ["Kafka Invalidation", "PolicyChanged events trigger targeted cache eviction — no TTL-based stale denials for security-critical policy updates"],
              ].map(([label, desc]) => (
                <li key={label} className="flex gap-2">
                  <span className="text-accent shrink-0">▸</span>
                  <span><span className="text-variable font-bold">{label}:</span> {desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <CodeBlock lang="PYTHON" title="Authorization Service Core Logic (PDP)">
            {AUTHZ_PSEUDOCODE}
          </CodeBlock>

          <h3 className="text-sm text-variable font-bold pt-2">Key Optimizations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPTIMIZATIONS.map((opt) => (
              <div key={opt.title} className="border border-border rounded-md p-4 bg-sidebar/20 flex gap-3">
                <span className="text-lg shrink-0">{opt.icon}</span>
                <div>
                  <div className="text-xs text-accent font-bold">{opt.title}</div>
                  <p className="text-xs text-comment mt-1 leading-relaxed">{opt.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 5. Bottlenecks & Trade-offs ── */}
      <Section id="tradeoffs" command="cat postmortem_notes.md" defaultOpen={true}>
        <div className="space-y-4">
          <div className="border border-keyword/30 rounded-md p-4 bg-keyword/5 space-y-2">
            <h4 className="text-xs text-keyword font-bold">
              ⚠ Single Point of Failure: {BOTTLENECKS.spof.title}
            </h4>
            <p className="text-xs text-comment leading-relaxed">
              {BOTTLENECKS.spof.problem}
            </p>
            <div className="text-xs text-variable font-bold pt-1">Mitigations:</div>
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
                <span className="text-keyword font-bold not-italic">Rejected Alternative:</span>{" "}
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
          <Icon name="arrow_back" size="text-sm" className="group-hover:-translate-x-1 transition-transform" />
          cd ../portfolio
        </button>
      </div>
    </div>
  );
}
