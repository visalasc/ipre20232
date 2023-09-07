import React, { useState } from 'react';
import './App.css';
import TopBar from './TopBar';
import LeftViewer from './LeftViewer';
import RightViewer from './RightViewer';
import SuggestionViewer from './SuggestionViewer';

function App() {
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
    <div className="app-container">
      
      <TopBar onFileUpload={handleFileUpload} />
      
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
  );
}

export default App;

