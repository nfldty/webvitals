import { sendData } from '../api-utility.js';

/**
 * Gets the current URL details (full URL, origin, and pathname).
 * @returns {{ fullUrl: string, origin: string, pathname: string }} An object containing URL details.
 */
function getUrlDetails() {
  // Use try-catch in case window or window.location isn't available (e.g., server-side rendering initial phase)
  try {
    return {
      fullUrl: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
    };
  } catch (e) {
    console.error("Could not get URL details:", e);
    return { fullUrl: '', origin: '', pathname: '' };
  }
}

/**
 * Tracks page transitions and sends the URL details.
 */
function trackPageTransitions() {
  let previousUrl = ''; // Store the last tracked URL to avoid duplicates

  // Central function to handle URL change detection and sending data
  const handleUrlChange = () => {
    const currentUrlDetails = getUrlDetails();

    // Only send data if the URL has actually changed
    if (currentUrlDetails.fullUrl && currentUrlDetails.fullUrl !== previousUrl) {
      // console.log(`URL Change Detected: ${previousUrl} -> ${currentUrlDetails.fullUrl}`); // Debugging
      sendData("page_visit", { "page_url": currentUrlDetails.fullUrl });
      previousUrl = currentUrlDetails.fullUrl; // Update the stored URL
    }
    // Optional else for debugging:
    // else if (currentUrlDetails.fullUrl) {
    //   console.log("URL detected, but unchanged:", currentUrlDetails.fullUrl);
    // }
  };

  // --- Intercept history changes ---

  // Keep a reference to the original pushState function
  const originalPushState = history.pushState;

  // Override history.pushState
  history.pushState = function(...args) {
    // Call the original function first
    const result = originalPushState.apply(history, args);
    // Manually trigger our URL change handler AFTER the state has been pushed
    // Use requestAnimationFrame or setTimeout to ensure the URL is updated in the bar
    requestAnimationFrame(handleUrlChange);
    // Alternatively: setTimeout(handleUrlChange, 0);
    return result; // Return the result of the original function
  };

  // It's also good practice to wrap replaceState if used for navigation
  const originalReplaceState = history.replaceState;
  history.replaceState = function(...args) {
      const result = originalReplaceState.apply(history, args);
      requestAnimationFrame(handleUrlChange);
      return result;
  };

  // --- Listen for browser navigation events (Back/Forward buttons) ---
  window.addEventListener('popstate', handleUrlChange);

  // --- Track Initial Page Load ---
  // Use setTimeout to ensure it runs after the initial script execution context
  // and potentially after any initial redirects or SPA router initialization.
  setTimeout(handleUrlChange, 0);


  // --- Handle Internal Link Clicks ---
  // This part simulates basic SPA navigation by preventing default link behavior
  // and using the (now overridden) pushState.

  // IMPORTANT: If you are using a dedicated SPA router framework
  // (like React Router, Vue Router, Angular Router), you should REMOVE
  // this 'click' event listener. The router itself will call `history.pushState`
  // or `history.replaceState`, and our overridden versions above will automatically
  // catch those calls and trigger `handleUrlChange`. Keeping this listener
  // might interfere with your router.

  document.body.addEventListener('click', function(event) {
    // Find the nearest ancestor anchor tag (useful if the click target is inside the <a>)
    const anchor = event.target.closest('a');

    if (anchor && anchor.href) {
      const targetUrl = new URL(anchor.href); // Use the anchor's href

      // Check if it's an internal link (same origin)
      // Avoid tracking clicks that only change the hash (#section) on the *same* page path.
      // If you WANT to track hash changes as page views, remove the pathname check.
      if (targetUrl.origin === window.location.origin &&
          (targetUrl.pathname !== window.location.pathname || targetUrl.search !== window.location.search)
         ) {
            console.log('Internal link clicked, simulating navigation:', anchor.href); // Debugging
            event.preventDefault(); // Prevent the browser's default navigation
            history.pushState({}, '', anchor.href); // Use the OVERRIDDEN pushState which triggers handleUrlChange
            // **No need to call sendData or handleUrlChange here directly anymore!**
            // The overridden pushState takes care of it.
        } else if (targetUrl.origin !== window.location.origin) {
            // console.log("External Link Clicked - No Tracking/Interception:", anchor.href); // Debugging
        } else {
            // console.log("Same-page link or hash change - No Tracking/Interception:", anchor.href); // Debugging
        }
    }
  });

} // End of trackPageTransitions

export { trackPageTransitions };