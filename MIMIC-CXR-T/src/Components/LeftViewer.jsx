import React , { useState, useEffect } from 'react';
import { Button, Card, Container, Col, Row, ButtonGroup } from 'react-bootstrap';
import './leftviewer.css'
function LeftViewer({ reports , currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex}) {
  const currentReport = reports[currentIndex];
  console.log(currentReport);
  return (
    <>
      <Card text="dark" 
      bg="light" border="secondary" 
      style={{ width: '23rem' , height: 'auto' , overflow: 'scroll'}}>
        <Card.Body>
          <Card.Header>Reporte original:</Card.Header>
            <Card.Text>ReportID: {currentReport.id}</Card.Text>
            
                    {currentReport.phrases.map((phrase, index) => (
                <Card.Text key={phrase.id} 
                className={highlightedPhraseIndex === index ? 'highlighted-left' : ''}
                onMouseEnter={() => setHighlightedPhraseIndex(index)}
                onMouseLeave={() => setHighlightedPhraseIndex(null)}
                >{phrase.text} 
                  </Card.Text>
              ))}
           
        </Card.Body>
      </Card>
      </>
  );
}

export default LeftViewer;
