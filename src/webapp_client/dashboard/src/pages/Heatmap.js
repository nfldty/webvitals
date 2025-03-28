import React, {useEffect, useRef } from 'react';
const recordedEvents = [
    { type: 'mousemove', x: 365, y: 1, timestamp: 1743094358075 },
    { type: 'mousemove', x: 365, y: 1, timestamp: 1743094358075 },
    { type: 'mousemove', x: 359, y: 4, timestamp: 1743094358078 },
    { type: 'mousemove', x: 355, y: 8, timestamp: 1743094358086 },
    { type: 'mousemove', x: 350, y: 10, timestamp: 1743094358094 },
    { type: 'mousemove', x: 345, y: 13, timestamp: 1743094358102 },
    { type: 'mousemove', x: 341, y: 15, timestamp: 1743094358111 },
    { type: 'mousemove', x: 337, y: 17, timestamp: 1743094358119 },
    { type: 'mousemove', x: 332, y: 20, timestamp: 1743094358127 },
    { type: 'mousemove', x: 327, y: 22, timestamp: 1743094358135 },
    { type: 'mousemove', x: 321, y: 24, timestamp: 1743094358143 },
    { type: 'mousemove', x: 316, y: 26, timestamp: 1743094358151 },
    { type: 'mousemove', x: 310, y: 29, timestamp: 1743094358159 },
    { type: 'mousemove', x: 302, y: 32, timestamp: 1743094358167 },
    { type: 'mousemove', x: 294, y: 36, timestamp: 1743094358176 },
    { type: 'mousemove', x: 286, y: 39, timestamp: 1743094358183 },
    { type: 'mousemove', x: 278, y: 43, timestamp: 1743094358192 },
    { type: 'mousemove', x: 269, y: 48, timestamp: 1743094358200 },
    { type: 'mousemove', x: 259, y: 52, timestamp: 1743094358209 },
    { type: 'mousemove', x: 251, y: 56, timestamp: 1743094358216 },
    { type: 'mousemove', x: 243, y: 60, timestamp: 1743094358224 },
    { type: 'mousemove', x: 236, y: 64, timestamp: 1743094358232 },
    { type: 'mousemove', x: 229, y: 68, timestamp: 1743094358243 },
    { type: 'mousemove', x: 223, y: 72, timestamp: 1743094358248 },
    { type: 'mousemove', x: 217, y: 75, timestamp: 1743094358260 },
    { type: 'mousemove', x: 211, y: 79, timestamp: 1743094358264 },
    { type: 'mousemove', x: 209, y: 81, timestamp: 1743094358272 },
    { type: 'mousemove', x: 201, y: 86, timestamp: 1743094358281 },
    { type: 'mousemove', x: 196, y: 90, timestamp: 1743094358289 },
    { type: 'mousemove', x: 192, y: 93, timestamp: 1743094358297 },
    { type: 'mousemove', x: 188, y: 97, timestamp: 1743094358305 },
    { type: 'mousemove', x: 183, y: 102, timestamp: 1743094358313 },
    { type: 'mousemove', x: 178, y: 106, timestamp: 1743094358321 },
    { type: 'mousemove', x: 174, y: 112, timestamp: 1743094358329 },
    { type: 'mousemove', x: 169, y: 117, timestamp: 1743094358337 },
    { type: 'mousemove', x: 163, y: 123, timestamp: 1743094358346 },
    { type: 'mousemove', x: 159, y: 130, timestamp: 1743094358354 },
    { type: 'mousemove', x: 153, y: 137, timestamp: 1743094358362 },
    { type: 'mousemove', x: 149, y: 144, timestamp: 1743094358370 },
    { type: 'mousemove', x: 144, y: 150, timestamp: 1743094358378 },
    { type: 'mousemove', x: 140, y: 157, timestamp: 1743094358386 },
    { type: 'mousemove', x: 137, y: 159, timestamp: 1743094358394 },
    { type: 'mousemove', x: 131, y: 168, timestamp: 1743094358403 },
    { type: 'mousemove', x: 128, y: 174, timestamp: 1743094358411 },
    { type: 'mousemove', x: 124, y: 179, timestamp: 1743094358418 },
    { type: 'mousemove', x: 122, y: 184, timestamp: 1743094358427 },
    { type: 'mousemove', x: 118, y: 189, timestamp: 1743094358435 },
    { type: 'mousemove', x: 116, y: 194, timestamp: 1743094358443 },
    { type: 'mousemove', x: 115, y: 196, timestamp: 1743094358451 },
    { type: 'mousemove', x: 113, y: 201, timestamp: 1743094358458 },
    { type: 'mousemove', x: 111, y: 204, timestamp: 1743094358466 },
    { type: 'mousemove', x: 110, y: 206, timestamp: 1743094358475 },
    { type: 'mousemove', x: 107, y: 211, timestamp: 1743094358483 },
    { type: 'mousemove', x: 106, y: 215, timestamp: 1743094358491 },
    { type: 'mousemove', x: 104, y: 218, timestamp: 1743094358500 },
    { type: 'mousemove', x: 103, y: 222, timestamp: 1743094358508 },
    { type: 'mousemove', x: 102, y: 227, timestamp: 1743094358516 },
    { type: 'mousemove', x: 101, y: 232, timestamp: 1743094358524 },
    { type: 'mousemove', x: 99, y: 239, timestamp: 1743094358531 },
    { type: 'mousemove', x: 97, y: 246, timestamp: 1743094358539 },
    { type: 'mousemove', x: 95, y: 254, timestamp: 1743094358547 },
    { type: 'mousemove', x: 94, y: 262, timestamp: 1743094358555 },
    { type: 'mousemove', x: 93, y: 268, timestamp: 1743094358564 },
    { type: 'mousemove', x: 91, y: 275, timestamp: 1743094358572 },
    { type: 'mousemove', x: 90, y: 283, timestamp: 1743094358580 },
    { type: 'mousemove', x: 88, y: 290, timestamp: 1743094358588 },
    { type: 'mousemove', x: 87, y: 298, timestamp: 1743094358596 },
    { type: 'mousemove', x: 86, y: 306, timestamp: 1743094358605 },
    { type: 'mousemove', x: 86, y: 313, timestamp: 1743094358612 },
    { type: 'mousemove', x: 85, y: 316, timestamp: 1743094358620 },
    { type: 'mousemove', x: 85, y: 323, timestamp: 1743094358629 },
    { type: 'mousemove', x: 85, y: 328, timestamp: 1743094358637 },
    { type: 'mousemove', x: 85, y: 333, timestamp: 1743094358646 },
    { type: 'mousemove', x: 85, y: 337, timestamp: 1743094358653 },
    { type: 'mousemove', x: 85, y: 343, timestamp: 1743094358669 },
    { type: 'mousemove', x: 85, y: 347, timestamp: 1743094358677 },
    { type: 'mousemove', x: 85, y: 349, timestamp: 1743094358685 },
    { type: 'mousemove', x: 85, y: 351, timestamp: 1743094358693 },
    { type: 'mousemove', x: 85, y: 353, timestamp: 1743094358701 },
    { type: 'mousemove', x: 85, y: 354, timestamp: 1743094358709 },
    { type: 'mousemove', x: 85, y: 355, timestamp: 1743094358720 },
    { type: 'mousemove', x: 85, y: 356, timestamp: 1743094358726 },
    { type: 'mousemove', x: 85, y: 357, timestamp: 1743094358734 },
    { type: 'mousemove', x: 85, y: 357, timestamp: 1743094358742 },
    { type: 'mousemove', x: 85, y: 357, timestamp: 1743094358750 },
    { type: 'mousemove', x: 85, y: 358, timestamp: 1743094358758 },
    { type: 'mousemove', x: 85, y: 358, timestamp: 1743094358766 },
    { type: 'mousemove', x: 86, y: 358, timestamp: 1743094358774 },
    { type: 'mousemove', x: 86, y: 358, timestamp: 1743094358782 },
    { type: 'mousemove', x: 86, y: 358, timestamp: 1743094358790 },
    { type: 'mousemove', x: 86, y: 359, timestamp: 1743094358798 },
    { type: 'mousemove', x: 87, y: 359, timestamp: 1743094358807 },
    { type: 'mousemove', x: 88, y: 360, timestamp: 1743094358815 },
    { type: 'mousemove', x: 89, y: 361, timestamp: 1743094358824 },
    { type: 'mousemove', x: 90, y: 362, timestamp: 1743094358831 },
    { type: 'mousemove', x: 90, y: 363, timestamp: 1743094358839 },
    { type: 'mousemove', x: 92, y: 364, timestamp: 1743094358848 },
    { type: 'mousemove', x: 92, y: 365, timestamp: 1743094358856 },
    { type: 'mousemove', x: 94, y: 366, timestamp: 1743094358864 },
    { type: 'mousemove', x: 94, y: 366, timestamp: 1743094358871 },
    { type: 'mousemove', x: 95, y: 368, timestamp: 1743094358879 },
    { type: 'mousemove', x: 96, y: 368, timestamp: 1743094358888 },
    { type: 'mousemove', x: 96, y: 369, timestamp: 1743094358896 },
    { type: 'mousemove', x: 97, y: 370, timestamp: 1743094358904 },
    { type: 'mousemove', x: 98, y: 372, timestamp: 1743094358912 },
    { type: 'mousemove', x: 99, y: 374, timestamp: 1743094358920 },
    { type: 'mousemove', x: 100, y: 377, timestamp: 1743094358928 },
    { type: 'mousemove', x: 103, y: 380, timestamp: 1743094358936 },
    { type: 'mousemove', x: 105, y: 384, timestamp: 1743094358945 },
    { type: 'mousemove', x: 108, y: 387, timestamp: 1743094358952 },
    { type: 'mousemove', x: 111, y: 392, timestamp: 1743094358960 },
    { type: 'mousemove', x: 114, y: 395, timestamp: 1743094358968 },
    { type: 'mousemove', x: 116, y: 397, timestamp: 1743094358977 },
    { type: 'mousemove', x: 122, y: 402, timestamp: 1743094358984 },
    { type: 'mousemove', x: 122, y: 402, timestamp: 1743094359179 },
    { type: 'mousemove', x: 122, y: 407, timestamp: 1743094359187 },
    { type: 'mousemove', x: 122, y: 412, timestamp: 1743094359195 },
    { type: 'mousemove', x: 122, y: 417, timestamp: 1743094359203 },
    { type: 'mousemove', x: 122, y: 422, timestamp: 1743094359211 },
    { type: 'mousemove', x: 122, y: 428, timestamp: 1743094359219 },
    { type: 'mousemove', x: 122, y: 434, timestamp: 1743094359227 },
    { type: 'mousemove', x: 122, y: 439, timestamp: 1743094359235 },
    { type: 'mousemove', x: 122, y: 449, timestamp: 1743094359243 },
    { type: 'mousemove', x: 123, y: 460, timestamp: 1743094359252 },
    { type: 'mousemove', x: 124, y: 471, timestamp: 1743094359260 },
    { type: 'mousemove', x: 125, y: 482, timestamp: 1743094359268 },
    { type: 'mousemove', x: 127, y: 492, timestamp: 1743094359275 },
    { type: 'mousemove', x: 130, y: 503, timestamp: 1743094359284 },
    { type: 'mousemove', x: 132, y: 513, timestamp: 1743094359292 },
    { type: 'mousemove', x: 135, y: 522, timestamp: 1743094359300 },
    { type: 'mousemove', x: 137, y: 532, timestamp: 1743094359308 },
    { type: 'mousemove', x: 137, y: 531, timestamp: 1743094360886 },
    { type: 'mousemove', x: 137, y: 529, timestamp: 1743094360893 },
    { type: 'mousemove', x: 139, y: 526, timestamp: 1743094360901 },
    { type: 'mousemove', x: 141, y: 522, timestamp: 1743094360911 },
    { type: 'mousemove', x: 146, y: 513, timestamp: 1743094360918 },
    { type: 'mousemove', x: 150, y: 508, timestamp: 1743094360929 },
    { type: 'mousemove', x: 160, y: 489, timestamp: 1743094360934 },
    { type: 'mousemove', x: 170, y: 475, timestamp: 1743094360945 },
    { type: 'mousemove', x: 179, y: 461, timestamp: 1743094360950 },
    { type: 'mousemove', x: 188, y: 444, timestamp: 1743094360958 },
    { type: 'mousemove', x: 199, y: 427, timestamp: 1743094360966 },
    { type: 'mousemove', x: 208, y: 412, timestamp: 1743094360979 },
    { type: 'mousemove', x: 217, y: 395, timestamp: 1743094360982 },
    { type: 'mousemove', x: 222, y: 386, timestamp: 1743094360996 },
    { type: 'mousemove', x: 231, y: 371, timestamp: 1743094360998 },
    { type: 'mousemove', x: 239, y: 358, timestamp: 1743094361009 },
    { type: 'mousemove', x: 246, y: 347, timestamp: 1743094361014 },
    { type: 'mousemove', x: 252, y: 337, timestamp: 1743094361029 },
    { type: 'mousemove', x: 257, y: 329, timestamp: 1743094361030 },
    { type: 'mousemove', x: 258, y: 326, timestamp: 1743094361043 },
    { type: 'mousemove', x: 262, y: 322, timestamp: 1743094361046 },
    { type: 'mousemove', x: 265, y: 318, timestamp: 1743094361055 },
    { type: 'mousemove', x: 266, y: 315, timestamp: 1743094361063 },
    { type: 'mousemove', x: 268, y: 313, timestamp: 1743094361071 },
    { type: 'mousemove', x: 269, y: 311, timestamp: 1743094361079 },
    { type: 'mousemove', x: 271, y: 308, timestamp: 1743094361087 },
    { type: 'mousemove', x: 272, y: 307, timestamp: 1743094361095 },
    { type: 'mousemove', x: 273, y: 304, timestamp: 1743094361103 },
    { type: 'mousemove', x: 275, y: 300, timestamp: 1743094361111 },
    { type: 'mousemove', x: 276, y: 297, timestamp: 1743094361120 },
    { type: 'mousemove', x: 278, y: 294, timestamp: 1743094361128 },
    { type: 'mousemove', x: 281, y: 289, timestamp: 1743094361136 },
    { type: 'mousemove', x: 284, y: 284, timestamp: 1743094361144 },
    { type: 'mousemove', x: 287, y: 280, timestamp: 1743094361152 },
    { type: 'mousemove', x: 291, y: 276, timestamp: 1743094361160 },
    { type: 'mousemove', x: 295, y: 272, timestamp: 1743094361168 },
    { type: 'mousemove', x: 300, y: 269, timestamp: 1743094361176 },
    { type: 'mousemove', x: 301, y: 268, timestamp: 1743094361184 },
    { type: 'mousemove', x: 308, y: 264, timestamp: 1743094361192 },
    { type: 'mousemove', x: 313, y: 262, timestamp: 1743094361200 },
    { type: 'mousemove', x: 318, y: 260, timestamp: 1743094361208 },
    { type: 'mousemove', x: 323, y: 260, timestamp: 1743094361217 },
    { type: 'mousemove', x: 328, y: 259, timestamp: 1743094361225 },
    { type: 'mousemove', x: 334, y: 259, timestamp: 1743094361233 },
    { type: 'mousemove', x: 341, y: 259, timestamp: 1743094361241 },
    { type: 'mousemove', x: 350, y: 259, timestamp: 1743094361249 },
    { type: 'mousemove', x: 359, y: 258, timestamp: 1743094361257 },
    { type: 'mousemove', x: 367, y: 257, timestamp: 1743094361266 },
    { type: 'mousemove', x: 376, y: 256, timestamp: 1743094361274 },
    { type: 'mousemove', x: 385, y: 246, timestamp: 1743094361282 },
    { type: 'mousemove', x: 395, y: 236, timestamp: 1743094361290 },
    { type: 'mousemove', x: 403, y: 226, timestamp: 1743094361298 },
    { type: 'mousemove', x: 411, y: 225, timestamp: 1743094361306 },
    { type: 'mousemove', x: 418, y: 215, timestamp: 1743094361314 },
    { type: 'mousemove', x: 426, y: 205, timestamp: 1743094361322 },
    { type: 'mousemove', x: 433, y: 195, timestamp: 1743094361331 },
    { type: 'mousemove', x: 439, y: 185, timestamp: 1743094361339 },
    { type: 'mousemove', x: 445, y: 175, timestamp: 1743094361347 },
    { type: 'mousemove', x: 450, y: 170, timestamp: 1743094361355 },
    { type: 'mousemove', x: 460, y: 160, timestamp: 1743094361362 },
    { type: 'mousemove', x: 475, y: 145, timestamp: 1743094361371 },
    { type: 'click', x: 494, y: 133, timestamp: 1743094362244 }
  ];  
