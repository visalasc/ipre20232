import { Navbar, Nav, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import ModalUploadReport from '../Components/CreateJsonBatchReports';
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import process from 'process'; // You might not need this import, check if you're using 'process' in your code.
import { getUser } from '../utils/api';

const NavBarReportSelection = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("user: ", user);
  const token = localStorage.getItem('token');
  console.log("token: ", token);

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Assuming process.env.JWT_SECRET is defined somewhere.
  const userId = decodedToken.userId;

  const navigate = useNavigate();

  const isAdmin = async () => {
    try {
      const user = await getUser(userId, token);
      return user && user.role === 'Admin';
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleAdminButtonClick = async () => {
    if (await isAdmin()) {
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
        {await isAdmin() && (
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
