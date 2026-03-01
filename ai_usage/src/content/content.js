// ================== AI Usage Meter – ChatGPT detector ==================
let lastRegenerateUsed = false;
let lastSuggestedPromptUsed = false;

let EXTENSION_VERSION = null;
let SESSION_START = null;
let SESSION_PROMPT_COUNT = null;
let TIME_SINCE_LAST_PROMPT = null;

const EVENT_SCHEMA_VERSION = 1; //Change when the schema changes for compatability reasons

chrome.runtime.sendMessage({ type: "GET_IDENTIFIERS" }, response => {
    USER_ID = response.user_id;
    SESSION_ID = response.session_id;
    EXTENSION_VERSION = response.extension_version;
});


chrome.runtime.sendMessage({ type: "GET_IDENTIFIERS" }, response => {
    USER_ID = response.user_id;
    SESSION_ID = response.session_id;
    SESSION_START = response.session_start;
    SESSION_PROMPT_COUNT = response.session_prompt_count;
    TIME_SINCE_LAST_PROMPT = response.time_since_last_prompt;
    EXTENSION_VERSION = response.extension_version;
});


// --- Utility: wait for element by selector --------------------------------
function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) {
        callback(el);
        return;
    }

    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
            observer.disconnect();
            callback(el);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// --- ChatGPT detector ------------------------------------------------------
function detectChatGPT(onPrompt) {
    console.log("[AI Usage Meter] ChatGPT detector active on", location.hostname);

    // ChatGPT now uses a ProseMirror contenteditable div with id="prompt-textarea"
    waitForElement("#prompt-textarea", editor => {
        console.log("[AI Usage Meter] ChatGPT editor found:", editor);

        // Messages live under <main> (more stable than old data-testid selectors)
        waitForElement("main", chatContainer => {
            console.log("[AI Usage Meter] ChatGPT chat container found:", chatContainer);

            setupChatGPTListeners(editor, chatContainer, onPrompt);
        });
    });
}

