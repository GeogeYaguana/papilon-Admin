// src/context/AuthContext.tsx
import { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { AuthState, AuthAction } from '../../types/types';

// Leer valores de localStorage
const storedToken = localStorage.getItem('authToken');
const storedUserId = localStorage.getItem('id_usuario');
const storedUserType = localStorage.getItem('tipo_usuario');

// Estado inicial dinámico
const initialState: AuthState = {
  isAuthenticated: !!storedToken, 
  token: storedToken,
  userId: storedUserId ? parseInt(storedUserId, 10) : null,
  userType: storedUserType,
};

// Crear el contexto
export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        token: action.payload.token,
        userId: action.payload.userId,
        userType: action.payload.userType,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        token: null,
        userId: null,
        userType: null,
      };
    case 'SET_AUTH':
      return {
        isAuthenticated: true,
        token: action.payload.token,
        userId: action.payload.userId,
        userType: action.payload.userType,
      };
    default:
      return state;
  }
};

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
