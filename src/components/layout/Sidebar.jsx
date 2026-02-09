import { useState } from "react";
import { Icon, ResizeHandle } from "../ui";
import { NAV_ITEMS, PERSONAL } from "../../data/portfolioData";
import { PREP_COURSES } from "../../prep/prepData";
import useScrollSpy from "../../hooks/useScrollSpy";
import useResizable from "../../hooks/useResizable";

/**
 * FolderSection — A VS Code-style collapsible directory group.
 * Clicking the header toggles children visibility with a chevron indicator.
 */
function FolderSection({ label, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="select-none">
      {/* Folder header — clickable toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 w-full py-1.5 px-3 text-comment text-[10px] uppercase font-bold tracking-widest hover:bg-border/30 transition-colors cursor-pointer"
      >
        <Icon
          name={open ? "expand_more" : "chevron_right"}
          size="text-[14px]"
          className="text-comment shrink-0"
        />
        {label}
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * PrepFolder — A collapsible subfolder inside the Prep section tree.
 * Used for week folders, subsections, etc.
 */
function PrepFolder({ label, icon, indent = 1, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-left py-1 px-3 text-sm hover:bg-border/50 text-text transition-colors"
        style={{ paddingLeft: `${indent * 12 + 12}px` }}
      >
        <Icon
          name={open ? "expand_more" : "chevron_right"}
          size="text-[14px]"
          className="text-comment shrink-0"
        />
        <Icon name={icon || "folder"} size="text-[16px]" className="text-comment shrink-0" />
        <span className="truncate">{label}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

/**
 * PrepFileLink — A single prep file entry that opens markdown in main content
 */
function PrepFileLink({ label, icon, indent = 2, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-1 px-3 cursor-pointer text-sm transition-colors w-full text-left ${
        isActive ? "bg-border text-accent" : "hover:bg-border/50 text-text"
      }`}
      style={{ paddingLeft: `${indent * 12 + 12}px` }}
    >
      <Icon name={icon || "description"} />
      <span className="truncate">{label}</span>
    </button>
  );
}

/**
 * FileLink — A single file/folder entry inside a FolderSection
 */
function FileLink({ label, icon, href, active = false, indent = false, external = false, projectId, onOpenProject, activeProject }) {
  const baseClass = `flex items-center gap-2 py-1 px-3 cursor-pointer text-sm transition-colors ${
    indent ? "pl-7" : ""
  }`;

  // Project links — click to open project in main content
  const isProjectActive = projectId && activeProject === projectId;
  const stateClass = active || isProjectActive
    ? "bg-border text-accent"
    : "hover:bg-border/50 text-text";

  if (projectId) {
    return (
      <button
        onClick={() => onOpenProject?.(projectId)}
        className={`${baseClass} ${stateClass} w-full text-left`}
      >
        <Icon name={icon} />
        {label}
      </button>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${stateClass}`}
      >
        <Icon name={icon} />
        {label}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`${baseClass} ${stateClass}`}
      onClick={(e) => {
        // If viewing a project, clear it first then scroll to section
        if (activeProject) {
          e.preventDefault();
          onOpenProject?.(null);
          const targetId = href?.replace("#", "");
          if (targetId) {
            setTimeout(() => {
              document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }
        }
      }}
    >
      <Icon name={icon} />
      {label}
    </a>
  );
}

/**
 * Sidebar — VS Code file-explorer with collapsible directories.
 * Sections collapse/expand with chevron toggles to save vertical space.
 */
export default function Sidebar({ activeProject, onOpenProject, onOpenPrepTab }) {
  const sectionIds = ["hero", "about", "expertise", "experience", "work", "contact"];
  const activeSection = useScrollSpy(sectionIds);
  const { width, isResizing, startResize } = useResizable(256, 200, 500);

  // Group nav items by their section key
  const sections = NAV_ITEMS.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const isActive = (item) => {
    if (item.projectId) return false; // handled via activeProject
    if (activeProject) return false; // no section active when viewing project
    const target = item.href.replace("#", "");
    return target === activeSection;
  };

  return (
    <aside 
      className="border-r border-border bg-sidebar overflow-y-auto hidden md:flex flex-col shrink-0 h-full relative"
      style={{ width: `${width}px` }}
    >
      {/* Explorer title */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="text-accent font-bold text-sm">EXPLORER</div>
      </div>

      {/* File tree — fills available space */}
      <nav className="flex-1 overflow-y-auto py-1">
        {Object.entries(sections).map(([section, items]) => (
          <FolderSection key={section} label={section} defaultOpen>
            {items.map((item) => (
              <FileLink
                key={item.label}
                label={item.label}
                icon={item.icon}
                href={item.href}
                active={isActive(item)}
                indent={item.indent}
                projectId={item.projectId}
                onOpenProject={onOpenProject}
                activeProject={activeProject}
              />
            ))}
          </FolderSection>
        ))}

        {/* Prep — DSA & System Design folders (click to open tab bar) */}
        <FolderSection label="Prep" defaultOpen={false}>
          {PREP_COURSES.map((course) => {
            const isActive = activeProject?.startsWith(`prep:${course.id}`);
            return (
              <button
                key={course.id}
                onClick={() => onOpenPrepTab?.(course.id)}
                className={`flex items-center gap-2 w-full text-left py-1 px-3 text-sm transition-colors ${
                  isActive ? "bg-border text-accent" : "hover:bg-border/50 text-text"
                }`}
                style={{ paddingLeft: "36px" }}
              >
                <Icon name={course.icon} size="text-[16px]" className="text-comment shrink-0" />
                <span className="truncate">
                  {course.id === "dsa" ? "DSA" : "System_Design"}
                </span>
              </button>
            );
          })}
        </FolderSection>

        {/* External Links — collapsed by default so upper sections get room */}
        <FolderSection label="External_Links" defaultOpen={false}>
          <FileLink
            label="github.com"
            icon="link"
            href={PERSONAL.socialLinks.github}
            external
          />
          <FileLink
            label="linkedin.com"
            icon="link"
            href={PERSONAL.socialLinks.linkedin}
            external
          />
          <FileLink
            label="leetcode.com"
            icon="code"
            href={PERSONAL.socialLinks.leetcode}
            external
          />
          <FileLink
            label="calendar.google"
            icon="event"
            href={PERSONAL.calendlyUrl}
            external
          />
          <FileLink
            label="resume.pdf"
            icon="download"
            href={PERSONAL.resumeUrl}
            external
          />
        </FolderSection>
      </nav>

      {/* Status indicator — always at bottom */}
      <div className="shrink-0 p-4 border-t border-border bg-sidebar">
        <div className="text-[10px] text-success flex items-center gap-2">

      {/* Resize handle */}
      <ResizeHandle onMouseDown={startResize} side="right" />
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
          SYSTEM_ONLINE
        </div>
      </div>
    </aside>
  );
}
