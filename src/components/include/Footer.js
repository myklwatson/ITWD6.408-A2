//IMPORT

//FUNCTION COMPONENT 
function Footer() {

    //State
    
    //Data
    const footerStyle = {
        minHeight: '10vh',
        fontSize: '1.2em',
        color: 'white',
        backgroundColor: '#293443',
        /**centralise vert and horz content */
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    //Functions & Methods

    //UI Rendering
    return(
        <>
            <footer style={footerStyle}>
                <p className='text-center'>&copy; Michael Watson 2026 - All Rights Reserved.</p>
            </footer>
        </>
    );
}

//EXPORT
export default Footer;