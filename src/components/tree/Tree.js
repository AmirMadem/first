import React, { useState, useEffect,useRef} from "react";
import getData from '../../getData.js';
import manageData from '../../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "../SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';
import useDraggableScroll from 'use-draggable-scroll';
import VotingBar from '../VotingBar.js'
import ExpVotingBar from '../ExpVotingBar.js'
import AddingConnector from "../AddinConnector.js";
import Connectors from "./Connectors.js";
import DiagonalLines from "./DiagonalLines.js";
import StraightLines from "./StraightLines.js";


import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';




const CONTRADICT = 0;
const WEEKEN = 1;
const APROVE = 2;
const SUPPORT =3;

const CONNECTOR_WIDTH = 120;
const CONNECTOR_HEIGTH = 60; 
const CONNECTOR_LEFT_GAP = 180;
const CONNECTOR_TOP_GAP = 200;
const VOTING_BAR_WIDTH = 300;


const logConnTypes ={0:{title:'Contradict',color:'red'},1:{title:'Weeken',color:'purple'},2:{title:'Aprove',color:'green'},3:{title:'Support',color:'blue'}};

var claimVoteTypes = [{ID:1,title:'',color:'green',fullName:'100% true !'},{ID:2,title:'',color:'blue',fullName:'mostly True...'},{ID:3,title:'',color:'yellow',fullName:'got a good feeling about it !'},{ID:4,title:'',color:'pink',fullName:'not specific enough'},{ID:5,title:'',color:'orange',fullName:'mostly False'},{ID:6,title:'',color:'red',fullName:'Complete Bullshit !'}]
var votingTypes = claimVoteTypes;

var connectorVotesTypes =  [
	{ID:7,name:'False',title:'',color:'red',fullName:'False Claims and Wrong logical connection'},{ID:8,title:'',name:'FalseCorrect',color:'orange',fullName:'False Claims but Correct logical connection'},{ID:9,title:'',name:'TrueWrong',color:'blue',fullName:'True Claims but Wrong logical connection'},{ID:10,title:'',name:'True',color:'green',fullName:'True Claims and Correct logical connection'}
		];

var connectorsVotingTypesObj ={
    
    7:{ID:7,title:'',name:'False',color:'red',fullName:'False Claims and Wrong logical connection'},
    8:{ID:8,title:'',name:'FalseCorrect',color:'orange',fullName:'False Claims but Correct logical connection'},
    9:{ID:9,title:'',name:'TrueWrong',color:'blue',fullName:'True Claims but Wrong logical connection'},
    10:{ID:10,title:'',name:'True',color:'green',fullName:'True Claims and Correct logical connection'}

}

var claimsVotesTypesObj ={
    1:{ID:1,title:'',name:'True',color:'green',fullName:'100% true !'},
    2:{ID:2,title:'',name:'Mostly True',color:'blue',fullName:'Mostly True...'},
    3:{ID:3,title:'',name:'Positive',color:'yellow',fullName:'Got a good feeling about it !'},
    4:{ID:4,title:'',name:'Undefined',color:'pink',fullName:'Un clear or not specific enough'},
    5:{ID:5,title:'',name:'Mostly False',color:'orange',fullName:'Got a good feeling about it !'},
    6:{ID:6,title:'',name:'False',color:'red',fullName:'Complete Bullshit !'},
}

