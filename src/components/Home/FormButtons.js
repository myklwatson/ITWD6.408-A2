// IMPORT

// FUNCTION COMPONENT
function FormButtons({ resetForm }) {
  // BUTTON STYLE
  const buttonStyle = {
    width: "6em",
    height: "3em",
  };

  // UI RENDERING
  return (
    <div>
      <input
        type="submit"
        className="btn me-3 fw-bold text-dark bg-white"
        style={buttonStyle}
        value="SUBMIT"
      />
      <input
        type="button"
        className="btn me-3 fw-bold text-dark bg-white"
        style={buttonStyle}
        value="RESET"
        onClick={resetForm}
      />

      <input
        type="button"
        className="btn fw-bold text-dark bg-white"
        style={buttonStyle}
        value="FAQ"
        onClick={() => window.open("/FAQ", "_blank")}
      />
    </div>
  );
}

// EXPORT
export default FormButtons;
