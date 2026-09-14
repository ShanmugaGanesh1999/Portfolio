// ============================================================
// COMMAND PALETTE — VS Code quick open.
//   • Files mode (default): fuzzy-search sections, projects,
//     prep files, and external links.
//   • Commands mode (Ctrl+Shift+P or ">" prefix): workspace
//     actions like theme toggle, close tabs, download resume.
// Rendered on demand (mounted only while open).
// ============================================================

import { useState, useEffect, useRef, useMemo } from "react";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { useTheme } from "../../hooks/useTheme";
import { fuzzyRank, highlightParts } from "../../workspace/fuzzySearch";
import { NAV_ITEMS, PERSONAL } from "../../data/portfolioData";
import { PROJECT_TABS } from "../../workspace/registry";
import { PREP_COURSES } from "../../prep/prepData";

function buildFileItems() {
  const items = [
    {
      id: "welcome",
      label: "welcome.md",
      icon: "home",
      hint: "Welcome",
      keywords: "home portfolio welcome",
    },
  ];

  // Sections (scroll on the Welcome tab)
  NAV_ITEMS.filter((n) => n.sectionId).forEach((n) =>
    items.push({
      id: `section-${n.sectionId}`,
      label: n.label,
      icon: n.icon,
      hint: n.folder,
      keywords: `section ${n.sectionId}`,
    })
  );

  // Project deep-dives
  NAV_ITEMS.filter((n) => n.projectId).forEach((n) =>
    items.push({
      id: `project-${n.projectId}`,
      label: n.label,
      icon: n.icon,
      hint: "Projects",
      keywords: `project ${PROJECT_TABS[n.projectId]?.language ?? ""}`,
    })
  );

  // Prep files (flatten course trees) — carry the exact route on each item
  PREP_COURSES.forEach((course) => {
    course.rootFiles?.forEach((f) =>
      items.push({
        id: `prep-${course.id}-${f.file}`,
        label: f.label,
        icon: f.icon || "description",
        hint: course.title,
        keywords: `prep ${course.id}`,
        prep: { courseId: course.id, filePath: f.file },
      })
    );
    course.sections?.forEach((s) => {
      s.files?.forEach((f) =>
        items.push({
          id: `prep-${course.id}-${s.folder}-${f.file}`,
          label: `${s.folder}/${f.file}`,
          icon: "description",
          hint: course.title,
          keywords: `prep ${course.id} ${s.label}`,
          prep: { courseId: course.id, filePath: `${s.folder}/${f.file}` },
        })
      );
      s.subsections?.forEach((sub) =>
        items.push({
          id: `prep-${course.id}-${s.folder}-${sub.folder}`,
          label: `${s.folder}/${sub.folder}/`,
          icon: "folder",
          hint: course.title,
          keywords: `prep ${course.id} ${sub.label}`,
          prep: {
            courseId: course.id,
            filePath: `${s.folder}/${sub.folder}/${sub.indexFile}`,
          },
        })
      );
    });
  });

  // External links
  items.push(
    { id: "ext-resume", label: "resume.pdf", icon: "download", hint: "Download", keywords: "resume cv" },
    { id: "ext-github", label: "github.com", icon: "link", hint: "External", keywords: "github" },
    { id: "ext-linkedin", label: "linkedin.com", icon: "link", hint: "External", keywords: "linkedin" },
    { id: "ext-leetcode", label: "leetcode.com", icon: "code", hint: "External", keywords: "leetcode" },
    { id: "ext-website", label: "shanmugaganesh.dev", icon: "public", hint: "External", keywords: "website" },
    { id: "ext-calendly", label: "schedule_sync", icon: "event", hint: "External", keywords: "calendly calendar schedule" }
  );

  return items;
}

function buildCommandItems({ ws, toggleTheme }) {
  return [
    { id: "cmd-theme", label: "Preferences: Toggle Dark/Light Theme", icon: "contrast", run: toggleTheme },
    { id: "cmd-explorer", label: "View: Toggle Explorer Sidebar", icon: "files", run: ws.toggleExplorer },
    { id: "cmd-terminal", label: "View: Toggle Terminal Panel", icon: "terminal", run: () => ws.togglePanel("terminal") },
    { id: "cmd-output", label: "View: Toggle Output Panel", icon: "list_alt", run: () => ws.togglePanel("output") },
    { id: "cmd-copilot", label: "View: Toggle Copilot Chat", icon: "smart_toy", run: ws.toggleChat },
    { id: "cmd-welcome", label: "View: Show Welcome Tab", icon: "home", run: () => ws.setActiveTab("welcome") },
    { id: "cmd-close-all", label: "Editor: Close All Tabs", icon: "tab_close", run: ws.closeAllTabs },
    { id: "cmd-resume", label: "File: Download Resume", icon: "download", run: () => window.open(PERSONAL.resumeUrl, "_blank", "noopener") },
    { id: "cmd-email", label: "Contact: Email Shanmuga", icon: "mail", run: () => (window.location.href = `mailto:${PERSONAL.email}`) },
    { id: "cmd-calendly", label: "Contact: Schedule a Sync", icon: "event", run: () => window.open(PERSONAL.calendlyUrl, "_blank", "noopener") },
  ];
}

