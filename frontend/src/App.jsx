// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Admin from './components/Admin';
import ChangePassword from "./components/ChangePassword"
import ProtectedRoute from './components/ProtectedRoute';
import RegOTP from './components/RegOTP';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reg-otp" element={<RegOTP />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;
