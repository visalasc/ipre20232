import { useState, useContext, useEffect } from 'react';
import { Table, Modal, Button, Col, Alert} from 'react-bootstrap';
import './tabledisplayreportgroup.css';
import { deleteReportGroupReport } from '../utils/api';
import { AuthContext } from '../auth/AuthContext';

const TableDisplayReports = ({ reportGroupReports }) => {
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updatedReports, setUpdatedReports] = useState(reportGroupReports);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setUpdatedReports(reportGroupReports);
  }, [reportGroupReports]);

  const handleShowModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteReportGroup = async (reportGroupReport) => {
    try {
      // Llamar a la función delete user de la API
      await deleteReportGroupReport(reportGroupReport.id, token);
      // Actualizar el estado local después de la eliminación
      setUpdatedReports(updatedReports.filter(report => report.id !== reportGroupReport.id));
      setShowAlert(true);
    } catch (error) {
      console.error('Error deleting report group report:', error);
    }
  };

  return (
    <> 
      <Col>
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
        Batch eliminado exitosamente 
      </Alert>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ReportGroupReport ID</th>
              <th>Report IDs</th>
              <th>Ver reporte</th>
              <th>Eliminar Grupo</th>
            </tr>
          </thead>
          <tbody>
            {updatedReports.map((reportGroupReport) => (
              <tr key={reportGroupReport.id}>
                <td>{reportGroupReport.id}</td>
                <td>
                  {reportGroupReport.reports && reportGroupReport.reports.length > 0 ? (
                    reportGroupReport.reports.map((report) => (
                      <div key={report.id}>{report.id}</div>
                    ))
                  ) : (
                    'No reports'
                  )}
                </td>
                <td>
                  <Button onClick={() => handleShowModal(reportGroupReport)}>View Report</Button>
                </td>
                <td>
                  <Button onClick={() => handleDeleteReportGroup(reportGroupReport)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      <Modal show={showModal} onHide={handleCloseModal}/>
     
    </>
  );
};

export default TableDisplayReports;
