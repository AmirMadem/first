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

        const addConnectorsCount = (currConnector) =>{
            if(!usedClaims.includes(currConnector.claims[ind01])){
                rows[curGen][rows[curGen].length-1].connectors++;
            }
        }

        //recursion heart - caliing buildRows for every connector that target any claim in the current connector
        for(var ind01=currConnector.claims.length-1;ind01>-1;ind01--){

            for(var connectorID in connectorsObj){
                if(connectorsObj[connectorID].targetClaimID == currConnector.claims[ind01]){
                    addConnectorsCount(currConnector);
                    buildRows(curGen+1,connectorID,connectorsObj,rows,usedConnectors,usedClaims,curConnectorID);
                }

            }
            usedClaims.push(currConnector.claims[ind01]);
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
            rightestLocationInRow[curGen] = connectorsLocations[currConnectorID];
        
        }

        //case current connector have single parent - locating current connector relative to it
        else if(parentsLocations.length >0){
            connectorsLocations[currConnectorID] = parentsLocations[0]+0.5;
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
        var newClaimLoc;
        for(var ind01=0;ind01<claimsAmount;ind01++){
            currClaimID = connectorsObj[currConnectorID].claims[ind01]
            if(!claimsLocations[currClaimID]){
                claimsLocations[currClaimID] = [];
            }

            newClaimLoc = {
                offsetLeft:connectorsLocations[currConnectorID].offsetLeft - factor*(ind01+1) ,
                offsetTop:connectorsLocations[currConnectorID].offsetTop - factor*(ind01+1),
                offsetLeft2: connectorsLocations[currConnectorID].offsetLeft + CONNECTOR_WIDTH + factor*(ind01+1),
                offsetTop2: connectorsLocations[currConnectorID].offsetTop - factor*(ind01+1),
            }
            claimsLocations[currClaimID].push(newClaimLoc);
        }
        
        return currentConnectorLoc;
    
    }

    const buildLines2 = (connectorsObj,connectorsLocations,claimsLocations) =>{

        var targetClaimsLocations = {};
        var lines = [];
        var voteButtons = [];
        var newVoteButton={};
        var newLine ={};
        var clickedHeightBonus = 0;
        var connector;
        var connectorLoc
        var targetClaimLocation;
        var targetConnectorID;

        for(var connectorID in connectorsLocations){
            connector = connectorsObj[connectorID];
            targetConnectorID = parseInt(connector.targetConnectorID,10)

            if(connectorID == clickedConnector){
                clickedHeightBonus = CONNECTOR_HEIGTH;
            }
            else{
                clickedHeightBonus=0;
            }

            connectorLoc = {
                offsetLeft: connectorsLocations[connectorID].offsetLeft +(CONNECTOR_WIDTH/2),
                offsetTop:  connectorsLocations[connectorID].offsetTop +CONNECTOR_HEIGTH +clickedHeightBonus*1,
            }

            if(!!claimsLocations[connector.targetClaimID]){

                for(var ind01=0;ind01<claimsLocations[connector.targetClaimID].length;ind01++){
                    if(
                        !!connectorLoc && 
                        (claimsLocations[connector.targetClaimID][ind01].offsetTop - connectorLoc.offsetTop) > 0 && 
                        (claimsLocations[connector.targetClaimID][ind01].offsetTop - connectorLoc.offsetTop)< CONNECTOR_HEIGTH*2.5
                    )
                    {
                        targetClaimLocation = claimsLocations[connector.targetClaimID][ind01];
                        targetClaimsLocations[connectorID] = targetClaimLocation;
                      
                        newLine = {
                            connectorLoc:connectorLoc,
                            claimLoc:{
                                offsetLeft:targetClaimLocation.offsetLeft,
                                offsetTop:targetClaimLocation.offsetTop,

                            },
                            color:logConnTypes[connector.type].color,
                            connectorID:connectorID
                        }

                        newVoteButton ={
                            offsetTop: connectorLoc.offsetTop-15,
                            offsetLeft: connectorLoc.offsetLeft,
                            connector: connectorsObj[connectorID],
                            connectorID: connectorID,
                            votes: connectorsObj[connectorID].votes
                        }
                        break;
                    }
                }
                if(connectorsLocations[targetConnectorID].offsetLeft <= connectorsLocations[connectorID].offsetLeft){
                    newLine.claimLoc.offsetLeft = (2*connectorsLocations[targetConnectorID].offsetLeft - newLine.claimLoc.offsetLeft) + CONNECTOR_WIDTH; 
                }
            }
            if(!!newLine.connectorLoc && !!newLine.claimLoc){
                lines.push(newLine);
                voteButtons.push(newVoteButton);

            }
        }
   
        return {lines:lines,voteButtons:voteButtons};
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


     const buildLines = (connectorsObj,connectorsLocations,claimsLocations) =>{

        var targetClaimsLocations = {}

        var lines = [];
        var voteButtons = [];
        var newLine; 
        var newLine2;
        var newLine3;
        var connector;
        var connectorID;
        var row;
        var targetClaimLocation;
        var targetClaimID;
        var connectorLocation;
        var connectorHeigthFactor;
        var lineWidthFactor;
        var widthDistance;
        var lineHeight;
        var lineHeigthFactor;
        var lineWidghFactor;
        var directionRight = false;
        var currHeightFactor;
        var currWidthFactor;
        var lineLeftPos;
        var lineWidth;
        var newVoteButton;
        var clickedHeightBonus = 0;


        const buildFirstLine = () =>{

            if(directionRight == true){
                lineHeight = currHeightFactor - currCount*lineHeigthFactor;
            }
            else{
                lineHeight = currHeightFactor + currCount*lineHeigthFactor;
            }

            newLine = {
                connectorID:connectorID,
                offsetTop: connectorLocation.offsetTop + clickedHeightBonus, 
                offsetLeft: connectorLocation.offsetLeft, 
                height: lineHeight,
                width:1,
                borderBottom: 'none',
                borderLeft: 'groove',
                color:logConnTypes[connector.type].color
                
            }

            
            newVoteButton ={
                offsetTop: connectorLocation.offsetTop+10,
                offsetLeft: connectorLocation.offsetLeft,
                connector: connectorsObj[connectorID],
                connectorID: connectorID,
                votes: connectorsObj[connectorID].votes
            }
         
        }
        const buildSecondLine = () =>{
           
            if(directionRight == false){
                lineLeftPos = connectorLocation.offsetLeft - (widthDistance - 2);
                lineWidth = widthDistance  ;
            }
            else{
                lineLeftPos = connectorLocation.offsetLeft;
                lineWidth = widthDistance ;
                if(lineWidth < 0){
                    //lineWidth = 0;
                }
            }
                newLine2 = {   
                connectorID:connectorID,                 
                offsetTop: connectorLocation.offsetTop + clickedHeightBonus + newLine.height,
                offsetLeft: lineLeftPos,
                height: 1,
                width: lineWidth,
                borderBottom: 'groove',
                borderLeft: 'none',
                color:logConnTypes[connector.type].color
            }   
        }
        const buildThirdLine = () =>{
            if(directionRight == true){
                lineLeftPos = lineLeftPos + lineWidth;
            }
         
            lineHeight =targetClaimLocation.offsetTop - (connectorLocation.offsetTop + newLine.height)

            newLine3 ={
                connectorID:connectorID,    
                offsetTop: connectorLocation.offsetTop + clickedHeightBonus + newLine.height,
                offsetLeft: lineLeftPos,
                width:1,
                height:lineHeight,
                borderBottom: 'none',
                borderLeft: 'groove',
                color:logConnTypes[connector.type].color
            }
        }
        const updateWidthAndHeigthFactors = (currCount,connectorIndex) => {
            currWidthFactor = lineWidghFactor;
            for(var ind03=connectorIndex;ind03<row.length;ind03++){
                var connectorID2 = row[ind03].ID;
                var connector2 = connectorsObj[row[ind03].ID];
                if(connector2.targetConnectorID == connector.targetConnectorID){
                    currWidthFactor += lineWidghFactor;
                }
                
            }
            if(connectorLocation.offsetLeft > connectorsLocations[connector.targetConnectorID].offsetLeft){
                widthDistance = connectorLocation.offsetLeft - targetClaimLocation.offsetLeft2 
            }
            else{
                widthDistance = connectorLocation.offsetLeft - targetClaimLocation.offsetLeft ;
            }
            currHeightFactor = (CONNECTOR_TOP_GAP-CONNECTOR_HEIGTH)/2;
            if(widthDistance < 0){
                widthDistance = Math.abs(widthDistance);
                if(directionRight == false){
                    currHeightFactor = (CONNECTOR_TOP_GAP-CONNECTOR_HEIGTH)/2;
                    currCount = 0;
                }
                directionRight = true;
            }
            else{
             

                if(directionRight == true){
                    currHeightFactor = (CONNECTOR_TOP_GAP-CONNECTOR_HEIGTH)/2.5;
                    currCount = 0;
                }
                directionRight = false;  
            }

                return currCount;
        }

        for(var ind01=0;ind01<rows.length;ind01++){
            row = rows[ind01];
            lineHeigthFactor = (CONNECTOR_TOP_GAP-CONNECTOR_HEIGTH)/2/row.length;
            lineWidghFactor =2;
            
            var currCount =0;
            for(var ind02=0;ind02<row.length;ind02++){

                connectorID = row[ind02].ID;
                connector = connectorsObj[connectorID];
                
                connectorLocation = {
                    offsetLeft:connectorsLocations[connectorID].offsetLeft +CONNECTOR_WIDTH/2,
                    offsetTop:connectorsLocations[connectorID].offsetTop + CONNECTOR_HEIGTH + clickedHeightBonus,
                }    

                targetClaimLocation =null;
     
                if(claimsLocations[connector.targetClaimID]){

                    for(var ind03=0;ind03<claimsLocations[connector.targetClaimID].length;ind03++){
                        if(!!connectorLocation && claimsLocations[connector.targetClaimID][ind03].offsetTop - connectorsLocations[connectorID].offsetTop > 30)
                        {
                            
                            targetClaimLocation = claimsLocations[connector.targetClaimID][ind03];
                            break;
                        }
                    }
                }

                if(!!connectorLocation && !!targetClaimLocation){

                    if(connectorID == clickedConnector){
                        clickedHeightBonus = CONNECTOR_HEIGTH;
                    }
                    else{
                        clickedHeightBonus=0;
                    }
                    //connectorLocation.offsetLeft+=(CONNECTOR_WIDTH/2);
                    currCount = updateWidthAndHeigthFactors(currCount,ind02);
                    buildFirstLine();
                    buildSecondLine();
                    buildThirdLine();
                    
                    lines.push(newLine); 
                    voteButtons.push(newVoteButton)
                    lines.push(newLine2); 
                    lines.push(newLine3); 
                    targetClaimsLocations[connector.ID] = targetClaimLocation
                    
                    currCount++;
                }  
            }
        }

        return {lines:lines,voteButtons:voteButtons};
     }

     const Line2 = (props) =>{

        var line = props.line;
        var connectorID =  parseInt(line.connectorID,10);

        var lineColorTemp;
        
        if(connectorsOutOfFocus.includes(connectorID) || connectorID == clickedConnector){
            lineColorTemp = '#9ba6a5';
        }
        else{
            lineColorTemp = line.color
        }
        
        const [lineColor,setLineColor] = useState(lineColorTemp);

        return(
            <div 
                style={{
                    position:'absolute',
                    left:line.connectorLoc.offsetLeft,
                    top:line.connectorLoc.offsetTop,
                    color :lineColor,
                    pointerEvents: 'none',
                }}
            >
                <RotatedSquare connectorLoc={line.connectorLoc} claimLoc={line.claimLoc} color={lineColor} />
            </div>
        )
     }

     const Lines2 = (props) =>{
        var lines = props.lines;
        return(
            <div>
                {lines.map((line,index)=>
                    <Line2 key={index} line={line}/>
                )}
            </div>
        )
        
     }
 
     const Line = (props) =>{

        var line = props.line;
        var lineColorTemp;
        
        if(connectorsOutOfFocus.includes(line.connectorID) || line.connectorID == clickedConnector){
            lineColorTemp = '#9ba6a5';
        }
        else{
            lineColorTemp = line.color
        }
        
        const [lineColor,setLineColor] = useState(lineColorTemp);

        return(
            <div 
            className="connector-line2" 
            style={{
                top:line.offsetTop,
                left:line.offsetLeft,
                height:line.height,
                width:line.width,
                color :lineColor,
                backgroundColor:lineColor,
            }}> 
         </div>
        )
     }
     const Lines =(props) =>{
        var lines = props.lines;
        return(
            <div>
                {lines.map((line,index)=>
                    <Line key={index} line={line}/>
                )}
            </div>
        )
     }

     const VoteButtons =(props) =>{

        var voteButtons = props.voteButtons;

        return(
            <div>
                {voteButtons.map((voteButton,index)=> 
                    <div 
                        style={{
                            position:'absolute',
                            top:voteButton.offsetTop+8,
                            left:voteButton.offsetLeft-5,
                        }}
                    >
                    {!props.connectorsOutOfFocus.includes(parseInt(voteButton.connectorID,10)) && (voteButton.connectorID != 0) && (voteButton.connectorID != clickedConnector) && (!!props.connectorsObj[voteButton.connectorID]) &&

                        <ExpVotingBar 
                            userID={props.userID}
                            claim={voteButton.connector}
                            votes={voteButton.votes}
                            votingTypes={connectorsVotingTypesObj}
                            claimType ='tree-logconn' 
                            updateVotes={manageData.updateVotes}
                            status={props.connectorsObj[voteButton.connectorID].userVoteStatus} //bug
                        /> 
                    }
                    </div>
                )}
            </div>
        )
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
     
     const RotatedSquare = (props) => {

        function arcctg(x) { return Math.PI / 2 - Math.atan(x); }

        var squareSize = 50;
        const anchorPointX = 0;
        const anchorPointY = 0;

        
        var lineWidth;
        var posTop;
        var posLeft;

        var tan;
        var angel;
        var isDirectionLeft = false;
        if(props.claimLoc.offsetLeft - props.connectorLoc.offsetLeft < 0){
            isDirectionLeft = true;
        }
        var widthDistance = Math.abs(props.claimLoc.offsetLeft - props.connectorLoc.offsetLeft) ;
        var heigthDistance = Math.abs(props.claimLoc.offsetTop - props.connectorLoc.offsetTop) ;

        tan = heigthDistance/widthDistance;

        angel = 90 - arcctg(tan)*57.2958;
        if(!!isDirectionLeft){
            angel = 180 - angel;
        }

        if(angel != 90){
            lineWidth =Math.abs(widthDistance/Math.cos(angel/57.2958));
        }
        else{
            lineWidth = heigthDistance;
        }

        squareSize = lineWidth;
      
        const squareStyle = {
          height: squareSize,
          width: squareSize,
          borderTop:'groove',
          borderTopColor:props.color,
          borderTopWidth:'1px'
        };
      
        return (
            <View
                style={[
                    squareStyle,
                    {
                        transform: [
                            {translateX: anchorPointX - squareSize / 2},
                            {translateY: anchorPointY - squareSize / 2},
                            {rotateZ:angel +'deg'},
                            {translateX: -(anchorPointX - squareSize / 2)},
                            {translateY: -(anchorPointY - squareSize / 2)},
                        ],
                    },
                ]}
            />
        );
      };



     function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }

     function getNumberPart(claimID) {
        var onlynum = null;
        for(var ind01=2;ind01<claimID.length;ind01++){
            onlynum = claimID.slice(0,ind01);
            if(!isNumber(onlynum)){
                onlynum = claimID.slice(0,ind01-1);
                return onlynum;
            }
        }
        return onlynum;
     }

    const myFunction = (pressedKey) =>{
        console.log(pressedKey);
        if(pressedKey == 'ArrowRight'){
       
        }
    }



    var connectorsLocations = {};
    var claimsLocations = {};
    var rows = buildRows(0,0,props.connectorsObj,[],[],[],-1);
    rows = rows.reverse();

    buildConnectorsLocations(rows,connectorsObj,connectorsLocations,claimsLocations,rows.length-1,0,{});

    //var builtLinesTemp = buildLines(connectorsObj,connectorsLocations,claimsLocations);
    var tempLines = buildLines2(connectorsObj,connectorsLocations,claimsLocations)
    var connectorsLines = tempLines.lines;
    var voteButtons = tempLines.voteButtons;

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

 

     return(
            <div className="tree" style={{width:biggestRow*2000 +'px',height:((rows.length+1)*CONNECTOR_TOP_GAP)+'px'}}>
                <Connectors connectorsOutOfFocus={connectorsOutOfFocus} connectedClaims={connectedClaims} clickedClaim={clickedClaim} clickedConnector={clickedConnector} connectorsLocations={connectorsLocations} claimsLocations={claimsLocations} connectorsObj={connectorsObj} scrollToConnector={scrollToConnector} treeID={treeID} claims={claims} rows={rows} treeClaimClick={treeClaimClick}/>  
                {!!claimsLocations &&
                    <div>
                        <div style={{position:'absolute'}}>
                            <DiagonalLines connectorsOutOfFocus={connectorsOutOfFocus} connectedClaims={connectedClaims} clickedClaim={clickedClaim} clickedConnector={clickedConnector} connectorsLocations={connectorsLocations} claimsLocations={claimsLocations} connectorsObj={connectorsObj} scrollToConnector={scrollToConnector} treeID={treeID} claims={claims} rows={rows} treeClaimClick={treeClaimClick}/>  
                        </div>
                    </div>
                }
            
            </div>

     )
}


export default Tree;