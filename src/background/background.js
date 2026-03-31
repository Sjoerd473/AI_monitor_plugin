// =========================
//  CONFIG
// =========================

// global settings for session lifetime and ID lengths
const SESSION_TIMEOUT = 20 * 60 * 1000; // 20 min
const DEFAULT_SESSION_BYTES = 16;
const DEFAULT_USER_BYTES = 32;


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
    // create a new user
    await createNewUser();
    return newUserId;
}

// create a new user, predefining all the values needed
// so we know they are always available
async function createNewUser() {
    const now = new Date()
    // these
    const thisDay = now.toISOString().slice(0, 10);
    const thisWeek = getISOWeek(now);
    const thisMonth = now.toISOString().slice(0, 7);

    await storageSet({
        onboardingComplete: false,
        data_sharing: false,

        total_co2_output_g: 0,
        total_energy_consumption_wh: 0,
        total_water_consumption_l: 0,
        current_day: thisDay,
        current_week: thisWeek,
        current_month: thisMonth,
        daily_co2_previous: 0,
        daily_co2_current: 0,
        weekly_co2_previous: 0,
        weekly_co2_current: 0,
        monthly_co2_previous: 0,
        monthly_co2_current: 0,
        daily_energy_previous: 0,
        daily_energy_current: 0,
        weekly_energy_previous: 0,
        weekly_energy_current: 0,
        monthly_energy_previous: 0,
        monthly_energy_current: 0,
        daily_water_previous: 0,
        daily_water_current: 0,
        weekly_water_previous: 0,
        weekly_water_current: 0,
        monthly_water_previous: 0,
        monthly_water_current: 0,
        prompt_counter: 0,
        daily_co2_history: [],
        daily_energy_history: [],
        daily_water_history: [],

    })
}

// This is a rather complicated looking function that returns an output in the
// format of 'YYYY'-W01'
function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}


