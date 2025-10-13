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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}