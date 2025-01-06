// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { VacationProvider } from './context/VacationContext';
import { DocumentProvider } from './context/DocumentContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChatProvider>
          <VacationProvider>
            <DocumentProvider>
              <Router>
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
              </Router>
            </DocumentProvider>
          </VacationProvider>
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;