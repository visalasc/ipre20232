import { Navbar, Nav, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalUploadReport from '../Components/CreateJsonBatchReports';
import { useNavigate } from 'react-router-dom';

const NavBarReportSelection = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const isAdmin = () => user && user.role === 'Admin';

  const handleAdminButtonClick = () => {
    // Redirige a la ruta '/admin' si el usuario es administrador
    if (isAdmin()) {
      navigate('/admin');
    }
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Navbar.Brand>MIMIC-CXR</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link href="/reportselection">
          <Button variant="success">Home</Button>
        </Nav.Link>
        <Nav.Link>
          <ModalUploadReport />
        </Nav.Link>
        <Nav.Link>
          <LogoutButton />
        </Nav.Link>
        {isAdmin() && (
          <Nav.Link>
            <Button variant="primary" onClick={handleAdminButtonClick}>
              Vista Admin
            </Button>
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default NavBarReportSelection;
