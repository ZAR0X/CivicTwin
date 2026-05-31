import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './pages/LoginScreen';
import { AdminDashboard } from './pages/AdminDashboard';

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
  );
}

export default App;
