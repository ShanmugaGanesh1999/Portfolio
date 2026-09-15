// ============================================================
// WORKSPACE REGISTRY — tab metadata, hash routing, sections
// Single source of truth for what can be opened as an editor tab.
// ============================================================

import { PREP_COURSES } from "../prep/prepData.js";

import { getDocument } from "./documents.js";

/** The pinned, non-closable Welcome tab holding the portfolio sections. */
export const WELCOME_TAB = {
  id: "welcome",
  kind: "welcome",
  title: "welcome.md",
  icon: "home",
  folder: "portfolio",
  language: "Markdown",
  closable: false,
};

/** Project deep-dive tabs (ids must match src/projects component keys). */
export const PROJECT_TABS = {
  "rollup-summary": { title: "rollup_summary.md", icon: "description", folder: "Projects", language: "Java" },
  "tax-config": { title: "tax_config.md", icon: "description", folder: "Projects", language: "Java" },
  "record-validation": { title: "record_validation.md", icon: "description", folder: "Projects", language: "Java" },
  "recent-items": { title: "recent_items.md", icon: "description", folder: "Projects", language: "Java" },
  "market-data": { title: "market_data.md", icon: "description", folder: "Projects", language: "Python" },
  "access-mgmt": { title: "campus_iam.md", icon: "description", folder: "Projects", language: "Java" },
  "ml-lead-scoring": { title: "ml_lead_scoring.md", icon: "description", folder: "Projects", language: "Python" },
};

/** Section ids on the Welcome tab that the scroll-spy observes. */
export const SECTION_DOCUMENTS = { hero: "welcome", about: "doc:about", expertise: "doc:skills", experience: "doc:experience", work: "doc:projects", contact: "doc:contact" };

export const SECTION_IDS = ["hero", "about", "expertise", "experience", "work", "contact"];

/**
 * Build a tab descriptor from a tab id.
 * Ids: "welcome" | a PROJECT_TABS key | "prep:<courseId>".
 * Returns null for unknown ids.
 */
export function makeTab(id) {
  if (id === WELCOME_TAB.id) return WELCOME_TAB;
  const document = getDocument(id);
  if (document) return { ...document, kind: "document", closable: true };
  if (PROJECT_TABS[id]) return { id, kind: "project", closable: true, ...PROJECT_TABS[id] };
  if (id?.startsWith("prep:")) {
    const courseId = id.slice(5);
    const course = PREP_COURSES.find((c) => c.id === courseId);
    if (!course) return null;
    return {
      id,
      kind: "prep",
      title: courseId === "dsa" ? "dsa_prep" : "sysdesign_prep",
      icon: course.icon,
      folder: course.title,
      language: "Markdown",
      closable: true,
    };
  }
  return null;
}

/** Default file for a prep course (first root file). */
export function defaultPrepFile(courseId) {
  const course = PREP_COURSES.find((c) => c.id === courseId);
  return course?.rootFiles?.[0]?.file ?? "README.md";
}

/** Convert active workspace state → URL hash. */
export function hashForTab(tabId, prepFiles) {
  if (!tabId || tabId === "welcome") return "#/";
  if (tabId.startsWith("doc:")) return `#/documents/${tabId.slice(4)}`;
  if (tabId.startsWith("prep:")) {
    const courseId = tabId.slice(5);
    const file = prepFiles?.[courseId] ?? defaultPrepFile(courseId);
    return `#/prep/${courseId}/${file}`;
  }
  return `#/${tabId}`;
}

/**
 * Parse a URL hash → { id, filePath? } | null.
 *   #/ or #/welcome        → welcome
 *   #/prep/<course>/<path> → prep tab + file
 *   #/<projectId>          → project tab
 */
export function parseHash(hash) {
  const raw = (hash || "").replace(/^#\/?/, "");
  if (!raw || raw === "welcome") return { id: "welcome" };
  const parts = raw.split("/");
  if (parts[0] === "documents" && parts.length === 2) {
    const document = getDocument(`doc:${parts[1]}`);
    return document ? { id: document.id } : null;
  }
  if (parts[0] === "prep" && parts.length >= 3) {
    const courseId = parts[1];
    const filePath = parts.slice(2).join("/");
    const course = PREP_COURSES.find((c) => c.id === courseId);
    if (course) return { id: `prep:${courseId}`, filePath };
    return null;
  }
  if (PROJECT_TABS[raw]) return { id: raw };
  return null;
}
