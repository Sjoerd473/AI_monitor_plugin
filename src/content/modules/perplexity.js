import { baseDetector } from "./base/baseDetector";

export class perplexityDetector extends baseDetector {

    constructor() {
        super();

        this.editorSelector = '#ask-input';
        this.chatContainerSelector = 'main';

        this.sendButton = 'button[aria-label="Submit"]';

        this.lastAssistantMessageSelectors = [
            '[data-testid="answer"]',
            '.prose',
            '[class*="answer"]',
            '[class*="response"]'
        ];

        this.aiModelSelectors = [
            '[class*="model"][class*="active"]',
            '[aria-checked="true"]',
            '[data-state="checked"]',
        ];

        this.knownModels = [
            "sonar", "sonar-pro", "gpt-4", "gpt-4o", "claude"
        ];

        this.modelNormalizationPatterns = {
            // OpenAI
            "gpt5": "gpt-5",
            "gpt4o": "gpt-4o",

            // Perplexity
            "pplx70b": "pplx-70b",
            "pplx7b": "pplx-7b",
            "sonarsmall": "sonar-small",
            "sonarmedium": "sonar-medium",
            "sonarlarge": "sonar-large",

            // Anthropic
            "claude3": "claude-3",
            "claude35": "claude-3.5",

            // Google
            "gemini": "gemini",

            // Meta / others
            "llama": "llama",
            "mistral": "mistral"
        };


        this.regenSelectors = [
            'button[aria-label*="rewrite"]',
            'button[aria-label*="retry"]'
        ];

        this.regexConvId = /^\/search\/([a-f0-9\-]+)$/


        this.suggestedPromptSelectors = [
            'button[class*="suggest"]',
            'button[class*="prompt"]'
        ];


        this.userMessagesSelector = '[data-testid="question"]';
        this.allMessagesSelector = '[data-testid="question"], [data-testid="answer"]';


        this.imageAttachmentSelector = 'input[type="file"][accept*="image"]';
        this.fileAttachmentSelector = 'input[type="file"]';


        this.voiceImputSelector = '[aria-label*="voice"]';


        this.toolSelector = '[class*="tool"], [class*="plugin"]';


        this.avgCharsPerToken = 4;


        this.source = 'perplexity';


    }
    getAIModel() {
        return 'sonar'; // Perplexity default model
    }
}