// --- Main logic once editor + chat container exist -------------------------
function setupChatGPTListeners(editor, chatContainer, onPrompt) {
    const sendButton = document.querySelector('[data-testid="send-button"]');
    console.log("[AI Usage Meter] Send button:", sendButton);

    function handleSubmit() {
        const text = editor.innerText.trim();
        if (!text) return;

        console.log("[AI Usage Meter] handleSubmit, text:", text);

        const model = getChatGPTModel();
        const tokensIn = estimateTokens(text);
        const conversationId = getConversationId();
        const promptStartTime = performance.now();

        const modelMode = detectModelMode();

        const promptType = classifyPrompt(text);
        const promptLanguage = detectLanguage(text);
        const promptDomain = detectDomain(text);
        const safetyCategory = classifySafety(text);

        const messageIndex = getUserMessageIndex();
        const conversationLength = getConversationLength();
        const isFollowup = detectFollowup(text);

        // Session metrics (based on globals populated from GET_IDENTIFIERS)
        const sessionDurationMs = Date.now() - SESSION_START;

        const sessionMetrics = {
            session_id: SESSION_ID,
            session_start: new Date(SESSION_START).toISOString(),
            session_prompt_count: SESSION_PROMPT_COUNT,
            session_duration_ms: sessionDurationMs,
            time_since_last_prompt_ms: TIME_SINCE_LAST_PROMPT
        };

        const uiSignals = {
            regenerate_used: lastRegenerateUsed || false,
            suggested_prompt_used: lastSuggestedPromptUsed || false,
            image_attached: hasImageAttachment(),
            file_attached: hasFileAttachment(),
            voice_input: isVoiceInputActive(),
            tool_active: isToolActive()
        };

        const env = getClientEnvironment();
        env.extension_version = EXTENSION_VERSION;

        // Reset one-time flags
        lastSuggestedPromptUsed = false;
        lastRegenerateUsed = false;

        const observer = new MutationObserver(() => {
            const response = getLastAssistantMessage();
            if (!response || response.length < 3) return;

            const tokensOut = estimateTokens(response);
            const latencyMs = performance.now() - promptStartTime;

            trackStreamingDuration(chatContainer, (streamingDurationMs) => {
                const event = {
                    schema_version: 1,
                    timestamp: new Date().toISOString(),

                    user: {
                        user_id: USER_ID
                    },

                    session: sessionMetrics,

                    prompt: {
                        text_length: text.length,
                        tokens_in: tokensIn,
                        prompt_type: promptType,
                        domain: promptDomain,
                        language: promptLanguage,
                        is_followup: isFollowup,
                        message_index: messageIndex,
                        conversation_length: conversationLength,
                        safety_category: safetyCategory
                    },

                    response: {
                        tokens_out: tokensOut,
                        characters_out: response.length,
                        latency_ms: latencyMs,
                        streaming_duration_ms: streamingDurationMs
                    },

                    model: {
                        model_name: model,
                        model_mode: modelMode
                    },

                    ui_interaction: {
                        regenerate_used: uiSignals.regenerate_used,
                        suggested_prompt_used: uiSignals.suggested_prompt_used,
                        image_attached: uiSignals.image_attached,
                        file_attached: uiSignals.file_attached,
                        voice_input: uiSignals.voice_input,
                        tool_active: uiSignals.tool_active
                    },

                    environment: {
                        browser_name: env.browser_name,
                        browser_version: env.browser_version,
                        os: env.os,
                        viewport_category: env.viewport_category,
                        timezone_offset_minutes: env.timezone_offset_minutes,
                        extension_version: env.extension_version
                    },

                    // keep your existing top-level fields that backend might rely on
                    source: "chatgpt",
                    conversation_id: conversationId
                };

                onPrompt(event);
            });

            observer.disconnect();
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    // Enter-to-send inside the ProseMirror editor
    document.addEventListener("keydown", e => {
        if (!e.target.closest("#prompt-textarea")) return;
        if (e.key === "Enter" && !e.shiftKey) {
            // Let ChatGPT handle the actual send, we just observe
            handleSubmit();
        }
    });

    // Click on send button
    if (sendButton) {
        sendButton.addEventListener("click", handleSubmit);
    }
}



// --- Helpers ---------------------------------------------------------------
function getChatGPTModel() {
    // 1. Try the main model switcher button
    const btn = document.querySelector('[data-testid="model-switcher-dropdown-button"]');
    if (btn) {
        const raw = btn.innerText.trim();
        const cleaned = normalizeModelName(raw);
        if (cleaned) return cleaned;
    }

    // 2. Try the dropdown menu (if open)
    const menuItems = [...document.querySelectorAll('[data-testid="model-switcher-dropdown"] *')];
    for (const item of menuItems) {
        const cleaned = normalizeModelName(item.innerText.trim());
        if (cleaned) return cleaned;
    }

    // 3. Fallback: scan the whole page for known model names
    const knownModels = [
        "gpt-4o", "gpt-4o mini", "gpt-4", "gpt-3.5",
        "o1", "o1-mini", "o3", "o3-mini"
    ];

    const allText = [...document.querySelectorAll("*")]
        .map(e => e.innerText)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    for (const model of knownModels) {
        if (allText.includes(model)) return model;
    }

    return "unknown";
}

function normalizeModelName(text) {
    if (!text) return null;

    const lower = text.toLowerCase();

    // Normalize common variants
    if (lower.includes("gpt-4o mini") || lower.includes("4o mini")) return "gpt-4o-mini";
    if (lower.includes("gpt-4o") || lower.includes("4o")) return "gpt-4o";
    if (lower.includes("gpt-4")) return "gpt-4";
    if (lower.includes("gpt-3.5")) return "gpt-3.5";

    // OpenAI "o" models
    if (lower.includes("o1-mini")) return "o1-mini";
    if (lower.includes("o1")) return "o1";
    if (lower.includes("o3-mini")) return "o3-mini";
    if (lower.includes("o3")) return "o3";

    // Sometimes the UI shows "Default (GPT‑4o)"
    const match = lower.match(/gpt[- ]?\d+(\.\d+)?[a-z\-]*/);
    if (match) return match[0];

    return null;
}

function detectModelMode() {
    // Vision
    if (document.querySelector('[data-testid="image-input"]') ||
        document.querySelector('#prompt-textarea img')) {
        return "vision";
    }

    // File uploads
    if (document.querySelector('[data-testid="file-input"]') ||
        document.querySelector('[data-testid="attachment"]')) {
        return "file";
    }

    // Voice
    const mic = document.querySelector('[data-testid="microphone-button"]');
    if (mic && mic.getAttribute("data-state") === "recording") {
        return "voice";
    }

    // Tools / Code Interpreter
    if (document.querySelector('[data-testid="tool-badge"]') ||
        document.querySelector('[data-testid="tool-output"]')) {
        return "tools";
    }

    // Browsing
    if (document.querySelector('[data-testid="web-browsing-indicator"]') ||
        document.body.innerText.toLowerCase().includes("browsing with bing")) {
        return "browsing";
    }

    // Default
    return "text";
}

function estimateTokens(text) {
    if (!text) return 0;
    const words = text.trim().split(/\s+/).length;
    return Math.round(words * 1.3);
}

function getLastAssistantMessage() {
    const msgs = document.querySelectorAll('[data-message-author-role="assistant"]');
    if (!msgs.length) return null;
    return msgs[msgs.length - 1].innerText.trim();
}

function getConversationId() {
    // 1. Check meta tag (most reliable)
    const meta = document.querySelector('meta[name="oai-conversation-id"]');
    if (meta?.content) return meta.content;

    // 2. Check Next.js global data
    try {
        const next = window.__NEXT_DATA__;
        const id = next?.props?.pageProps?.conversationId;
        if (id) return id;
    } catch (e) { }

    // 3. Fallback: old URL format
    const match = location.pathname.match(/\/c\/([a-z0-9-]+)/i);
    if (match) return match[1];

    return null;
}

function classifyPrompt(text) {
    const lower = text.toLowerCase().trim();

    // Code detection
    if (lower.includes("```") || /function\s+\w+\(/.test(lower) || /<[^>]+>/.test(lower)) {
        return "code";
    }

    // Rewrite / editing
    if (lower.startsWith("rewrite") ||
        lower.startsWith("improve") ||
        lower.startsWith("fix") ||
        lower.includes("make this") ||
        lower.includes("correct this") ||
        lower.includes("shorten this") ||
        lower.includes("edit this")) {
        return "rewrite";
    }

    // Question
    if (lower.endsWith("?") || lower.startsWith("why ") || lower.startsWith("how ")) {
        return "question";
    }

    // Instruction (imperative)
    const imperativeVerbs = [
        "write", "explain", "summarize", "generate", "create",
        "list", "compare", "analyze", "translate", "draft"
    ];
    if (imperativeVerbs.some(v => lower.startsWith(v + " "))) {
        return "instruction";
    }

    // Creative
    const creativeWords = ["story", "poem", "imagine", "roleplay", "character", "scene"];
    if (creativeWords.some(w => lower.includes(w))) {
        return "creative";
    }

    // Default
    return "chat";
}

function classifySafety(text) {
    const lower = text.toLowerCase();

    const medical = ["symptom", "treat", "diagnose", "medicine", "health", "pain", "disease"];
    const legal = ["law", "legal", "sue", "contract", "liability", "court"];
    const harmful = ["kill", "weapon", "harm", "explode", "poison", "self-harm"];
    const political = ["election", "vote", "candidate", "campaign", "politics"];
    const misinformation = ["flat earth", "chemtrails", "hoax", "fake news"];

    if (medical.some(w => lower.includes(w))) return "medical";
    if (legal.some(w => lower.includes(w))) return "legal";
    if (harmful.some(w => lower.includes(w))) return "harmful";
    if (political.some(w => lower.includes(w))) return "political";
    if (misinformation.some(w => lower.includes(w))) return "misinformation";

    return null; // no safety category
}

function detectDomain(text) {
    const lower = text.toLowerCase();

    const domains = [
        { name: "coding", keywords: ["code", "javascript", "python", "function", "bug", "api", "html", "css"] },
        { name: "math", keywords: ["calculate", "equation", "solve", "integral", "derivative", "probability"] },
        { name: "science", keywords: ["physics", "chemistry", "biology", "experiment", "scientific"] },
        { name: "business", keywords: ["marketing", "strategy", "startup", "business", "roi", "sales"] },
        { name: "creative_writing", keywords: ["story", "poem", "novel", "character", "plot"] },
        { name: "education", keywords: ["explain like", "homework", "study", "lesson", "teacher"] },
        { name: "productivity", keywords: ["plan", "organize", "schedule", "task", "workflow"] },
        { name: "translation", keywords: ["translate", "in english", "in italian", "traduci"] },
        { name: "data_analysis", keywords: ["dataset", "data", "statistics", "chart", "visualize"] },
        { name: "design", keywords: ["ux", "ui", "design", "layout", "wireframe"] }
    ];

    for (const domain of domains) {
        if (domain.keywords.some(k => lower.includes(k))) {
            return domain.name;
        }
    }

    return "general";
}

function detectLanguage(text) {
    const lower = text.toLowerCase();

    // Quick checks for scripts
    if (/[а-яё]/.test(lower)) return "ru";
    if (/[α-ω]/.test(lower)) return "el";
    if (/[\u4e00-\u9fff]/.test(lower)) return "zh";
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(lower)) return "ja";
    if (/[\uac00-\ud7af]/.test(lower)) return "ko";

    // Latin-based languages
    const languages = [
        { code: "en", words: ["the", "and", "you", "what", "how", "why", "I'm", 'my'] },
        { code: "it", words: ["che", "come", "perché", "questo", "quello", "ciao"] },
        { code: "es", words: ["que", "como", "hola", "porque", "esto"] },
        { code: "fr", words: ["que", "quoi", "bonjour", "pourquoi", "comment"] },
        { code: "de", words: ["und", "was", "wie", "warum", "hallo"] },
        { code: "nl", words: ["wat", "hoe", "waarom", "hallo", "dit", "dat"] }
    ];

    for (const lang of languages) {
        if (lang.words.some(w => lower.includes(w))) {
            return lang.code;
        }
    }

    // Fallback
    return "unknown";
}

function trackStreamingDuration(chatContainer, callback) {
    let startTime = null;
    let endTimer = null;
    let lastContent = "";

    const observer = new MutationObserver(() => {
        const msgs = document.querySelectorAll('[data-message-author-role="assistant"]');
        if (!msgs.length) return;

        const lastMsg = msgs[msgs.length - 1];
        const content = lastMsg.innerText;

        // Streaming start
        if (!startTime && content.length > 0) {
            startTime = performance.now();
        }

        // Detect end of streaming: content stops changing
        if (content !== lastContent) {
            lastContent = content;

            if (endTimer) clearTimeout(endTimer);

            endTimer = setTimeout(() => {
                const endTime = performance.now();
                const duration = endTime - startTime;

                observer.disconnect();
                callback(duration);
            }, 200); // 200ms of no changes = finished
        }
    });

    observer.observe(chatContainer, { childList: true, subtree: true });
}

function getUserMessageIndex() {
    const msgs = document.querySelectorAll('[data-message-author-role="user"]');
    return msgs.length; // 1-based index
}

function getConversationLength() {
    const msgs = document.querySelectorAll('[data-message-author-role]');
    return msgs.length;
}

function detectFollowup(text) {
    const lower = text.toLowerCase().trim();

    const followupWords = [
        "continue", "go on", "more", "explain more", "expand",
        "as before", "as above", "same style", "same format",
        "rewrite that", "improve that", "fix that", "continue the story"
    ];

    if (followupWords.some(w => lower.startsWith(w))) return true;

    // If the conversation already has multiple turns, many short prompts are follow-ups
    if (getUserMessageIndex() > 1 && lower.split(/\s+/).length <= 4) {
        return true;
    }

    return false;
}


function detectRegenerateClick(callback) {
    const btn = document.querySelector('[data-testid="regenerate-button"]');
    if (!btn) return;

    btn.addEventListener("click", () => {
        callback(true);
    });
}


function trackSuggestedPrompts() {
    const suggestions = document.querySelectorAll('[data-testid="prompt-suggestion"]');
    suggestions.forEach(el => {
        el.addEventListener("click", () => {
            lastSuggestedPromptUsed = true;
        });
    });
}

function hasImageAttachment() {
    return !!document.querySelector('[data-testid="image-input"]') ||
        !!document.querySelector('#prompt-textarea img');
}

function hasFileAttachment() {
    return !!document.querySelector('[data-testid="file-input"]') ||
        !!document.querySelector('[data-testid="attachment"]');
}

function isVoiceInputActive() {
    const mic = document.querySelector('[data-testid="microphone-button"]');
    return mic && mic.getAttribute("data-state") === "recording";
}

function isToolActive() {
    return !!document.querySelector('[data-testid="tool-badge"]') ||
        !!document.querySelector('[data-testid="tool-output"]');
}

function getClientEnvironment() {
    const ua = navigator.userAgent.toLowerCase();

    let browser = "unknown";
    if (ua.includes("chrome") && !ua.includes("edge") && !ua.includes("brave")) browser = "chrome";
    if (ua.includes("edg")) browser = "edge";
    if (ua.includes("brave")) browser = "brave";
    if (ua.includes("firefox")) browser = "firefox";
    if (ua.includes("safari") && !ua.includes("chrome")) browser = "safari";

    const browserVersionMatch = ua.match(/(chrome|firefox|edg|safari)\/(\d+)/);
    const browserVersion = browserVersionMatch ? browserVersionMatch[2] : "unknown";

    let os = "unknown";
    if (ua.includes("win")) os = "windows";
    if (ua.includes("mac")) os = "macos";
    if (ua.includes("linux")) os = "linux";

    const width = window.innerWidth;
    const viewport =
        width < 600 ? "mobile" :
            width < 1024 ? "tablet" :
                "desktop";

    const timezoneOffset = new Date().getTimezoneOffset();

    return {
        browser_name: browser,
        browser_version: browserVersion,
        os,
        viewport_category: viewport,
        timezone_offset_minutes: timezoneOffset
    };
}

// ================== Global detector registry ================================
window.AIUsageDetectors = {
    detectChatGPT,
};

// ================== Init detectors =========================================


let USER_ID = null;
let SESSION_ID = null;

function initDetectors() {
    chrome.runtime.sendMessage({ type: "GET_IDENTIFIERS" }, response => {
        USER_ID = response.user_id;
        SESSION_ID = response.session_id;

        console.log("[AI Usage Meter] User ID:", USER_ID);
        console.log("[AI Usage Meter] Session ID:", SESSION_ID);

        const onPrompt = (payload) => {
            payload.user_id = USER_ID;
            payload.session_id = SESSION_ID;

            chrome.runtime.sendMessage({
                type: "PROMPT_EVENT",
                payload
            });
        };

        const { detectChatGPT } = window.AIUsageDetectors;
        detectChatGPT(onPrompt);
    });
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    initDetectors();
} else {
    window.addEventListener("DOMContentLoaded", initDetectors);
}



