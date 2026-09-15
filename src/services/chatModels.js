export const MODELS = {
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    routerModel: "openai/gpt-4o-mini",
    provider: "openrouter",
    maxTokens: 500,
    temperature: 0.3,
    tier: "fast",
    icon: "bolt",
    description: "OpenAI · Fast & affordable",
  },
  "claude-haiku": {
    id: "claude-haiku",
    name: "Claude 3.5 Haiku",
    routerModel: "anthropic/claude-3.5-haiku",
    provider: "openrouter",
    maxTokens: 500,
    temperature: 0.3,
    tier: "fast",
    icon: "electric_bolt",
    description: "Anthropic · Lightning fast",
  },
  "deepseek-r1-distill": {
    id: "deepseek-r1-distill",
    name: "DeepSeek R1 Distill",
    routerModel: "deepseek/deepseek-r1-distill-llama-70b",
    provider: "openrouter",
    maxTokens: 500,
    temperature: 0.3,
    tier: "fast",
    icon: "speed",
    description: "DeepSeek · Ultra budget",
  },
};

export const DEFAULT_MODEL = "claude-haiku";

export function getAvailableModels() {
  return Object.values(MODELS);
}

export function getDefaultModelId() {
  return DEFAULT_MODEL;
}

