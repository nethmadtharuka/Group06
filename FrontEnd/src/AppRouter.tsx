import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminVendorsPage } from './pages/AdminVendorsPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminMessagesPage } from './pages/AdminMessagesPage';
import { AdminMessagesView } from './pages/AdminMessagesView';
import { AdminEventDetailsPage } from './pages/AdminEventDetailsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { Loading } from './components/Loading';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';

function AppRoutes() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);

  useEffect(() => {
    // Show loading on route change
    setIsLoading(true);
    setLoadingKey(prev => prev + 1);
    
    // Hide loading after a short delay (simulating page load)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <>
      <BackgroundAnimation 
        orbOpacity={isLandingPage ? 60 : 30} 
        gridOpacity={isLandingPage ? 40 : 20} 
      />
      <AnimatePresence mode="wait">
        {isLoading && <Loading key={loadingKey} />}
        {!isLoading && (
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminMessagesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/messages/view" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminMessagesView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminEventsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events/:id" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminEventDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/vendors" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminVendorsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminReportsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminSettingsPage />
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
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } 
          />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}