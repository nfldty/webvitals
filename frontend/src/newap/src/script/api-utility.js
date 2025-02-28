// Define globalThis explicitly if needed
const globalThis = window || global;

// Function to generate a random session ID
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

// Function to get or initialize the webvitals object
function getWebvitalsObj() {
    if (!globalThis.webvitals) globalThis.webvitals = {};
    return globalThis.webvitals;
}

// Function to create a WebSocket connection
async function createWebSocket(url, onMessage, onOpen, onClose, onError) {
    if (!getWebvitalsObj().io) {
        getWebvitalsObj().io = (await import("https://cdn.socket.io/4.7.2/socket.io.esm.min.js")).io;
    }

    if (getWebvitalsObj().socket && getWebvitalsObj().socket.connected) {
        return getWebvitalsObj().socket;
    }

    // Generate a session ID if it doesn't exist
    if (!sessionStorage['webvitals-session-id']) {
        sessionStorage['webvitals-session-id'] = makeid(32);
    }

    // Hardcoded user ID for now
    getWebvitalsObj().userId = 1;

    // Create a new socket connection
    getWebvitalsObj().socket = getWebvitalsObj().io(url, {
        auth: {
            session_id: sessionStorage['webvitals-session-id'],
            user_id: getWebvitalsObj().userId,
        },
    });

    // Attach event listeners
    if (onOpen) getWebvitalsObj().socket.on("connect", () => onOpen(getWebvitalsObj().socket));
    if (onMessage) getWebvitalsObj().socket.on("message", (message) => onMessage(message));
    if (onClose) getWebvitalsObj().socket.on("disconnect", onClose);
    if (onError) getWebvitalsObj().socket.on("connect_error", onError);

    return getWebvitalsObj().socket;
}

// Function to send data via WebSocket
export async function sendData(eventId, data) {
    console.log('sending', eventId, data);
    const socket = await createWebSocket("http://localhost:3000", null, null, null, null);
    if (eventId && data) {
        socket.emit(eventId, data);
    }
}