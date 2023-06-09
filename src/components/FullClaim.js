
import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "./SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import  { Link } from 'react-scroll';
import VotingBar from './VotingBar.js'
import AddingConnector from "./AddinConnector.js";
import Tree from "./tree/Tree.js"
import Trees from "./tree/Trees.js"
import Dom, { Link as DomLink,useNavigate } from 'react-router-dom'



const connectorTypes ={0:'Contradict',1:'Weeken',2:'Aprove',3:'Enhance'};

var connectorVotesTypes =  [
	{ID:7,name:'False',title:'',color:'red',fullName:'False Claims and Wrong logical connection'},{ID:8,title:'',name:'FalseCorrect',color:'orange',fullName:'False Claims but Correct logical connection'},{ID:9,title:'',name:'TrueWrong',color:'blue',fullName:'True Claims but Wrong logical connection'},{ID:10,title:'',name:'True',color:'green',fullName:'True Claims and Correct logical connection'}
		];
var claimVoteTypes = [{ID:1,title:'True',color:'green',fullName:'100% true !'},{ID:2,title:'M True',color:'blue',fullName:'mostly True...'},{ID:3,title:'Positive',color:'yellow',fullName:'got a good feeling about it !'},{ID:4,title:'Undefined',color:'pink',fullName:'not specific enough'},{ID:5,title:'M False',color:'orange',fullName:'mostly False'},{ID:6,title:'False',color:'red',fullName:'Complete Bullshit !'}]
var votingTypes = claimVoteTypes;

var connectorsVotingTypesObj ={
    
    7:{ID:7,title:'',name:'False',color:'red',fullName:'False Claims and Wrong logical connection'},
    8:{ID:8,title:'',name:'FalseCorrect',color:'orange',fullName:'False Claims but Correct logical connection'},
    9:{ID:9,title:'',name:'TrueWrong',color:'blue',fullName:'True Claims but Wrong logical connection'},
    10:{ID:10,title:'',name:'True',color:'green',fullName:'True Claims and Correct logical connection'}

}

var claimsVotesTypesObj ={
    1:{ID:1,title:'',name:'True',color:'green',fullName:'100% true !'},
    2:{ID:2,title:'',name:'Mostly True',color:'blue',fullName:'Mostly True...'},
    3:{ID:3,title:'',name:'Positive',color:'yellow',fullName:'Got a good feeling about it !'},
    4:{ID:4,title:'',name:'Undefined',color:'pink',fullName:'Un clear or not specific enough'},
    5:{ID:5,title:'',name:'Mostly False',color:'orange',fullName:'Got a good feeling about it !'},
    6:{ID:6,title:'',name:'False',color:'red',fullName:'Complete Bullshit !'},
}

const InnerConnector =(props) =>{
	var linkTo = "claim"+ props.conGroup.targetClaimID;

	return(
		<div>
			<div className="log-conn-type">{connectorTypes[props.connectorType]}</div>
			<div className="conn-group">
				{props.conGroup.logConns.map((logConn,index)=>
					<div key={index}>
						 <Link to={'claim'+logConn.claimID} spy={true} smooth={true} offset={100} duration={50} ><span>- {logConn.content} -</span> </Link>
					</div>
				)}
				<VotingBar  userID={props.userID} claim={props.conGroup}  votingTypes={props.votingTypes} claimType ='logconn' updateVotes={manageData.updateVotes} status={props.status}/>
			</div>
		</div>		
	);
}

const FullClaim =(props) =>{

var claimDomElementID = "claim" + props.claim.ID;
var statuses = {};

for(var ind01=0;ind01<4;ind01++){
	if(!!props.claim.connectors && !!props.claim.connectors[ind01]){
		for(var ind02=0;ind02<props.claim.connectors[ind01].length;ind02++){
			if(!!props.claim &&  !!props.claim.connectors[ind01] && !!props.claim.connectors[ind01][ind02]){
				statuses[props.claim.connectors[ind01][ind02].ID] = props.claim.connectors[ind01][ind02].userVoteStatus;
			}
		}
	}
}


const [connectorsByType,setConnectorsByType] = useState(props.claim.connectors);

const onClaimClick = () =>{
	props.openClaim(props.claim.ID,props.isOpen);
}

var linkToTrees = 'trees/' + JSON.stringify(props.userID) +'/'+ props.claim.ID;

	return(
		<div id= {claimDomElementID} gen={props.gen} className= {!props.isOpen ? "claim-container" :"claim-container claim-container-pressed"} onClick={onClaimClick}>
			<div>
			<DomLink to={linkToTrees} target='_blank'> - T - </DomLink>	<span>{props.claim.content}</span>
				<VotingBar  userID={props.userID} claim={props.claim} votes={props.claim.votes} votingTypes={claimsVotesTypesObj} claimType ='claim' updateVotes={manageData.updateVotes} status={props.claim.userVoteStatus}/>
			</div>
			{!!props.isOpen  &&
			<div>
				<div className={"add-connector"}>
					<AddingConnector userID={props.userID} targetClaimID={props.claim.ID} setConnectorsByType={setConnectorsByType} />
				</div>
				<div className="connectors">
					<div className="contradicting-part">
						{Object.keys(connectorsByType).map((connectorType)=>
							connectorType < 2 && connectorsByType[connectorType].map((conGroup,index) =>
								<InnerConnector key={index} connectorType={connectorType} conGroup={conGroup} votingTypes={connectorsVotingTypesObj} userID={props.userID} status={statuses[conGroup.ID]}   />
							)
						)}
					</div>
					<div className="Aprove-part">			
						{Object.keys(connectorsByType).map((connectorType)=>
							connectorType > 1 && connectorsByType[connectorType].map((conGroup,index) =>
								<InnerConnector key={index} connectorType={connectorType} conGroup={conGroup} votingTypes={connectorsVotingTypesObj} userID={props.userID} status={statuses[conGroup.ID]} />
							)
						)}
					</div>
				</div> 
			</div>
			}

		</div>
	);
} 

export default FullClaim;