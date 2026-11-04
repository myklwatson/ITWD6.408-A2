// IMPORT

// FUNCTION COMPONENT
function Footer() {
  // DATA
  const footerStyle = {
    minHeight: "10vh",
    fontSize: "1em",
    color: "white",
    backgroundColor: "#293443",

    // CENTRALISE CONTENT
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // UI RENDERING
  return (
    <>
      <footer style={footerStyle}>
        <p className="text-center">
          &copy; Michael Watson 2026 - All Rights Reserved.
        </p>
      </footer>
    </>
  );
}

// EXPORT
export default Footer;
