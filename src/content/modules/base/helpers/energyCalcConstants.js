export const REGION_REGISTRY = {
    EU: {
        carbon_g_per_kwh: 275,
        water_l_per_kwh: 5,
    },
    US: {
        carbon_g_per_kwh: 417,
        water_l_per_kwh: 7,
    },
    ASIA: {
        carbon_g_per_kwh: 600,
        water_l_per_kwh: 10,
    },
};

export const PROMPT_TYPE_MULTIPLIER = {
    "creative-writing": 1.1,
    "explanation": 1.05,
    "summarization": 0.85,
    "pricing": 1.0,
    "general": 1.0,
};

export const DOMAIN_MULTIPLIER = {
    marketing: 1.15,
    finance: 1.20,
    health: 1.10,
    sports: 1.0,
    politics: 1.0,
    culture: 1.0,
    climate: 1.0,
    coding: 1.0,
    education: 1.0,
    science: 1.0,
    history: 1.0,
    philosophy: 1.0,
    travel: 1.0,
    food: 1.0,
    fashion: 1.0,
    relationships: 1.0,
    self_improvement: 1.0,
    art: 1.0,
    music: 1.0,
    writing: 1.0,
    film: 1.0,
    gaming: 1.0,
    ai: 1.0,
    cybersecurity: 1.0,
    law: 1.0,
    sustainability: 1.0,
    general: 1.0,
};

export const LANGUAGE_MULTIPLIER = {
    en: 1.0,
    it: 1.0,
};

export const UI_MULTIPLIER = {
    regenerate_used: 2.0,
    suggested_prompt_used: 1.05,
    image_attached: 1.35,
    file_attached: 1.25,
    voice_input: 1.15,
    tool_active: 1.30,
};

