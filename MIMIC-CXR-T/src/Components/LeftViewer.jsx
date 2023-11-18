import { Card, Table } from 'react-bootstrap';
import './leftviewer.css'

function LeftViewer({ reports , currentIndex, highlightedPhraseIndex, setHighlightedPhraseIndex}) {
  const currentReport = reports[currentIndex];
  return (
    <>
      <div>
      <Table responsive="sm">
        <thead>
          <tr>
            <th>ReportID: {currentReport.id}</th>
          </tr>
        </thead>
        <tbody>
          {currentReport.phrases.map((phrase, index) => (
            <tr key={phrase.id}>
                <td key={phrase.id} 
                className={` ${highlightedPhraseIndex === index ? 'highlighted-left' : 'text-left'}`}
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
