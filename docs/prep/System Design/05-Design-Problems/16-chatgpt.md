# Design ChatGPT

> Large Language Model serving with streaming responses

---

## 📋 Problem Statement

Design a system like ChatGPT that serves large language models to millions of users with conversational AI capabilities.

---

## R - Requirements

### Functional Requirements

```
1. Accept user prompts and generate responses
2. Maintain conversation history (context)
3. Stream responses token-by-token
4. Support multiple models (GPT-3.5, GPT-4)
5. Handle system prompts and personas
6. Plugin/tool integration (code execution, search)
7. Rate limiting per user/tier
```

### Non-Functional Requirements

```
1. Low time-to-first-token (<500ms)
2. Handle millions of concurrent users
3. High availability (99.9%)
4. Efficient GPU utilization
5. Cost-effective inference
```

---

## E - Estimation

```
Users: 100M weekly active
Conversations: 50M/day
Tokens per conversation: 2000 (input + output)

Compute:
├── 50M × 2000 tokens = 100B tokens/day
├── 1.15M tokens/second average
├── Peak: 3M tokens/second

GPU requirements:
├── GPT-3.5: ~7B params, needs 14GB VRAM (FP16)
├── GPT-4: ~1.8T params (rumored), multi-GPU
├── Throughput: ~100 tokens/sec per GPU
├── Need: 30,000+ GPUs for peak load

Storage:
├── Conversation history: 50M × 10KB = 500GB/day
├── Model weights: 100GB-2TB per model
├── User data: 100M × 1KB = 100GB
```

---

## H - High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  API Gateway                         │   │
│   │           (Auth, Rate Limiting, Routing)            │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │               Request Orchestrator                   │   │
│   │          (Context assembly, Tool dispatch)          │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │               Inference Queue                        │   │
│   │             (Priority, Batching)                    │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                                │
│   ┌─────────────────────────▼───────────────────────────┐   │
│   │              GPU Inference Cluster                   │   │
│   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│   │  │GPU Node│ │GPU Node│ │GPU Node│ │GPU Node│ ...   │   │
│   │  │(vLLM)  │ │(vLLM)  │ │(vLLM)  │ │(vLLM)  │       │   │
│   │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                   Data Layer                          │  │
│   │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │  │
│   │  │  Redis  │  │PostgreSQL│  │   Blob Storage    │   │  │
│   │  │(Session)│  │  (Users) │  │  (Model Weights)  │   │  │
│   │  └─────────┘  └──────────┘  └───────────────────┘   │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## D - Detailed Design

### LLM Inference Basics

```
┌─────────────────────────────────────────────────────────────┐
│              How LLM Inference Works                         │
│                                                              │
│   Autoregressive generation:                                 │
│   - Model generates one token at a time                     │
│   - Each new token depends on all previous tokens           │
│   - Cannot parallelize token generation                     │
│                                                              │
│   Example:                                                   │
│   Input: "What is the capital of France?"                   │
│   Output generation:                                         │
│   Step 1: "The" (attend to input)                          │
│   Step 2: " capital" (attend to input + "The")              │
│   Step 3: " of" (attend to input + "The capital")           │
│   Step 4: " France" (attend to all previous)               │
│   Step 5: " is" ...                                        │
│   Step 6: " Paris" ...                                     │
│   Step 7: "." [STOP]                                        │
│                                                              │
│   Two phases:                                                │
│   1. Prefill: Process input tokens (parallelizable)        │
│   2. Decode: Generate output tokens (sequential)           │
│                                                              │
│   Bottleneck: Memory bandwidth (loading weights per token) │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Streaming Response

```
┌─────────────────────────────────────────────────────────────┐
│              Streaming Architecture                          │
│                                                              │
│   Why stream?                                                │
│   - User sees response immediately                          │
│   - Better UX than waiting 30 seconds                       │
│   - Time-to-first-token is key metric                       │
│                                                              │
│   Implementation: Server-Sent Events (SSE)                   │
│                                                              │
│   Client request:                                            │
│   POST /v1/chat/completions                                  │
│   {"messages": [...], "stream": true}                       │
│                                                              │
│   Server response (chunked):                                 │
│   ```                                                       │
│   data: {"choices": [{"delta": {"content": "The"}}]}       │
│   data: {"choices": [{"delta": {"content": " capital"}}]}  │
│   data: {"choices": [{"delta": {"content": " is"}}]}       │
│   data: {"choices": [{"delta": {"content": " Paris"}}]}    │
│   data: {"choices": [{"delta": {"content": "."}}]}         │
│   data: [DONE]                                              │
│   ```                                                       │
│                                                              │
│   Client:                                                    │
│   ```javascript                                             │
│   const response = await fetch('/v1/chat/completions', {   │
│     method: 'POST',                                         │
│     body: JSON.stringify({messages, stream: true})         │
│   });                                                        │
│                                                              │
│   const reader = response.body.getReader();                 │
│   while (true) {                                            │
│     const {done, value} = await reader.read();             │
│     if (done) break;                                        │
│     // Parse and display token                             │
│   }                                                          │
│   ```                                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### KV Cache and Optimization

