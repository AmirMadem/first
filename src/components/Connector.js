import './arrow.css';

import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "./SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';
import VotingBar from './VotingBar.js'
import ExpVotingBar from './ExpVotingBar.js'
import AddingConnector from "./AddinConnector.js";
import {connectorsVotingTypesObj, claimsVotesTypesObj,connectorTypes} from '../voteTypes.js';


const Connector = (props) =>{

    const [claimClicked,setClaimClicked] = useState(false);
    const [logFails,setLogFails] = useState([]);

    const onClaimClick = (connectorID) =>{
       // props.openClaim(claimID,claimClicked);
        if(!claimClicked){
            //setLogFails(manageData.getConnectorsClaims(props.claim.ID,props.userID))
        }
        setClaimClicked(!claimClicked)	

    }

    return(
        <div id= {props.ID}>
			<div>
                <div className="connector-headline" style={{color:connectorTypes[props.connector.type].color}}>
                {connectorTypes[props.connector.type].title}
                </div>
                <div className="connector-content">
                    <div className="connector-claims">
                        {props.connector.connectorClaims.map((connectorClaim,index)=>
                            <div key={index}>
                                <span>- {connectorClaim.content} -</span> 
                            </div>
                        )}				
                    </div> 
                    <div className="connector-type-arrow">
                        <div className="arrow">
                     
                        </div>
                        
                    </div>                
                    <div className="target-claim">
                        <span>{props.connector.targetClaim.content}</span> 
                    </div>
                </div>
			</div>
            <ExpVotingBar  userID={props.userID} claim={props.connector} votes={props.connector.votes} votingTypes={connectorsVotingTypesObj} claimType ='claim' updateVotes={manageData.updateVotes} status={props.connector.userVoteStatus} isOnFeed={true}/>
        </div>
    )

}

export default Connector;