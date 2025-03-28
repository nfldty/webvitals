import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const screenSize = { width: 878, height: 812 };

const Heatmap = () => {
  const { userId, getCurrentUserId } = useAuth();
  const iframeRef = useRef(null);
  const [url, setUrl] = useState('');

  // Fetch heatmap data from the API based on userId
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await api.get(`/heatmap?userId=${userId}`);
        setUrl(response.data.url); // Assuming the URL is sent in the response
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchHeatmapData();
  }, [userId]);

  // Function to send heatmap data to the iframe
  const sendHeatmapDataToIframe = (heatmapData) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      console.log('Sending heatmap data to iframe...');
      iframeRef.current.contentWindow.postMessage(
        { type: 'event', event: { type: "heatmapData", data: heatmapData } },
        url  // Use the dynamic URL as the target origin
      );
      console.log("finished");
    }
  };

  // Use useEffect to send data after iframe loads
  useEffect(() => {
    // Function to handle iframe onload event
    const handleIframeLoad = () => {
      console.log('Iframe loaded, sending heatmap data...');
      sendHeatmapDataToIframe();
    };

    if (iframeRef.current) {
      iframeRef.current.onload = handleIframeLoad;
    }

    // Cleanup function to remove onload listener if needed
    return () => {
      if (iframeRef.current) {
        iframeRef.current.onload = null;
      }
    };
  }, []);  // Empty dependency array to only run once on mount

  // Check if URL is available, then render iframe
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Heatmap</h1>
      {url && (
        <iframe
          ref={iframeRef}
          src={`${url}?webvitals-tracking-switch=False`}  // Dynamically set iframe src with query parameter
          width={screenSize.width}
          height={screenSize.height}
          style={{ border: '1px solid #ddd', marginTop: '20px' }}
        />
      )}
    </div>
  );
};

export default Heatmap;
