// src/components/SubmitButton/SubmitButton.tsx
import React from 'react';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  text = 'Iniciar Sesión',
  disabled = false
}) => {
  return (
    <button
      type="button"        // <--- IMPORTANTÍSIMO
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SubmitButton;
