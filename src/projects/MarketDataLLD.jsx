import { useState } from "react";
import { Icon } from "../components/ui";
import {
  LLD_META,
  PROBLEM_SCOPE,
  KEY_APIS,
  UML_CLASSES,
  UML_RELATIONSHIPS,
  CODE_FILES,
  COMPLEXITY,
  FOLLOW_UPS,
  DESIGN_PATTERNS,
  SOLID_PRINCIPLE,
} from "./marketDataLLDData";

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
        <div
          className="animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          {children}
        </div>
      )}
    </section>
  );
}

// ──────────────────────────────────────
// CodeBlock — syntax-highlighted code panel
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
// UML Class Diagram — Visual representation
// ──────────────────────────────────────
function UMLClassCard({ cls }) {
  const colorVar = `var(--color-${cls.color})`;
  return (
    <div
      className="border rounded-md overflow-hidden bg-sidebar/30 transition-all hover:shadow-lg hover:shadow-accent/5"
      style={{ borderColor: colorVar }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 text-xs font-bold text-center border-b"
        style={{
          backgroundColor: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
          borderColor: colorVar,
          color: colorVar,
        }}
      >
        {cls.stereotype && (
          <div className="text-[10px] font-normal opacity-70 mb-0.5">
            &laquo;{cls.stereotype}&raquo;
          </div>
        )}
        {cls.name}
      </div>

      {/* Fields */}
      {cls.fields.length > 0 && (
        <div className="px-3 py-2 border-b border-border/50 space-y-0.5">
          {cls.fields.map((f, i) => (
            <div key={i} className="text-[11px] font-mono text-comment flex gap-1">
              {f.visibility && (
                <span
                  className="shrink-0"
                  style={{ color: f.visibility === "+" ? "var(--color-success)" : "var(--color-keyword)" }}
                >
                  {f.visibility}
                </span>
              )}
              <span className="text-text">{f.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Methods */}
      {cls.methods.length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          {cls.methods.map((m, i) => (
            <div key={i} className="text-[11px] font-mono text-comment flex gap-1">
              <span className="text-success shrink-0">{m.visibility}</span>
              <span className="text-func">{m.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UMLDiagram() {
  return (
    <div className="space-y-4">
      {/* Class cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {UML_CLASSES.map((cls) => (
          <UMLClassCard key={cls.name} cls={cls} />
        ))}
      </div>

      {/* Relationships */}
      <div className="border border-border rounded-md overflow-hidden bg-sidebar/20">
        <div className="bg-border/30 px-3 py-1.5 text-xs text-comment border-b border-border flex items-center gap-2">
          <Icon name="account_tree" size="text-[12px]" className="text-func" />
          <span className="text-variable">Relationships</span>
        </div>
        <div className="p-3 space-y-1.5">
          {UML_RELATIONSHIPS.map((rel, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-accent font-bold font-mono">{rel.from}</span>
              <span className="text-comment">──▶</span>
              <span className="text-variable font-bold font-mono">{rel.to}</span>
              <span className="text-comment italic ml-1">({rel.label})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// Code File Tabs — Java 17 source files
// ──────────────────────────────────────
function CodeFileTabs() {
  const fileKeys = Object.keys(CODE_FILES);
  const [active, setActive] = useState(fileKeys[0]);
  const file = CODE_FILES[active];

  const tabColors = {
    "MarketData.java": "accent",
    "AggregatedQuote.java": "success",
    "DataSource.java": "func",
    "DataSourceAdapter.java": "variable",
    "MarketDataRepository.java": "func",
    "MarketDataAggregator.java": "keyword",
    "SimulatedPollingAdapter.java": "string",
    "MarketDataDemo.java": "accent",
  };

  return (
    <div className="border border-border rounded-md overflow-hidden">
      {/* File tabs */}
      <div className="flex border-b border-border bg-sidebar/50 overflow-x-auto">
        {fileKeys.map((key) => {
          const color = tabColors[key] || "accent";
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs border-b-2 transition-all whitespace-nowrap ${
                active === key
                  ? "border-current text-white bg-border/20"
                  : "border-transparent text-comment hover:text-white"
              }`}
              style={active === key ? { color: `var(--color-${color})` } : {}}
            >
              <Icon name="code" size="text-[14px]" />
              {key}
            </button>
          );
        })}
      </div>

      {/* File info bar */}
      <div className="bg-border/20 px-3 py-1.5 text-[10px] text-comment border-b border-border flex items-center gap-3">
        <span className="text-variable font-mono">{file.path}</span>
        <span className="text-comment/50">·</span>
        <span>{file.description}</span>
      </div>

      {/* Code content */}
      <pre className="p-3 text-xs leading-relaxed overflow-x-auto bg-sidebar/20">
        <code className="text-text">{file.code}</code>
      </pre>
    </div>
  );
}

// ──────────────────────────────────────
// Complexity Analysis Cards
// ──────────────────────────────────────
function ComplexityAnalysis() {
  return (
    <div className="space-y-4">
      {/* Time Complexity */}
      <div className="space-y-2">
        <h4 className="text-xs text-variable font-bold flex items-center gap-2">
          <Icon name="timer" size="text-[14px]" className="text-accent" />
          Time Complexity
        </h4>
        <div className="space-y-1.5">
          {COMPLEXITY.time.map((item) => (
            <div
              key={item.method}
              className="border border-border rounded-md p-3 bg-sidebar/20 flex items-start gap-3"
            >
              <span className="text-func font-mono text-xs font-bold shrink-0 bg-func/10 px-1.5 py-0.5 rounded border border-func/20">
                {item.complexity}
              </span>
              <div>
                <span className="text-xs text-accent font-bold font-mono">
                  {item.method}()
                </span>
                <p className="text-[11px] text-comment mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Space / Memory Footprint */}
      <div className="space-y-2">
        <h4 className="text-xs text-variable font-bold flex items-center gap-2">
          <Icon name="memory" size="text-[14px]" className="text-keyword" />
          Memory Footprint
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {COMPLEXITY.space.map((item) => (
            <div
              key={item.component}
              className="border border-border rounded-md p-3 bg-sidebar/20"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-keyword font-bold">
                  {item.component}
                </span>
                <span className="text-xs font-mono text-func font-bold bg-func/10 px-1.5 py-0.5 rounded border border-func/20">
                  {item.complexity}
                </span>
              </div>
              <p className="text-[11px] text-comment">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concurrency */}
      <div className="space-y-2">
        <h4 className="text-xs text-variable font-bold flex items-center gap-2">
          <Icon name="sync" size="text-[14px]" className="text-success" />
          Concurrency Primitives
        </h4>
        <div className="space-y-2">
          {COMPLEXITY.concurrency.map((item) => (
            <div
              key={item.label}
              className="border border-border rounded-md p-3 bg-sidebar/20"
            >
              <span className="text-xs text-success font-bold font-mono">{item.label}</span>
              <p className="text-[11px] text-comment mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// Follow-up Questions — Accordion
// ──────────────────────────────────────
function FollowUpQuestions() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-2">
      {FOLLOW_UPS.map((faq, i) => (
        <div
          key={i}
          className="border border-border rounded-md overflow-hidden transition-all"
        >
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left px-4 py-3 flex items-start gap-2 hover:bg-border/20 transition-colors"
          >
            <span className="text-accent font-bold text-xs shrink-0 mt-0.5">
              Q{i + 1}
            </span>
            <span className="text-xs text-text leading-relaxed flex-1">
              {faq.question}
            </span>
            <Icon
              name={expanded === i ? "expand_more" : "chevron_right"}
              size="text-sm"
              className="text-comment shrink-0 mt-0.5"
            />
          </button>
          {expanded === i && (
            <div
              className="px-4 pb-3 animate-fade-in-up"
              style={{ animationDuration: "0.2s" }}
            >
              <div className="border-l-2 border-success/40 pl-3 ml-5">
                <p className="text-[11px] text-comment leading-relaxed">
                  <span className="text-success font-bold">A:</span>{" "}
                  {faq.answer}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────
// MarketDataLLD — Full LLD page
// ──────────────────────────────────────
export default function MarketDataLLD() {
  return (
    <div className="space-y-10">
      {/* ── 1. Problem Scope & Assumptions ── */}
      <Section
        id="lld-scope"
        command="cat problem_scope.md"
        defaultOpen={true}
      >
        <div className="space-y-4">
          {/* Core Requirements */}
          <h3 className="text-sm text-variable font-bold">Core Requirements</h3>
          <div className="space-y-2">
            {PROBLEM_SCOPE.coreRequirements.map((req, i) => (
              <div
                key={i}
                className="border border-border rounded-md p-4 bg-sidebar/20"
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

          {/* Critical Assumptions */}
          <h3 className="text-sm text-variable font-bold pt-2">
            Critical Assumptions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROBLEM_SCOPE.assumptions.map((a) => (
              <div
                key={a.label}
                className="border border-border rounded-md p-4 bg-sidebar/20"
              >
                <div className="text-xs text-keyword font-bold mb-1">
                  {a.label}
                </div>
                <p className="text-xs text-comment leading-relaxed">
                  {a.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Core Entities */}
          <h3 className="text-sm text-variable font-bold pt-2">
            Core Entities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROBLEM_SCOPE.coreEntities.map((e) => (
              <div
                key={e.name}
                className="border rounded-md p-4 bg-sidebar/20"
                style={{
                  borderColor: `var(--color-${e.color})`,
                }}
              >
                <div
                  className="text-xs font-bold font-mono mb-1"
                  style={{ color: `var(--color-${e.color})` }}
                >
                  {e.name}
                </div>
                <p className="text-[11px] text-comment leading-relaxed">
                  {e.description}
                </p>
              </div>
            ))}
          </div>

          {/* Key APIs */}
          <h3 className="text-sm text-variable font-bold pt-2">API Signatures</h3>
          <div className="space-y-2">
            {KEY_APIS.map((api) => (
              <div
                key={api.signature}
                className="border border-border rounded-md p-3 bg-sidebar/20 flex items-start gap-3"
              >
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded border shrink-0"
                  style={{
                    color: `var(--color-${api.color})`,
                    borderColor: `color-mix(in srgb, var(--color-${api.color}) 30%, transparent)`,
                    backgroundColor: `color-mix(in srgb, var(--color-${api.color}) 10%, transparent)`,
                  }}
                >
                  {api.method}
                </span>
                <div>
                  <code className="text-xs text-text font-mono">
                    {api.signature}
                  </code>
                  <p className="text-[11px] text-comment mt-0.5">
                    {api.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 2. UML Class Diagram ── */}
      <Section
        id="lld-uml"
        command="./render_uml.sh --class-diagram"
        defaultOpen={true}
      >
        <UMLDiagram />
      </Section>

      {/* ── 3. Java 17 Code ── */}
      <Section
        id="lld-code"
        command="find src/ -name '*.java' | xargs cat"
        defaultOpen={true}
      >
        <CodeFileTabs />
      </Section>

      {/* ── 4. Complexity Analysis ── */}
      <Section
        id="lld-complexity"
        command="cat complexity_analysis.md"
        defaultOpen={true}
      >
        <ComplexityAnalysis />
      </Section>

      {/* ── 5. Follow-Up Questions ── */}
      <Section
        id="lld-followups"
        command="cat interview_questions.md --top-5"
        defaultOpen={true}
      >
        <FollowUpQuestions />
      </Section>

      {/* ── 6. Design Justification ── */}
      <Section
        id="lld-justification"
        command="git log --format='%s' -- DESIGN_DECISIONS.md"
        defaultOpen={true}
      >
        <div className="space-y-4">
          <h3 className="text-sm text-variable font-bold">Design Patterns Used</h3>
          <div className="space-y-2">
            {DESIGN_PATTERNS.map((dp) => (
              <div
                key={dp.pattern}
                className="border border-border rounded-md p-4 bg-sidebar/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-func font-bold">
                    {dp.pattern}
                  </span>
                  <span className="text-[10px] text-comment font-mono bg-border/30 px-1.5 py-0.5 rounded">
                    {dp.location}
                  </span>
                </div>
                <p className="text-xs text-comment leading-relaxed">
                  {dp.detail}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-sm text-variable font-bold pt-2">
            SOLID Principle
          </h3>
          <div className="border-l-4 border-accent/40 pl-4 bg-sidebar/20 p-4 rounded-r-md">
            <div className="text-xs text-accent font-bold mb-1">
              {SOLID_PRINCIPLE.principle}
            </div>
            <p className="text-xs text-comment leading-relaxed">
              {SOLID_PRINCIPLE.detail}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
