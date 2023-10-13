import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal, Card } from 'react-bootstrap';

const NavBarReportSelection = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoadFile = () => {
    // Lógica para cargar archivos
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">My App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={handleShowModal}>Abrir Modal</Nav.Link>
        </Nav>
        <Button variant="primary" onClick={handleLoadFile}>
          Cargar Archivo
        </Button>
      </Navbar.Collapse>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Contenido del Modal */}
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default NavBarReportSelection;
