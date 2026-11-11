// IMPORT
import FormCustomerDetail from "./Home/FormCustomerDetail.js";
import FormRepairDetail from "./Home/FormRepairDetail.js";
import FormCourtesyPhone from "./Home/FormCourtesyPhone.js";
import FormCost from "./Home/FormCost.js";
import FormButtons from "./Home/FormButtons.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./supabaseClient.js";
import { useAuth } from "./AuthContext.js"

// CONSTANTS - initial values used for both useState and resetForm
const INITIAL_CUSTOMER = {
  title: "Mr",
  firstName: "",
  lastName: "",
  street: "",
  suburb: "",
  city: "",
  postCode: "",
  phone: "",
  email: "",
};
const INITIAL_REPAIR = {
  purchaseDate: "",
  repairDate: "",
  repairTime: "",
  warranty: false,
  imeiNumber: "",
  make: "Apple",
  model: "",
  faultCategory: "Battery",
  faultDescription: "",
  photo: null,
};
const INITIAL_COURTESY = {
  phoneBorrow: "",
  phoneCost: 0,
  chargerBorrow: "",
  chargerCost: 0,
};
const INITIAL_COST = {
  bond: 0,
  serviceFee: 0,
  totalExclGST: 0,
  gst: 0,
  totalInclGST: 0,
};

// FUNCTION COMPONENT
function Home() {
  const { user } = useAuth();

  // STATE - form data for each child component
  const [customerDetails, setCustomerDetails] = useState(INITIAL_CUSTOMER);
  const [repairDetails, setRepairDetails] = useState(INITIAL_REPAIR);
  const [courtesyPhoneDetails, setCourtesyPhoneDetails] =
    useState(INITIAL_COURTESY);

  // costDetails is a calculated result
  const [costDetails, setCostDetails] = useState(INITIAL_COST);

  // STATE - shared data between child components
  const [sharedBond, setSharedBond] = useState(0); // FormCourtesyPhone pass data to FormCost
  const [sharedCustomerType, setSharedCustomerType] = useState("customer"); // FormCustomerDetail pass data to FormCost

  // STATE - key to reset the child components entries
  const [resetKey, setResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // HANDLERS
  const navigate = useNavigate();

  const resetForm = () => {
    setSharedBond(0);
    setSharedCustomerType("customer");

    setCustomerDetails(INITIAL_CUSTOMER);
    setRepairDetails(INITIAL_REPAIR);
    setCourtesyPhoneDetails(INITIAL_COURTESY);
    setCostDetails(INITIAL_COST);

    setResetKey((prev) => prev + 1);
  };

  const onSubmit = async (event) => {
    event.preventDefault(); // prevent browser from sending data to server
    if (submitting) return;
    setSubmitting(true);

    try {
      // Map the camelCase form state to the snake_case table columns in supabase.
      // Optional fields use || null so empty strings are stored as NULL.
      // Upload the damage photo (if any) to Supabase Storage and keep its public URL
        let photoUrl = null;
        if (repairDetails.photo) {
            const extension = repairDetails.photo.name.split(".").pop().toLowerCase();
            const path = `${crypto.randomUUID()}.${extension}`;   // unique name so photos never overwrite each other
            const { error: uploadError } = await supabase.storage
                .from('repair-photos')
                .upload(path, repairDetails.photo);
            if (uploadError) throw uploadError;
            photoUrl = supabase.storage.from('repair-photos').getPublicUrl(path).data.publicUrl;
        }
      const row = {
        user_id: user?.id ?? null,   // links the booking to the account (null if logged out)
        customer_type: sharedCustomerType,

        title: customerDetails.title,
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        street: customerDetails.street,
        suburb: customerDetails.suburb || null,
        city: customerDetails.city,
        post_code: customerDetails.postCode || null,
        phone: customerDetails.phone,
        email: customerDetails.email,

        purchase_date: repairDetails.purchaseDate,
        repair_date: new Date(
          `${repairDetails.repairDate}T${repairDetails.repairTime}`,
        ).toISOString(),
        warranty: repairDetails.warranty,
        imei_number: repairDetails.imeiNumber,
        make: repairDetails.make,
        model: repairDetails.model || null,
        fault_category: repairDetails.faultCategory,
        fault_description: repairDetails.faultDescription,
        photo_url: photoUrl,

        phone_borrow: courtesyPhoneDetails.phoneBorrow || null,
        phone_cost: courtesyPhoneDetails.phoneCost,
        charger_borrow: courtesyPhoneDetails.chargerBorrow || null,
        charger_cost: courtesyPhoneDetails.chargerCost,

        bond: costDetails.bond,
        service_fee: costDetails.serviceFee,
        total_excl_gst: costDetails.totalExclGST,
        gst: costDetails.gst,
        total_incl_gst: costDetails.totalInclGST,
        
      };

      console.log(row);
      
      const { error } = await supabase.from("bookings").insert(row);
      if (error) throw error;

      navigate("/Bookings"); // the Bookings page loads from Supabase
    } catch (e) {
      alert("Could not save the booking. Please try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // UI RENDERING
  return (
    <div>
      <form
        className="row m-0"
        style={{ minHeight: "60vh" }}
        onSubmit={onSubmit}
      >
        {/*Customer Details*/}
        <div
          className="col-12 col-lg-4 p-3 m-0"
          style={{ minHeight: "30vh", backgroundColor: "#fbe0bc" }}
        >
          <FormCustomerDetail
            key={resetKey}
            passDataToParent={setSharedCustomerType}
            sendCustomerDetails={setCustomerDetails}
          />
        </div>

        {/*Repair Details*/}
        <div
          className="col-12 col-lg-4 p-3 m-0"
          style={{ minHeight: "30vh", backgroundColor: "#D5F5E3" }}
        >
          <FormRepairDetail
            key={resetKey}
            sendRepairDetails={setRepairDetails}
          />
        </div>

        {/*Courtesy Phone & Cost*/}
        <div className="col-12 col-lg-4 p-0 m-0">
          {/*Courtesy phone*/}
          <div
            className="p-3"
            style={{ minHeight: "30vh", backgroundColor: "#5e9597" }}
          >
            <FormCourtesyPhone
              key={resetKey}
              passDataToParent={setSharedBond}
              sendCourtesyPhoneDetails={setCourtesyPhoneDetails}
              customerType={sharedCustomerType}
            />
          </div>

          {/*Cost*/}
          <div
            className="p-3"
            style={{ minHeight: "20vh", backgroundColor: "#de8b6f" }}
          >
            <FormCost
              key={resetKey}
              sharedPropBond={sharedBond}
              sharedPropWarranty={repairDetails.warranty}
              sharedPropCustomerType={sharedCustomerType}
              sendCostDetails={setCostDetails}
            />
          </div>
        </div>

        {/*Button area*/}
        <div
          className="p-3 justify-content-center d-flex align-items-center"
          style={{ minHeight: "10vh", backgroundColor: "#de8b6f" }}
        >
          <FormButtons resetForm={resetForm} />
        </div>
      </form>
    </div>
  );
}

// EXPORT
export default Home;
