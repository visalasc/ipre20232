import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom'; // Importa Redirect

const ReportGroupSelection = () => {
  const datasetDetails = [
    { creator: 'nombre creador',
    numberOfReportsToTranslate: 100,
    numberOfReportsTranslated: 50,
    createdAt: '2021-01-01',
     },
    { creator: 'nombre creador',
    numberOfReportsToTranslate: 120,
    numberOfReportsTranslated: 90,
    createdAt: '2021-01-01',
    }
  ];

  return (
    <div>
        <NavBarReportSelection />
      <h3>Selecciona un grupo de reportes a traducir:</h3>
      <Container>
        <Row>
            <Col>
            <Card>
                <Row>
                    <Col> <Card.Text>Usuario Creador</Card.Text></Col>
                    <Col> <Card.Text>Fecha de creación</Card.Text></Col>
                    <Col> <Card.Text>Reportes por traducir</Card.Text></Col>
                    <Col> <Card.Text>Reportes traducidos</Card.Text></Col>
                    <Col> <Card.Text>Progreso</Card.Text></Col>
                    <Col> <Card.Text>Seleccionar</Card.Text></Col>
                </Row>
            </Card>
            </Col>
           
        </Row>
        {datasetDetails.map((dataset, index) => (
       
          <Row key={index}>
            <Col>
              <Card>
                <Row>
                    <Col> <Card.Text>{dataset.creator}</Card.Text></Col>
                    <Col> <Card.Text>{dataset.createdAt}</Card.Text></Col>
                    <Col> <Card.Text>{dataset.numberOfReportsToTranslate}</Card.Text></Col>
                    <Col> <Card.Text>{dataset.numberOfReportsTranslated}</Card.Text></Col>
                     <Col> 
                        <ProgressBar 
                        variant="success" 
                        now={dataset.numberOfReportsTranslated/dataset.numberOfReportsToTranslate * 100} 
                        label={`${Math.round((dataset.numberOfReportsTranslated / dataset.numberOfReportsToTranslate) * 100)}%`}
                        />
                    </Col>
                    <Col> 
                        <Button variant="primary">Seleccionar</Button>
                        
                    </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default ReportGroupSelection;
