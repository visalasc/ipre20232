import React, { useEffect } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

const ToggleButtonGroup = ({ name, options, value, onChange }) => {
  useEffect(() => {
    console.log('Valor seleccionado:', value);
  }, [value]);

  const handleButtonClick = (newValue) => {
    onChange(newValue, name); // Pasa el tipo (name) junto con el valor (newValue)
  };

  return (
    <ButtonGroup>
      {options.map((option, index) => (
        <Button
          key={index}
          variant={value === option ? (option === 'si' ? 'success' : 'danger') : 'outline-secondary'}
          className="toggle-btn"
          onClick={() => handleButtonClick(option)}
          active={value === option}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ToggleButtonGroup;
