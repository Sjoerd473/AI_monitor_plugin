// =========================
//  CONFIG
// =========================

// global settings for session lifetime and ID lengths
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 min
const DEFAULT_SESSION_BYTES = 16;
const DEFAULT_USER_BYTES = 32;
const SECRET_KEY = "super_secret_key_here";

// =========================
//  STORAGE HELPERS
// =========================

// helper functions to retrieve or put things in storage
// chrome.storage.local is the storage for extensions
// and it demands async functions and promises
async function storageGet(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

async function storageSet(items) {
    return new Promise(resolve => chrome.storage.local.set(items, resolve));
}

// =========================
//  ID GENERATORS
// =========================
function generateRandomId(bytes = DEFAULT_SESSION_BYTES) {
    // generate an array with 16 (by default) bytes
    // this does not return the type of array we want
    const arr = crypto.getRandomValues(new Uint8Array(bytes));
    // destructure and immediately turn it into an actual array
    // then use a map() to turn each value of said array into hex chars instead of bytes
    // padStart is to always ensure two digits (adds a 0 to the start if it's only 1 char long)
    return [...arr].map(b => b.toString(16).padStart(2, "0")).join("");
}

// =========================
//  USER ID (STABLE)
// =========================
async function getOrCreateUserId() {
    // looks for a user_id in storage and returns it if found
    const { user_id } = await storageGet("user_id");
    if (user_id) return user_id;

    // if there is no user_id, create a new one and store it
    const newUserId = generateRandomId(DEFAULT_USER_BYTES);
    // puts it in storage as a key-value pair
    await storageSet({ user_id: newUserId });
    return newUserId;
}

// =========================
//  SESSION MANAGEMENT
// =========================
async function getOrCreateSessionId() {
    const now = Date.now();
    // pulls data about the sessions from storage
    const data = await storageGet(["session_id", "session_last_active", "session_start", "session_prompt_count"]);

    // reads the last active session from storage, otherwise
    // ?? is a Nullish Coalescing Operator
    // returns the right hand side if the left hand side is null or undefined
    // '||' would fail, as 0 is a valid timestamp, but would count as false
    const lastActive = data.session_last_active ?? 0;
    let sessionId = data.session_id;
    // expired will be true if there is no sessionId, or if 30 mins have passed
    const expired = !sessionId || (now - lastActive) > SESSION_TIMEOUT;
    console.log(sessionId)
    console.log(now)
    console.log(lastActive)
    console.log((now - lastActive) > SESSION_TIMEOUT)
    console.log(expired)
    console.log("finished")

    if (expired) {
        // so if more than 30 mins has passed, we create a new session
        sessionId = generateRandomId();
        await storageSet({
            session_id: sessionId,
            session_last_active: now,
            session_start: now,
            session_prompt_count: 0
        });
    } else {
        // we arrive here if the session exists, so we update the timestamp
        await storageSet({
            session_last_active: now,
            session_prompt_count: 0
        });
    }
    // and then return the sessionId in any case (a new one or an old one)
    return sessionId;
}

async function getOrCreateSessionStart() {
    // looks for a session in storage, returns it if it exists
    const { session_start } = await storageGet("session_start");
    if (session_start != null) return session_start;

    // otherwise creates a new session_start with the current time
    // and returns the current time
    const now = Date.now();
    await storageSet({ session_start: now });
    return now;
}

async function incrementSessionPromptCount() {
    // pull the session prompt count out of storage
    const { session_prompt_count } = await storageGet("session_prompt_count");
    // if there is no prompt_count the function returns 0, then adds 1
    // otherwise it returns prompt_count +1
    const count = (session_prompt_count ?? 0) + 1;
    // we update the count in storage
    await storageSet({ session_prompt_count: count });
    // then return the new count
    return count;
}

async function updateLastPromptTime() {
    const now = Date.now();
    await storageSet({ last_prompt_time: now });
    return now;
}

async function getTimeSinceLastPrompt() {
    const { last_prompt_time } = await storageGet("last_prompt_time");
    // if there is no last_prompt_time, we return the current time
    const last = last_prompt_time ?? Date.now();
    // we return the current time minus the timestamp of the last prompt
    return Date.now() - last;
}

// =========================
//  HMAC SIGNING
// =========================
async function computeHMAC(payloadString, key = SECRET_KEY) {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        // the key we are importing is raw/not encoded
        "raw",
        // now we pass our key into the encoder
        encoder.encode(key),
        // specify the algorithm (HMAC) and protocol (SHA-256)
        // they need to be this way to correspond with the backend
        { name: "HMAC", hash: "SHA-256" },
        // false= cannot be exported (secure)
        false,
        // the key can only sign, not verify
        ["sign"]
    );
    // we then sign the payload with "HMAC" and our secret key encode our payload to bytes
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(payloadString));
    // then turn the whole signature into a 64-char hex signature
    return [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// =========================
//  MESSAGE HANDLER
// =========================

// chromes addListener expects a sync callback, but we need async/await
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // so we use an IIFE (Immediately Invoked Function Expression) (async () => {...}) ()
    (async () => {
        // a switch statement, a different way to do if elif. In this example it looks at the msg.type
        switch (msg.type) {
            // this is called by the init(), so at the start of a session
            case "GET_IDENTIFIERS": {
                // array destructuring to create the variables on a single line
                const [user_id, session_id, session_start, session_prompt_count, time_since_last_prompt] =
                    // Promise.all will wait for all the functions to finish, then return all data at once
                    await Promise.all([
                        getOrCreateUserId(),
                        getOrCreateSessionId(),
                        getOrCreateSessionStart(),
                        incrementSessionPromptCount(),
                        getTimeSinceLastPrompt()
                    ]);

                // update the timestamp only when the promises have finished
                await updateLastPromptTime();

                // send the response back to the content script
                sendResponse({
                    user_id,
                    session_id,
                    session_start,
                    session_prompt_count,
                    time_since_last_prompt,
                    extension_version: chrome.runtime.getManifest().version
                });
                break;
            }
            // this is called after every chatGPT response
            case "PROMPT_EVENT": {
                try {
                    // convert  the event to json
                    const payloadString = JSON.stringify(msg.payload);
                    console.log("[AI Usage Meter] Prompt event received:", msg.payload);
                    // sign it
                    const signature = await computeHMAC(payloadString);
                    // then send it on to the backend
                    const res = await fetch("http://localhost:8000/events", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Signature": signature
                        },
                        // a raw json string for HMAC verification
                        body: payloadString
                    });

                    console.log("[AI Usage Meter] Server response:", await res.text());
                } catch (err) {
                    console.error("[AI Usage Meter] Failed to send:", err);
                }
                // Acknowledge to content script
                sendResponse({ status: "ok" });
                break;
            }

            default:
                break;
        }
    })();
    // without return true Chrome closes the channel immediately, and sendResponse() would fail
    // because we have async functions
    return true; // keep async channel open for async sendResponse
});

console.log("[AI Usage Meter] Background service worker loaded");