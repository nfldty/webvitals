import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const screenSize = { width: 878, height: 812 };

const Heatmap = () => {
  const iframeRef = useRef(null);
  const { currentUserId } = useAuth();
  const [heatmapData, setHeatmapData] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await api.get(`/heatmap?userId=${currentUserId}`);
        console.log("heatmapData", response.data.mouseCoordinates);
        setHeatmapData(response.data.mouseCoordinates);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchHeatmapData();
  }, []);

  // Send heatmap data when both data and iframe are ready
  useEffect(() => {
    if (heatmapData && iframeLoaded && iframeRef.current?.contentWindow) {
      console.log('Sending heatmap data to iframe...');
      iframeRef.current.contentWindow.postMessage(
        { type: 'event', event: { type: "heatmapData", data: heatmapData } },
        '*'
      );
      console.log("Finished sending heatmap data");
    }
  }, [heatmapData, iframeLoaded]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Heatmap</h1>

      {/* Load iframe only when heatmapData is ready */}
      {heatmapData && (
        <iframe
          ref={iframeRef}
          src="/app/test.html?webvitals-tracking-switch=False"
          width={screenSize.width}
          height={screenSize.height}
          style={{ border: '1px solid #ddd', marginTop: '20px' }}
          onLoad={() => {
            console.log("Iframe loaded");
            setIframeLoaded(true);
          }}
        />
      )}
    </div>
  );
};

export default Heatmap;
