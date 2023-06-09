import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FacebookLoginComponent from './facebooklogin.component.js';
import React, { useState,useEffect} from "react";
import AppBody from "./AppBody.js";

function App() {

  console.log("App-Renders");

  const [userPicture,setUserPicture] = useState("");
  const [userName,setUserName] = useState("");
  const [userID,setUserID] = useState("");

  return (
    <div className="App">
      <div className="facebook-login-div">
          <FacebookLoginComponent  setUserPicture={setUserPicture} setUserName={setUserName} setUserID={setUserID} />
      </div>
        <AppBody userID={userID} userName={userName} picture={userPicture} />
    </div>
  );
}

export default App;