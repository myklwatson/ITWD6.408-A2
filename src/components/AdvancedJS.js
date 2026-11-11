//IMPORT
import { Link } from "react-router-dom"; // Link used to jump to the page where each feature lives


//CONSTANTS - advanced JavaScript features, each one built into the page named in "where"
// To document a new feature, add one object to this array (the page builds the tabs from it)
const FEATURES = [
    {
        id: 'featureSearch',
        title: 'SEARCH & SORT',
        heading: 'Search, filter and sort bookings',
        where: 'Bookings page, above the booking cards',
        link: '/Bookings',
        description: 'Staff can search the repair bookings by job number, name, email, phone, IMEI or model, filter them by customer type, make and fault category, and sort them by date, repair date, total or customer name. A counter shows how many bookings match, and a button clears all filters.',
        techniques: [
            'Array.filter with several conditions to apply the search and filters',
            'Array.sort with comparison functions held in an options array',
            'Set to build the make and fault dropdowns from the data itself',
            'useMemo so the list is only recalculated when a control changes',
            'Controlled inputs, with the list derived from state instead of stored twice',
        ],
        files: 'src/components/Bookings.js',
        expanded: true, // first item is open by default
    },

    {
        id: 'featureDragDrop',
        title: 'DRAG & DROP',
        heading: 'Drag and drop courtesy phone selection',
        where: 'Home page, Courtesy Phone section',
        link: '/',
        description: 'Customers can drag a courtesy phone or charger from the Available box into the Selected box, and drag it back to remove it, instead of using the dropdowns. Only one phone and one charger can be selected, and choosing another replaces the first. Items can also be moved by clicking or with the keyboard, so it still works on touch screens and without a mouse. The dropdowns, borrow table and bond cost all stay in sync.',
        techniques: [
            'HTML5 Drag and Drop API (draggable, dragstart, dragover, dragleave, drop, dragend, dataTransfer)',
            'preventDefault() on dragover to allow a drop, and a drag-over highlight on the target zone',
            'The selected and available lists are calculated from one piece of state, not stored twice',
            'Keyboard and click handlers as an accessible alternative',
        ],
        acknowledgement: 'Adapted from the ITWD6.408 "Drag and Drop" demo and W3Schools (n.d.), HTML Drag and Drop API, https://www.w3schools.com/html/html5_draganddrop.asp',
        files: 'src/components/Home/FormCourtesyPhone.js',
        expanded: false,
    },

    {
        id: 'featureAddress',
        title: 'ADDRESS AUTOCOMPLETE',
        heading: 'Address autocomplete in the booking form',
        where: 'Home page, Customer Details section (Street, Suburb, City and PostCode)',
        link: '/',
        description: 'As the customer types their street address, suggestions appear and choosing one fills in the street, suburb, city and postcode automatically. This reduces typing errors and speeds up the booking.',
        techniques: [
            'Third-party component (Mapbox Address Autofill) wrapped around controlled inputs',
            'autocomplete attributes to map each input to an address part',
            'onRetrieve callback that writes the chosen address into React state',
            'Functional state update with the spread operator to change several fields at once',
        ],
        files: 'src/components/Home/FormCustomerDetail.js',
        acknowledgement: 'Address suggestions use the Mapbox Address Autofill service and @mapbox/search-js-react (Mapbox, n.d.), https://www.mapbox.com/address-autofill, as recommended in the course material.',
    },

    {
        id: 'featurePhoto',
        title: 'PHOTO UPLOAD',
        heading: 'Upload a photo of the broken phone',
        where: 'Home page, Repair Details (upload); Bookings page (photo shown on each card)',
        link: '/',
        description: 'The customer can attach a photo of the damage. It is checked (image type, under 5 MB), previewed immediately, uploaded to Supabase Storage when the booking is submitted, and its public link is saved with the booking and shown on the booking card.',
        techniques: [
            'File input and the File object (type and size validation)',
            'URL.createObjectURL with useMemo and cleanup for the instant preview',
            'async/await upload to Supabase Storage with a unique UUID file name',
            'getPublicUrl to store the link in the bookings table',
            'try/catch so a failed upload stops the booking being saved',
        ],
        files: 'src/components/Home/FormRepairDetail.js, src/components/Home.js, src/components/Bookings.js',
        acknowledgement: 'The upload and public URL steps follow the ITWD6.408 demo "React App and Upload File to Supabase" and the Supabase Storage standard uploads guide (Supabase, n.d.), https://supabase.com/docs/guides/storage/uploads/standard-uploads. The image preview (Exercise 1) and the use of unique file names were added by me.',
    },

];


//FUNCTION COMPONENT
function AdvancedJS() {

    //UI RENDERING
    return (
        <>
            <div style={{ minHeight: '60vh' }}>

                {/* Statement of authenticity (required at the top of this page by the brief) */}
                <div className="p-3 my-2 mx-auto border rounded" style={{ maxWidth: "1200px", backgroundColor: "#e3efce" }}>
                    <h2 className="fs-4 fw-bold">Statement of Authenticity</h2>
                    <p className="mb-1">I, Michael Watson, confirm that:</p>
                    <ul className="mb-0">
                        <li>This is an original assessment and is entirely my own work.</li>
                        <li>It contains no material previously published or written by another person or myself except where due acknowledgement is made in the text.</li>
                        <li>No material which to a substantial extent, has been submitted for any other academic course, is included without acknowledgement.</li>
                    </ul>
                </div>

                {/* Accordion Display */}
                <div className="accordion row align-items-start p-2" id="accordionExample">

                    {/* Feature Buttons */}
                    <div className="row col-12 col-lg-3">
                        {FEATURES.map((item) => (
                            <h2 className="accordion-header col-6 col-lg-12" key={item.id}>
                                <button
                                    className={`accordion-button ${item.expanded ? '' : 'collapsed'}`}
                                    type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id}`}
                                    aria-expanded={item.expanded ? 'true' : 'false'} aria-controls={item.id}>
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
                                    className={`accordion-collapse collapse ${item.expanded ? 'show' : ''}`}
                                    data-bs-parent="#accordionExample">

                                    <div className="accordion-body" style={{ minHeight: '50vh' }}>
                                        <h3 className="fw-bold">{item.heading}</h3>

                                        <p className="mb-1"><strong>Where in the app:</strong> {item.where}</p>
                                        <p className="mb-3"><strong>Code:</strong> <code>{item.files}</code></p>

                                        <p>{item.description}</p>

                                        <h6>JavaScript techniques used</h6>
                                        <ul>
                                            {item.techniques.map((technique) => (
                                                <li key={technique}>{technique}</li>
                                            ))}
                                            {item.acknowledgement && <p className="small text-muted">Acknowledgement: {item.acknowledgement}</p>}
                                        </ul>

                                        <Link to={item.link} className="btn btn-dark">See it in the app</Link>
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