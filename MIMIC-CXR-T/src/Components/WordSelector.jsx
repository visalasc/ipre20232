import { useState } from 'react';
import { Button } from 'react-bootstrap';
import './WordSelector.css'
function WordSelector({sentence, disabled, variant}) {
  const [selectedWords, setSelectedWords] = useState([]);

  const handleClick = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  return (
    <div>
      <p>
        {sentence.split(/\s+/).map((word, index) => (
          <Button
            key={index}
            className={`word-selector-button ${variantClass(variant)} ${
              selectedWords.includes(word) ? 'word-selector-button-selected' : ''
            }`}
            onClick={() => handleClick(word)}
            disabled={disabled}
          >
            {word}{' '}
          </Button>
        ))}
      </p>
    </div>
  );
}

const variantClass = (variant) => {
  switch (variant) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'success':
      return 'success';
    case 'danger':
      return 'danger';
    case 'warning':
      return 'warning';
    default:
      return 'secondary'; // Valor por defecto o manejar de otra manera según sea necesario
  }
};

export default WordSelector;
