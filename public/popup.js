const btn = document.getElementById("downloadBtn");
const status = document.getElementById("status");

function setStatus(msg, type = "") {
    status.textContent = msg;
    status.className = type;
}

btn.addEventListener("click", () => {
    btn.disabled = true;
    setStatus("Requesting download...");

    chrome.runtime.sendMessage({ type: "DOWNLOAD_DATASET" }, (response) => {
        btn.disabled = false;

        if (chrome.runtime.lastError) {
            setStatus("Extension error: " + chrome.runtime.lastError.message, "error");
            return;
        }

        if (!response) {
            setStatus("No response from background.", "error");
            return;
        }

        switch (response.status) {
            case "ok":
                setStatus("Download started!", "success");
                break;
            case "rate_limited":
                setStatus("Already downloaded today.", "warning");
                break;
            case "error":
                setStatus(`Server error (${response.code})`, "error");
                break;
            default:
                setStatus("Unknown response.", "error");
        }
    });
});
