// ============================================================
// EDITOR CONTENT — renders the ACTIVE tab's content.
// Project viewers are lazy-loaded so the initial bundle stays
// small (fast first paint on low-end machines).
// ============================================================

import { lazy, Suspense } from "react";
import {
  Hero,
  Stats,
  About,
  TechStack,
  Experience,
  Projects,
  Certifications,
  Contact,
} from "../components/sections";
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

// Static element — stable identity means the welcome tree is skipped
// when Layout re-renders for unrelated reasons (panel toggles, etc).
const WELCOME_SECTIONS = (
  <>
    <Hero />
    <Stats />
    <About />
    <TechStack />
    <Experience />
    <Projects />
    <Certifications />
    <Contact />
  </>
);

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

  return WELCOME_SECTIONS;
}
