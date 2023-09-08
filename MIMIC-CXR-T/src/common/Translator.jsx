import React , { useState }from 'react';
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import Nav from '../Components/Nav';
import TopBar from '../Components/TopBar';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import SuggestionViewer from '../Components/SuggestionViewer';
import Home from './Home';
import './translator.css';

function Translator() {
  const [activeButton1, setActiveButton1] = useState(null);
  const [activeButton2, setActiveButton2] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [activeButton3, setActiveButton3] = useState(null);
  const [activeButton4, setActiveButton4] = useState(null);
  const [filterText, setFilterText] = useState('');

  const [fileText, setFileText] = useState('');
  const [translation, setTranslation] = useState('sdfghj');
  const [suggestions, setSuggestions] = useState([
    { text: 'Sugerencia 1' },
    { text: 'Sugerencia 2' },
    { text: 'Sugerencia 3' },
    { text: 'Sugerencia 4' },
    { text: 'Sugerencia 5' },
  ]);

  const handleFileUpload = (file) => {
    // Código para leer el archivo y establecer el estado 'fileText'
  };

  const handleAcceptSuggestion = (suggestionText) => {
    // Código para aplicar la sugerencia al estado 'translation'
    // Puedes filtrar las sugerencias para quitar la que se acepta
    const updatedSuggestions = suggestions.filter(
      (suggestion) => suggestion.text !== suggestionText
    );
    setSuggestions(updatedSuggestions);
    // Luego, aplicar la sugerencia a 'translation'
    setTranslation((prevTranslation) => `${prevTranslation} ${suggestionText}`);
  };

  const handleRejectSuggestion = (suggestionText) => {
    // Código para mantener el estado 'translation' sin cambios
    // Puedes filtrar las sugerencias para quitar la que se rechaza
    const updatedSuggestions = suggestions.filter(
      (suggestion) => suggestion.text !== suggestionText
    );
    setSuggestions(updatedSuggestions);
  };

  return (
    <div>
       <TopBar
        type="profile"
        activeButton={activeButton4}
        handleButtonClick={setActiveButton4}
        
      />
    <div>

    </div>
    <div className="app-container">
        <TopBar
          type="file"
          activeButton={activeButton1}
          handleButtonClick={setActiveButton1}
        />
        <TopBar
          type="textSearch"
          activeButton={activeButton2}
          handleSearchChange={setSearchText}
        />
        <TopBar
          type="filterCards"
          activeButton={activeButton3}
          handleButtonClick={setActiveButton3}
          handleSearchChange={setFilterText}
        />
      <div className="leftviewer-container">
        <LeftViewer text={fileText} />
        </div>
        <div className="rightviewer-container">
        <RightViewer text={translation} />
        </div>
        <div className="sugviewer-container">
        {suggestions.map((suggestion, index) => (
          <SuggestionViewer
            key={index}
            suggestionText={suggestion.text}
            onAccept={handleAcceptSuggestion}
            onReject={handleRejectSuggestion}
          />
          
        ))}
        </div>
    </div>
    </div>
  );
}

export default Translator;
