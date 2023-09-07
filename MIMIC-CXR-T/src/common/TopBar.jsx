import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faDownload, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './TopBar.css'; // Asegúrate de importar tu archivo de estilos CSS

function TopBar() {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="top-bar">
      <div
        className={`top-bar-icon ${activeButton === 'file' ? 'active' : ''}`}
        onClick={() => handleButtonClick('file')}
      >
        <FontAwesomeIcon icon={faFile} />
      </div>
      <div
        className={`top-bar-icon ${activeButton === 'download' ? 'active' : ''}`}
        onClick={() => handleButtonClick('download')}
      >
        <FontAwesomeIcon icon={faDownload} />
      </div>
      <div
        className={`top-bar-icon ${activeButton === 'left' ? 'active' : ''}`}
        onClick={() => handleButtonClick('left')}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div
        className={`top-bar-icon ${activeButton === 'right' ? 'active' : ''}`}
        onClick={() => handleButtonClick('right')}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
    </div>
  );
}

export default TopBar;
