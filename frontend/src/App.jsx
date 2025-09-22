import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import Home from './pages/Home.jsx';
//import Navbar from './components/Navbar.jsx'; 

function AppContent() {
  const location = useLocation();
  // Hide navbar for any route that starts with /admin
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
