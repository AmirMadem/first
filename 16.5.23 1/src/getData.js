

const CONTRADICT = 0;
const WEEKEN = 1;
const APROVE = 2;
const ENHANCE = 3;

const UNENGAGED = 0;
const AGREEMENT =1;
const DISAGREEMENT =2;


async function postData(url = "", data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
	  method: "POST", // *GET, POST, PUT, DELETE, etc.
	  mode: "cors", // no-cors, *cors, same-origin
	  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
	  credentials: "same-origin", // include, *same-origin, omit
	  headers: {
		"Content-Type": "application/json",
		// 'Content-Type': 'application/x-www-form-urlencoded',
	  },
	  redirect: "follow", // manual, *follow, error
	  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
  }

var claims = [{ID:1,userID:10158776425001046,engagment:0,content:"Minimum wage doesn't help the poor"},{ID:2,userID:10158776425001046,engagment:0,content:"Taxation makes people poorer"},{ID:3,userID:3,engagment:0,content:"Without minimum wage, workers would be exploited"}];
var votesOnClaims = [{ID:1}];
var logicalConnections = [{ID:1,groupID: 1,userID:2,claimID:3,targetClaimID:1,type:CONTRADICT},{ID:2,groupID: 2,userID:2,claimID:2,targetClaimID:1,type:CONTRADICT}];
var logconnGroups = [{ID:1,type:CONTRADICT,targetClaimID:1},{ID:2,type:CONTRADICT,targetClaimID:1}];
var votesOnLogConnGroups = [{ID:1}]

var test4 = 1
localStorage.setItem('newIgnoredItemID',test4);
var test4 = JSON.stringify([{claimID:23,userID:2}]);
localStorage.setItem('ignoredItems',test4);

/*var newClaimID =4;
 localStorage.setItem("newClaimID",newClaimID);  
 var newConnectorClaimID =10;
localStorage.setItem("newConnectorClaimID",newConnectorClaimID); 
var newConnectorID = 10;
localStorage.setItem("newConnectorID",newConnectorID); 
var test4 = JSON.stringify(votesOnClaims);
localStorage.setItem("votesOnClaims",test4);
var test4 = JSON.stringify(claims);
localStorage.setItem("claims",test4); 
var test4 = JSON.stringify(logicalConnections);
localStorage.setItem("connectorsClaims",test4); 
var test4 = JSON.stringify(logconnGroups);
localStorage.setItem("connectors",test4); 
var test4 = JSON.stringify(votesOnLogConnGroups);
localStorage.setItem("votesOnLogConnGroups",test4); */


