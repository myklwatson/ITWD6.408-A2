// IMPORT
import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient.js"; // same folder as Home.js

// CONSTANTS - business contact details shown on every booking
const BUSINESS = {
  name: "MYKL's Phone Repair Ltd",
  phone: "027 545 6319",
  email: "repairs@myklphonefix.co.nz",
  address: "1015 Southland Road, Hastings 4120",
  card: "Michael Watson | Mobile phone repairs | repairs@myklphonefix.co.nz | 027 545 6319",
};

// CONSTANTS - card colours by customer type
const TYPE_COLOURS = {
  customer: { background: "#fbe0bc", accent: "#f6d1a0" }, // peach
  business: { background: "#D5F5E3", accent: "#9be1b7" }, // mint
};

// CONSTANTS - sort options for the bookings
const SORT_OPTIONS = [
    { value: 'newest',      label: 'Newest first',            compare: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
    { value: 'oldest',      label: 'Oldest first',            compare: (a, b) => new Date(a.created_at) - new Date(b.created_at) },
    { value: 'repairDate',  label: 'Repair date (soonest)',   compare: (a, b) => new Date(a.repair_date) - new Date(b.repair_date) },
    { value: 'totalHigh',   label: 'Total (high to low)',     compare: (a, b) => b.total_incl_gst - a.total_incl_gst },
    { value: 'totalLow',    label: 'Total (low to high)',     compare: (a, b) => a.total_incl_gst - b.total_incl_gst },
    { value: 'name',        label: 'Customer name (A-Z)',     compare: (a, b) => a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name) },
];

// FORMAT HELPERS
const toNZD = (value) =>
  Number(value).toLocaleString("en-NZ", { style: "currency", currency: "NZD" });
const toDate = (value) =>
  new Date(value + "T00:00:00").toLocaleDateString("en-NZ"); // date-only columns

