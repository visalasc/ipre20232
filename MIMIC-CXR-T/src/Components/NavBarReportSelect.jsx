import { Navbar, Nav, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalUploadReport from '../Components/ModalUploadReport';

const NavBarReportSelection = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Navbar.Brand >MIMIC-CXR</Navbar.Brand>
      <Nav className="ml-auto"> 
        {user && user.role === 'Admin' && (
          <Nav.Link href="/admin">
            <Button variant="info">
              Vista admin
            </Button>
          </Nav.Link>
        )}
        <Nav.Link href="/reportselection">
          <Button variant="success">
            Home
          </Button>
        </Nav.Link>
        <Nav.Link>
          <ModalUploadReport/>
        </Nav.Link>
        <Nav.Link>
          <LogoutButton />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBarReportSelection;
