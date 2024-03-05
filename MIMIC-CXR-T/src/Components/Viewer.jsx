import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Table, ToggleButton, Form, Container, Row, Col ,
OverlayTrigger, Tooltip, ProgressBar, Badge, Button, ButtonGroup} from 'react-bootstrap';
import './viewer.css';
import ModalSuggestions from './ModalSuggestionCorrecctions';
import { createUserTranslatedSentence, getPreviousUserTranslatedSentence, 
  updateUserTranslatedSentence, updateReportProgress } from '../utils/api';
import { AuthContext } from '../auth/AuthContext';

function Viewer({ groupId, report, triggerProgressTranslatedSentencesRecalculation, reports, currentIndex, checkIsReportCompleted, goToNextReport, goToPreviousReport}) {
  const [translatedSentencesState, setTranslatedSentencesState] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranslatedSentenceId, setSelectedTranslatedSentenceId] = useState(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState(true);
  const [progressReports, setProgressReports] = useState(0);
  const [completedReports, setCompletedReports] = useState(0);
  const { token } = useContext(AuthContext);

  const [uniqueTranslatedSentenceIds, setUniqueTranslatedSentenceIds] = useState(new Set());
  const [totalReviewedSentences, setTotalReviewedSentences] = useState(0);
  const [totalSentencesByReport, setTotalSentencesByReport] = useState({});

  const calculateProgressByReports = () => {
    return reports.length ? (completedReports / reports.length) * 100 : 0;
  };

  const calculateProgressCurrentReport = () => {
    const translatedSentencesCount = Object.values(translatedSentencesState).filter((value) => value !== null).length;
    return totalSentencesByReport[report.reportId] ? (translatedSentencesCount / totalSentencesByReport[report.reportId]) * 100 : 0;
  };
  
  const updateProgressForCurrentReport = () => {
    const translatedSentencesCount = Object.values(translatedSentencesState).filter((value) => value !== null).length;
    setTotalReviewedSentences(translatedSentencesCount);
  };

  const calculateCompletedReports = async () => {
    const reportsCompleted = reports.map((report) => ({
      reportId: report.report.reportId,
      completed: false
    }));
    for (const report of reportsCompleted) {
      try {
        const isReportCompleted = await checkIsReportCompleted(report.reportId, token);
        if (isReportCompleted.completed) {
          report.completed = true;
        }
      } catch (error) {
        console.error('Error checking report completion:', error);
      }
    }
    const completedCount = reportsCompleted.filter(report => report.completed).length;
    return {
      reportsCompleted,
      completedCount
    };
  };  

  const renderTooltipProgressBarReports = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Progreso de reportes en el batch
    </Tooltip>
  );

  const updateProgressReportInDatabase = async (newProgressByReports) => {
    try {
      await updateReportProgress(newProgressByReports, groupId, token);
      } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
    try {
      calculateCompletedReports().then(result => {
      setCompletedReports(result.completedCount);
      });
      const newProgressByReports = calculateProgressByReports();
      setProgressReports(newProgressByReports);
      updateProgressReportInDatabase(newProgressByReports).catch(error => {
        console.error('Error updating progress:', error);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    };

    fetchData();
  }, [completedReports, reports]);

  useEffect(() => {
    if (report) {
      // Reset relevant state variables
      setTranslatedSentencesState({});
      setUniqueTranslatedSentenceIds(new Set());
  
      const updatedState = {};
      Object.keys(report.report.translated_sentences).forEach((type) => {
        report.report.translated_sentences[type].forEach((translatedsentence) => {
          loadUserTranslatedPhrase(translatedsentence);
        });
      });
  
      // Actualizar el estado después de cargar todas las traducciones
      setTranslatedSentencesState((prev) => ({ ...prev, ...updatedState }));
    }
  }, [report, token]);

  const loadUserTranslatedPhrase = async (translatedsentence) => {
      try {
        const response = await getPreviousUserTranslatedSentence(translatedsentence.id, token);
        console.log("response UTP: ", response);
        setUniqueTranslatedSentenceIds((prevIds) => new Set([...prevIds, translatedsentence.id]));

        if (response) {
          if (response.isSelectedCheck) 
            setTranslatedSentencesState(prev => ({ ...prev, [translatedsentence.id]: true }));
          if (response.isSelectedTimes) 
            setTranslatedSentencesState(prev => ({ ...prev, [translatedsentence.id]: false }));
        }
        else {
            setTranslatedSentencesState(prev => ({ ...prev, [translatedsentence.id]: null }));
        }
      }
       catch (error) {
        // Manejar el error, por ejemplo, mostrar un mensaje de error o registrar en la consola
        console.error(`no encontrada UTP de tphrase id: ${translatedsentence.id}:`, error);
        setUniqueTranslatedSentenceIds((prevIds) => new Set([...prevIds, translatedsentence.id]));

      }
  }

  const handleTranslatedSentenceClick = async (translatedSentences, check) => {
      if (check) {
        console.log("translatedSentences: ",translatedSentences);
        if (translatedSentences.id in translatedSentencesState) {
          await updateUserTranslatedSentence(translatedSentences.id, true, false, token);
          console.log("updateUserTranslatedSentence frase:", translatedSentences.id);
        } else {
          await createUserTranslatedSentence(translatedSentences.id, true, false, token);
          console.log("createUserTranslatedSentence frase:", translatedSentences.id);
        }
        setTranslatedSentencesState(prev => ({ ...prev, [translatedSentences.id]: true }));
        triggerProgressTranslatedSentencesRecalculation();

        console.log("triggerProgressTranslatedSentencesRecalculation create UTP");

        calculateCompletedReports().then(result => {
          setCompletedReports(result.completedCount);
          });
        const newProgressByReports = calculateProgressByReports();
        console.log("newProgressByReports22: ", newProgressByReports)
        setProgressReports(newProgressByReports);

      } else {
        //chequear si modal fue guardado, debe existir una sugerencia creada para q se cree UTP false, true. si no deberia crearse como false false, para q no marque el boton de times
        if (translatedSentences.id in translatedSentencesState) {
          await updateUserTranslatedSentence(translatedSentences.id, false, true, token);
          console.log("updateUserTranslatedSentence frase:", translatedSentences.id);
        } else {
          await createUserTranslatedSentence(translatedSentences.id, false, true, token);
          console.log("createUserTranslatedSentence frase:", translatedSentences.id);
        }
        setTranslatedSentencesState(prev => ({ ...prev, [translatedSentences.id]: false }));
        setSelectedTranslatedSentenceId(translatedSentences.id);
        setIsModalOpen(true);
        triggerProgressTranslatedSentencesRecalculation();

        console.log("triggerProgressTranslatedSentencesRecalculation update UTP");
        calculateCompletedReports().then(result => {
          setCompletedReports(result.completedCount);
          });
        const newProgressByReports = calculateProgressByReports();
        console.log("newProgressByReports22: ", newProgressByReports)
        setProgressReports(newProgressByReports);
        
    } triggerProgressTranslatedSentencesRecalculation();
    updateProgressForCurrentReport(); // Update the totalReviewedSentences

    
  };

  const renderTooltipProgressBarTranslatedSentences = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Progreso de oraciones traducidas del batch
    </Tooltip>
  );
  
  useEffect(() => {
    // Calculate totalSentencesReport using uniqueTranslatedSentenceIds
    console.log("uniqueTranslatedSentenceIds: ", uniqueTranslatedSentenceIds);
    console.log("uniqueTranslatedSentenceIds.size: ", uniqueTranslatedSentenceIds.size);
  
    // Update total sentences count for the current report
    setTotalSentencesByReport((prev) => ({
      ...prev,
      [report.reportId]: uniqueTranslatedSentenceIds.size,
    }));
  
    updateProgressForCurrentReport(); // Initial update when report is loaded
  }, [uniqueTranslatedSentenceIds, report]);

  function ReportTable({ report }) {
    const renderRows = (report) => {
      const originalSentences = report.sentences;
      const translatedSentences = report.translated_sentences;
      if (!originalSentences || !translatedSentences) {
        return null;
      }

      const types = ["background", "findings", "impression"];
      return types.map((type) => {
        // Filtra las oraciones vacías para este tipo
        const nonEmptyOriginalSentences = originalSentences[type].filter((sentence) => sentence.text.trim() !== "");
        const nonEmptyTranslatedSentences = translatedSentences[type].filter((sentence) => sentence.text.trim() !== "");
        // Si no hay oraciones no vacías, no renderiza nada para este tipo
        if (nonEmptyOriginalSentences.length === 0 && nonEmptyTranslatedSentences.length === 0) {
          return null;
        }
        return (
          <React.Fragment key={type}>
           {isSwitchChecked && (
            <tr className="title-row">
              <th className="title-row">{type}</th><th className="title-row"></th><th className="title-row"></th>
            </tr>
          )}
            {nonEmptyOriginalSentences.map((sentence, index) => (
              <tr key={index}>
                <td>{sentence.text}</td>
                <td>{nonEmptyTranslatedSentences[index]?.text || ''}</td>
                <td className="button-row">
                  <ToggleButton
                    size="sm"
                    type="checkbox"
                    variant={translatedSentencesState[translatedSentences[type][index].id] === true ? 'success' : 'outline-success'}
                    onClick={() => handleTranslatedSentenceClick(translatedSentences[type][index], true)}
                    className="custom-toggle-button times"
                    id={`check-${translatedSentences[type][index].id || index}`}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </ToggleButton>
                  <ToggleButton
                    size="sm"
                    type="checkbox"
                    variant={translatedSentencesState[translatedSentences[type][index].id] === false ? 'danger' : 'outline-danger'}
                    onClick={() => handleTranslatedSentenceClick(translatedSentences[type][index], false)}
                    className="custom-toggle-button check"
                    id={`times-${translatedSentences[type][index].id || index}`}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </ToggleButton>
                </td>
              </tr>
            ))}
          </React.Fragment>
         
        );
      });
    };
  
    return (
     <>
      <Container>
       
        <Row>
          <Col>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipProgressBarReports}
            >
            <ProgressBar striped animated className="reports-progress-bar" 
              now={progressReports} 
              label={`(${completedReports}/${reports.length})  `+`${Math.round(progressReports)}%`} 
              variant={
                Math.round(progressReports) <= 33 ? "danger" :
                Math.round(progressReports) < 99 ? "warning" :
                "success"
              } />

          </OverlayTrigger>
          </Col>
        </Row>
        <Row >
          <ButtonGroup size="sm" >
            <Button
              variant="primary"
              onClick={goToPreviousReport}
              disabled={reports.length === 0 || currentIndex === 0}
            >
              Reporte anterior
            </Button>
            <Button
              variant="primary"
              onClick={goToNextReport}
              disabled={reports.length === 0 || currentIndex === reports.length - 1}
            >
              Siguiente reporte
            </Button>
          </ButtonGroup>
        </Row>
        <Row>
          <Col>
            <h3><Badge bg="secondary" className="badge-report" >ID Reporte: {report.reportId}</Badge> </h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipProgressBarTranslatedSentences}
              >
            <ProgressBar
              striped
              animated
              className="reports-progress-bar"
              now={calculateProgressCurrentReport()}
              label={`(${totalReviewedSentences}/${uniqueTranslatedSentenceIds.size})  ${Math.round(calculateProgressCurrentReport())}%`}
              variant={
                Math.round(calculateProgressCurrentReport()) <= 33 ? 'danger' :
                  Math.round(calculateProgressCurrentReport()) < 99 ? 'warning' :
                    'success'
              }
            />
            </OverlayTrigger>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Mostrar encabezado de la sección"
              checked={isSwitchChecked}
              onChange={() => setIsSwitchChecked(!isSwitchChecked)}
              className="custom-switch"
            />
          </Form>
          </Col>
        </Row>
        <Row>
          <Table striped hover responsive="lg" className="custom-table">
            <tbody className="custom-table">{renderRows(report)}
    
            </tbody>
            </Table>
        </Row>
      </Container>

        <ModalSuggestions show={isModalOpen} onHide={() => setIsModalOpen(false)} selectedTranslatedSentenceId={selectedTranslatedSentenceId} />
      </>
    );
  }
  
  return <ReportTable report={report.report} />;
}

export default Viewer;
