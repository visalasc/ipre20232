import { Navbar, Nav, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalDictionary  from '../Components/ModalDictionary';
import ModalUploadReport from '../Components/ModalUploadReport';


const NavBarReportSelection = () => {


  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Navbar.Brand >MIMIC-CXR</Navbar.Brand>
      <Nav className="ml-auto"> 
        <Nav.Link href="/reportselection">
          <Button variant="success">
            Seleccionar Reportes
          </Button>
        </Nav.Link>
        <Nav.Link>
          <ModalUploadReport/>
        </Nav.Link>
        <Nav.Link>
          <ModalDictionary/>
        </Nav.Link>
        <Nav.Link>
        <LogoutButton />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBarReportSelection;
