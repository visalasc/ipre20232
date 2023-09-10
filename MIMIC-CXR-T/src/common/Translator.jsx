import React , { useState }from 'react';
import MyNavBar from '../Components/NavApp';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import './translator.css';

function Translator() {

  return (
    <>
    <div>
      <MyNavBar/>
    </div>
    <div className="app-container">
        <div className="leftviewer-container">
          <LeftViewer />
        </div>
        <div className="rightviewer-container">
        < RightViewer />
        </div>
    </div>
    </>
  );
}

export default Translator;
