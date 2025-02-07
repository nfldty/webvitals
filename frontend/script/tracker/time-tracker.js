import { sendData } from '../api-utility.js';

function trackTimeSpent() {
    let startTime = Date.now();
    let timeSpent = 0;

    // when tab visibility changes
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            timeSpent = Date.now() - startTime;
        } else {
            startTime = Date.now();
        }
    });

    // when user is about to leave the webpage
    window.addEventListener("beforeunload", () => {
        timeSpent = Date.now() - startTime;
        console.log('sending', timeSpent);
        sendData("time_tracker", { "timeSpent": timeSpent });
    });
}

// Automatically start tracking when the script is loaded
trackTimeSpent();

// Export the function
export { trackTimeSpent };
