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
          </Routes>

          {/* Footer Component */}
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

// EXPORT
export default App;
