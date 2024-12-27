// src/pages/NotFound/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404 - Página No Encontrada</h1>
      <Link to="/dashboard" className={styles.homeLink}>
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
