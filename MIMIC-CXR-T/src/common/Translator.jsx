import { useEffect, useState, useContext } from 'react';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
//import LeftViewer from '../Components/LeftViewerCard';
//import RightViewer from '../Components/RightViewerCard';
import './translator.css';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Button, Card, Container, Col, Row, ButtonGroup, ProgressBar } from 'react-bootstrap';
import { getReportGroupReports, getPreviousUserTranslatedPhraseByReport, updateUserReportGroupProgress } from '../utils/api';

function Translator() {
  const { token } = useContext(AuthContext);
  const { groupId } = useParams();
  const [reports, setReports] = useState(null);
  const [translatedreports, setTranslatedReports] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlightedPhraseIndex, setHighlightedPhraseIndex] = useState(null);
  const [totalTranslatedPhrases, setTotalTranslatedPhrases] = useState(0);
  const [reviewedTranslatedPhrases, setReviewedTranslatedPhrases] = useState(0);
  const [progress, setProgress] = useState(0); // Nuevo estado para el progreso

  const calculateProgress = () => {
    return totalTranslatedPhrases ? (reviewedTranslatedPhrases / totalTranslatedPhrases) * 100 : 0;
  };

  // Actualizar el progreso cuando cambian los reportes o las frases revisadas
  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
    updateProgressInDatabase(newProgress).catch(error => {
      console.error('Error updating progress:', error);
    });
  }, [reviewedTranslatedPhrases, totalTranslatedPhrases]);

    
  const fetchReviewedTranslatedPhrases = async (translatedreports) => {
    try {
      let translatedPhrasesReviewed = 0;
      for (const translatedReport of translatedreports) {
        const response = await getPreviousUserTranslatedPhraseByReport(translatedReport.id, token);
        if (response) {
          const numUserTranslatedPhrases = response.userTranslatedPhrases.length;
          translatedPhrasesReviewed += numUserTranslatedPhrases;
        }
      }
      setReviewedTranslatedPhrases(translatedPhrasesReviewed);
    } catch (error) {
      console.error('Error fetching reviewed phrases:', error);
    }
  };

  const updateProgressInDatabase = async (progressValue) => {
    try {
      await updateUserReportGroupProgress(progressValue, groupId, token);
      console.log("updateUserReportGroupProgress", progressValue, groupId);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsResponse = await getReportGroupReports(groupId, token);
        setReports(reportsResponse.reportData);
        setTranslatedReports(reportsResponse.translatedreportData);

        const totalPhrases = reportsResponse.translatedreportData.reduce(
          (total, report) => total + report.translatedphrases.length,
          0
        );
        setTotalTranslatedPhrases(totalPhrases);

        await fetchReviewedTranslatedPhrases(reportsResponse.translatedreportData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [groupId, token]);

  const triggerProgressRecalculation = async () => {
    await fetchReviewedTranslatedPhrases(translatedreports);
    const newProgress = calculateProgress();
    setProgress(newProgress);
    updateProgressInDatabase(newProgress).catch(error => {
      console.error('Error updating progress:', error);
    });
  };

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
      <Container>
        <Card border="light" style={{ marginTop: '4%', height: '800px'}}>
            <Row style={{ marginBottom: '1%'}}>
              <Col>
              <ProgressBar  striped animated className="custom-progress-bar" now={progress} label={`${Math.round(progress)}%`} variant="success" /> {/* Barra de progreso */}
       
                 </Col>
            </Row>
            <Row>
              <ButtonGroup size="sm" className="mb-2">
                <Button
                  variant="primary"
                  onClick={goToPreviousReport}
                  disabled={reports === null || currentIndex === 0}
                >
                  Anterior
                </Button>

                <Button
                  variant="primary"
                  onClick={goToNextReport}
                  disabled={reports === null || currentIndex === reports.length - 1}
                >
                  Siguiente 
                </Button>
              </ButtonGroup>
            </Row>
            <Row>
              <Col xs={5}>
                  {reports !== null ? (
                    <LeftViewer
                      reports={reports}
                      currentIndex={currentIndex}
                      highlightedPhraseIndex={highlightedPhraseIndex}
                      setHighlightedPhraseIndex={setHighlightedPhraseIndex}
                    />
                  ) : (
                    <p>Loading reports...</p>
                  )}
              </Col>

              <Col xs={7}>
                {translatedreports !== null ? (
                  <RightViewer
                    translatedreports={translatedreports}
                    currentIndex={currentIndex}
                    highlightedPhraseIndex={highlightedPhraseIndex}
                    setHighlightedPhraseIndex={setHighlightedPhraseIndex}
                    triggerProgressRecalculation={triggerProgressRecalculation}
                  />
                ) : (
                  <p>Loading translatedreports...</p>
                )}
              </Col>
            </Row>
        </Card>
      </Container>
    </>
  );
}

export default Translator;
