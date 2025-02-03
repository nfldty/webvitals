let startTime = Date.now();

// Function to calculate time spent
function trackTimeSpent() {
    let timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
    console.log(`Time spent on page: ${timeSpent} seconds`);

    // Send data to backend (optional)
    navigator.sendBeacon('/track-time', JSON.stringify({ timeSpent }));
}

// Capture time before user leaves
window.addEventListener('beforeunload', trackTimeSpent);
