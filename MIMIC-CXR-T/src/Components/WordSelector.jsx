import { useState } from 'react';
import { Button } from 'react-bootstrap';
function WordSelector({sentence, variant, disabled}) {
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
            variant={variant}
            className={selectedWords.includes(word) ? 'selected' : ''}
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
