import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getReportGroupsByUser, getUserReportGroup } from '../utils/api';

const ReportGroupSelection = () => {
  const { token } = useContext(AuthContext);
  const [reportGroups, setReportGroups] = useState([]);
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();

  const handleSelectButtonClick = (groupId) => {
    navigate(`/translator/${groupId}`);
  };

  const fetchUserReportGroupProgress = async (reportGroupId) => {
    try {
      const response = await getUserReportGroup(reportGroupId, token);
      if (response) {
        let progressReportGroup = response.progress;
        setProgress((prevProgress) => ({ ...prevProgress, [reportGroupId]: progressReportGroup }));
      }
      // Devuelve la promesa resultante
      return response;
    } catch (error) {
      console.error('Error fetching user report group:', error);
      throw error; // Propaga el error para que Promise.all lo maneje
    }
  };

  useEffect(() => {
    const fetchUserReportGroups = async () => {
      try {
        const response = await getReportGroupsByUser(token);
        setReportGroups(response);
      } catch (error) {
        console.error('Error fetching report groups:', error);
      }
    };

    fetchUserReportGroups();
  }, [token]);

  useEffect(() => {
    const fetchProgressForAllGroups = async () => {
      const promises = reportGroups.map((group) =>
        fetchUserReportGroupProgress(group.id)
      );

      await Promise.all(promises);
    };

    fetchProgressForAllGroups();
  }, [reportGroups, token]);
  
  return (
    <div>
      <NavBarReportSelection />
      <h3>Selecciona un grupo de reportes a traducir:</h3>
      <Container>
        <Row>
          <Col>
          <Card style={{ width: '35rem' }}>
              <Row>
                <Col xs={1}><Card.Text>Id</Card.Text></Col>
                <Col  xs={4}><Card.Text>Fecha de creación</Card.Text></Col>
                <Col  xs={4}><Card.Text>Reportes por traducir</Card.Text></Col>
                <Col  xs={3}><Card.Text>Seleccionar</Card.Text></Col>
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
                <Col><Card.Text>
                  {(group.createdAt).slice(8,10)+(group.createdAt).slice(4,8)+(group.createdAt).slice(0,4)}
                  </Card.Text></Col>
                  <Col><ProgressBar striped animated variant="success" now={progress[group.id]} label={`${Math.round(progress[group.id])}%`} />
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
