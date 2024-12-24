// src/components/LoginForm/LoginForm.tsx

import React, { useState } from 'react';
import UsernameInput from '../UsernameInput/UsernameInput';
import PasswordInput from '../PasswordInput/PasswordInput';
import SubmitButton from '../SubmitButton/SubmitButton';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'standard' | 'local'>('local'); // Añadimos el tipo de login
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      let data;
      if (loginType === 'local') {
        data = await AuthService.login(usuarioNombre, password);
      } else {
        // Si tienes otra ruta para otros tipos de login, llama a esa función aquí
        // Por ejemplo: data = await AuthService.login(usuarioNombre, password);
        data = await AuthService.login(usuarioNombre, password);
      }

      if (data.tipo_usuario === 'local') {
        // Solo establecer el estado de autenticación si el tipo de usuario es 'local'
        login(data.token, data.id_usuario, data.tipo_usuario);
        onLoginSuccess();
      } else {
        // Mostrar mensaje de error y no autenticar
        setErrorMsg('Solo los usuarios locales pueden iniciar sesión.');
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <UsernameInput value={usuarioNombre} onChange={setUsuarioNombre} />
      <PasswordInput value={password} onChange={setPassword} />

      {/* Opcional: Selector de Tipo de Login */}
      <div className={styles.loginTypeContainer}>
        <label>
          <input
            type="radio"
            value="local"
            checked={loginType === 'local'}
            onChange={() => setLoginType('local')}
          />
          Local
        </label>
        <label>
          <input
            type="radio"
            value="standard"
            checked={loginType === 'standard'}
            onChange={() => setLoginType('standard')}
          />
          Estándar
        </label>
      </div>

      <SubmitButton 
        onClick={handleSubmit} 
        disabled={loading} 
        text={loading ? 'Cargando...' : 'Iniciar Sesión'} 
      />
    </div>
  );
};

export default LoginForm;
