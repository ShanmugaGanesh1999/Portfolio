// ============================================================
// EDITOR CONTENT — renders the ACTIVE tab's content.
// Project viewers are lazy-loaded so the initial bundle stays
// small (fast first paint on low-end machines).
// ============================================================

import { lazy, Suspense } from "react";
import DocumentEditor from "./DocumentEditor";
import { PERSONAL, STATS } from "../data/portfolioData";
import { DOCUMENTS } from "./documents";
import { PROJECT_TABS } from "./registry";
import { useWorkspace } from "./WorkspaceContext";
import { PREP_COURSES } from "../prep/prepData";

// Prep pulls in the markdown/mermaid stack — keep it out of the main bundle.
const PrepPlatform = lazy(() => import("../prep/PrepPlatform"));

const PROJECT_VIEWS = {
  "rollup-summary": lazy(() => import("../projects/RollupSummaryProject")),
  "tax-config": lazy(() => import("../projects/TaxConfigProject")),
  "record-validation": lazy(() => import("../projects/ValidationProject")),
  "recent-items": lazy(() => import("../projects/RecentItemsProject")),
  "market-data": lazy(() => import("../projects/MarketDataProject")),
  "access-mgmt": lazy(() => import("../projects/AccessMgmtProject")),
  "ml-lead-scoring": lazy(() => import("../projects/MLLeadScoringProject")),
};

function WelcomeDocument() {
  const ws = useWorkspace();
  return (
    <article className="max-w-4xl mx-auto py-8 px-5 sm:px-10 font-mono" style={{ fontSize: "var(--editor-font-size, 14px)" }} aria-label="Portfolio welcome">
      <p className="text-comment text-xs mb-5">portfolio / welcome.md</p>
      <h1 className="text-2xl font-medium mb-2">{PERSONAL.name}</h1>
      <p className="text-comment mb-5">{PERSONAL.role}</p>
      <p className="leading-relaxed max-w-2xl mb-4">{PERSONAL.focus}.</p>
      <p className="text-comment text-xs mb-8">{PERSONAL.location} · {PERSONAL.status}</p>
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        <section aria-labelledby="welcome-documents">
          <h2 id="welcome-documents" className="text-comment text-xs uppercase tracking-wider mb-3">Explore</h2>
          {DOCUMENTS.map((document) => <button key={document.id} className="block text-accent hover:underline py-1.5 text-left" onClick={() => ws.openTab(document.id)}>{document.title}</button>)}
        </section>
        <section aria-labelledby="welcome-projects">
          <h2 id="welcome-projects" className="text-comment text-xs uppercase tracking-wider mb-3">Project walkthroughs</h2>
          {Object.entries(PROJECT_TABS).map(([id, project]) => <button key={id} className="block text-accent hover:underline py-1.5 text-left" onClick={() => ws.openTab(id)}>{project.title}</button>)}
        </section>
      </div>
      <div className="border-t border-border mt-8 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-comment">{STATS.map((stat) => <span key={stat.label}>{stat.label.toLowerCase()}: <span className="text-text">{stat.value} {stat.unit}</span></span>)}</div>
      <div className="flex flex-wrap gap-4 text-xs mt-6">
        <button className="text-comment hover:text-text" onClick={() => ws.openPalette('files')}>Quick Open</button>
        <button className="text-comment hover:text-text" onClick={() => ws.openPalette('search')}>Search documents</button>
        <button className="text-comment hover:text-text" onClick={() => ws.setChat(true)}>Ask about my work</button>
      </div>
    </article>
  );
}

function EditorLoading({ title }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-xs text-comment font-mono">
        <span className="text-accent">import</span>{" "}
        <span className="text-string">"{title}"</span> …
        <span className="animate-blink text-accent">▊</span>
      </div>
    </div>
  );
}

/**
 * EditorContent — the active tab's document.
 * @param {Object} tab - Tab descriptor from the workspace registry
 * @param {string} prepFile - Active file path when tab.kind === 'prep'
 * @param {Function} onNavigatePrep - (courseId, filePath) => void
 * @param {Function} onBack - close the active tab (project/prep "back" buttons)
 */
export default function EditorContent({ tab, prepFile, onNavigatePrep, onBack }) {
  if (tab.kind === "document") return <DocumentEditor key={tab.id} tab={tab} />;

  if (tab.kind === "project") {
    const View = PROJECT_VIEWS[tab.id];
    if (!View) return <EditorLoading title={tab.title} />;
    return (
      <Suspense fallback={<EditorLoading title={tab.title} />}>
        <View key={tab.id} onBack={onBack} />
      </Suspense>
    );
  }

  if (tab.kind === "prep") {
    const course = PREP_COURSES.find((c) => c.id === tab.id.slice(5));
    if (!course) return <EditorLoading title={tab.title} />;
    return (
      <Suspense fallback={<EditorLoading title={tab.title} />}>
        <PrepPlatform
          key={tab.id}
          course={course}
          filePath={prepFile}
          onBack={onBack}
          onNavigate={onNavigatePrep}
        />
      </Suspense>
    );
  }

  return <WelcomeDocument />;
}
