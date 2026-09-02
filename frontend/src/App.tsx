import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { CharacterList } from './pages/MyCharacters/List';
import { CharacterCreate } from './pages/MyCharacters/Create';
import { CreateAuction } from './pages/MyCharacters/CreateAuction';
import { History } from './pages/History';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-characters" 
        element={
          <PrivateRoute>
            <CharacterList />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-characters/new" 
        element={
          <PrivateRoute>
            <CharacterCreate />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-characters/:id/auction" 
        element={
          <PrivateRoute>
            <CreateAuction />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