```
┌─────────────────────────────────────────────────────────────┐
│              KV Cache                                        │
│                                                              │
│   Problem: Each new token needs to attend to all previous   │
│   Naive: Recompute attention for all tokens each step       │
│   Solution: Cache Key-Value pairs from previous tokens      │
│                                                              │
│   Memory usage per request:                                  │
│   KV cache size = 2 × layers × heads × head_dim × seq_len  │
│   GPT-3: 2 × 96 × 96 × 128 × 4096 = ~10GB per request!     │
│                                                              │
│   Optimizations:                                             │
│                                                              │
│   1. PagedAttention (vLLM):                                 │
│      ├── Manage KV cache like OS virtual memory            │
│      ├── Allocate fixed-size blocks                        │
│      ├── Non-contiguous storage                            │
│      └── 24× higher throughput                             │
│                                                              │
│   2. Continuous batching:                                   │
│      ├── Don't wait for batch to complete                  │
│      ├── Add new requests as old ones finish               │
│      ├── Maximizes GPU utilization                         │
│      └── Reduces queuing time                              │
│                                                              │
│   3. Speculative decoding:                                  │
│      ├── Small model drafts tokens                         │
│      ├── Large model verifies in parallel                  │
│      ├── Accept correct tokens, reject others              │
│      └── 2-3× speedup                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Request Batching

```
┌─────────────────────────────────────────────────────────────┐
│              Batching Strategy                               │
│                                                              │
│   Naive batching:                                            │
│   - Wait for N requests, process together                  │
│   - Problem: All wait for slowest (longest output)         │
│                                                              │
│   Continuous batching:                                       │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Time →                                               │   │
│   │ Request A: ████████████████ (long response)         │   │
│   │ Request B: ████████ (medium)                        │   │
│   │ Request C: ████ (short)                             │   │
│   │ Request D:     ████████████ (arrives mid-batch)     │   │
│   │ Request E:         ████████                         │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   - C finishes first → slot freed for D                    │
│   - B finishes → slot freed for E                          │
│   - A continues uninterrupted                              │
│   - Result: Much higher throughput                         │
│                                                              │
│   Implementation:                                            │
│   - Inference engine (vLLM) handles batching               │
│   - Request queue feeds engine                             │
│   - Priority queues for paid tiers                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Conversation Context

