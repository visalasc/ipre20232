import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const CreateReportGroup = ({ onCreateReportGroup }) => {
  const [reportGroupData, setReportGroupData] = useState({
    name: '',
    reportIds: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportGroupData({
      ...reportGroupData,
      [name]: value,
    });
  };

  const handleSendClick = async () => {
    try {
      const reportIdsArray = reportGroupData.reportIds.split(',').map((id) => Number(id.trim()));
      const requestBody = {
        name: reportGroupData.name,
        reportIds: reportIdsArray,
      };
      onCreateReportGroup(requestBody);
    } catch (error) {
     
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group controlId="formGroupName">
          <Form.Label>Report Group Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={reportGroupData.name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formGroupReportIds">
          <Form.Label>Report IDs (separado por coma)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter report IDs"
            name="reportIds"
            value={reportGroupData.reportIds}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form>
      <Button onClick={handleSendClick}>Enviar</Button>
    </Container>
  );
};

export default CreateReportGroup;
