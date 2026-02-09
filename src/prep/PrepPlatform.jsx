import { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark-dimmed.min.css";
import { Icon } from "../components/ui";
import SystemDesignDiagram from "./SystemDesignDiagram";

// ──────────────────────────────────────────────────
// Mermaid extraction — split raw markdown into
// alternating text-chunks and mermaid-code strings
// BEFORE passing to ReactMarkdown / rehype-highlight.
// ──────────────────────────────────────────────────
const MERMAID_FENCE = /```mermaid\s*\n([\s\S]*?)```/g;

function splitMermaid(md) {
  const parts = [];     // { type: 'md' | 'mermaid', content: string }
  let lastIndex = 0;
  let m;
  MERMAID_FENCE.lastIndex = 0;
  while ((m = MERMAID_FENCE.exec(md)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ type: "md", content: md.slice(lastIndex, m.index) });
    }
    parts.push({ type: "mermaid", content: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < md.length) {
    parts.push({ type: "md", content: md.slice(lastIndex) });
  }
  return parts;
}

// ──────────────────────────────────────────────────
// Markdown custom components — terminal-themed rendering
// with proper syntax highlighting, ASCII art support,
// and clean typography.
// ──────────────────────────────────────────────────
const mdComponents = {
  // ── Headings ──────────────────────────────────
  h1: ({ children }) => (
    <h1 className="md-h1">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="md-h2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="md-h3">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="md-h4">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="md-h5">{children}</h5>
  ),

  // ── Block elements ────────────────────────────
  p: ({ children }) => (
    <p className="md-p">{children}</p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="md-blockquote">{children}</blockquote>
  ),
  hr: () => <hr className="md-hr" />,

  // ── Lists ─────────────────────────────────────
  ul: ({ children }) => (
    <ul className="md-ul">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="md-ol">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="md-li">{children}</li>
  ),

  // ── Code ──────────────────────────────────────
  // rehype-highlight wraps code in <pre><code class="hljs language-xxx">
  // We style <pre> as the outer container and let hljs handle <code> internals.
  pre: ({ children }) => (
    <div className="md-code-block">{children}</div>
  ),
  code: ({ className, children, ...props }) => {
    // Inline code — no className from rehype-highlight
    const isBlock = className && (className.includes("hljs") || className.includes("language-"));
    if (!isBlock) {
      return (
        <code className="md-inline-code">{children}</code>
      );
    }
    // Block code — rendered inside <pre> by markdown parser.
    // rehype-highlight adds hljs classes + colored spans.
    return (
      <code className={`md-block-code ${className || ""}`} {...props}>
        {children}
      </code>
    );
  },

  // ── Tables ────────────────────────────────────
  table: ({ children }) => (
    <div className="md-table-wrap">
      <table className="md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="md-thead">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="md-tr">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="md-th">{children}</th>
  ),
  td: ({ children }) => (
    <td className="md-td">{children}</td>
  ),

  // ── Inline elements ───────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      className="md-link"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="md-strong">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="md-em">{children}</em>
  ),
  del: ({ children }) => (
    <del className="md-del">{children}</del>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="md-img" loading="lazy" />
  ),
  input: ({ type, checked, ...props }) => {
    if (type === "checkbox") {
      return (
        <span className={`md-checkbox ${checked ? "md-checkbox-checked" : ""}`}>
          {checked ? "✓" : ""}
        </span>
      );
    }
    return <input type={type} checked={checked} {...props} />;
  },
};

// ──────────────────────────────────────────────────
// MarkdownWithDiagrams — renders markdown with mermaid
// blocks replaced by interactive diagrams
// ──────────────────────────────────────────────────
function MarkdownWithDiagrams({ markdown }) {
  const parts = useMemo(() => splitMermaid(markdown), [markdown]);

  return (
    <>
      {parts.map((part, i) =>
        part.type === "mermaid" ? (
          <SystemDesignDiagram key={`m-${i}`} mermaidCode={part.content} />
        ) : (
          <ReactMarkdown
            key={`md-${i}`}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              [rehypeHighlight, { detect: true, ignoreMissing: true }],
            ]}
            components={mdComponents}
          >
            {part.content}
          </ReactMarkdown>
        )
      )}
    </>
  );
}

