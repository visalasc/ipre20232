import React , { useState, useEffect } from 'react';
import { Button, Card, Container, Col, Row, ButtonGroup } from 'react-bootstrap';

function LeftViewer({ reports }) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextReport = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reports.length);
  };

  const goToPreviousReport = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reports.length) % reports.length);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [reports]);

  return (
    <>
          <ButtonGroup size="lg" className="mb-2">
            <Button variant="primary" onClick={goToPreviousReport}
          disabled={reports.length <= 1}>
            Anterior
          </Button>
      
            <Button variant="primary" onClick={goToNextReport} 
          disabled={reports.length <= 1}>
            Siguiente
          </Button>
          </ButtonGroup>
         
      <Card text="dark" 
      bg="light" border="secondary" 
      style={{ width: '23rem' , height: 'auto' , overflow: 'scroll'}}>
        <Card.Body>
          <Card.Header>Reporte original:</Card.Header>
            <Card.Text>ID: {reports[currentIndex].id}</Card.Text>
            <Card.Text>Created At: {reports[currentIndex].createdAt}</Card.Text>
            <Card.Text>Contenido: {reports[currentIndex].text}</Card.Text>
        </Card.Body>
      </Card>
      </>
  );
}

export default LeftViewer;
