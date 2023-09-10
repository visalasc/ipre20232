import ProgressBar from 'react-bootstrap/ProgressBar';

function ProgressBarReport() {
  const now = 60;
  return <ProgressBar now={45} label={`${45}%`} />;
}

export default ProgressBarReport;