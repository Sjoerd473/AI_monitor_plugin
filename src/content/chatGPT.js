import { baseDetector } from "./baseDetector";

export class chatGPTDetector extends baseDetector {

    constructor() {
        super();

        this.editorSelector = "#prompt-textarea";
        this.chatContainerSelector = "main";

        this.sendButton = '[data-testid="send-button"]';

        this.lastAssistantMessageSelectors = [
            '[data-message-author-role="assistant"]:last-child [data-message-preview]',
            '[data-message-author-role="assistant"]:last-child',
            '.text-base:last-child',
            '[class*="assistant"]:last-child'
        ];

        this.aiModelSelectors = [
            '[data-testid="model-switcher-dropdown-button"]',
            '[data-testid^="model-switcher-"]',
            '[data-testid="model-switcher-dropdown"] *',
            '.model-selector-active',  // Common active class
            '[aria-label*="model"], [title*="model"]'
        ];

        this.knownModels = ["gpt-5", "gpt-5.4", "gpt-5.2", "gpt-4o", "gpt-4o-mini", "gpt-4", "gpt-3.5-turbo", "o1", "o1-mini", "gpt-5-thinking", "gpt-5-t-mini"];

        this.modelNormalizationPatterns = {
            "gpt5": "gpt-5",
            "gpt54": "gpt-5.4",
            "gpt52": "gpt-5.2",
            "gpt4o": "gpt-4o",
            "gpt4omini": "gpt-4o-mini",
            "gpt4": "gpt-4",
            "gpt35": "gpt-3.5-turbo",
            "o1mini": "o1-mini",
            "o1": "o1",
            "gpt5thinking": "gpt-5-thinking",
            "gpt5tmini": "gpt-5-t-mini"
        };

        this.regenSelectors = [
            '[data-testid="regenerate"]',
            '[data-string-id="regenerate"]',
            'button[aria-label*="regenerate"]'
        ]


        this.suggestedPromptSelectors = [
            '[data-testid="accept-prompt"]',
            'button[data-string-id*="optimize"]',
            'button[aria-label*="suggestion"]',
            'button[aria-label*="Suggested"]'
        ]

        this.userMessagesSelector = '[data-message-author-role="user"]'
        this.allMessagesSelector = '[data-message-author-role]'
        this.imageAttachmentSelector = '[data-testid="image-upload"] img'
        this.fileAttachmentSelector = '[data-testid="file-upload"]'
        this.voiceImputSelector = '[data-state="recording"]'
        this.toolSelector = '[data-mode="plugins"]'

        this.avgCharsPerToken = 3.8

        this.source = 'chatgpt'
    }

  
}