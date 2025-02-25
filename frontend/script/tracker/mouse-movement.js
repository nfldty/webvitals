import { sendData } from '../api-utility.js';

function trackMouseData() {
    let lastSentTime = 0;
    const sendInterval = 1000; // 100ms = 10 times per second
    let clickHistory = []; // Stores timestamps of recent clicks
    const RAGE_CLICK_THRESHOLD = 3; // Number of clicks to be considered rage clicks
    const RAGE_CLICK_TIMEFRAME = 1000; // Timeframe in milliseconds (1s)
    const BACK_TIME_THRESHOLD = 2000; // Time threshold to detect quick back (2s)

    function sendMouseData(x, y) {
        const now = Date.now();
        if (now - lastSentTime >= sendInterval) {
            sendData('mouse_move', { "x": x, "y": y, "timestamp": now });
            lastSentTime = now; // Update last sent time
        }
    }

    function sendRageClickData(x, y) {
        sendData('rage_click', { "x": x, "y": y, "timestamp": Date.now() });
    }

    function sendQuickBackData() {
        sendData('quick_back', { "timestamp": Date.now() });
    }

    // Listen for mousemove event on the document
    document.addEventListener('mousemove', function(event) { 
        const x = event.clientX;  // X-coordinate of the mouse relative to the viewport
        const y = event.clientY;  // Y-coordinate of the mouse relative to the viewport
        sendMouseData(x, y);
    });

    // Track clicks
    document.addEventListener('click', function(event) {
        const timestamp = Date.now();
        clickHistory.push(timestamp);
        
        // Remove old clicks outside the timeframe
        clickHistory = clickHistory.filter(time => timestamp - time <= RAGE_CLICK_TIMEFRAME);
        
        if (clickHistory.length >= RAGE_CLICK_THRESHOLD) {
            console.log('Rage click detected');
            sendRageClickData(event.clientX, event.clientY);
            clickHistory = []; // Reset after detection
        }
    });

    // Detect quick backs
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
            const now = Date.now();
            if (window.lastPageLeave && now - window.lastPageLeave < BACK_TIME_THRESHOLD) {
                console.log('Quick back detected');
                sendQuickBackData();
            }
        }
    });

    window.addEventListener('pagehide', function() {
        window.lastPageLeave = Date.now();
    });
}

// Export the function
export { trackMouseData };
