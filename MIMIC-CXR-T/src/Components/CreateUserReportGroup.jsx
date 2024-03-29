import { useState, useContext, useEffect } from 'react';
import { Form, Button, ListGroup, Table, Col, Row, Alert  } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { getAllUsers, getUserReportGroups} from '../utils/api';

const CreateUserReportGroup = ({ onCreateUserReportGroup, reportGroupReports }) => {
  const { token } = useContext(AuthContext);
  const [updatedReports, setUpdatedReports] = useState(reportGroupReports);
  const [userReportGroupData, setUserReportGroupData] = useState({
    reportGroupId: '',
    userIds: [],
  });
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setUpdatedReports(reportGroupReports);
  }, [reportGroupReports]);

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

  const fetchUsersForReportGroup = async (reportGroupId) => {
    try {
      const userReportGroup = await getUserReportGroups(reportGroupId, token);
      
      return userReportGroup.map((group) => group.userId);
    } catch (error) {
      console.error('Error fetching users for report group:', error);
      return [];
    }
  };

  const fetchAndUpdateUsersForReports = async () => {
    const updatedReportsWithUsers = await Promise.all(
      updatedReports.map(async (report) => {
        try {
          const usersForReportGroup = await fetchUsersForReportGroup(report.id);
          return { ...report, users: usersForReportGroup };
        } catch (error) {
          console.error('Error fetching users for report group:', error);
          return { ...report, users: [] }; // Manejo de errores, establece usuarios como vacío
        }
      })
    );
    
    setUpdatedReports(updatedReportsWithUsers);
  };

  useEffect(() => {
    fetchAndUpdateUsersForReports();
  }, [updatedReports]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserReportGroupData({
      ...userReportGroupData,
      [name]: value,
    });
  };

  const handleUserSelection = (userId) => {
    const isSelected = userReportGroupData.userIds.includes(userId);
    if (isSelected) {
      // Si el usuario está seleccionado, quitarlo del array
      setUserReportGroupData({
        ...userReportGroupData,
        userIds: userReportGroupData.userIds.filter((id) => id !== userId),
      });
    } else {
      // Si el usuario no está seleccionado, agregarlo al array
      setUserReportGroupData({
        ...userReportGroupData,
        userIds: [...userReportGroupData.userIds, userId],
      });
    }
  };

  const handleSendClick = async () => {
    try {
      const reportGroupId = Number(userReportGroupData.reportGroupId);
      const requestBody = {
        reportGroupId,
        userIds: userReportGroupData.userIds.map((id) => Number(id)),
      };
      onCreateUserReportGroup(requestBody, token);
      setShowAlert(true);
    } catch (error) {
      console.error('Error sending the form:', error);
    }
  };



  return (
    <div>
      <Row>
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
            UserReportGroup generado con éxito.
          </Alert>
     <Col md={{offset: 1 }}>
        
   {updatedReports.length > 0 && (
          <Table striped  hover>
            <thead>
              <tr>
                <th>Batch Id</th>
                <th>Reports IDs</th>
                <th>User IDs</th>
              </tr>
            </thead>
            <tbody>
              {updatedReports.map((reportGroupReport) => (
                <tr key={reportGroupReport.id}>
                  <td>{reportGroupReport.id}</td>
                  <td>
                    {reportGroupReport.reports && reportGroupReport.reports.length > 0 ? (
                      reportGroupReport.reports.map((report) => (
                        <div key={report.id}>{report.id}</div>
                      ))
                    ) : (
                      'No reports'
                    )}
                  </td>
                  <td>
                    {reportGroupReport.users && reportGroupReport.users.length > 0 ? (
                      reportGroupReport.users.map((user) => (
                        <div key={user}>{user}</div>
                      ))
                    ) : (
                      'No users'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
    </Col>

      <Col>
        <Form>
          <Form.Group controlId="formGroupReportGroupId">
            <Form.Label>Report Group ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese aquí batch Id"
              name="reportGroupId"
              value={userReportGroupData.reportGroupId}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formGroupUserIds">
            <Form.Label>Seleccionar Usuarios:</Form.Label>
            <ListGroup>
            {users.map((user) => (
                <ListGroup.Item key={`${user.id}-${user.firstName}-${user.lastName}`}>
                  <Form.Check
                    type="checkbox"
                    label={`${user.id} - ${user.firstName} ${user.lastName}`}
                    checked={userReportGroupData.userIds.includes(user.id.toString())}
                    onChange={() => handleUserSelection(user.id.toString())}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
        </Form>
        <Button onClick={handleSendClick}>Enviar</Button>
      
      </Col>
      </Row>
    </div>
  );
};

export default CreateUserReportGroup;
