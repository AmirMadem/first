import React, { useState, useEffect,useRef} from "react";
import FacebookLoginComponent from '../facebooklogin.component.js';


const LoginWindow = (props) =>{

    return(
            <div className="login-window-container" onClick={(e)=>e.stopPropagation()}>
                <div className="facebook-login-button-container">
                <FacebookLoginComponent  setUserPicture={props.setUserPicture} setUserName={props.setUserName} setUserID={props.setUserID} />
                </div>   
            </div>
    )
}

export default LoginWindow;

