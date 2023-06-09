
import React, { useState, useEffect,useRef} from "react";
import getData from '../../getData.js';
import manageData from '../../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "../SearchinBox.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';


var claimsLocations = {};
var connectorsLocations = {};

const fillConnectorsLocation = () =>{
    var domConnectors = currentTree.getElementsByClassName('tree-connector');
    var connectorID;
    var connectorIDStr;

    var connectorHeigth;
    var connectorWidth;
    for(var connector in domConnectors){
        connectorIDStr = domConnectors[connector].id;

        if(!!connectorIDStr){
            connectorID = connectorIDStr.slice(5);
        }
        connectorHeigth = domConnectors[connector].offsetHeight;
        connectorWidth = domConnectors[connector].offsetWidth;
        connectorsLocations[connectorID] ={
            offsetTop: domConnectors[connector].offsetTop + connectorHeigth,
            offsetLeft: domConnectors[connector].offsetLeft + connectorWidth/2,
        }
      
    }
 }

const fillClaimsLocation = () =>{
    var domClaims = currentTree.getElementsByClassName('tree-claim');
    var claim;
    var claimID;
    var gen;

    for(var claim in domClaims){
        claimID = ""+ domClaims[claim].id
        claimID = getNumberPart(claimID);
        var currentClaim = domClaims[claim];
  
        
        if(!claimsLocations[claimID]){
            claimsLocations[claimID] =[];
        }

        var connectorsCount = 0;
        for(var connector in connectorsObj){
            if(connectorsObj[connector].targetClaimID == claimID){
                connectorsCount++;
            }
        }
 
        claimsLocations[claimID].push({
            offsetTop: domClaims[claim].offsetTop,
            offsetLeft: domClaims[claim].offsetLeft,
            connectorsCount: connectorsCount
        })
          
        
    } 

 }

 
const buildLines = () =>{

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
    var isThin = false;
    var directionRight = false;
    var currHeightFactor;
    var currWidthFactor;
    var lineLeftPos;
    var lineWidth;
    var newVoteButton;

    const buildFirstLine = () =>{
        if(directionRight == true){
            lineHeight = currHeightFactor - currCount*lineHeigthFactor;
        }
        else{
            lineHeight = currHeightFactor + currCount*lineHeigthFactor;
        }

        newLine = {
            connectorID:connectorID,
            offsetTop: connectorLocation.offsetTop,
            offsetLeft: connectorLocation.offsetLeft,
            height: lineHeight,
            width:1,
            borderBottom: 'none',
            borderLeft: 'groove',
            color:logConnTypes[connector.type].color
            
        }
        newVoteButton ={
            offsetTop: connectorLocation.offsetTop +25,
            offsetLeft: connectorLocation.offsetLeft,
            connector: connectorsObj[connectorID],
            connectorID: connectorID,
            votes: connectorsObj[connectorID].votes
        }
     
    }
    const buildSecondLine = () =>{
       
        if(directionRight == false){
            lineLeftPos = connectorLocation.offsetLeft - (widthDistance - 2);
            lineWidth = widthDistance  -1;
        }
        else{
            lineLeftPos = connectorLocation.offsetLeft;
            lineWidth = widthDistance ;
            if(lineWidth < 0){
                lineWidth = 0;
            }
        }
            newLine2 = {   
            connectorID:connectorID,                 
            offsetTop: connectorLocation.offsetTop + newLine.height,
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
            offsetTop: connectorLocation.offsetTop + newLine.height,
            offsetLeft: lineLeftPos,
            width:1,
            height:lineHeight +15,
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
        
        widthDistance = connectorLocation.offsetLeft - targetClaimLocation.offsetLeft + currWidthFactor;
        
        currHeightFactor = 120;
        if(widthDistance < 0){
            widthDistance = Math.abs(widthDistance);
            if(directionRight == false){
                currHeightFactor = 120;
                currCount = 0;
            }
            directionRight = true;
        }
        else{
            if(directionRight == true){
                currHeightFactor = 80;
                currCount = 0;
            }
            directionRight = false;  
        }

            return currCount;
    }

    for(var ind01=0;ind01<rows.length;ind01++){
        row = rows[ind01];
        lineHeigthFactor = 120 /row.length;
        lineWidghFactor =10;
        
        var currCount =0;
        for(var ind02=0;ind02<row.length;ind02++){

            connectorID = row[ind02].ID;
            connector = connectorsObj[connectorID];
            
            connectorLocation = connectorsLocations[connectorID];
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

                currCount = updateWidthAndHeigthFactors(currCount,ind02);
                buildFirstLine();
                buildSecondLine();
                buildThirdLine();
                
                lines.push(newLine); 
                voteButtons.push(newVoteButton)
                
                lines.push(newLine2); 
                lines.push(newLine3); 
                
                
                currCount++;
            }  
        }
    }

    return {lines:lines,voteButtons:voteButtons};
 }

const Line = (props) =>{

    var line = props.line;
    var lineColorTemp;
    
    if(connectorsOutOfFocus.includes(line.connectorID) || line.connectorID == clickedConnector){
        lineColorTemp = '#c1c1c1';
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