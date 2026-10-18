import { createContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hashnode_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      if (!token) { if (active) setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        if (active) setUser(data.user);
      } catch {
        localStorage.removeItem('hashnode_token');
        if (active) { setToken(null); setUser(null); }
      } finally { if (active) setLoading(false); }
    }
    loadUser();
    return () => { active = false; };
  }, [token]);

  const login = (data) => {
    localStorage.setItem('hashnode_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem('hashnode_token');
    setToken(null);
    setUser(null);
  };
  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
