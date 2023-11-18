import { useState, useContext } from 'react';
import { Button, Modal, Form, Row, Card, Tab, Tabs} from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { getPreviousSuggestion, updateSuggestion, createSuggestion, 
  getTranslatedPhraseById, createCorrection, updateCorrection, getPreviousCorrection,
  findOriginalPhrase } from '../utils/api';
import WordSelector from './WordSelector';

function ModalSuggestions({ show, onHide, selectedTranslatedPhraseId }) {
  const [modalText, setModalText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [previousSuggestion, setPreviousSuggestion] = useState(null);
  const [previousCorrection, setPreviousCorrection] = useState(null);
  const [translatedPhrase, setTranslatedPhrase] = useState('');
  const [originalPhrase, setOriginalPhrase] = useState('');
  const [editedTranslatedPhrase, setEditedTranslatedPhrase] = useState(''); 
  const [otherCorrection, setOtherCorrection] = useState('');
  const { token } = useContext(AuthContext);
 
  const loadOriginalPhrase = async(selectedTranslatedPhraseId) => {
    try{
        const originalphrase = await findOriginalPhrase(selectedTranslatedPhraseId, token);
        console.log("originalphrase0",originalphrase)
        if (originalphrase) {
        console.log(selectedTranslatedPhraseId)
        console.log("originalphrase1",originalphrase)
        setOriginalPhrase(originalphrase.text)
        }
     } catch (error) {
        console.error('Error al cargar frase original :', error);
      }
  };

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
        console.log("previousCorrectionResponse",previousCorrectionResponse)
        setPreviousCorrection(previousCorrectionResponse);
        setSelectedOptions(previousCorrection.text)
        console.log("previousCorrection",previousCorrection);
      } else {
        setSelectedOptions([]);
        setPreviousCorrection('');
      }
    } catch (error) {
      console.error('Error al cargar datos previos:', error);
      setSelectedOptions([]);
      setPreviousCorrection('');
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
      if (previousSuggestion == null){
        await createSuggestion(selectedTranslatedPhraseId, modalText, token);
        console.log("sugerencia para la frase ", selectedTranslatedPhraseId, " creada")
      } else {
        console.log("previousSuggestion.translatedphraseId: ",previousSuggestion.translatedphraseId)
        if (previousSuggestion.translatedphraseId == selectedTranslatedPhraseId) {
          await updateSuggestion(selectedTranslatedPhraseId, modalText, token);
          console.log("sugerencia para la frase ", selectedTranslatedPhraseId, " actualizada")
        }
        else {
          await createSuggestion(selectedTranslatedPhraseId, modalText, token);
          console.log("sugerencia para la frase ", selectedTranslatedPhraseId, " creada")
      }}

      if (previousCorrection == null) {
        await createCorrection(selectedTranslatedPhraseId, selectedOptions, token);
        console.log("correccion para la frase ", selectedTranslatedPhraseId, " creada")
      } else {
        console.log("previousCorrection.translatedphraseId: ",previousCorrection.translatedphraseId)
        if (previousCorrection.translatedphraseId == selectedTranslatedPhraseId) {
          await updateCorrection(selectedTranslatedPhraseId, selectedOptions, token);
          console.log("correccion para la frase ", selectedTranslatedPhraseId, " actualizada")
      } else {
        await createCorrection(selectedTranslatedPhraseId, selectedOptions, token);
        console.log("correccion para la frase ", selectedTranslatedPhraseId, " creada")
      }}
      onHide()
    } catch (error) {
      console.error('Error al guardar la sugerencia:', error);
    }
  };

  const handleModalClose = () => {
    // Restablecer estados
    setSelectedOptions([]);
    setOtherCorrection('');
    setPreviousSuggestion(null);
    setPreviousCorrection(null);
    // ... restablecer otros estados necesarios ...
  
    // Llamar a onHide para cerrar el modal
    onHide();
  };

return (
    <>
      <Modal show={show} onShow={() => {
        loadOriginalPhrase(selectedTranslatedPhraseId);
        loadTranslatedPhrase(selectedTranslatedPhraseId);
        loadPreviousCorrectionData(selectedTranslatedPhraseId);
        loadPreviousSuggestionData(selectedTranslatedPhraseId);
        }} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Identificar errores y editar traducción final:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="h6">Seleccione uno o varios tipos de errores:</Form.Label>
              <div>
                <Row>
                  <Tabs
                    defaultActiveKey="grammatical"
                    onSelect={(key) => handleOptionClick(key)}
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                   >
                  <Tab eventKey="grammatical" title="Grammatical">
                    <Card border="success" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                      <Form.Label className="h6" >Seleccionar errores gramaticales encontrados en la traducción:</Form.Label>
                      <WordSelector
                        sentence={translatedPhrase}
                        disabled={false}
                      />
                    </Card>
                  </Tab>
                  <Tab eventKey="terminological" title="Terminological">
                    <Card border="primary" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                      <Form.Label className="h6" >Seleccionar errores terminológicos encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedPhrase}
                          disabled={false}
                        />
                      </Card>
                  </Tab>
                  <Tab eventKey="functional" title="Functional">
                    <Card border="warning" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                      <Form.Label className="h6" >Seleccionar errores funcionales encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedPhrase}
                          disabled={false}
                        />
                    </Card>
                  </Tab>
                  <Tab eventKey="other" title="Other">
                    <Card border="danger" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                      <Form.Label className="h6" >Seleccionar errores de otro tipo encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedPhrase}
                          disabled={false}
                        />
                    
                       <Form.Label className="h6" >Describa el tipo de error encontrado:</Form.Label>
                    <Form.Control
                            type="text"
                            value={otherCorrection}
                            onChange={(otherChange) => setOtherCorrection(otherChange.target.value)}
                            />
                    </Card>
                  </Tab>
                  </Tabs>
                </Row>
              </div>
            </Form.Group>
              <Form.Group>
                <Card border="light" style={{ width: 'auto', padding: '5px' }}>
                  <Form.Label >Frase original:</Form.Label>
                  <Form.Label>{originalPhrase}</Form.Label>   
          
                  </Card>
              <Form.Label className="h6" >Editar la traducción final:</Form.Label>
              <Form.Control
                as="textarea" rows={2} 
                value={editedTranslatedPhrase}
                onChange={(evento) => setEditedTranslatedPhrase(evento.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="h6">Si tienes algún comentario adicional agregar aquí:</Form.Label>
              <Form.Control
                 as="textarea" rows={1} 
                value={modalText}
                onChange={(change) => setModalText(change.target.value)}
                />
            </Form.Group>
          </Form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
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
      
