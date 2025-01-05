// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { VacationProvider } from './context/VacationContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Here you could send error to your error tracking service
    console.error('Application Error:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <AuthProvider>
        <ChatProvider>
          <VacationProvider>
            <Router>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary>
                          <ChatPage />
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </ErrorBoundary>
            </Router>
          </VacationProvider>
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;