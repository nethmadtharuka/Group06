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
}