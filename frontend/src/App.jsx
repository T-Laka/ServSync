import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import ComplaintsList from './components/Manager/ComplaintsList.jsx';
import ComplaintDetails from './components/Manager/ComplaintDetails.jsx';

import Home from './pages/Home.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Support from './pages/Support.jsx';
import Appointments from './pages/Appointments.jsx';
import NotFound from './pages/NotFound.jsx';

import PublicLayout from './layouts/UserLayout.jsx';

function AppContent() {
  return (
    <Routes>
      {/* Public pages (with NavBar) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/appointments" element={<Appointments />} />
      </Route>

      {/* Manager complaint routes */}
      <Route path="/manager/complaints/:id" element={<ComplaintDetails />} />
      <Route path="/manager/complaints" element={<ComplaintsList />} />

      {/* Dashboards (no NavBar) */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/manager/*" element={<ManagerDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
