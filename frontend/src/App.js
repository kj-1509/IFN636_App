import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/admindashboard';
import AdminUsers from './pages/admin/adminusers';
import AdminThreads from './pages/admin/adminthreads';
import AdminTopics from './pages/admin/admintopics';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* User routes */}
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/profile"       element={<Profile />} />
          {/* Admin routes */}
          <Route path="/admin"         element={<AdminDashboard />} />
          <Route path="/admin/users"   element={<AdminUsers />} />
          <Route path="/admin/threads" element={<AdminThreads />} />
          <Route path="/admin/topics"  element={<AdminTopics />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
