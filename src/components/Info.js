import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';
import Tabs from './Tabs.js'
import './info.css';

const Info = (props) =>{

    var politicalIdenteties = ['Conservative','Liberal','Rigth-Wing Libertarian','Left-Wing Libertarian'];
    var currentIdentity = 'Rigth-Wing Libertarian';
    var economic ='Rigth';
    var general= 'Rigth';

    const [currentSelect,setCurrentSelect] = useState(currentIdentity);
    const [currentEconomic,setcurrentEconomic] = useState(economic);
    const [currentGeneral,setCurrentGeneral] = useState(general);

    const onPIchange = (value) =>{
        setCurrentSelect(value);
    }
    const onEcoChange = (tabTitle) =>{
        setcurrentEconomic(tabTitle);
    }
    const onGeneralChange = (tabTitle) =>{
        setCurrentGeneral(tabTitle);
    }

    var tabs = [{title:'Left'},{title:'None'},{title:'Rigth'}]	;

    return(
        <div className="claim-container">
            <div className="form-section">
                <span>Political identification</span>
                <div className="form-part">
                    <select 
                        name="politicalIdentification"
                        defaultValue={currentIdentity}
                        onChange={({ target: { value } }) => onPIchange(value)}
                    >      
                        {politicalIdenteties.map((identity,index) =>
                            (
                             <option key={index} value={identity}>{identity}</option> 
                            ) 
                        )}
                        <option key='Other' value='Other'>Other</option>
                    </select>
                </div>
                {currentSelect == 'Other' && 
                    <div className="form-part">
                        <input className="form-part-input" type='text' />
                    </div>
                }
            </div>
            <div>
                <div className="form-section" >
                    <div className="form-part">
                        <span>Economics</span>
                    </div>
                    <div className="form-part">
                        <Tabs  tabs={tabs} chosenTab={currentEconomic} tabContainer="rigth-left-container" tabClass="rigth-left-tabs" onTabChange={onEcoChange}/>
                    </div>
                </div>
                <div className="form-section">
                    <div className="form-part">
                        <span>General</span>
                    </div>
                    <div className="form-part">
                        <Tabs  tabs={tabs} chosenTab={currentGeneral} tabContainer="rigth-left-container" tabClass="rigth-left-tabs" onTabChange={onGeneralChange}/>
                    </div>
                </div>
            </div> 
        </div>   
    )
}

export default Info;