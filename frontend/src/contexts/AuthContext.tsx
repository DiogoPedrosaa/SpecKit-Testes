import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User } from '../services/auth';
import { api } from '../services/api';

interface AuthContextData {
  user: User | null;
  signIn: (username: string, passwordHash: string) => Promise<void>;
  signUp: (username: string, passwordHash: string) => Promise<void>;
  signOut: () => void;
  updateBalance: (amount: number) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedToken = localStorage.getItem('@TibiaBazaar:token');

      if (storagedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('@TibiaBazaar:token');
        }
      }
      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signIn = async (username: string, passwordHash: string) => {
    const response = await authService.login(username, passwordHash);
    setUser(response.user);
    localStorage.setItem('@TibiaBazaar:token', response.token);
  };

  const signUp = async (username: string, passwordHash: string) => {
    const response = await authService.register(username, passwordHash);
    setUser(response.user);
    localStorage.setItem('@TibiaBazaar:token', response.token);
  };

  const signOut = () => {
    localStorage.removeItem('@TibiaBazaar:token');
    setUser(null);
  };

  const updateBalance = async (amount: number) => {
    await authService.addBalance(amount);
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateBalance, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
