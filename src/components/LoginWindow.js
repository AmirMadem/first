import React, { useState, useEffect,useRef} from "react";
import FacebookLoginComponent from '../facebooklogin.component.js';
import manageData from '../manageData.js'



const LoginWindow = (props) =>{

    const loginCallBack = (user)=>{
        props.setUser(user);
        props.setIsLoadingProfile(false);

    }
    const onLogin = (user)=>{
        console.log("onLogin - parameter user")
        console.log(user)
        console.log("onLogin - parameter user")
        manageData.userFBLogin(user,loginCallBack)
        props.setIsLoadingProfile(true);

	}

    return(
            <div className="login-window-container" onClick={(e)=>e.stopPropagation()}>
                <div className="facebook-login-button-container">
                    <FacebookLoginComponent  onLogin={onLogin} setUserPicture={props.setUserPicture} setUserName={props.setUserName} setUserID={props.setUserID} setUserEmail={props.setUserEmail}/>
                </div>   
            </div>
    )
}

export default LoginWindow;

