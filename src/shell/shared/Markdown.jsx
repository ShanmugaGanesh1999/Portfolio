// ============================================================
// TERMINAL MARKDOWN — ReactMarkdown components map styled for
// the Claude Code terminal (ct- classes from index.css).
// ============================================================

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MD_COMPONENTS = {
  p: (props) => <p {...props} />,
  strong: (props) => <strong {...props} />,
  em: (props) => <em style={{ color: "var(--color-string)" }} {...props} />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ct-inline-command">
      {children}
    </a>
  ),
  h1: (props) => <h1 {...props} />,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  ul: (props) => <ul {...props} />,
  ol: (props) => <ol {...props} />,
  li: (props) => <li {...props} />,
  blockquote: (props) => <blockquote {...props} />,
  hr: () => <hr style={{ border: 0, borderTop: "1px solid var(--color-border)", margin: "10px 0" }} />,
  pre: (props) => <pre {...props} />,
  code: ({ className, children, ...props }) => (
    <code className={className} {...props}>
      {children}
    </code>
  ),
  table: (props) => (
    <div style={{ overflowX: "auto", margin: "8px 0" }}>
      <table style={{ width: "100%", fontSize: "0.85em", borderCollapse: "collapse" }} {...props} />
    </div>
  ),
  th: (props) => (
    <th
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-sidebar)",
        padding: "4px 8px",
        textAlign: "left",
        color: "var(--color-accent)",
      }}
      {...props}
    />
  ),
  td: (props) => (
    <td style={{ border: "1px solid var(--color-border)", padding: "4px 8px", verticalAlign: "top" }} {...props} />
  ),
};

export default function TerminalMarkdown({ content }) {
  return (
    <div className="ct-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
