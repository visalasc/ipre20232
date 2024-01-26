import { Nav, Container, Row, Col } from 'react-bootstrap';
import './sidebar.css';

function Sidebar({ setCurrentView }) {

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light sidebar">
          <Nav className="flex-column">
            <Nav.Link onClick={() => setCurrentView('view1')}>Ver o eliminar grupos de reportes</Nav.Link>
            <Nav.Link onClick={() => setCurrentView('view2')}>Crear nuevos grupos de reportes</Nav.Link>
            <Nav.Link onClick={() => setCurrentView('view3')}>Editar reportes en grupos de reportes</Nav.Link>
            <Nav.Link onClick={() => setCurrentView('view4')}>Asociar usuario a grupo de reportes</Nav.Link>
            <Nav.Link onClick={() => setCurrentView('view5')}>Ver lista de usuarios registrados</Nav.Link>
            <Nav.Link onClick={() => setCurrentView('view6')}>Cargar json con batch de reportes</Nav.Link>
            <Nav.Link onClick={() => setCurrentView('view7')}>Revisar conflictos entre sugerencias</Nav.Link>
      
          </Nav>
        </Col>
        <Col md={9} className="content">
          {/* ... your content */}
        </Col>
      </Row>
    </Container>
  );
}

export default Sidebar;
