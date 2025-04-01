import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';

const EmbedSnippet = ({ loading, error, snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(err => {
        // You can handle errors here if needed
      });
  };

  return (
    <>
      {!loading && !error && (
        <div className="widget-card snippet-card" style={{ position: 'relative' }}>
          <h3 className="bundle-title">Embed Widget</h3>
          <p>Insert this snippet into your web page's HTML:</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={snippet}
              onClick={(e) => e.target.select()}
              aria-label="Widget Snippet"
              style={{ marginRight: '8px' }}
            />
            <button onClick={handleCopy} aria-label="Copy snippet">
              <FaRegCopy />
            </button>
          </div>
          {copied && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}>
              Copied!
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EmbedSnippet;
