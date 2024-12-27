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
  const [loginType, setLoginType] = useState<'standard' | 'local'>('local');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // <--- Asegúrate de que login reciba token, userId y userType
  const { login } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      let data;
      if (loginType === 'local') {
        data = await AuthService.login(usuarioNombre, password);
      } else {
        data = await AuthService.login(usuarioNombre, password);
      }

      if (data.tipo_usuario === 'local') {
        login(data.token, data.id_usuario, data.tipo_usuario);
        onLoginSuccess();
      } else {
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
