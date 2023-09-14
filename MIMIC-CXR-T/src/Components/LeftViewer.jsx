import axios from 'axios';
import React , { useEffect, useState }from 'react';
import Card from 'react-bootstrap/Card';

function LeftViewer() {

  return (
    <>
     <div className="container mt-4">
      <Card border="secondary" style={{ width: '25rem' }}>
        <Card.Body>
        <Card.Header>Reporte original:</Card.Header>
          <Card.Title>Warning Card Title</Card.Title>
          <Card.Text id="1">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
            m ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
             tempor incididunt ut labore et dolore magna aliqua. Mattis ullamcorper
              velit sed ullamcorper. Et odio pellentesque diam volutpat commodo sed.
          </Card.Text>
          <Card.Text id="2">
            Oracion 2: Some quick example text to build on the card title and make up the
            bulk of the card's content.
            m ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
             tempor incididunt ut labore et dolore magna aliqua. Mattis ullamcorper
          </Card.Text>
          <Card.Text id="3">
            Oracion 3: Some quick example text to build on the card title and make up the
            bulk of the card's content.
            m ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
             tempor incididunt ut labore et dolore magna aliqua. Mattis ullamcorper
          </Card.Text>
        </Card.Body>
      </Card>
      </div>

    </>
  );
}

export default LeftViewer;