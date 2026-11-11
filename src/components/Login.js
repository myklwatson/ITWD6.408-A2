//IMPORT
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient.js";
import { useAuth } from "./AuthContext.js";

//CONSTANTS - colours taken from the header buttons so the page matches the rest of the site
const COLOURS = {
  dark: "#293443",
  green: "#90b669",
  teal: "#5e9597",
  orange: "#de8b6f",
  purple: "#7a6fa8",
};

// Badge colour for each role
const ROLE_COLOURS = {
  customer: COLOURS.teal,
  staff: COLOURS.green,
  viewer: COLOURS.purple,
};

// Profile form fields: [database column, label, input type, required]
const PROFILE_FIELDS = [
  ["full_name", "Full name", "text", true],
  ["phone", "Phone", "tel", false],
  ["street", "Street", "text", false],
  ["suburb", "Suburb", "text", false],
  ["city", "City", "text", false],
  ["post_code", "Postcode", "text", false],
];

//FUNCTION COMPONENT - page background and centred card, shared by the login form and the profile
function PageShell({ children, maxWidth }) {
  return (
    <div
      className="p-3 p-md-5"
      style={{
        minHeight: "60vh",
        background:
          "linear-gradient(135deg, #e3efce 0%, #f5f8ef 50%, #dcebec 100%)",
      }}
    >
      <div
        className="mx-auto bg-white rounded-4 shadow overflow-hidden"
        style={{ maxWidth }}
      >
        {/*Four-colour stripe, matching the header buttons*/}
        <div className="d-flex" style={{ height: "6px" }}>
          {[COLOURS.green, COLOURS.teal, COLOURS.orange, COLOURS.purple].map(
            (colour) => (
              <div
                key={colour}
                className="flex-fill"
                style={{ backgroundColor: colour }}
              />
            ),
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

//FUNCTION COMPONENT - shown when logged in: view and edit the saved profile, change password, see booking count
function Profile({ user, role, onLogout }) {
  // STATE - profile details (one object, one shared handleChange, same pattern as the booking form)
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    street: "",
    suburb: "",
    city: "",
    post_code: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  // STATE - password change and booking count
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [bookingCount, setBookingCount] = useState(null);

  // Load the saved profile and the number of bookings once when the page opens
  useEffect(() => {
    let cancelled = false;

    supabase
      .from("profiles")
      .select("full_name, phone, street, suburb, city, post_code")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled || error) return;
        // null values from the database become empty strings so the inputs stay controlled
        setProfile(
          Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value ?? ""]),
          ),
        );
      });

    // head: true returns only the count, not the rows
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => {
        if (!cancelled) setBookingCount(count);
      });

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  // HANDLERS
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes (the database only lets a user change their own details, never their role)
  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    // empty strings are saved as NULL, trimmed first
    const changes = Object.fromEntries(
      Object.entries(profile).map(([key, value]) => [
        key,
        value.trim() || null,
      ]),
    );
    const { error } = await supabase
      .from("profiles")
      .update(changes)
      .eq("id", user.id);

    setIsError(Boolean(error));
    setMessage(error ? "Could not save: " + error.message : "Profile saved.");
    setSaving(false);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordMessage(
      error
        ? "Could not change password: " + error.message
        : "Password changed.",
    );
    if (!error) setNewPassword("");
  };

  // DERIVED VALUES (worked out from state, not stored)
  const displayName = profile.full_name || user.email;
  const initials = displayName
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString("en-NZ", {
    month: "short",
    year: "numeric",
  });
  const roleColour = ROLE_COLOURS[role] || COLOURS.teal;

  //UI RENDERING
  return (
    <PageShell maxWidth="40rem">
      {/*Header band: avatar, name, email and role*/}
      <div
        className="position-relative text-center text-white p-4"
        style={{ backgroundColor: COLOURS.dark }}
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-3"
          onClick={onLogout}
        >
          Log out
        </button>
        <div
          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-3 mb-2 border border-3 border-white"
          style={{ width: "80px", height: "80px", backgroundColor: roleColour }}
        >
          {initials}
        </div>
        <h4 className="mb-0">{displayName}</h4>
        <p className="mb-2 small opacity-75">{user.email}</p>
        <span
          className="badge rounded-pill px-3 py-2 text-uppercase"
          style={{ backgroundColor: roleColour }}
        >
          {role || "..."}
        </span>
      </div>

      <div className="p-3 p-md-4">
        {/*Quick facts*/}
        <div className="row g-3 mb-4 text-center">
          <div className="col-6">
            <div
              className="rounded-3 p-3 h-100"
              style={{ backgroundColor: "#e3efce" }}
            >
              <div className="fs-2 fw-bold">{bookingCount ?? "-"}</div>
              <div className="small">
                {bookingCount === 1 ? "Booking made" : "Bookings made"}
              </div>
              <Link to="/Bookings" className="small">
                View bookings
              </Link>
            </div>
          </div>
          <div className="col-6">
            <div
              className="rounded-3 p-3 h-100"
              style={{ backgroundColor: "#dcebec" }}
            >
              <div className="fs-2 fw-bold">{memberSince}</div>
              <div className="small">Member since</div>
            </div>
          </div>
        </div>

        {/*Profile details*/}
        <form
          onSubmit={handleSave}
          className="border rounded-3 p-3 mb-4"
          style={{ borderLeft: `5px solid ${COLOURS.green}` }}
        >
          <h5 className="mb-3">Manage profile</h5>
          <div className="row g-3">
            {PROFILE_FIELDS.map(([name, label, type, required]) => (
              <div
                className={
                  name === "full_name" || name === "street"
                    ? "col-12"
                    : "col-12 col-sm-6"
                }
                key={name}
              >
                <label
                  htmlFor={`profile-${name}`}
                  className="form-label small fw-bold mb-1"
                >
                  {label}
                </label>
                <input
                  id={`profile-${name}`}
                  className="form-control"
                  type={type}
                  name={name}
                  required={required}
                  value={profile[name]}
                  onChange={handleChange}
                  {...(name === "phone" && {
                    inputMode: "tel",
                    pattern: "[0-9\\s\\(\\)\\-+]+",
                    title:
                      "Only numbers, spaces, and ( ) - + symbols are allowed",
                  })}
                  {...(name === "post_code" && {
                    inputMode: "numeric",
                    pattern: "[0-9]{4}",
                    maxLength: 4,
                    title: "Postcode must be 4 digits",
                  })}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="btn text-white mt-3 px-4"
            style={{ backgroundColor: COLOURS.green }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
          {message && (
            <span
              className={`ms-3 ${isError ? "text-danger" : "text-success"}`}
            >
              {message}
            </span>
          )}
        </form>

        {/*Password*/}
        <form
          onSubmit={handlePasswordChange}
          className="border rounded-3 p-3 mb-4"
          style={{ borderLeft: `5px solid ${COLOURS.purple}` }}
        >
          <h5 className="mb-3">Change password</h5>
          <label
            htmlFor="newPassword"
            className="form-label small fw-bold mb-1"
          >
            New password
          </label>
          <input
            id="newPassword"
            className="form-control"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className="btn text-white mt-3 px-4"
            style={{ backgroundColor: COLOURS.purple }}
          >
            Change password
          </button>
          {passwordMessage && <span className="ms-3">{passwordMessage}</span>}
        </form>
      </div>
    </PageShell>
  );
}

//FUNCTION COMPONENT - register, log in and log out (Supabase Auth)
function Login() {
  const { user, role, loading } = useAuth();

  // STATE
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // success or error text shown under the form
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false); // disables the button while waiting for Supabase

  // HANDLERS
  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    showMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    showMessage("");

    try {
      if (mode === "register") {
        // full_name is saved with the account and copied into the profiles table by a database trigger
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;

        // If email confirmation is switched on in Supabase there is no session yet
        showMessage(
          data.session
            ? "Account created. You are now logged in."
            : "Account created. Check your email to confirm it, then log in.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        showMessage("Logged in.");
      }
      setPassword(""); // never keep the password in state longer than needed
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showMessage(error.message, true);
    else showMessage("Logged out.");
  };

  //UI RENDERING
  if (loading) return <p className="p-4 text-center">Checking login...</p>;

  // Logged in: show the profile page
  if (user) return <Profile user={user} role={role} onLogout={handleLogout} />;

  // Logged out: login / register form
  return (
    <PageShell maxWidth="28rem">
      {/*Header band*/}
      <div
        className="text-center text-white p-4"
        style={{ backgroundColor: COLOURS.dark }}
      >
        <h4 className="mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h4>
        <p className="mb-0 small opacity-75">
          {mode === "login"
            ? "Log in to see your repair bookings"
            : "Register to track your repair bookings"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-3 p-md-4">
        {/*Log in / Register switch*/}
        <div
          className="btn-group w-100 mb-4"
          role="group"
          aria-label="Log in or register"
        >
          <button
            type="button"
            className="btn fw-bold"
            style={
              mode === "login"
                ? { backgroundColor: COLOURS.teal, color: "white" }
                : { border: `1px solid ${COLOURS.teal}`, color: COLOURS.teal }
            }
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className="btn fw-bold"
            style={
              mode === "register"
                ? { backgroundColor: COLOURS.orange, color: "white" }
                : {
                    border: `1px solid ${COLOURS.orange}`,
                    color: COLOURS.orange,
                  }
            }
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "register" && (
          <div className="mb-3">
            <label htmlFor="authName" className="form-label small fw-bold mb-1">
              Full name
            </label>
            <input
              id="authName"
              className="form-control"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="authEmail" className="form-label small fw-bold mb-1">
            Email
          </label>
          <input
            id="authEmail"
            className="form-control"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="authPassword"
            className="form-label small fw-bold mb-1"
          >
            Password
          </label>
          <input
            id="authPassword"
            className="form-control"
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "register" && (
            <div className="form-text">At least 6 characters.</div>
          )}
        </div>

        <button
          type="submit"
          className="btn w-100 text-white fw-bold py-2"
          disabled={busy}
          style={{
            backgroundColor: mode === "login" ? COLOURS.teal : COLOURS.orange,
          }}
        >
          {busy
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>

        {message && (
          <div
            className={`alert ${isError ? "alert-danger" : "alert-success"} mt-3 mb-0 py-2`}
            role="alert"
          >
            {message}
          </div>
        )}
      </form>
    </PageShell>
  );
}

//EXPORT
export default Login;
