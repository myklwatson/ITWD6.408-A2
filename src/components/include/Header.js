//IMPORT

import { Link, useLocation } from "react-router-dom";
import { useEffect } from 'react';

 
//FUNCTION COMPONENT 
function Header () {
    //States

    //Data 
    const headerStyle = {
        minHeight: '15vh',
        backgroundColor: ' #293443'
    };

    const pagetitleStyle = {
        minHeight: '15vh',
        fontSize: '3em'

    };

    const homeButtonStyle = {
    backgroundColor: '#90b669',
    height: '50px'
    };

    const extensionButtonStyle = {
    backgroundColor: '#5e9597',
    height: '50px'
    };

    const pageContent = {
    '/': {
        pagetitle: 'Phone Fix Booking System',
        title: 'Home | Phone Fix Booking System',
    },
    '/AdvancedJS': {
        pagetitle: 'Advanced JS Demos',
        title: 'Advanced JS Demos | Phone Fix Booking System',
    },
    '/FAQ': {
        pagetitle: 'Frequently Asked Questions',
        title: 'FAQ | Phone Fix Booking System',
    },
    '/Bookings': {
        pagetitle: 'Bookings',
        title: 'Bookings | Phone Fix Booking System',
    },
    };
    

    //Function & Methods
    const location = useLocation();
    const currentPage = pageContent[location.pathname] || {
        pagetitle: 'Phone Fix Booking System',
        title: 'Phone Fix Booking System',
    };
 
    useEffect(() => {
        document.title = currentPage.title;
    }, [currentPage.title]);
 

    //UI Rendering
    return (
        <>
             <header className="row" style={headerStyle}>
                <div className="col-12 col-lg-8 text-center text-white fw-bold d-flex
                justify-content-center align-items-center" style={pagetitleStyle}>{currentPage.pagetitle}</div>
                <div className="col-12 col-lg-4">
                    <div className="row">
                        {/*Button 1*/}
                        <Link to="/" className="col-12 col-md-6 col-lg-6 p-0 m-0 border border-dark
                                            text-center fw-bold text-white d-flex align-items-center 
                                            justify-content-center" style={homeButtonStyle}>HOME</Link>
                        {/*Button 2*/}
                        <Link to="/AdvancedJS" className="col-12 col-md-6 col-lg-6 p-0 m-0 border border-dark
                                            text-center fw-bold text-white d-flex align-items-center 
                                            justify-content-center" style={extensionButtonStyle}>EXTENSION</Link>
                    </div>
                </div>
            </header>
        </>

    );
}


//EXPORT
export default Header;