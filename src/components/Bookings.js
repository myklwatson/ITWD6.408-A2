// IMPORT
import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient.js"; // same folder as Home.js
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext.js";

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
  customer: { background: "#fdf0dc", accent: "#f2c98e" }, // peach
  business: { background: "#e4f7ec", accent: "#8fd6ac" }, // mint
};

// CONSTANTS - sort options for the bookings
const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
    compare: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  },
  {
    value: "oldest",
    label: "Oldest first",
    compare: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    value: "repairDate",
    label: "Repair date (soonest)",
    compare: (a, b) => new Date(a.repair_date) - new Date(b.repair_date),
  },
  {
    value: "totalHigh",
    label: "Total (high to low)",
    compare: (a, b) => b.total_incl_gst - a.total_incl_gst,
  },
  {
    value: "totalLow",
    label: "Total (low to high)",
    compare: (a, b) => a.total_incl_gst - b.total_incl_gst,
  },
  {
    value: "name",
    label: "Customer name (A-Z)",
    compare: (a, b) =>
      a.last_name.localeCompare(b.last_name) ||
      a.first_name.localeCompare(b.first_name),
  },
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

// FUNCTION COMPONENT - one label and value on a single line (keeps the card markup short)
function Row({ label, children, className = "" }) {
  return (
    <div className={`d-flex justify-content-between gap-2 ${className}`}>
      <span>{label}</span>
      <span className="text-end">{children}</span>
    </div>
  );
}

// FUNCTION COMPONENT - small uppercase heading for each section of a card
function SectionTitle({ children }) {
  return (
    <div
      className="text-uppercase fw-bold mb-1"
      style={{ fontSize: "0.7rem", letterSpacing: "0.08em", opacity: 0.65 }}
    >
      {children}
    </div>
  );
}

