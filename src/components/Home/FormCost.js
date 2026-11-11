// IMPORT
import { useEffect } from "react";

// CONSTANTS
const SERVICE_FEE = 85.0; // CHARGED UNLESS UNDER WARRANTY
const GST_RATE = 0.15;

// ROUNDING TO AVOID ERRORS
const round2 = (value) => Math.round(value * 100) / 100;

// FORMAT NUMBER TO DOLLAR STRING
const toDollars = (value) => `$${value.toFixed(2)}`;

// FUNCTION COMPONENT
function FormCost({
  sharedPropBond,
  sharedPropWarranty,
  sharedPropCustomerType,
  sendCostDetails,
}) {
  // CALCULATIONS
  const bond = sharedPropCustomerType === "business" ? 0 : sharedPropBond;
  const serviceFee = sharedPropWarranty ? 0 : SERVICE_FEE;
  const totalExclGST = round2(bond + serviceFee);
  const gst = round2(totalExclGST * GST_RATE);
  const totalInclGST = round2(totalExclGST + gst);

  // SEND DATA TO HOME COMPONENT
  useEffect(() => {
    sendCostDetails({ bond, serviceFee, totalExclGST, gst, totalInclGST });
  }, [bond, serviceFee, totalExclGST, gst, totalInclGST, sendCostDetails]);

  // UI RENDERING
  return (
    <div className="p-1">
      <h2>Cost</h2>
      <div className="row mb-3 mt-3 g-2 ms-3 me-2">
        <label htmlFor="bond" id="bondLabel" className="col-12 col-lg-4 ">
          Bond:
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="bond"
          name="bond"
          value={toDollars(bond)}
          readOnly
        />
      </div>
      <div className="row mb-3 g-2 ms-3 me-2">
        <label
          htmlFor="serviceFee"
          id="serviceFeeLabel"
          className="col-12 col-lg-4 "
        >
          Service Fee:
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="serviceFee"
          name="serviceFee"
          value={toDollars(serviceFee)}
          readOnly
        />
      </div>
      <div className="row mb-3 g-2 ms-3 me-2">
        <label
          htmlFor="totalExclGST"
          id="exclGSTLabel"
          className="col-12 col-lg-4 "
        >
          Total: (excl. GST)
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="totalExclGST"
          name="totalExclGST"
          value={toDollars(totalExclGST)}
          readOnly
        />
      </div>
      <div className="row mb-3 g-2 ms-3 me-2">
        <label htmlFor="gst" id="gstLabel" className="col-12 col-lg-4 ">
          GST:
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="gst"
          name="gst"
          value={toDollars(gst)}
          readOnly
        />
      </div>
      <div className="row g-2 ms-3 mb-4 me-2">
        <label
          htmlFor="totalInclGST"
          id="totalInclGSTLabel"
          className="col-12 col-lg-4 "
        >
          Total: (incl. GST)
        </label>
        <input
          className="col-12 col-lg-7"
          type="text"
          id="totalInclGST"
          name="totalInclGST"
          value={toDollars(totalInclGST)}
          readOnly
        />
      </div>
    </div>
  );
}

// EXPORT
export default FormCost;
