(() => {
    let startTime = Date.now();
    let timeSpent = 0;

    // when tab visibility changes
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            timeSpent = Date.now() - startTime;
        } else {
            startTime = Date.now()
        }
    });

    // when user is about to leave the webpage
    window.addEventListener("beforeunload", () => {
        timeSpent += Date.now() - startTime;
        navigator.sendBeacon("/track-time", JSON.stringify({ timeSpent }));
    });
})();