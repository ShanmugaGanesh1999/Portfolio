// ============================================================
// CLAUDE MARKDOWN — ReactMarkdown components map styled for
// the Claude Code shell (token-driven, theme-safe).
// ============================================================

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MD_COMPONENTS = {
  p: (props) => <p className="mb-2 last:mb-0 leading-[1.7] text-sm" {...props} />,
  strong: (props) => <strong className="font-bold text-text" {...props} />,
  em: (props) => <em className="text-variable" {...props} />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent/70 transition-colors"
    >
      {children}
    </a>
  ),
  h1: (props) => <h1 className="font-display font-semibold text-xl mt-4 mb-2 first:mt-0" {...props} />,
  h2: (props) => <h2 className="font-display font-semibold text-lg mt-4 mb-2 first:mt-0" {...props} />,
  h3: (props) => <h3 className="font-ui font-semibold text-base mt-3 mb-1.5 first:mt-0" {...props} />,
  h4: (props) => <h4 className="font-ui font-semibold text-sm mt-3 mb-1 first:mt-0" {...props} />,
  ul: (props) => <ul className="list-disc ml-5 space-y-1 my-2 marker:text-accent text-sm" {...props} />,
  ol: (props) => <ol className="list-decimal ml-5 space-y-1 my-2 marker:text-accent text-sm" {...props} />,
  li: (props) => <li className="leading-[1.6] pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-accent/50 pl-3 my-2 text-comment italic" {...props} />
  ),
  hr: () => <hr className="border-border my-3" />,
  pre: (props) => (
    <pre
      className="bg-sidebar border border-border rounded-md p-3 my-2 overflow-x-auto text-xs font-mono scrollbar-thin"
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) {
      return (
        <code className={`${className} font-mono text-xs`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="bg-sidebar border border-border px-1.5 py-0.5 rounded text-xs font-mono text-variable" {...props}>
        {children}
      </code>
    );
  },
  table: (props) => (
    <div className="overflow-x-auto my-2 scrollbar-thin">
      <table className="w-full text-xs border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-border bg-sidebar px-2 py-1 text-left font-ui font-semibold text-accent" {...props} />
  ),
  td: (props) => <td className="border border-border px-2 py-1 align-top text-sm" {...props} />,
};

export default function ClaudeMarkdown({ content }) {
  return (
    <div className="text-text break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
