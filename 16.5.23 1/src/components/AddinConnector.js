import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "./SearchinBox.js";




const connectorsTypes ={0:{ID:0,title:'Contradict',color:'red'},1:{ID:1,title:'Weeken',color:'pink'},2:{ID:2,title:'Aprove',color:'green'},3:{ID:3,title:'Enhance',color:'blue'}};


var newClaimTemp;

const AddingConnector = (props) =>{

	var allClaims = getData.getClaims();
	var chosenClaims = [];
	const [addLogConClaims,setAddLogConClaims] = useState(allClaims);
	const [chosenLogConClaims,setChosenLogConClaims] = useState([]);
	const [unFilteredConnectorClaims,setUnFilteredConnectorClaims] = useState(addLogConClaims);
	const [searchValue,setSearchValue] = useState('');
	const [newClaim,setNewClaim] = useState('');
	const [isVisible,setIsVisble] = useState(false);

	const [connentorType,setConnectorType] = useState();
	const [pickedColor,setPickedColor] = useState('inherit');
	const [isSubmit,setIsSubmit] = useState(false);

	const filterBySearch = (event) => {
	    const query = event.target.value;
	    setSearchValue(query);
	    var updatedList = [...unFilteredConnectorClaims];
	    updatedList = updatedList.filter((item) => {
	      return item.content.toLowerCase().indexOf(query.toLowerCase()) !== -1;
	    });
	    setAddLogConClaims(updatedList);
  	};

  	const claimChosen =(index) =>{
  		var claimsTemp = [...addLogConClaims];
  		setChosenLogConClaims([...chosenLogConClaims,addLogConClaims[index]])
  		claimsTemp.splice(index,1)
  		setAddLogConClaims([...claimsTemp]);
		updateSubmit(1,connentorType);

  	}
  	 const claimRemove =(index) =>{
  		var claimsTemp = [...chosenLogConClaims];
  		setAddLogConClaims([...addLogConClaims,chosenLogConClaims[index]])
  		claimsTemp.splice(index,1)
		updateSubmit(chosenLogConClaims.length - 1,connentorType);
  		setChosenLogConClaims([...claimsTemp]);
		  
  	}

	  const handleChange =(e)=>{
		setNewClaim(e.target.value)
	}
	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
		  addNewClaim();
		}
	  };

	const addNewClaim =() =>{
		newClaimTemp = getData.addClaim(props.userID,newClaim);
		setChosenLogConClaims([...chosenLogConClaims,newClaimTemp])
		setNewClaim('');
		updateSubmit(1,connentorType);
	}
	const typePicked = (e,type) =>{
		e.stopPropagation();
		setConnectorType(type);
		setPickedColor(connectorsTypes[type].color)
		updateSubmit(chosenLogConClaims.length,1);
	}
	const updateSubmit =(claimAmount,connType) =>{
	
		if (claimAmount >0 && !!connType){
			setIsSubmit(true);
			return;
		}
		setIsSubmit(false);

	}
	const submitClicked = () =>{
		var newConnector;
		if(!!props.connectorID || props.connectorID == 0 ){
			newConnector = manageData.addConnector(chosenLogConClaims,connentorType,props.targetClaimID,props.userID,"tree")
		}
		else{
			manageData.addConnector(chosenLogConClaims,connentorType,props.targetClaimID,props.userID)
		}

		setAddLogConClaims([...addLogConClaims,...chosenLogConClaims]);
		setChosenLogConClaims([]);
		setConnectorType('');
		updateSubmit(0,'');
		setIsVisble(false);

		if(!!props.setConnectorsByType){
			props.setConnectorsByType(manageData.getClaimsConnectors(props.targetClaimID,props.userID))
		}
		else{
			console.log("newConnector.ID")
			console.log(newConnector.ID)
			console.log("props.treeID")
			console.log(props.treeID)
			props.reRenderTrees(newConnector.ID,props.treeID);
		}
		
	}

	const addConnectorClicked = (e)=>{
		e.stopPropagation();
		if(!!props.connectorID || props.connectorID == 0){
			props.scrollToConnector(props.connectorID);
		}
		setIsVisble(!isVisible)


	}
	

	return(
		<div>
			{!!isVisible &&
			<div className={(!!props.connectorID || props.connectorID == 0) && 'add-connector-tree'}>
				<div className="adding-log-con" onClick ={(e) => e.stopPropagation()} >
					<div>
						<button disabled={isSubmit == false ? true : false} className="submit-connector" onClick={submitClicked}>Submit</button>
					</div>
					<div className="chosen-claims-window">	
						<div className="conn-group">
							<div>
								<input type='text' value={newClaim} className="add-logconn-claim" placeholder='write nem claim' onChange={handleChange} onKeyDown={handleKeyDown}/>
							</div>
							{chosenLogConClaims.map((claim,index) =>
								<div key={index} onClick={() => claimRemove(index)}>- {claim.content} -</div>
							)}
						</div>
					</div>
					<div className="log-con-search-container">
						<SearchinBox searchValue={searchValue} filterBySearch={filterBySearch}/>
					</div>
					<div className="claim-list-window">
						<div className="conn-group">
							{addLogConClaims.map((claim,index) =>
								claim.ID != props.targetClaimID && <div key={index} onClick={() => claimChosen(index)}>- {claim.content} -</div>
							)}
						</div>
					</div>
					
				</div>
				<div className="choose-connector-type">
					{Object.keys(connectorsTypes).map((type) =>
						<div className={connentorType !== type ? "con-type-choose" : "con-type-choose chosen"}  style={{color:connectorsTypes[type].color}} onClick={(e) => typePicked(e,type)}>
							{connectorsTypes[type].title}
						</div>
					)}
				</div>
				<div className="up-arrow" style={{borderColor:pickedColor}}>
							
				</div>
			</div>	
			}
			{!isVisible &&
				<div className="add-conn-button-div">
					<button className="submit-connector" onClick={(e) => { addConnectorClicked(e)}}>Add Connector</button>
				</div>
			}
		</div>
	)
}

export default AddingConnector;