function runFileItem(item, ws) {
  if (item.id === "welcome") return ws.setActiveTab("welcome");
  if (item.id.startsWith("section-")) return ws.scrollToSection(item.id.slice(8));
  if (item.id.startsWith("project-")) return ws.openTab(item.id.slice(8));
  if (item.prep) return ws.openPrepFile(item.prep.courseId, item.prep.filePath);
  if (item.id === "ext-resume") return window.open(PERSONAL.resumeUrl, "_blank", "noopener");
  if (item.id === "ext-github") return window.open(PERSONAL.socialLinks.github, "_blank", "noopener");
  if (item.id === "ext-linkedin") return window.open(PERSONAL.socialLinks.linkedin, "_blank", "noopener");
  if (item.id === "ext-leetcode") return window.open(PERSONAL.socialLinks.leetcode, "_blank", "noopener");
  if (item.id === "ext-website") return window.open(PERSONAL.socialLinks.website, "_blank", "noopener");
  if (item.id === "ext-calendly") return window.open(PERSONAL.calendlyUrl, "_blank", "noopener");
  return undefined;
}

export default function CommandPalette() {
  const ws = useWorkspace();
  const { paletteQuery, paletteMode } = ws.state;
  const { toggle: toggleTheme } = useTheme();

  const [query, setQuery] = useState(paletteQuery);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const restoreFocusRef = useRef(null);

  // ">" prefix switches to commands mode, like VS Code.
  const mode = query.startsWith(">")
    ? "commands"
    : !query && paletteMode === "commands"
    ? "commands"
    : "files";
  const effectiveQuery =
    mode === "commands" ? query.replace(/^>\s*/, "").trim() : query.trim();

  const fileItems = useMemo(() => buildFileItems(), []);
  // ws/toggleTheme change identity with workspace state; building this tiny
  // array per render is cheaper than a memo that never hits.
  const commandItems = buildCommandItems({ ws, toggleTheme });
  const items = mode === "commands" ? commandItems : fileItems;

  const results = useMemo(
    () => fuzzyRank(items, effectiveQuery),
    [items, effectiveQuery]
  );

  // Focus the input on open; restore focus to the trigger on close.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => restoreFocusRef.current?.focus?.();
  }, []);

  useEffect(() => setActiveIdx(0), [effectiveQuery, mode]);

  // Keep the active result in view while navigating with keys.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, results]);

  const run = (item) => {
    ws.closePalette();
    ws.log("palette", `${mode}: ${item.label}`);
    if (mode === "commands") item.run?.();
    else runFileItem(item, ws);
  };

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIdx]) run(results[activeIdx]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      ws.closePalette();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/50 flex justify-center items-start pt-[8vh] px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) ws.closePalette();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="w-full max-w-xl bg-sidebar border border-border rounded-lg shadow-2xl shadow-black/40 overflow-hidden palette-in">
        {/* Input row */}
        <div className="flex items-center gap-2 px-3 border-b border-border">
          <Icon
            name={mode === "commands" ? "terminal" : "search"}
            size="text-[16px]"
            className="text-comment"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            className="flex-1 bg-transparent outline-none py-2.5 text-sm text-text placeholder:text-comment"
            placeholder={
              mode === "commands"
                ? "Type a command name…"
                : "Search files by name… (type > for commands)"
            }
            aria-label="Command palette input"
            spellCheck={false}
          />
          <kbd className="text-[10px] text-comment border border-border rounded px-1.5 py-0.5 shrink-0">
            esc
          </kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Results"
          className="max-h-[50vh] overflow-y-auto scrollbar-thin py-1"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-xs text-comment">
              No matching results
            </li>
          )}
          {results.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === activeIdx}
              data-active={i === activeIdx}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => run(item)}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer border-l-2 transition-colors ${
                i === activeIdx
                  ? "bg-accent/15 border-accent text-text"
                  : "border-transparent text-comment hover:bg-border/30"
              }`}
            >
              <Icon
                name={item.icon}
                size="text-[16px]"
                className={i === activeIdx ? "text-accent shrink-0" : "text-comment shrink-0"}
              />
              <span className="truncate">
                {highlightParts(item.label, item._indices).map((part, j) => (
                  <span key={j} className={part.match ? "text-accent font-bold" : undefined}>
                    {part.text}
                  </span>
                ))}
              </span>
              {item.hint && (
                <span className="ml-auto text-[10px] text-comment/70 shrink-0 pl-3">
                  {item.hint}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Footer hints */}
        <div className="flex items-center gap-3 px-3 py-1.5 border-t border-border text-[10px] text-comment">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
