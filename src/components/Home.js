//IMPORT
import FormCustomerDetail from './Home/FormCustomerDetail.js';
import FormRepairDetail from './Home/FormRepairDetail.js';
import FormCourtesyPhone from './Home/FormCourtesyPhone.js';
import FormCost from './Home/FormCost.js';
import FormButtons from './Home/FormButtons.js'; 
import { useNavigate } from "react-router-dom";

//FUNCTION COMPONENT 
function Home () {

    //States
    //Data
        const navigate = useNavigate();

    //Functions & Methods
        const onSubmit = async(event) => {
        event.preventDefault();//prevent browser from sending data to server
        try {
        //open the "Bookings" component
        navigate("/bookings");
        }
        //alert('Form was submitted!');
        catch(e) {
        alert('ERROR!!!');
        }
        }
    
    
    //UI Rendering
    return (
        <>
        <form className="row m-0" style={{minHeight: '60vh'}} onSubmit={onSubmit} >

            
            {/*Customner Details*/}
                <div className="col-12 col-lg-4 p-3 m-0"
                style={{minHeight:'30vh', backgroundColor:'#fbe0bc'}}> <FormCustomerDetail />
                </div>

            {/*Repair Details*/}
                <div className="col-12 col-lg-4 p-3 m-0"
                style={{minHeight:'30vh', backgroundColor:'#D5F5E3'}}> <FormRepairDetail />
                </div>

            {/*Courtesy Phone & Cost*/}
                <div className="col-12 col-lg-4 p-0 m-0">

                    {/*Courtesy phone*/}
                    <div className="p-3"
                    style={{minHeight:'30vh', backgroundColor:'#5e9597'}}> <FormCourtesyPhone />
                    </div>
                    
                    {/*Cost*/}
                    <div className="p-3" style={{minHeight:'20vh', backgroundColor:'#de8b6f'}}> <FormCost />
                    </div>
                </div>

            {/*Button area*/}
                <div className="p-3 justify-content-center d-flex align-items-center" style={{minHeight: '10vh', backgroundColor: '#de8b6f'}}> <FormButtons/>
                </div>
        </form>
        </>
        
    );

}

//EXPORT
export default Home;