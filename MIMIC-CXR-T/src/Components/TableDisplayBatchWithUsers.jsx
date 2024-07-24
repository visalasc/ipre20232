import { useState, useContext, useEffect } from 'react';
import { Table, Col, Row, Alert  } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { getAllUsers, getUserReportGroups} from '../utils/api';

const TableDisplayBatchWithUsers = ({ reportGroupReports }) => {
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
      //console.log('Fetching users for report group:', reportGroupId)
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
    </Row>
    </div>
  );
};

export default TableDisplayBatchWithUsers;
