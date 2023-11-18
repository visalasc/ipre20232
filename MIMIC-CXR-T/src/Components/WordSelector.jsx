import { useState } from 'react';
import { Button } from 'react-bootstrap';
import './WordSelector.css'
function WordSelector({sentence, disabled}) {
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
            className={selectedWords.includes(word) ? 'word-selector-button-selected' : 'word-selector-button'}
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


export default WordSelector;
