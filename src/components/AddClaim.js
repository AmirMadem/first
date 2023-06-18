import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';


const AddClaim = (props)=>{
    var g ="add-new-claim-submit-container";
    const [newClaim,setNewClaim] = useState('');
    const [submitButtonClass,setSubmitButtonClass] = useState('add-new-claim-submit-container disabled')

    const handleChange =(e)=>{
		setNewClaim(e.target.value)
    }

    const addNewClaim =() =>{
		props.addNewClaim(newClaim);
        setNewClaim('')
	}

    return(
        <div className="tab-container">
            <div>
                <textarea 
                    type="text" 
                    value={newClaim} 
                    onChange={handleChange}
                    className="add-new-claim-text"
                    placeHolder="Any more ideas ? (:"
                /> 
            </div>
            {!newClaim == '' && 
                <div className="add-new-claim-submit-container">
                    <button className="add-new-claim-submit" onClick={addNewClaim} >
                        Publish new statement
                    </button>
                </div>
            }
        </div> 
    )

}

export default AddClaim;