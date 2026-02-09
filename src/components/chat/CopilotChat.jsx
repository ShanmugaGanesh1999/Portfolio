import { useState, useRef, useEffect, useCallback } from "react";
import { chatQuery, getSuggestedQuestions } from "../../services/chatService";
import { Icon } from "../ui";

// ─── Message Bubble ──────────────────────────────────────────

function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""} animate-fade-in-up`}>
      {/* Avatar - only for assistant */}
      {!isUser && (
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
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
        className={`max-w-[85%] text-[13px] leading-[1.6] ${
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
  );
}

// ─── Minimal Markdown Renderer ───────────────────────────────

function MarkdownRenderer({ content }) {
  if (!content) return null;

  const parts = content.split("\n").map((line, i) => {
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-text">$1</strong>');
    // Inline code
    line = line.replace(/`([^`]+)`/g, '<code class="bg-border/40 px-1.5 py-0.5 rounded-md text-variable text-[12px] font-mono">$1</code>');
    // Links
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent/60 transition-colors">$1</a>');
    
    // Bullet points
    if (line.match(/^[-•]\s/)) {
      const text = line.slice(2);
      return <p key={i} className="flex gap-2 mb-1"><span className="text-success shrink-0">›</span><span dangerouslySetInnerHTML={{ __html: text }} /></p>;
    }
    
    // Headings
    if (line.match(/^#{1,3}\s/)) {
      const text = line.replace(/^#{1,3}\s/, "");
      return <p key={i} className="font-bold text-text text-[14px] mt-3 mb-2 first:mt-0" dangerouslySetInnerHTML={{ __html: text }} />;
    }

    if (!line.trim()) return <br key={i} />;
    return <p key={i} className="mb-1.5 last:mb-0" dangerouslySetInnerHTML={{ __html: line }} />;
  });

  return <div className="space-y-0">{parts}</div>;
}

// ─── Main Chat Panel ─────────────────────────────────────────

export default function CopilotChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const suggestions = getSuggestedQuestions();

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

    // Add user message
    const userMsg = { role: "user", content: userMessage, id: Date.now() };
    const assistantMsg = { role: "assistant", content: "", id: Date.now() + 1, isStreaming: true };

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
          // Update the streaming message
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.isStreaming) {
              last.content += chunk;
            }
            return [...updated];
          });
        },
        controller.signal,
      );

      // Mark streaming complete
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.isStreaming) {
          last.isStreaming = false;
        }
        return [...updated];
      });
    } catch (err) {
      if (err.name === "AbortError") return;

      // Replace the streaming message with error
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "error",
          content: err.message || "Something went wrong. Please try again.",
          id: Date.now(),
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [isLoading, messages]);

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
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center">
          <Icon name="smart_toy" size="text-[16px]" className="text-success" />
        </div>
        <div>
          <div className="text-[14px] font-bold text-text">Copilot</div>
          <div className="text-[10px] text-comment uppercase tracking-wide">Ask about Shanmuga</div>
        </div>
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
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin bg-bg">
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
          <div className="px-4 pb-3 pt-2 border-t border-border/50 bg-sidebar/30 shrink-0">
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
          className="px-4 py-3 border-t border-border bg-sidebar shrink-0"
        >
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
            Powered by Claude · Responses based on portfolio docs
          </p>
        </form>
      </div>
  );
}
