import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ReportGroupSelection = () => {
  const datasetDetails = [
    { title: 'Dataset 1', description: 'Descripción del Dataset 1' },
    { title: 'Dataset 2', description: 'Descripción del Dataset 2' },
    // ... Puedes agregar más datasets
  ];

  return (
    <div>
      <h2>Selecciona un Grupo de Informes</h2>
      <Container>
        {datasetDetails.map((dataset, index) => (
          <Row key={index}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>{dataset.title}</Card.Title>
                  <Card.Text>{dataset.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default ReportGroupSelection;
