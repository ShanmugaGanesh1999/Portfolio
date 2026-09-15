// ============================================================
// SIDEBAR — VS Code Explorer: file tree with collapsible folders,
// section links, project deep-dive files, prep courses, externals.
// Consumes the workspace context directly. Rendered once by Layout
// (static column on desktop, slide-in drawer on mobile).
// ============================================================

import { useState } from "react";
import { Icon, ResizeHandle } from "../ui";
import { PERSONAL } from "../../data/portfolioData";
import { PREP_COURSES } from "../../prep/prepData";
import usePanelResize from "../../hooks/usePanelResize";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { PROJECT_TABS } from "../../workspace/registry";
import { DOCUMENTS } from "../../workspace/documents.js";



/**
 * FolderSection — collapsible directory group.
 * Uses the grid-rows 0fr/1fr technique so height animates smoothly
 * without the old max-height clipping problem.
 */
function FolderSection({ label, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="select-none">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex items-center gap-1 w-full py-1.5 px-3 text-comment text-[10px] uppercase font-bold tracking-widest hover:bg-border/30 transition-colors cursor-pointer"
      >
        <Icon
          name={open ? "expand_more" : "chevron_right"}
          size="text-[14px]"
          className="text-comment shrink-0"
        />
        {label}
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden min-h-0">{children}</div>
      </div>
    </div>
  );
}

/** Section / project file entries. */
function FileLink({ label, icon, active = false, onClick, indent = false, external = false, href }) {
  const baseClass = `flex items-center gap-2 py-1 px-3 cursor-pointer text-sm transition-colors w-full text-left ${
    indent ? "pl-7" : ""
  } ${active ? "bg-border text-accent" : "hover:bg-border/50 text-text"}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>
        <Icon name={icon} />
        <span className="truncate">{label}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass} aria-current={active ? "page" : undefined}>
      <Icon name={icon} />
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function Sidebar({ variant = "desktop" }) {
  const ws = useWorkspace();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { activeTabId } = ws.state;

  const { size, startResize, handlers, nudge } = usePanelResize({
    axis: "x",
    defaultSize: 256,
    minSize: 200,
    maxSize: 480,
    collapseBelow: 140,
    onCollapse: () =>
      isDesktop ? ws.setExplorer(false) : ws.setMobileDrawer(false),
  });

  const handleProject = (projectId) => {
    ws.openTab(projectId);
    if (!isDesktop) ws.setMobileDrawer(false);
  };

  return (
    <aside
      className="border-r border-border bg-sidebar overflow-y-auto flex flex-col shrink-0 h-full relative"
      style={{ width: variant === "desktop" ? `${size}px` : "280px" }}
    >
      {/* Explorer title */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-accent font-bold text-sm">EXPLORER</div>
          {variant === "mobile" && (
            <button
              onClick={() => ws.setMobileDrawer(false)}
              aria-label="Close explorer drawer"
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-border/50 transition-colors text-comment hover:text-keyword"
            >
              <Icon name="close" size="text-[16px]" />
            </button>
          )}
        </div>
      </div>

      {/* File tree */}
      <nav className="flex-1 overflow-y-auto py-1" aria-label="Explorer file tree">
        <FolderSection label="Portfolio">
          <FileLink label="welcome.md" icon="home" active={activeTabId === 'welcome'} onClick={() => ws.openTab('welcome')} />
          {DOCUMENTS.map((document) => <FileLink key={document.id} label={document.title} icon={document.icon} active={activeTabId === document.id} onClick={() => ws.openTab(document.id, { preview: true })} />)}
        </FolderSection>
        <FolderSection label="Projects">
          {Object.entries(PROJECT_TABS).map(([id, project]) => <FileLink key={id} label={project.title} icon={project.icon} active={activeTabId === id} onClick={() => handleProject(id)} />)}
        </FolderSection>

        {/* Prep — DSA & System Design courses */}
        <FolderSection label="Prep" defaultOpen={false}>
          {PREP_COURSES.map((course) => {
            const active = activeTabId === `prep:${course.id}`;
            return (
              <button
                key={course.id}
                onClick={() => {
                  ws.openPrepPanel(course.id);
                  if (!isDesktop) ws.setMobileDrawer(false);
                }}
                className={`flex items-center gap-2 w-full text-left py-1 px-3 text-sm transition-colors ${
                  active ? "bg-border text-accent" : "hover:bg-border/50 text-text"
                }`}
                style={{ paddingLeft: "36px" }}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  name={course.icon}
                  size="text-[16px]"
                  className={
                    active
                      ? "text-accent shrink-0"
                      : course.color === "success"
                      ? "text-success shrink-0"
                      : "text-accent shrink-0"
                  }
                />
                <span className="truncate">
                  {course.id === "dsa" ? "DSA" : "System_Design"}
                </span>
              </button>
            );
          })}
        </FolderSection>

        {/* External links */}
        <FolderSection label="External_Links" defaultOpen={false}>
          <FileLink label="github.com" icon="link" href={PERSONAL.socialLinks.github} external />
          <FileLink label="linkedin.com" icon="link" href={PERSONAL.socialLinks.linkedin} external />
          <FileLink label="leetcode.com" icon="code" href={PERSONAL.socialLinks.leetcode} external />
          <FileLink label="shanmugaganesh.dev" icon="public" href={PERSONAL.socialLinks.website} external />
          <FileLink label="calendar.google" icon="event" href={PERSONAL.calendlyUrl} external />
          <FileLink label="resume.pdf" icon="download" href={PERSONAL.resumeUrl} external />
        </FolderSection>
      </nav>

      {/* Resize handle (desktop only) */}
      {variant === "desktop" && (
        <ResizeHandle
          side="right"
          startResize={startResize}
          handlers={handlers}
          nudge={nudge}
          label="Resize explorer sidebar"
        />
      )}
    </aside>
  );
}
