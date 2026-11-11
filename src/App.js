// IMPORT

import "./App.css";
import Header from "./components/include/Header.js";
import Home from "./components/Home.js";
import Footer from "./components/include/Footer.js";
import AdvancedJS from "./components/AdvancedJS.js";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import FAQ from "./components/FAQ.js";
import Bookings from "./components/Bookings.js";
import { useEffect } from "react";
import Login from "./components/Login.js";
import { AuthProvider } from "./components/AuthContext.js";

// FUNCTIONS
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// FUNCTION COMPONENT
function App() {
  // UI RENDERING
  return (
    <>
      <div style={{ overflowX: "hidden" }}>
        {" "}
        {/* hide x scroll due to initial bootstrap margin settings */}
        <AuthProvider>
          <BrowserRouter>
            {/* ScrollToTop Function */}
            <ScrollToTop />

            {/* Header Component */}
            <Header />

            <Routes>
              {/* Home Component */}
              <Route path="/" element={<Home />} />

              {/* Extension Component */}
              <Route path="/AdvancedJS" element={<AdvancedJS />} />

              {/* FAQ Component */}
              <Route path="/FAQ" element={<FAQ />} />

              {/* Bookings Component */}
              <Route path="/Bookings" element={<Bookings />} />

              {/* Login / Register / Account Component */}
              <Route path="/Login" element={<Login />} />
            </Routes>

            {/* Footer Component */}
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  );
}

// EXPORT
export default App;