const Tree = (props) =>{

    //the first claim on the tree, the only claim that isnt part of a connector
    var firstClaimID = parseInt(props.firstClaimID);
    var userID = parseInt(props.userID);
    var treeID =props.treeID;
    

    var claims = props.claims;
    var connectorsObj = props.connectorsObj;

    //add votes and user vote status to all of the tree connectors(not to claims)
    connectorsObj = manageData.addVotesAndStatusToTreeConnectors(firstClaimID,userID,connectorsObj)
    
    //get the first claim votes and user vote status (the first claim is clicked when the page first load)
    var firstClaimVoted = manageData.getSpceClaimVoted(firstClaimID,userID);

    var claimsLocations = {}; 
    var connectorsLocations = {};
 
    //connectorsOutOfFocus holds all the connectors that are not active (dont take part of the clicked claim tree)  
    const [connectorsOutOfFocus,setConnectorsOutOfFocus] = useState([]);
    const [connectedClaims,setConnectedClaims] = useState([]);
    const [clickedClaim,setClickedClaim] = useState(firstClaimVoted);
    const [clickedConnector,setClickedConnector] = useState(0);

    //recursion --- builds 2dim array of connectors ordered by relations
    const buildRows = (curGen,curConnectorID,connectorsObj,rows,usedConnectors,usedClaims,lastConnectorID) =>{
        
        curConnectorID = parseInt(curConnectorID,10);
        var currConnector;
        var newConnector
        var lastClaim;

        //preventing duplicates 
        if(!!usedConnectors[curConnectorID]){
            return rows;
        }

        if(!rows[curGen]){
            rows[curGen] = [];
        }
        
        currConnector = connectorsObj[curConnectorID];
        usedConnectors[curConnectorID] = true;

        newConnector = {
            ID:curConnectorID,
            gen:curGen,
            connectors:0
        }

        connectorsObj[curConnectorID].gen = curGen;
        connectorsObj[curConnectorID].targetConnectorID = lastConnectorID;

        rows[curGen].push(newConnector);

  

        //recursion heart - caliing buildRows for every connector that target any claim in the current connector
        for(var ind01=currConnector.claims.length-1;ind01>-1;ind01--){
            for(var connectorID in connectorsObj){
                if(connectorsObj[connectorID].targetClaimID == currConnector.claims[ind01] && (!usedClaims.includes(currConnector.claims[ind01]) || lastClaim == currConnector.claims[ind01])){
                    usedClaims.push(currConnector.claims[ind01]);
                    lastClaim = currConnector.claims[ind01];
                    buildRows(curGen+1,connectorID,connectorsObj,rows,usedConnectors,usedClaims,curConnectorID);
                }
            }
            lastClaim = null;
            
        } 
   
        return rows;
    }

    //recursion - gives the exact locations to each tree connector and target claim
    const buildConnectorsLocations = (rows,connectorsObj,connectorsLocations,claimsLocations,curGen,currConnectorID,rightestLocationInRow) =>{
       
        var currConnector = connectorsObj[currConnectorID];
        var parentsLocations = [];
        var connector;
        var connectorLocation;
        var currLocation;
        var underClickedConnectorHeight=0;

        if(rows.length - connectorsObj[clickedConnector].gen <= curGen){
            underClickedConnectorHeight = CONNECTOR_HEIGTH;

        }

        //rightestLocationInRow[0] saves the rightest location of all rows given so far
        if(!rightestLocationInRow[0]){
            rightestLocationInRow[0] = 0;           
        }

        if(curGen == 0){
            
            for(var ind01=0;ind01<rows[0].length;ind01++){
                if(rows[0][ind01].ID == currConnectorID){
                
                    currLocation = rightestLocationInRow[0] ;
                     rightestLocationInRow[0] +=0.75;
                }
            }

            connectorsLocations[currConnectorID] ={
                offsetLeft: currLocation*CONNECTOR_LEFT_GAP + (CONNECTOR_WIDTH/2),
                offsetTop:CONNECTOR_HEIGTH,
            }

            return currLocation;
        }    

        //recursion heart Begin - if connector have parents - repeat to get their location first
        for(var ind01=0;ind01<rows[curGen-1].length;ind01++){
            connector = connectorsObj[rows[curGen-1][ind01].ID];
    
            if(connector.targetConnectorID == currConnectorID){
          
                connectorLocation = buildConnectorsLocations(rows,connectorsObj,connectorsLocations,claimsLocations,curGen-1,connector.ID,rightestLocationInRow)
                parentsLocations.push(connectorLocation);
            
            }
        }

        // ---- recursion heart End ----
        // if connector have more than one parent - get location of 2 lefties and rightest parents and center current connector between them
        if(parentsLocations.length >1){
            var closesttLocation = -1;
            var farestLocation = -1;

            //gets location of the lefties and rightest parents
            for(var ind01=0;ind01<parentsLocations.length;ind01++){
                if(parentsLocations[ind01] > farestLocation || farestLocation == -1){
                    farestLocation = parentsLocations[ind01];
                }
                if(parentsLocations[ind01] < closesttLocation || closesttLocation == -1){
                    closesttLocation = parentsLocations[ind01];;
                }
            }

            //center current connector between lefties and rightest parents 
            connectorsLocations[currConnectorID] = (farestLocation + closesttLocation)/2

             //ckecking if the current connector is not right enough  and if so - push it right
            if(connectorsLocations[currConnectorID] <= rightestLocationInRow[curGen]+0.5){
                connectorsLocations[currConnectorID] = rightestLocationInRow[curGen] +0.75;
            }

            rightestLocationInRow[curGen] = connectorsLocations[currConnectorID];
        
        }

        //case current connector have single parent - locating current connector relative to it
        else if(parentsLocations.length >0){
            connectorsLocations[currConnectorID] = parentsLocations[0]+0.5;

            //ckecking if the current connector is not right enough  and if so - push it right
            if(connectorsLocations[currConnectorID] <= rightestLocationInRow[curGen]+0.5){
                connectorsLocations[currConnectorID] = rightestLocationInRow[curGen] +0.75;
            }

            rightestLocationInRow[curGen] = connectorsLocations[currConnectorID];
        }

        //case current connector have 0 parents - locating current connector relative to the rigthest connector on the tree
        else if(!!rightestLocationInRow[0]){

            //locating current connector relative to the rigthest connector on the tree
            connectorsLocations[currConnectorID] = rightestLocationInRow[0] +0.75;

            //ckecking if the current connector is not right enough  and if so - push it right
            if(connectorsLocations[currConnectorID] <= rightestLocationInRow[curGen]+0.5){
                connectorsLocations[currConnectorID] = rightestLocationInRow[curGen] +0.75;
            }

            rightestLocationInRow[curGen] = connectorsLocations[currConnectorID];
        }
        else{
            connectorsLocations[currConnectorID] = 0;
        }

        if(!rightestLocationInRow[curGen] ){
            rightestLocationInRow[curGen] = 0.5;
        }

        //update rightestLocationInRow[0] (that saves the rightest location of all rows given so far)
        if((rightestLocationInRow[curGen] >= rightestLocationInRow[0]-0.5)){
            rightestLocationInRow[0] = rightestLocationInRow[curGen];
        }
       
     
        var currentConnectorLoc = connectorsLocations[currConnectorID] * 1;
        
        connectorsLocations[currConnectorID] = {
            offsetLeft: (currentConnectorLoc*CONNECTOR_LEFT_GAP) + CONNECTOR_WIDTH/2,
            offsetTop: (curGen*CONNECTOR_TOP_GAP) + (CONNECTOR_HEIGTH + underClickedConnectorHeight*1),
        }
      
        var claimsAmount = connectorsObj[currConnectorID].claims.length;
        var factor = CONNECTOR_HEIGTH/7/claimsAmount;
        var currClaimID;
        var currConnectorClaimsLocations = {};
        for(var ind01=0;ind01<claimsAmount;ind01++){
            currClaimID = connectorsObj[currConnectorID].claims[ind01]
      
            currConnectorClaimsLocations[currClaimID] = {
                offsetLeft:connectorsLocations[currConnectorID].offsetLeft - factor*(ind01+1) ,
                offsetTop:connectorsLocations[currConnectorID].offsetTop - factor*(ind01+1),
                offsetLeft2: connectorsLocations[currConnectorID].offsetLeft + CONNECTOR_WIDTH + factor*(ind01+1),
                offsetTop2: connectorsLocations[currConnectorID].offsetTop - factor*(ind01+1),
            };
        }
        claimsLocations[currConnectorID] = JSON.parse(JSON.stringify(currConnectorClaimsLocations));
        return currentConnectorLoc;
    }

    const getBiggestRow = (rows) =>{
        var biggestRow = 1;
        for(var ind01=0;ind01<rows.length;ind01++){
            if(rows[ind01].length > biggestRow){
                biggestRow = rows[ind01].length;
            }
        }
        return biggestRow;
    }


    const getConnectedClaims =(claimID,claimGen,rows) =>{
        var connectedConnectors = [];

        var unConnectedConnectors = rows.flat();
        for(var ind01=0;ind01<unConnectedConnectors.length;ind01++){
            unConnectedConnectors[ind01] = unConnectedConnectors[ind01].ID
        }
        claimID = parseInt(claimID,10)
        var connectedClaims = [claimID];
        var row;
        var connectorID;
        var connector;

        for(var ind01=rows.length;ind01>0;ind01--){
            row = rows[ind01-1];

            for(var ind02=0;ind02<row.length;ind02++){
                connectorID = row[ind02].ID;
                connector= connectorsObj[connectorID];
                if(connectedClaims.includes(connector.targetClaimID)){
                    connectedClaims =[...connectedClaims,...connector.claims];
                    unConnectedConnectors.splice(unConnectedConnectors.indexOf(connectorID),1)
                }
            }
        }
        return {unConnectedConnectors:unConnectedConnectors,connectedClaims:connectedClaims};

	}


    const scrollToConnector = (connectorID) =>{

        var firstConnector = document.getElementById(treeID+""+connectorID)
        if(!!firstConnector){
            firstConnector.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'center'
            });
        }
 
     }

     const treeClaimClick = (claimID,gen,connectorID,rows) =>{

        if(claimID != clickedClaim.ID){
            console.log("treeClaimClick")
            var claim = manageData.getSpceClaimVoted(claimID,userID);
        
            scrollToConnector(connectorID);
            var unConnectedConnectorsTemp =getConnectedClaims(claimID,gen,rows).unConnectedConnectors;
            unConnectedConnectorsTemp.splice(unConnectedConnectorsTemp.indexOf(connectorID),1)

            setConnectorsOutOfFocus(unConnectedConnectorsTemp);
            setClickedClaim(claim);
            if(connectorID != clickedConnector){
                setClickedConnector(connectorID);
            }
            setConnectedClaims(getConnectedClaims(claimID,gen,rows).connectedClaims)
        }
     }
     
    const myFunction = (pressedKey) =>{
        console.log(pressedKey);
        if(pressedKey == 'ArrowRight'){
       
        }
    }

    var rows = buildRows(0,0,props.connectorsObj,[],[],[],-1);
    rows = rows.reverse();

    buildConnectorsLocations(rows,connectorsObj,connectorsLocations,claimsLocations,rows.length-1,0,{});

    var biggestRow = 0;
    biggestRow = getBiggestRow(rows);


    
    useEffect(() => {

        console.log("useEffect useEffect useEffect useEffect useEffect ")

        if(!props.clickedTree || props.clickedTree == treeID){
            scrollToConnector(props.clickedConnector);
        }

        const keyDownHandler = event => {
      
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' ) {
              event.preventDefault();
      
              // 👇️ your logic here
              myFunction(event.key);
            }
          };
      
          document.addEventListener('keydown', keyDownHandler);
      
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        }; 
        
 
    },[props.tree]);

    var data = {
        connectorsOutOfFocus:connectorsOutOfFocus,
        connectedClaims:connectedClaims,
        connectorsLocations:connectorsLocations,
        claimsLocations:claimsLocations,
        connectorsObj:connectorsObj,
        rows:rows,
        claims:claims,
        treeID:treeID,
        userID:userID,
        clickedClaim:clickedClaim,
        clickedConnector:clickedConnector
        

        
    }
     return(
            <div className="tree" style={{width:biggestRow*2000 +'px',height:((rows.length+1)*CONNECTOR_TOP_GAP)+'px'}}>
                <Connectors 
                    data = {data}
                    scrollToConnector={scrollToConnector} 
                    treeClaimClick={treeClaimClick} 
                    reRenderTrees={props.reRenderTrees} 
                />  

                {!!claimsLocations &&
                    <div>
                        <div style={{position:'absolute'}}>
                            <StraightLines 
                                data = {data}
                                connectorsOutOfFocus={connectorsOutOfFocus} 
                                connectedClaims={connectedClaims} 
                                clickedClaim={clickedClaim} 
                                clickedConnector={clickedConnector} 
                                connectorsLocations={connectorsLocations} 
                                claimsLocations={claimsLocations} 
                                connectorsObj={connectorsObj} 
                                treeID={treeID} claims={claims} 
                                rows={rows} 
                                userID={props.userID}
                            />  
                        </div>
                    </div>
                }
            
            </div>

     )
}


export default Tree;