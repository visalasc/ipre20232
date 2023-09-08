import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faDownload, faArrowLeft, faArrowRight,
  faUser, faSignOutAlt , faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './TopBar.css';

function TopBar({ type, activeButton, handleButtonClick, handleSearchChange }) {
  return (
    <div className="top-bar">
      {type === 'file' && (
        <>
          <div
            className={`top-bar-icon ${activeButton === 'fileUpload' ? 'active' : ''}`}
            onClick={() => handleButtonClick('fileUpload')}
          >
            <FontAwesomeIcon icon={faFileUpload} />
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
        </>
      )}
      {type === 'textSearch' && (
        <div className="top-bar-text-search">
          <input
            type="text"
            placeholder="Buscar en el reporte..."
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <div className="top-bar-icon">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div
            className={`top-bar-icon ${activeButton === 'download' ? 'active' : ''}`}
            onClick={() => handleButtonClick('download')}
          >
            <FontAwesomeIcon icon={faDownload} />
          </div>
        </div>
      )}
      {type === 'filterCards' && (
        <div className="top-bar-filter">
          <input
            type="text"
            placeholder="Filtrar tarjetas..."
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <div
            className={`top-bar-icon ${activeButton === 'up' ? 'active' : ''}`}
            onClick={() => handleButtonClick('up')}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </div>
          <div
            className={`top-bar-icon ${activeButton === 'down' ? 'active' : ''}`}
            onClick={() => handleButtonClick('down')}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
        </div>
      )}
       {type === 'profile' && (
         <div className={`top-bar ${type === 'profile' ? 'right-align' : ''}`}>
         <>
          <div className="top-bar-icon" onClick={() => handleButtonClick('profile')}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="top-bar-icon" onClick={() => handleButtonClick('logout')}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
        </>
        </div>
      )}
    </div>
  );
}

export default TopBar;