const getData = {
	'getVotes':function(){
			var votesStr = localStorage.getItem("votesOnClaims");
			var votesObj =JSON.parse(votesStr);
			return votesObj;
	},
	'getConnectorsVotes':function(){
			var votesStr = localStorage.getItem("votesOnLogConnGroups");
			var votesObj =JSON.parse(votesStr);
			return votesObj;
	},
	'getIgnoredItems':function(userID){
		var ignoredItemsStr = localStorage.getItem("ignoredItems");
		var ignoredItemsObj =JSON.parse(ignoredItemsStr);
		if(!!userID){
			var usersIgnoredItems = [];
			for(var ind01=0;ind01<ignoredItemsObj.length;ind01++){
				if(ignoredItemsObj[ind01].userID == userID ){
					usersIgnoredItems.push(ignoredItemsObj[ind01]);
				}
			}
			ignoredItemsObj = usersIgnoredItems;
		} 
		return ignoredItemsObj;
	},

	'getClaims':function(claimGroup,userID){
		var claimsStr =localStorage.getItem("claims");
		var claimsObj = JSON.parse(claimsStr);

	
		var usersVotes = getData.getUserVotes(userID);
		var ignoredItems = getData.getIgnoredItems(userID);

		if(!claimGroup){
			return claimsObj;
		}
		else{
			if(claimGroup == 'Popular'){
				var popularClaims =[];
				var claim;
				for(var ind01=0;ind01<claimsObj.length;ind01++){
					claim=claimsObj[ind01];
					if(claim.engagment > 2 && !usersVotes[claim.ID] && !ignoredItems.includes(claim.ID)){
						popularClaims.push(claimsObj[ind01]);
					}
				}
				return popularClaims;
			}
			if(claimGroup == 'Trending'){
				var trendyClaims =[];
				var claim;
				for(var ind01=0;ind01<claimsObj.length;ind01++){
					claim=claimsObj[ind01];
					if(claim.engagment > 0 &&  claim.engagment < 3 && !usersVotes[claim.ID] && !ignoredItems.includes(claim.ID) ){
						trendyClaims.push(claimsObj[ind01]);
					}
				}
				return trendyClaims;
			}
			if(claimGroup == 'Fresh'){
				var freshClaims =[];
				var claim;
				for(var ind01=0;ind01<claimsObj.length;ind01++){
					claim=claimsObj[ind01];
					if(claim.engagment == 0 && !usersVotes[claim.ID] && !ignoredItems.includes(claim.ID)  ){
						freshClaims.push(claimsObj[ind01]);
					}
				}
				return freshClaims;
			}
			if(claimGroup == 'Statements'){
				var myClaims =[];
				for(var ind01=0;ind01<claimsObj.length;ind01++){
						if(claimsObj[ind01].userID == userID){
							myClaims.push(claimsObj[ind01]);
						}
				}
				return myClaims;
			}
			if(claimGroup == 'Votes'){
				var myVotes =[];
				var claimID;
				for(var ind01=0;ind01<claimsObj.length;ind01++){
					claimID = claimsObj[ind01].ID;
						if(!!usersVotes[claimID]){
							myVotes.push(claimsObj[ind01]);
						}
				}
				return myVotes;
			}
		}

	},

	'getConnectorsClaims':function(){
		var logicalConnectionsStr =localStorage.getItem("connectorsClaims");
		var logicalConnectionsObj = JSON.parse(logicalConnectionsStr);
		return logicalConnectionsObj;
	
	},
	setUsersEco:function(usersEco){
	},

	getUsers: async function() {
		console.log("here");


		const queryResult = await postData("/getUsers", {query: "select * from votetypes"});
		/*const queryResult = await postData("/getUsers", 
		{query: 
			"INSERT INTO votetypes "+
			"VALUES (1, 'False', 'red'); "
		});*/

	/*	const queryResult = await postData("/getUsers", {query: "CREATE TABLE votetypes ("+
			"ID int,"+
			"name varchar(255),"+
			"color varchar(255)"+
		   
		");"
	}); */

		console.log(queryResult);
	},
	getUserVotes:function(userID,type){

		var allVotes;
		if(type != 'logconn'){
			var allVotes = getData.getVotes();
		}
		else{	
			var allVotes = getData.getConnectorsVotes();
		}

		var usersVotes ={};
		var vote;
		for(var ind01=0;ind01<allVotes.length;ind01++){
			vote = allVotes[ind01];

			if(vote.userID == userID ){
				if(type != 'logconn'){
					usersVotes[vote.claimID] = vote.type;
				}
				else{
					usersVotes[vote.groupID] = vote.type;
				}
			}
		}
		return usersVotes;
	},
	getUsersClaims:function(userID){
		var allCalims = getData.getClaims();
		var usersClaims =[];
		for(var ind01=0;ind01<allCalims.length;ind01++){
			if(allCalims[ind01].userID == userID){
				usersClaims.push(allCalims[ind01])
			}
		}
		return usersClaims;
	},

	getSpecClaim:function(claimID){
		var allCalims = getData.getClaims();
		var claim;
			for(var ind01=0;ind01<allCalims.length;ind01++){
			claim = allCalims[ind01];
			if(claim.ID == claimID){
				return claim;
			}
		}
	},
	getConnectors:function(claimID){

		var allGroupsStr =localStorage.getItem("connectors");
		var allGroups= JSON.parse(allGroupsStr);
	
		if(!!claimID){
			var specClaimLogConnGroup =[];
				var group;
					for(var ind01=0;ind01<allGroups.length;ind01++){
					group = allGroups[ind01];
					if(group.targetClaimID == claimID){

						specClaimLogConnGroup.push(group);
					}
				}
			return specClaimLogConnGroup;
		}
		return allGroups;
		
	},

	addClaim:function(userID,statementContent){
		var allCalims = getData.getClaims();
		var newClaimID = localStorage.getItem('newClaimID');
		newClaimID = parseInt(newClaimID,10)

		var newClaim = {
			ID:newClaimID,
			userID:userID,
			content:statementContent,
			engagment:0,
		}

		allCalims.push(newClaim);
		var claimsStr = JSON.stringify(allCalims);
		localStorage.setItem("claims",claimsStr); 
		newClaimID++;
		localStorage.setItem("newClaimID",newClaimID); 
		newClaim.votes = {};
		return newClaim;
	},
	addConnector:function(newConnector){
		var allConnectors = getData.getConnectors();
		var newConnectorID = parseInt(localStorage.getItem('newConnectorID'),10);

		var newConnctorTemp = {
			ID:newConnectorID,
			targetClaimID:newConnector.targetClaimID,
			userID:newConnector.userID,
			type:newConnector.type,
			engagment:0

		}

		allConnectors.push(newConnctorTemp);
		var allConnectorsStr = JSON.stringify(allConnectors);
		localStorage.setItem("connectors",allConnectorsStr); 
		newConnectorID++;
		localStorage.setItem("newConnectorID",newConnectorID); 
		newConnector.votes = {};
		return newConnctorTemp;
	},
	addConnectorClaim:function(newConnectorClaim){
		var allConnectorCalims = getData.getConnectorsClaims();
		var newClaimID = parseInt(localStorage.getItem('newConnectorClaimID'),10);

		newConnectorClaim.ID = newClaimID;
		
		allConnectorCalims.push(newConnectorClaim);
		var claimsStr = JSON.stringify(allConnectorCalims);
		localStorage.setItem("connectorsClaims",claimsStr); 
		newClaimID++;
		localStorage.setItem("newConnectorClaimID",newClaimID); 
		newConnectorClaim.votes = {};
		return newConnectorClaim;
	},
	

	addConnectorVote:function(logConnGroupID,userID,type){
		var votes = getData.getConnectorsVotes();
		var nextVoteID = parseInt(votes[0].ID,10);
		var vote={ID:nextVoteID,groupID:logConnGroupID,userID:userID,type:type};
		votes[0].ID++;
		votes.push(vote);
		var votesStr = JSON.stringify(votes);
		localStorage.setItem("votesOnLogConnGroups",votesStr);
	},
	removeConnectorVote:function(logConnGroupID,userID,type){
			var votes = getData.getConnectorsVotes();
			for(var ind01=0;ind01<votes.length;ind01++){
				if(votes[ind01].groupID == logConnGroupID && votes[ind01].userID == userID){
					votes.splice(ind01, 1);
					break;
				}
			}
			var votesStr = JSON.stringify(votes);
			localStorage.setItem("votesOnLogConnGroups",votesStr);
	},

	addVote:function(claimID,userID,type){
			
			var votes = getData.getVotes();
			var nextVoteID = parseInt(votes[0].ID,10);
			var vote={ID:nextVoteID,claimID:claimID,userID:userID,type:type};
			votes[0].ID++;
			votes.push(vote);
			var votesStr = JSON.stringify(votes);
			localStorage.setItem("votesOnClaims",votesStr);

			var claims = getData.getClaims();
			for(var ind01=0;ind01<claims.length;ind01++){
				if(claims[ind01].ID == claimID){
					claims[ind01].engagment++ 
				}
			}
			var claimsStr = JSON.stringify(claims);
			localStorage.setItem("claims",claimsStr); 
	},
	removeVote:function(claimID,userID,type){

			var votes = getData.getVotes();
			for(var ind01=0;ind01<votes.length;ind01++){
				if(votes[ind01].claimID == claimID && votes[ind01].userID == userID){
					votes.splice(ind01, 1);
					break;
				}
			}
			var votesStr = JSON.stringify(votes);
			localStorage.setItem("votesOnClaims",votesStr);

			var claims = getData.getClaims();
			for(var ind01=0;ind01<claims.length;ind01++){
				if(claims[ind01].ID == claimID){
						claims[ind01].engagment--;
				}
			}
			var claimsStr = JSON.stringify(claims);
			localStorage.setItem("claims",claimsStr); 
	},
	ignoreItem:function(claimID,userID){
		var newIgnoredItemID = parseInt(localStorage.getItem('newIgnoredItemID'),10);
		var ignoredItems = getData.getIgnoredItems();
		var item = {
			ID: newIgnoredItemID,
			ClaimID:claimID,
			userID:userID
		}
		ignoredItems.push(item)
		var ignoredItemsStr = JSON.stringify(ignoredItems);
		localStorage.setItem("ignoredItems",ignoredItemsStr); 
		newIgnoredItemID++
		localStorage.setItem("newIgnoredItemID",newIgnoredItemID)
	}

}


export  default getData;