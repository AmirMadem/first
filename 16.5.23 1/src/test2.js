


const onVoting = (votingData) =>{

	var userID = votingData.userID;
	var currentClick = votingData.currentClick;    
	var userVoteStatus = votingData.userVoteStatus;
	var setUserVoteStatus = votingData.setUserVoteStatus;
	var votes = votingData.votes;
	var setVotes = votingData. setVotes

}

	{images.map((image) =><img src={image} className="agreements-bunners"  />) }

<VotingBar  userID={props.userID} claim={props.conGroup} votingTypes={props.votingTypes} claimType ='logconn'/>


	  <div key={index} 
							 	className={index+1 == chosenRateNumber ? chosenRateClass : unChosenRateClass} 
							    style={{width:'25%',color:voteType.color}} 
							    onClick={(e) => onRateClick(e,index)}>{voteType.title} {votes[index+1]} 
							 </div>



return(
		!isLogConnGroup ? 
			<div className="voting-bar" >
						{props.votingTypes.map((voteType,index) =>						

							 <div key={index} 
							 	className={index == chosenRateNumber ? chosenRateClass : unChosenRateClass} 
							    style={{width:'16.66666%',color:voteType.color}} 
							    onClick={(e) => onRateClick(e,index)}><div>{votes[index]}</div><div>{voteType.title} </div>
							 </div>
							 
						)}
			</div> 

			:

			<div className="voting-bar-logconn" >
				{props.votingTypes.map((voteType,index) =>						
	  				<div key={index} 
						className={index == chosenRateNumber ? chosenRateClass : unChosenRateClass} 
					    style={{width:'25%',color:voteType.color}} 
						onClick={(e) => onRateClick(e,index)}><div>{votes[index]}</div><div>{voteType.title} </div>
					</div>		 
				)}
			</div> 		
	);


onClick={(e) => onLogConnClick(e,logConn.claimID)