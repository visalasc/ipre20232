import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReportGroupSelection = () => {
  const { token } = useContext(AuthContext);
  const [reportGroups, setReportGroups] = useState([]);
  const navigate = useNavigate();

  const handleSelectButtonClick = (groupId) => {
    navigate(`/translator/${groupId}`);
  };
  
  useEffect(() => {
    const fetchUserReportGroups = async () => {
      try {
        if (!token) {
          console.error('Token not available.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reportgroups/user/${token}`, config);
       
        setReportGroups(response.data);
      } catch (error) {
        console.error('Error fetching report groups:', error);
      }
    };

    fetchUserReportGroups();
  }, [token]);

  return (
    <div>
      <NavBarReportSelection />
      <h3>Selecciona un grupo de reportes a traducir:</h3>
      <Container>
        <Row>
          <Col>
          <Card>
              <Row>
                <Col><Card.Text>Id</Card.Text></Col>
                <Col><Card.Text>Fecha de creación</Card.Text></Col>
                <Col><Card.Text>Reportes por traducir</Card.Text></Col>
                 <Col><Card.Text>Progreso</Card.Text></Col>
                <Col><Card.Text>Seleccionar</Card.Text></Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {reportGroups.map((group, index) => (
          <Row key={index}>
            <Col>
            <Card>
              <Row>
                <Col><Card.Text>{group.id}</Card.Text></Col>
                <Col><Card.Text>{group.createdAt}</Card.Text></Col>
                <Col><Card.Text>X</Card.Text></Col>
                <Col><Card.Text>{group.numberOfReportsToTranslate}</Card.Text></Col>
                  <Col>
                  <ProgressBar
                    variant="success"
                    now={(group.numberOfReportsTranslated / group.numberOfReportsToTranslate) * 100}
                    label={`${Math.round((group.numberOfReportsTranslated / group.numberOfReportsToTranslate) * 100)}%`}
                  />
                </Col>
                <Col>
                  
                  <Button variant="primary" onClick={() => handleSelectButtonClick(group.id)}>Seleccionar</Button>
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
