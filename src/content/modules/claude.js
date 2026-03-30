import { baseDetector } from "./baseDetector";

export class claudeDetector extends baseDetector {

    constructor() {
        super({
            editorSelector: '[data-testid="chat-input"][contenteditable="true"]',
            chatContainerSelector: [
                '[data-testid="chat-input"]',
                '#root'
            ],
            sendButton: 'button[aria-label="Send message"]'
        });

     
        this.observeNavigation();

   
        this.editorSelector = '[data-testid="chat-input"][contenteditable="true"]';
     
        this.chatContainerSelector = [
            '[data-testid="chat-input"]',  
            '#root'
        ];

    
        this.sendButton = 'button[aria-label="Send message"]';

 
        this.lastAssistantMessageSelectors = [
            '[class*="font-claude-response-body"]'
        ];

    
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

  
        this.regenSelectors = [
            'button[aria-label*="Retry"]',
            'button[aria-label*="Regenerate"]'
        ];

        this.regexConvId = /^\/chat\/([a-f0-9\-]+)$/

 
        this.suggestedPromptSelectors = [
            'button[class*="suggest"]',
            'button[class*="prompt"]'
        ];

 
        this.userMessagesSelector = '[class*="font-user-message"]';
        this.allMessagesSelector = '[class*="font-user-message"], [class*="font-claude-response-body"]';

        this.imageAttachmentSelector = 'input[data-testid="file-upload"][accept*="image"]';
        this.fileAttachmentSelector = 'input[data-testid="file-upload"]';

   
        this.voiceImputSelector = '[aria-label*="voice"], [aria-label*="microphone"]';

   
        this.toolSelector = '[href*="artifacts"], [class*="artifact"], [class*="tool"]';

        this.avgCharsPerToken = 4;

        this.source = 'claude';
    }



    // getCurrentModel() {
    //     const el = document.querySelector('[data-testid="model-selector-dropdown"]');
    //     if (!el) return null;

    //     const raw = el.innerText.toLowerCase().trim();

    //     // normalize like "Sonnet 4.6" → "claude-sonnet-4.6"
    //     const cleaned = raw.replace(/\s+/g, '');

    //     for (const key in this.modelNormalizationPatterns) {
    //         if (cleaned.includes(key)) {
    //             return this.modelNormalizationPatterns[key];
    //         }
    //     }

    //     return raw;
    // }



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