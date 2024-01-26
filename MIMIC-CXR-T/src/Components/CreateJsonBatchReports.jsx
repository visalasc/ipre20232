import { useState, useContext } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { createReportBatch } from '../utils/api';

const ModalUploadReport = () => {
  const [showModal, setShowModal] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const { token } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoadFile = () => {
    // Lógica para activar la entrada de archivos
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', handleFileInputChange);
    fileInput.click();
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e.target.error);
      reader.readAsText(file);
    });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileContent = await readFileAsync(file);
        setFileContent(fileContent);
        handleShowModal();
      } catch (error) {
        console.error('Error reading file:', error);
        handleCloseModal();  // Cierra el modal en caso de error
      }
    }
  };

const handleAccept = async (event) => {
  event.preventDefault();
  try {
    await createReportBatch(fileContent, token);
    handleCloseModal(); 
    setShowAlert(true);   
  } catch (error) {
    console.error('Error saving file content:', error);
    console.error('Error details:', error.response.data); // Imprime detalles específicos del error
    
    // Puedes mostrar un mensaje de error al usuario si lo deseas
  }
};

  return (
    <>
      <Button variant="primary" onClick={handleLoadFile}>
        Cargar Reporte
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Contenido del archivo JSON:</p>
          <pre>{fileContent}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
        {/* Alerta para mostrar que la operación fue exitosa */}
        <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
          Batch creado exitosamente
        </Alert>
    </>
  );
};

export default ModalUploadReport;
