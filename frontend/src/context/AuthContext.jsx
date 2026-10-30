import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'completebazaar.auth';

async function authRequest(action, details) {
  return apiRequest(`/api/auth/${action}`, {
    method: 'POST',
    body: JSON.stringify(details),
  });
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { user: null, token: null };
    } catch {
      return { user: null, token: null };
    }
  });

  const save = ({ _id, name, email, role, token }) => {
    const next = { token, user: { _id, name, email, role: role || 'user' } };
    setSession(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next.user;
  };

  const login = async (details) => save(await authRequest('login', details));
  const register = async (details) => save(await authRequest('register', details));
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...session, isAuthenticated: Boolean(session.token), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
