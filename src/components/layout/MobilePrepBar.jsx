import { useState, useRef, useEffect } from "react";
import { Icon } from "../ui";
import { PREP_COURSES } from "../../prep/prepData";

/**
 * MobilePrepBar — Top navigation bar for prep content on mobile.
 * 
 * Replaces the side-panel PrepTabBar on small screens.
 * Shows: course title, root files as tabs, week sections in a dropdown,
 * and individual topic files when a week is selected.
 */
export default function MobilePrepBar({ courseId, activePath, onNavigate, onClose }) {
  const [weekOpen, setWeekOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const weekRef = useRef(null);
  const filesRef = useRef(null);

  const course = PREP_COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  // Close week dropdown on outside click
  useEffect(() => {
    if (!weekOpen) return;
    const handle = (e) => {
      if (weekRef.current && !weekRef.current.contains(e.target)) {
        setWeekOpen(false);
      }
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, [weekOpen]);

  // Auto-detect selected section from activePath
  useEffect(() => {
    if (!activePath) return;
    const match = course.sections?.find((s) =>
      activePath.startsWith(s.folder)
    );
    if (match && match.id !== selectedSection) {
      setSelectedSection(match.id);
    }
  }, [activePath, course.sections]);

  const handleFileClick = (filePath) => {
    onNavigate(courseId, filePath);
  };

  const handleWeekSelect = (sectionId) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
    setWeekOpen(false);
  };

  const currentSection = course.sections?.find((s) => s.id === selectedSection);

  // Collect all files for the selected section (flat list: direct files + subsection index files)
  const sectionFiles = [];
  if (currentSection) {
    currentSection.files?.forEach((file) => {
      sectionFiles.push({
        id: file.id,
        label: file.label,
        path: `${currentSection.folder}/${file.file}`,
      });
    });
    currentSection.subsections?.forEach((sub) => {
      sectionFiles.push({
        id: sub.id,
        label: sub.label,
        path: `${currentSection.folder}/${sub.folder}/${sub.indexFile}`,
      });
    });
  }

  return (
    <div className="md:hidden border-b border-border bg-sidebar/80 backdrop-blur-sm shrink-0 relative z-30">
      {/* ── Row 1: Course header + root files + close ── */}
      <div className="flex items-center h-9 border-b border-border/50">
        {/* Course badge */}
        <div className="flex items-center gap-1.5 px-2.5 shrink-0 border-r border-border/50">
          <Icon name={course.icon} size="text-[14px]" className={`text-${course.color}`} />
          <span className="text-[10px] font-bold text-text uppercase tracking-wide">
            {course.id === "dsa" ? "DSA" : "SYS_DES"}
          </span>
        </div>

        {/* Root files as tabs */}
        <div className="flex-1 overflow-x-auto flex items-center scrollbar-none">
          {course.rootFiles?.map((file) => {
            const isActive = activePath === file.file;
            return (
              <button
                key={file.id}
                onClick={() => handleFileClick(file.file)}
                className={`flex items-center gap-1.5 px-2.5 h-9 text-[11px] whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? `border-${course.color} text-${course.color}`
                    : "border-transparent text-comment hover:text-text"
                }`}
              >
                <Icon name={file.icon || "description"} size="text-[13px]" />
                {file.label}
              </button>
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="shrink-0 w-9 h-9 flex items-center justify-center text-comment hover:text-keyword border-l border-border/50 transition-colors"
          aria-label="Close prep"
        >
          <Icon name="close" size="text-[16px]" />
        </button>
      </div>

      {/* ── Row 2: Week selector + topic files ── */}
      <div className="flex items-center h-8">
        {/* Week dropdown trigger */}
        <div className="relative shrink-0" ref={weekRef}>
          <button
            onClick={() => setWeekOpen(!weekOpen)}
            className={`flex items-center gap-1 px-2.5 h-8 text-[10px] font-bold uppercase tracking-wide border-r border-border/50 transition-colors ${
              weekOpen ? "text-accent bg-border/20" : "text-comment hover:text-text"
            }`}
          >
            <Icon name="folder_open" size="text-[13px]" />
            <span className="max-w-[100px] truncate">
              {currentSection
                ? currentSection.label.replace(/Week \d+ — /, "W" + currentSection.id.replace("week-", "") + " ")
                : "Select"}
            </span>
            <Icon name={weekOpen ? "expand_less" : "expand_more"} size="text-[12px]" />
          </button>

          {/* Week dropdown list */}
          {weekOpen && (
            <div className="absolute top-full left-0 mt-px bg-sidebar border border-border rounded-md shadow-xl shadow-black/50 z-50 min-w-[220px] max-h-[50vh] overflow-y-auto py-1 animate-fade-in-up" style={{ animationDuration: "0.15s" }}>
              {course.sections?.map((section) => {
                const isActive = selectedSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleWeekSelect(section.id)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors ${
                      isActive
                        ? "bg-border text-accent"
                        : "text-text hover:bg-border/50"
                    }`}
                  >
                    <Icon name="folder" size="text-[14px]" className="text-comment shrink-0" />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable topic files for selected section */}
        <div className="flex-1 overflow-x-auto flex items-center scrollbar-none" ref={filesRef}>
          {sectionFiles.length > 0 ? (
            sectionFiles.map((file) => {
              const isActive = activePath === file.path;
              return (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file.path)}
                  className={`flex items-center gap-1 px-2.5 h-8 text-[10px] whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-comment hover:text-text"
                  }`}
                >
                  <Icon name="description" size="text-[12px]" />
                  {file.label}
                </button>
              );
            })
          ) : (
            <span className="px-2.5 text-[10px] text-comment/50 italic">
              ← Pick a section
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
