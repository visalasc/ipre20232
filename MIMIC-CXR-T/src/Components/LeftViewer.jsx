import React from 'react';
import Card from 'react-bootstrap/Card';

function LeftViewer({ reports }) {
  console.log("reports:", reports)
  return (
    <div className="container mt-4">
      <Card border="secondary" style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Header>Reporte original:</Card.Header>
          {reports &&
            reports.map((report, index) => (
              <div key={index}>
                <Card.Text>ID: {report.id}</Card.Text>
                <Card.Text>Created At: {report.createdAt}</Card.Text>
                <Card.Text>Contenido: {report.text}</Card.Text>
              </div>
            ))}
        </Card.Body>
      </Card>
    </div>
  );
}

export default LeftViewer;
