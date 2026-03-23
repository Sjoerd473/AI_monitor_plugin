import { CATEGORY_KEYWORDS, LANG_KEYWORDS, PROMPT_KEYWORDS} from "./maps";


export class Parser {

    getActiveEditorText() {
        const el = document.activeElement;

        if (!el) return "";

        if (el.tagName === "TEXTAREA") {
            return el.value;
        }

        if (el.isContentEditable) {
            return el.innerText || el.textContent || "";
        }

        return "";
    }

    getMessageCount() {
        if (!this.allMessagesSelector) return 0;
        return document.querySelectorAll(this.allMessagesSelector).length;
    }

    getLastAssistantText() {
        const el = document.querySelector(
            '[data-message-author-role="assistant"]:last-child, .prose:last-child'
        );

        return el?.innerText?.trim() || "";
    }

    estimateTokens(text) {
        if (!text || typeof text !== 'string') return 0;

        const charCount = text.length;

        const estimatedTokens = Math.ceil(charCount / this.avgCharsPerToken);

        return Math.max(1, Math.min(estimatedTokens, 100000));
    }

    getLastAssistantMessage() {
        const selectors = this.lastAssistantMessageSelectors
        // this tries every selector written above, to look for the last message written by chatGPT
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                // grabs the last element in the NodeList, and tries to read its text content
                const last = elements[elements.length - 1];
                return last.innerText?.trim() || last.textContent?.trim() || '';
            }
        }
        // if all fails, return an empty string
        return '';
    }

    getAIModel() {
        // 1. Fetch-derived model (BEST)
        if (this.currentModel) return this.currentModel;

        // 2. DOM fallback
        for (const selector of this.aiModelSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const text =
                    el.innerText?.trim() ||
                    el.title?.trim() ||
                    el.dataset.model;

                const cleaned = this.normalizeModelName(text);
                if (cleaned) return cleaned;
            }
        }

        // 3. Page scan fallback
        const pageText = document.body.innerText.toLowerCase();
        for (const model of this.knownModels) {
            if (pageText.includes(model.toLowerCase())) return model;
        }

        return "unknown";
    }

    normalizeModelName(text) {
        if (!text) return null;

        const lower = text
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '');

        // 1. Pattern mapping (preferred)
        for (const [pattern, normalized] of Object.entries(this.modelNormalizationPatterns)) {
            if (lower.includes(pattern)) return normalized;
        }

        // 2. Known prefixes (keep these)
        if (
            lower.includes('gpt') ||
            lower.includes('pplx') ||
            lower.includes('sonar') ||
            lower.includes('claude') ||
            lower.includes('gemini') ||
            lower.includes('mistral') ||
            lower.includes('llama')
        ) {
            return lower;
        }

        // 3. Unknown but still useful → return raw instead of null
        return lower || null;
    }

       // Usage: detect send (e.g., on button click/input), then watch
    //// I don't think this works, given that the url never contains code or chat
    detectModelMode() {
        const url = location.pathname;
        if (url.includes('/code')) return 'code-interpreter';
        if (url.includes('/chat')) return 'chat';
        return 'standard';
    }

      // generate a conversationID
    getConversationId() {
        // First, check for query parameter (backward compatibility)
        const urlParams = new URLSearchParams(location.search);
        let convId = urlParams.get('conversationId');

        // If not found, extract from path: /c/<uuid> using regex
        if (!convId) {
            const pathMatch = location.pathname.match(/^\/c\/([a-f0-9\-]+)$/);
            if (pathMatch) {
                // pathMatch[0] would include the /c/ at the start
                convId = pathMatch[1];
            }
        }

        return convId || 'unknown';
    }

    regexConverter(obj) {

        function escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

        const regexObj = new Map()
        for (const [category, languages] of Object.entries(obj)) {
            const arr = Object.values(languages)
                .flat()
                .map(escapeRegex);
            const regex = new RegExp(`\\b(${arr.join('|')})\\b`, 'i')
            regexObj.set(category, regex)

        }
        return regexObj
    }

    classifyPrompt(text) {
        const promptMap = this.regexConverter(PROMPT_KEYWORDS)
        for (const [type, regex] of promptMap) {
            if (regex.test(text)) return type
        }
        return 'general'
    }

    detectLanguage(text) {
        const langMap = this.regexConverter(LANG_KEYWORDS)
        for (const [lang, regex] of langMap) {
            if (regex.test(text)) return lang
        }
        return 'en'
    }

    detectDomain(text) {
        const categoryMap = this.regexConverter(CATEGORY_KEYWORDS)
        for (const [category, regex] of categoryMap) {
            if (regex.test(text)) return category
        }
        return 'general'
    }

 

    calcolateViewport(viewportWidth) {
        if (viewportWidth >= 1000) {
            return 'desktop'
        } else if (viewportWidth >= 600) {
            return 'tablet'
        } else {
            return 'mobile'
        }
    }

    // what number message in the current conversation
    getUserMessageIndex(selector) {
        const userMessages = document.querySelectorAll(selector);
        return userMessages.length;
    }
    // total length of conversation (user+AI)
    getConversationLength(selector) {
        const allMessages = document.querySelectorAll(selector);
        return allMessages.length;
    }
    // detect if the question is a  follow up
    // needs to be expanded upon
    detectFollowup(text) {
        return text.length < 50 || text.includes('this') || text.includes('it') || text.includes('above');
    }
    // a bunch of flags to check
    // !! ensures a proper boolean
    hasImageAttachment(selector) {
        return !!document.querySelector(selector);
    }

    hasFileAttachment(selector) {
        return !!document.querySelector(selector);
    }

    isVoiceInputActive(selector) {
        return !!document.querySelector(selector);
    }

    isToolActive(selector) {
        return !!document.querySelector(selector);
    }

    getClientEnvironment() {
        const ua = navigator.userAgent;
        let browser = "unknown";
        let version = 0;
        let os = "unknown";

        // Simple browser detection
        if (ua.includes("Chrome")) {
            browser = "Chrome";
            const match = ua.match(/Chrome\/([\d]+)/);
            if (match) version = parseInt(match[1]);
        } else if (ua.includes("Firefox")) {
            browser = "Firefox";
            const match = ua.match(/Firefox\/([\d]+)/);
            if (match) version = parseInt(match[1]);
        } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
            browser = "Safari";
            const match = ua.match(/Version\/([\d]+)/);
            if (match) version = parseInt(match[1]);
        } else if (ua.includes("Edge")) {
            browser = "Edge";
            const match = ua.match(/Version\/([\d]+)/);
            if (match) version = parseInt(match[1]);
        }

        // OS detection
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "Mac";
        else if (ua.includes("Linux")) os = "Linux";

        // Viewport and timezone
        //// viewport needs to be converted to a string of mobile/tablet/desktop
        // const viewport = `${window.innerWidth}x${window.innerHeight}`;
        const viewport = this.calcolateViewport(window.innerWidth)
        //// timezone is currently a number, needs to be converted to a region EU/US/ASIA based on the number
        const timezone = -new Date().getTimezoneOffset(); // convert to positive offset

        return {
            browser,
            version,
            os,
            viewport,
            timezone,
            plugin_version: this.extensionVersion || "unknown"
        };
    }

}