// INVOICE DATE & TIME IN 24 HOUR
const toInvoiceDateTime = (value) =>
  new Date(value).toLocaleString("en-NZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

// REPAIR DATE & TIME IN 12 HOUR 
const toRepairDateTime = (value) => {
  const d = new Date(value);
  const date = d.toLocaleDateString("en-NZ");
  const time = d
    .toLocaleTimeString("en-NZ", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
  return `${date}, ${time}`;
};


// FUNCTION COMPONENT
function Bookings() {
  // STATE
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // STATE - search, filter and sort controls
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [makeFilter, setMakeFilter] = useState("all");
  const [faultFilter, setFaultFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // LOAD DATA from Supabase when the page opens
  useEffect(() => {
    let cancelled = false; // stops a state update if the page is left before the load finishes

    const loadBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Error fetching bookings:", error);
        setErrorMessage("Could not load bookings: " + error.message);
      } else {
        setBookings(data);
      }
      setLoading(false);
    };

    loadBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  // DERIVED VALUES - the dropdown options come from the data itself (Set removes duplicates)
  const makes = [...new Set(bookings.map(b => b.make))].sort();
  const faults = [...new Set(bookings.map(b => b.fault_category))].sort();

  // Apply search, filters and sort. useMemo only re-runs this when one of the listed values changes.
  const visibleBookings = useMemo(() => {
      const keywords = search.trim().toLowerCase();

      const matches = bookings.filter(b => {
          if (typeFilter !== 'all' && b.customer_type !== typeFilter) return false;
          if (makeFilter !== 'all' && b.make !== makeFilter) return false;
          if (faultFilter !== 'all' && b.fault_category !== faultFilter) return false;
          if (!keywords) return true;

          // Search job number, name, contact details, IMEI and model in one string
          const searchable = [b.id, b.first_name, b.last_name, b.email, b.phone, b.imei_number, b.model]
              .join(' ').toLowerCase();
          return searchable.includes(keywords);
      });

      // filter() returned a new array, so sorting it does not change the loaded bookings
      return matches.sort(SORT_OPTIONS.find(option => option.value === sortBy).compare);
  }, [bookings, search, typeFilter, makeFilter, faultFilter, sortBy]);

  const filtersActive = search !== "" || typeFilter !== "all" || makeFilter !== "all" || faultFilter !== "all";

  // HANDLERS
  const clearFilters = () => {
      setSearch("");
      setTypeFilter("all");
      setMakeFilter("all");
      setFaultFilter("all");
  };

  // UI RENDERING
  return (
    <div className="p-3" style={{ minHeight: "60vh" }}>
      <h1>Repair Booking Job Sheet</h1>

      {loading && <p>Loading bookings...</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {!loading && !errorMessage && bookings.length === 0 && (
        <p>No bookings yet.</p>
      )}

      {/*Search, filter and sort controls*/}
      {bookings.length > 0 && (
          <div className="row g-2 mb-3">
              <div className="col-12 col-lg-4">
                  <label htmlFor="bookingSearch" className="visually-hidden">Search bookings</label>
                  <input id="bookingSearch" className="form-control" type="search"
                      placeholder="Search job #, name, email, phone, IMEI, model"
                      value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="col-6 col-lg-2">
                  <label htmlFor="typeFilter" className="visually-hidden">Customer type</label>
                  <select id="typeFilter" className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                      <option value="all">All customers</option>
                      <option value="customer">Customer</option>
                      <option value="business">Business</option>
                  </select>
              </div>
              <div className="col-6 col-lg-2">
                  <label htmlFor="makeFilter" className="visually-hidden">Make</label>
                  <select id="makeFilter" className="form-select" value={makeFilter} onChange={(e) => setMakeFilter(e.target.value)}>
                      <option value="all">All makes</option>
                      {makes.map(make => <option key={make} value={make}>{make}</option>)}
                  </select>
              </div>
              <div className="col-6 col-lg-2">
                  <label htmlFor="faultFilter" className="visually-hidden">Fault category</label>
                  <select id="faultFilter" className="form-select" value={faultFilter} onChange={(e) => setFaultFilter(e.target.value)}>
                      <option value="all">All faults</option>
                      {faults.map(fault => <option key={fault} value={fault}>{fault}</option>)}
                  </select>
              </div>
              <div className="col-6 col-lg-2">
                  <label htmlFor="sortBy" className="visually-hidden">Sort by</label>
                  <select id="sortBy" className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      {SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
              </div>
              <div className="col-12 d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Showing {visibleBookings.length} of {bookings.length} bookings</span>
                  {filtersActive && <button type="button" className="btn btn-sm btn-outline-dark" onClick={clearFilters}>Clear filters</button>}
              </div>
          </div>
      )}
      {bookings.length > 0 && visibleBookings.length === 0 && <p>No bookings match your search.</p>}

      {/*One card per booking, colour coded by customer type*/}
      <div className="row g-3">
        {visibleBookings.map((b) => {
          const isBusiness = b.customer_type === "business";
          const colours =
            TYPE_COLOURS[b.customer_type] || TYPE_COLOURS.customer;

          return (
            <div key={b.id} className="col-12 col-md-6 col-xl-4">
              <div
                className="card h-100 border-2"
                style={{
                  backgroundColor: colours.background,
                  borderColor: colours.accent,
                }}
              >
                <div
                  className="card-header d-flex justify-content-between"
                  style={{ backgroundColor: colours.accent }}
                >
                  <strong>Job #{b.id}</strong>
                  <span className="text-capitalize fw-bold">
                    {b.customer_type}
                  </span>
                </div>

                <div className="card-body">
                  <p className="mb-3">
                    <strong>Invoice date:</strong>{" "}
                    {toInvoiceDateTime(b.created_at)}
                  </p>

                  <h6>Customer Details</h6>
                  <p className="mb-1">
                    {b.title} {b.first_name} {b.last_name}
                  </p>
                  <p className="mb-1">
                    {b.phone} &middot; {b.email}
                  </p>
                  <p className="text-muted">
                    {[b.street, b.suburb, b.city, b.post_code]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <hr />

                  <h6>Repair Details</h6>
                  <p className="mb-1">
                    <strong>Device:</strong> {b.make} {b.model}
                  </p>
                  <p className="mb-1">
                    <strong>IMEI:</strong> {b.imei_number}
                  </p>
                  <p className="mb-1">
                    <strong>Fault:</strong> {b.fault_category}
                  </p>
                  <p className="mb-1">{b.fault_description}</p>
                  {b.photo_url && (
                    <a href={b.photo_url} target="_blank" rel="noreferrer">
                        <img src={b.photo_url} alt="Damage to the phone" className="img-thumbnail mb-2"
                            style={{ maxHeight: "120px" }} />
                    </a>
                  )}
                  <p className="mb-1">
                    <strong>Purchased:</strong> {toDate(b.purchase_date)}
                  </p>
                  <p className="mb-1">
                    <strong>Repair date/time (drop-off):</strong>{" "}
                    {toRepairDateTime(b.repair_date)}
                  </p>
                  <p className="mb-1">
                    <strong>Under warranty:</strong> {b.warranty ? "Yes" : "No"}
                  </p>

                  <hr />

                  {/*Courtesy items: item values are bond amounts, struck through for business customers*/}
                  <h6>Courtesy Items (Bond)</h6>
                  <div className="d-flex justify-content-between">
                    <span>{b.phone_borrow || "No phone"}</span>
                    <span
                      className={
                        isBusiness
                          ? "text-decoration-line-through text-muted"
                          : ""
                      }
                    >
                      {toNZD(b.phone_cost)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>{b.charger_borrow || "No charger"}</span>
                    <span
                      className={
                        isBusiness
                          ? "text-decoration-line-through text-muted"
                          : ""
                      }
                    >
                      {toNZD(b.charger_cost)}
                    </span>
                  </div>
                  {isBusiness && (
                    <p className="small fst-italic mt-1 mb-0">
                      Bond not required for business customers.
                    </p>
                  )}

                  <hr />

                  <h6>Cost</h6>
                  <div className="d-flex justify-content-between">
                    <span>Bond required</span>
                    <span>{toNZD(b.bond)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Service fee</span>
                    <span>{toNZD(b.service_fee)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total (excl. GST)</span>
                    <span>{toNZD(b.total_excl_gst)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>GST</span>
                    <span>{toNZD(b.gst)}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total (incl. GST)</span>
                    <span>{toNZD(b.total_incl_gst)}</span>
                  </div>
                </div>

                {/*Business contact details and business card*/}
                <div className="card-footer small">
                  <strong>{BUSINESS.name}</strong>
                  <br />
                  {BUSINESS.phone} &middot; {BUSINESS.email}
                  <br />
                  {BUSINESS.address}
                  <br />
                  <span className="text-muted fst-italic">{BUSINESS.card}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// EXPORT
export default Bookings;
