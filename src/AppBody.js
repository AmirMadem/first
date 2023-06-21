import React, { useState } from "react";
import MainFeed from './Main-feed.js';
import Logo from './logo.jpg';
import "./App.css";

const LogoutButton = (props) =>{

	return(
			<a href="#" className="btn btn-danger btn-sm" onClick={props.logout}>
	            	  Logout
	            	  </a>
		);
}

const AppNavBar = (props) =>{

	return(
			<div className="nav-bar">
				<div className="logo">
					 <img src={Logo} className="logo-pic" onClick={() => props.onLogoClick()}/>
				</div>
				<div className="fb-login-baners">
					<div>
						Log in
					</div>	
					<div className="user-name">
						{!props.userName && "Hello Guest !"}
					</div>
					<div className="profile-bunner">
						{props.picture && <img className="rounded-pic" src={props.picture} alt="" onClick={() => props.onProfileClick()}/>}
					</div>
				</div>
			</div>
		);
}

const AppBody =  (props) =>{

	console.log("AppBody-Renders");
	const [currentTab,setCurrentTab] = useState('feed');

	const profileClickHandler = ()=>{
		setCurrentTab('profile');
	}
	const logoClickHandel = () =>{
		setCurrentTab('feed');
	}

	return(
			<div >
				<AppNavBar  userName={props.userName} picture={props.picture} onProfileClick={profileClickHandler} onLogoClick={logoClickHandel}/>
				<div className="main-feed-warpper ">
					<MainFeed userID ={props.userID} userName={props.userName} currentTab={currentTab} />
				</div>
			</div>
		);
}


export default AppBody;