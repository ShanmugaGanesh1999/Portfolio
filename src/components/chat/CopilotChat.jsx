// ============================================================
// COPILOT CHAT — the VS Code Copilot Chat panel.
// Anatomy mirrors the real view: "CHAT" view header with
// new-chat action, sparkle-avatar responses with code-block
// copy toolbars, plain-text user turns, follow-up chips, and
// the signature input box with mode dropdown + model picker +
// circular send button inside it.
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  chatQuery,
  getSuggestedQuestions,
  getAvailableModels,
  getDefaultModelId,
} from "../../services/chatService";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";

// ─── Modes (functional placeholders, like the real toolbar) ───
const MODES = [
  { id: "ask", label: "Ask", placeholder: "Ask Copilot" },
  { id: "edit", label: "Edit", placeholder: "Ask Copilot to refine an answer…" },
  { id: "agent", label: "Agent", placeholder: "Ask Copilot to build something…" },
];

const SUGGESTION_ICONS = [
  "code",
  "account_tree",
  "history",
  "bolt",
];

// ─── Code block with VS Code toolbar (language + copy) ────────
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="border border-border rounded-md overflow-hidden my-2">
      <div className="flex items-center justify-between bg-sidebar/70 border-b border-border px-2 py-1">
        <span className="text-[10px] font-mono text-comment">{language || "code"}</span>
        <button
          onClick={onCopy}
          className="text-[10px] flex items-center gap-1 text-comment hover:text-accent transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          <Icon name={copied ? "check" : "content_copy"} size="text-[12px]" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-3 text-xs leading-relaxed overflow-x-auto bg-bg font-mono scrollbar-thin">
        <code className="text-text">{code}</code>
      </pre>
    </div>
  );
}

// ─── Markdown map (Copilot-styled) ────────────────────────────
const MD_COMPONENTS = {
  p: (props) => <p className="mb-2 last:mb-0 leading-[1.65] text-sm" {...props} />,
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
  em: (props) => <em className="text-variable" {...props} />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent/70"
    >
      {children}
    </a>
  ),
  h1: (props) => <h1 className="font-semibold text-base mt-3 mb-1.5 first:mt-0" {...props} />,
  h2: (props) => <h2 className="font-semibold text-[15px] mt-3 mb-1.5 first:mt-0" {...props} />,
  h3: (props) => <h3 className="font-semibold text-sm mt-2.5 mb-1 first:mt-0" {...props} />,
  ul: (props) => <ul className="list-disc ml-4 space-y-1 my-1.5 marker:text-accent text-sm" {...props} />,
  ol: (props) => <ol className="list-decimal ml-4 space-y-1 my-1.5 marker:text-accent text-sm" {...props} />,
  li: (props) => <li className="leading-[1.55] pl-0.5" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-accent/40 pl-3 my-1.5 text-comment italic text-sm" {...props} />
  ),
  hr: () => <hr className="border-border my-2.5" />,
  pre: ({ children }) => {
    // Extract raw text + language for the toolbar'd CodeBlock.
    let code = "";
    let language = "";
    const walk = (node) => {
      if (node == null || typeof node === "boolean") return;
      if (typeof node === "string" || typeof node === "number") {
        code += node;
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (node.props?.className?.includes("language-")) {
        language = node.props.className.replace("language-", "");
      }
      if (node.props?.children) walk(node.props.children);
    };
    walk(children);
    return <CodeBlock language={language} code={code.replace(/\n$/, "")} />;
  },
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
      <code className="bg-border/40 px-1.5 py-0.5 rounded text-[0.85em] font-mono text-variable" {...props}>
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
    <th className="border border-border bg-sidebar/60 px-2 py-1 text-left font-semibold text-accent" {...props} />
  ),
  td: (props) => <td className="border border-border px-2 py-1 align-top" {...props} />,
};

