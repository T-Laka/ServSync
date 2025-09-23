import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import ComplaintsList from './components/Manager/ComplaintsList.jsx';
import ComplaintDetails from './components/Manager/ComplaintDetails.jsx';

function AppContent() {
  const location = useLocation();
  // Hide navbar for any route that starts with /admin
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}
      <Routes>
        {/* Manager complaint routes (more specific routes first) */}
        <Route path="/manager/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/manager/complaints" element={<ComplaintsList />} />

        {/* Dashboards */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />
    
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
