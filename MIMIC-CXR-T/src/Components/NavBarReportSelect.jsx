import { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalUploadReport from '../Components/CreateJsonBatchReports';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/api';

const NavBarReportSelection = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (token) {
          const user = await getUser(token);
          setIsAdmin(user && user.role === 'Admin');
        }
      } catch (error) {
        console.error('Error while checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [token]);

  const handleAdminButtonClick = () => {
    if (isAdmin) {
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
        {isAdmin && (
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
