import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FacebookLoginComponent from './facebooklogin.component.js';
import React, { useState,useEffect} from "react";
import AppBody from "./AppBody.js";
import Trees from "./components/tree/Trees.js"
import LoginWindow from './components/LoginWindow.js'
import { Routes, Route } from 'react-router-dom';

let screenHeight = window.screen.height;

function App() {

  console.log("App-Renders");

  return (
    <div className="App" style={{minHeight:screenHeight}}>
      <div id="fb-root"></div>
      <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0&appId=3278070112454396&autoLogAppEvents=1" nonce="k2h8NMFy"></script>
      <Routes>
        <Route path='/trees' element={<Trees/>}></Route>
        <Route path='/trees/:userIDTemp' element={<Trees/>}></Route>
        <Route path='/trees/:userIDTemp' element={<Trees/>}></Route>
      </Routes>

        <AppBody/>
    </div>
  );
}

export default App;