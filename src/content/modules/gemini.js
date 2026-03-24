import { baseDetector } from "./base/baseDetector";

export class geminiDetector extends baseDetector {

    constructor() {
        super();

        this.editorSelector = '.ql-editor[contenteditable="true"]';
        this.chatContainerSelector = '.chat-history-scroll-container';

        this.sendButton = 'button[aria-label="Send message"]';

        this.lastAssistantMessageSelectors = [
            'response-container',
            '[class*="response-container"]',
            'model-response',
            '[class*="model-response"]'
        ];

        this.aiModelSelectors = [
            '[data-test-id="bard-mode-menu-button"]'
        ];

        this.knownModels = [
            "gemini-2.0",
            "gemini-1.5",
            "gemini-pro",
            "gemini-flash",
            "gemini-ultra",
            "fast",
            "deep research"
        ];

        this.modelNormalizationPatterns = {
            "2flash": "gemini-2.0-flash",
            "2pro": "gemini-2.0-pro",
            "15pro": "gemini-1.5-pro",
            "15flash": "gemini-1.5-flash",
            "fast": "gemini-flash",
            "deepresearch": "gemini-deep-research",
            "ultra": "gemini-ultra"
        };

        this.regenSelectors = [
            'button[aria-label*="Retry"]',
            'button[aria-label*="Regenerate"]',
            'button[aria-label*="Retry message"]'
        ];

        this.regexConvId = /^\/app\/([a-f0-9\-]+)$/

        this.suggestedPromptSelectors = [
            'button[class*="suggest"]',
            '.intent-card button',
            'intent-card button'
        ];

        this.userMessagesSelector = '.human-turn, [class*="human-turn"]';
        this.allMessagesSelector = '.human-turn, [class*="human-turn"], response-container, model-response';

        this.imageAttachmentSelector = '[data-test-id="hidden-local-image-upload-button"]';
        this.fileAttachmentSelector = '[data-test-id="hidden-local-file-upload-button"]';

        this.voiceImputSelector = 'speech-dictation-mic-button button, [aria-label*="microphone"]';

        this.toolSelector = 'toolbox-drawer button, [class*="toolbox"]';

        this.avgCharsPerToken = 4;

        this.source = 'gemini';

        this.observeNavigation();
    }

    async startDetection(targetEditor, targetChatContainer) {
        try {
            await this.waitForElement(targetEditor);
            const chatContainer = document.querySelector(targetChatContainer) 
                               || document.querySelector('.chat-container')
                               || document.querySelector('chat-window')
                               || document.body;

            console.log("[AI Usage Meter] Gemini container found:", chatContainer);
            this.startUniversalDetection(chatContainer);
        } catch (error) {
            console.error("[AI Usage Meter] Gemini detection setup failed:", error);
        }
    }

    getActiveEditorText() {
        const el = document.querySelector('.ql-editor[contenteditable="true"]');
        if (!el) return "";
        // Gemini uses Quill editor — get text but exclude placeholder
        if (el.classList.contains('ql-blank')) return "";
        return el.innerText?.trim() || "";
    }

    getCurrentModel() {
        const el = document.querySelector('[data-test-id="bard-mode-menu-button"]');
        if (!el) return null;

        const raw = el.innerText?.toLowerCase().trim().replace(/\s+/g, '') || '';

        for (const key in this.modelNormalizationPatterns) {
            if (raw.includes(key)) {
                return this.modelNormalizationPatterns[key];
            }
        }

        return raw || null;
    }

    observeNavigation() {
        let lastUrl = location.href;

        const originalPushState = history.pushState.bind(history);
        history.pushState = (...args) => {
            originalPushState(...args);
            this.onNavigate();
        };

        window.addEventListener('popstate', () => this.onNavigate());

        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                this.onNavigate();
            }
        }, 500);
    }

    onNavigate() {
        console.log("[AI Usage Meter] Gemini navigation detected:", location.href);
        setTimeout(() => {
            this.startDetection(this.editorSelector, this.chatContainerSelector);
        }, 1500);
    }
}