import React , { useState, useEffect } from 'react';
import { Button, Card, Container, Col, Row, ButtonGroup } from 'react-bootstrap';
import './rightviewer.css'
function RightViewer2({ translatedreports , currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex }) {
  const currentTranslatedReport = translatedreports[currentIndex];

  return (
    <>         
      <Card text="dark" 
      bg="light" border="secondary" 
      style={{ width: '23rem' , height: 'auto' , overflow: 'scroll'}}>
        <Card.Body>
          <Card.Header>Reporte Pre-traducido:</Card.Header>
            <Card.Text>TranslatedReportID: {currentTranslatedReport.id}</Card.Text>
              {currentTranslatedReport.translatedphrases.map((phrase, index) => (
                  <Card.Text key={phrase.id} 
                  className={highlightedPhraseIndex === index ? 'highlighted-right' : ''}
                  onMouseEnter={() => setHighlightedPhraseIndex(index)}
                  onMouseLeave={() => setHighlightedPhraseIndex(null)}        
              >
                    {phrase.text} 
                    </Card.Text>
                ))}
           
        </Card.Body>
      </Card>
      </>
  );
}

export default RightViewer2;
