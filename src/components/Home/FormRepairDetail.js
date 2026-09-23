//IMPORT
import { useState } from "react";

// Local date as YYYY-MM-DD (toISOString() would give the UTC date, which is off by a day for part of each day in NZ)
const toLocalISO = (d) => d.toLocaleDateString("en-CA");
 
// True if the purchase date is more than 24 calendar months before today
const isOverTwoYears = (value) => {
    if (!value) return false;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setMonth(cutoff.getMonth() - 24);
    return new Date(value + "T00:00:00") < cutoff;
};

//FUNCTION COMPONENT 
function FormRepairDetail() {
 
    //State
    const [purchaseDate, setPurchaseDate] = useState("");
    const [warranty, setWarranty] = useState(false);
 
    //Date limits
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
 
    //Warranty is disabled until a purchase date is entered, and when it is over 24 months old.
    // (To leave it enabled until a date is entered, use: isOverTwoYears(purchaseDate))
    const warrantyDisabled = !purchaseDate || isOverTwoYears(purchaseDate);
 
    //Functions & Methods
    const handlePurchaseDateChange = (e) => {
        const value = e.target.value;
        setPurchaseDate(value);
        // Untick the box if it is about to become disabled, so a stale "true" isn't submitted
        if (!value || isOverTwoYears(value)) setWarranty(false);
    };


    //Component UI Rendering
    return (
        <div className="p-3">
            <h2>Repair Details</h2>
 
            {/*Purchase date: cannot be in the future*/}
            <div className="row mb-3 g-2">
                <label htmlFor="purchaseDate" className="col-12 col-md-12 col-lg-4">Purchase Date *</label>
                <input id="purchaseDate" name="purchaseDate" className="col-12 col-md-12 col-lg-7"
                    type="date"
                    max={toLocalISO(today)}
                    value={purchaseDate}
                    onChange={handlePurchaseDateChange}
                    required />
            </div>
 
            {/*Repair date: must be after today (so also after the purchase date)*/}
            <div className="row mb-3 g-2">
                <label htmlFor="repairDate" className="col-12 col-md-12 col-lg-4">Repair Date *</label>
                <input id="repairDate" name="repairDate" className="col-12 col-md-12 col-lg-7"
                    type="date"
                    min={toLocalISO(tomorrow)}
                    required />
            </div>
 
            {/*Under Warranty*/}
            <div className="row mb-3 g-2">
                <fieldset className="border border-dark col-12 col-lg-11 ms-1 me-4 mb-3 p-3">
                    <legend className="col-11 float-none w-auto">Under Warranty</legend>
                    <div>
                        <label htmlFor="warrantyCheck" className="col-12 col-md-12 col-lg-4">Warranty</label>
                        <input type="checkbox" id="warrantyCheck" name="warranty" className="ms-2"
                            disabled={warrantyDisabled}
                            checked={warranty}
                            onChange={(e) => setWarranty(e.target.checked)}
                        />
                    </div>
                </fieldset>
            </div>
 
            {/*Other details*/}
            <div className="row mb-3 g-2">
                <label htmlFor="imei" className="col-12 col-md-12 col-lg-4">IMEI *</label>
                <input id="imei" name="imei" className="col-12 col-md-12 col-lg-7" type="text"
                    inputMode="numeric" pattern="[0-9]{15}" maxLength={15}
                    title="IMEI must be exactly 15 digits"
                    onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 15); }}
                    required />
            </div>
 
            {/*Make*/}
            <div className="row mb-3 g-2">
                <label htmlFor="make" className="col-12 col-md-12 col-lg-4">Make *</label>
                <select id="make" name="make" className="col-12 col-md-12 col-lg-7"
                    defaultValue="apple" required>
                    <option value="apple">Apple</option>
                    <option value="lg">LG</option>
                    <option value="motorola">Motorola</option>
                    <option value="nokia">Nokia</option>
                    <option value="samsung">Samsung</option>
                    <option value="sony">Sony</option>
                    <option value="other">Other</option>
                </select>
            </div>
 
            {/*Model Number: not in the spec, so optional here. Add "*" to the label and `required` if it should be mandatory.*/}
            <div className="row mb-3 g-2">
                <label htmlFor="modelNumber" className="col-12 col-md-12 col-lg-4">Model Number</label>
                <input id="modelNumber" name="modelNumber" className="col-12 col-md-12 col-lg-7" type="text" />
            </div>
 
            {/*Fault Category*/}
            <div className="row mb-3 g-2">
                <label htmlFor="faultCategory" className="col-12 col-md-12 col-lg-4">Fault Category *</label>
                <select id="faultCategory" name="faultCategory" className="col-12 col-md-12 col-lg-7"
                    defaultValue="Battery" required>
                    <option value="Battery">Battery</option>
                    <option value="Charging">Charging</option>
                    <option value="Screen">Screen</option>
                    <option value="SD-storage">SD-storage</option>
                    <option value="Software">Software</option>
                    <option value="Other">Other</option>
                </select>
            </div>
 
            {/*Description*/}
            <div className="row mb-3 g-2">
                <label htmlFor="description" className="col-12 col-md-12 col-lg-4">Description *</label>
                <textarea id="description" name="description" className="col-12 col-md-12 col-lg-7"
                    rows="5" style={{ resize: "none" }} required />
            </div>
        </div>
    );
}

//EXPORT
export default FormRepairDetail; 