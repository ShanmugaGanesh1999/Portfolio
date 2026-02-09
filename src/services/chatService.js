// ============================================================
// RAG CHAT SERVICE — OpenRouter + Claude Opus 4
// ============================================================
// Pipeline:
//   1. Validate input & enforce rate limits (anti-exploitation)
//   2. Score & retrieve the most relevant doc chunks from RAG_CHUNKS
//   3. Build prompt = MASTER_SYSTEM_PROMPT + retrieved context
//   4. Send to Claude Opus 4 via OpenRouter
//   5. Stream response back to the UI
// ============================================================

import { MASTER_SYSTEM_PROMPT, RAG_CHUNKS } from "../data/masterPrompt";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = "anthropic/claude-opus-4";

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

// ─── Keyword-Based RAG Retrieval ─────────────────────────────

/**
 * Score a single RAG chunk against the user query.
 * Uses multi-signal scoring: heading match, topic keywords,
 * content overlap, and contextual boosts.
 */
function scoreChunk(query, chunk) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
  const topicWords = chunk.topic.toLowerCase().split(/[,\s]+/).filter(Boolean);
  const contentLower = chunk.content.toLowerCase();
  const headingLower = chunk.heading.toLowerCase();

  let score = 0;

  // Exact query in heading (highest signal)
  if (headingLower.includes(queryLower)) score += 15;

  // Exact query in topic string
  if (chunk.topic.toLowerCase().includes(queryLower)) score += 10;

  // Word-level matching
  for (const word of queryWords) {
    if (topicWords.some((tw) => tw.includes(word) || word.includes(tw)))
      score += 3;
    if (headingLower.includes(word)) score += 4;
    if (contentLower.includes(word)) score += 1;
  }

  // Contextual boosts for common question patterns
  const boosts = {
    "current|now|working|present|today": ["musk", "gale"],
    "zoho|crm|tax|validation|rollup|recent items": ["zoho"],
    "university|cwru|campus|iam|oauth|sso|access": ["case_western", "cwru"],
    "augusta|hitech|ml|lead|scoring|junior|first": ["augusta"],
    "skill|tech|stack|language|framework|tool|cloud": ["skills", "technical"],
    "education|degree|gpa|masters|coursework": ["education"],
    "contact|email|phone|linkedin|github|reach": ["contact"],
    "project|built|build|architecture|system": ["project"],
    "experience|work|job|role|career|history": ["experience", "accomplishments", "role"],
    "metric|number|stat|performance|achievement|uptime": ["key", "metrics", "accomplishments"],
    "about|who|summary|overview|introduce|background": ["summary", "about", "overview", "profile"],
  };

  for (const [pattern, sourceKeywords] of Object.entries(boosts)) {
    if (new RegExp(pattern, "i").test(queryLower)) {
      if (
        sourceKeywords.some(
          (kw) =>
            chunk.source.toLowerCase().includes(kw) ||
            chunk.id.toLowerCase().includes(kw) ||
            chunk.heading.toLowerCase().includes(kw)
        )
      ) {
        score += 5;
      }
    }
  }

  // Normalize to 0–1
  return Math.min(score / (queryWords.length * 5 || 1), 1);
}

/**
 * Retrieve the top-K most relevant RAG chunks for a query.
 * Falls back to overview/summary chunks if nothing scores well.
 */
function retrieveChunks(query, topK = 5) {
  const scored = RAG_CHUNKS.map((chunk) => ({
    ...chunk,
    score: scoreChunk(query, chunk),
  }));

  scored.sort((a, b) => b.score - a.score);

  const results = scored.filter((c) => c.score > 0).slice(0, topK);

  // Fallback: if nothing scored, return overview / summary chunks
  if (results.length === 0) {
    return RAG_CHUNKS.filter(
      (c) =>
        c.heading.toLowerCase().includes("overview") ||
        c.heading.toLowerCase().includes("summary") ||
        c.id.includes("profile")
    ).slice(0, 3);
  }

  return results;
}

// ─── Message Builder ─────────────────────────────────────────

/**
 * Build the full messages array:
 *   [system (master prompt + retrieved context), ...history, user query]
 */
function buildMessages(query, conversationHistory = []) {
  const relevantChunks = retrieveChunks(query);

  const contextBlock = relevantChunks
    .map((c) => `### [Source: ${c.docTitle} — ${c.heading}]\n${c.content}`)
    .join("\n\n---\n\n");

  const systemMessage = {
    role: "system",
    content: `${MASTER_SYSTEM_PROMPT}\n\n---\n\n## RETRIEVED CONTEXT\nThe following sections were retrieved from Shanmuga's portfolio documents. Use ONLY this information to answer.\n\n${contextBlock}`,
  };

  // Keep last 10 messages for conversational context
  const recentHistory = conversationHistory.slice(-10);

  return [systemMessage, ...recentHistory, { role: "user", content: query }];
}

// ─── Chat API Call ───────────────────────────────────────────

/**
 * Send a query to Claude Opus 4 via OpenRouter with streaming.
 * @param {string} query - User's question
 * @param {Array} conversationHistory - Previous messages [{role, content}]
 * @param {function} onChunk - Callback for each streamed text chunk
 * @param {AbortSignal} signal - Optional abort signal
 * @returns {Promise<string>} Full response text
 */
export async function chatQuery(
  query,
  conversationHistory = [],
  onChunk = null,
  signal = null
) {
  // Guard: validate & rate-limit before hitting the API
  validateInput(query);
  checkRateLimit();

  if (!API_KEY) {
    throw new Error(
      "OpenRouter API key not configured. Add VITE_OPENROUTER_API_KEY to your .env file."
    );
  }

  const messages = buildMessages(query, conversationHistory);

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Shanmuga Ganesh Portfolio",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: !!onChunk,
      max_tokens: 500,
      temperature: 0.3,
    }),
    signal,
  });

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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(content);
            }
          } catch {
            // Skip malformed SSE chunks
          }
        }
      }
    }

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