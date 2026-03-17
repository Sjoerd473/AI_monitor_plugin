import { chatGPTDetector } from "./chatGPT";
import { geminiDetector } from "./gemini";
import { claudeDetector } from "./claude";
import { perplexityDetector } from "./perplexity";



// Read the url to decide which detector to start



if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new chatGPTDetector());
  // or else just create the class immediately
} else {
  new chatGPTDetector();
}
