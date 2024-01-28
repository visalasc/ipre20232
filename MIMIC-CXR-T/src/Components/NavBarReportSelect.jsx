import { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalUploadReport from '../Components/CreateJsonBatchReports';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/api';

const NavBarReportSelection = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("user: ", user);
  const token = localStorage.getItem('token');
  console.log("token: ", token);

  const userId = user ? user.userId : null; // Assuming the user object has a userId property.

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (userId) {
          const user = await getUser(userId, token);
          setIsAdmin(user && user.role === 'Admin');
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAdminStatus();
  }, [userId, token]);

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
       
          <Nav.Link>
            <Button variant="primary" onClick={handleAdminButtonClick}>
              Vista Admin
            </Button>
          </Nav.Link>
        
      </Nav>
    </Navbar>
  );
};

export default NavBarReportSelection;
