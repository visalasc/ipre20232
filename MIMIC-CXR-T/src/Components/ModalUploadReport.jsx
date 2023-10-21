import React, { useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

const ModalUploadReport = () => {

  //modal carga archivos
  const [showModal, setShowModal] = useState(false);
  const [fileContent, setFileContent] = useState('');

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoadFile = () => {
    // Logic to trigger file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.addEventListener('change', handleFileInputChange);
    fileInput.click();
  };
  
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        setFileContent(fileContent);  // Store file content
        handleShowModal();  // Show the modal with file content
      };
      reader.readAsText(file);
    }
  };
  

  const { token } = useContext(AuthContext);

  const handleAccept = async (event) => {
    event.preventDefault();
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/reports`, {
      text: fileContent,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then((response) => {
          console.log('File content saved:', response.data);
          handleCloseModal();  // Close the modal after successfully saving
        })
       
    . catch((error) => {
      console.error('Error saving file content:', error);
    });
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
          <p>File Content:</p>
          <pre>{fileContent}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAccept}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
};

export default ModalUploadReport;
