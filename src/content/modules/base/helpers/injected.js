// Temporarily add this to injected.js to see raw payloads
(function () {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        const [url, options] = args;

        try {
            if (options?.body && typeof options.body === "string") {
                // 🔍 LOG EVERYTHING to find where model hides
                if (url.includes("perplexity") || url.includes("api") || url.includes("query")) {
                    console.log("[INJECTED] Fetch URL:", url);
                    console.log("[INJECTED] Fetch body:", options.body.slice(0, 500));
                }
            }
        } catch (e) { }

        return originalFetch(...args);
    };

    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const socket = new OriginalWebSocket(...args);

        socket.addEventListener("message", (event) => {
            try {
                // 🔍 LOG ALL WS MESSAGES
                if (event.data?.length < 2000) {
                    console.log("[INJECTED] WS message:", event.data);
                }
            } catch (e) { }
        });

        return socket;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
})();