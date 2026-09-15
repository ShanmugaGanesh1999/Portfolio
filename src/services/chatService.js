// ============================================================
// RAG CHAT SERVICE — OpenRouter Multi-Model
// ============================================================
// Pipeline:
//   1. Validate input & enforce rate limits (anti-exploitation)
//   2. Score & retrieve the most relevant doc chunks from RAG_CHUNKS
//   3. Build prompt = MASTER_SYSTEM_PROMPT + retrieved context
//   4. Send to selected model via OpenRouter
//   5. Stream response back to the UI
// ============================================================

import { MODELS, DEFAULT_MODEL } from "./chatModels.js";
export { getAvailableModels, getDefaultModelId } from "./chatModels.js";

// ─── Rate Limiting (client-side anti-exploitation) ───────────

const RATE_LIMIT = {
  maxPerMinute: 10,
  maxPerSession: 100,
  timestamps: [],
  sessionCount: 0,
};

function checkRateLimit() {
  const now = Date.now();
  RATE_LIMIT.timestamps = RATE_LIMIT.timestamps.filter((t) => now - t < 60_000);

  if (RATE_LIMIT.timestamps.length >= RATE_LIMIT.maxPerMinute) {
    throw new Error(
      "You're sending messages too quickly. Please wait a moment before trying again."
    );
  }
  if (RATE_LIMIT.sessionCount >= RATE_LIMIT.maxPerSession) {
    throw new Error(
      "You've reached the session message limit. Please refresh the page to start a new session."
    );
  }

  RATE_LIMIT.timestamps.push(now);
  RATE_LIMIT.sessionCount++;
}

// ─── Input Validation ────────────────────────────────────────

const MAX_QUERY_LENGTH = 500;

function validateInput(query) {
  if (!query || typeof query !== "string") {
    throw new Error("Please enter a valid question.");
  }
  if (query.trim().length < 2) {
    throw new Error("Please enter a more specific question.");
  }
  if (query.length > MAX_QUERY_LENGTH) {
    throw new Error(`Questions must be under ${MAX_QUERY_LENGTH} characters.`);
  }
}

// ─── Chat API Call (OpenRouter) ───────────────────────────────

/**
 * Send a query to the selected model via OpenRouter (SSE streaming).
 * @param {string} query - User's question
 * @param {Array} conversationHistory - Previous messages [{role, content}]
 * @param {function} onChunk - Callback for each streamed text chunk
 * @param {AbortSignal} signal - Optional abort signal
 * @param {string} modelId - Model ID key from MODELS config
 * @returns {Promise<string>} Full response text
 */
export async function chatQuery(
  query,
  conversationHistory = [],
  onChunk = null,
  signal = null,
  modelId = DEFAULT_MODEL,
  options = {},
) {
  validateInput(query);
  checkRateLimit();
  const resolvedModel = MODELS[modelId] ? modelId : DEFAULT_MODEL;
  let response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        history: conversationHistory.slice(-10).map(({role, content}) => ({role, content: content.slice(0, 8000)})),
        model: resolvedModel,
        mode: options.mode || "ask",
        documents: options.documents || [],
        selection: options.selection?.slice(0, 4000) || "",
        stream: !!onChunk,
      }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error(
      "Network error — the assistant could not be reached. Check your connection and try again."
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  // ── Streaming response ──
  if (onChunk) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    const consume = (line) => {
      if (!line.startsWith("data:")) return;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") return;
      let parsed;
      try { parsed = JSON.parse(data); } catch { throw new Error("The model returned an incomplete response. Please retry."); }
      if (parsed.error) throw new Error("The model interrupted its response. Please retry or choose another model.");
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) { fullText += content; onChunk(content); }
    };
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { buffer += decoder.decode(); if (buffer.trim()) consume(buffer); break; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        lines.forEach(consume);
      }
    } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
    if (!fullText) throw new Error("The model returned no answer. Please retry or choose another model.");

    return fullText;
  }

  // ── Non-streaming response ──
  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content ||
    "I couldn't generate a response. Please try again."
  );
}

/**
 * Suggested questions shown in the chat UI.
 */
export function getSuggestedQuestions() {
  return [
    "What is Shanmuga currently working on?",
    "What are his technical skills?",
    "Tell me about the Market Data project",
    "What did he build at Zoho?",
  ];
}