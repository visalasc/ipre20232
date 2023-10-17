import React from 'react';
import Card from 'react-bootstrap/Card';

function LeftViewer({ groupData }) {
  return (
    <div className="container mt-4">
      <Card border="secondary" style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Header>Reporte original:</Card.Header>
          {groupData &&
            groupData.sentences.map((sentence, index) => (
              <div key={report.id}>
                <Card.Text>ID: {report.id}</Card.Text>
                <Card.Text>{report.text}</Card.Text>
              </div>
            ))}
        </Card.Body>
      </Card>
    </div>
  );
}

export default LeftViewer;
