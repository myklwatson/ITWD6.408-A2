// IMPORT
import { useState, useEffect } from "react";
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

  // UI RENDERING
  return (
    <div className="p-3" style={{ minHeight: "60vh" }}>
      <h1>Repair Booking Job Sheet</h1>

      {loading && <p>Loading bookings...</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {!loading && !errorMessage && bookings.length === 0 && (
        <p>No bookings yet.</p>
      )}

      {/*One card per booking, colour coded by customer type*/}
      <div className="row g-3">
        {bookings.map((b) => {
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
