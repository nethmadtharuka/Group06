import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { VendorRegistrationPage } from "./pages/VendorRegistrationPage";
import { VendorListPage } from "./pages/VendorListPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Routes>
          <Route path="/" element={<VendorRegistrationPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}