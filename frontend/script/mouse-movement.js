(function () {
    // Generate a unique session ID if it doesn't exist already (using localStorage)
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = 'session-' + Date.now();  // Generate a session ID based on timestamp
        localStorage.setItem('session_id', sessionId);  // Save it to localStorage for future sessions
    }

    // Function to send mouse data (x, y, session ID, timestamp) to the backend
    function sendMouseData(x, y) {
        fetch('path/to/api', { // TODO, replace 'path/to/api' with the actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: sessionId,  // User session ID
                x: x,                   // Mouse X coordinate
                y: y,                   // Mouse Y coordinate
                timestamp: new Date().toISOString()  // Timestamp for when the movement occurred
            })
        })
        .then(response => response.json())
        .then(data => console.log('Mouse data sent successfully:', data))
        .catch(error => console.error('Error sending mouse data:', error));
    }

    // Listen for mousemove event on the document
    document.addEventListener('mousemove', function(event) {
        const x = event.clientX;  // X-coordinate of the mouse relative to the viewport
        const y = event.clientY;  // Y-coordinate of the mouse relative to the viewport

        // Call the function to send mouse data to the backend
        sendMouseData(x, y);
    });
})();
