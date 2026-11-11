//IMPORT
import { Link } from "react-router-dom"; // Link used to jump to the page where each feature lives

//CONSTANTS - advanced JavaScript features, each one built into the page named in "where"
// To document a new feature, add one object to this array (the page builds the tabs from it)
const FEATURES = [
  {
    id: "featureSearch",
    title: "SEARCH & SORT",
    heading: "Search, Filter and Sort Bookings",
    where: "Bookings page, above the booking cards",
    link: "/Bookings",
    description:
      "Staff can search the repair bookings by job number, name, email, phone, IMEI or model, filter them by customer type, make and fault category, and sort them by date, repair date, total or customer name. A counter shows how many bookings match, and a button clears all filters.",
    techniques: [
      "Array.filter with several conditions to apply the search and filters",
      "Array.sort with comparison functions held in an options array",
      "Set to build the make and fault dropdowns from the data itself",
      "useMemo so the list is only recalculated when a control changes",
      "Controlled inputs, with the list derived from state instead of stored twice",
    ],
    files: "src/components/Bookings.js",
    expanded: true, // first item is open by default
  },

  {
    id: "featureDragDrop",
    title: "DRAG & DROP",
    heading: "Drag and Drop for Courtesy Phone and Charger Selection",
    where: "Home page, Courtesy Phone section of the booking form",
    link: "/",
    description:
      "The customer picks a courtesy phone and/or charger by dragging items from the Available list into the Selected list (and back again to remove them). Each item shows its bond, the total bond updates straight away and is passed to the cost calculation, and business customers see the bond struck through with a note that no bond is required. Items can also be chosen with a click or the keyboard, so the form works without a mouse.",
    techniques: [
      "HTML5 Drag and Drop API: dragstart, dragover, dragleave, drop and dragend events",
      "event.dataTransfer to carry the dragged item, and preventDefault on dragover to allow a drop",
      "Derived values (selected items, available items, total bond) worked out from state instead of stored",
      "Child-to-parent callbacks and useEffect to send the selection and bond to Home",
      "Keyboard and click alternatives for accessibility",
    ],
    files: "src/components/Home/FormCourtesyPhone.js",
    acknowledgement:
      "The drag and drop events follow the provided Drag and Drop demo and the W3Schools HTML Drag and Drop API tutorial (W3Schools, n.d.), https://www.w3schools.com/html/html5_draganddrop.asp. The selection lists, bond calculation, business-customer handling and keyboard support were added by me.",
  },

  {
    id: "featureAddress",
    title: "ADDRESS AUTOCOMPLETE",
    heading: "Address Autocomplete in the Booking Form",
    where:
      "Home page, Customer Details section (Street, Suburb, City and PostCode)",
    link: "/",
    description:
      "As the customer types their street address, suggestions for New Zealand addresses appear. Choosing one fills in the street, suburb, city and postcode automatically, which reduces typing errors and speeds up the booking.",
    techniques: [
      "Third-party component (Mapbox Address Autofill) wrapped around controlled inputs",
      "autocomplete attributes to tell the component which input is which address part",
      "onRetrieve callback that writes the chosen address into React state",
      "Functional state update with the spread operator to change several fields at once",
      "Access token kept in an environment variable (.env.local) instead of the source code",
    ],
    files: "src/components/Home/FormCustomerDetail.js",
    acknowledgement:
      "Address suggestions use the Mapbox Address Autofill service and the @mapbox/search-js-react package (Mapbox, n.d.), https://www.mapbox.com/address-autofill. The state handling that connects it to the form was written by me.",
  },

  {
    id: "featurePhoto",
    title: "PHOTO UPLOAD",
    heading: "Upload a Photo of the Phone Fault",
    where:
      "Home page, Repair Details (upload); Bookings page (photo shown on each card)",
    link: "/",
    description:
      "The customer can attach a photo of the damage. It is checked (image type, under 5 MB), previewed immediately, uploaded to Supabase Storage when the booking is submitted, and its public link is saved with the booking and shown on the booking card.",
    techniques: [
      "File input and the File object, with type and size validation",
      "URL.createObjectURL with useMemo and cleanup for the instant preview",
      "async/await upload to Supabase Storage with a unique UUID file name",
      "getPublicUrl to store the link in the bookings table",
      "try/catch so a failed upload stops the booking being saved",
    ],
    files:
      "src/components/Home/FormRepairDetail.js, src/components/Home.js, src/components/Bookings.js",
    acknowledgement:
      'The upload and public URL steps follow the provided demo "React App and Upload File to Supabase" and the Supabase Storage standard uploads guide (Supabase, n.d.), https://supabase.com/docs/guides/storage/uploads/standard-uploads. The image preview, validation and unique file names were added by me.',
  },

  {
    id: "featureAuth",
    title: "ACCOUNTS & LOGIN",
    heading: "Sign Up, Log In, Log Out and Manage Your Profile",
    where:
      "Account page (LOGIN / ACCOUNT in the header); the Bookings page and booking form use the login",
    link: "/Login",
    description:
      "Customers can register, log in and log out, and manage a profile (name, phone, address and password). Bookings made while logged in are linked to the account: customers see only their own bookings, staff see and manage every booking, and a read-only viewer role lets a marker see all bookings without changing them. Roles are set in the database, so users cannot promote themselves.",
    techniques: [
      "Supabase Auth: signUp, signInWithPassword, signOut, updateUser and onAuthStateChange",
      "React Context (AuthProvider and a useAuth hook) to share the logged-in user and role with every page",
      "A database trigger that creates a profile row for each new account",
      "Row Level Security policies and a column-level grant so users cannot edit their own role",
      "Conditional rendering for logged-out, customer, staff and viewer views",
      "Object.entries and Object.fromEntries to clean the profile fields before saving",
    ],
    files:
      "src/components/AuthContext.js, src/components/Login.js, src/components/Bookings.js, src/components/Home.js, src/components/include/Header.js",
    acknowledgement:
      "Authentication uses Supabase Auth (Supabase, n.d.), https://supabase.com/docs/guides/auth, and the provided React and Supabase demo for connecting the client. The roles, profile page and access rules were designed and written by me.",
  },
];

