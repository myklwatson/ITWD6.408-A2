// IMPORT

import { Link, useLocation } from "react-router-dom"; // Link used for navigation, useLocation used to update header title
import { useEffect } from "react";

// FUNCTION COMPONENT
function Header() {
  //  CONSTANTS
  const headerStyle = {
    minHeight: "15vh",
    backgroundColor: " #293443",
  };

  const pagetitleStyle = {
    minHeight: "15vh",
    fontSize: "3em",
  };

  const homeButtonStyle = {
    backgroundColor: "#90b669",
    height: "50px",
  };

  const extensionButtonStyle = {
    backgroundColor: "#5e9597",
    height: "50px",
  };

  const bookingsButtonStyle = {
    backgroundColor: "#de8b6f",
    height: "50px",
  };

  // PAGE TITLE LINKING - header update
  const pageContent = {
    "/": {
      pagetitle: "Phone Fix Booking System",
      title: "Home | Phone Fix Booking System",
    },
    "/AdvancedJS": {
      pagetitle: "Javascript Extension",
      title: "Javascript Extension | Phone Fix Booking System",
    },
    "/FAQ": {
      pagetitle: "Frequently Asked Questions",
      title: "FAQ | Phone Fix Booking System",
    },
    "/Bookings": {
      pagetitle: "Bookings",
      title: "Bookings | Phone Fix Booking System",
    },
  };

  const location = useLocation();
  const currentPage = pageContent[location.pathname] || {
    pagetitle: "Phone Fix Booking System", // default titles
    title: "Phone Fix Booking System",
  };

  useEffect(() => {
    document.title = currentPage.title;
  }, [currentPage.title]);

  // UI RENDERING
  return (
    <>
      <header className="row" style={headerStyle}>
        <div
          className="col-12 col-lg-7 text-center text-white fw-bold d-flex
                    justify-content-center align-items-center"
          style={pagetitleStyle}
        >
          {currentPage.pagetitle}
        </div>
        <div className="col-12 col-lg-5">
          <div className="row">
            {/*Home Button*/}
            <Link
              to="/"
              className="col-12 col-md-4 p-0 m-0 border border-dark
                                            text-center fw-bold text-white d-flex align-items-center 
                                            justify-content-center"
              style={homeButtonStyle}
            >
              HOME
            </Link>
            {/*Extension Button*/}
            <Link
              to="/AdvancedJS"
              className="col-12 col-md-4 p-0 m-0 border border-dark
                                            text-center fw-bold text-white d-flex align-items-center 
                                            justify-content-center"
              style={extensionButtonStyle}
            >
              EXTENSION
            </Link>
            {/*Bookings Button*/}
            <Link
              to="/Bookings"
              className="col-12 col-md-4 p-0 m-0 border border-dark
                                            text-center fw-bold text-white d-flex align-items-center 
                                            justify-content-center"
              style={bookingsButtonStyle}
            >
              BOOKINGS
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

// EXPORT
export default Header;
