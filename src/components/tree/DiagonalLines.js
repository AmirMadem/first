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


const DiagonalLines = (props) =>{

    var lines = [];
    var voteButtons = [];

    var connectorsOutOfFocus = props.data.connectorsOutOfFocus;
    var connectedClaims = props.data.connectedClaims;
    var connectorsLocations = props.data.connectorsLocations;
    var connectorsObj = props.data.connectorsObj;
    var treeID = props.data.treeID;
    var claims = props.data.claims;
    var rows = props.data.rows;
    var userID = props.data.userID;
    var clickedClaim = props.data.clickedClaim;
    var clickedConnector = props.data.clickedConnector;

    var claimsLocations = props.claimsLocations;



    const buildLines = (connectorsObj,connectorsLocations,claimsLocations) =>{

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
            if(!!claimsLocations[connector.targetConnectorID] && !!claimsLocations[connector.targetConnectorID][connector.targetClaimID]){
                targetClaimLocation = claimsLocations[connector.targetConnectorID][connector.targetClaimID];       
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
                        
                if(connectorsLocations[targetConnectorID].offsetLeft <= connectorsLocations[connectorID].offsetLeft){
                    if(!!newLine.claimLoc && connectorsLocations[targetConnectorID]){
                        newLine.claimLoc.offsetLeft = (2*connectorsLocations[targetConnectorID].offsetLeft - newLine.claimLoc.offsetLeft) + CONNECTOR_WIDTH; 
                    }
                }
            }
            if(!!newLine.connectorLoc && !!newLine.claimLoc){
                lines.push(newLine);
                voteButtons.push(newVoteButton);

            }
        }
   
        return {lines:lines,voteButtons:voteButtons};
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

export default DiagonalLines;
