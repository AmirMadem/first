import React, { useState } from "react";
import MainFeed from './Main-feed.js';
import Logo from './logo.jpg';
import LogOut from './images/logOut.png'
import "./App.css";
import FacebookLoginComponent from './facebooklogin.component.js';
import LoginWindow from './components/LoginWindow.js'
import { Outlet, Link } from "react-router-dom";



const LogoutButton = (props) =>{

	return(
			<a href="#" className="btn btn-danger btn-sm" onClick={props.logout}>
	            	  Logout
	            	  </a>
		);
}

const ProfileMenu = (props) =>{
	const onLogOut = ()=>{
		props.setIsMenuOpen(false);
		props.logOut()
		props.onLogoClick();
	}
	return(
		<div className="profile-menu" onClick={(e)=>e.stopPropagation()}>
			<div className="log-out-span">
				<img src={LogOut} className="logout-pic"/>
				<span onClick={() => onLogOut()}>Log out</span>
			</div>
		</div>
	)
}

const AppNavBar = (props) =>{
	const onMenuSwitchClick =(e)=>{
		e.stopPropagation();
		props.setIsMenuOpen(!props.isMenuOpen);
	}
	return(
			<div className="nav-bar">
				<div className="logo">
					 <img src={Logo} className="logo-pic" onClick={() => props.onLogoClick()}/>
				</div>
				<div className="facebook-login-div">
					<div className="login-span">
						{!props.userName && <span onClick={()=>{props.setIsPopUpShown(true)}}>Login</span>}
					</div>	
					<div className="profile-bunner">
					{props.picture &&
						<div>
							<div className="profile-menu-switch">
								<div style={{transform:'rotate(180deg)'}} onClick={(e)=>onMenuSwitchClick(e)}> ^ </div>
							</div>
						 	<img className="rounded-pic" src={props.picture} alt="" onClick={(e) => props.onProfileClick(e)}/>
						</div>
					}
					</div>
				</div>
				{!!props.isMenuOpen && <ProfileMenu onLogoClick={props.onLogoClick} logOut={props.logOut} setIsMenuOpen={props.setIsMenuOpen}/>}
			</div>
		);
}

const AppBody =  (props) =>{

	const [userPicture,setUserPicture] = useState("");
	const [userName,setUserName] = useState("");
	const [userID,setUserID] = useState("");


	const [isPopUpShown,setIsPopUpShown]= useState();
	const [isMenuOpen,setIsMenuOpen]= useState(false);



	console.log("AppBody-Renders");
	const [currentTab,setCurrentTab] = useState('feed');

	const profileClickHandler = (e)=>{
		e.stopPropagation();
		setCurrentTab('profile');
	}
	const logoClickHandel = () =>{
		setCurrentTab('feed');
	}

	const logOut =()=>{
		setIsPopUpShown(false);
		setUserID();
		setUserName();
		setUserPicture();
	}

	const appBodyClick = (e)=>{
		e.stopPropagation();
		setIsMenuOpen(false)
	}

	return(
			<div class="general-container" onClick={(e)=>appBodyClick(e)}>
				{(!isPopUpShown || !!userID) &&
					<div>
						<AppNavBar  isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} logOut={logOut} setIsPopUpShown={setIsPopUpShown} setUserName={setUserName} setUserID={setUserID} setUserPicture={setUserPicture} userName={userName} picture={userPicture} onProfileClick={profileClickHandler} onLogoClick={logoClickHandel}/>
						<div className="main-feed-warpper">
							<MainFeed userID ={userID} userName={userName} currentTab={currentTab} />
						</div>
					</div>	
				}
				{(!!isPopUpShown && !userID) &&
						<div class="general-container" onClick={()=>setIsPopUpShown(false)}>
							<LoginWindow setUserName={setUserName} setUserID={setUserID} setUserPicture={setUserPicture}/>
						</div>	
				}
				
			</div>
		);
}


export default AppBody;