export const MODEL_REGISTRY = {

    // ── OpenAI ──────────────────────────────────────────────────────────────────

    "gpt-5|standard": {
        energy_per_input_token: 0.000018,
        energy_per_output_token: 0.000036,
        power_watts: 400,
        latency_factor: 0.50,
    },
    "gpt-5|chat": {
        energy_per_input_token: 0.000019,
        energy_per_output_token: 0.000038,
        power_watts: 410,
        latency_factor: 0.52,
    },
    "gpt-5-mini|standard": {
        energy_per_input_token: 0.0000030,
        energy_per_output_token: 0.0000060,
        power_watts: 160,
        latency_factor: 0.28,
    },
    "gpt-5-mini|chat": {
        energy_per_input_token: 0.0000031,
        energy_per_output_token: 0.0000062,
        power_watts: 165,
        latency_factor: 0.29,
    },
    "gpt-5-nano|standard": {
        energy_per_input_token: 0.0000008,
        energy_per_output_token: 0.0000016,
        power_watts: 100,
        latency_factor: 0.20,
    },
    "gpt-4o|standard": {
        energy_per_input_token: 0.000002,
        energy_per_output_token: 0.000004,
        power_watts: 180,
        latency_factor: 0.30,
    },
    "gpt-4o|chat": {
        energy_per_input_token: 0.0000021,
        energy_per_output_token: 0.0000042,
        power_watts: 185,
        latency_factor: 0.32,
    },
    "gpt-4o-mini|standard": {
        energy_per_input_token: 0.0000008,
        energy_per_output_token: 0.0000015,
        power_watts: 120,
        latency_factor: 0.25,
    },
    "gpt-4o-mini|chat": {
        energy_per_input_token: 0.00000085,
        energy_per_output_token: 0.0000016,
        power_watts: 122,
        latency_factor: 0.26,
    },
    "gpt-4-turbo|standard": {
        energy_per_input_token: 0.0000028,
        energy_per_output_token: 0.0000056,
        power_watts: 210,
        latency_factor: 0.33,
    },
    "gpt-4|standard": {
        energy_per_input_token: 0.000003,
        energy_per_output_token: 0.000006,
        power_watts: 220,
        latency_factor: 0.35,
    },
    "gpt-3.5-turbo|standard": {
        energy_per_input_token: 0.000001,
        energy_per_output_token: 0.000002,
        power_watts: 140,
        latency_factor: 0.28,
    },
    "gpt-3.5-turbo|chat": {
        energy_per_input_token: 0.0000011,
        energy_per_output_token: 0.0000022,
        power_watts: 145,
        latency_factor: 0.29,
    },
    // Reasoning / o-series
    "o3|standard": {
        energy_per_input_token: 0.000020,
        energy_per_output_token: 0.000040,
        power_watts: 450,
        latency_factor: 0.60,
    },
    "o3-mini|standard": {
        energy_per_input_token: 0.000006,
        energy_per_output_token: 0.000012,
        power_watts: 220,
        latency_factor: 0.42,
    },
    "o1|standard": {
        energy_per_input_token: 0.000008,
        energy_per_output_token: 0.000015,
        power_watts: 300,
        latency_factor: 0.45,
    },
    "o1-mini|standard": {
        energy_per_input_token: 0.000004,
        energy_per_output_token: 0.000007,
        power_watts: 200,
        latency_factor: 0.38,
    },
    "o1-preview|standard": {
        energy_per_input_token: 0.000009,
        energy_per_output_token: 0.000017,
        power_watts: 320,
        latency_factor: 0.48,
    },
    // ChatGPT consumer product (unknown model, avg estimate)
    "chatgpt|standard": {
        energy_per_input_token: 0.00000034,
        energy_per_output_token: 0.00000068,
        power_watts: 180,
        latency_factor: 0.30,
    },
    "chatgpt|chat": {
        energy_per_input_token: 0.00000034,
        energy_per_output_token: 0.00000068,
        power_watts: 180,
        latency_factor: 0.30,
    },

    // ── Anthropic Claude ────────────────────────────────────────────────────────

    "claude-opus-4|standard": {
        energy_per_input_token: 0.000006,
        energy_per_output_token: 0.000012,
        power_watts: 280,
        latency_factor: 0.45,
    },
    "claude-opus-4|chat": {
        energy_per_input_token: 0.0000062,
        energy_per_output_token: 0.0000124,
        power_watts: 285,
        latency_factor: 0.46,
    },
    "claude-sonnet-4|standard": {
        energy_per_input_token: 0.0000022,
        energy_per_output_token: 0.0000044,
        power_watts: 190,
        latency_factor: 0.32,
    },
    "claude-sonnet-4|chat": {
        energy_per_input_token: 0.0000023,
        energy_per_output_token: 0.0000046,
        power_watts: 195,
        latency_factor: 0.33,
    },
    "claude-haiku-4|standard": {
        energy_per_input_token: 0.00000060,
        energy_per_output_token: 0.0000012,
        power_watts: 110,
        latency_factor: 0.22,
    },
    "claude-haiku-4|chat": {
        energy_per_input_token: 0.00000065,
        energy_per_output_token: 0.0000013,
        power_watts: 112,
        latency_factor: 0.23,
    },
    // Legacy names still seen in the wild
    "claude-opus|standard": {
        energy_per_input_token: 0.000007,
        energy_per_output_token: 0.000014,
        power_watts: 300,
        latency_factor: 0.47,
    },
    "claude-sonnet|standard": {
        energy_per_input_token: 0.0000025,
        energy_per_output_token: 0.0000050,
        power_watts: 195,
        latency_factor: 0.33,
    },
    "claude-sonnet|chat": {
        energy_per_input_token: 0.00000034,
        energy_per_output_token: 0.00000068,
        power_watts: 180,
        latency_factor: 0.30,
    },
    "claude-haiku|standard": {
        energy_per_input_token: 0.00000065,
        energy_per_output_token: 0.0000013,
        power_watts: 115,
        latency_factor: 0.22,
    },
    "claude-haiku|chat": {
        energy_per_input_token: 0.00000065,
        energy_per_output_token: 0.0000013,
        power_watts: 115,
        latency_factor: 0.22,
    },
    "claude-3-5-sonnet|standard": {
        energy_per_input_token: 0.0000024,
        energy_per_output_token: 0.0000048,
        power_watts: 190,
        latency_factor: 0.32,
    },
    "claude-3-5-haiku|standard": {
        energy_per_input_token: 0.00000060,
        energy_per_output_token: 0.0000012,
        power_watts: 110,
        latency_factor: 0.22,
    },
    "claude-3-opus|standard": {
        energy_per_input_token: 0.000008,
        energy_per_output_token: 0.000016,
        power_watts: 320,
        latency_factor: 0.50,
    },

    // ── Google Gemini ───────────────────────────────────────────────────────────

    "gemini-2-flash|standard": {
        energy_per_input_token: 0.00000045,
        energy_per_output_token: 0.00000090,
        power_watts: 130,
        latency_factor: 0.22,
    },
    "gemini-2-flash|chat": {
        energy_per_input_token: 0.00000046,
        energy_per_output_token: 0.00000092,
        power_watts: 132,
        latency_factor: 0.23,
    },
    "gemini-2-flash-lite|standard": {
        energy_per_input_token: 0.00000028,
        energy_per_output_token: 0.00000056,
        power_watts: 100,
        latency_factor: 0.18,
    },
    "gemini-2-pro|standard": {
        energy_per_input_token: 0.0000030,
        energy_per_output_token: 0.0000060,
        power_watts: 220,
        latency_factor: 0.35,
    },
    "gemini-2-pro|chat": {
        energy_per_input_token: 0.0000031,
        energy_per_output_token: 0.0000062,
        power_watts: 225,
        latency_factor: 0.36,
    },
    "gemini-1-5-pro|standard": {
        energy_per_input_token: 0.0000028,
        energy_per_output_token: 0.0000056,
        power_watts: 210,
        latency_factor: 0.34,
    },
    "gemini-1-5-flash|standard": {
        energy_per_input_token: 0.00000040,
        energy_per_output_token: 0.00000080,
        power_watts: 120,
        latency_factor: 0.20,
    },
    "gemini-1-0-pro|standard": {
        energy_per_input_token: 0.0000020,
        energy_per_output_token: 0.0000040,
        power_watts: 180,
        latency_factor: 0.30,
    },
    // Gemma open-weight (self-hosted typical)
    "gemma-2-27b|standard": {
        energy_per_input_token: 0.0000012,
        energy_per_output_token: 0.0000024,
        power_watts: 160,
        latency_factor: 0.28,
    },
    "gemma-2-9b|standard": {
        energy_per_input_token: 0.00000035,
        energy_per_output_token: 0.00000070,
        power_watts: 110,
        latency_factor: 0.22,
    },
    "gemma-3-27b|standard": {
        energy_per_input_token: 0.0000013,
        energy_per_output_token: 0.0000026,
        power_watts: 165,
        latency_factor: 0.29,
    },

    // ── Meta LLaMA ──────────────────────────────────────────────────────────────

    "llama-4-maverick|standard": {
        // MoE 400B total, ~17B active per token
        energy_per_input_token: 0.00000080,
        energy_per_output_token: 0.0000016,
        power_watts: 200,
        latency_factor: 0.28,
    },
    "llama-4-scout|standard": {
        // MoE, lighter variant
        energy_per_input_token: 0.00000040,
        energy_per_output_token: 0.00000080,
        power_watts: 140,
        latency_factor: 0.24,
    },
    "llama-3-1-405b|standard": {
        energy_per_input_token: 0.0000090,
        energy_per_output_token: 0.0000180,
        power_watts: 400,
        latency_factor: 0.55,
    },
    "llama-3-1-70b|standard": {
        energy_per_input_token: 0.0000011,
        energy_per_output_token: 0.0000022,
        power_watts: 160,
        latency_factor: 0.30,
    },
    "llama-3-1-8b|standard": {
        energy_per_input_token: 0.00000018,
        energy_per_output_token: 0.00000036,
        power_watts: 90,
        latency_factor: 0.18,
    },
    "llama-3-70b|standard": {
        energy_per_input_token: 0.0000012,
        energy_per_output_token: 0.0000024,
        power_watts: 165,
        latency_factor: 0.31,
    },
    "llama-3-8b|standard": {
        energy_per_input_token: 0.00000019,
        energy_per_output_token: 0.00000038,
        power_watts: 92,
        latency_factor: 0.19,
    },
    "llama-2-70b|standard": {
        energy_per_input_token: 0.0000015,
        energy_per_output_token: 0.0000030,
        power_watts: 175,
        latency_factor: 0.34,
    },
    "llama-2-13b|standard": {
        energy_per_input_token: 0.00000040,
        energy_per_output_token: 0.00000080,
        power_watts: 115,
        latency_factor: 0.24,
    },
    "llama-2-7b|standard": {
        energy_per_input_token: 0.00000022,
        energy_per_output_token: 0.00000044,
        power_watts: 95,
        latency_factor: 0.20,
    },

    // ── Mistral ─────────────────────────────────────────────────────────────────

    "mistral-large|standard": {
        energy_per_input_token: 0.0000030,
        energy_per_output_token: 0.0000060,
        power_watts: 210,
        latency_factor: 0.33,
    },
    "mistral-large-2|standard": {
        energy_per_input_token: 0.0000028,
        energy_per_output_token: 0.0000056,
        power_watts: 205,
        latency_factor: 0.32,
    },
    "mistral-medium|standard": {
        energy_per_input_token: 0.0000018,
        energy_per_output_token: 0.0000036,
        power_watts: 170,
        latency_factor: 0.29,
    },
    "mistral-small|standard": {
        energy_per_input_token: 0.00000090,
        energy_per_output_token: 0.0000018,
        power_watts: 130,
        latency_factor: 0.24,
    },
    "mistral-7b|standard": {
        energy_per_input_token: 0.00000020,
        energy_per_output_token: 0.00000040,
        power_watts: 95,
        latency_factor: 0.20,
    },
    "mistral-nemo|standard": {
        // 12B dense
        energy_per_input_token: 0.00000030,
        energy_per_output_token: 0.00000060,
        power_watts: 105,
        latency_factor: 0.22,
    },
    // MoE models — ~1/3 J/token vs equivalent dense due to sparse activation
    "mixtral-8x7b|standard": {
        energy_per_input_token: 0.00000070,
        energy_per_output_token: 0.0000014,
        power_watts: 140,
        latency_factor: 0.26,
    },
    "mixtral-8x22b|standard": {
        energy_per_input_token: 0.0000020,
        energy_per_output_token: 0.0000040,
        power_watts: 200,
        latency_factor: 0.32,
    },
    "codestral|standard": {
        energy_per_input_token: 0.00000090,
        energy_per_output_token: 0.0000018,
        power_watts: 130,
        latency_factor: 0.24,
    },

    // ── DeepSeek ────────────────────────────────────────────────────────────────

    "deepseek-v3|standard": {
        // MoE 671B total, 37B active — very efficient per effective param
        energy_per_input_token: 0.0000007,
        energy_per_output_token: 0.0000014,
        power_watts: 180,
        latency_factor: 0.28,
    },
    "deepseek-v3|chat": {
        energy_per_input_token: 0.00000072,
        energy_per_output_token: 0.0000014,
        power_watts: 182,
        latency_factor: 0.29,
    },
    "deepseek-v2|standard": {
        energy_per_input_token: 0.00000065,
        energy_per_output_token: 0.0000013,
        power_watts: 175,
        latency_factor: 0.27,
    },
    "deepseek-r1|standard": {
        // Reasoning model: high latency, extended chain-of-thought
        energy_per_input_token: 0.0000040,
        energy_per_output_token: 0.0000080,
        power_watts: 280,
        latency_factor: 0.55,
    },
    "deepseek-r1|chat": {
        energy_per_input_token: 0.0000042,
        energy_per_output_token: 0.0000084,
        power_watts: 282,
        latency_factor: 0.56,
    },
    "deepseek-r1-zero|standard": {
        energy_per_input_token: 0.0000038,
        energy_per_output_token: 0.0000076,
        power_watts: 270,
        latency_factor: 0.53,
    },
    "deepseek-coder-v2|standard": {
        energy_per_input_token: 0.00000075,
        energy_per_output_token: 0.0000015,
        power_watts: 185,
        latency_factor: 0.29,
    },
    "deepseek-67b|standard": {
        energy_per_input_token: 0.0000012,
        energy_per_output_token: 0.0000024,
        power_watts: 165,
        latency_factor: 0.30,
    },
    "deepseek-7b|standard": {
        energy_per_input_token: 0.00000020,
        energy_per_output_token: 0.00000040,
        power_watts: 92,
        latency_factor: 0.20,
    },

    // ── xAI Grok ────────────────────────────────────────────────────────────────

    "grok-3|standard": {
        energy_per_input_token: 0.0000040,
        energy_per_output_token: 0.0000080,
        power_watts: 300,
        latency_factor: 0.45,
    },
    "grok-3|chat": {
        energy_per_input_token: 0.0000042,
        energy_per_output_token: 0.0000084,
        power_watts: 305,
        latency_factor: 0.46,
    },
    "grok-3-mini|standard": {
        energy_per_input_token: 0.0000012,
        energy_per_output_token: 0.0000024,
        power_watts: 160,
        latency_factor: 0.28,
    },
    "grok-2|standard": {
        energy_per_input_token: 0.0000030,
        energy_per_output_token: 0.0000060,
        power_watts: 240,
        latency_factor: 0.40,
    },
    "grok-1|standard": {
        // MoE 314B total, sparse activation
        energy_per_input_token: 0.0000018,
        energy_per_output_token: 0.0000036,
        power_watts: 220,
        latency_factor: 0.35,
    },

    // ── Cohere ──────────────────────────────────────────────────────────────────

    "command-r-plus|standard": {
        energy_per_input_token: 0.0000025,
        energy_per_output_token: 0.0000050,
        power_watts: 200,
        latency_factor: 0.33,
    },
    "command-r|standard": {
        energy_per_input_token: 0.00000060,
        energy_per_output_token: 0.0000012,
        power_watts: 120,
        latency_factor: 0.23,
    },
    "command-light|standard": {
        energy_per_input_token: 0.00000025,
        energy_per_output_token: 0.00000050,
        power_watts: 90,
        latency_factor: 0.18,
    },
    "command|standard": {
        energy_per_input_token: 0.0000014,
        energy_per_output_token: 0.0000028,
        power_watts: 155,
        latency_factor: 0.27,
    },

    // ── Amazon Nova / Titan ─────────────────────────────────────────────────────

    "nova-pro|standard": {
        energy_per_input_token: 0.0000018,
        energy_per_output_token: 0.0000036,
        power_watts: 170,
        latency_factor: 0.29,
    },
    "nova-lite|standard": {
        energy_per_input_token: 0.00000035,
        energy_per_output_token: 0.00000070,
        power_watts: 105,
        latency_factor: 0.20,
    },
    "nova-micro|standard": {
        energy_per_input_token: 0.00000012,
        energy_per_output_token: 0.00000024,
        power_watts: 75,
        latency_factor: 0.15,
    },
    "titan-text-express|standard": {
        energy_per_input_token: 0.00000080,
        energy_per_output_token: 0.0000016,
        power_watts: 125,
        latency_factor: 0.24,
    },
    "titan-text-lite|standard": {
        energy_per_input_token: 0.00000030,
        energy_per_output_token: 0.00000060,
        power_watts: 95,
        latency_factor: 0.19,
    },

    // ── Qwen (Alibaba) ──────────────────────────────────────────────────────────

    "qwen-72b|standard": {
        energy_per_input_token: 0.0000011,
        energy_per_output_token: 0.0000022,
        power_watts: 160,
        latency_factor: 0.30,
    },
    "qwen-32b|standard": {
        energy_per_input_token: 0.00000055,
        energy_per_output_token: 0.0000011,
        power_watts: 125,
        latency_factor: 0.25,
    },
    "qwen-14b|standard": {
        energy_per_input_token: 0.00000030,
        energy_per_output_token: 0.00000060,
        power_watts: 105,
        latency_factor: 0.21,
    },
    "qwen-7b|standard": {
        energy_per_input_token: 0.00000018,
        energy_per_output_token: 0.00000036,
        power_watts: 90,
        latency_factor: 0.19,
    },
    "qwen2-72b|standard": {
        energy_per_input_token: 0.0000010,
        energy_per_output_token: 0.0000020,
        power_watts: 155,
        latency_factor: 0.29,
    },
    // MoE variant
    "qwen-moe|standard": {
        energy_per_input_token: 0.00000040,
        energy_per_output_token: 0.00000080,
        power_watts: 130,
        latency_factor: 0.24,
    },

    // ── Perplexity / Sonar ──────────────────────────────────────────────────────

    "sonar|standard": {
        energy_per_input_token: 0.000001,
        energy_per_output_token: 0.000002,
        power_watts: 300,
        latency_factor: 0.10,
    },
    "sonar-pro|standard": {
        energy_per_input_token: 0.0000025,
        energy_per_output_token: 0.0000050,
        power_watts: 200,
        latency_factor: 0.32,
    },
    "sonar-small|standard": {
        energy_per_input_token: 0.00000040,
        energy_per_output_token: 0.00000080,
        power_watts: 115,
        latency_factor: 0.21,
    },

    // ── Falcon ──────────────────────────────────────────────────────────────────

    "falcon-180b|standard": {
        energy_per_input_token: 0.0000050,
        energy_per_output_token: 0.000010,
        power_watts: 380,
        latency_factor: 0.52,
    },
    "falcon-40b|standard": {
        energy_per_input_token: 0.00000090,
        energy_per_output_token: 0.0000018,
        power_watts: 150,
        latency_factor: 0.29,
    },
    "falcon-7b|standard": {
        energy_per_input_token: 0.00000020,
        energy_per_output_token: 0.00000040,
        power_watts: 92,
        latency_factor: 0.20,
    },
    "falcon-2-11b|standard": {
        energy_per_input_token: 0.00000028,
        energy_per_output_token: 0.00000056,
        power_watts: 100,
        latency_factor: 0.21,
    },

    // ── Phi (Microsoft) ─────────────────────────────────────────────────────────

    "phi-3-mini|standard": {
        // 3.8B — very efficient on-device class
        energy_per_input_token: 0.000000080,
        energy_per_output_token: 0.00000016,
        power_watts: 60,
        latency_factor: 0.14,
    },
    "phi-3-small|standard": {
        // 7B
        energy_per_input_token: 0.00000016,
        energy_per_output_token: 0.00000032,
        power_watts: 85,
        latency_factor: 0.18,
    },
    "phi-3-medium|standard": {
        // 14B
        energy_per_input_token: 0.00000030,
        energy_per_output_token: 0.00000060,
        power_watts: 105,
        latency_factor: 0.22,
    },
    "phi-4|standard": {
        // 14B next-gen
        energy_per_input_token: 0.00000028,
        energy_per_output_token: 0.00000056,
        power_watts: 100,
        latency_factor: 0.21,
    },

    // ── Fallback / Unknown ───────────────────────────────────────────────────────

    "unknown|standard": {
        energy_per_input_token: 0.000002,
        energy_per_output_token: 0.000004,
        power_watts: 180,
        latency_factor: 0.30,
    },
    "default|standard": {
        energy_per_input_token: 0.000001,
        energy_per_output_token: 0.000002,
        power_watts: 300,
        latency_factor: 0.10,
    },
};