import { useEffect, useState, useContext } from 'react';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import LeftViewer from '../Components/LeftViewer';
import RightViewer from '../Components/RightViewer';
import './translator.css';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Button, Card, Container, Col, Row, ButtonGroup, ProgressBar } from 'react-bootstrap';
import { getReportGroupReports , getPreviousUserTranslatedPhraseByReport} from '../utils/api';

function Translator() {
  const { token } = useContext(AuthContext);
  const { groupId } = useParams();
  const [reports, setReports] = useState(null);
  const [translatedreports, setTranslatedReports] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlightedPhraseIndex, setHighlightedPhraseIndex] = useState(null);

  // Track the total number of translated phrases in the group
  const [totalTranslatedPhrases, setTotalTranslatedPhrases] = useState(0);
  // Track how many translated phrases have been reviewed
  const [reviewedTranslatedPhrases, setReviewedTranslatedPhrases] = useState(0);

  const fetchReviewedTranslatedPhrases = async (translatedreports) => {
    try {
      let translatedPhrasesReviewed = 0;
      console.log("translatedPhrasesReviewed: ", translatedPhrasesReviewed);
          
      for (const translatedreport of translatedreports) {
        const response = await getPreviousUserTranslatedPhraseByReport(translatedreport.id, token);
        if (response) {
          console.log("largo de las UTP: ", response.length);
          translatedPhrasesReviewed += response.length;
        }
      }
      setReviewedTranslatedPhrases(translatedPhrasesReviewed);
    } catch (error) {
      console.error('Error fetching reviewed phrases:', error);
    }
  };  

  const fetchReportsForGroup = async (groupId, token) => {
    try {
      const response = await getReportGroupReports(groupId, token);
      setReports(response.reportData);
      setTranslatedReports(response.translatedreportData);

      // Calculate the total number of translated phrases in the group
      const totalPhrases = response.translatedreportData.reduce(
        (total, report) => total + report.translatedphrases.length,
        0
      );
      setTotalTranslatedPhrases(totalPhrases);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchReportsForGroup(groupId, token)
  }, [groupId]);

  // Calculate the overall progress as a percentage
  const progress = totalTranslatedPhrases
    ? (reviewedTranslatedPhrases / totalTranslatedPhrases) * 100
    : 0;

  const goToNextReport = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % reports.length;
      return nextIndex;
    });
   
  };

  const goToPreviousReport = () => {
    setCurrentIndex((prevIndex) => {
      const previousIndex = (prevIndex - 1 + reports.length) % reports.length;
      return previousIndex;
    });

  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [reports]);

  return (
    <>
      <NavBarReportSelection />
      <Container>
        <Card bg="secondary" border="light" style={{ marginTop: '4%' }}>   
          <Row>
            <Col>
              <Row>
                <Col>
                  <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
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
              </Row>
            </Col>

            <Col>
              {translatedreports !== null ? (
                <RightViewer
                  translatedreports={translatedreports}
                  currentIndex={currentIndex}
                  highlightedPhraseIndex={highlightedPhraseIndex}
                  setHighlightedPhraseIndex={setHighlightedPhraseIndex}
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
