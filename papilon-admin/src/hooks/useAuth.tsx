// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { AuthState } from '../types/types';

interface UseAuthReturn {
  state: AuthState;
  login: (token: string, userId: number, userType: string) => void;
  logout: () => void;
  setAuth: (token: string, userId: number, userType: string) => void;
}

export const useAuth = (): UseAuthReturn => {
  const { state, dispatch } = useContext(AuthContext);

  const login = (token: string, userId: number, userType: string) => {
    dispatch({ type: 'LOGIN', payload: { token, userId, userType } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const setAuth = (token: string, userId: number, userType: string) => {
    dispatch({ type: 'SET_AUTH', payload: { token, userId, userType } });
  };

  return { state, login, logout, setAuth };
};
