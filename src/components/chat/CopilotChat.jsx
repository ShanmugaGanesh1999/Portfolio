import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatQuery, getSuggestedQuestions, getAvailableModels, getDefaultModelId } from "../../services/chatService";
import { Icon } from "../ui";
import { useWorkspace } from "../../workspace/WorkspaceContext";

// ─── Timestamp Formatter ─────────────────────────────────────

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ─── Message Bubble ──────────────────────────────────────────

function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} animate-fade-in-up`}>
      <div className={`flex gap-3 ${isUser ? "justify-end" : ""} w-full`}>
        {/* Avatar - only for assistant */}
        {!isUser && (
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isError
                ? "bg-keyword/15 text-keyword"
                : "bg-success/15 text-success"
            }`}
          >
            <Icon name={isError ? "error" : "smart_toy"} size="text-[16px]" />
          </div>
        )}

        {/* Message body */}
        <div
          className={`max-w-[90%] sm:max-w-[85%] text-[12px] sm:text-[13px] leading-[1.6] ${
            isUser
              ? "bg-accent/10 border border-accent/20 rounded-2xl rounded-tr-md px-4 py-3 text-text"
              : isError
              ? "bg-keyword/5 border border-keyword/15 rounded-2xl rounded-tl-md px-4 py-3 text-keyword"
              : "text-text"
          }`}
        >
          {message.isStreaming && !message.content ? (
            <span className="inline-flex gap-1.5 items-center text-comment py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" style={{ animationDelay: "300ms" }} />
            </span>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>

      {/* Timestamp */}
      {message.timestamp && (
        <div className={`text-[10px] text-comment/50 ${isUser ? "pr-1" : "pl-11"} select-none`}>
          {formatTimestamp(message.timestamp)}
          {!isUser && message.model && !message.isStreaming && (
            <span className="ml-1.5 text-comment/40">· {message.model}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Markdown Renderer (safe — ReactMarkdown, no raw HTML) ───

const MD_COMPONENTS = {
  p: (props) => <p className="mb-1.5 last:mb-0 leading-[1.6]" {...props} />,
  strong: (props) => <strong className="font-bold text-text" {...props} />,
  em: (props) => <em className="text-string" {...props} />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent/60 transition-colors"
    >
      {children}
    </a>
  ),
  h1: (props) => <h1 className="font-bold text-text text-[15px] mt-3 mb-1.5 first:mt-0" {...props} />,
  h2: (props) => <h2 className="font-bold text-text text-[14px] mt-3 mb-1.5 first:mt-0" {...props} />,
  h3: (props) => <h3 className="font-bold text-text text-[13px] mt-2.5 mb-1 first:mt-0" {...props} />,
  ul: (props) => <ul className="list-disc ml-4 space-y-1 my-1.5 marker:text-success" {...props} />,
  ol: (props) => <ol className="list-decimal ml-4 space-y-1 my-1.5 marker:text-variable" {...props} />,
  li: (props) => <li className="leading-[1.5] pl-0.5" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-accent/40 pl-3 my-1.5 text-comment italic" {...props} />
  ),
  hr: () => <hr className="border-border my-2" />,
  pre: (props) => (
    <pre className="bg-bg border border-border rounded-md p-2.5 my-1.5 overflow-x-auto text-[11px] font-mono scrollbar-thin" {...props} />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className || "");
    if (isBlock) return <code className={`${className} font-mono`} {...props}>{children}</code>;
    return (
      <code className="bg-border/40 px-1.5 py-0.5 rounded-md text-variable text-[12px] font-mono" {...props}>
        {children}
      </code>
    );
  },
  table: (props) => (
    <div className="overflow-x-auto my-2 scrollbar-thin">
      <table className="w-full text-[11px] border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-border bg-border/30 px-2 py-1 text-left font-bold text-accent" {...props} />
  ),
  td: (props) => <td className="border border-border px-2 py-1 align-top" {...props} />,
};

function MarkdownRenderer({ content }) {
  if (!content) return null;
  return (
    <div className="break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ─── Model Switcher ──────────────────────────────────────────

function ModelSwitcher({ selectedModel, onModelChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const models = getAvailableModels();
  const current = models.find((m) => m.id === selectedModel) || models[0];

  const tierColors = {
    fast: "text-success",
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-border/30 hover:bg-border/60 text-comment hover:text-text transition-all cursor-pointer border border-transparent hover:border-border/50"
        title="Switch model"
      >
        <Icon name={current.icon} size="text-[13px]" className={tierColors[current.tier]} />
        <span className="max-w-[90px] truncate">{current.name}</span>
        <Icon name={isOpen ? "expand_less" : "expand_more"} size="text-[14px]" className="text-comment/60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1.5 w-56 bg-sidebar border border-border rounded-lg shadow-xl shadow-black/30 z-50 overflow-hidden animate-fade-in-up" style={{ animationDuration: "150ms" }}>
          <div className="px-3 py-2 border-b border-border/50">
            <div className="text-[10px] font-bold text-comment uppercase tracking-widest">Select Model</div>
          </div>
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-border/30 transition-colors cursor-pointer ${
                model.id === selectedModel ? "bg-accent/8 border-l-2 border-l-accent" : "border-l-2 border-l-transparent"
              }`}
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                model.id === selectedModel ? "bg-accent/15" : "bg-border/40"
              }`}>
                <Icon name={model.icon} size="text-[15px]" className={tierColors[model.tier]} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[12px] font-medium ${model.id === selectedModel ? "text-accent" : "text-text"}`}>
                  {model.name}
                </div>
                <div className="text-[10px] text-comment/60 truncate">{model.description}</div>
              </div>
              {model.id === selectedModel && (
                <Icon name="check_circle" size="text-[14px]" className="text-accent shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Chat Panel ─────────────────────────────────────────

export default function CopilotChat({ isOpen, onClose }) {
  const ws = useWorkspace();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getDefaultModelId);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const suggestions = getSuggestedQuestions();
  const models = getAvailableModels();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Send message
  const sendMessage = useCallback(async (text) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    setInput("");

    const now = Date.now();
    const currentModel = models.find((m) => m.id === selectedModel) || models[0];
    // Add user message
    const userMsg = { role: "user", content: userMessage, id: now, timestamp: now };
    const assistantMsg = { role: "assistant", content: "", id: now + 1, isStreaming: true, timestamp: now, model: currentModel.name };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    // Build conversation history for context
    const history = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role, content: m.content }));

    // Abort previous request if any
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await chatQuery(
        userMessage,
        history,
        (chunk) => {
          // FIX: Create new object instead of mutating to prevent
          // React 18 StrictMode double-invocation from duplicating text
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.isStreaming) {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return updated;
          });
        },
        controller.signal,
        selectedModel,
      );

      // Mark streaming complete
      setMessages(prev => {
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

      // Replace the streaming message with error
      setMessages(prev => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, messages, selectedModel, models]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (abortRef.current) abortRef.current.abort();
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center">
          <Icon name="smart_toy" size="text-[16px]" className="text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold text-text">Copilot</div>
          <div className="text-[10px] text-comment uppercase tracking-wide">Ask about Shanmuga</div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-comment hover:text-text hover:bg-border/50 transition-colors cursor-pointer"
          aria-label="Close Copilot"
          title="Close Copilot"
        >
          <Icon name="close" size="text-[18px]" />
        </button>
      </div>

      {/* ── Sessions Section (if there are messages) ── */}
      {messages.length > 0 && (
        <div className="border-b border-border bg-sidebar/50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-comment uppercase tracking-widest">Current Session</div>
              <button
                onClick={clearChat}
                className="p-1 rounded-md hover:bg-border/70 text-comment hover:text-keyword transition-colors cursor-pointer"
                title="Clear chat"
              >
                <Icon name="delete" size="text-[14px]" />
              </button>
            </div>
            <div className="text-[12px] text-text/80">
              {messages.filter(m => m.role === 'user').length} message{messages.filter(m => m.role === 'user').length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

        {/* ── Messages Area ── */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 scrollbar-thin bg-bg">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-start justify-start h-full gap-8 pt-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-success/15 to-accent/15 border border-border/50 flex items-center justify-center">
                <Icon name="smart_toy" size="text-3xl" className="text-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text mb-2">Welcome to Copilot</h3>
                <p className="text-[13px] text-comment leading-relaxed max-w-[340px]">
                  I'm an AI assistant trained on Shanmuga's portfolio. Ask me about his experience, projects, technical skills, or any other details from his background.
                </p>
              </div>
              <div className="space-y-3 w-full">
                <div className="text-[11px] font-bold text-comment uppercase tracking-widest">Suggested questions</div>
                <div className="flex flex-col gap-2 w-full">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-[12px] px-4 py-2.5 rounded-lg border border-border bg-sidebar hover:bg-border/50 hover:border-accent/30 text-text transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ── Suggestions (when there are messages) ── */}
        {messages.length > 0 && !isLoading && (
          <div className="px-3 sm:px-4 pb-3 pt-2 border-t border-border/50 bg-sidebar/30 shrink-0">
            <div className="text-[10px] font-bold text-comment uppercase tracking-widest mb-2">Suggestions</div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.slice(0, 2).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-2.5 py-1.5 rounded-md border border-border/50 bg-sidebar hover:bg-border/50 hover:border-accent/40 text-comment hover:text-accent transition-all cursor-pointer whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input Area ── */}
        <form
          onSubmit={handleSubmit}
          className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-border bg-sidebar shrink-0"
        >
          {/* Model Selector */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="text-[10px] text-comment/60 font-medium">AI Model</div>
            <ModelSwitcher selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </div>
          
          <div className="flex items-end gap-2.5 bg-bg border border-border rounded-lg px-3 py-2.5 focus-within:border-accent/50 transition-colors">
            <Icon name="edit" size="text-[16px]" className="text-comment shrink-0 mb-0.5" />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Shanmuga's experience..."
              rows={1}
              className="flex-1 bg-transparent text-[13px] text-text placeholder:text-comment/60 resize-none outline-none max-h-[100px] scrollbar-thin"
              style={{
                height: "auto",
                minHeight: "22px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-1.5 rounded-md shrink-0 mb-0.5 transition-all cursor-pointer ${
                input.trim() && !isLoading
                  ? "bg-accent text-bg hover:bg-accent/80"
                  : "text-comment/30"
              }`}
            >
              <Icon name={isLoading ? "hourglass_empty" : "send"} size="text-[15px]" />
            </button>
          </div>
          <p className="text-[9px] text-comment/40 mt-2 text-center leading-relaxed">
            Responses based on portfolio docs
          </p>
        </form>
      </div>
  );
}