const screenSize = { width: 878, height: 812 };
const Heatmap = () => {
    const iframeRef = useRef(null);
  
    // Simulate heatmap data (in a real-world case, you would get this from user interactions)
    function generateHeatmapData(recordedEvents, maxIntensity) {
        const data = [];
      
        recordedEvents.forEach(event => {
          const value = Math.floor(Math.random() * maxIntensity) + 1; // Random intensity between 1 and 1000
          data.push({
            x: event.x,
            y: event.y,
            value: value,
          });
        });
      
        return data;
      }
      const heatmapData = generateHeatmapData(recordedEvents, 50);
  
    // Function to send heatmap data to the iframe
    const sendHeatmapDataToIframe = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        console.log('Sending heatmap data to iframe...');
        iframeRef.current.contentWindow.postMessage(
          { type: 'event', event: {type:"heatmapData", data:heatmapData} },
          'http://localhost:3000'  // Target the iframe's origin
        );
        console.log("finished")
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
  
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Heatmap</h1>
  
        {/* iFrame where heatmap will be displayed */}
        <iframe
          ref={iframeRef}
          src="http://localhost:3000/src/index.html?webvitals-tracking-switch=False" 
          width={screenSize.width}
          height={screenSize.height}
          style={{ border: '1px solid #ddd', marginTop: '20px' }}
        />
      </div>
    );
  };
  
  export default Heatmap;