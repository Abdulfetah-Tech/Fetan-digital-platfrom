import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages for Performance
const Home = React.lazy(() => import('./pages/Home'));
const Services = React.lazy(() => import('./pages/Services'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Messages = React.lazy(() => import('./pages/Messages'));

// Wrapper component to protect routes
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

// Wrapper for public routes that redirect if logged in
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (user) {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/profile/:id" element={<Profile />} />
            
            <Route 
              path="/login" 
              element={<PublicRoute><Login /></PublicRoute>} 
            />
            <Route 
              path="/register" 
              element={<PublicRoute><Login initialMode="register" /></PublicRoute>} 
            />
             <Route 
              path="/forgot-password" 
              element={<PublicRoute><ForgotPassword /></PublicRoute>} 
            />
            
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
            />
            
            <Route 
               path="/messages" 
               element={<ProtectedRoute><Messages /></ProtectedRoute>} 
            />
            <Route 
               path="/messages/:conversationId" 
               element={<ProtectedRoute><Messages /></ProtectedRoute>} 
            />

          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
};

export default App;