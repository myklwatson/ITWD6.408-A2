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

  // STATE - drag and drop: which zone the dragged item came from, and which zone it is over
  const [dragSource, setDragSource] = useState(null); // 'available' or 'selected'
  const [dragOverZone, setDragOverZone] = useState(null); // used to highlight the zone under the cursor

  // DERIVED VALUES - calculated from state, not stored
  const phone = COURTESY_LIST.find((item) => item.id === phoneId);
  const charger = COURTESY_LIST.find((item) => item.id === chargerId);
  const totalBond = phone.bond + charger.bond;

  // DERIVED VALUES - which items sit in each drag and drop zone
  const selectedItems = [phone, charger].filter((item) => item.id !== 0);
  const availableItems = COURTESY_LIST.filter(
    (item) => item.id !== 0 && item.id !== phoneId && item.id !== chargerId,
  );

  // HANDLERS
  // Choosing a phone or charger replaces the previous one of the same type
  const selectItem = (item) => {
    if (item.type === "phone") setPhoneId(item.id);
    else setChargerId(item.id);
  };

  // Moving an item back to Available empties its slot
  const removeItem = (item) => {
    if (item.type === "phone") setPhoneId(0);
    else setChargerId(0);
  };

  // Click and keyboard use the same rule: selected items go back, available items are selected
  const toggleItem = (item) => {
    if (item.id === phoneId || item.id === chargerId) removeItem(item);
    else selectItem(item);
  };

  // DRAG AND DROP HANDLERS (HTML5 Drag and Drop API)
  const handleDragStart = (event, item, zone) => {
    event.dataTransfer.setData("text/plain", String(item.id)); // the id travels with the drag
    event.dataTransfer.effectAllowed = "move";
    setDragSource(zone);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDragOverZone(null);
  };

  // preventDefault() is what allows a drop; a zone only accepts items from the other zone
  const handleDragOver = (event, zone) => {
    if (dragSource && dragSource !== zone) {
      event.preventDefault();
      setDragOverZone(zone);
    }
  };

  // Only clear the highlight when the cursor really leaves the zone, not when it moves over an item inside it
  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDragOverZone(null);
    }
  };

  const handleDrop = (event, zone) => {
    event.preventDefault();
    const droppedId = Number(event.dataTransfer.getData("text/plain"));
    const item = COURTESY_LIST.find((entry) => entry.id === droppedId);
    if (item && dragSource !== zone) {
      if (zone === "selected") selectItem(item);
      else removeItem(item);
    }
    handleDragEnd();
  };

  // Keyboard support: Enter or Space moves the focused item, the same as a drop
  const handleItemKeyDown = (event, item) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleItem(item);
    }
  };

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

      {/*Choose items: drag between Available and Selected (clicking or pressing Enter also works)*/}
      <h5 className="ms-3 mt-3">Choose a Phone and/or Charger</h5>
      <p className="ms-3 me-3 small">
        Drag an item into Selected, or click it. You can borrow only one phone
        and one charger.
      </p>
      <div className="row ms-3 me-3 g-2 mb-3">
        {[
          { zone: "available", title: "Available", items: availableItems },
          { zone: "selected", title: "Selected", items: selectedItems },
        ].map(({ zone, title, items }) => (
          <div key={zone} className="col-6">
            <div
              className={`border border-2 rounded p-2 h-100 ${
                dragOverZone === zone
                  ? "bg-success-subtle border-success"
                  : "bg-white"
              }`}
              style={{
                borderStyle: "dashed",
                minHeight: "12em",
                maxHeight: "16em",
                overflowY: "auto",
              }}
              onDragOver={(event) => handleDragOver(event, zone)}
              onDragLeave={handleDragLeave}
              onDrop={(event) => handleDrop(event, zone)}
            >
              <div className="fw-bold small mb-2">{title}</div>

              {items.length === 0 && (
                <span className="text-muted small">
                  {zone === "selected"
                    ? "Drop a phone or charger here"
                    : "No items left"}
                </span>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  draggable
                  className="border rounded bg-light px-2 py-1 mb-1 small d-flex justify-content-between"
                  style={{ cursor: "grab" }}
                  onDragStart={(event) => handleDragStart(event, item, zone)}
                  onDragEnd={handleDragEnd}
                  onClick={() => toggleItem(item)}
                  onKeyDown={(event) => handleItemKeyDown(event, item)}
                >
                  <span>{item.name}</span>
                  <span
                    className={
                      isBusiness && zone === "selected"
                        ? "text-decoration-line-through text-muted"
                        : ""
                    }
                  >
                    {toNZD(item.bond)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