// ──────────────────────────────────────────────────
// Loading skeleton
// ──────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6 max-w-4xl mx-auto">
      <div className="h-8 bg-border/30 rounded w-2/3" />
      <div className="h-4 bg-border/20 rounded w-full" />
      <div className="h-4 bg-border/20 rounded w-5/6" />
      <div className="h-4 bg-border/20 rounded w-4/6" />
      <div className="h-32 bg-border/10 rounded mt-6" />
      <div className="h-4 bg-border/20 rounded w-full" />
      <div className="h-4 bg-border/20 rounded w-3/4" />
    </div>
  );
}

// ══════════════════════════════════════════════════
// PrepPlatform — Pure markdown reader for prep content
// ══════════════════════════════════════════════════
export default function PrepPlatform({ course, filePath, onBack, onNavigate }) {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  // Scroll to top helper function
  const scrollToTop = () => {
    // Find the scrollable parent (main element)
    const main = document.querySelector('main');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load markdown whenever course or filePath changes
  useEffect(() => {
    if (!course || !filePath) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const encodedBase = course.basePath
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const encodedFile = filePath
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    // Use Vite's BASE_URL to handle both dev and production base paths
    const baseUrl = import.meta.env.BASE_URL || '/';
    const url = `${baseUrl}${encodedBase}/${encodedFile}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`File not found: ${filePath}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) {
          setMarkdown(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setMarkdown("");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [course, filePath]);

  // Build breadcrumb from filePath
  const breadcrumbParts = [
    { label: "prep", onClick: onBack },
    {
      label: course?.id === "dsa" ? "DSA" : "System Design",
      onClick: () => onNavigate?.(course.id, "README.md"),
    },
    ...filePath
      .split("/")
      .map((part, i, arr) => ({
        label: part,
        isLast: i === arr.length - 1,
      })),
  ];

  return (
    <div className="min-h-full">
      {/* Breadcrumb bar */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-sm border-b border-border px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-comment overflow-x-auto min-w-0">
          <button
            onClick={onBack}
            className="text-comment hover:text-accent transition-colors shrink-0 mr-1"
          >
            <Icon name="arrow_back" size="text-base" />
          </button>
          {breadcrumbParts.map((part, i) => (
            <span key={i} className="flex items-center gap-1.5 shrink-0">
              {i > 0 && (
                <Icon
                  name="chevron_right"
                  size="text-[12px]"
                  className="text-border"
                />
              )}
              {part.onClick && !part.isLast ? (
                <button
                  onClick={part.onClick}
                  className="hover:text-accent transition-colors"
                >
                  {part.label}
                </button>
              ) : (
                <span className={part.isLast ? "text-text/70" : "text-comment"}>
                  {part.label}
                </span>
              )}
            </span>
          ))}
        </div>
        <button
          onClick={scrollToTop}
          className="text-comment hover:text-accent transition-colors shrink-0 ml-2"
          title="Scroll to top"
        >
          <Icon name="vertical_align_top" size="text-[14px]" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center">
          <Icon
            name="error_outline"
            size="text-4xl"
            className="text-keyword mb-3"
          />
          <p className="text-keyword text-sm font-bold mb-1">FILE_NOT_FOUND</p>
          <p className="text-comment text-xs">{error}</p>
          <button
            onClick={() => onNavigate?.(course.id, "README.md")}
            className="mt-4 text-xs text-accent hover:text-accent/80 underline"
          >
            ← Back to README
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6" ref={contentRef}>
          {/* File info bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-border/40 gap-2">
            <div className="flex items-center gap-2 text-[10px] text-comment">
              <Icon name="description" size="text-[12px]" />
              <span className="text-text/60 font-bold truncate max-w-[200px] sm:max-w-none">{filePath}</span>
            </div>
            <div className={`text-[10px] font-bold text-${course.color} flex items-center gap-1`}>
              <Icon name={course.icon} size="text-[12px]" />
              {course.title}
            </div>
          </div>

          {/* Rendered markdown — mermaid blocks extracted and rendered separately */}
          <article className="md-root">
            <MarkdownWithDiagrams markdown={markdown} />
          </article>

          {/* Bottom navigation */}
          <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-xs text-comment hover:text-accent transition-colors flex items-center gap-1"
            >
              <Icon name="arrow_back" size="text-[14px]" />
              Back to portfolio
            </button>
            <button
              onClick={scrollToTop}
              className="text-xs text-comment hover:text-accent transition-colors flex items-center gap-1"
            >
              Top
              <Icon name="arrow_upward" size="text-[14px]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
