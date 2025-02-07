import { sendData } from './api-utility.js';

(function () {
    // Function to send mouse data (x, y, session ID, timestamp) to the backend
    function sendMouseData(x, y) {
        sendData('mouse_movement', { "x": x, "y": y, "timestamp": Date.now() });
        
    }

    // Listen for mousemove event on the document
    document.addEventListener('mousemove', function(event) {
        const x = event.clientX;  // X-coordinate of the mouse relative to the viewport
        const y = event.clientY;  // Y-coordinate of the mouse relative to the viewport
        // Call the function to send mouse data to the backend
        console.log('x: ' + x + ' y: ' + y);
        sendMouseData(x, y);
    });
})();
