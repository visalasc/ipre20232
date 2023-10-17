import React , { useState, useEffect } from 'react';
import { Button, Card, Container, Col, Row } from 'react-bootstrap';

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
    <div className="container mt-4">
      <Container>
        <Row>
          <Col>
            <Button variant="primary" onClick={goToPreviousReport}
          disabled={reports.length <= 1}>
            Anterior
          </Button>
          </Col>
          <Col>
            <Button variant="primary" onClick={goToNextReport} 
          disabled={reports.length <= 1}>
            Siguiente
          </Button>
          </Col>
        </Row>
      </Container>
      <Card border="secondary" style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Header>Reporte original:</Card.Header>
            <Card.Text>ID: {reports[currentIndex].id}</Card.Text>
            <Card.Text>Created At: {reports[currentIndex].createdAt}</Card.Text>
            <Card.Text>Contenido: {reports[currentIndex].text}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LeftViewer;
