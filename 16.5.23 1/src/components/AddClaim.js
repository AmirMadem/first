import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';


const AddClaim = (props)=>{

    const [newClaim,setNewClaim] = useState('');

    const handleChange =(e)=>{
		setNewClaim(e.target.value)
    }

    const addNewClaim =() =>{
		props.addNewClaim(newClaim);
        setNewClaim('')
	}

    return(
        <div className="tab-container">
            <input 
                type="text" 
                value={newClaim} 
                onChange={handleChange}
            /> 
            <button onClick={addNewClaim}>Add</button>
        </div> 
    )

}

export default AddClaim;