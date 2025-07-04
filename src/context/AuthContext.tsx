import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  toggleAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  toggleAuth: () => {},
});