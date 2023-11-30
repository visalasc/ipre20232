import { Card } from 'react-bootstrap';
import './leftviewer.css'
function LeftViewer({ reports , currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex}) {

  const currentReport = reports[currentIndex];
  if (!currentReport) {
    return <div>Cargando reporte...</div>; // Mostrar un mensaje de carga o cualquier otro contenido mientras se cargan los datos
  }
  return (
    <>
      <Card text="dark" 
      bg="light" border="secondary">
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