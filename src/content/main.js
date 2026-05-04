import { chatGPTDetector } from "./modules/chatGPT";
import { geminiDetector } from "./modules/gemini";
import { claudeDetector } from "./modules/claude";
import { perplexityDetector } from "./modules/perplexity";
import { copilotDetector } from "./modules/copilot";


// Read the url to decide which detector to start
function getDetector() {
    const host = window.location.hostname;
    const url = window.location.href;

    if (host.includes("chatgpt.com") || host.includes("chat.openai.com")) {
        return chatGPTDetector;
    }
    if (host.includes("gemini.google.com")) {
        return geminiDetector;
    }
    if (host.includes("claude.ai")) {
        return claudeDetector;
    }
    if (host.includes("perplexity.ai")) {
        return perplexityDetector;
    }

    // Updated Copilot check to handle Bing and direct Copilot subdomains
    if (host.includes("copilot.microsoft.com") ||
        (host.includes("bing.com") && url.includes("/chat"))) {
        return copilotDetector;
    }

    return null;
}

// this starts a detector
function init() {
    const DetectorClass = getDetector();

    if (!DetectorClass) {
        console.warn("[AI Usage Meter] No detector for this site");
        return;
    }

    console.log("[AI Usage Meter] Starting detector:", DetectorClass.name);
    new DetectorClass();
}
// waits for the page to finish loading
// so init is only called when the page is ready.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}


