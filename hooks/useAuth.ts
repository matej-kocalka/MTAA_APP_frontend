import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom React hook to access authentication context.
 *
 * This hook provides access to the authentication state and methods.
 * It must be used within a component tree that is wrapped in `AuthProvider`.
 *
 * @throws {Error} Throws an error if used outside of an `AuthProvider`.
 * @returns {AuthContextType} The current authentication context value.
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}