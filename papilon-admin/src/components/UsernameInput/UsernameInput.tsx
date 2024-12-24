// src/components/UsernameInput/UsernameInput.tsx

import React from 'react';
import styles from './UsernameInput.module.css';

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ value, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.usernameInputContainer}>
      <label htmlFor="username" className={styles.label}>
        Nombre de Usuario:
      </label>
      <input
        type="text"
        id="username"
        name="username"
        className={styles.input}
        value={value}
        onChange={handleInputChange}
        placeholder="Ingresa tu nombre de usuario"
      />
    </div>
  );
};

export default UsernameInput;
