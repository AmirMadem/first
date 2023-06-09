

import React, { useState, useEffect,useRef} from "react";
import getData from '../getData.js';
import manageData from '../manageData.js';
import ReactDOM from 'react-dom';

const Tabs = (props) => {

	const unChosenTabClass='profile-tab';
	const chosenTabClass ="profile-tab profile-tab-pressed";
	const [chosenTabNumber, setChosenTabNumber] = useState(props.chosenTab);

	const onTabClick =(index) =>{
		setChosenTabNumber(index);
		props.onTabChange(props.tabs[index].title)
	}
	return(
		<div className={props.tabContainer}>
			<div className={props.tabClass}>
				{props.tabs.map((tab,index) =>
					<div key ={index} className={index == chosenTabNumber ? chosenTabClass : unChosenTabClass} index ={index} onClick={(e) => onTabClick(index)} >{tab.title}</div>
				)}
			</div>	
		</div>
	);
}

export default Tabs