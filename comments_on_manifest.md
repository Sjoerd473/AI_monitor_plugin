can't write comments in the manifest.json file without breaking it, so here they are

{
  "manifest_version": 3,
  "name": "AI Usage Meter",
  "version": "0.1.0",
  "description": "Measures anonymous AI prompt usage across major AI sites.",

  <!-- This is what the extension is allowed to do -->
  "permissions": [
    "scripting", == allows it to run or inject javascript
    "storage", == allows it to use Chrome's storage API (local storage)
    "activeTab" == allows it to interact only with the currently active tab (better than global permissions)
  ],
  these are the sites the extension is allowed to access
  "host_permissions": [
    "https://chat.openai.com/*",
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://gemini.google.com/*",
    "https://www.perplexity.ai/*",
    "http://localhost:8000/*"
  ],
  the script that runs OUTSIDE of any web page, used for: extension logic, network requests, event listeners, messaging between scripts
  "background": {
    "service_worker": "src/background/background.js",
    "type": "module" ==allows it to use ES modules (modern)
  },

  on matching sites, the listed js script is run/injected

  "content_scripts": [
    {
      "matches": [
        "https://chat.openai.com/*",
        "https://chatgpt.com/*",
        "https://claude.ai/*",
        "https://gemini.google.com/*",
        "https://www.perplexity.ai/*"
      ],
      "js": [
        "src/content/content.js"
      ],
      "run_at": "document_idle" ==means when the page is finished loading
    }
  ]
}