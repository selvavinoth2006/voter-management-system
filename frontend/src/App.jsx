import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

const Layout = ({ children, userRole }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/';

  if (isLoginPage || isLandingPage) return children;

  return (
    <div className="flex min-h-screen bg-slate-50" style={{ backgroundImage: 'radial-gradient(at 40% 20%, rgba(26, 101, 245, 0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(217, 70, 239, 0.04) 0px, transparent 50%)' }}>
      <Sidebar userRole={userRole} />
      <main className="flex-1 ml-72 p-8 min-h-screen">
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

const AnimatedRoutes = ({ userRole, setUserRole }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage onLogin={setUserRole} /></PageWrapper>} />
        
        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PageWrapper><Dashboard /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/elections" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PageWrapper><ElectionsPage /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/voters" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PageWrapper><VotersPage /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/candidates" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PageWrapper><CandidatesPage /></PageWrapper>
          </ProtectedRoute>
        } />

        {/* Voter Routes */}
        <Route path="/voting" element={
          <ProtectedRoute allowedRoles={['voter']}>
            <PageWrapper><VotingPage /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['voter']}>
            <PageWrapper><ProfilePage /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute allowedRoles={['voter']}>
            <PageWrapper><ChangePasswordPage /></PageWrapper>
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/results" element={
          <ProtectedRoute>
            <PageWrapper><ResultsPage /></PageWrapper>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
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
        <AnimatedRoutes userRole={userRole} setUserRole={setUserRole} />
      </Layout>
    </Router>
  );
}

export default App;