// FUNCTION COMPONENT
function Bookings() {
  // AUTH - customers only receive their own bookings, staff receive all (the database enforces this)
  const { user, canViewAll, loading: authLoading } = useAuth();
  const userId = user?.id;

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

  // LOAD DATA from Supabase once we know who is logged in (and again if they log in or out)
  useEffect(() => {
    if (authLoading) return; // still checking for a saved login
    if (!userId) {
      // nobody logged in: nothing to load
      setBookings([]);
      setLoading(false);
      return;
    }

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
  }, [userId, authLoading]);

  // DERIVED VALUES - the dropdown options come from the data itself (Set removes duplicates)
  const makes = [...new Set(bookings.map((b) => b.make))].sort();
  const faults = [...new Set(bookings.map((b) => b.fault_category))].sort();

  // Apply search, filters and sort. useMemo only re-runs this when one of the listed values changes.
  const visibleBookings = useMemo(() => {
    const keywords = search.trim().toLowerCase();

    const matches = bookings.filter((b) => {
      if (typeFilter !== "all" && b.customer_type !== typeFilter) return false;
      if (makeFilter !== "all" && b.make !== makeFilter) return false;
      if (faultFilter !== "all" && b.fault_category !== faultFilter)
        return false;
      if (!keywords) return true;

      // Search job number, name, contact details, IMEI and model in one string
      const searchable = [
        b.id,
        b.first_name,
        b.last_name,
        b.email,
        b.phone,
        b.imei_number,
        b.model,
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(keywords);
    });

    // filter() returned a new array, so sorting it does not change the loaded bookings
    return matches.sort(
      SORT_OPTIONS.find((option) => option.value === sortBy).compare,
    );
  }, [bookings, search, typeFilter, makeFilter, faultFilter, sortBy]);

  const filtersActive =
    search !== "" ||
    typeFilter !== "all" ||
    makeFilter !== "all" ||
    faultFilter !== "all";

  // HANDLERS
  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMakeFilter("all");
    setFaultFilter("all");
  };

  // UI RENDERING
  return (
    <div
      className="p-3 p-md-4"
      style={{
        minHeight: "60vh",
        background:
          "linear-gradient(135deg, #e3efce 0%, #f5f8ef 50%, #dcebec 100%)",
      }}
    >
      <h1 className="fs-2 fw-bold mb-1">Repair Booking Job Sheet</h1>

      {/*Login required to view bookings*/}
      {!authLoading && !user && (
        <p>
          Please <Link to="/Login">log in or register</Link> to view your
          bookings.
        </p>
      )}
      {user && (
        <p className="text-muted small">
          {canViewAll ? "Admin view: all bookings" : "Showing your bookings"}
        </p>
      )}

      {user && loading && <p>Loading bookings...</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {user && !loading && !errorMessage && bookings.length === 0 && (
        <p>No bookings yet.</p>
      )}

      {/*Search, filter and sort controls*/}
      {bookings.length > 0 && (
        <div className="row g-2 mb-4 mx-0 bg-white rounded-3 shadow-sm py-2 px-1">
          <div className="col-12 col-lg-4">
            <label htmlFor="bookingSearch" className="visually-hidden">
              Search bookings
            </label>
            <input
              id="bookingSearch"
              className="form-control"
              type="search"
              placeholder="Search job #, name, email, phone, IMEI, model"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="typeFilter" className="visually-hidden">
              Customer type
            </label>
            <select
              id="typeFilter"
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All customers</option>
              <option value="customer">Customer</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="makeFilter" className="visually-hidden">
              Make
            </label>
            <select
              id="makeFilter"
              className="form-select"
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
            >
              <option value="all">All makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="faultFilter" className="visually-hidden">
              Fault category
            </label>
            <select
              id="faultFilter"
              className="form-select"
              value={faultFilter}
              onChange={(e) => setFaultFilter(e.target.value)}
            >
              <option value="all">All faults</option>
              {faults.map((fault) => (
                <option key={fault} value={fault}>
                  {fault}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <label htmlFor="sortBy" className="visually-hidden">
              Sort by
            </label>
            <select
              id="sortBy"
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Showing {visibleBookings.length} of {bookings.length} bookings
            </span>
            {filtersActive && (
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
      {bookings.length > 0 && visibleBookings.length === 0 && (
        <p>No bookings match your search.</p>
      )}

      {/*One card per booking, colour coded by customer type (3 across on large screens)*/}
      <div className="row g-3">
        {visibleBookings.map((b) => {
          const isBusiness = b.customer_type === "business";
          const colours =
            TYPE_COLOURS[b.customer_type] || TYPE_COLOURS.customer;
          const strikeClass = isBusiness
            ? "text-decoration-line-through text-muted"
            : "";

          return (
            <div key={b.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden"
                style={{
                  backgroundColor: colours.background,
                  fontSize: "0.85rem",
                }}
              >
                {/*Header: job number, customer type and invoice date*/}
                <div
                  className="d-flex justify-content-between align-items-center px-3 py-2"
                  style={{ backgroundColor: colours.accent }}
                >
                  <div>
                    <strong className="fs-6">Job #{b.id}</strong>
                    <div style={{ fontSize: "0.75rem" }}>
                      {toInvoiceDateTime(b.created_at)}
                    </div>
                  </div>
                  <span className="badge rounded-pill bg-white text-dark text-capitalize">
                    {b.customer_type}
                  </span>
                </div>

                <div className="card-body px-3 py-2">
                  {/*Device and fault, the main thing the technician needs*/}
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="fw-bold fs-6">
                      {b.make} {b.model}
                    </div>
                    <span className="badge text-bg-dark">
                      {b.fault_category}
                    </span>
                  </div>
                  <div className="text-muted mb-1">IMEI {b.imei_number}</div>
                  <p className="mb-1">{b.fault_description}</p>
                  {b.photo_url && (
                    <a href={b.photo_url} target="_blank" rel="noreferrer">
                      <img
                        src={b.photo_url}
                        alt="Damage to the phone"
                        className="rounded border border-2 border-white shadow-sm mb-1"
                        style={{ maxHeight: "90px" }}
                      />
                    </a>
                  )}
                  <Row label="Purchased">{toDate(b.purchase_date)}</Row>
                  <Row label="Drop-off">{toRepairDateTime(b.repair_date)}</Row>
                  <Row label="Under warranty">{b.warranty ? "Yes" : "No"}</Row>

                  {/*Customer*/}
                  <div className="border-top border-dark border-opacity-10 mt-2 pt-2">
                    <SectionTitle>Customer</SectionTitle>
                    <div className="fw-bold">
                      {b.title} {b.first_name} {b.last_name}
                    </div>
                    <div>
                      {b.phone} &middot; {b.email}
                    </div>
                    <div className="text-muted">
                      {[b.street, b.suburb, b.city, b.post_code]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>

                  {/*Courtesy items: item values are bond amounts, struck through for business customers*/}
                  <div className="border-top border-dark border-opacity-10 mt-2 pt-2">
                    <SectionTitle>Courtesy items (bond)</SectionTitle>
                    <Row label={b.phone_borrow || "No phone"}>
                      <span className={strikeClass}>{toNZD(b.phone_cost)}</span>
                    </Row>
                    <Row label={b.charger_borrow || "No charger"}>
                      <span className={strikeClass}>
                        {toNZD(b.charger_cost)}
                      </span>
                    </Row>
                    {isBusiness && (
                      <div
                        className="fst-italic"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Bond not required for business customers.
                      </div>
                    )}
                  </div>

                  {/*Cost summary*/}
                  <div className="border-top border-dark border-opacity-10 mt-2 pt-2">
                    <SectionTitle>Cost</SectionTitle>
                    <Row label="Bond required">{toNZD(b.bond)}</Row>
                    <Row label="Service fee">{toNZD(b.service_fee)}</Row>
                    <Row label="Total (excl. GST)">
                      {toNZD(b.total_excl_gst)}
                    </Row>
                    <Row label="GST">{toNZD(b.gst)}</Row>
                  </div>
                </div>

                {/*Grand total strip*/}
                <div
                  className="d-flex justify-content-between align-items-center text-white px-3 py-2 fw-bold"
                  style={{ backgroundColor: "#293443" }}
                >
                  <span>Total (incl. GST)</span>
                  <span className="fs-6">{toNZD(b.total_incl_gst)}</span>
                </div>

                {/*Business contact details and business card*/}
                <div
                  className="px-3 py-2 bg-white bg-opacity-50"
                  style={{ fontSize: "0.72rem" }}
                >
                  <strong>{BUSINESS.name}</strong> &middot; {BUSINESS.phone}{" "}
                  &middot; {BUSINESS.email}
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
