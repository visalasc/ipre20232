import React from 'react';
import { Toast } from 'react-bootstrap';

function SuggestionToast({ suggestions, onClose }) {
  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <Toast
          key={index} // Usar un identificador único para cada Toast
          onClose={onClose} 
          position='top-end'
          className='mi-toast'
          >
          <Toast.Header>
            <strong className="mr-auto">Sugerencia</strong>
          </Toast.Header>
          <Toast.Body>{suggestion}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
}

export default SuggestionToast;
