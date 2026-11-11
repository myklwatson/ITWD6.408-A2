// IMPORT
import { useState, useEffect, useMemo } from "react";

// Format date to YYYY-MM-DD format for the date attributes to work correctly
const toLocalISO = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// CONSTANTS - bookable repair times (9:00 AM to 4:30 PM, every 30 minutes)
// value is 24-hour "HH:mm" for storing, label is 12-hour for display
const REPAIR_TIMES = [];
for (let hour = 9; hour < 17; hour++) {
  for (const minute of [0, 30]) {
    const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const label = `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
    REPAIR_TIMES.push({ value, label });
  }
}

// True for purchase dates over 24 months before today
const isOverTwoYears = (value) => {
  if (!value) return false;
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setMonth(cutoff.getMonth() - 24);
  return new Date(value + "T00:00:00") < cutoff;
};

// CONSTANTS - photo types accepted (same list as the Supabase bucket)
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

// FUNCTION COMPONENT
function FormRepairDetail({ sendRepairDetails }) {
  // STATE - repair details
  const [repairDetails, setRepairDetails] = useState({
    purchaseDate: "",
    repairDate: "",
    repairTime: "",
    warranty: false,
    imeiNumber: "",
    make: "Apple",
    model: "",
    faultCategory: "Battery",
    faultDescription: "",
    photo: null, // File upload by customer
  });

  // Date Limits
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Warranty is disabled until a purchase date is entered, and stays disabled if date is over 24 months old
  const warrantyDisabled =
    !repairDetails.purchaseDate || isOverTwoYears(repairDetails.purchaseDate);

  // HANDLERS
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRepairDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Purchase date also clears the warranty if the date is missing or too old
  const handlePurchaseDateChange = (event) => {
    const value = event.target.value;
    setRepairDetails((prev) => ({
      ...prev,
      purchaseDate: value,
      warranty: !value || isOverTwoYears(value) ? false : prev.warranty,
    }));
  };

  // Checkbox uses "checked", not "value"
  const handleWarrantyChange = (event) => {
    const checked = event.target.checked;
    setRepairDetails((prev) => ({ ...prev, warranty: checked }));
  };

  // Preview URL for the chosen photo (derived from state, released when it changes)
  const photoPreview = useMemo(
    () => (repairDetails.photo ? URL.createObjectURL(repairDetails.photo) : ""),
    [repairDetails.photo],
  );
  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview],
  );

   // Only accept a JPG, PNG or WebP image up to 5 MB
  const handlePhotoChange = (event) => {
    const file = event.target.files[0] || null;
    if (
      file &&
      (!ALLOWED_PHOTO_TYPES.includes(file.type) || file.size > 5 * 1024 * 1024)
    ) {
      alert("Please choose an image (JPG, PNG or WebP) under 5 MB.");
      event.target.value = "";
      setRepairDetails((prev) => ({ ...prev, photo: null }));
      return;
    }
    setRepairDetails((prev) => ({ ...prev, photo: file }));
  };

  // Send repair details to Home whenever they change (also runs on mount, which resyncs after a reset)
  useEffect(() => {
    sendRepairDetails(repairDetails);
  }, [repairDetails, sendRepairDetails]);

  // UI RENDERING
  return (
    <div className="p-1">
      <h2>Repair Details</h2>

      {/*Purchase date: cannot be in the future*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="purchaseDate" className="col-12 col-md-12 col-lg-4">
          Purchase Date *
        </label>
        <input
          id="purchaseDate"
          name="purchaseDate"
          className="col-12 col-md-12 col-lg-7"
          type="date"
          max={toLocalISO(yesterday)}
          value={repairDetails.purchaseDate}
          onChange={handlePurchaseDateChange}
          required
        />
      </div>

      {/*Repair date: must be after today, and therefore after the purchase date*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="repairDate" className="col-12 col-md-12 col-lg-4">
          Repair Date *
        </label>
        <input
          id="repairDate"
          name="repairDate"
          className="col-12 col-md-12 col-lg-7"
          type="date"
          min={toLocalISO(tomorrow)}
          onChange={handleChange}
          required
        />
      </div>

      {/*Repair time: only the listed slots can be chosen*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="repairTime" className="col-12 col-md-12 col-lg-4">
          Repair Time *
        </label>
        <select
          id="repairTime"
          name="repairTime"
          className="col-12 col-md-12 col-lg-7"
          defaultValue=""
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a drop-off time...
          </option>
          {REPAIR_TIMES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <div className="form-text col-12 ms-2">
          Time you will bring your phone in.
        </div>
      </div>

      {/*Under Warranty*/}
      <div className="row mb-3 g-2">
        <fieldset className="border border-dark col-11 col-lg-11 ms-3 me-3 mb-3 p-3">
          <legend className="col-11 float-none w-auto">Under Warranty</legend>
          <div>
            <label
              htmlFor="warrantyCheck"
              className="col-12 col-md-12 col-lg-4"
            >
              Warranty
            </label>
            <input
              type="checkbox"
              id="warrantyCheck"
              name="warranty"
              className="ms-2"
              disabled={warrantyDisabled}
              checked={repairDetails.warranty}
              onChange={handleWarrantyChange}
            />
          </div>
        </fieldset>
      </div>

      {/*IMEI*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="imei" className="col-12 col-md-12 col-lg-4">
          IMEI: *
        </label>
        <input
          id="imei"
          name="imeiNumber"
          className="col-12 col-md-12 col-lg-7"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{15}"
          maxLength={15}
          title="IMEI must be exactly 15 digits"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 15);
          }} // 15 digit validation
          onChange={handleChange}
          required
        />
      </div>

      {/*Make*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="make" className="col-12 col-md-12 col-lg-4">
          Make: *
        </label>
        <select
          id="make"
          name="make"
          className="col-12 col-md-12 col-lg-7"
          defaultValue="Apple"
          onChange={handleChange}
          required
        >
          <option value="Apple">Apple</option>
          <option value="LG">LG</option>
          <option value="Motorola">Motorola</option>
          <option value="Nokia">Nokia</option>
          <option value="Samsung">Samsung</option>
          <option value="Sony">Sony</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/*Model Number: */}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="model" className="col-12 col-md-12 col-lg-4">
          Model Number:
        </label>
        <input
          id="model"
          name="model"
          className="col-12 col-md-12 col-lg-7"
          type="text"
          onChange={handleChange}
        />
      </div>

      {/*Fault Category*/}
      <div className="row mb-3 g-2 ms-2 me-2">
        <label htmlFor="faultCategory" className="col-12 col-md-12 col-lg-4">
          Fault Category: *
        </label>
        <select
          id="faultCategory"
          name="faultCategory"
          className="col-12 col-md-12 col-lg-7"
          defaultValue="Battery"
          onChange={handleChange}
          required
        >
          <option value="Battery">Battery</option>
          <option value="Charging">Charging</option>
          <option value="Screen">Screen</option>
          <option value="SD-storage">SD-storage</option>
          <option value="Software">Software</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/*Description*/}
      <div className="row mb-2 g-2 ms-2 me-2">
        <label htmlFor="faultDescription" className="col-12 col-md-12 col-lg-4">
          Description: *
        </label>
        <textarea
          id="faultDescription"
          name="faultDescription"
          className="col-12 col-md-12 col-lg-7"
          rows="5"
          style={{ resize: "none" }} // hide resize of description box, can be removed if needed
          onChange={handleChange}
          required
        />
      </div>

      {/*Photo of the broken phone (optional)*/}
      <div className="row mb-2 g-2 ms-2 me-2">
        <label htmlFor="photo" className="col-12 col-md-12 col-lg-4">
          Photo of damage:
        </label>
        <div className="col-12 col-md-12 col-lg-7 p-0">
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="form-control"
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview of the chosen damage"
              className="img-thumbnail mt-2"
              style={{ maxHeight: "150px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// EXPORT
export default FormRepairDetail;
