
import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import {connectorsVotingTypesObj, claimsVotesTypesObj} from '../voteTypes.js';
import ReactDOM from 'react-dom';
import SearchinBox from "./SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import  { Link } from 'react-scroll';
import VotingBar from './VotingBar.js'
import AddingConnector from "./AddinConnector.js";
import Tree from "./tree/Tree.js"
import Trees from "./tree/Trees.js"
import ExpVotingBar from './ExpVotingBar.js'
import {PieChart} from './PieChart.js'


import Dom, { Link as DomLink,useNavigate } from 'react-router-dom'



const connectorTypes ={0:'Contradict',1:'Weeken',2:'Aprove',3:'Enhance'};

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

	const tempData = [
		["Task", "Hours per Day"],
		["Work", 1],
		["Eat", 2],
		["Commute", 2],
		["Watch TV", 2],
		["Sleep", 7],
	  ];

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
	var linkToTrees = '../trees/' + JSON.stringify(props.userID) +'/'+ props.claim.ID;

	return(
		<div id= {claimDomElementID} style={{width:'100%',height:'100%'}}>
		{!!props.claim &&
			<div>
				{!props.isOnTree &&
					<div>
						<DomLink style={{textDecoration:'none'}} to={linkToTrees} target='_blank'> 🌳 </DomLink>
						<span>{props.claim.content}</span>
						<div style={{position:'absolute',right:'0px',top:'20px'}}>
							<div style={{position:'absolute',width:'150px',right:'0px',top:'0px'}}>
								<PieChart data={tempData} votes = {props.claim.votes} title ='Left'/>
							</div>
							<div style={{position:'absolute',width:'150px',right:'150px',top:'0px'}}>
								<PieChart data={tempData} votes = {props.claim.votes} title ='Right'/>
							</div>
						</div>		
						<div style={{position:'absolute',bottom:'15px'}}>
							<ExpVotingBar  userID={props.userID} claim={props.claim} votes={props.claim.votes} votingTypes={claimsVotesTypesObj} claimType ='claim' updateVotes={manageData.updateVotes} status={props.claim.userVoteStatus} isOnFeed={true}/>
						</div>
					</div>
				}
				{!!props.isOnTree &&
					<div style={{textAlign:'center'}}>
						<DomLink style={{textDecoration:'none'}} to={linkToTrees} target='_blank'> 🌳 </DomLink>
						<span>{props.claim.content}</span>
					</div>
				}
			{!!props.isOpen  &&
			<div>
					{!props.isOnTree &&
						<div className={"add-connector"}>
							<AddingConnector userID={props.userID} targetClaimID={props.claim.ID} setConnectorsByType={setConnectorsByType} />
						</div>
					}
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
		}
		</div>
	);
} 

export default FullClaim;