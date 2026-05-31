import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './pages/LoginScreen';
import { AdminDashboard } from './pages/AdminDashboard';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem('role');
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
