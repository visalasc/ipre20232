import { useState, useContext, useEffect } from 'react';
import { Form, Button, ListGroup, Table, Col, Row, Alert  } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';


import './CreateUserReportGroup.css';

const CreateUserReportGroup = ({ onCreateUserReportGroup, allUsers, reportGroupReports, getReportGroupReports}) => {

  const { token } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const [userReportGroupData, setUserReportGroupData] = useState({
    reportGroupId: '',
    userIds: [],
  });

  const users = allUsers;
  const updatedReports = reportGroupReports;

 
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
      setUserReportGroupData({
        ...userReportGroupData,
        userIds: userReportGroupData.userIds.filter((id) => id !== userId),
      });
    } else {
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
      getReportGroupReports();
      setShowAlert(true);
    } catch (error) {
      console.error('Error sending the form:', error);
    }
  };

  return (
    <div>
      <Row>
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>UserReportGroup generado con éxito.</Alert>
      <div className='form-batch-users'> 
        <Form.Group controlId="formGroupReportGroupId">
              <Form.Label>Asociar usuarios a grupo de reportes</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese batch Id"
                name="reportGroupId"
                value={userReportGroupData.reportGroupId}
                onChange={handleInputChange}
              />
        </Form.Group>
        <Button className="button-send"onClick={handleSendClick}>Asociar</Button>
      </div>

      <Col md={{offset: 1 }}>
          <Table striped  hover>
            <thead>
              <tr>
                <th>Batch Id</th>
                <th>Usuarios asociados</th>
              </tr>
            </thead>
            <tbody>
              {updatedReports.map((reportGroupReport) => (
                <tr key={reportGroupReport.id}>
                  <td>{reportGroupReport.id}</td>
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
      </Col>

      <Col>
        <Form>
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

      </Col>
      </Row>
    </div>
  );
};

export default CreateUserReportGroup;
