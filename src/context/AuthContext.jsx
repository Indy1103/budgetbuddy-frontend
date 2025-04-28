import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load any existing token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('bb_token'));
  const [user, setUser]   = useState(null);

  // Sync token to localStorage and optionally extract user info
  useEffect(() => {
    if (token) {
      localStorage.setItem('bb_token', token);
      // (Optional) decode token to get user data
      setUser({}); 
    } else {
      localStorage.removeItem('bb_token');
      setUser(null);
    }
  }, [token]);

  // Call backend API for login
  const login = async (email, password) => {
    const { token: newToken } = await apiLogin(email, password);
    setToken(newToken);
  };

  // Call backend API for signup, then auto-login
  const signup = async (email, password, inviteCode) => {
    await apiSignup(email, password, inviteCode);
    await login(email, password);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth
export const useAuth = () => useContext(AuthContext);