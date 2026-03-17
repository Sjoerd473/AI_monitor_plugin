import { CATEGORY_KEYWORDS, LANG_KEYWORDS, PROMPT_KEYWORDS, SAFETY_KEYWORDS } from "./maps";

export class baseDetector {
    constructor() {
        // initialized as null first
        this.userId = null;
        this.sessionId = null;
        this.sessionStart = null;
        this.sessionPromptCount = null;
        this.timeSinceLastPrompt = null;
        this.extensionVersion = null;

        this.editorSelector = null;  // ← ADD THESE
        this.chatContainerSelector = null;
        this.sendButton = null;

        this.lastRegenerateUsed = false;
        this.lastSuggestedPromptUsed = false;
        this.schemaVersion = 1;
        // this means init() is called even before constructor finishes
        // this also means init() is always called when a new instance of a Detector is created
        this.init();
    }




    init() {
        // this sends a message to the background with payload "GET_IDENTIFIERS"
        // it gets response in return
        chrome.runtime.sendMessage({ type: "GET_IDENTIFIERS" }, (response) => {
            // safety precaution incase there is no response, cancel early
            if (chrome.runtime.lastError) {
                console.error("[AI Usage Meter] Error getting identifiers:", chrome.runtime.lastError);
                return;
            }
            // this destructures the variables out of response
            //  '|| {}' means if there is no response fallback to empty object
            const {
                user_id: userId,
                session_id: sessionId,
                session_start: sessionStart,
                session_prompt_count: sessionPromptCount,
                time_since_last_prompt: timeSinceLastPrompt,
                extension_version: extensionVersion
            } = response || {};

            // populate the null properties from the constructor
            // with Object.assign we avoid writing 6 lines of this.userid = userid etc etc.
            // Object.assign(TARGET, SOURCE1, SOURCE2, etc)
            Object.assign(this, {
                userId, sessionId, sessionStart, sessionPromptCount,
                timeSinceLastPrompt, extensionVersion
            });

            console.log("[AI Usage Meter] Initialized with user:", this.userId);
            // if all went well, start detecting

            this.startDetection(this.editorSelector, this.chatContainerSelector);
        });
    }

    waitForElement(selector, timeout = 30000) {
        // resolve and reject are needed to handle a promise, can't use a normal return
        return new Promise((resolve, reject) => {
            const start = Date.now();
            // The actual polling function
            const check = () => {
                // Look for the element
                const element = document.querySelector(selector);
                // if it is found, resolve the promise and return the element
                if (element) {
                    resolve(element);
                    return;
                }
                // if 30 seconds have passed, fails
                if (Date.now() - start > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    return;
                }
                // Nothing was found, but try again in 100ms
                setTimeout(check, 100);
            };
            // call the polling function
            check();
        });
    }

    async startDetection(targetEditor, targetChatContainer) {
        // try catch because finding elements can fail
        try {
            console.log("[AI Usage Meter] Starting detection on", location.hostname);

            // first wait for the critical elements
            const editor = await this.waitForElement(targetEditor);
            const chatContainer = await this.waitForElement(targetChatContainer);

            // if the elements were found, set up the listeners on said elements 
            console.log("[AI Usage Meter] Editor and container found");
            this.setupListeners(editor, chatContainer);

        } catch (error) {
            console.error("[AI Usage Meter] Detection setup failed:", error);
        }
    }

    setupListeners(editor, chatContainer) {

        console.log("=== DEBUG SELECTORS ===");
        console.log("this.sendButton:", this.sendButton);
        console.log("this.editorSelector:", this.editorSelector);
        console.log("editor:", editor);
        console.log("chatContainer:", chatContainer);
        console.log("======================");
        // a wrapper is needed because this function must be called by an eventlistener
        // without the wrapper, an event object would be added to the parameters, breaking the function
        // it also needs to be an arrow function to preserve the THIS context
        const handleSubmit = () => this.handleSubmit(editor, chatContainer);

        // Enter-to-send
        document.addEventListener("keydown", (e) => {
            // this tracks if the user is typing in the chatGPT textarea, not somewhere else
            if (e.target.closest(this.chatContainerSelector) &&
                // and presses enter without shift
                e.key === "Enter" && !e.shiftKey) {
                // if so, call handlesubmit
                handleSubmit();
            }
            // true here (useCapture: true) gives high priorty to our event, making it fire before chatGPT can do anything
        }, true);

        // Send button
        const sendButton = document.querySelector(this.sendButton);
        if (sendButton) {
            sendButton.addEventListener("click", handleSubmit);
        }
        // watch for these buttons/prompts
        this.trackRegenerate(this.regenSelectors);
        this.trackSuggestedPrompts(this.suggestedPromptSelectors);
    }

