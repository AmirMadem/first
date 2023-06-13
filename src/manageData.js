import getData from './getData.js';


const manageData = {

	addUserVotesToClaims:function(claims,userVotes){
		if(!!claims){
			var usersVotes = userVotes;
			var claim;
			var ClaimID;
			for(var ind01=0;ind01<claims.length;ind01++){
				claim = claims[ind01];
				ClaimID = parseInt(claim.ID,10);
				claim.userVoteStatus = usersVotes[ClaimID];
			}
		}
		return claims

	},
	getUsersClaims:function(userID){
		var userVotes = getData.getUserVotes(userID)
		var allCalims = getData.getUsersClaims(userID);
		manageData.addUserVotesToClaims(allCalims,userVotes);
		return allCalims;
	},
	getVotesByClaims:function(){
		var votesByClaims = {};
		var allVotes = getData.getVotes();

		var vote;
		var claimID;
		for(var ind01=0;ind01<allVotes.length;ind01++){
			vote = allVotes[ind01];
			claimID = parseInt(vote.claimID,10);
			if(!!claimID){
				if(!votesByClaims[claimID]){
					votesByClaims[claimID] = {}
				}
				if(!votesByClaims[claimID][vote.type]){
					votesByClaims[claimID][vote.type] = 0;
				}
				votesByClaims[claimID][vote.type]++;
			}
		}

		return votesByClaims;
	},
	getUsersTreeObjects:function(userID){
		var userTreeConnectors = {};
		var allConnectors = getData.getConnectors();
		var allConnectorsObj ={};
		var allClaimsObj ={};
		var logicalConnections =getData.getConnectorsClaims()
		var usersClaims ={};
		var allClaims = manageData.getContentByClaims();
		var claimID;
		var allUsersVotesClaims = getData.getClaims('Votes',userID)
		var votesByConnectors = manageData.getVotesByConnectors();

		for(var ind01=0;ind01<allConnectors.length;ind01++){
			allConnectorsObj[allConnectors[ind01].ID] =allConnectors[ind01];
			for(var ind02=0;ind02<logicalConnections.length;ind02++){
				if(logicalConnections[ind02].groupID == allConnectors[ind01].ID){
					if(!allConnectorsObj[allConnectors[ind01].ID].claims){
						allConnectorsObj[allConnectors[ind01].ID].claims =[]
					}
					claimID = parseInt(logicalConnections[ind02].claimID,10);
					allConnectorsObj[allConnectors[ind01].ID].claims.push(claimID)
					allClaimsObj[claimID] ={ID:claimID,content:allClaims[claimID]}
				}
				claimID = parseInt(allConnectors[ind01].targetClaimID,10);
				allClaimsObj[claimID] = {ID:claimID,content:allClaims[claimID]}
			}
		}

		var userConnectorsVotes = getData.getUserVotes(userID,"logconn");

		for(var vote in userConnectorsVotes){

			if(userConnectorsVotes[vote]== 10)
			{
				userTreeConnectors[vote] = allConnectorsObj[vote];
				userTreeConnectors[vote].votes = votesByConnectors[vote];
				userTreeConnectors[vote].userVoteStatus = 10;

				var claimID;
				for(var ind01=0;ind01<userTreeConnectors[vote].claims.length;ind01++){
					claimID = parseInt(userTreeConnectors[vote].claims[ind01],10);
					usersClaims[claimID] = allClaimsObj[claimID];
				}
			}
		}
		for(var ind01=0;ind01<allUsersVotesClaims.length;ind01++){
			usersClaims[allUsersVotesClaims[ind01].ID] =allUsersVotesClaims[ind01];
		}

		return {connectors:userTreeConnectors,claims:usersClaims};

	},


	getVotesByConnectors:function(){
		var votesByLogConns = {};
		var allVotes = getData.getConnectorsVotes();
		var vote;
		var groupID;
		for(var ind01=0;ind01<allVotes.length;ind01++){
			vote = allVotes[ind01];
			groupID = parseInt(vote.groupID,10);
			if(!!groupID){
				if(!votesByLogConns[groupID]){
					votesByLogConns[groupID] ={};
				}
				if(!votesByLogConns[groupID][vote.type]){
					votesByLogConns[groupID][vote.type] = 0;
				}
				votesByLogConns[groupID][vote.type]++;
			}
		}
		return votesByLogConns;
	},
	ignoreItem:function(claimID,userID,claimType){
		if(claimType != 'logconn'){
			getData.ignoreItem(claimID,userID);
		}
	},

	updateVotes:function(claimID,userID,action,voteType,claimType,claims){

		console.log("claimID")
		console.log(claimID)

		if(claimType != 'logconn' && claimType != 'tree-logconn'){

			if(action == 'remove'){
				getData.removeVote(claimID,userID,voteType);
			}
			else if(action == 'add'){
				getData.addVote(claimID,userID,voteType);
			}	
		}
		else
		{
			if(action == 'remove'){
				getData.removeConnectorVote(claimID,userID,voteType);
			}
			else if(action == 'add'){
				getData.addConnectorVote(claimID,userID,voteType);
			}
		}
	},

	getAllClaims:function(claimGroup,userID){
		var allCalims = getData.getClaims(claimGroup,userID);
		var userVotes = getData.getUserVotes(userID);
		if(!!userID){
			manageData.addUserVotesToClaims(allCalims,userVotes);
		}
		return allCalims;
	},
	getClaimsVoted:function(claimGroup,userID){
		var allCalims = manageData.getAllClaims(claimGroup,userID);
		var votesByClaims = manageData.getVotesByClaims();

		var claimVotes;
		var claimID;
		for(var ind01=0;ind01<allCalims.length;ind01++){
			claimID = parseInt(allCalims[ind01].ID,10);
			claimVotes = votesByClaims[claimID];
			if(!claimVotes){
				claimVotes = {};
			}
			allCalims[ind01].votes = claimVotes;	
			allCalims[ind01].connectors = manageData.getClaimsConnectors(claimID,userID)
		}
		return allCalims;
	},
	getSpecClaimsVoted:function(userID,claimsID){
		
		var specClaims =[];
		var allCalims = manageData.getClaimsVoted("",userID);
		for(var ind01=0;ind01<claimsID.length;ind01++){
			for(var ind02=0;ind02<allCalims.length;ind02++){
				if(claimsID[ind01] == allCalims[ind02].ID){
					specClaims.push(allCalims[ind02]);
				}
			}
		}
		return specClaims;
	},

	getClaimsByTargetClaim:function(targetClaimID,userID){
		var claimsByTarget = [];
		var claimIDS =[]
		var allCalims = manageData.getClaimsVoted("",userID);
		var allLogconns = getData.getConnectorsClaims();

		for(var ind01=0;ind01<allLogconns.length;ind01++){
			if(allLogconns[ind01].targetClaimID == targetClaimID){
				if(!claimIDS.includes(allLogconns[ind01].claimID)){
					claimIDS.push(allLogconns[ind01].claimID)
				}
			}
		}
		for(var ind01=0;ind01<allCalims.length;ind01++){
			if(allCalims[ind01].ID == targetClaimID){
				claimsByTarget.push(allCalims[ind01]);
			}
		}
		for(var ind01=0;ind01<allCalims.length;ind01++){
			if(claimIDS.includes(allCalims[ind01].ID)){
				claimsByTarget.push(allCalims[ind01])

			}
	
		}
		return claimsByTarget;
	},
	getSpceClaimVoted:function(claimID,userID){
		var allCalims = manageData.getClaimsVoted('',userID);
		var specClaim;
		for(var ind01 = 0 ; ind01<allCalims.length;ind01++){
			if(allCalims[ind01].ID == claimID ){
				specClaim = allCalims[ind01];
			}
		}
		return specClaim;
	},




	getContentByClaims:function(){
		var contentByClaims = {};
		var allCalims = manageData.getAllClaims();
		var claim;
		var claimID;
		for(var ind01=0;ind01<allCalims.length;ind01++){
			claim = allCalims[ind01];
			claimID = parseInt(claim.ID,10);
			contentByClaims[claimID]= claim.content;
		}
		return contentByClaims;

	},
	addVotesAndStatusToTreeConnectors:function(claimID,userID,connectorsObj){

		for(var connectorID in connectorsObj){
			for(var ind02=0;ind02<connectorsObj[connectorID].claims.length;ind02++){
				var connectorsByTypes = manageData.getClaimsConnectors(connectorsObj[connectorID].claims[ind02],userID);

				var connectorType;
				var connector;
				for(var connectorTypeID in connectorsByTypes){
					connectorType = connectorsByTypes[connectorTypeID];
					for(var ind03=0;ind03<connectorType.length;ind03++){
						connector = connectorType[ind03];
		
						if(connectorsObj[connector.ID]){
							connectorsObj[connector.ID].votes = connector.votes;
							connectorsObj[connector.ID].userVoteStatus = connector.userVoteStatus;
						}
					}
				}
			}

		}
		return connectorsObj;
	},

	getClaimsConnectors:function(claimID,userID){
		var contentByClaims = manageData.getContentByClaims();
		var connectionsByGroupID ={};
		var logicalConnections =getData.getConnectorsClaims();
		var groupVotes = manageData.getVotesByConnectors();
		var userVotes =getData.getUserVotes(userID,"logconn");
		var logconn;
		for(var ind01=0;ind01<logicalConnections.length;ind01++){
			logconn = logicalConnections[ind01];
			if(logconn.targetClaimID == claimID){
				if(!connectionsByGroupID[logconn.groupID]){
					if(!groupVotes[logconn.groupID]){
						groupVotes[logconn.groupID] = {}
					}
					connectionsByGroupID[logconn.groupID] =
						{
							ID:logconn.groupID,
							type:logconn.type,
							votes:groupVotes[logconn.groupID],
							userVoteStatus:userVotes[logconn.groupID],
							logConns:[],
							targetClaimID:logconn.targetClaimID
						};
					
				}
				logconn.content = contentByClaims[logconn.claimID]
				connectionsByGroupID[logconn.groupID].logConns.push(logconn);
			}
		}

		var logicalConnectionsByType ={};
		var logicalConnectionsGrouped = connectionsByGroupID;
		var logType;
		var logGroup =[];
		for(const groupID in logicalConnectionsGrouped){
	
				logGroup = logicalConnectionsGrouped[groupID];
				logType = logGroup.type;
				if(!logicalConnectionsByType[logType]){
					logicalConnectionsByType[logType] = [];
				}	
				logicalConnectionsByType[logType].push(logGroup);
		}
		return logicalConnectionsByType;
	},
	addClaim:function(userID,statementContent){
		var newClaim = getData.addClaim(userID,statementContent)
		newClaim.connectors = manageData.getClaimsConnectors(newClaim.ID)
		return newClaim;
	},

	addConnector:function(claims,type,targetClaimID,userID,source){
		
		var NewConnector ={
			targetClaimID:targetClaimID,
			type:type,
			userID:userID
		}
		console.log("NewConnector")
		console.log(NewConnector)

		NewConnector = getData.addConnector(NewConnector);
		
		var newConnetorsClaims = [];
		for(var ind01=0;ind01<claims.length;ind01++){
			newConnetorsClaims[ind01] = {
				claimID:claims[ind01].ID,
				type:type,
				groupID:NewConnector.ID,
				targetClaimID:targetClaimID
			}
			getData.addConnectorClaim(newConnetorsClaims[ind01]);
		}
		if(!!source){
			getData.addConnectorVote(NewConnector.ID,userID,10)
		}
		NewConnector.claims = newConnetorsClaims;
		return NewConnector;
	},
	getSpecConnectorUserStatus:function(connectorID,userID){
		var userVoteStatus ='UNENGAGED';
		var usersVotes = getData.getUserVotes(userID,'logconn');

		if(!!usersVotes[connectorID]){
			userVoteStatus = usersVotes[connectorID];
		}

		return userVoteStatus;
	}

}

export  default manageData;