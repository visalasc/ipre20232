import { useState, useEffect, useContext } from 'react';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import Viewer from '../Components/Viewer';
import './translator.css';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Container, Col, Row, ProgressBar, Alert, 
Tooltip, OverlayTrigger } from 'react-bootstrap';
import { getReportGroupReports, getUserTranslatedSentencesByReportGroup, 
  updateUserReportGroupProgress, checkIsReportCompleted } from '../utils/api';

function Translator() {
  const { token } = useContext(AuthContext);
  const { groupId } = useParams(); //aqui iria el reportprogress si va en url
  const [reports, setReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressTranslatedSentences, setProgressTranslatedSentences] = useState(0);
  const [reviewedTranslatedSentences, setReviewedTranslatedSentences] = useState(0);
  const [totalTranslatedSentences, setTotalTranslatedSentences] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [individualReportCompletedAlert, setIndividualReportCompletedAlert] = useState(false); // Nuevo estado para alerta de reporte individual completado
 
  const calculateProgressTranslatedSentences = () => {
    return totalTranslatedSentences ? (reviewedTranslatedSentences / totalTranslatedSentences) * 100 : 0;
  };

  useEffect(() => {
    const newProgress = calculateProgressTranslatedSentences();
    setProgressTranslatedSentences(newProgress);
    updateProgressTranslatedSentencesInDatabase(newProgress).catch(error => {
      console.error('Error updating progress:', error);
    });
  }, [reviewedTranslatedSentences, totalTranslatedSentences]);

  const calculateTotalTranslatedSentences = () => {
    let total = 0;
    reports.forEach((report) => {
      const translatedSentences = report.report.translated_sentences;
      Object.keys(translatedSentences).forEach((type) => {
        total += translatedSentences[type].filter((sentence) => sentence.text.trim() !== "").length;
      });
    });
    return total;
  };

  const updateProgressTranslatedSentencesInDatabase = async (progressTranslatedSentencesValue) => {
    try {
      await updateUserReportGroupProgress(progressTranslatedSentencesValue, groupId, token);
      } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsResponse = await getReportGroupReports(groupId, token);
        setReports(reportsResponse);
        fetchUserTranslatedSentences(groupId);
    
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [groupId, token]);

  const triggerProgressTranslatedSentencesRecalculation = async () => {
    await fetchUserTranslatedSentences(groupId);
    const newProgressTranslatedSentences = calculateProgressTranslatedSentences();
    setProgressTranslatedSentences(newProgressTranslatedSentences);
    updateProgressTranslatedSentencesInDatabase(newProgressTranslatedSentences).catch(error => {
      console.error('Error updating progress:', error);
    });
  };

  const fetchUserTranslatedSentences = async (groupId) => {
    try {
      let translatedPhrasesReviewed = 0;
      const response = await getUserTranslatedSentencesByReportGroup(groupId, token);
      if (response) {
          const numUserTranslatedPhrases = response.length;
          translatedPhrasesReviewed += numUserTranslatedPhrases;
        }
        setReviewedTranslatedSentences(translatedPhrasesReviewed);
      console.log("translatedPhrasesReviewed: ", translatedPhrasesReviewed)
    } catch (error) {
      console.error('Error fetching reviewed phrases:', error);
    }
  };
  
  const goToNextReport = async () => {
    try {
      const nextIndex = (currentIndex + 1) % reports.length;
      const isCurrentReportCompleted = await checkIsReportCompleted(reports[currentIndex].report.reportId, token);
      if (isCurrentReportCompleted.completed) {
        setCurrentIndex(nextIndex);
        setIndividualReportCompletedAlert(true); // Mostrar alerta para reporte individual completado
        setShowAlert(false);
      } 
      else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error checking report completion:', error);
    }
  };

  const goToPreviousReport = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reports.length) % reports.length);
  };

  useEffect(() => {
    setTotalTranslatedSentences(calculateTotalTranslatedSentences());
  }, [reports]);
  
  const renderTooltipProgressBarTranslatedSentences = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Progreso de oraciones traducidas del batch
    </Tooltip>
  );

  return (
    <>
      <NavBarReportSelection />
      <Container style={{ marginTop: '3%' }}>
 
        {/* Alerta para mostrar si el reporte no está completo */}
        <Row style={{ marginTop: '2%' }}>
          <Col>
            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
              El reporte actual no está completo. Por favor, revisa todas las oraciones antes de avanzar.
            </Alert>
          </Col>
        </Row>

       {/* Alerta para mostrar si un reporte individual está completado */}
       <Row style={{ marginTop: '2%' }}>
        <Col>
          <Alert show={individualReportCompletedAlert} variant="success" onClose={() => setIndividualReportCompletedAlert(false)} dismissible>
            ¡El reporte actual ha sido completado!
          </Alert>
        </Col>
      </Row>

      <Row>
          <Col>
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipProgressBarTranslatedSentences}
            >
            <ProgressBar striped animated className="tphrases-progress-bar" 
            now={progressTranslatedSentences} 
            label={`(${reviewedTranslatedSentences}/${totalTranslatedSentences})  `+`${Math.round(progressTranslatedSentences)}%`} 
            variant={
              Math.round(progressTranslatedSentences) <= 33 ? "danger" :
                Math.round(progressTranslatedSentences) <= 99 ? "warning" :
                "success"
            } 
            />
          </OverlayTrigger>
          </Col>
        </Row>

      <Row>
          <Col >
            {(reports.length > 0) ? (
              <Viewer
                groupId={groupId}
                report={reports[currentIndex]}
                triggerProgressTranslatedSentencesRecalculation={triggerProgressTranslatedSentencesRecalculation}
                reports={reports}
                currentIndex={currentIndex}
                checkIsReportCompleted={checkIsReportCompleted}
                goToNextReport={goToNextReport}
                goToPreviousReport={goToPreviousReport}
                />
            ) : (
              <p>Loading translated sentences...</p>
            )}
          </Col>
        </Row>
       
      </Container>
    </>
  );
}

export default Translator;