import { useState, useContext, useEffect } from 'react';
import { Tab, Nav, Col, Row } from 'react-bootstrap';
import CreateReportGroup from '../Components/CreateReportGroup';
import TableDisplayReports from '../Components/TableDisplayReportGroup';
import { AuthContext } from '../auth/AuthContext';
import { getAllReportGroupReports, createReportGroups, createUserReportGroups } from '../utils/api';
import NavAdmin from '../Components/NavAdmin';
import CreateUserReportGroup from '../Components/CreateUserReportGroup';
import DisplayUsers from '../Components/TableDisplayUsers';
import ModalUploadReports from '../Components/CreateJsonBatchReports';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Signup from '../profile/Signup';
import './admin.css';

function Admin() {
  const { token } = useContext(AuthContext);
  const [reportGroupReports, setReportGroupReports] = useState([]);
  const [currentView, setCurrentView] = useState('view1');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Usa useNavigate para gestionar la navegación

  useEffect(() => {
    const getReportGroupReports = async () => {
      try {
        setLoading(true);
        const response = await getAllReportGroupReports(token);
        setReportGroupReports(response);
      } catch (error) {
        console.error('Error fetching reportGroupReports:', error);
      } finally {
        setLoading(false);
      }
    };

    getReportGroupReports();
  }, [token]);

  const handleCreateReportGroup = async (reportGroupData) => {
    try {
      setLoading(true);
      const response = await createReportGroups(reportGroupData, token);
      //('Report group created:', response);
      setReportGroupReports([...reportGroupReports, response.reportgroup]);
      setCurrentView('view1');
      // Muestra notificación Toast de éxito
    } catch (error) {
      console.error('Error creating report group:', error);
      // Muestra notificación Toast de error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserReportGroup = async (reportGroupId, userIds) => {
    try {
      setLoading(true);
      const response = await createUserReportGroups(reportGroupId, userIds, token);
      //console.log('user report group created:', response);

    } catch (error) {
      console.error('Error creating user report groups:', error);
      // Muestra notificación Toast de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if the user is not an admin
    if (user && user.role !== 'Admin') {
      navigate("/access-denied");
    }
  }, [user, navigate]);


  return (
    <>
    <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
      <Row className="container-admin">
        <NavAdmin />
      </Row>
      
        <Row>
          <Col sm={3}>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="first">Ver o eliminar grupos de reportes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Crear nuevos grupos de reportes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Asociar usuario a grupo de reportes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">Ver lista de usuarios registrados</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fifth">Cargar json con batch de reportes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="sixth">Registro de usuarios</Nav.Link>
              </Nav.Item>
          
            </Nav>
          </Col>
          <Col sm={9} >
            <Tab.Content>
              <Tab.Pane eventKey="first"><TableDisplayReports reportGroupReports={reportGroupReports} /></Tab.Pane>
              <Tab.Pane eventKey="second"><CreateReportGroup onCreateReportGroup={handleCreateReportGroup} /></Tab.Pane>
              <Tab.Pane eventKey="third"> 
                <CreateUserReportGroup onCreateUserReportGroup={handleCreateUserReportGroup} reportGroupReports={reportGroupReports}/>
              </Tab.Pane>
              <Tab.Pane eventKey="fourth"><DisplayUsers /></Tab.Pane>
              <Tab.Pane eventKey="fifth"><ModalUploadReports /></Tab.Pane>
              <Tab.Pane eventKey="sixth"><Signup /></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
}

export default Admin;
