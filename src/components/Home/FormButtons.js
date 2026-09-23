//IMPORT
import {Link} from 'react-router-dom';

//FUNCTION COMPONENT 
function FormButtons() {

    const buttonStyle = {
        width: '10em',
        height: '4em',
    };

    
 //Component UI Rendering
 return(
    <>
            <input type="submit" className="btn me-3 fw-bold text-dark bg-white" style={buttonStyle} value="SUBMIT" />
            <input type="reset" className="btn me-3 fw-bold text-dark bg-white" style={buttonStyle} value="RESET" />
            <Link to="/FAQ">
                <input type="button" className="btn me-3 fw-bold text-dark bg-white" style={buttonStyle} value="FAQ" />
            </Link>
    </>
);
}

//EXPORT
export default FormButtons; 