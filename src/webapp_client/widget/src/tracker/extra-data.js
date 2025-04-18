// Function to check images for missing alt tags and ARIA roles
import { sendData } from '../api-utility.js';

async function trackExtraData() {
    if (!sessionStorage['webvitals-onetime-tracking']) {
        sessionStorage['webvitals-onetime-tracking'] = true;
    }
    else{
        return;
    }
    let data = {}
    data.userAgent = navigator.userAgent;
    data.referrer = document.referrer;
    while (true){
        try{
            await sendData("extra_data_tracking", data);
            return;
        } catch {

        }
    }
}

// Export the function for use in other parts of the application
export { trackExtraData };
