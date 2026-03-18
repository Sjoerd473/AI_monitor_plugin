import { baseDetector } from "./base/baseDetector";

export class claudeDetector extends baseDetector {

    constructor() {
        super();

        // Add to claudeDetector constructor
        this.observeNavigation();

        // =========================
        // INPUT (confirmed exact)
        // =========================
        this.editorSelector = '[data-testid="chat-input"][contenteditable="true"]';
        // Main container
        this.chatContainerSelector = [
            '[data-testid="chat-input"]',  // wait for input to exist = chat is ready
            '#root'
        ];

        // =========================
        // SEND BUTTON
        // =========================
        this.sendButton = 'button[aria-label="Send message"]';

        // =========================
        // ASSISTANT MESSAGES
        // (Claude renders dynamically → keep flexible)
        // =========================
        this.lastAssistantMessageSelectors = [
            '[class*="font-claude-response-body"]'
        ];

        // =========================
        // MODEL DETECTION
        // =========================
        this.aiModelSelectors = [
            '[data-testid="model-selector-dropdown"]'
        ];

        this.knownModels = [
            "claude-3-opus",
            "claude-3-sonnet",
            "claude-3-haiku",
            "claude-3.5-sonnet",
            "sonnet",
            "opus",
            "haiku"
        ];

        this.modelNormalizationPatterns = {
            "sonnet": "claude-sonnet",
            "sonnet4": "claude-sonnet-4",
            "sonnet46": "claude-sonnet-4.6",
            "opus": "claude-opus",
            "haiku": "claude-haiku",
            "claude3": "claude-3",
            "claude35": "claude-3.5"
        };

        // =========================
        // REGENERATE
        // =========================
        this.regenSelectors = [
            'button[aria-label*="Retry"]',
            'button[aria-label*="Regenerate"]'
        ];

        // =========================
        // SUGGESTED PROMPTS
        // =========================
        this.suggestedPromptSelectors = [
            'button[class*="suggest"]',
            'button[class*="prompt"]'
        ];

        // =========================
        // MESSAGES
        // =========================
        this.userMessagesSelector = '[class*="font-user-message"]';
        this.allMessagesSelector = '[class*="font-user-message"], [class*="font-claude-response-body"]';

        // =========================
        // FILE UPLOAD (confirmed)
        // =========================
        this.imageAttachmentSelector = 'input[data-testid="file-upload"][accept*="image"]';
        this.fileAttachmentSelector = 'input[data-testid="file-upload"]';

        // =========================
        // VOICE (fallback only)
        // =========================
        this.voiceImputSelector = '[aria-label*="voice"], [aria-label*="microphone"]';

        // =========================
        // TOOLS / ARTIFACTS
        // =========================
        this.toolSelector = '[href*="artifacts"], [class*="artifact"], [class*="tool"]';

        this.avgCharsPerToken = 4;

        this.source = 'claude';
    }


    // =========================
    // 🔥 BONUS: RELIABLE MODEL EXTRACTOR
    // =========================
    getCurrentModel() {
        const el = document.querySelector('[data-testid="model-selector-dropdown"]');
        if (!el) return null;

        const raw = el.innerText.toLowerCase().trim();

        // normalize like "Sonnet 4.6" → "claude-sonnet-4.6"
        const cleaned = raw.replace(/\s+/g, '');

        for (const key in this.modelNormalizationPatterns) {
            if (cleaned.includes(key)) {
                return this.modelNormalizationPatterns[key];
            }
        }

        return raw;
    }



    observeNavigation() {
        let lastUrl = location.href;

        // Intercept pushState/replaceState
        const originalPushState = history.pushState.bind(history);
        history.pushState = (...args) => {
            originalPushState(...args);
            this.onNavigate();
        };

        window.addEventListener('popstate', () => this.onNavigate());

        // Fallback: poll for URL changes
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                this.onNavigate();
            }
        }, 500);
    }

    onNavigate() {
        console.log("[AI Usage Meter] Navigation detected:", location.href);
        // Small delay to let React re-render
        setTimeout(() => {
            this.startDetection(this.editorSelector, this.chatContainerSelector);
        }, 1500);
    }
}