async function getOrCreateApiKey() {
    // gets the api key from storage if it exists,
    // and exits the function
    const { api_key } = await storageGet("api_key");
    if (api_key) return api_key;

    const { user_id } = await storageGet("user_id");
    // registers a new API key on the backend
    const res = await fetch("https://ai-monitor.madebyshu.net/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id })
    });
    // the token that is returned is the API key
    const { token } = await res.json();
    await storageSet({ api_key: token });
    return token;
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


    if (expired) {
        // so if more than SESSION_TIMEOUT mins has passed, we create a new session
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


// this manages the daily consumption arrays
// inserts the newest varaible on the left
// when they go beyond a length of 7 eliminates the oldest (rightmost) variable

function pushDaily(arr = [], value) {
    return [...arr, value].slice(-7);
}

// a meaty function that updates all the data in local storage on each prompt sent
async function setOrUpdateUsageData(payload) {
    const result = await storageGet([
        'current_day', 'current_week', 'current_month',
        'total_co2_output_g', 'total_energy_consumption_wh', 'total_water_consumption_l',
        'daily_co2_previous', 'daily_co2_current',
        'weekly_co2_previous', 'weekly_co2_current',
        'monthly_co2_previous', 'monthly_co2_current',
        'daily_energy_previous', 'daily_energy_current',
        'weekly_energy_previous', 'weekly_energy_current',
        'monthly_energy_previous', 'monthly_energy_current',
        'daily_water_previous', 'daily_water_current',
        'weekly_water_previous', 'weekly_water_current',
        'monthly_water_previous', 'monthly_water_current',
        'daily_co2_history', 'daily_energy_history',
        'daily_water_history', 'prompt_counter'
    ]);
    const now = new Date()





    const thisDay = now.toISOString().slice(0, 10);
    const thisWeek = getISOWeek(now);
    const thisMonth = now.toISOString().slice(0, 7);

    const dayReset = result.current_day !== thisDay;
    const weekReset = result.current_week !== thisWeek;
    const monthReset = result.current_month !== thisMonth;

    const prevTotalCO2 = result.total_co2_output_g ?? 0;
    const prevTotalEnergy = result.total_energy_consumption_wh ?? 0;
    const prevTotalWater = result.total_water_consumption_l ?? 0;
    const currentPromptCount = result.prompt_counter ?? 0;

    await storageSet({
        current_day: thisDay,
        current_week: thisWeek,
        current_month: thisMonth,
        prompt_counter: currentPromptCount + 1,
        total_co2_output_g: prevTotalCO2 + (payload.prompt.co2_g ?? 0),
        total_energy_consumption_wh: prevTotalEnergy + (payload.prompt.energy_wh ?? 0),
        total_water_consumption_l: prevTotalWater + (payload.prompt.water_l ?? 0),

        // every single one of these checks if the corresponding reset is true, and if so
        // previous becomes current, current becomes 0 
        daily_co2_previous: dayReset ? result.daily_co2_current : result.daily_co2_previous,
        daily_co2_current: (dayReset ? 0 : result.daily_co2_current) + payload.prompt.co2_g,
        weekly_co2_previous: weekReset ? result.weekly_co2_current : result.weekly_co2_previous,
        weekly_co2_current: (weekReset ? 0 : result.weekly_co2_current) + payload.prompt.co2_g,
        monthly_co2_previous: monthReset ? result.monthly_co2_current : result.monthly_co2_previous,
        monthly_co2_current: (monthReset ? 0 : result.monthly_co2_current) + payload.prompt.co2_g,

        daily_energy_previous: dayReset ? result.daily_energy_current : result.daily_energy_previous,
        daily_energy_current: (dayReset ? 0 : result.daily_energy_current) + payload.prompt.energy_wh,
        weekly_energy_previous: weekReset ? result.weekly_energy_current : result.weekly_energy_previous,
        weekly_energy_current: (weekReset ? 0 : result.weekly_energy_current) + payload.prompt.energy_wh,
        monthly_energy_previous: monthReset ? result.monthly_energy_current : result.monthly_energy_previous,
        monthly_energy_current: (monthReset ? 0 : result.monthly_energy_current) + payload.prompt.energy_wh,

        daily_water_previous: dayReset ? result.daily_water_current : result.daily_water_previous,
        daily_water_current: (dayReset ? 0 : result.daily_water_current) + payload.prompt.water_l,
        weekly_water_previous: weekReset ? result.weekly_water_current : result.weekly_water_previous,
        weekly_water_current: (weekReset ? 0 : result.weekly_water_current) + payload.prompt.water_l,
        monthly_water_previous: monthReset ? result.monthly_water_current : result.monthly_water_previous,
        monthly_water_current: (monthReset ? 0 : result.monthly_water_current) + payload.prompt.water_l,

        daily_co2_history: dayReset
            ? pushDaily(result.daily_co2_history, result.daily_co2_current)
            : result.daily_co2_history,

        daily_energy_history: dayReset
            ? pushDaily(result.daily_energy_history, result.daily_energy_current)
            : result.daily_energy_history,

        daily_water_history: dayReset
            ? pushDaily(result.daily_water_history, result.daily_water_current)
            : result.daily_water_history,
    });
}




// =========================
//  MESSAGE HANDLER
// =========================

// chromes addListener expects a sync callback, but we need async/await
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // so we use an IIFE (Immediately Invoked Function Expression) (async () => {...}) ()
    // 
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

                // TRIGGER REGISTRATION: 
                // This ensures that clicking "Get Started" in the popup 
                // actually hits your https://ai-monitor.madebyshu.net/register endpoint.
                const apiKey = await getOrCreateApiKey();

                // update the timestamp only when the promises have finished
                await updateLastPromptTime();

                // send the response back to the content script
                sendResponse({
                    user_id,
                    session_id,
                    session_start,
                    session_prompt_count,
                    time_since_last_prompt,
                    extension_version: chrome.runtime.getManifest().version,
                    registered: !!apiKey
                });
                break;
            }
            // this is called after every  response
            case "PROMPT_EVENT": {
                try {
                    // FIX: Pass the keys as an array []
                    const stored = await storageGet(['data_sharing', 'onboardingComplete']);

                    const isSharing = stored.data_sharing ?? false;
                    const isOnboarded = stored.onboardingComplete ?? false;

                    // Update local stats first
                    await setOrUpdateUsageData(msg.payload);

                    // Debugging tip: Add a log here to see why it's exiting
                    console.log(`[AI Impact] Sharing: ${isSharing}, Onboarded: ${isOnboarded}`);

                    if (!isSharing || !isOnboarded) {
                        sendResponse({ status: "ok", sharing: false });
                        return;
                    }

                    const apiKey = await getOrCreateApiKey();
                    const res = await fetch("https://ai-monitor.madebyshu.net/events", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`
                        },
                        body: JSON.stringify(msg.payload)
                    });

                    const text = await res.text();
                    console.log("[AI Usage Meter] Server response:", text);

                    // IMPORTANT: Move sendResponse here to ensure it only says sharing: true 
                    // if the fetch actually happened.
                    sendResponse({ status: "ok", sharing: true });

                } catch (err) {
                    console.error("[AI Usage Meter] Failed to send:", err);
                    sendResponse({ status: "error", message: err.message });
                }
                break;
            }



            default:
                break;
        }
    })(); //these () call the function immediately, and makes it run async
    // without return true Chrome closes the channel immediately, and sendResponse() would fail
    // because we have async functions. Return true is hit immediately
    return true;
});

console.log("[AI Usage Meter] Background service worker loaded");