// ============================================================
// PREP TAB BAR — vertical course-tree panel shown on desktop
// between the explorer and the editor while prep is active.
// ============================================================

import { useState } from "react";
import { Icon, ResizeHandle } from "../ui";
import { PREP_COURSES } from "../../prep/prepData";
import usePanelResize from "../../hooks/usePanelResize";
import { useWorkspace } from "../../workspace/WorkspaceContext";

export default function PrepTabBar({ courseId, activePath }) {
  const ws = useWorkspace();
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedSubsections, setExpandedSubsections] = useState(() => new Set());

  const { size, startResize, handlers, nudge } = usePanelResize({
    axis: "x",
    defaultSize: 320,
    minSize: 250,
    maxSize: 600,
    collapseBelow: 180,
    // Dragging the prep panel nearly shut hides it (courseId exists here).
    onCollapse: ws.togglePrepPanel,
  });

  // Course lookup can fail — return after all hooks.
  const course = PREP_COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  const handleFileClick = (filePath) => {
    ws.openPrepFile(courseId, filePath);
  };

  const toggleSubsection = (subId) => {
    setExpandedSubsections((prev) => {
      const next = new Set(prev);
      if (next.has(subId)) {
        next.delete(subId);
      } else {
        next.add(subId);
      }
      return next;
    });
  };

  return (
    <div
      className="h-full flex flex-col border-r border-border bg-sidebar shrink-0 relative"
      style={{ width: `${size}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name={course.icon} className="text-accent shrink-0" />
          <span className="text-sm font-medium text-text truncate">{course.title}</span>
        </div>
        <button
          onClick={ws.closePrepPanel}
          className="text-comment hover:text-text transition-colors shrink-0"
          aria-label="Close prep panel"
        >
          <Icon name="close" size="text-[16px]" />
        </button>
      </div>

      {/* Scrollable tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {/* Root files */}
        <div className="px-2">
          {course.rootFiles?.map((file) => {
            const isActive = activePath === file.file;
            return (
              <button
                key={file.id}
                onClick={() => handleFileClick(file.file)}
                className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-colors ${
                  isActive ? "bg-border text-accent" : "text-text hover:bg-border/50"
                }`}
              >
                <Icon name={file.icon || "description"} size="text-[16px]" />
                <span className="truncate">{file.label}</span>
              </button>
            );
          })}
        </div>

        {course.rootFiles?.length > 0 && <div className="h-px bg-border my-2 mx-2" />}

        {/* Week sections */}
        {course.sections?.map((section) => (
          <div key={section.id} className="mb-1">
            <button
              onClick={() =>
                setExpandedSection(expandedSection === section.id ? null : section.id)
              }
              aria-expanded={expandedSection === section.id}
              className="flex items-center gap-1.5 w-full px-2 py-1.5 text-sm hover:bg-border/30 transition-colors text-text"
            >
              <Icon
                name={expandedSection === section.id ? "expand_more" : "chevron_right"}
                size="text-[14px]"
                className="text-comment shrink-0"
              />
              <Icon name="folder" size="text-[16px]" className="text-comment shrink-0" />
              <span className="truncate">{section.label}</span>
            </button>

            {expandedSection === section.id && (
              <div className="ml-4 px-2">
                {section.files?.map((file) => {
                  const filePath = `${section.folder}/${file.file}`;
                  const isActive = activePath === filePath;
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleFileClick(filePath)}
                      className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-colors ${
                        isActive ? "bg-border text-accent" : "text-text hover:bg-border/50"
                      }`}
                    >
                      <Icon name="description" size="text-[14px]" />
                      <span className="truncate text-xs">{file.label}</span>
                    </button>
                  );
                })}

                {section.subsections?.map((sub) => {
                  const isExpanded = expandedSubsections.has(sub.id);
                  const subFilePath = `${section.folder}/${sub.folder}/${sub.indexFile}`;
                  const isActive = activePath === subFilePath;

                  return (
                    <div key={sub.id} className="mt-1">
                      <button
                        onClick={() => toggleSubsection(sub.id)}
                        aria-expanded={isExpanded}
                        className="flex items-center gap-1.5 w-full px-2 py-1.5 text-sm rounded transition-colors text-text hover:bg-border/30"
                      >
                        <Icon
                          name={isExpanded ? "expand_more" : "chevron_right"}
                          size="text-[12px]"
                          className="text-comment shrink-0"
                        />
                        <Icon name="folder" size="text-[14px]" className="text-comment shrink-0" />
                        <span className="truncate text-xs">{sub.label}</span>
                      </button>

                      {isExpanded && (
                        <div className="ml-6">
                          <button
                            onClick={() => handleFileClick(subFilePath)}
                            className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-colors ${
                              isActive ? "bg-border text-accent" : "text-text hover:bg-border/50"
                            }`}
                          >
                            <Icon name="description" size="text-[14px]" />
                            <span className="truncate text-xs">{sub.indexFile}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <ResizeHandle
        side="right"
        startResize={startResize}
        handlers={handlers}
        nudge={nudge}
        label="Resize prep panel"
      />
    </div>
  );
}
