import React, { useState,useEffect } from "react";
import MainFeed from './Main-feed.js';
import Logo from './logo.jpg';
import LogOut from './images/logOut.png'
import LoadingProfilePic from './images/loading-profile-pic.gif'
import "./App.css";
import FacebookLoginComponent from './facebooklogin.component.js';
import LoginWindow from './components/LoginWindow.js'
import { Outlet, Link } from "react-router-dom";
import manageData from './manageData.js'




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

	var userID = (!!props.user && !!props.user.ID) ? props.user.ID : null;
	
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
						{(!props.isLoadingProfile && !userID) &&<span onClick={()=>{props.setIsPopUpShown(true)}}>Login</span>}
						{!!props.isLoadingProfile && <img src={LoadingProfilePic} className="loading-profile-gif"/>}
					</div>	
					<div className="profile-bunner">
					{!!userID &&
						<div>
							<div className="profile-menu-switch">
								<div style={{transform:'rotate(180deg)'}} onClick={(e)=>onMenuSwitchClick(e)}> ^ </div>
							</div>
						 	<img className="rounded-pic" src={props.user.pictureUrl} alt="" onClick={(e) => props.onProfileClick(e)}/>
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
	const [userEmail,setUserEmail] = useState("");
	var userTemp = {
		ID:'',
		email:'',
		name:'',
		pictureUrl:''	
	}
	const [user,setUser] = useState(userTemp);
	const [isPopUpShown,setIsPopUpShown]= useState();
	const [isMenuOpen,setIsMenuOpen]= useState(false);
	const [isLoadingProfile,setIsLoadingProfile] = useState(false);

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
		setUserEmail();
		setUser();
	}

	const appBodyClick = (e)=>{
		e.stopPropagation();
		setIsMenuOpen(false)
	}
	

	useEffect(() => {
		if(!!userEmail){
			var user ={

			}
			//manageData.userFBLogin({})
		}
	  },[userEmail]);

	return(
			<div className="general-container" onClick={(e)=>appBodyClick(e)}>
				{(!isPopUpShown || !!userID) &&
					<div>
						<AppNavBar  isLoadingProfile={isLoadingProfile} user={user} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} logOut={logOut} setIsPopUpShown={setIsPopUpShown} onProfileClick={profileClickHandler} onLogoClick={logoClickHandel}/>
						<div className="main-feed-warpper">
							<MainFeed user={user} currentTab={currentTab} />
						</div>
					</div>	
				}
				{(!!isPopUpShown && !userID) &&
						<div class="general-container" onClick={()=>setIsPopUpShown(false)}>
							<LoginWindow setIsLoadingProfile={setIsLoadingProfile} setUser={setUser} setUserName={setUserName} setUserID={setUserID} setUserPicture={setUserPicture} setUserEmail={setUserEmail}/>
						</div>	
				}
				
			</div>
		);
}


export default AppBody;