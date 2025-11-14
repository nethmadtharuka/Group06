<<<<<<< Updated upstream
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VendorsPage from "./pages/VendorsPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import ContractsPage from "./pages/ContractsPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import NotificationsPage from "./pages/NotificationsPage.jsx";


export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <HeaderBar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* users route removed from primary nav but kept for direct access if needed */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
=======
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { App } from './App';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { UserProfile } from './pages/UserProfile';
import { VendorsPage } from './pages/VendorsPage';
import { VendorDetailsPage } from './pages/VendorDetailsPage';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { ManageVendor } from './pages/ManageVendor';
import { Messages } from './pages/Messages';
import { PaymentGateway } from './pages/PaymentGateway';
import { RegisterVendor } from './pages/RegisterVendor';
import { LandingPage } from './pages/LandingPage';
import { MyEventsPage } from './pages/MyEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventFeaturedVendorsPage } from './pages/EventFeaturedVendorsPage';
import { EventCurrentBookingsPage } from './pages/EventCurrentBookingsPage';
import { CreateContractPage } from './pages/CreateContractPage';
import { ContractReviewPage } from './pages/ContractReviewPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export function AppRouter() {
  return <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route 
            path="/vendor/manage" 
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <ManageVendor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/register" 
            element={
              <ProtectedRoute>
                <RegisterVendor />
              </ProtectedRoute>
            } 
          />
          <Route path="/vendor/:id" element={<VendorDetailsPage />} />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/event/create" 
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/event/:id" 
            element={
              <ProtectedRoute>
                <EventDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/event/:id/bookings" 
            element={
              <ProtectedRoute>
                <EventCurrentBookingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/event/:id/vendors" 
            element={
              <ProtectedRoute>
                <EventFeaturedVendorsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contract/new" 
            element={
              <ProtectedRoute>
                <CreateContractPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contract/review" 
            element={
              <ProtectedRoute>
                <ContractReviewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <PaymentGateway />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>;
>>>>>>> Stashed changes
}