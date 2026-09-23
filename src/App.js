//IMPORT

import './App.css';
import Header from "./components/include/Header";
import Home from "./components/Home.js";
import Footer from "./components/include/Footer";
import AdvancedJS from "./components/AdvancedJS";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import FAQ from "./components/FAQ";
import Bookings from "./components/Bookings";
import {useEffect} from 'react';



  // Functions & Methods
  function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}



//FUNCTION COMPONENT
function App() {
  



  //UI Rendering
  return (
    <>
      <div style={{overflowX:'hidden'}}>
      
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


//EXPORT
export default App;
