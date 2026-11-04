//IMPORT
// Each feature gets its own component file in ./advanced/ and is added to the "demo" field below
// import Login from './advanced/Login.js';


//CONSTANTS - the five advanced JavaScript features shown on this page
// description: what it does, why it suits the Phone Fix theme, and the JavaScript techniques used
const FEATURES = [
    {
        id: 'collapseOne',
        title: 'LOGIN',
        heading: 'Customer and staff login',
        description: 'Staff and customers can register and log in with Supabase Auth. Only logged-in staff can change repair status.',
        techniques: 'async/await, Supabase Auth session handling, React context, conditional rendering',
        demo: null,   // <Login />
        expanded: true, // first item is open by default
    },
    {
        id: 'collapseTwo',
        title: 'SEARCH',
        heading: 'Search, sort and filter bookings',
        description: 'Staff can search the repair bookings by name or IMEI, filter by customer type, make or fault category, and sort by date or total.',
        techniques: 'Array.filter / sort / map, derived state, controlled inputs, useMemo',
        demo: null,   // <SearchFilterSort />
        expanded: false,
    },
    {
        id: 'collapseThree',
        title: 'STATUS',
        heading: 'Repair status tracking and notifications',
        description: 'Each job has a status (Received, In repair, Ready for collection). Staff update it, and a notification appears when it changes.',
        techniques: 'Supabase update queries, optimistic UI updates, Supabase realtime subscription',
        demo: null,   // <RepairStatus />
        expanded: false,
    },
    {
        id: 'collapseFour',
        title: 'CHATBOT',
        heading: 'FAQ chatbot',
        description: 'A chat widget answers customer questions by matching their message against the questions in faqs.json.',
        techniques: 'JSON import, string matching and scoring, state-driven message list, scroll refs',
        demo: null,   // <Chatbot />
        expanded: false,
    },
    {
        id: 'collapseFive',
        title: 'CHARTS',
        heading: 'Booking statistics charts',
        description: 'Charts of repair jobs by fault category, customer type and make, built from the live bookings table.',
        techniques: 'Array.reduce to group data, canvas/SVG rendering, fetch from Supabase',
        demo: null,   // <Charts />
        expanded: false,
    },
];


//FUNCTION COMPONENT
function AdvancedJS() {

    //UI RENDERING
    return (
        <>
            <div style={{ minHeight: '60vh' }}>

                {/* Statement of authenticity (required at the top of this page by the brief) */}
                <div className="p-3 my-2 mx-auto border rounded" style={{ maxWidth: "1200px" , backgroundColor: "#e3efce" }}>
                    <h2 className="fs-4 fw-bold">Statement of Authenticity</h2>
                    <p className="mb-1">I Michael Watson confirm that:</p>
                    <ul className="mb-0">
                        <li>This is an original assessment and is entirely my own work.</li>
                        <li>It contains no material previously published or written by another person or myself except where due acknowledgement is made in the text.</li>
                        <li>No material which to a substantial extent, has been submitted for any other academic course, is included without acknowledgement.</li>
                    </ul>
                </div>

                {/* Accordion Display */}
                <div className="accordion row align-items-start p-2" id="accordionExample">

                    {/* Demo Buttons */}
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


                    {/* Demo Sections: description first, then the working example */}
                    <div className="col-12 col-lg-9">
                        {FEATURES.map((item) => (
                            <div className="accordion-item" key={item.id}>
                                <div
                                    id={item.id}
                                    className={`accordion-collapse collapse ${item.expanded ? 'show' : ''}`}
                                    data-bs-parent="#accordionExample">

                                    <div className="accordion-body" style={{ minHeight: '50vh' }}>
                                        <h3 className="fw-bold">{item.heading}</h3>
                                        <p>{item.description}</p>
                                        <p className="text-muted small">
                                            <strong>JavaScript techniques:</strong> {item.techniques}
                                        </p>
                                        <hr />
                                        {item.demo || <p className="fst-italic">Working example coming soon.</p>}
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