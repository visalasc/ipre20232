import { useState, useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CreateReportGroup from '../Components/CreateReportGroup';
import TableDisplayReports from '../Components/TableDisplayReportGroup';
import { AuthContext } from '../auth/AuthContext';
import { getAllReportGroupReports, createReportGroups, createUserReportGroups } from '../utils/api';
import Sidebar from '../Components/Sidebar';
import NavAdmin from '../Components/NavAdmin';
import CreateUserReportGroup from '../Components/CreateUserReportGroup';
import DisplayUsers from '../Components/TableDisplayUsers';
import ModalUploadReports from '../Components/CreateJsonBatchReports';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './admin.css';

function Admin() {
  const { token } = useContext(AuthContext);
  const [reportGroupReports, setReportGroupReports] = useState([]);
  const [currentView, setCurrentView] = useState('view1');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Usa useNavigate para gestionar la navegación

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

  const handleCreateReportGroup = async (reportGroupData) => {
    try {
      setLoading(true);
      const response = await createReportGroups(reportGroupData, token);
      console.log('Report group created:', response);
      setReportGroupReports([...reportGroupReports, response.reportgroup]);
      setCurrentView('view1');
      // Muestra notificación Toast de éxito
    } catch (error) {
      console.error('Error creating report group:', error);
      // Muestra notificación Toast de error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserReportGroup = async (reportGroupId, userIds) => {
    try {
      setLoading(true);
      const response = await createUserReportGroups(reportGroupId, userIds, token);
      console.log('user report group created:', response);

    } catch (error) {
      console.error('Error creating user report groups:', error);
      // Muestra notificación Toast de error
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    // Si no es un administrador, redirigir a otra página (puedes elegir una página de acceso denegado)
    navigate("/access-denied");
    return null; // Puedes devolver null después de la redirección para evitar renderizar el resto del componente
  }

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
    </>
  );
}

export default Admin;
