import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FacebookLoginComponent from './facebooklogin.component.js';
import React, { useState,useEffect} from "react";
import AppBody from "./AppBody.js";
import Trees from "./components/tree/Trees.js"
import { Routes, Route } from 'react-router-dom';

function App() {

  console.log("App-Renders");

  const [userPicture,setUserPicture] = useState("");
  const [userName,setUserName] = useState("");
  const [userID,setUserID] = useState("");

  return (
    <div className="App">
      <Routes>
        <Route path='/trees' element={<Trees/>}></Route>
        <Route path='/trees/:userIDTemp' element={<Trees/>}></Route>
        <Route path='/trees/:userIDTemp' element={<Trees/>}></Route>
      </Routes>
      <div className="facebook-login-div">
          <FacebookLoginComponent  setUserPicture={setUserPicture} setUserName={setUserName} setUserID={setUserID} />
      </div>
        <AppBody userID={userID} userName={userName} picture={userPicture} />
    </div>
  );
}

export default App;