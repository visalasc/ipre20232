import { Table } from 'react-bootstrap';
import './leftviewer.css';

function LeftViewer({ reports, currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex }) {
  const currentReport = reports[currentIndex];

  // Verificar si currentReport es un objeto válido
  if (!currentReport) {
    return <div>Cargando reporte...</div>;
  }

  return (
    <>
      <div>
        <Table striped hover borderless responsive="sm">
          <thead>
            <tr>
              <th>Reporte original</th>
            </tr>
            <tr>
              <th>ReportID: {currentReport.id}</th>
            </tr>
          </thead>
          <tbody>
            {currentReport.phrases.map((phrase, index) => (
              <tr key={phrase.id}>
                <td 
                  className={highlightedPhraseIndex === index ? 'highlighted-left text-row' : 'text-left text-row'}
                  onMouseEnter={() => setHighlightedPhraseIndex(index)}
                  onMouseLeave={() => setHighlightedPhraseIndex(null)}
                >
                  {phrase.text}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default LeftViewer;
