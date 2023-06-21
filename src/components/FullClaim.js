
import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import {connectorsVotingTypesObj, claimsVotesTypesObj,connectorTypes} from '../voteTypes.js';
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


const InnerConnector =(props) =>{
	var linkTo = "claim"+ props.conGroup.targetClaimID;

	return(
		<div style={{color:connectorTypes[props.connectorType].color}}>
			<div className="log-conn-type">{connectorTypes[props.connectorType].title}</div> 
			<div className="conn-group">
				{props.conGroup.logConns.map((logConn,index)=>
					<div key={index}>
						 <Link to={'claim'+logConn.claimID} spy={true} smooth={true} offset={100} duration={50} ><span>- {logConn.content} -</span> </Link>
					</div>
				)}
				<VotingBar userID={props.userID} claim={props.conGroup}  votingTypes={props.votingTypes} claimType ='logconn' updateVotes={manageData.updateVotes} status={props.status}/>
			</div>
		</div>		
	);
}

const FullClaim =(props) =>{

	const [connectorsByType,setConnectorsByType] = useState(props.claim.connectors);
	var linkToTrees = '../trees/' + JSON.stringify(props.userID) +'/'+ props.claim.ID;

	var claimDomElementID = "claim" + props.claim.ID;
	var statuses = {};
	var connectorsCount = 0;


	for(var ind01=0;ind01<4;ind01++){
		if(!!props.claim.connectors && !!props.claim.connectors[ind01]){
			for(var ind02=0;ind02<props.claim.connectors[ind01].length;ind02++){
				if(!!props.claim.connectors[ind01][ind02]){
					statuses[props.claim.connectors[ind01][ind02].ID] = props.claim.connectors[ind01][ind02].userVoteStatus;
					connectorsCount++;
				}
			}
		}
	}


	const scrollToTop = ()=>{
		var claimHead = document.getElementById('anchor-name');
		console.log("claimHead")
		console.log(claimHead)
		claimHead.scrollIntoView({
			behavior: 'instant',
			block: 'center',
			inline: 'center'
		});
	}
	
	const openAddConnector = (e)=>{
		e.stopPropagation();
		props.openClaim(props.claim,true)
		scrollToTop();
	}

	return(
		<div id= {claimDomElementID} style={{width:'100%',height:'100%'}}>
			{!!props.claim &&
				<div>
					{!props.isOnTree &&
						<div style={{width:'100%'}}> 
							<div className='claim-content-feed' style={{maxWidth:'68%'}}>
								<DomLink style={{textDecoration:'none'}} to={linkToTrees} target='_blank'> 🌳 </DomLink>
								<span>{props.claim.content}</span>
							</div>
							<div style={{maxWidth:'32%'}}>
								<div style={{position:'absolute',width:'80px',right:'0px',top:'15px'}}>
									<PieChart  votes = {props.claim.votes} title ='Left'/>
								</div>
								<div style={{position:'absolute',width:'80px',right:'80px',top:'15px'}}>
									<PieChart votes = {props.claim.votes} title ='Right'/>
								</div>
							</div>	
							<div className='claim-actions-feed'>
								<div className='in-line-2'>
									<ExpVotingBar  userID={props.userID} claim={props.claim} votes={props.claim.votes} votingTypes={claimsVotesTypesObj} claimType ='claim' updateVotes={manageData.updateVotes} status={props.claim.userVoteStatus} isOnFeed={true}/>
								</div>
								<div className='in-line-2' onClick={(e)=>openAddConnector(e)}>
									Add Connector
								</div>
							</div>
						</div>
					}
					{!!props.isOnTree &&
						<div style={{marginBottom:'15px'}}>
							<div style={{textAlign:'center',width:'50%', display:'inline-block'}}>
								<DomLink style={{textDecoration:'none'}} to={linkToTrees} target='_blank'> 🌳 </DomLink>
								<span>{props.claim.content}</span>
							</div>
								<div style={{textAlign:'center',width:'50%',display:'inline-block'}}>
									<ExpVotingBar  userID={props.userID} claim={props.claim} votes={props.claim.votes} votingTypes={claimsVotesTypesObj} claimType ='claim' updateVotes={manageData.updateVotes} status={props.claim.userVoteStatus} isOnFeed={true} isOnFooter={true}/>
								</div>
						</div>	
					}
					<div style={{position:'relative'}}>
						<div id="anchor-name" style={{position:'absolute', top: '120px', left:'0px'}}></div>	
					</div>
					{!!props.isOpen  &&
						<div>
							{(!props.isOnTree && !!props.isAddConnectorPressed) &&
								<div className={"add-connector"}>
									<AddingConnector userID={props.userID} targetClaimID={props.claim.ID} setConnectorsByType={setConnectorsByType} isOpen={props.isAddConnectorPressed} />
								</div>
							}
							<div className="connectors">
								{Object.keys(connectorsByType).map((connectorType)=>
									connectorsByType[connectorType].map((conGroup,index) =>
										<InnerConnector 
											key={index} 
											connectorType={connectorType} 
											conGroup={conGroup} 
											votingTypes={connectorsVotingTypesObj} 
											userID={props.userID} 
											status={statuses[conGroup.ID]} 
										/>
									)
								)}
								{!connectorsCount &&
									<div>Philosophical frontire .. no connectors yet !</div>
								} 
							</div> 
						</div>
					}
				</div>
			}
		</div>
	);
} 

export default FullClaim;