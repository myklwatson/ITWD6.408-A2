//FUNCTION COMPONENT 
function FormCost() {

 //Component UI Rendering
 return(
    <div className="p-3">
        <h2>Cost</h2>
            <div className="row mb-3 g-2 ms-3 mt-1">
                <label className="col-12 col-md-12 col-lg-4">Bond ($)</label>
                <input className="col-12 col-md-12 col-lg-7" type="number" value="0.00" readonly />
            </div>
            <div className="row mb-3 g-2 ms-3">
                <label className="col-12 col-md-12 col-lg-4">Service Fee ($)</label>
                <input className="col-12 col-md-12 col-lg-7" type="number" value="85.00" readonly/>
            </div>
            <div className="row mb-3 g-2 ms-3">
                <label className="col-12 col-md-12 col-lg-4">Total ($)</label>
                <input className="col-12 col-md-12 col-lg-7" type="number" value="0.00" readonly />
            </div>
            <div className="row mb-3 g-2 ms-3">
                <label className="col-12 col-md-12 col-lg-4">GST ($)</label>
                <input className="col-12 col-md-12 col-lg-7" type="number" value="0.00" readonly />
            </div>
            <div className="row mb-1 g-2 ms-3">
                <label className="col-12 col-md-12 col-lg-4">Total (incl. GST) ($)</label>
                <input className="col-12 col-md-12 col-lg-7" type="number" value="0.00" readonly />
            </div>
    </div>
);
}

//EXPORT
export default FormCost; 