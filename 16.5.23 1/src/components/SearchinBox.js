import React, { useState, useEffect,useRef} from "react";
import { FiSearch } from 'react-icons/fi';

const SearchinBox = (props) =>{
	return(
		<div className="search-container">
		 	<input value={props.searchValue} className="search-input" id="search-box" onChange={props.filterBySearch} />
		 	<FiSearch className="search-icon"/>
		 </div>
	)
}

export default SearchinBox;