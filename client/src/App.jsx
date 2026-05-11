import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import TestRoom from './pages/TestRoom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen futuristic-gradient">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/test/:id" element={<TestRoom />} />
        </Routes>
        {/* <Toaster position="top-right" /> */}
      </div>
    </Router>
  );
}

export default App;
