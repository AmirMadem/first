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


const StraightLines = (props) =>{

    var lines = [];
    var voteButtons = [];

    var connectorsOutOfFocus = props.connectorsOutOfFocus;
    var connectedClaims = props.connectedClaims;
    var clickedClaim = props.clickedClaim;
    var clickedConnector = props.clickedConnector;
    var connectorsLocations = props.connectorsLocations;
    var claimsLocations = props.claimsLocations;
    var connectorsObj = props.connectorsObj;
    var scrollToConnector = props.scrollToConnector;
    var treeID = props.treeID;
    var claims = props.claims;
    var rows = props.rows;
    var treeClaimClick = props.treeClaimClick;
    var userID = props.userID;

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
     
                if(!!claimsLocations[connector.targetConnectorID] && claimsLocations[connector.targetConnectorID][connector.targetClaimID]){
                    targetClaimLocation = claimsLocations[connector.targetConnectorID][connector.targetClaimID];    
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

    const Lines = (props) =>{

        var lines = props.lines;
        return(
            <div>
                {lines.map((line,index)=>
                    <Line key={index} line={line}/>
                )}
            </div>
        )
        
    }

    var tempLines = buildLines(connectorsObj,connectorsLocations,claimsLocations);
    lines = tempLines.lines;
    voteButtons = tempLines.voteButtons;

    return(
        <div>
            <Lines lines={lines}/>
            <VoteButtons userID={userID} connectorsObj={connectorsObj} voteButtons={voteButtons} connectorsOutOfFocus={connectorsOutOfFocus}/>
        </div>
        )
}

export default StraightLines;
