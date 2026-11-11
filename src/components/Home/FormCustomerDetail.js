// IMPORT
import { useState, useEffect } from "react";
import { AddressAutofill } from "@mapbox/search-js-react"; // Mapbox Address Autofill 


// FUNCTION COMPONENT
function FormCustomerDetail({ passDataToParent, sendCustomerDetails }) {
  // STATE - customer type
  const [customerType, setCustomerType] = useState("customer");

  // STATE - customer details
  const [customerDetails, setCustomerDetails] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    street: "",
    suburb: "",
    city: "",
    postCode: "",
    phone: "",
    email: "",
  });

  // CONSTANTS
  // Public Mapbox token
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  
  // HANDLERS
  // UPDATE CUSTOMER TYPE AND PASS TO PARENT
  const updateCustomerType = (event) => {
    setCustomerType(event.target.value);
    passDataToParent(event.target.value); // Pass the selected customer type to the parent component
  };

  // HANDLE CHANGES ON INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Mapbox calls this when the user picks a suggestion:
  // the inputs are controlled by React, so state must be updated, not just the screen
  const handleRetrieve = (response) => {
      const address = response.features[0].properties;
      setCustomerDetails(prev => ({
          ...prev,
          street: address.address_line1 || prev.street,
          suburb: address.address_level3 || "",
          city: address.address_level2 || prev.city,
          postCode: address.postcode || ""
      }));
  };

  // SEND CUSTOMER DETAILS TO PARENT COMPONENT
  useEffect(() => {
    sendCustomerDetails(customerDetails);
  }, [customerDetails, sendCustomerDetails]);

  // UI RENDERING
  return (
    <div className="p-1">
      {" "}
      {/* component padding */}
      <h2>Customer Details</h2>
      {/*Customer type selection*/}
      <div className="row mb-3">
        <fieldset className="border border-dark col-11 ms-3 me-3 p-3">
          <legend className="col-11 float-none w-auto">Customer Type *</legend>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="customer-type"
              id="customer-type-customer"
              value="customer"
              checked={customerType === "customer"}
              onChange={updateCustomerType}
              required
            />
            <label className="form-check-label" htmlFor="customer-type-customer">
              Customer
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="customer-type"
              id="customer-type-business"
              value="business"
              checked={customerType === "business"}
              onChange={updateCustomerType}
              required
            />
            <label className="form-check-label" htmlFor="customer-type-business">
              Business
            </label>
          </div>
        </fieldset>
      </div>
      {/*Details Form*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="title" className="col-12 col-lg-4 ">
          Title: *
        </label>
        <select
          className="col-12 col-lg-7"
          id="title"
          defaultValue="Mr"
          name="title"
          onChange={handleChange}
          required
        >
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Ms">Ms</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>
      </div>
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="firstName" className="col-12 col-lg-4 ">
          First Name: *
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="firstName"
          name="firstName"
          pattern="^[A-Za-z\s\-\u2014\u2013]+$"
          title="Only letters, spaces, hyphens, and em-dashes are allowed"
          onInput={(e) =>
            (e.target.value = e.target.value.replace(
              /[^A-Za-z\s\-\u2014\u2013]/g,
              "",
            ))
          } // pattern validation
          onChange={handleChange}
          required
        />
      </div>
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="lastName" className="col-12 col-lg-4 ">
          Last Name: *
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="lastName"
          name="lastName"
          pattern="^[A-Za-z\s\-\u2014\u2013]+$"
          title="Only letters, spaces, hyphens, and em-dashes are allowed"
          onInput={(e) =>
            (e.target.value = e.target.value.replace(
              /[^A-Za-z\s\-\u2014\u2013]/g,
              "",
            ))
          } // pattern validation
          onChange={handleChange}
          required
        /> 
      </div>
      <AddressAutofill
        accessToken={MAPBOX_TOKEN}
        options={{ country: "NZ" }}
        onRetrieve={handleRetrieve}
      >
        <div>
          <div className="row mb-3 g-2 ms-2 me-2">
            <label htmlFor="street" className="col-12 col-lg-4 ">
              Street: *
            </label>
            <input
              className="col-12 col-lg-7"
              type="text"
              id="street"
              name="street"
              autoComplete="address-line1"
              placeholder=""
              value={customerDetails.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row mb-3 g-2 ms-2 me-2">
            <label htmlFor="suburb" className="col-12 col-lg-4 ">
              Suburb:
            </label>
            <input
              className="col-12 col-lg-7"
              type="text"
              id="suburb"
              name="suburb"
              autoComplete="address-level3"
              value={customerDetails.suburb}
              onChange={handleChange}
            />
          </div>
          <div className="row mb-3 g-2 ms-2 me-2">
            <label htmlFor="city" className="col-12 col-lg-4 ">
              City: *
            </label>
            <input
              className="col-12 col-lg-7"
              type="text"
              id="city"
              name="city"
              autoComplete="address-level2"
              value={customerDetails.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row mb-3 g-2 ms-2 me-2">
            <label htmlFor="postCode" className="col-12 col-lg-4 ">
              PostCode:
            </label>
            <input
              className="col-12 col-lg-7"
              type="text"
              id="postCode"
              name="postCode"
              autoComplete="postal-code"
              value={customerDetails.postCode}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4} // postcode must be 4 digits
              title="Postcode must be 4 digits"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
              }}
            />
          </div>
        </div>
      </AddressAutofill>
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="phone" className="col-12 col-lg-4 ">
          Phone: *
        </label>
        <input
          className="col-12 col-lg-7"
          type="tel"
          id="phone"
          name="phone"
          onChange={handleChange}
          inputMode="tel"
          pattern="[0-9\s\(\)\-+]+"
          title="Only numbers, spaces, and ( ) - + symbols are allowed"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9\s()\-+]/g, ""); // check phone symbol input
          }}
          autoComplete="tel"
          required
        />
      </div>
      <div className="row mb-2 g-2 ms-2 me-2">
        <label htmlFor="email" className="col-12 col-lg-4 ">
          Email: *
        </label>
        <input
          className="col-12 col-lg-7"
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>
    </div>
  );
}

// EXPORT
export default FormCustomerDetail;