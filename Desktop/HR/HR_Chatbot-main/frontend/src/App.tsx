// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { VacationProvider } from './context/VacationContext';
import { DocumentProvider } from './context/DocumentContext';
import { TicketProvider } from './context/TicketContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import DocumentPage from './pages/DocumentPage';
import VacationPage from './pages/VacationPage';
import TicketsPage from './pages/TicketsPage';

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ChatProvider>
            <VacationProvider>
              <DocumentProvider>
                <TicketProvider>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <DocumentPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/vacation" element={<VacationPage />} />
                    <Route
                      path="/tickets"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <TicketsPage />
                        </ProtectedRoute>
                      }
                    />
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
                </TicketProvider>
              </DocumentProvider>
            </VacationProvider>
          </ChatProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;