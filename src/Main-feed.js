import React, { useState, useEffect,useRef} from "react";
import getData from './getData.js';
import manageData from './manageData.js';
import ReactDOM from 'react-dom';
import { FiSearch } from 'react-icons/fi';
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
import { Link,useNavigate } from 'react-router-dom'

//import manageUsers from './saveUser.js';
//import createConnectionfrom "../node_modules/mysql2/promise,js";



const MainFeed =(props) =>{
	const navigate = useNavigate();

	const CONTRADICT = 0;
	const WEEKEN = 1;
	const APROVE = 2;
	const SUPPORT =3;

	//console.log(getData.getUsers());

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
		var tabs;
		props.currentTab == 'profile' ? tabs = profileTabs : tabs = feedTabs;

		const [currentFeedTab,setCurrentFeedTab] = useState(1);
		const [feedClaims,setFeedClaims] = useState(props.claims);
		const [unFilteredClaims,setUnFilteredClaims] = useState(feedClaims);
		const [searchValue,setSearchValue] = useState('');
		
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
			setFeedClaims([...feedClaims,newClaimTemp]);
			setUnFilteredClaims([...feedClaims,newClaimTemp]);
		}
		const onProfileTabChange =(tabTitle)=>{
			setSearchValue('');
			resetTrackers();	
			setCurrentFeedTab(tabTitle);	
			if(tabTitle != 'Info'){
				setFeedClaims(manageData.getClaimsVoted(tabTitle,props.userID));
				setUnFilteredClaims(manageData.getClaimsVoted(tabTitle,props.userID));

			}
			else{
				
			}

		}	

		const openClaim = (claimID,claimClicked) =>{
			var newClaims;

			if(claimClicked == false){

				clickTrail.push(claimID);

				if(claimsIDTemp.length == 0){

					claimsIDTemp.push(claimID);

					for(var ind01=0;ind01<feedClaims.length;ind01++){
						if(feedClaims[ind01].ID !== claimID){
							claimsIDTemp.push(feedClaims[ind01].ID)	
						}
					}
				}
				newClaims = manageData.getClaimsByTargetClaim(claimID,props.userID)
				setFeedClaims([...newClaims]);
			}
			else{	
				if(clickTrail.length>1){
					newClaims = manageData.getClaimsByTargetClaim(clickTrail[clickTrail.length-2],props.userID);
					clickTrail.pop();
					setFeedClaims([...newClaims]);
					
				}
				else{
					newClaims = manageData.getSpecClaimsVoted(props.userID,claimsIDTemp);
					claimsIDTemp =[]; 
					clickTrail.pop();
					setFeedClaims([...newClaims]);
				}
			}
		}

		return(
			<div>
				{currentFeedTab != 'Info' &&
				<div className="feed-search-div">
					<SearchinBox searchValue={searchValue} filterBySearch={filterBySearch}/>
				</div>
				}
				<Tabs  tabs={tabs} chosenTab={1} tabContainer="tab-container" tabClass={"profile-tabs"} onTabChange={onProfileTabChange}/>
				{currentFeedTab == 'Info' ? 
					<Info/>	
						:
					<div>
						{props.currentTab == 'profile' &&
							<AddClaim addNewClaim={addNewClaim}/>
						}
						{feedClaims.map((claim) =>
							<FullClaim 
								key={claim.ID} 
								userID={props.userID} 
								claim ={claim}
								openClaim = {openClaim}
								isOpen = {claim.ID == clickTrail[clickTrail.length-1]}
							/>
						)} 
					</div>
				}
			</div>
		);
	}

	var linkToTrees = 'trees/' + JSON.stringify(props.userID);

		return(
			<div className="content-container">
				
				{(false && props.userID) &&
				 	<div>
						<Trees userID ={props.userID} />
					</div>
				}
				{true && 					
				 	<div>
						<Link to={linkToTrees} target='_blank'>Trees</Link>					
				  		<Feed
				  			claims={claims} 
				  			userID={props.userID} 
				  			currentTab ={props.currentTab}
				  		/>
					</div>		
				}
					
				  	 			
		    </div>
	    )

}


export default MainFeed;