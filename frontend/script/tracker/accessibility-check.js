// Function to check images for missing alt tags and ARIA roles
import { sendData } from '../api-utility.js';

function checkImageAccessibility() {
    // Get all images on the page
    const images = document.querySelectorAll('img');
    const accessibilityIssues = [];

    // Loop through all images
    images.forEach((img, index) => {
        const imageIssue = {};

        // Check for missing alt tag
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
            imageIssue['altMissing'] = `Image at index ${index} is missing an alt attribute or it is empty.`;
        }

        // Check for missing ARIA roles
        if (!img.hasAttribute('role')) {
            imageIssue['ariaRoleMissing'] = `Image at index ${index} is missing an ARIA role attribute.`;
        }

        // If any accessibility issue is found, store it
        if (Object.keys(imageIssue).length > 0) {
            accessibilityIssues.push(imageIssue);
        }
    });

    // If there are accessibility issues, send them to the backend or log the results
    if (accessibilityIssues.length > 0) {
        sendAccessibilityReport(accessibilityIssues);
    }
}

// Function to send accessibility issues report (can be modified to send to backend or dashboard)
async function sendAccessibilityReport(issues) {

    await sendData("accessibility_report", { issues });

    // Alternatively, you can display the issues on the console for developers to fix
    accessibilityIssues.forEach(issue => {
        console.log(issue);
    });
}

// Initialize the accessibility check when the page is loaded
window.addEventListener('load', () => {
    checkImageAccessibility();
});

// Export the function for use in other parts of the application
export { checkImageAccessibility };
