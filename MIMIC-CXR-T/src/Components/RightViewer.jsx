import React, { useState , useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, ToggleButton, Modal, Button, Form } from 'react-bootstrap';
import './rightviewer.css';

function RightViewer2({ translatedreports, currentIndex, 
  highlightedPhraseIndex, setHighlightedPhraseIndex,  resetButtons }) {
  const currentTranslatedReport = translatedreports[currentIndex];
  const [buttonStates, setButtonStates] = useState(
    currentTranslatedReport.translatedphrases.map(() => ({
    check: false,
    times: false,
  })));

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

  const handleTimesButtonClick = (index) => {
    const updatedStates = [...buttonStates];
    updatedStates[index] = { check: false, times: true };
    setButtonStates(updatedStates);

    // Show the modal for "Times" and set the modalText
    setShowModal(true);
    setModalText('');
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    // Handle saving modalText, you can send it to the server or update state as needed
    console.log('Saved Text:', modalText);

    // Close the modal
    setShowModal(false);
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
          {currentTranslatedReport.translatedphrases.map((translatedphrase, index) => (
            <Card.Text
              key={translatedphrase.id}
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
              <Row>
                <Col>{translatedphrase.text}</Col>
                <Col>
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
                    onClick={() => handleTimesButtonClick(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </ToggleButton>
                </Col>
              </Row>
            </Card.Text>
          ))}
        </Card.Body>
      </Card>

      {/* Modal for "Times" */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Texto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Texto</Form.Label>
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
