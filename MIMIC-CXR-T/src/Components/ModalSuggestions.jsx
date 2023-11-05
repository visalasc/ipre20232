import { useState, useContext } from 'react';
import { Button, Modal, Form, ToggleButton, Card, Col, Row } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { getPreviousSuggestion, updateSuggestion, createSuggestion, 
  getTranslatedPhraseById, createCorrection, updateCorrection, getPreviousCorrection } from '../utils/api';
import WordSelector from './WordSelector';

function ModalSuggestions({ show, onHide, selectedTranslatedPhraseId }) {
  const [modalText, setModalText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [previousSuggestion, setPreviousSuggestion] = useState(null);
  const [previousCorrection, setPreviousCorrection] = useState(null);
  const [translatedPhrase, setTranslatedPhrase] = useState('');
  const [editedTranslatedPhrase, setEditedTranslatedPhrase] = useState(''); 
  const { token } = useContext(AuthContext);

  const loadPreviousSuggestionData = async (selectedTranslatedPhraseId) => {
    try {
      const previousSuggestionResponse = await getPreviousSuggestion(selectedTranslatedPhraseId, token);
      if (previousSuggestionResponse) {
        setPreviousSuggestion(previousSuggestionResponse);
        setModalText(previousSuggestionResponse.text);
        console.log("previousSuggestion",previousSuggestion);
      } else {
        setModalText(''); 
      }
    } catch (error) {
      console.error('Error al cargar datos previos:', error);
      setModalText(''); 
      
    }
  };

  const loadPreviousCorrectionData = async (selectedTranslatedPhraseId) => {
    try {
      const previousCorrectionResponse = await getPreviousCorrection(selectedTranslatedPhraseId, token);
      if (previousCorrectionResponse){
        setPreviousCorrection(previousCorrectionResponse);
        setSelectedOptions(previousCorrection.text)
        console.log("previousCorrection",previousCorrection);
      } else {
        setSelectedOptions([]);
      }
    } catch (error) {
      console.error('Error al cargar datos previos:', error);
      setSelectedOptions([]);
    }
  };

  const loadTranslatedPhrase = async (selectedTranslatedPhraseId) => {
    try {
      const translatedPhraseResponse = await getTranslatedPhraseById(selectedTranslatedPhraseId, token);
      if (translatedPhraseResponse) {
        setTranslatedPhrase(translatedPhraseResponse.translatedPhrase.text);
        setEditedTranslatedPhrase(translatedPhraseResponse.translatedPhrase.text); 
      }
    } catch (error) {
      console.error('Error al cargar translatedPhrase:', error);
   
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((opt) => opt !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const handleModalSave = async (event) => {
    event.preventDefault();
    try {
      console.log("previousCorrection.translatedPhraseId: ",previousCorrection.translatedphraseId);
      console.log("previousSuggestion.translatedPhraseId: ",previousSuggestion.translatedphraseId);
      console.log("selected translatedPhraseId: ", selectedTranslatedPhraseId);
      if (previousSuggestion.translatedphraseId === selectedTranslatedPhraseId) {
        await updateSuggestion(selectedTranslatedPhraseId, modalText, token);
      } else {
        await createSuggestion(selectedTranslatedPhraseId, modalText, token);
      }
      if (previousCorrection.translatedphraseId === selectedTranslatedPhraseId) {
        await updateCorrection(selectedTranslatedPhraseId, selectedOptions, token);
      } else {
        await createCorrection(selectedTranslatedPhraseId, selectedOptions, token);
      }
      onHide();
    } catch (error) {
      console.error('Error al guardar la sugerencia:', error);
    }
  };

return (
    <>
      <Modal show={show} onShow={() => {
        loadTranslatedPhrase(selectedTranslatedPhraseId);
        loadPreviousCorrectionData(selectedTranslatedPhraseId);
        loadPreviousSuggestionData(selectedTranslatedPhraseId);
        }} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar sugerencia o corrección:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Seleccione una opción:</Form.Label>
              <div>
              <Card border="info">
                <Row>
                  <Col xs={3}>
                 
                    <ToggleButton
                      type="checkbox"
                      variant={selectedOptions.includes('Terminological') ? 'info' : 'light'}
                      onClick={() => handleOptionClick('Terminological')}
                    >
                      Terminological
                    </ToggleButton>
                  </Col>
                  <Col >
                    <WordSelector sentence={translatedPhrase} 
                    variant={"outline-info"}
                    disabled={!selectedOptions.includes('Terminological')}
                    selectedClass = {'selected-word-info'}
                    />
                  </Col>   
                </Row>
              </Card>
              <Card border="success">
                <Row>
                  <Col xs={3}>
                    <ToggleButton
                        type="checkbox"
                        variant={selectedOptions.includes('Grammatical') ? 'success' : 'light'}
                        onClick={() => handleOptionClick('Grammatical')}
                      >
                        Gramatical
                    </ToggleButton>
                  </Col>
                  <Col >
                    <WordSelector sentence={translatedPhrase} 
                    variant={"outline-success"}
                    disabled={!selectedOptions.includes('Grammatical')}
                    selectedClass = {'selected-word-success'}
                    />
                  </Col>  
                </Row>
              </Card>
              <Card border="warning">
                <Row>
                  <Col xs={3}>
                    <ToggleButton
                      type="checkbox"
                      variant={selectedOptions.includes('Functional') ? 'warning' : 'light'}
                      onClick={() => handleOptionClick('Functional')}
                    >
                      Functional
                    </ToggleButton>
                  </Col>
                  <Col >
                    <WordSelector sentence={translatedPhrase} 
                    variant={"outline-warning"}
                    disabled={!selectedOptions.includes('Functional')}
                    selectedClass = {'selected-word-warning'}
                    />
                  </Col>  
                </Row>
              </Card>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Agregar correcciones a la frase traducida:</Form.Label>
              <Form.Control
                type="text"
                value={editedTranslatedPhrase}
                onChange={(evento) => setEditedTranslatedPhrase(evento.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Agregar sugerencia:</Form.Label>
              <Form.Control
                type="text"
                value={modalText}
                onChange={(change) => setModalText(change.target.value)}
                />
            </Form.Group>
          </Form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleModalSave} 
          disabled={!modalText && selectedOptions.length === 0}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
}
export default ModalSuggestions;
      
