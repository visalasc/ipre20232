import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../common/App'
import Translator from '../common/Translator'
import ModalLogin from '../profile/ModalLogin'
import Signup from '../profile/Signup'
import ReportGroupSelection from '../common/ReportGroupSelection'; 
import Admin from '../common/Admin';
import TableUserDisplayReportGroup from '../Components/TableUserDisplayReportGroup'
import { useAuth } from '../auth/AuthProvider';  // Importa el contexto de autenticación
import { useNavigate } from 'react-router-dom';

function AdminRoute({ element }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Comprueba si el usuario tiene el rol de administrador
  if (user && user.role === 'Admin') {
    return element;
  } else {
    // Si el usuario no es un administrador, redirige a una página diferente
    navigate('/');
    // Puedes retornar null o algún componente informativo aquí si lo prefieres
    return null;
  }
}

function Routing() {
    return(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<App />}/>
            <Route path={'/translator/:groupId/'} element={<Translator/>}/>
            <Route path={'/tablereportgroup/:groupId'} element={<TableUserDisplayReportGroup/>}/>
            <Route path={"/login"} element={<ModalLogin />}/>
            <Route path={"/signup"} element={<Signup />}/>
            <Route path={"/reportselection"} element={<ReportGroupSelection />} />
            <AdminRoute path={"/admin"} element={<Admin />} />
            
        </Routes>
    </BrowserRouter>)
}

export default Routing;