import React, { useEffect, useState, useContext} from 'react';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import './translator.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Button, Card, Container, Col, Row, ButtonGroup } from 'react-bootstrap';

function Translator() {
  const { token } = useContext(AuthContext);
  const { groupId } = useParams();  
  console.log('groupId:', groupId);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchReportsForGroup = async () => {
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
          `${import.meta.env.VITE_BACKEND_URL}/reportgroupreports/${groupId}`, config);
       
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (groupId) {
      fetchReportsForGroup();
    }
    console.log('translator reports:', reports);

  }, [groupId]);
  
  return (
    <>
      <NavBarReportSelection />
      <Container >
        <Row>
          <Col>
        <Card bg= "secondary" border="light"
        style={{ marginTop: '4%'}} >
          <Row>
            <Col sm>
            {reports !== null ? (
              <LeftViewer reports={reports} />
            ) : (
              <p>Loading reports...</p>
            )}
            </Col>
            <RightViewer />
          </Row>
        </Card>
        </Col>
        </Row>
      </Container>
     
    </>
  );
}

export default Translator;
