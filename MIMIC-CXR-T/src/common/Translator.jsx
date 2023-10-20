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
  const [reports, setReports] = useState(null);
  const [translatedreports, setTranslatedReports] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlightedPhraseIndex, setHighlightedPhraseIndex] = useState(null);

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
       
        setReports(response.data.reportData);
        setTranslatedReports(response.data.translatedreportData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (groupId) {
      fetchReportsForGroup();
    }
  }, [groupId]);

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
      <NavBarReportSelection />
      <Container >
        <Row>
          <Col>

        <Card bg= "secondary" border="light"
        style={{ marginTop: '4%'}} >
          <Row>
            <Col sm>
            <ButtonGroup size="lg" className="mb-2">
              <Button variant="primary" onClick={goToPreviousReport} disabled={reports === null || currentIndex === 0}>
                Anterior
              </Button>

              <Button variant="primary" onClick={goToNextReport} disabled={reports === null || currentIndex === reports.length - 1}>
                Siguiente
              </Button>
            </ButtonGroup>


            {reports !== null ? (
              <LeftViewer reports={reports} 
              currentIndex={currentIndex} 
              highlightedPhraseIndex={highlightedPhraseIndex}
              setHighlightedPhraseIndex={setHighlightedPhraseIndex}
   
              />
            ) : (
              <p>Loading reports...</p>
            )}
            </Col>
            {translatedreports !== null ? (
               <RightViewer translatedreports={translatedreports} 
               currentIndex={currentIndex}
               highlightedPhraseIndex={highlightedPhraseIndex}
               setHighlightedPhraseIndex={setHighlightedPhraseIndex}
    
               />
         
            ) : (
              <p>Loading translatedreports...</p>
            )}
          
          </Row>
        </Card>
        </Col>
        </Row>
      </Container>
     
    </>
  );
}

export default Translator;