```
┌─────────────────────────────────────────────────────────────┐
│              Context Management                              │
│                                                              │
│   Conversation format:                                       │
│   {                                                          │
│     "messages": [                                           │
│       {"role": "system", "content": "You are helpful..."},  │
│       {"role": "user", "content": "Hello!"},                │
│       {"role": "assistant", "content": "Hi there!"},        │
│       {"role": "user", "content": "What's 2+2?"}            │
│     ]                                                        │
│   }                                                          │
│                                                              │
│   Context window limits:                                     │
│   ├── GPT-3.5-turbo: 16K tokens                            │
│   ├── GPT-4: 8K/32K/128K tokens                            │
│   └── Must truncate or summarize if exceeds                │
│                                                              │
│   Truncation strategies:                                     │
│   1. Sliding window: Keep last N tokens                    │
│   2. Summarization: Compress old messages                  │
│   3. Selective: Keep system + recent + important           │
│                                                              │
│   Session storage:                                           │
│   ├── Redis for active sessions (fast access)             │
│   ├── PostgreSQL for persistence                          │
│   ├── TTL on inactive sessions                            │
│   └── User can load history on new session                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tool/Plugin Integration

```
┌─────────────────────────────────────────────────────────────┐
│              Function Calling / Tools                        │
│                                                              │
│   Enable LLM to use external tools:                         │
│                                                              │
│   Available tools:                                           │
│   ├── Web search                                           │
│   ├── Code interpreter (Python sandbox)                   │
│   ├── Image generation (DALL-E)                            │
│   ├── Database queries                                     │
│   └── Custom APIs                                          │
│                                                              │
│   Flow:                                                      │
│   1. User: "What's the weather in Tokyo?"                  │
│   2. LLM generates function call:                          │
│      {"name": "get_weather", "args": {"city": "Tokyo"}}    │
│   3. Orchestrator executes function                        │
│   4. Result injected into context                          │
│   5. LLM generates final response                          │
│                                                              │
│   Tool definition:                                           │
│   {                                                          │
│     "name": "get_weather",                                  │
│     "description": "Get current weather for a city",        │
│     "parameters": {                                         │
│       "type": "object",                                     │
│       "properties": {                                       │
│         "city": {"type": "string", "description": "City"}  │
│       },                                                     │
│       "required": ["city"]                                  │
│     }                                                        │
│   }                                                          │
│                                                              │
│   Security:                                                  │
│   ├── Sandboxed code execution                             │
│   ├── Rate limits on tools                                 │
│   ├── Validate tool outputs                                │
│   └── Audit logging                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Model Serving Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│              GPU Cluster Architecture                        │
│                                                              │
│   Inference stack:                                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Application Layer (FastAPI)                         │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │  Inference Engine (vLLM, TensorRT-LLM, TGI)         │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │  ML Framework (PyTorch, JAX)                        │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │  CUDA / cuDNN                                        │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │  GPU Hardware (A100, H100)                          │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   Scaling:                                                   │
│   ├── Horizontal: More GPU nodes                           │
│   ├── Tensor parallelism: Split model across GPUs         │
│   ├── Pipeline parallelism: Split layers across GPUs      │
│   └── Auto-scaling based on queue depth                   │
│                                                              │
│   Model deployment:                                          │
│   ├── Model weights in blob storage (S3)                  │
│   ├── Load on node startup                                │
│   ├── NVMe cache for fast loading                         │
│   └── Version management                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Rate Limiting and Tiers

```
┌─────────────────────────────────────────────────────────────┐
│              Rate Limiting                                   │
│                                                              │
│   Tiers:                                                     │
│   ├── Free: 10 requests/min, 3.5 only, short context       │
│   ├── Plus: 50 requests/min, GPT-4 access                  │
│   ├── API: Token-based billing                             │
│   └── Enterprise: Custom limits                            │
│                                                              │
│   Limits enforced at:                                        │
│   ├── Requests per minute                                  │
│   ├── Tokens per minute                                    │
│   ├── Tokens per day                                       │
│   └── Concurrent requests                                  │
│                                                              │
│   Implementation:                                            │
│   ├── Redis token bucket                                   │
│   ├── Sliding window counters                              │
│   ├── API key → tier mapping                              │
│   └── Return 429 with Retry-After header                  │
│                                                              │
│   Priority queuing:                                          │
│   ├── Paid users get higher priority                       │
│   ├── Separate queues per tier                            │
│   ├── Fair scheduling within tier                         │
│   └── Preemption for high-priority                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 API Design

```
# Chat completions (OpenAI-compatible)
POST /v1/chat/completions
{
    "model": "gpt-4",
    "messages": [
        {"role": "system", "content": "You are helpful."},
        {"role": "user", "content": "Hello!"}
    ],
    "stream": true,
    "max_tokens": 1000,
    "temperature": 0.7
}

# Response (streamed)
data: {"id": "chatcmpl-xxx", "choices": [{"delta": {"content": "Hi"}}]}
data: {"id": "chatcmpl-xxx", "choices": [{"delta": {"content": "!"}}]}
data: [DONE]

# Non-streamed response
{
    "id": "chatcmpl-xxx",
    "choices": [{
        "message": {"role": "assistant", "content": "Hi!"},
        "finish_reason": "stop"
    }],
    "usage": {"prompt_tokens": 10, "completion_tokens": 50}
}
```

---

## 📊 Summary

```
Key Components:
├── API Gateway: Auth, rate limiting, routing
├── Request Orchestrator: Context, tools, streaming
├── Inference Queue: Batching, priority
├── GPU Cluster: vLLM/TGI for efficient inference

Key Optimizations:
├── PagedAttention for memory efficiency
├── Continuous batching for throughput
├── Streaming for low time-to-first-token
├── KV cache for context reuse

Scale Challenges:
├── GPU cost dominates (~$3/hour per A100)
├── Memory limits context length
├── Cold starts for model loading
├── Handling traffic spikes
```

---

## 📖 Next Steps

→ Return to [Design Problems README](./README.md)
