import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from '../common/App';
import Translator from '../common/Translator';
import ModalLogin from '../profile/ModalLogin';
import Signup from '../profile/Signup';
import ReportGroupSelection from '../common/ReportGroupSelection'; 
import Admin from '../common/Admin';
import TableUserDisplayReportGroup from '../Components/TableUserDisplayReportGroup';

function NoPermissions() {
  return <div>No tienes permisos para acceder a esta página.</div>;
}

function AdminComponent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Función para comprobar si el usuario es administrador
  const isAdmin = () => user && user.role === 'Admin';

  // Redirigir a la página principal si el usuario no es administrador
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return <Admin />;
}

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/translator/:groupId/" element={<Translator />} />
        <Route path="/tablereportgroup/:groupId" element={<TableUserDisplayReportGroup />} />
        <Route path="/login" element={<ModalLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reportselection" element={<ReportGroupSelection />} />
        <Route path="/admin" element={<AdminComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
