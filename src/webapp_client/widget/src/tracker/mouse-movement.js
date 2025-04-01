import { sendData } from '../api-utility.js';

function trackMouseData() {
    
    let lastClickX = 0;
    let lastClickY = 0;

    let lastSentTime = 0;
    const sendInterval = 10; // Send data every 10ms
    let clickHistory = []; // Stores timestamps of recent clicks
    const RAGE_CLICK_THRESHOLD = 3; // Number of clicks to be considered rage clicks
    const RAGE_CLICK_TIMEFRAME = 1000; // Timeframe in milliseconds (1 second)
    const BACK_TIME_THRESHOLD = 2000; // Time threshold to detect quick back (2 seconds)

    function sendMouseMoveData(x, y) {
        const now = Date.now();
        if (now - lastSentTime >= sendInterval) {
            sendData('mouse_move', { x, y, timestamp: now });
            lastSentTime = now;
        }
    }

    function sendMouseClickData(x, y, isRage, isDead, isQuickBack) {
        sendData('mouse_click', { "x": x, "y": y, "isRage": isRage, "isDead": isDead, "isQuickBack": isQuickBack });
    }

    // Listen for mousemove event on the document
    document.addEventListener('mousemove', function(event) { 
        const x = event.clientX;  // X-coordinate of the mouse relative to the viewport
        const y = event.clientY;  // Y-coordinate of the mouse relative to the viewport
        sendMouseMoveData(x, y);
    });

    // Track clicks
    document.addEventListener('click', function(event) {
        lastClickX = event.clientX;
        lastClickY = event.clientY;

        const timestamp = Date.now();
        clickHistory.push(timestamp);
        
        // Remove old clicks outside the timeframe
        clickHistory = clickHistory.filter(time => timestamp - time <= RAGE_CLICK_TIMEFRAME);
        
        // Check if the click happened on a non-interactive area (e.g., dead click)
        const isInteractiveElement = event.target.closest('button, a, input, textarea, select, [role="button"], [role="link"]');
        const isDeadClick = !isInteractiveElement;

        if (clickHistory.length >= RAGE_CLICK_THRESHOLD) {
            console.log('Rage click detected');
            sendMouseClickData(event.clientX, event.clientY, true, isDeadClick, false);
            clickHistory = []; // Reset after detection
        } else {
            sendMouseClickData(event.clientX, event.clientY, false, isDeadClick, false);
        }

    });

    // Detect quick backs
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
            const now = Date.now();
            if (window.lastPageLeave && now - window.lastPageLeave < BACK_TIME_THRESHOLD) {
                console.log('Quick back detected');
                sendMouseClickData(lastClickX || 0, lastClickY || 0, false, false, true);
            }
        }
    });

    window.addEventListener('pagehide', function() {
        window.lastPageLeave = Date.now();
    });
}

// Export the function
export { trackMouseData };
