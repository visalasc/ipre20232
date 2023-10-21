import React, { useState , useEffect, useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, ToggleButton, Modal, Button, Form , ProgressBar} from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import SuggestionToast from './SuggestionToast';
import './rightviewer.css';

function RightViewer2({ translatedreports, currentIndex, 
  highlightedPhraseIndex, setHighlightedPhraseIndex,  resetButtons }) {
  const currentTranslatedReport = translatedreports[currentIndex];
  const [buttonStates, setButtonStates] = useState(
    currentTranslatedReport.translatedphrases.map(() => ({
    check: false,
    times: false,
  })));
  const [translatedphraseId, setTranslatedPhraseId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [suggestion, setSuggestion] = useState(''); // Una única sugerencia a la vez
  const [suggestions, setSuggestions] = useState([]); // Almacena las sugerencias

  const calculatePercentageClicked = () => {
    const clickedCount = buttonStates.filter((state) => state.check || state.times).length;
    const totalCount = buttonStates.length;
    return ((clickedCount / totalCount) * 100).toFixed(2);
  };
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');

  const handleCheckButtonClick = (index) => {
    const updatedStates = [...buttonStates];
    updatedStates[index] = { check: true, times: false };
    setButtonStates(updatedStates);
  };

  const handleTimesButtonClick = (index, translatedphraseId) => {
    const updatedStates = [...buttonStates];
    updatedStates[index] = { check: false, times: true };
    setButtonStates(updatedStates);
    setTranslatedPhraseId(translatedphraseId);
    setShowModal(true);
    setModalText('');
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const { token } = useContext(AuthContext);
  const handleModalSave = (event) => {
    // Hacer una solicitud para guardar el contenido en la base de datos
    event.preventDefault();
    console.log('Datos a enviar al servidor:', { text: modalText, translatedphraseId });

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/suggestions`, 
    { text: modalText , translatedphraseId}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log('Sugerencia guardada exitosamente');
        const newSuggestion = modalText; // Nueva sugerencia
        setSuggestion(newSuggestion); // Establecer la sugerencia actual
        setSuggestions([...suggestions, newSuggestion]); // Agregar la sugerencia a la lista de sugerencias
        setShowToast(true); // Mostrar la Toast
        handleModalClose();
         })
      .catch((error) => {
        console.error('Error al guardar la sugerencia:', error);
      });
  };

  useEffect(() => {
    // Reset button states when currentIndex changes
    setButtonStates(new Array(currentTranslatedReport.translatedphrases.length).fill({
      check: false,
      times: false,
    }));
  }, [currentIndex]);

  return (
    <>
      <Card text="dark" bg="light" border="secondary" style={{ width: '40rem', height: 'auto', overflow: 'scroll' }}>
        <Card.Body>
          <Card.Header>Reporte Pre-traducido:</Card.Header>
          <Card.Text>TranslatedReportID: {currentTranslatedReport.id}</Card.Text>
          <Row>
            <Col>
              {currentTranslatedReport.translatedphrases.map((translatedphrase, index) => (
                <div key={translatedphrase.id} className="translated-phrase">
                  <Card.Text
                    className={`${
                      highlightedPhraseIndex === index ? 'highlighted-right' : ''
                    } ${
                      buttonStates[index].check ? 'selected' : ''
                    }
                    ${
                      buttonStates[index].times ? 'selected-times' : ''
                    }`}
                    onMouseEnter={() => setHighlightedPhraseIndex(index)}
                    onMouseLeave={() => setHighlightedPhraseIndex(null)}
                  >
                    {translatedphrase.text}
                  </Card.Text>
                  <div className='button-row'>
                    <ToggleButton
                      type="checkbox"
                      variant={buttonStates[index].check ? 'success' : 'light'}
                      onClick={() => handleCheckButtonClick(index)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </ToggleButton>
                    <ToggleButton
                      type="checkbox"
                      variant={buttonStates[index].times ? 'danger' : 'light'}
                      onClick={() => handleTimesButtonClick(index, translatedphrase.id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </ToggleButton>
                  </div>
                </div>
              ))}
            </Col>
            <Col xs={3}>
              {showToast && <SuggestionToast suggestions={suggestions} onClose={() => setShowToast(false)} />}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    
      {/* Modal for "Times" */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Sugerencia:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Contenido:</Form.Label>
              <Form.Control
                type="text"
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

    
    </>
  );
}

export default RightViewer2;
