//FUNCTION COMPONENT 
function FormCustomerDetail() {
 
    //Component UI Rendering
    return(
        <div className="p-3">
        <h2>Customer Details</h2>
            {/*Customer type*/}
            <div className="row mb-3">
                <fieldset className="border border-dark col-12 col-lg-11 ms-2 me-4 p-3">
                <legend className="col-11 float-none w-auto">Customer Type *</legend>
            <div>
                <label className="col-12 col-md-12 col-lg-4">Customer</label>
                <input type="radio" name="customer-type" value="customer" defaultChecked required/>
            </div>
            
            <div>
                <label className="col-12 col-md-12 col-lg-4">Business</label>
                <input type="radio" name="customer-type" value="business" required/>
            </div>
            </fieldset>
            </div>

            {/*Details*/}
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">Title: *</label>
                <select defaultValue="Mr" required className="col-12 col-md-12 col-lg-7">
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                </select>
            </div> 
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">First Name: *</label>
                <input className="col-12 col-md-12 col-lg-7" type="text"
                    pattern="^[A-Za-z\s\-\u2014]+$" title="Only letters, spaces, hyphens, and em-dashes are allowed"
                    onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s\-\u2014]/g, '')}
                    required/>
            </div>
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">Last Name: *</label>
                <input className="col-12 col-md-12 col-lg-7" type="text" 
                    pattern="^[A-Za-z\s\-\u2014]+$" title="Only letters, spaces, hyphens, and em-dashes are allowed"
                    onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z\s\-\u2014]/g, '')}
                    required/>
            </div>
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">Street: *</label>
                <input className="col-12 col-md-12 col-lg-7" type="text" required/>
            </div>
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">Suburb:</label>
                <input className="col-12 col-md-12 col-lg-7" type="text" />
            </div>
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">City: *</label>
                <input className="col-12 col-md-12 col-lg-7" type="text" required/>
            </div>
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">PostCode:</label>
                <input className="col-12 col-md-12 col-lg-7" type="text"
                    inputMode="numeric" pattern="[0-9]{4}" maxLength={4}
                    title="Postcode must be 4 digits"
                    onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    }}
                    />
            </div>
            <div className="row mb-3 g-2">
                <label className="col-12 col-md-12 col-lg-4">Phone: *</label>
                <input className="col-12 col-md-12 col-lg-7" type="tel"
                    inputMode="tel" pattern="[0-9\s\(\)\-+]+"
                    title="Only numbers, spaces, and ( ) - + symbols are allowed"
                    onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9\s()\-+]/g, "");
            }}
            required />
            </div>
            <div className="row mb-2 g-2">
                <label className="col-12 col-md-12 col-lg-4">Email: *</label>
                <input className="col-12 col-md-12 col-lg-7" type="email" required/>
            </div>
        </div>
    );
}

//EXPORT
export default FormCustomerDetail; 