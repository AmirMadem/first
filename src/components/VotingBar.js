import React, { useState, useEffect,useRef} from "react";
import manageData from '../manageData.js';


const onVoting = (votingData) =>{
	
	if(!!votingData.userID){
		
		var userID = votingData.userID;
		var claimID = votingData.claimID;
		var currentClick = votingData.currentClick;              
		var userVoteStatus = votingData.userVoteStatus;
		var setUserVoteStatus = votingData.setUserVoteStatus;
		var setExpVStatus = votingData.setExpVStatus
		var votes = votingData.votes;
		var setVotes = votingData.setVotes;
		var updateVotes = votingData.updateVotes;
		var claimType = votingData.claimType;
		var claims = votingData.claims;

		if(!votes[currentClick]){
			votes[currentClick] = 0;
		}

	    if(userVoteStatus == 'UNENGAGED' ||  userVoteStatus == '' ||  userVoteStatus == null)
	    {	
			votes[currentClick]++;
	    	setUserVoteStatus(currentClick);
			if(!!setExpVStatus){
				setExpVStatus(currentClick);
			}
	    	updateVotes(claimID,userID,'add',currentClick,claimType,claims);	
		} 
		else
		{	
			votes[userVoteStatus]--;
			updateVotes(claimID,userID,'remove',userVoteStatus,claimType);

			if(currentClick == userVoteStatus){
				setUserVoteStatus('UNENGAGED');
				if(!!setExpVStatus){
					setExpVStatus('UNENGAGED');
				}
			}
			else{
				votes[currentClick]++;
				setUserVoteStatus(currentClick);
				if(!!setExpVStatus){
					setExpVStatus(currentClick);
				}
				updateVotes(claimID,userID,'add',currentClick,claimType,claims);

			}
		}
		setVotes(votes); 
	}
}

const VotingBar = (props) =>{


	const unChosenRateClass='rate-type';
	const chosenRateClass ="rate-type rate-type-pressed";
	const [chosenVoteType, setChosenVoteType] = useState(props.status);
	const [hoveredVoteType,setHoveredVoteType] = useState();
	const [votes,setVotes] = useState(props.claim.votes);

	var votingBarClass;

	if(props.claimType == 'logconn'){
		votingBarClass = 'voting-bar-logconn';
	}
	else if(props.claimType == 'tree-claim' || props.claimType == 'tree-logconn'){
		votingBarClass = 'voting-bar-tree-claim';
	}
	else{
		votingBarClass = 'voting-bar';
	} 

	const onRateClick = (e,voteType) =>{
		e.stopPropagation();
		
		var votingData ={
			userID: props.userID,
			claimID:props.claim.ID,
			claimType:props.claimType,
			currentClick:voteType.ID,    
			userVoteStatus:chosenVoteType,
			setUserVoteStatus:setChosenVoteType,
			votes:votes,
			setVotes:setVotes,
			updateVotes:props.updateVotes,
			setExpVStatus:props.setExpVStatus,
		};
		if(!!props.claim.claims){
			votingData.claims = props.claim.claims;
		}

		onVoting(votingData);
	}

	const mouseOverVote = (voteType)=>{
		setHoveredVoteType(voteType)
	}
	const mouseOutVote = ()=>{

	}

	//var rateWidth = 100/(props.votingTypes.length) + '%';
	var rateWidth = 100/(Object.keys(props.votingTypes).length) + '%';

	return(
		<div>

				<div className={votingBarClass} style={{zIndex:'99999',backgroundColor:'white',borderRadius:'18px'}}>
					{Object.keys(props.votingTypes).map((voteType,index) =>						
						<div key={index} 
							className={voteType == chosenVoteType ? chosenRateClass : unChosenRateClass} 
							style={{width:rateWidth,color:props.votingTypes[voteType].color,backgroundColor: hoveredVoteType == voteType ? props.votingTypes[voteType].backgroundColor : 'white' }} 
							title={props.votingTypes[voteType].fullName} 
							onClick={(e) => onRateClick(e,props.votingTypes[voteType])}
							onMouseOver={()=>mouseOverVote(voteType)} onMouseOut={()=>mouseOutVote(voteType)}
						>
								<div>{!!votes[voteType] ? votes[voteType] : '0'}</div>
								<div>{props.votingTypes[voteType].title} </div>
						</div>		 
					)}
				</div> 
				
		</div>			
	);
}

export default VotingBar;