//FUNCTION COMPONENT
function AdvancedJS() {
  //UI RENDERING
  return (
    <>
      <div style={{ minHeight: "60vh" }}>
        {/* Statement of authenticity (required at the top of this page by the brief) */}
        <div
          className="p-3 my-2 mx-auto border rounded"
          style={{ maxWidth: "1200px", backgroundColor: "#e3efce" }}
        >
          <h2 className="fs-4 fw-bold">Statement of Authenticity</h2>
          <p className="mb-1">I, Michael Watson, confirm that:</p>
          <ul className="mb-0">
            <li>This is an original assessment and is entirely my own work.</li>
            <li>
              It contains no material previously published or written by another
              person or myself except where due acknowledgement is made in the
              text.
            </li>
            <li>
              No material which to a substantial extent, has been submitted for
              any other academic course, is included without acknowledgement.
            </li>
          </ul>
            <p className="small mt-2 mb-0">
              <strong>Acknowledgement of AI assistance:</strong> As encouraged for this
                      extension, I used Claude (Anthropic) to help plan, write and debug the
                      advanced JavaScript features described below. I reviewed, tested and
                      adapted the code, and I understand how each feature works. Other
                      borrowed material is acknowledged in each feature's entry.
            </p>
        </div>

        {/* Accordion Display */}
        <div
          className="accordion row align-items-start p-2"
          id="accordionExample"
        >
          {/* Feature Buttons */}
          <div className="row col-12 col-lg-3">
            {FEATURES.map((item) => (
              <h2 className="accordion-header col-6 col-lg-12" key={item.id}>
                <button
                  className={`accordion-button ${item.expanded ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${item.id}`}
                  aria-expanded={item.expanded ? "true" : "false"}
                  aria-controls={item.id}
                >
                  {item.title}
                </button>
              </h2>
            ))}
          </div>

          {/* Feature Descriptions: what it is, where it lives and how it works */}
          <div className="col-12 col-lg-9">
            {FEATURES.map((item) => (
              <div className="accordion-item" key={item.id}>
                <div
                  id={item.id}
                  className={`accordion-collapse collapse ${item.expanded ? "show" : ""}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body" style={{ minHeight: "50vh" }}>
                    <h3 className="fw-bold">{item.heading}</h3>

                    <p className="mb-1">
                      <strong>Where this is implemented:</strong> {item.where}
                    </p>
                    <p className="mb-3">
                      <strong>Code that was edited:</strong> <code>{item.files}</code>
                    </p>

                    <p>{item.description}</p>

                    <h6>JS techniques that were used</h6>
                    <ul>
                      {item.techniques.map((technique) => (
                        <li key={technique}>{technique}</li>
                      ))}
                      
                    </ul>
                    {item.acknowledgement && (
                                            <p className="small text-muted">
                                              Acknowledgement: {item.acknowledgement}
                                            </p>
                                          )}
                    <Link to={item.link} className="btn btn-dark">
                      View Feature Implementation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdvancedJS;
