import { useState, useEffect, useContext } from 'react';
import {Row, Button, ProgressBar, Form, Table } from 'react-bootstrap';
import NavBarReportSelection from '../Components/NavBarReportSelect';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getReportGroupsByUser, getUserReportGroup } from '../utils/api';
import './reportgroupselection.css';
const ReportGroupSelection = () => {
  const { token } = useContext(AuthContext);
  const [reportGroups, setReportGroups] = useState([]);
  const [progress, setProgress] = useState({});

  const [filterPercentageMin, setFilterPercentageMin] = useState(0);
  const [filterPercentageMax, setFilterPercentageMax] = useState(100);
  const [hideCompleted, setHideCompleted] = useState(false);
 
  const navigate = useNavigate();

  const handleSelectButtonClick = (groupId) => {
    navigate(`/translator/${groupId}`);
  };

  const handleFilterInputChangeMin = (event) => {
    const percentage = parseFloat(event.target.value);
    setFilterPercentageMin(percentage);
  };

  const handleFilterInputChangeMax = (event) => {
    const percentage = parseFloat(event.target.value);
    setFilterPercentageMax(percentage);
  };

  const handleHideCompletedButtonClick = () => {
    setHideCompleted(true);
  };

  const fetchUserReportGroupProgress = async (reportGroupId) => {
    try {
      const response = await getUserReportGroup(reportGroupId, token);
      if (response) {
        let progressReportGroup = response.progress;
        setProgress((prevProgress) => ({ ...prevProgress, [reportGroupId]: progressReportGroup }));
      }
      // Devuelve la promesa resultante
      return response;
    } catch (error) {
      console.error('Error fetching user report group:', error);
      throw error; // Propaga el error para que Promise.all lo maneje
    }
  };

  useEffect(() => {
    const fetchUserReportGroups = async () => {
      try {
        const response = await getReportGroupsByUser(token);
        setReportGroups(response);
        console.log("response: ",response)
      } catch (error) {
        console.error('Error fetching report groups:', error);
      }
    };

    fetchUserReportGroups();
  }, [token]);

  useEffect(() => {
    const fetchProgressForAllGroups = async () => {
      const promises = reportGroups.map((group) =>
        fetchUserReportGroupProgress(group.id)
      );

      await Promise.all(promises);
    };

    fetchProgressForAllGroups();
  }, [reportGroups, token]);

  const filteredReportGroups = reportGroups.filter(
    (group) =>
      (filterPercentageMin <= progress[group.id] && progress[group.id] <= filterPercentageMax) &&
      (!hideCompleted || progress[group.id] < 100)
  );

  return (
    <div>
      <NavBarReportSelection />
      <h3>Selecciona un grupo de reportes a traducir:</h3>
    
        <Table striped borderless hover size="sm" variant="info" className="custom-table">
        <thead>
          <tr>
            <th className="w-75">Filtrar grupos de reportes por % de progreso:</th>
            <th className="w-25"> <Button
              size="sm"
              variant="secondary"
              onClick={handleHideCompletedButtonClick}
            >
              Ocultar completados
            </Button></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="w-50">
            <Form.Group>
                  <Form.Label>% mínimo:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={filterPercentageMin}
                    onChange={handleFilterInputChangeMin}
                  />
                </Form.Group>
              </td>
              <td className="w-50">
                <Form.Group>
                  <Form.Label>% máximo:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="100"
                    value={filterPercentageMax}
                    onChange={handleFilterInputChangeMax}
                  />
                </Form.Group>
              </td>
            </tr>
          </tbody>
        </Table>

        <Row>
          <Table striped bordered hover variant="primary" responsieve='sm' className="custom-table">
            <thead>
             
            </thead>
            <tbody>
            <tr>
                <td className="w-15">Id</td>
                <td className="w-25">Fecha de creación</td>
                <td className="w-50">Progreso</td>
                <td className="w-25">Seleccionar</td>
              </tr>
              {filteredReportGroups.map((group, index) => (
              <tr key={index} >
                <td className="w-15">{group.id}</td>
                <td className="w-25">
                  {(group.createdAt).slice(8,10)+(group.createdAt).slice(4,8)+(group.createdAt).slice(0,4)}
                  </td>
                  <td className="w-50"><ProgressBar striped animated variant="success" now={progress[group.id]} label={`${Math.round(progress[group.id])}%`} />
                </td>
                <td className="w-25">
                  <Button variant="primary" onClick={() => handleSelectButtonClick(group.id)}>Seleccionar</Button>
                </td>
              </tr>
              ))}
            </tbody>
          </Table>
        </Row>
    
    </div>
  );
};

export default ReportGroupSelection;
