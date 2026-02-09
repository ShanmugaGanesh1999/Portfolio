import { useState } from "react";
import { Icon } from "../ui";
import { NAV_ITEMS, PERSONAL } from "../../data/portfolioData";
import useScrollSpy from "../../hooks/useScrollSpy";

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
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
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
export default function Sidebar({ activeProject, onOpenProject }) {
  const sectionIds = ["hero", "about", "expertise", "experience", "work", "contact"];
  const activeSection = useScrollSpy(sectionIds);

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
    <aside className="w-64 border-r border-border bg-sidebar overflow-y-auto hidden md:flex flex-col shrink-0 h-full">
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
          <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
          SYSTEM_ONLINE
        </div>
      </div>
    </aside>
  );
}
