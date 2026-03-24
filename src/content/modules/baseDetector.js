import { computeEnvironmentalImpact } from "./helpers/energyCalc";
import { Parser } from "./helpers/parser";

export class baseDetector extends Parser {
    constructor(config = {}) {
        super();
        
        this.editorSelector = config.editorSelector || null;
        this.chatContainerSelector = config.chatContainerSelector || null;
        this.sendButton = config.sendButton || null;

        // initialized as null first
        this.userId = null;
        this.sessionId = null;
        this.sessionStart = null;
        this.sessionPromptCount = null;
        this.timeSinceLastPrompt = null;
        this.extensionVersion = null;

       

        this.lastRegenerateUsed = false;
        this.lastSuggestedPromptUsed = false;
        this.schemaVersion = 1;

        this.lastInput = "";
        this.lastAssistantText = "";
        this.lastMessageCount = 0;
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
        const selectors = Array.isArray(selector) ? selector : [selector];
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el) { resolve(el); return; }
                }
                if (Date.now() - start > timeout) {
                    reject(new Error(`None of [${selectors.join(', ')}] found within ${timeout}ms`));
                    return;
                }
                setTimeout(check, 100);
            };
            check();
        });
    }

    async startDetection(targetEditor, targetChatContainer) {
        try {
            // Wait for editor = React is ready
            await this.waitForElement(targetEditor);

            // Explicitly grab #root as the container, NOT the editor
            const chatContainer = document.querySelector(targetChatContainer);
            if (!chatContainer) throw new Error('#root not found');

            console.log("[AI Usage Meter] Container found:", chatContainer);
            console.log("[AI Usage Meter] Container children:", chatContainer.children.length);

            this.startUniversalDetection(chatContainer);

        } catch (error) {
            console.error("[AI Usage Meter] Detection setup failed:", error);
        }
    }



    startUniversalDetection(chatContainer) {
        console.log("[AI Usage Meter] Starting UNIVERSAL detection");

        setInterval(() => {
            const text = this.getActiveEditorText().trim();
            if (text.length > 0) {
                this.lastInput = text;
            }
        }, 300);

        const observer = new MutationObserver(() => {
            // ✅ Use getLastAssistantMessage() instead of hardcoded .prose
            const assistantText = this.getLastAssistantMessage();
            const currentInput = this.getActiveEditorText().trim();

            if (
                assistantText &&
                assistantText !== this.lastAssistantText &&
                this.lastInput &&
                currentInput === ""
            ) {
                console.log("[AI Usage Meter] ✅ REAL SUBMIT DETECTED");
                this.handleSubmitWithText(this.lastInput, chatContainer);
                this.lastInput = "";
                this.lastAssistantText = assistantText;
            }
        });

        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });
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







    async handleSubmitWithText(text, chatContainer) {
        if (!text) return;

        console.log("[AI Usage Meter] Processing prompt", text);

        // Wait for model detection BEFORE building event
        this.watchForModelUpdate(async (model) => {

            console.log("[AI Usage Meter] Using model:", model);

            const tokensIn = this.estimateTokens(text);
            const conversationId = await this.getConversationId();
            const promptStartTime = performance.now();

            const modelMode = this.detectModelMode();
            const promptType = this.classifyPrompt(text);
            const promptLanguage = this.detectLanguage(text);
            const promptDomain = this.detectDomain(text);


            const messageIndex = this.getUserMessageIndex(this.userMessagesSelector);
            const conversationLength = this.getConversationLength(this.allMessagesSelector);
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
                image_attached: this.hasImageAttachment(this.imageAttachmentSelector),
                file_attached: this.hasFileAttachment(this.fileAttachmentSelector),
                voice_input: this.isVoiceInputActive(this.voiceImputSelector),
                tool_active: this.isToolActive(this.toolSelector)
            };

            // reset flags after capture
            this.lastRegenerateUsed = false;
            this.lastSuggestedPromptUsed = false;

            // 🔁 Track streaming response
            this.trackResponse(chatContainer, promptStartTime, (response, streamingDurationMs) => {
                const tokensOut = this.estimateTokens(response)
                const latencyMs = performance.now() - promptStartTime;
                const [energy, co2, water] = computeEnvironmentalImpact(
                    tokensIn, tokensOut, latencyMs, streamingDurationMs, model,
                    modelMode, promptType, promptDomain, promptLanguage,
                    conversationLength, isFollowup, uiSignals
                )

                const event = {
                    schema_version: this.schemaVersion,
                    timestamp: new Date().toISOString(),

                    user: {
                        user_id: this.userId
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
                        timestamp: new Date().toISOString(),
                        energy_wh: energy,
                        co2_g: co2,
                        water_l: water
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

                    ui_interaction: uiSignals,

                    environment: this.getClientEnvironment(),

                    source: this.source,

                    conversation_id: conversationId
                };

                console.log("[AI Usage Meter] 🚀 Sending event", event);

                chrome.runtime.sendMessage({
                    type: "PROMPT_EVENT",
                    payload: event
                });
            });

        });
    }


}

