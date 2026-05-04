import { baseDetector } from "./baseDetector";


export class copilotDetector extends baseDetector {
    constructor() {
        super({
            editorSelector: "#userInput",
            chatContainerSelector: '[data-content="conversation"]', // ✅ confirmed
            sendButton: '[data-testid="submit-button"]'             // ✅ confirmed
        });

        this.lastAssistantMessageSelectors = [
            '[data-testid="ai-message"]'   // ✅ confirmed
        ];

        this.userMessagesSelector = '[data-content="user-message"]'; // ✅ confirmed
        this.allMessagesSelector = '[data-testid="ai-message"], [data-content="user-message"]';

        this.regenSelectors = [
            '[data-testid="regenerate-message-button-popover"]'  // ✅ confirmed
        ];

        this.suggestedPromptSelectors = [
            '[data-testid="suggestion"]'
        ];

        this.aiModelSelectors = [
            '[data-testid="model-selector"]',
            '[aria-label*="model"]',
        ];

        this.knownModels = ["gpt-4o", "gpt-4", "creative", "precise", "balanced"];

        this.modelNormalizationPatterns = {
            "creative": "gpt-4-creative",
            "precise": "gpt-4-precise",
            "balanced": "gpt-4-balanced",
            "gpt4o": "gpt-4o"
        };

        this.regexConvId = /[\?&]conversationId=([a-zA-Z0-9\-]+)|\/c\/([a-zA-Z0-9\-]+)/;

        this.imageAttachmentSelector = '.image-preview img, .preview-item';
        this.fileAttachmentSelector = '.file-preview, [aria-label="Uploaded files"]';
        this.voiceImputSelector = '[aria-label="Stop listening"]';
        this.toolSelector = '.plugin-indicator, .active-tool';

        this.avgCharsPerToken = 4.0;
        this.source = 'copilot';
    }

    getActiveEditorText() {
        const el = document.querySelector("#userInput");
        return el ? (el.value || el.innerText || "").trim() : "";
    }

    getLastAssistantMessage() {
        // Get all ai-message elements and return the last one's text content
        const messages = document.querySelectorAll('[data-testid="ai-message"]');
        if (!messages.length) return "";
        const last = messages[messages.length - 1];
        // Target the text content blocks, ignoring reaction buttons etc.
        const textBlocks = last.querySelectorAll('.font-ligatures-none');
        return Array.from(textBlocks)
            .map(el => el.innerText.trim())
            .filter(Boolean)
            .join(" ");
    }
}