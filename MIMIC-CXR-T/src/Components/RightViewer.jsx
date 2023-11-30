import { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Table, ToggleButton} from 'react-bootstrap';
import './rightviewer.css';
//import ModalSuggestions from './ModalSuggestions';
//import ModalSuggestions from './ModalSuggestionsOldWorking';
import ModalSuggestions from './ModalWithAccordeons';
import { createUserTranslatedPhrase,
  getPreviousUserTranslatedPhrase, updateUserTranslatedPhrase } from '../utils/api';
import { AuthContext } from '../auth/AuthContext';

function RightViewer({translatedreports, currentIndex, 
  highlightedPhraseIndex, setHighlightedPhraseIndex, triggerProgressRecalculation }) {
  const currentTranslatedReport = translatedreports[currentIndex];
  const [translatedPhrasesState, setTranslatedPhrasesState] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranslatedPhraseId, setSelectedTranslatedPhraseId] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (currentTranslatedReport) {
      currentTranslatedReport.translatedphrases.forEach(translatedphrase => {
        loadUserTranslatedPhrase(translatedphrase);
      });
    }
  }, [currentTranslatedReport, token]); 

  const loadUserTranslatedPhrase = async (translatedphrase) => {
      try {
        const response = await getPreviousUserTranslatedPhrase(translatedphrase.id, token);
        if (response) {
          if (response.isSelectedCheck) 
            setTranslatedPhrasesState(prev => ({ ...prev, [translatedphrase.id]: true }));
          if (response.isSelectedTimes) 
            setTranslatedPhrasesState(prev => ({ ...prev, [translatedphrase.id]: false }));
        }
        else {
          setTranslatedPhrasesState(prev => ({ ...prev, [translatedphrase.id]: null }));
        }
      }
       catch (error) {
        // Manejar el error, por ejemplo, mostrar un mensaje de error o registrar en la consola
        console.error(`no encontrada UTP de tphrase id: ${translatedphrase.id}:`, error);
      }
  }

  const handleTranslatedPhraseClick = async (translatedPhrases, check) => {
    if(check) {
      if (translatedPhrases.id in translatedPhrasesState){
        await updateUserTranslatedPhrase(translatedPhrases.id, true, false, token);
        console.log("updateUserTranslatedPhrase frase:", translatedPhrases.id)
        //deleteCorrection(translatedPhrases.id, token);
        //console.log("deletedCorrection para frase ", translatedPhrases.id)
        //deleteSuggestion(translatedPhrases.id, token);
        //console.log("deletedSuggestion para frase ", translatedPhrases.id)
      }
      else {
        await createUserTranslatedPhrase(translatedPhrases.id, true, false, token);
        console.log("createUserTranslatedPhrase frase:", translatedPhrases.id)
      
      }
      setTranslatedPhrasesState(prev => ({...prev, [translatedPhrases.id]: true}))
      triggerProgressRecalculation();
      console.log("triggerProgressRecalculation create UTP")
    }
    else {
      if (translatedPhrases.id in translatedPhrasesState){
        await updateUserTranslatedPhrase(translatedPhrases.id, false, true, token);
        console.log("updateUserTranslatedPhrase frase:", translatedPhrases.id)
      }
      else{
        await createUserTranslatedPhrase(translatedPhrases.id, false, true, token);
        console.log("createUserTranslatedPhrase frase:", translatedPhrases.id)
        
      }
      setTranslatedPhrasesState(prev => ({...prev, [translatedPhrases.id]: false}))
      setSelectedTranslatedPhraseId(translatedPhrases.id);
      setIsModalOpen(true);
      triggerProgressRecalculation();
      console.log("triggerProgressRecalculation update UTP")
      
    }
   
  }


  return (
    <>
      <div>
      <Table striped hover borderless responsive="sm">
          <thead>
            <tr>
              <th>Reporte pretraducido</th>
            </tr>
            <tr>
              <th>ReportID: {currentTranslatedReport.id}</th>
            </tr>
          </thead>
          <tbody>
            {currentTranslatedReport.translatedphrases.map((translatedphrase, indexPhrase) => (
              <tr key={translatedphrase.id}>
                <td
                  key={translatedphrase.id}
                  className={`text-row text-left ${translatedphrase.isCorrect || translatedphrase.isIncorrect ? 'selected' : ''} ${
                    highlightedPhraseIndex === indexPhrase ? 'highlighted-right' : ''
                  }`}
                  onMouseEnter={() => setHighlightedPhraseIndex(indexPhrase)}
                  onMouseLeave={() => setHighlightedPhraseIndex(null)}
                >
                  {translatedphrase.text}
                </td>
                <td key={translatedphrase.id} className="button-row">
                  <ToggleButton
                    size="sm"
                    type="checkbox"
                    variant={translatedPhrasesState[translatedphrase.id] === true ? 'success' : 'outline-success'}
                    onClick={() => handleTranslatedPhraseClick(translatedphrase, true)}
                    className="custom-toggle-button times"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </ToggleButton>
                  <ToggleButton
                    size="sm"
                    type="checkbox"
                    variant={translatedPhrasesState[translatedphrase.id] === false ? 'danger' : 'outline-danger'}
                    onClick={() => handleTranslatedPhraseClick(translatedphrase, false)}
                    className="custom-toggle-button check"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </ToggleButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      <ModalSuggestions  show={isModalOpen} onHide={() => setIsModalOpen(false)}
          selectedTranslatedPhraseId={selectedTranslatedPhraseId}/>
      </div>
    </>
  );
}

export default RightViewer;
