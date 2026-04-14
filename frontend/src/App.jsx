import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import VotersPage from './pages/VotersPage';
import CandidatesPage from './pages/CandidatesPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';

import ElectionsPage from './pages/ElectionsPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import LandingPage from './pages/LandingPage';

const Layout = ({ children, userRole }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/';

  if (isLoginPage || isLandingPage) return children;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userRole={userRole} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  
  if (!token || !userRole) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'admin' ? '/dashboard' : '/voting'} replace />;
  }
  return children;
};

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  return (
    <Router>
      <Layout userRole={userRole}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={setUserRole} />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/elections" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ElectionsPage />
            </ProtectedRoute>
          } />
          <Route path="/voters" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VotersPage />
            </ProtectedRoute>
          } />
          <Route path="/candidates" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CandidatesPage />
            </ProtectedRoute>
          } />

          {/* Voter Routes */}
          <Route path="/voting" element={
            <ProtectedRoute allowedRoles={['voter']}>
              <VotingPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['voter']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute allowedRoles={['voter']}>
              <ChangePasswordPage />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/results" element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
