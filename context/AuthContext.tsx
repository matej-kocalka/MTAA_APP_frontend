import React, { createContext, useState, useEffect } from 'react';
import AuthManager from '../managers/AuthManager';
import User from '../models/User';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const loggedInUser = await AuthManager.login(email, password);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await AuthManager.logout();
    setUser(null);
  };

  const getToken = () => {
    return AuthManager.getToken();
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken}}>
      {children}
    </AuthContext.Provider>
  );
};
