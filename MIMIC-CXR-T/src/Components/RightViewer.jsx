import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, ToggleButton} from 'react-bootstrap';
import './rightviewer.css';
import ModalSuggestions from './ModalSuggestions';

function RightViewer({ translatedreports, currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex }) {
  const currentTranslatedReport = translatedreports[currentIndex];
  const [translatedPhrasesState, setTranslatedPhrasesState] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranslatedPhraseId, setSelectedTranslatedPhraseId] = useState(null);


  const loadUserTranslatedPhrase = async () => {
    //falta completar esta funcion para traer los user translatedphrase y asi dar estado true o false a los botones check y times al abrir el reportgroupreprot
  };

  const handleTranslatedPhraseClick = (translatedPhrases, check) => {
    if(check) {
      setTranslatedPhrasesState(prev => ({...prev, [translatedPhrases.id]: true}))
    }
    else {
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
            {currentTranslatedReport.translatedphrases.map((translatedphrase, indexPhrase) => (
             
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
            ))}
          </Col>
        </Row>
      </Card>
      <ModalSuggestions  show={isModalOpen} onHide={() => setIsModalOpen(false)}
          selectedTranslatedPhraseId={selectedTranslatedPhraseId}/>
    </>
  );
}

export default RightViewer;
