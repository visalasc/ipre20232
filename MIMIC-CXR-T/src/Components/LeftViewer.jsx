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
              <Card.Text key={index} id={sentence.id}>
                {sentence.text}
              </Card.Text>
            ))}
        </Card.Body>
      </Card>
    </div>
  );
}

export default LeftViewer;
