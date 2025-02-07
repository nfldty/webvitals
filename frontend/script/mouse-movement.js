import { sendData } from './api-utility.js';

(function () {
    let lastSentTime = 0;
    const sendInterval = 100; // 100ms = 10 times per second

    function sendMouseData(x, y) {
        const now = Date.now();
        if (now - lastSentTime >= sendInterval) {
            // console.log('x: ' + x + ' y: ' + y);
            sendData('mouse_move', { "x": x, "y": y, "timestamp": now });
            lastSentTime = now; // Update last sent time
        }
    }

    // Listen for mousemove event on the document
    document.addEventListener('mousemove', function(event) { 
        const x = event.clientX;  // X-coordinate of the mouse relative to the viewport
        const y = event.clientY;  // Y-coordinate of the mouse relative to the viewport
        sendMouseData(x, y);
    });
})();
