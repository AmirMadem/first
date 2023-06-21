import React, { useState, useEffect,useRef} from "react";
import getData from './getData.js';
import manageData from './manageData.js';
import ReactDOM from 'react-dom';
import { FiSearch } from 'react-icons/fi';
import { Link,useNavigate } from 'react-router-dom'

import SearchinBox from "./components/SearchinBox.js";
import VotingBar from './components/VotingBar.js'
import AddingConnector from "./components/AddinConnector.js";
import FullClaim from "./components/FullClaim.js";
import Connector from "./components/Connector.js"
import AddClaim from "./components/AddClaim.js"
import Info from "./components/Info.js"
import Tabs from "./components/Tabs.js"
import Tree from "./components/tree/Tree.js"
import Trees from "./components/tree/Trees.js"

//import manageUsers from './saveUser.js';
//import createConnectionfrom "../node_modules/mysql2/promise,js";



const MainFeed =(props) =>{

	//when claim is clicked - new feed changes to this claim and all of its connectors claims below
	//clickTrail holds all clicked claims by order, claimsIDTemp holds all original feed claims ID
	var claimsIDTemp =[];
	var clickTrail = [];

	const resetTrackers = () =>{
		claimsIDTemp =[];
		clickTrail = [];
	}

	var claims;
	if(props.currentTab == 'profile'){
		claims = manageData.getClaimsVoted('Statements',props.userID);
	}
	else{
		claims =  manageData.getClaimsVoted("Trending",props.userID);
	}

	const Feed = (props) =>{

		const profileTabs = [{title:'Info'},{title:'Statements'},{title:'Votes'}];
		const feedTabs = [{title:'Popular'},{title:'Trending'},{title:'Fresh'}]	;
		const [feedClaims,setFeedClaims] = useState(props.claims);
		const [unFilteredClaims,setUnFilteredClaims] = useState(feedClaims);
		const [searchValue,setSearchValue] = useState('');
		const [clickedClaimID,setClickedClaimID] = useState();
		const [isAddConnectorPressed,setIsAddConnectorPressed] = useState()
		
		var tabs;
		props.currentTab == 'profile' ? tabs = profileTabs : tabs = feedTabs;
		const [currentFeedTab,setCurrentFeedTab] = useState(tabs[1].title);

		const filterBySearch = (event) => {
			const query = event.target.value;
			setSearchValue(query);
			var updatedList = [...unFilteredClaims];
			updatedList = updatedList.filter((item) => {
			return item.content.toLowerCase().indexOf(query.toLowerCase()) !== -1;
			});
			setFeedClaims(updatedList);
		};

		var newClaimTemp;
		const addNewClaim =(newClaim) =>{
			newClaimTemp = manageData.addClaim(props.userID,newClaim);
			setFeedClaims([newClaimTemp,...feedClaims]);
			setUnFilteredClaims([newClaimTemp,...feedClaims]);
		}
		const onProfileTabChange =(tabTitle)=>{
			setSearchValue('');
			resetTrackers();	
			setCurrentFeedTab(tabTitle);	
			if(tabTitle != 'Info'){
				setFeedClaims(manageData.getClaimsVoted(tabTitle,props.userID));
				setClickedClaimID();
				setUnFilteredClaims(manageData.getClaimsVoted(tabTitle,props.userID));
			}

		}	
		const fillClaimsIDTemp =(clickedClaim) =>{
			claimsIDTemp.push(clickedClaim.ID);
			for(var ind01=0;ind01<feedClaims.length;ind01++){
				if(feedClaims[ind01].ID !== clickedClaim.ID){
					claimsIDTemp.push(feedClaims[ind01].ID)	
				}
			}	
		}

		//when claim is clicked - new feed changes to this claim only and all of its connectors claims below
		//clickTrail holds all clicked claims by order, claimsIDTemp holds all original feed claims ID
		const openClaim = (clickedClaim,isOnFeed) =>{	

			//isClaimClicked tells if a claim is already clicked or not
			var isClaimClicked = (clickedClaimID == clickedClaim.ID)
			var newClaims;
			if(isClaimClicked == false){
				clickTrail.push(clickedClaim);
				if(claimsIDTemp.length == 0){
					fillClaimsIDTemp(clickedClaim);
				}
				newClaims = manageData.getClaimsByTargetClaim(clickedClaim.ID,props.userID);
				setClickedClaimID(clickedClaim.ID);
				setFeedClaims([...newClaims]);
				if(!isOnFeed){
					setIsAddConnectorPressed(false);
				}
				else{
					setIsAddConnectorPressed(true);
				}
			}
			else if(!isOnFeed){	
				if(clickTrail.length>1){
					newClaims = manageData.getClaimsByTargetClaim(clickTrail[clickTrail.length-2].ID,props.userID);
					setClickedClaimID(clickTrail[clickTrail.length-2].ID);
					clickTrail.pop();
					setFeedClaims([...newClaims]);	
				}
				else{
					newClaims = manageData.getSpecClaimsVoted(props.userID,claimsIDTemp);
					claimsIDTemp =[]; 
					clickTrail.pop();
					setFeedClaims([...newClaims]);
					setClickedClaimID();

				}
			}
			else{
				setIsAddConnectorPressed(true);
			}
		}
		
		var tempConnector = {
			ID:35,
			targetClaimID:42,
			type:0,
			userVoteStatus:8,
			votes:{
				8:1
			},
			targetClaim:{
				ID:42,
				content:'Target Claim'
			},
			connectorClaims:[
				{
					ID:74,
					claimID:89,
					content:"Connectors Claim 1",
					groupID:35,
					targetClaimID:42,
					type:0,
					userID:2
				},
				{
					ID:75,
					claimID:90,
					content:"Connectors Claim 2",
					groupID:35,
					targetClaimID:42,
					type:0,
					userID:20
				}
			]	
		}

		const clickOnNav = (e,clickedClaim,index)=>{
			e.preventDefault();
			if(!index && index != 0){
				onProfileTabChange(clickedClaim);
			}
			else if(index < clickTrail.length-1){
				clickTrail.splice(index);
				openClaim(clickedClaim);
			}
			
		}
		const onMouseEnterLeftBar = ()=>{
			setLeftBarClass('left-bar hovered')
		}
		const onMouseLeaveLeftBar = ()=>{
			setLeftBarClass('left-bar')
		}
		const onMouseEnterRightBar = () =>{

		}
		const onMouseLeaveRightBar = () =>{

		}

		const [leftBarClass,setLeftBarClass] =useState('left-bar');
		const [rightBarClass,setRightBarClass] =useState('right-bar');

		return(
				<div className="main-feed-container">
					<div className={leftBarClass} onMouseEnter ={()=>onMouseEnterLeftBar()} onMouseLeave ={()=>onMouseLeaveLeftBar()}>
						{currentFeedTab != 'Info' &&
								<div className="feed-search-div">
									<SearchinBox searchValue={searchValue} filterBySearch={filterBySearch}/>
									{!!clickedClaimID &&
										<div style={{textAlign:'left',fontSize:'10px'}}>
											<a href="#" onClick={(e) => clickOnNav(e,currentFeedTab)}>{currentFeedTab} ->  </a>
											{clickTrail.map((clickedClaim,index) =>
												<a href="#" onClick={(e) => clickOnNav(e,clickedClaim,index)}>{clickedClaim.content} ->  </a>
											)}
										</div>
									}
								</div>
							}
				
					</div>
					<div className="main-feed" >
						
						<Tabs  tabs={tabs} chosenTab={1} tabContainer="tab-container" tabClass={"profile-tabs"} onTabChange={onProfileTabChange}/>

						{currentFeedTab == 'Info' ? 
							<Info/>	
								:
							<div>
								{(props.currentTab == 'profile' && (currentFeedTab == 'Statements' || currentFeedTab == 1)) &&
									<AddClaim addNewClaim={addNewClaim}/>
								}
								{feedClaims.map((claim) =>
									<div className = "claim-container" onClick={() =>openClaim(claim)}>
										<FullClaim 
											key={claim.ID} 
											userID={props.userID} 
											claim ={claim}
											isOpen = {claim.ID == clickedClaimID}
											openClaim = {openClaim}
											isAddConnectorPressed ={isAddConnectorPressed}
										/>
									</div>	
								)} 
							</div>
						}
					</div>	
					<div className={rightBarClass} onMouseEnter ={()=>onMouseEnterRightBar()} onMouseLeave ={()=>onMouseLeaveRightBar()}>
				
					</div>	

				
				</div>
		);
	}

	var linkToTrees = 'trees/' + JSON.stringify(props.userID);

		return(
					<div>
						<Feed
							claims={claims} 
							userID={props.userID} 
							currentTab ={props.currentTab}
						/>
					</div>				  	 			
	    )

}


export default MainFeed;