function CopilotMarkdown({ content }) {
  return (
    <div className="break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ─── Message turns ────────────────────────────────────────────
function formatTimestamp(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function UserTurn({ message }) {
  // VS Code renders user turns as plain text — no bubble, no avatar.
  return (
    <div className="text-sm text-text whitespace-pre-wrap break-words leading-[1.6]">
      {message.content}
    </div>
  );
}

function CopilotTurn({ message }) {
  return (
    <div className="flex gap-2.5">
      <span
        className="shrink-0 w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mt-0.5"
        aria-hidden="true"
      >
        <Icon name="auto_awesome" size="text-[14px]" className="text-accent" />
      </span>
      <div className="flex-1 min-w-0">
        {message.isStreaming && !message.content ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-comment py-1">
            <span className="animate-pulse text-accent">✦</span> Thinking…
          </span>
        ) : (
          <CopilotMarkdown content={message.content} />
        )}
        {message.timestamp && !message.isStreaming && (
          <div className="text-[10px] text-comment/50 mt-1 select-none">
            {formatTimestamp(message.timestamp)}
            {message.model && <span className="ml-1.5">· {message.model}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorTurn({ message }) {
  return (
    <div className="flex gap-2.5">
      <span className="shrink-0 w-6 h-6 rounded-md bg-keyword/10 border border-keyword/20 flex items-center justify-center mt-0.5">
        <Icon name="error" size="text-[14px]" className="text-keyword" />
      </span>
      <p className="text-sm text-keyword leading-relaxed">{message.content}</p>
    </div>
  );
}

// ─── Popover for mode + model pickers ─────────────────────────
function Popover({ open, onClose, children, align = "left" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute bottom-full mb-1.5 ${align === "right" ? "right-0" : "left-0"} z-40 min-w-[180px] bg-sidebar border border-border rounded-md shadow-xl shadow-black/30 py-1 animate-fade-in-up`}
      style={{ animationDuration: "0.12s" }}
      role="menu"
    >
      {children}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────
export default function CopilotChat({ isOpen, onClose }) {
  const ws = useWorkspace();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("ask");
  const [selectedModel, setSelectedModel] = useState(getDefaultModelId);
  const [modeOpen, setModeOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const suggestions = getSuggestedQuestions();
  const models = getAvailableModels();
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];
  const activeMode = MODES.find((m) => m.id === mode) ?? MODES[0];

  // Auto-scroll while pinned to the bottom.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const clearChat = () => {
    setMessages([]);
    if (abortRef.current) abortRef.current.abort();
    setIsLoading(false);
  };

  // ── Send (streaming, abortable) ──
  const sendMessage = useCallback(
    async (text) => {
      const userMessage = text.trim();
      if (!userMessage || isLoading) return;
      setInput("");

      const now = Date.now();
      const userMsg = { role: "user", content: userMessage, id: now, timestamp: now };
      const assistantMsg = {
        role: "assistant",
        content: "",
        id: now + 1,
        isStreaming: true,
        timestamp: now,
        model: currentModel.name,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);

      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await chatQuery(
          userMessage,
          history,
          (chunk) => {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.isStreaming) {
                updated[updated.length - 1] = { ...last, content: last.content + chunk };
              }
              return updated;
            });
          },
          controller.signal,
          selectedModel
        );
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.isStreaming) {
            updated[updated.length - 1] = { ...last, isStreaming: false, timestamp: Date.now() };
          }
          return updated;
        });
        ws.log("copilot", `answered query with ${currentModel.name}`);
      } catch (err) {
        if (err.name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "error",
            content: err.message || "Something went wrong. Please try again.",
            id: Date.now(),
            timestamp: Date.now(),
          };
          return updated;
        });
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [isLoading, messages, selectedModel, currentModel, ws]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const canSend = Boolean(input.trim()) && !isLoading;

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* ── View header ── */}
      <div className="flex items-center h-9 px-3 border-b border-border shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-comment">
          Chat
        </span>
        <span className="ml-2 text-[10px] text-comment/60 hidden sm:inline">
          Copilot
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            onClick={clearChat}
            className="w-7 h-7 flex items-center justify-center rounded text-comment hover:text-text hover:bg-border/40 transition-colors"
            aria-label="New chat"
            title="New chat (clear conversation)"
          >
            <Icon name="add" size="text-[16px]" />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-comment hover:text-text hover:bg-border/40 transition-colors"
            aria-label="Close panel"
            title="Close panel"
          >
            <Icon name="close" size="text-[16px]" />
          </button>
        </div>
      </div>

      {/* ── Transcript ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-start gap-5 pt-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Icon name="auto_awesome" size="text-[22px]" className="text-accent" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text">Hi, I'm Copilot.</h3>
              <p className="text-[13px] text-comment leading-relaxed mt-1 max-w-[300px]">
                Ask me anything about Shanmuga's portfolio — his experience,
                projects, skills, or how to reach him.
              </p>
            </div>
            <div className="w-full space-y-1.5">
              {suggestions.map((q, i) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full flex items-center gap-2.5 text-left text-[12px] px-3 py-2 rounded-md border border-border hover:border-accent/40 hover:bg-accent/5 text-comment hover:text-text transition-colors cursor-pointer"
                >
                  <Icon
                    name={SUGGESTION_ICONS[i % SUGGESTION_ICONS.length]}
                    size="text-[14px]"
                    className="text-accent shrink-0"
                  />
                  <span className="truncate">{q}</span>
                  <Icon name="chevron_right" size="text-[14px]" className="ml-auto text-comment/40 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                {msg.role === "user" ? (
                  <UserTurn message={msg} />
                ) : msg.role === "error" ? (
                  <ErrorTurn message={msg} />
                ) : (
                  <CopilotTurn message={msg} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Follow-up chips (after the latest response) ── */}
      {messages.length > 0 && !isLoading && (
        <div className="px-3 pb-2 shrink-0 flex flex-wrap gap-1.5">
          {suggestions.slice(0, 2).map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-border text-comment hover:border-accent/50 hover:text-accent transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Input box (VS Code style: toolbar inside the container) ── */}
      <div className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 shrink-0 border-t-0">
        <div className="rounded-lg border border-border bg-bg focus-within:border-accent/60 transition-colors overflow-visible relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeMode.placeholder}
            rows={1}
            className="w-full bg-transparent text-sm text-text placeholder:text-comment/60 resize-none outline-none px-3 pt-2.5 pb-1 max-h-[140px] scrollbar-thin"
            style={{ height: "auto", minHeight: "22px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
            }}
            disabled={isLoading}
            aria-label="Ask Copilot"
          />

          {/* Toolbar row inside the input container */}
          <div className="flex items-center gap-1 px-2 pb-2 pt-1">
            {/* Mode dropdown */}
            <div className="relative">
              <button
                onClick={() => setModeOpen((v) => !v)}
                aria-label={`Chat mode: ${activeMode.label}`}
                aria-expanded={modeOpen}
                className="flex items-center gap-1 px-1.5 py-1 rounded text-[11px] text-comment hover:text-text hover:bg-border/40 transition-colors cursor-pointer"
                title="Chat mode"
              >
                {activeMode.label}
                <Icon name="expand_more" size="text-[13px]" />
              </button>
              <Popover open={modeOpen} onClose={() => setModeOpen(false)}>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    role="menuitem"
                    onClick={() => {
                      setMode(m.id);
                      setModeOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                      mode === m.id ? "text-accent bg-accent/10" : "text-text hover:bg-border/30"
                    }`}
                  >
                    {mode === m.id && <Icon name="check" size="text-[13px]" />}
                    <span className={mode === m.id ? "" : "pl-[17px]"}>{m.label}</span>
                  </button>
                ))}
              </Popover>
            </div>

            {/* Model picker */}
            <div className="relative">
              <button
                onClick={() => setModelOpen((v) => !v)}
                aria-label={`Model: ${currentModel.name}`}
                aria-expanded={modelOpen}
                className="flex items-center gap-1 px-1.5 py-1 rounded text-[11px] text-comment hover:text-text hover:bg-border/40 transition-colors cursor-pointer"
                title="Model"
              >
                <Icon name={currentModel.icon} size="text-[13px]" />
                <span className="hidden sm:inline max-w-[80px] truncate">{currentModel.name}</span>
                <Icon name="expand_more" size="text-[13px]" />
              </button>
              <Popover open={modelOpen} onClose={() => setModelOpen(false)}>
                {models.map((m) => (
                  <button
                    key={m.id}
                    role="menuitem"
                    onClick={() => {
                      setSelectedModel(m.id);
                      setModelOpen(false);
                    }}
                    className={`w-full flex items-start gap-2 px-3 py-1.5 text-left transition-colors ${
                      m.id === selectedModel ? "text-accent bg-accent/10" : "text-text hover:bg-border/30"
                    }`}
                  >
                    {m.id === selectedModel ? (
                      <Icon name="check" size="text-[13px]" className="mt-0.5" />
                    ) : (
                      <span className="w-[13px]" />
                    )}
                    <span className="min-w-0">
                      <span className="block text-xs">{m.name}</span>
                      <span className="block text-[10px] text-comment/70 truncate">{m.description}</span>
                    </span>
                  </button>
                ))}
              </Popover>
            </div>

            {/* Send button — circular, accent when ready */}
            <button
              onClick={() => canSend && sendMessage(input)}
              disabled={!canSend}
              aria-label="Send message"
              title="Send (Enter)"
              className={`ml-auto w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                canSend
                  ? "bg-accent text-bg hover:opacity-90 cursor-pointer"
                  : "bg-border/60 text-comment/60 cursor-default"
              }`}
            >
              <Icon name={isLoading ? "hourglass_empty" : "arrow_upward"} size="text-[15px]" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-comment/50 mt-1.5 px-1 select-none">
          Enter to send · Shift+Enter for newline
          {mode !== "ask" && <span className="ml-1">· {activeMode.label} mode</span>}
        </p>
      </div>
    </div>
  );
}
