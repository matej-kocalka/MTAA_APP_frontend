import React, { createContext, useState, useEffect } from 'react';
import AuthManager from '../managers/AuthManager';
import User from '../models/User';

export type AuthContextType = {
  /** The currently logged-in user, or null if not logged in */
  user: User | null;

  /**
   * Attempts to log in a user with the provided email and password.
   * On success, updates the user state.
   * @param email - The user's email address
   * @param password - The user's password
   */
  login: (email: string, password: string) => Promise<void>;

  /**
   * Registers a new user with the provided email and password.
   * @param email - The new user's email address
   * @param password - The new user's password
   * @returns A boolean indicating if registration was successful
   */
  register: (email: string, password: string) => Promise<boolean>;

  /** Logs out the current user and clears user state */
  logout: () => void;

  /** Retrieves the current authentication token */
  getToken: () => string | null;

  /**
   * Checks if a user is already logged in by reading from storage.
   * If logged in, updates the user state.
   * @returns True if user was logged in, false otherwise
   */
  checkLoggedInUser: () => Promise<boolean>;

  /** Updates the current user's information */
  updateUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provides authentication state and methods to child components.
 * Manages login, registration, logout, token retrieval, and user state.
 * @param children - React children components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Calls AuthManager to log in and sets the user state.
   * @param email - User email
   * @param password - User password
   */
  const login = async (email: string, password: string) => {
    const loggedInUser = await AuthManager.login(email, password);
    setUser(loggedInUser);
  };

  /**
   * Registers a new user.
   * @param email - New user's email
   * @param password - New user's password
   * @returns True if registration succeeded
   */
  const register = async (email: string, password: string) => {
    const result = await AuthManager.register(email, password);
    return result;
  };

  /**
   * Logs out the current user and resets user state.
   */
  const logout = async () => {
    await AuthManager.logout();
    setUser(null);
  };

  /**
   * Returns the current auth token.
   * @returns Auth token string or null
   */
  const getToken = () => {
    return AuthManager.getToken();
  };

  /**
   * Updates the current user data by fetching from backend.
   */
  const updateUser = () => {
    return AuthManager.updateUser();
  };

  /**
   * Checks if a user is logged in by reading AsyncStorage.
   * Updates user state if a logged-in user is found.
   * @returns True if logged in, false otherwise
   */
  const checkLoggedInUser = async () => {
    const loggedInUser = await AuthManager.checkLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getToken,
        checkLoggedInUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
