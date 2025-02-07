import { sendData } from './api-utility.js';

(function () {
  /**
   * Gets the current URL details (full URL, origin, and pathname).
   * @returns {{ fullUrl: string, origin: string, pathname: string }} An object containing URL details.
   */
  function getUrlDetails() {
      return {
          fullUrl: window.location.href,
          origin: window.location.origin,
          pathname: window.location.pathname,
      };
  }


  /**
   * Prints the full list of tracked URLs from localStorage for debugging.
   */
  function printTrackedUrls() {
      const storedUrls = JSON.parse(localStorage.getItem('visitedUrls')) || [];
      console.log("Tracked URLs:", storedUrls);
  }

  /**
   * Tracks page transitions and stores/sends the URL details.
   */
  function trackPageTransitions() {
      // Store and send the initial URL details (Page load)
      const initialUrlDetails = getUrlDetails();
      //console.log("Page Loaded:", initialUrlDetails); // Log page load
      sendData("page_visit", {"page_url": initialUrlDetails.fullUrl})

      // Track URL changes using the popstate event (back/forward navigation)
      window.addEventListener('popstate', function() {
          const urlDetails = getUrlDetails();
          //console.log("Back/Forward Navigation Detected:", urlDetails);
          storeUrlDetails(urlDetails);
          sendData("page_visit", {"page_url": urlDetails.fullUrl})
      });

      // Track URL changes when the user clicks on links
      document.body.addEventListener('click', function(event) {
          if (event.target.tagName === 'A' && event.target.href) {
              // Prevent default navigation only for internal links
              if (new URL(event.target.href).origin === window.location.origin) {
                  event.preventDefault();
                  history.pushState({}, '', event.target.href); // Simulate navigation
                  const urlDetails = getUrlDetails();
                  //console.log("Internal Link Clicked:", urlDetails);
                  storeUrlDetails(urlDetails);
                  sendData("page_visit", {"page_url": urlDetails.fullUrl})
              } else { //Debugging
                  //console.log("External Link Clicked - No Tracking:", event.target.href);
              }
          }
      });
  }

  // Initialize the tracking
  trackPageTransitions();
})();
