// getCurrentUrl.js

/**
 * Gets the current URL of the website the user is on.
 * @returns {string} The current URL.
 */
function getCurrentUrl() {
    return window.location.href;
  }
  
  /**
   * Gets the origin of the current website (protocol + domain).
   * @returns {string} The origin of the current website.
   */
  function getOrigin() {
    return window.location.origin;
  }
  
  /**
   * Gets the pathname of the current URL (path after the domain).
   * @returns {string} The pathname of the current URL.
   */
  function getPathname() {
    return window.location.pathname;
  }
  
  /**
   * Gets the full URL, origin, and pathname as an object.
   * @returns {{ fullUrl: string, origin: string, pathname: string }} An object containing URL details.
   */
  function getUrlDetails() {
    return {
      fullUrl: getCurrentUrl(),
      origin: getOrigin(),
      pathname: getPathname(),
    };
  }
