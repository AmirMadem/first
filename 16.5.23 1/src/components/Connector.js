import './arrow.css';

import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "./SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';
import VotingBar from './VotingBar.js'
import AddingConnector from "./AddinConnector.js";

const logConnTypes ={0:'Contradict',1:'Weeken',2:'Aprove',3:'Enhance'};
const logConnTypes2 ={0:{title:'Contradict',color:'red'},1:{title:'Weeken',color:'pink'},2:{title:'Aprove',color:'green'},3:{title:'Enhance',color:'blue'}};

var logConnVotingTypes =  [
	{ID:7,name:'False',title:'',color:'red',fullName:'False Claims and Wrong logical connection'},{ID:8,title:'',color:'orange',fullName:'False Claims but Correct logical connection'},{ID:9,title:'',color:'blue',fullName:'True Claims but Wrong logical connection'},{ID:10,title:'',color:'green',fullName:'True Claims and Correct logical connection'}
		];
var claimVoteTypes = [{ID:1,title:'True',color:'green',fullName:'100% true !'},{ID:2,title:'M True',color:'blue',fullName:'mostly True...'},{ID:3,title:'Positive',color:'yellow',fullName:'got a good feeling about it !'},{ID:4,title:'Undefined',color:'pink',fullName:'not specific enough'},{ID:5,title:'M False',color:'orange',fullName:'mostly False'},{ID:6,title:'False',color:'red',fullName:'Complete Bullshit !'}]
var votingTypes = claimVoteTypes;


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
        <div id= {props.ID} className= {!claimClicked ? "claim-container" :"claim-container claim-container-pressed"} onClick={(e) => onClaimClick(props.connector.ID)}>
			<div>
                <div className="connector-headline" style={{color:logConnTypes2[props.connector.type].color}}>
                {logConnTypes2[props.connector.type].title}
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
                        <span>{props.connector.claim.content}</span> 
                    </div>
                </div>
			</div>
            <VotingBar  userID={props.userID} claim={props.connector}  votingTypes={logConnVotingTypes} claimType ='logconn' updateVotes={manageData.updateVotes}/>
        </div>
    )

}

export default Connector;