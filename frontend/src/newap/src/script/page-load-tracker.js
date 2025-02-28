window.addEventListener('load', () => {
    // Get performance entries
    const [navigationTiming] = performance.getEntriesByType('navigation');
    const [firstContentfulPaint] = performance.getEntriesByType('paint').filter(entry => entry.name === 'first-contentful-paint');
  
    // Calculate page load time (from navigation start to load event end)
    const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
  
    // Calculate time to DOMContentLoaded (from navigation start to DOMContentLoaded)
    const domContentLoadedTime = navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;
  
    console.log(`Page Load Time: ${pageLoadTime}ms`);
    console.log(`DOM Content Loaded Time: ${domContentLoadedTime}ms`);
    if (firstContentfulPaint) {
      console.log(`First Contentful Paint: ${firstContentfulPaint.startTime}ms`);
    }
  
    // You can send these metrics to a server or log them for analysis
  });  