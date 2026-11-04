// IMPORT
import { useState, useEffect } from "react";

// CONSTANTS
const COURTESY_LIST = [
  { id: 0, type: "none", name: "None", bond: 0.0 },
  // phones
  { id: 1, type: "phone", name: "iPhone 10", bond: 275.0 },
  { id: 2, type: "phone", name: "iPhone 14", bond: 300.0 },
  { id: 3, type: "phone", name: "iPhone 16", bond: 500.0 },
  { id: 4, type: "phone", name: "Samsung Galaxy", bond: 200.0 },
  { id: 5, type: "phone", name: "Nokia", bond: 150.0 },
  { id: 6, type: "phone", name: "Xiaomi", bond: 100.0 },

  // chargers
  { id: 7, type: "charger", name: "iPhone Charger", bond: 45.0 },
  { id: 8, type: "charger", name: "Samsung Charger", bond: 30.0 },
  { id: 9, type: "charger", name: "Nokia Charger", bond: 25.0 },
  { id: 10, type: "charger", name: "Xiaomi Charger", bond: 25.0 },
];

// FORMAT TO NZD
const toNZD = (value) =>
  value.toLocaleString("en-NZ", { style: "currency", currency: "NZD" });

// FUNCTION COMPONENT
function FormCourtesyPhone({
  passDataToParent,
  sendCourtesyPhoneDetails,
  customerType,
}) {
  // passDataToParent: sends the total bond (a number) to Home, for FormCost
  // sendCourtesyPhoneDetails: sends the full details object to Home, for the database
  // customerType: used to determine if bond is waived for business customers

  const isBusiness = customerType === "business";

  // STATE - selected item ids (0 = none)
  const [phoneId, setPhoneId] = useState(0);
  const [chargerId, setChargerId] = useState(0);

  // DERIVED VALUES - calculated from state, not stored
  const phone = COURTESY_LIST.find((item) => item.id === phoneId);
  const charger = COURTESY_LIST.find((item) => item.id === chargerId);
  const totalBond = phone.bond + charger.bond;

  // HANDLERS
  const addPhone = (event) => setPhoneId(Number(event.target.value));
  const addCharger = (event) => setChargerId(Number(event.target.value));

  // Send total bond to Home
  useEffect(() => {
    passDataToParent(totalBond);
  }, [totalBond, passDataToParent]);

  // Send details to Home
  useEffect(() => {
    sendCourtesyPhoneDetails({
      phoneBorrow: phoneId === 0 ? "" : phone.name,
      phoneCost: phone.bond,
      chargerBorrow: chargerId === 0 ? "" : charger.name,
      chargerCost: charger.bond,
    });
  }, [phoneId, chargerId, phone, charger, sendCourtesyPhoneDetails]);

  // UI RENDERING
  return (
    <div className="p-1">
      <h2>Courtesy Phone</h2>

      {/*Phone items*/}
      <h5 className="ms-3 mt-3">Choose a Phone</h5>
      <div className="row mb-3 ms-3 g-2 me-3">
        <label htmlFor="phoneList" className="col-12 col-md-12 col-lg-4">
          Item Type{" "}
        </label>
        <select
          className="col-12 col-md-12 col-lg-7"
          id="phoneList"
          value={phoneId}
          onChange={addPhone}
        >
          <option value={0}>None</option>
          {COURTESY_LIST.filter((item) => item.type === "phone").map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/*Charger items*/}
      <h5 className="row mt-2 ms-3 g-2">Choose a Charger</h5>
      <div className="row mb-4 ms-3 g-2 me-3">
        <label htmlFor="chargerList" className="col-12 col-md-12 col-lg-4">
          Item Type{" "}
        </label>
        <select
          className="col-12 col-md-12 col-lg-7"
          id="chargerList"
          value={chargerId}
          onChange={addCharger}
        >
          <option value={0}>None</option>
          {COURTESY_LIST.filter((item) => item.type === "charger").map(
            (item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ),
          )}
        </select>
      </div>

      {/*Table of selected Courtesy items*/}
      <h5 className="ms-3 mt-2 ">Borrow Items</h5>
      <div className="row mt-2 mb-4 ms-3 me-4 bg-white">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {/*Display phone item if selected*/}
            {phoneId !== 0 && (
              <tr>
                <td>{phone.name}</td>
                <td
                  className={
                    isBusiness ? "text-decoration-line-through text-muted" : ""
                  }
                >
                  {toNZD(phone.bond)}
                </td>
              </tr>
            )}

            {/*Display charger item if selected*/}
            {chargerId !== 0 && (
              <tr>
                <td>{charger.name}</td>
                <td
                  className={
                    isBusiness ? "text-decoration-line-through text-muted" : ""
                  }
                >
                  {toNZD(charger.bond)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isBusiness && (
        <p className="small fst-italic fw-bold ms-3">
          Bond not required for business customers.
        </p>
      )}
    </div>
  );
}

// EXPORT
export default FormCourtesyPhone;
