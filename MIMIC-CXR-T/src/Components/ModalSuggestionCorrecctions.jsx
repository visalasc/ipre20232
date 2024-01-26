import { useState, useContext, useEffect } from 'react';
import { Button, Modal, Form, Row, Card, Tab, Tabs, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import {
  getPreviousSuggestion,
  updateSuggestion,
  createSuggestion,
  findSentence,
  createCorrection,
  getPreviousUserCorrections,
  deleteUserCorrectionsTranslatedSentence,
} from '../utils/api';
import WordSelector from './WordSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

function ModalSuggestions({ show, onHide, selectedTranslatedSentenceId }) {
  const [modalText, setModalText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [previousSuggestion, setPreviousSuggestion] = useState(null);
  const [previousCorrection, setPreviousCorrection] = useState(null);
  const [translatedSentence, setTranslatedSentence] = useState('');
  const [originalSentence, setOriginalSentence] = useState('');
  const [editedTranslatedSentence, setEditedTranslatedSentence] = useState('');
  const { token } = useContext(AuthContext);
  const [selectedOptionsByType, setSelectedOptionsByType] = useState({});
  const [selectedWords, setSelectedWords] = useState([]);

  const loadSentenceAndTranslation = async (selectedTranslatedSentenceId) => {
    try {
      const sentenceAndTranslatedSentence = await findSentence(selectedTranslatedSentenceId);
      if (sentenceAndTranslatedSentence) {
        setOriginalSentence(sentenceAndTranslatedSentence.sentence.text);
        setTranslatedSentence(sentenceAndTranslatedSentence.translatedSentence.text);
        if (!editedTranslatedSentence) {
          setEditedTranslatedSentence(sentenceAndTranslatedSentence.translatedSentence.text);
        }
      }
    } catch (error) {
      console.error('Error loading sentence and translation:', error);
    }
  };

  const loadPreviousSuggestionData = async (selectedTranslatedSentenceId) => {
    try {
      const previousSuggestionResponse = await getPreviousSuggestion(selectedTranslatedSentenceId, token);
      if (previousSuggestionResponse) {
        setPreviousSuggestion(previousSuggestionResponse);
        setModalText(previousSuggestionResponse.comments);
        setEditedTranslatedSentence(previousSuggestionResponse.changesFinalTranslation);
      } else {
        setModalText('');
      }
    } catch (error) {
      console.error('Error loading previous suggestion data:', error);
      setModalText('');
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
      if (previousSuggestion === null) {
        await createSuggestion(
          selectedTranslatedSentenceId,
          modalText,
          editedTranslatedSentence,
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
        if (previousSuggestion.translatedSentenceId === selectedTranslatedSentenceId) {
          await updateSuggestion(selectedTranslatedSentenceId, modalText, editedTranslatedSentence, token);
        } else {
          await createSuggestion(selectedTranslatedSentenceId, modalText, token);
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

      onHide();
    } catch (error) {
      console.error('Error saving modal:', error);
      // Handle errors appropriately
    }
  };

  const handleModalClose = () => {
    setSelectedOptions([]);
    setPreviousSuggestion(null);
    onHide();
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
      }} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Identificar errores y editar traducción final:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <div>
                <Row>
                  <Card border="light" style={{ width: 'auto', padding: '6px', margin: '3px' }}>
                    <Form.Label className="h6">Frase original a revisar:</Form.Label>
                    <Form.Label className="h7">{originalSentence}</Form.Label>
                  </Card>
                </Row>
                <Row>
                  <Tabs
                    defaultActiveKey="grammatical"
                    onSelect={(key) => handleOptionClick(key)}
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="grammatical" title={
                      <OverlayTrigger
                        key="grammatical-tooltip"
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-grammatical`}>
                            Descripción de errores gramaticales.
                          </Tooltip>
                        }
                      >
                        <div>
                          <span>Grammatical</span>
                          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginLeft: '5px' }} />
                        </div>
                      </OverlayTrigger>
                    }>
                      <Card border="success" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                        <Form.Label className="h6" >Seleccionar errores gramaticales encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedSentence}
                          disabled={false}
                          variant="success"
                          selectedOptions={selectedOptionsByType['grammatical']}
                          initialSelectedWords={selectedWords}
                          onOptionClick={(option) => handleOptionClick(option, 'grammatical')}

                        />
                      </Card>
                    </Tab>

                    <Tab eventKey="terminological" title={
                      <OverlayTrigger
                        key="terminological-tooltip"
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-terminological`}>
                            Descripción de errores terminológicos.
                          </Tooltip>
                        }
                      >
                        <div>
                          <span>Terminological</span>
                          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginLeft: '5px' }} />
                        </div>
                      </OverlayTrigger>
                    }>
                      <Card border="primary" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                        <Form.Label className="h6" >Seleccionar errores terminológicos encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedSentence}
                          disabled={false}
                          variant="primary"
                          selectedOptions={selectedOptionsByType['terminological']}
                          initialSelectedWords={selectedWords}
                          onOptionClick={(option) => handleOptionClick(option, 'terminological')}
                         
                        />
                      </Card>
                    </Tab>

                    <Tab eventKey="functional" title={
                      <OverlayTrigger
                        key="functional-tooltip"
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-functional`}>
                            Descripción de errores funcionales.
                          </Tooltip>
                        }
                      >
                        <div>
                          <span>Functional</span>
                          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginLeft: '5px' }} />
                        </div>
                      </OverlayTrigger>
                    }>
                      <Card border="warning" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                        <Form.Label className="h6" >Seleccionar errores funcionales encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedSentence}
                          disabled={false}
                          variant="warning"
                          selectedOptions={selectedOptionsByType['functional']}
                          initialSelectedWords={selectedWords}
                          onOptionClick={(option) => handleOptionClick(option, 'functional')}
                         
                        />
                      </Card>
                    </Tab>

                    <Tab eventKey="other" title={
                      <OverlayTrigger
                        key="other-tooltip"
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-other`}>
                            Descripción de otros errores.
                          </Tooltip>
                        }
                      >
                        <div>
                          <span>Other</span>
                          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginLeft: '5px' }} />
                        </div>
                      </OverlayTrigger>
                    }>
                      <Card border="danger" style={{ width: 'auto', padding: '5px', margin: '2px' }}>
                        <Form.Label className="h6" >Seleccionar errores de otro tipo encontrados en la traducción:</Form.Label>
                        <WordSelector
                          sentence={translatedSentence}
                          disabled={false}
                          variant="danger"
                          selectedOptions={selectedOptionsByType['other']}
                          initialSelectedWords={selectedWords}
                          onOptionClick={(option) => handleOptionClick(option, 'other')}
                          
                        />
                        <Form.Label className="h6" >Describa el tipo de error encontrado:</Form.Label>
                      </Card>
                    </Tab>
                  </Tabs>
                </Row>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="h6">Editar la traducción final:</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editedTranslatedSentence}
                onChange={(evento) => setEditedTranslatedSentence(evento.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="h6">Si tienes algún comentario adicional agregar aquí:</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
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
