import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from './pages/LandingPage';
import ApplicationForm from './pages/ApplicationForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TalkTechForm from './pages/TalkTechForm';
import TalkTechDashboard from './pages/TalkTechDashboard';
import MicroBotsForm from './pages/MicroBotsForm';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAdminAuthenticated(true);
    navigate('/dashboard-1');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
    navigate('/dashboard-1');
  };

  const handleBackToForm = () => {
    navigate('/syria-gaming-lab');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Routes>
      {/* Main Landing Page - Smart Syria Portal */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Syria Gaming Lab Routes */}
      <Route path="/syria-gaming-lab" element={<ApplicationForm />} />
      <Route 
        path="/dashboard-1" 
        element={
          isAdminAuthenticated ? (
            <AdminDashboard onLogout={handleLogout} onBackToForm={handleBackToForm} onBackToHome={handleBackToHome} />
          ) : (
            <AdminLogin onLogin={handleLogin} onBackToForm={handleBackToForm} onBackToHome={handleBackToHome} />
          )
        } 
      />
      
      {/* Talk Tech Bloom Routes */}
      <Route path="/talk-tech-bloom" element={<TalkTechForm />} />
      <Route path="/dashboard-2" element={<TalkTechDashboard />} />
      
      {/* Micro-bots Routes */}
      <Route path="/micro-bots" element={<MicroBotsForm />} />
      
      {/* Legacy routes - redirect to new paths */}
      <Route path="/admin" element={
        isAdminAuthenticated ? (
          <AdminDashboard onLogout={handleLogout} onBackToForm={handleBackToForm} onBackToHome={handleBackToHome} />
        ) : (
          <AdminLogin onLogin={handleLogin} onBackToForm={handleBackToForm} onBackToHome={handleBackToHome} />
        )
      } />
      <Route path="/admin/dashboard" element={
        isAdminAuthenticated ? (
          <AdminDashboard onLogout={handleLogout} onBackToForm={handleBackToForm} onBackToHome={handleBackToHome} />
        ) : (
          <AdminLogin onLogin={handleLogin} onBackToForm={handleBackToForm} onBackToHome={handleBackToHome} />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1F2937',
              border: '2px solid #374151',
              color: '#F3F4F6',
              fontFamily: "'Space Mono', monospace",
            },
          }}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
