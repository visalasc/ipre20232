import { Nav, Navbar, Button } from 'react-bootstrap';
import LogoutButton from '../profile/Logout';
import { useAuth } from '../auth/AuthProvider';

function NavAdmin() {
  const { user } = useAuth();

  return (
    <Navbar className="justify-content-end" bg="dark" data-bs-theme="dark" expand="lg">
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
            Vista usuario
        </Button>
      </Nav.Link>
      <Nav.Link>
        <LogoutButton />
      </Nav.Link>
    </Nav>
  </Navbar>
  );
}

export default NavAdmin;

