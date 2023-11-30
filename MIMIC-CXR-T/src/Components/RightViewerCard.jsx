import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, ToggleButton} from 'react-bootstrap';
import './rightviewer.css';
import ModalSuggestions from './ModalSuggestions';
import { createUserTranslatedPhrase, deleteCorrection, deleteSuggestion, 
  getPreviousUserTranslatedPhrase, updateUserTranslatedPhrase } from '../utils/api';
import { AuthContext } from '../auth/AuthContext';

function RightViewer({ translatedreports, currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex }) {
  const currentTranslatedReport = translatedreports[currentIndex];
  const [translatedPhrasesState, setTranslatedPhrasesState] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranslatedPhraseId, setSelectedTranslatedPhraseId] = useState(null);
  const { token } = useContext(AuthContext);

  const loadUserTranslatedPhrase = async (translatedphrase) => {
      try {
        const response = await getPreviousUserTranslatedPhrase(translatedphrase.id, token);
        if (response) {
          if (response.isSelectedCheck) {
            setTranslatedPhrasesState(prev => ({ ...prev, [translatedphrase.id]: true }));
          } else {
            setTranslatedPhrasesState(prev => ({ ...prev, [translatedphrase.id]: false }));
          }
          
        }
      } catch (error) {
        // Manejar el error, por ejemplo, mostrar un mensaje de error o registrar en la consola
        console.error(`Error obteniendo traducciones para ${translatedphrase.id}:`, error);
      }
  }

  const handleTranslatedPhraseClick = (translatedPhrases, check) => {
    if(check) {
      if (translatedPhrases.id in translatedPhrasesState){
        updateUserTranslatedPhrase(translatedPhrases.id, true, false, token);
        console.log("updateUserTranslatedPhrase frase:", translatedPhrases.id)
        deleteCorrection(translatedPhrases.id, token);
        console.log("deletedCorrection para frase ", translatedPhrases.id)
        deleteSuggestion(translatedPhrases.id, token);
        console.log("deletedSuggestion para frase ", translatedPhrases.id)
      }
      else {
        createUserTranslatedPhrase(translatedPhrases.id, true, false, token);
        
      }
      setTranslatedPhrasesState(prev => ({...prev, [translatedPhrases.id]: true}))
    }
    else {
      if (translatedPhrases.id in translatedPhrasesState){
        updateUserTranslatedPhrase(translatedPhrases.id, false, true, token);
        console.log("updateUserTranslatedPhrase frase:", translatedPhrases.id)
      }
      else{
        createUserTranslatedPhrase(translatedPhrases.id, false, true, token);
        console.log("createUserTranslatedPhrase frase:", translatedPhrases.id)
        
      }
      setTranslatedPhrasesState(prev => ({...prev, [translatedPhrases.id]: false}))
      setSelectedTranslatedPhraseId(translatedPhrases.id);
      setIsModalOpen(true);
    }
  }

  return (
    <>
      <Card text="dark" bg="light" border="secondary">
        <Card.Header>Reporte Pre-traducido:</Card.Header>
        <Card.Text>TranslatedReportID: {currentTranslatedReport.id}</Card.Text> 
        <Row>
            <Col>
          {currentTranslatedReport.translatedphrases.map((translatedphrase, indexPhrase) => {
              loadUserTranslatedPhrase(translatedphrase); 

              return (
              <div key={translatedphrase.id} className="translated-phrase">
                <Card.Text className={`${translatedphrase.isCorrect ||
                  translatedphrase.isIncorrect ? 'selected' : ''}
                  ${highlightedPhraseIndex === indexPhrase ? 'highlighted-right' : ''}`}
                  onMouseEnter={() => setHighlightedPhraseIndex(indexPhrase)}
                  onMouseLeave={() => setHighlightedPhraseIndex(null)}
                  >
                  {translatedphrase.text}
                </Card.Text>
                <div id={translatedphrase.id} className="button-row">
                  <ToggleButton
                    type="checkbox"
                    variant={translatedPhrasesState[translatedphrase.id] === true ? 'success' : 'outline-success'}
                    onClick={() => handleTranslatedPhraseClick(translatedphrase, true)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </ToggleButton>
                  <ToggleButton
                    type="checkbox"
                    variant={translatedPhrasesState[translatedphrase.id] === false ? 'danger' : 'outline-danger'}
                    onClick={() => handleTranslatedPhraseClick(translatedphrase, false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </ToggleButton>
                </div>
              </div>
              );
                })}
          </Col>
        </Row>
      </Card>
      <ModalSuggestions  show={isModalOpen} onHide={() => setIsModalOpen(false)}
          selectedTranslatedPhraseId={selectedTranslatedPhraseId}/>
    </>
  );
}

export default RightViewer;