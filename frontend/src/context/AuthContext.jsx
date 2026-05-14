import { createContext, useContext, useState, useEffect } from 'react';
import data from '../data/data.json';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('sessionhub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (role = 'USER') => {
    // Mock login - simulate Google OAuth
    const mockUser = role === 'CREATOR' ? data.users.creator1 : data.users.user1;
    setUser(mockUser);
    localStorage.setItem('sessionhub_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sessionhub_user');
  };

  const isAuthenticated = !!user;
  const isCreator = user?.role === 'CREATOR';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isCreator, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};