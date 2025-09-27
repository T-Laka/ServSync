import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// adnin area

import AdminLayout from './layouts/AdminLayout.jsx';
import AdminAnalytics from './components/Admin/AdminAnalytics.jsx';
import UserList from './components/UserManagement/UserList.jsx';
import SessionList from './components/SessionManagement/SessionManager.jsx';
import SessionCreatePage from './components/SessionManagement/SessionCreatePage.jsx';


//manager area
// Manager pages (your components)
import ManagerLayout from './layouts/ManagerLayout.jsx';
import ManagerOverview from "./components/Manager/ManagerOverview";
import ComplaintsList from "./components/Manager/ComplaintsList";
import FeedbackList from "./components/Manager/FeedbackList";
import Analytics from "./components/Manager/Analytics";
import ComplaintDetails from "./components/Manager/ComplaintDetails";

// user area
import Home from './pages/Home.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Support from './pages/Support.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import NotFound from './pages/NotFound.jsx';
import PublicLayout from './layouts/UserLayout.jsx';
// booking flow pages
import InsuranceSelect from './pages/book/InsuranceSelect.jsx';
import BranchSelect from './pages/book/BranchSelect.jsx';
import Schedule from './pages/book/Schedule.jsx';
import Confirm from './pages/book/Confirm.jsx';



function AppContent() {
  return (
    <Routes>
      {/* Public pages (with NavBar) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/support" element={<Support />} />
  {/* legacy appointments removed — use /book flow */}
        <Route path="/feedback/new" element={<FeedbackPage />} />
        {/* Booking flow */}
        <Route path="/book" element={<InsuranceSelect />} />
        <Route path="/book/:insuranceType" element={<BranchSelect />} />
        <Route path="/book/:insuranceType/:branchId" element={<Schedule />} />
        <Route path="/book/:insuranceType/:branchId/confirm" element={<Confirm />} />
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
      {/* Manager (NEW nested routes) */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerOverview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<FeedbackList />} />
          <Route path="complaints" element={<ComplaintsList />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
          {/* <Route path="settings" element={<ManagerSettings />} /> */}
        </Route>

     
      

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
