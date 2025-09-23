import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminAnalytics from './components/Admin/AdminAnalytics.jsx';
import UserList from './components/UserManagement/UserList.jsx';
import SessionList from './components/SessionManagement/SessionManager.jsx';
import SessionCreatePage from './components/SessionManagement/SessionCreatePage.jsx';
//import ComplaintsList from './components/Admin/ComplaintsList.jsx';
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
      {/* Admin nested layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminAnalytics />} />
          <Route path="users" element={<UserList />} />
          <Route path="sessions" element={<SessionList />} />
          <Route path="sessions/create" element={<SessionCreatePage />} />
          {/* <Route path="complaints" element={<ComplaintsList />} /> */}
        </Route>

      {/* Manager complaint routes */}
      <Route path="/manager/complaints/:id" element={<ComplaintDetails />} />
      <Route path="/manager/complaints" element={<ComplaintsList />} />

     
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
