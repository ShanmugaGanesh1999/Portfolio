// ============================================================
// BREADCRUMBS — VS Code editor breadcrumbs:
// portfolio > [folder] > active-file
// ============================================================

import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";
import { PREP_COURSES } from "../../prep/prepData";

export default function Breadcrumbs() {
  const ws = useWorkspace();
  const { tabs, activeTabId } = ws.state;
  const tab = tabs.find((t) => t.id === activeTabId);
  if (!tab) return null;

  const isPrep = tab.kind === "prep";
  const course = isPrep ? PREP_COURSES.find((c) => c.id === tab.id.slice(5)) : null;

  const crumbs = [{ label: "portfolio", icon: "code" }];
  if (tab.kind !== "welcome") {
    crumbs.push({ label: tab.folder, icon: "folder" });
  }
  crumbs.push({ label: tab.title, icon: tab.icon, active: true });

  const onCrumbClick = (i) => {
    if (i === 0) ws.setActiveTab("welcome");
    if (i === 1 && isPrep && course) ws.openPrepPanel(course.id);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-0.5 h-6 px-3 border-b border-border bg-sidebar/60 text-[11px] text-comment shrink-0 overflow-x-auto scrollbar-none"
    >
      {crumbs.map((crumb, i) => (
        <span key={`${crumb.label}-${i}`} className="flex items-center gap-0.5 shrink-0">
          {i > 0 && (
            <Icon name="chevron_right" size="text-[12px]" className="text-comment/50" />
          )}
          <button
            onClick={() => onCrumbClick(i)}
            disabled={crumb.active}
            className={`flex items-center gap-1 px-1 py-0.5 rounded truncate max-w-[180px] ${
              crumb.active
                ? "text-text font-bold cursor-default"
                : i === 0 || (i === 1 && isPrep)
                ? "hover:text-accent hover:bg-border/30 transition-colors cursor-pointer"
                : "cursor-default"
            }`}
          >
            <Icon name={crumb.icon} size="text-[12px]" />
            {crumb.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
