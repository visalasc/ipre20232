import { useState, useEffect, useContext } from 'react';
import { Table, Modal, Button, Col, Alert } from 'react-bootstrap';
import { getAllUsers, deleteUser } from '../utils/api';
import { AuthContext } from '../auth/AuthContext';

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers(token);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Llamar a la función delete user de la API
      await deleteUser(userId, token);
      showAlert(true);
      // Actualizar la lista de usuarios después de eliminar
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Col md={{ span: 3, offset: 3 }}>
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
        Usuario eliminado exitosamente
      </Alert>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>View Details</th>
            <th>Delete User</th>
          
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td>
                <Button onClick={() => handleShowModal(user)}>View Details</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                  Borrar Usuario
                </Button>
              </td>
           
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div>
              <p>
                <strong>User ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>First Name:</strong> {selectedUser.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedUser.lastName}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
            </div>
          ) : (
            'No user selected'
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

export default DisplayUsers;

