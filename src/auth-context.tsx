import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole?: 'admin' | 'student';
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setuserRole] = useState<'admin' | 'student' | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storeduserRole = localStorage.getItem('userRole') as 'admin' | 'student' | undefined;

    if (token) {
      setIsAuthenticated(true);
      setuserRole(storeduserRole);
    }
  }, []);

  const login = () => {
    const token = localStorage.getItem('authToken');
    const storeduserRole = localStorage.getItem('userRole') as 'admin' | 'student' | undefined;

    if (token) {
      setIsAuthenticated(true);
      setuserRole(storeduserRole);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setuserRole(undefined);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // Fixed the typo here
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
