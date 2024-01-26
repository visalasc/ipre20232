import { useState, useContext, useEffect } from 'react';
import { Container, ToastContainer, Toast } from 'react-bootstrap';
import CreateReportGroup from '../Components/CreateReportGroup';
import TableDisplayReports from '../Components/TableDisplayReportGroup';
import { AuthContext } from '../auth/AuthContext';
import { getAllReportGroupReports, createReportGroups, createUserReportGroups } from '../utils/api';
import Sidebar from '../Components/Sidebar';
import NavAdmin from '../Components/NavAdmin';
import CreateUserReportGroup from '../Components/CreateUserReportGroup';
import DisplayUsers from '../Components/TableDisplayUsers';
import ModalUploadReports from '../Components/CreateJsonBatchReports';
import './admin.css';

function Admin() {
  const { token } = useContext(AuthContext);
  const [reportGroupReports, setReportGroupReports] = useState([]);
  const [currentView, setCurrentView] = useState('view1');
  const [loading, setLoading] = useState(false);

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

  const showToast = (message, variant) => {
    // Muestra el Toast según el variant
    return (
      <Toast
        className="d-inline-block m-1"
        bg={variant.toLowerCase()}
        key={new Date().getTime()}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small>{new Date().toLocaleTimeString()}</small>
        </Toast.Header>
        <Toast.Body className={variant === 'dark' && 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    );
  };

  const handleCreateReportGroup = async (reportGroupData) => {
    try {
      setLoading(true);
      const response = await createReportGroups(reportGroupData, token);
      console.log('Report group created:', response);
      setReportGroupReports([...reportGroupReports, response.reportgroup]);
      setCurrentView('view1');
      // Muestra notificación Toast de éxito
      showToast('Report group created successfully', 'success');
    } catch (error) {
      console.error('Error creating report group:', error);
      // Muestra notificación Toast de error
      showToast('Error creating report group. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserReportGroup = async (reportGroupId, userIds) => {
    try {
      setLoading(true);
      const response = await createUserReportGroups(reportGroupId, userIds, token);
      console.log('user report group created:', response);
      showToast('user report group created successfully', 'success');
      
    } catch (error) {
      console.error('Error creating user report groups:', error);
      // Muestra notificación Toast de error
      showToast('Error creating user report group. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavAdmin />
      <Container className='container-admin'>
        <Sidebar setCurrentView={setCurrentView} />
        {/* Conditionally render content based on currentView */}
        {currentView === 'view1' && (
          <div className='table-display-container'>
            <TableDisplayReports reportGroupReports={reportGroupReports} />
          </div>
        )}
        {currentView === 'view2' && (
          <CreateReportGroup onCreateReportGroup={handleCreateReportGroup} />
        )}
         {currentView === 'view4' && (
          <CreateUserReportGroup onCreateUserReportGroup={handleCreateUserReportGroup} reportGroupReports={reportGroupReports}/>
        )}
        {currentView === 'view5' && (
          <DisplayUsers />
        )}
         {currentView === 'view6' && (
          <ModalUploadReports />
        )}
      </Container>

      {/* ToastContainer para las notificaciones Toast */}
      <ToastContainer position="top-end" className="p-3">
        {/* Placeholder para mostrar Toasts */}
      </ToastContainer>
    </>
  );
}

export default Admin;
