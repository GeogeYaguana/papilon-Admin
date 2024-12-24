// src/components/PasswordInput/PasswordInput.tsx
import React from 'react';
import styles from './PasswordInput.module.css';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.passwordInputContainer}>
      <label htmlFor="password" className={styles.label}>
        Contraseña:
      </label>
      <input
        type="password"
        id="password"
        name="password"
        className={styles.input}
        value={value}
        onChange={handleInputChange}
        placeholder="Ingresa tu contraseña"
      />
    </div>
  );
};

export default PasswordInput;
