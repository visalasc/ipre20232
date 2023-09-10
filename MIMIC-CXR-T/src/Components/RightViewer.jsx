import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Modal, Toast, Card } from 'react-bootstrap';

function RightViewer() {
  const [editableText, setEditableText] = useState([
    {
      id: '1',
      text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      editedText: '',
      isEditing: false,
    },
    {
      id: '2',
      text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      editedText: '',
      isEditing: false,
    },
    {
      id: '3',
      text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      editedText: '',
      isEditing: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [toasts, setToasts] = useState([]); // Almacena las sugerencias como objetos

  const handleEditClick = (id) => {
    const updatedText = editableText.map((item) => {
      if (item.id === id) {
        return { ...item, isEditing: true, editedText: item.text };
      }
      return item;
    });
    setEditableText(updatedText);
  };

  const handleSaveClick = (id) => {
    const updatedText = editableText.map((item) => {
      if (item.id === id) {
        return { ...item, isEditing: false, text: item.editedText };
      }
      return item;
    });
    setEditableText(updatedText);
  };

  const handleSuggestionClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuggestionSubmit = () => {
    // Agregar la sugerencia como un objeto al array de toasts
    setToasts([...toasts, { id: Date.now(), suggestion }]);
    setShowModal(false);
    setSuggestion(''); // Limpiar el campo de sugerencia
  };

  return (
  <>
    <div className="container mt-4">
      <Card border="secondary" style={{ width: '25rem' }}>
        <Card.Header>Pre-traducción:</Card.Header>
        <Card.Body>
          <Card.Title>Warning Card Title</Card.Title>
          {editableText.map((item) => (
            <Card.Text key={item.id}>
              {item.isEditing ? (
                <>
                  <input
                    type="text"
                    value={item.editedText}
                    onChange={(e) => {
                      const updatedText = e.target.value;
                      const updatedEditableText = editableText.map((textItem) => {
                        if (textItem.id === item.id) {
                          return { ...textItem, editedText: updatedText };
                        }
                        return textItem;
                      });
                      setEditableText(updatedEditableText);
                    }}
                  />
                  <button onClick={() => handleSaveClick(item.id)}>Guardar</button>
                </>
              ) : (
                <>
                  <span>
                    {item.text.split(' ').map((word, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: item.editedText.includes(word) ? 'yellow' : 'transparent',
                        }}
                      >
                        {index > 0 ? ' ' : ''}
                        {word}
                      </span>
                    ))}
                  </span>
                  <Button variant="light" onClick={() => handleEditClick(item.id)}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </Button>
                  <Button variant="warning" onClick={() => handleSuggestionClick(item.id)}>
                    <FontAwesomeIcon icon={faLightbulb} />
                  </Button>
                </>
              )}
            </Card.Text>
          ))}
        </Card.Body>
      </Card>

      {/* Modal para sugerencias */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Escribe tu sugerencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows="4"
            cols="50"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSuggestionSubmit}>
            Enviar Sugerencia
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
  <div>
      <Col md={12} style={{ marginLeft: '15px'}}> {/* Ajusta el tamaño de la columna según tus necesidades */}
          <Row style={{ marginTop: '15px'}}>
            <Col>
              {/* Aquí mapea las sugerencias en Toasts */}
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  onClose={() => {
                    // Eliminar la Toast cuando se cierre
                    const updatedToasts = toasts.filter((t) => t.id !== toast.id);
                    setToasts(updatedToasts);
                  }}
                  style={{ marginTop: '10px' }} // Agrega margen superior entre las Toasts
                >
                  <Toast.Header>
                    <strong className="mr-auto">Sugerencia</strong>
                  </Toast.Header>
                  <Toast.Body>{toast.suggestion}</Toast.Body>
                </Toast>
              ))}
            </Col>
          </Row>
        </Col>
    </div>
    </>
  );
}

export default RightViewer;
