import { useState, useContext, useEffect } from 'react';
import { Button, Modal, Form, Row, Card, Col, 
  Alert, Badge, Accordion } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import {
  getPreviousUserSuggestion,
  updateSuggestion,
  createSuggestion,
  findSentence,
  createCorrection,
  getPreviousUserCorrections,
  deleteUserCorrectionsTranslatedSentence,
} from '../utils/api';
import '../utils/modalScripts';
import WordSelector from './WordSelector';
import './modal.css';

function ModalSuggestions({ show, onHide, selectedTranslatedSentenceId, onCloseWithoutSave, onSave }) {
  const [modalText, setModalText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [previousSuggestion, setPreviousSuggestion] = useState(null);
  const [previousCorrection, setPreviousCorrection] = useState(null);
  const [translatedSentence, setTranslatedSentence] = useState('');
  const [originalSentence, setOriginalSentence] = useState('');
  const [editedTranslatedSentence, setEditedTranslatedSentence] = useState('');
  const [otherErrorDescription, setOtherErrorDescription] = useState('');
  const { token } = useContext(AuthContext);
  const [selectedOptionsByType, setSelectedOptionsByType] = useState({});
  const [selectedWords, setSelectedWords] = useState([]);
  const [showNoChangesAlert, setShowNoChangesAlert] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0); // Estado para almacenar la altura del encabezado

  const loadSentenceAndTranslation = async (selectedTranslatedSentenceId) => {
    try {
      const sentenceAndTranslatedSentence = await findSentence(selectedTranslatedSentenceId);
      if (sentenceAndTranslatedSentence) {
        setOriginalSentence(sentenceAndTranslatedSentence.sentence.text);
        setTranslatedSentence(sentenceAndTranslatedSentence.translatedSentence.text);
        loadPreviousSuggestionData(selectedTranslatedSentenceId);
        if (editedTranslatedSentence === '') 
        {setEditedTranslatedSentence(sentenceAndTranslatedSentence.translatedSentence.text)}
    }
   } catch (error) {
      console.error('Error loading sentence and translation:', error);
    }
  };

  const loadPreviousSuggestionData = async (selectedTranslatedSentenceId) => {
    console.log("loadPreviousSuggestionData from modal")
    try {
      const previousSuggestionResponse = await getPreviousUserSuggestion(selectedTranslatedSentenceId, token);
      if (previousSuggestionResponse) {
        setPreviousSuggestion(previousSuggestionResponse);
        setModalText(previousSuggestionResponse.comments);
        setEditedTranslatedSentence(previousSuggestionResponse.changesFinalTranslation);
      } else {
        setModalText('');
        setEditedTranslatedSentence(translatedSentence);
      }
    } catch (error) {
      console.error('Error loading previous suggestion data:', error);
    }
  };

  const loadPreviousCorrectionData = async (selectedTranslatedSentenceId) => {
    try {
      const previousCorrectionResponse = await getPreviousUserCorrections(selectedTranslatedSentenceId, token);
      if (previousCorrectionResponse) {
        setPreviousCorrection(previousCorrectionResponse);
        const selectedOptionsByType = {};
        const selectedWords = [];
  
        previousCorrectionResponse.forEach((correction) => {
          const type = correction.errorType;
          const option = {
            word: { index: correction.wordIndex, text: correction.wordSelected },
            type: correction.errorType.toString(), 
          };
          if (selectedOptionsByType[type]) {
            selectedOptionsByType[type].push(option);
          } else {
            selectedOptionsByType[type] = [option];
          }
  
          // Agregar la palabra seleccionada al array
          selectedWords.push({
            word: correction.wordSelected,
            index: correction.wordIndex,
            type: correction.errorType.toString(),
          });
        });
  
        setSelectedOptionsByType(selectedOptionsByType);
        setSelectedWords(selectedWords);
      } else {
        setPreviousCorrection(null);
      }
    } catch (error) {
      console.error('Error loading previous correction data:', error);
      setPreviousCorrection(null);
    }
  };
  
  const handleOptionClick = (options, type) => {
    setSelectedOptionsByType((prevOptionsByType) => {
      const updatedOptionsByType = { ...prevOptionsByType };
      updatedOptionsByType[type] = options;
      return updatedOptionsByType;
    });
  };

  const handleModalSave = async (event) => {
    event.preventDefault();
    try {
      console.log("se guarda desde modal")
      // Check if any field has been modified, including editedTranslatedSentence
      const isModified =
        editedTranslatedSentence !== translatedSentence && selectedOptions.length > 0 
  
      if (isModified) {
      
        if (previousSuggestion === null) {
          // Your existing logic for creating a new suggestion and corrections
          await createSuggestion(
            selectedTranslatedSentenceId,
            modalText,
            editedTranslatedSentence,
            otherErrorDescription,
            token
          );
  
          await Promise.all(
            selectedOptions.map(async (option) => {
              const word = option.word;
              const instanceData = {
                translatedSentenceId: selectedTranslatedSentenceId,
                wordSelected: word.text,
                wordIndex: word.index,
                errorType: option.type,
              };
              return createCorrection(instanceData, token);
            })
          );
        } else {
          // Your existing logic for updating suggestion and corrections
          if (previousSuggestion.translatedSentenceId === selectedTranslatedSentenceId) {
            await updateSuggestion(
              selectedTranslatedSentenceId,
              modalText,
              editedTranslatedSentence,
              otherErrorDescription,
              token
            );
    
          } else {
            await createSuggestion(
              selectedTranslatedSentenceId,
              modalText,
              editedTranslatedSentence,
              otherErrorDescription,
              token
            );
          }
          if (previousCorrection !== null) {
            await deleteUserCorrectionsTranslatedSentence(selectedTranslatedSentenceId, token);
          }
          await Promise.all(
            selectedOptions.map(async (option) => {
              const word = option.word;
              const instanceData = {
                translatedSentenceId: selectedTranslatedSentenceId,
                wordSelected: word.text,
                wordIndex: word.index,
                errorType: option.type,
              };
              return createCorrection(instanceData, token);
            })
          );
        }
        onSave();
        onHide();
        console.log("selectedTranslatedSentenceId: modal, ", selectedTranslatedSentenceId)
        loadPreviousSuggestionData(selectedTranslatedSentenceId);
      } else {
        // Handle the case when no field has been modified
        // For example, show an alert or set an error state
        setShowNoChangesAlert(true);
        console.warn('No changes have been made. Please make modifications before saving.');
        
      }
    } catch (error) {
      console.error('Error saving modal:', error);
      // Handle errors appropriately
    }
  };
  
  const handleModalClose = () => {
    setSelectedOptions([]);
    setPreviousSuggestion(null);
    onHide();
    onCloseWithoutSave(); 
  };

  useEffect(() => {
    const selectedOptions = Object.keys(selectedOptionsByType)
      .filter((key) => Array.isArray(selectedOptionsByType[key]))
      .flatMap((key) => selectedOptionsByType[key])
      .filter(Boolean);
    setSelectedOptions(selectedOptions);
  }, [selectedOptionsByType]);
  

  return (
    <>
      <Modal show={show} onShow={() => {
        loadSentenceAndTranslation(selectedTranslatedSentenceId);
        loadPreviousSuggestionData(selectedTranslatedSentenceId);
        loadPreviousCorrectionData(selectedTranslatedSentenceId);
        // Calculamos la altura del encabezado cuando el modal se muestra
        const header = document.querySelector(".modal-header");
        if (header) {
          const headerHeight = header.clientHeight;
          setHeaderHeight(headerHeight);
        }
      }} onHide={{}} className="fixed-modal" size="xl" >
        <Modal.Header className="modal-header">
          <Modal.Title>
    
            Identificar errores y editar traducción final: 
            <Row className="mx-2 my-2">
                  <Card border="secondary" >
                    <Card.Header className="h5">
                      Frase original a revisar:
                    </Card.Header>
                    <Row>
                      <Col>
                        <Form.Label className="sentence-font">
                          {originalSentence}
                        </Form.Label>
                      </Col>
                      <Col>
                        <Form.Label className="sentence-font">
                         {translatedSentence}
                        </Form.Label>
                      </Col>
                    </Row>
                  </Card>
                </Row>
              </Modal.Title>
      
        </Modal.Header>
        <Modal.Body className="modal-body" style={{ marginTop: headerHeight }}>
          <div className="form-container">
            <Form>
              <Form.Group>
                <Card border="secondary" className="accordion-container" >      
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Terminológico</Accordion.Header>
                        <Accordion.Body>
                        Este tipo de error se produce cuando la traducción no refleja con precisión los términos o conceptos médicos específicos, lo que puede afectar la comprensión adecuada del informe médico o dando información plenamente equivocada.<br/>
                        <br/><strong>Ejemplo:</strong><br/>
                        Original (inglés): The patient has <u>type II</u> diabetes mellitus<br/>
                        Traducción incorrecta (español): El paciente tiene diabetes mellitus <u>tipo I</u><br/>
                        Traducción correcta (español): El paciente tiene diabetes mellitus <u>tipo II</u><br/>
                        </Accordion.Body>
                      </Accordion.Item>
                     
                        <Card.Header className="card-header">
                          Seleccionar errores terminológicos encontrados en la traducción:
                        </Card.Header>
                      
                          <Card border="light" className="card-accordion">
                            <WordSelector
                              sentence={translatedSentence}
                              disabled={false}
                              variant="primary"
                              selectedOptions={selectedOptionsByType['terminological']}
                              initialSelectedWords={selectedWords}
                              onOptionClick={(option) => handleOptionClick(option, 'terminological')}
                            />
                          </Card>
                     
                    </Accordion>
                 </Card>
                 
                  <Card border="secondary" className="accordion-container">      
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Gramatical</Accordion.Header>
                          <Accordion.Body>
                          Este tipo de error se refiere a todos los tipos de error gramaticales, semánticos, léxicos, etc. que no representen correctamente el significado de la oración original al estar mal escritas o cambiando el significado original.<br/>
                          <br/><strong>Ejemplo:</strong><br/>
                          Original (inglés): The patient <u>explained</u> his complications to the doctor.<br/>
                          Traducción incorrecta (español): El paciente <u>explicado</u> sus complicaciones al médico.<br/>
                          Traducción correcta (español): El paciente <u>explicó</u> sus complicaciones al médico.
                          </Accordion.Body>
                        </Accordion.Item>
                        
                        <Card.Header className="card-header">
                          Seleccionar errores gramaticales encontrados en la traducción:
                        </Card.Header>
                        <Card border="light" className="card-accordion">
                            <WordSelector
                              sentence={translatedSentence}
                              disabled={false}
                              variant="success"
                              selectedOptions={selectedOptionsByType['grammatical']}
                              initialSelectedWords={selectedWords}
                              onOptionClick={(option) => handleOptionClick(option, 'grammatical')}

                            />
                        
                      </Card>
                      </Accordion>
                    </Card>
                    
                  
                  <Card border="secondary" className="accordion-container">      
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Funcional</Accordion.Header>
                        <Accordion.Body>
                        Ocurren cuando la traducción, si bien transmite el significado general del texto de origen, carece del flujo natural. Este tipo de error puede hacer parecer forzada la traducción y no representan como un nativo en el idioma diría la frase correspondiente.<br/>
                        <br/><strong>Ejemplo:</strong><br/>
                        Original (inglés): The patient received <u>oral</u> medication.<br/>
                        Traducción incorrecta (español): El paciente recibió medicación <u>por boca</u>. <br/>
                        Traducción correcta (español): El paciente recibió medicación <u>oral</u>.<br/>
                        </Accordion.Body>
                      </Accordion.Item>
                   
                        <Card.Header className="card-header">
                          Seleccionar errores funcionales encontrados en la traducción:
                        </Card.Header>
                          <Card border="light" className="card-accordion">
                            <WordSelector
                              sentence={translatedSentence}
                              disabled={false}
                              variant="warning"
                              selectedOptions={selectedOptionsByType['functional']}
                              initialSelectedWords={selectedWords}
                              onOptionClick={(option) => handleOptionClick(option, 'functional')}
                            
                            />
                          </Card>
                       
                    </Accordion>
                  </Card>
                  <Card border="secondary" className="accordion-container">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Otros errores</Accordion.Header>
                        <Accordion.Body>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                          aliquip ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                          culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                      </Accordion.Item>
                     
                        <Card.Header className="card-header">
                          Seleccionar errores de otro tipo encontrados en la traducción:
                        </Card.Header>
                    
                          <Card border="light" 
                          className="card-accordion">
                          <WordSelector
                            sentence={translatedSentence}
                            disabled={false}
                            variant="danger"
                            selectedOptions={selectedOptionsByType['other']}
                            initialSelectedWords={selectedWords}
                            onOptionClick={(option) => handleOptionClick(option, 'other')}
                            
                          />
                          <Row>
                            <Col>
                              <Form.Label className="h4" >
                                <Badge bg="secondary">
                                Describa el tipo de error encontrado:
                                </Badge>
                              </Form.Label>
                            </Col>
                            <Col sm="7">
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={otherErrorDescription}
                                onChange={(otherErrorEvent) => setOtherErrorDescription(otherErrorEvent.target.value)}
                              />
                            </Col>
                          </Row>                       
                        </Card>
                    
                    </Accordion>        
                    </Card>
                 
              </Form.Group>
              <Form.Group>
                <Row className="mx-2 my-2">
                  <Form.Label className="h5">Editar la traducción final:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editedTranslatedSentence}
                    onChange={(evento) => setEditedTranslatedSentence(evento.target.value)}
                  />
                </Row>
              </Form.Group>
              <Form.Group>
                <Row className="mx-2 my-2">
                  <Form.Label className="h5">Si tienes algún comentario adicional agregar aquí:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={modalText}
                    onChange={(change) => setModalText(change.target.value)}
                  />
                </Row>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
       
        <Modal.Footer className="modal-footer">
        <Alert
          variant="warning"
          show={showNoChangesAlert}
          onClose={() => setShowNoChangesAlert(false)}
          dismissible
        >
          Por favor modifique la traducción final antes de guardar.
        </Alert>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleModalSave}
            disabled={!modalText && selectedOptions.length === 0 && !editedTranslatedSentence}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  );
}

export default ModalSuggestions;
