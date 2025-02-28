import { sendData } from '../api-utility.js';

let lastPageVisitTime = Date.now();
let lastPageUrl = window.location.href;

function trackJourney() {
    
    function sendJourneyInfo() {
        sendData("user_journey", { "page_url": lastPageUrl, "time_spent": Date.now() - lastPageVisitTime });
        lastPageVisitTime = Date.now();
        lastPageUrl = window.location.href;
    }

    window.addEventListener('beforeunload', function() {
        sendJourneyInfo();
    });

    window.addEventListener('popstate', function() {
        sendJourneyInfo();
    });

    document.body.addEventListener('click', function(event) {
        if (event.target.tagName === 'A' && event.target.href) {
            if (new URL(event.target.href).origin === window.location.origin) {
                event.preventDefault();
                sendJourneyInfo();
                history.pushState({}, '', event.target.href);
            }
        }

    });
}

export { trackJourney };