    trackRegenerate(selectors) {
        // a MutationObserver watches for DOM changes
        const observer = new MutationObserver(() => {
            // try three options to find the buttonx    
            const regenerateButton = selectors
                .map(sel => document.querySelector(sel))
                .find(Boolean);

            // if it found a button, and it is new (the '!' means false == it wasn't being tracked yet)
            if (regenerateButton && !regenerateButton.dataset.tracked) {
                // now it is being tracked
                regenerateButton.dataset.tracked = 'true';
                regenerateButton.addEventListener('click', () => {
                    // set the variable to true for 5 seconds
                    this.lastRegenerateUsed = true;
                    console.log("[AI Usage Meter] Regenerate used");
                    setTimeout(() => {
                        this.lastRegenerateUsed = false;
                    }, 5000);
                    // a one time eventlistener
                }, { once: true });
            }
        });
        // this means the observer is watching everything
        observer.observe(document.body, { childList: true, subtree: true });
    }

    trackSuggestedPrompts(selectors) {
        // watching the DOM constantly, not just once
        const observer = new MutationObserver(() => {
            const suggestButtons = selectors.flatMap(sel =>
                Array.from(document.querySelectorAll(sel))
            );
            // loops over any button that might have been found
            for (const button of suggestButtons) {
                if (!button.dataset.tracked) {
                    // does basically the same thing as track regenerate does
                    button.dataset.tracked = 'true';
                    button.addEventListener('click', () => {
                        this.lastSuggestedPromptUsed = true;
                        console.log("[AI Usage Meter] Suggested prompt used");
                        setTimeout(() => {
                            this.lastSuggestedPromptUsed = false;
                        }, 5000);
                    }, { once: true });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    estimateTokens(text) {
        if (!text || typeof text !== 'string') return 0;

        const charCount = text.length;

        const estimatedTokens = Math.ceil(charCount / this.avgCharsPerToken);

        return Math.max(1, Math.min(estimatedTokens, 100000));
    }

    trackResponse(chatContainer, promptStartTime, callback) {
        let endTimer = null;
        // previous response text
        let lastContent = "";
        // A DOM watcher
        const observer = new MutationObserver(() => {
            // This fires every time chatGPT adds text to response
            const response = this.getLastAssistantMessage();
            // ignores junk messages
            if (!response || response.length < 3) return;

            // this fires if new text has appeared
            if (response !== lastContent) {
                lastContent = response;
                // and then removes it's own timeout
                if (endTimer) {
                    clearTimeout(endTimer);
                }
                // and creates a new one
                endTimer = setTimeout(() => {
                    // this will fire if 300ms were allowed to pass
                    observer.disconnect();
                    const streamingDurationMs = performance.now() - promptStartTime;
                    // and sends the completed response, plus the time elapsed to the callback
                    callback(response, streamingDurationMs);
                }, 300);
            }
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
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
        // 1. Expanded selectors (model button, dropdown items, active indicators)

        for (const selector of this.aiModelSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const text = el.innerText?.trim() || el.title?.trim() || el.dataset.model;
                const cleaned = this.normalizeModelName(text);
                if (cleaned) return cleaned;
            }
        }

        // 2. Updated known models + page scan fallback
        const pageText = document.body.innerText.toLowerCase();
        for (const model of this.knownModels) {
            if (pageText.includes(model.toLowerCase())) return model;
        }

        return "unknown";
    }

    normalizeModelName(text) {
        if (!text) return null;
        const lower = text.toLowerCase().replace(/[^a-z0-9-]/g, '');

        for (const [pattern, normalized] of Object.entries(this.modelNormalizationPatterns)) {
            if (lower.includes(pattern)) return normalized;
        }
        return lower.includes('gpt') ? lower : null;
    }

    // Polling watcher for post-send (call after detect send)
    watchForModelUpdate(callback, timeout = 10000) {
        const start = Date.now();
        const interval = setInterval(() => {
            const model = this.getAIModel();
            if (model !== "unknown") {
                clearInterval(interval);
                callback(model);
                return;
            }
            if (Date.now() - start > timeout) {
                clearInterval(interval);
                callback("unknown");
            }
        }, 500);
    }

    // Usage: detect send (e.g., on button click/input), then watch
    //// I don't think this works, given that the url never contains code or chat
    detectModelMode() {
        const url = location.pathname;
        if (url.includes('/code')) return 'code-interpreter';
        if (url.includes('/chat')) return 'chat';
        return 'standard';
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

    classifySafety(text) {
        const safetyMap = this.regexConverter(SAFETY_KEYWORDS)
        for (const [safety, regex] of safetyMap) {
            if (regex.test(text)) return safety
        }
        return 'safe'
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



    calcolateViewport(viewportWidth) {
        if (viewportWidth >= 1000) {
            return 'desktop'
        } else if (viewportWidth >= 600) {
            return 'tablet'
        } else {
            return 'mobile'
        }
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



    async handleSubmit(editor, chatContainer) {
        // the '?' prevents a crash incase it returns null or undefined
        const text = editor.innerText?.trim();
        if (!text) return;

        console.log("[AI Usage Meter] Processing prompt");

        // Pre-calculate all metrics
        const model = this.getAIModel();
        const tokensIn = this.estimateTokens(text);
        const conversationId = this.getConversationId();
        const promptStartTime = performance.now();

        const modelMode = this.detectModelMode();
        const promptType = this.classifyPrompt(text);
        const promptLanguage = this.detectLanguage(text);
        const promptDomain = this.detectDomain(text);
        const safetyCategory = this.classifySafety(text);
        const messageIndex = this.getUserMessageIndex();
        const conversationLength = this.getConversationLength();
        const isFollowup = this.detectFollowup(text);

        const sessionMetrics = {
            session_id: this.sessionId,
            session_start: new Date(this.sessionStart).toISOString(),
            session_prompt_count: this.sessionPromptCount,
            session_duration_ms: Date.now() - this.sessionStart,
            time_since_last_prompt_ms: this.timeSinceLastPrompt
        };

        const uiSignals = {
            regenerate_used: this.lastRegenerateUsed,
            suggested_prompt_used: this.lastSuggestedPromptUsed,
            image_attached: this.hasImageAttachment(),
            file_attached: this.hasFileAttachment(),
            voice_input: this.isVoiceInputActive(),
            tool_active: this.isToolActive()
        };

        // Reset flags BEFORE tracking response
        this.lastRegenerateUsed = false;
        this.lastSuggestedPromptUsed = false;

        // Track response completion
        // response and streamingDurationMS are returned from trackResponse
        // trackResponse fires first, going into the text observing loop
        // only when it is finished does it go on to creating the const event
        // this ensures we have the full response before proceeding
        this.trackResponse(chatContainer, promptStartTime, (response, streamingDurationMs) => {
            const event = {
                schema_version: this.schemaVersion,
                timestamp: new Date().toISOString(),
                user: { user_id: this.userId },
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
                    safety_category: safetyCategory,
                    timestamp: new Date().toISOString()
                },
                response: {
                    tokens_out: this.estimateTokens(response),
                    characters_out: response.length,
                    latency_ms: performance.now() - promptStartTime,
                    streaming_duration_ms: streamingDurationMs
                },
                model: { model_name: model, model_mode: modelMode },
                ui_interaction: uiSignals,
                environment: this.getClientEnvironment(),
                source: this.source,
                conversation_id: conversationId
            };

            chrome.runtime.sendMessage({
                type: "PROMPT_EVENT",
                payload: event
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("[AI Usage Meter] Failed to send event:", chrome.runtime.lastError);
                } else {
                    console.log("[AI Usage Meter] Event sent successfully");
                }
            });
        });
    }


}



// Track Regenerate
// Track SuggestedPrompts