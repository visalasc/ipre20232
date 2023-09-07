import React, { useState } from 'react';

function SuggestionViewer({ suggestionText, onAccept, onReject }) {
  const [showButtons, setShowButtons] = useState(false);

  const handleClick = () => {
    setShowButtons(!showButtons);
  };

  const handleAccept = () => {
    onAccept(suggestionText);
  };

  const handleReject = () => {
    onReject(suggestionText);
  };

  return (
    <div className="suggestion-card" onClick={handleClick}>
      <p>{suggestionText}</p>
      {showButtons && (
        <div className="suggestion-buttons">
          <button onClick={handleAccept}>Aceptar</button>
          <button onClick={handleReject}>Rechazar</button>
        </div>
      )}
    </div>
  );
}

export default SuggestionViewer;
