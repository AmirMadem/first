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


const Connectors = (props) =>{

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

    var scrollToConnector = props.scrollToConnector;
    var treeClaimClick = props.treeClaimClick;

     const ConnectorsClaim = (props) =>{

        var color;
        var clicked;
        var gen = connectorsObj[props.connectorID].gen
        if(props.connectorID == clickedConnector && props.claimID != clickedClaim.ID && !connectedClaims.includes(props.claimID)){
            color = '#9ba6a5';
            clicked = false;
        }
        else if(props.claimID == clickedClaim.ID){
            color ='black';
            clicked = true;
        }

        else if(connectorsOutOfFocus.includes(props.connectorID) && connectedClaims.includes(props.claimID)){
            color ='black';
            clicked = false;
        }

        const [claimColor,setClaimColor] = useState(color);
        const [claimBorder,setClaimBorder] = useState('');
        const [isClicked,setIsClicked] = useState(clicked);
        const [isAddCon,setIsAddCon] = useState(false);
        
        const onClaimClick = ()=>{
            treeClaimClick(props.claimID,gen,props.connectorID,rows)
        }
        const onAddConnectorClick = () =>{
            setIsAddCon(true)
        }
    
        return(
            <div>
                <div 
                    key={props.index} 
                    className="tree-claim" 
                    id={props.claimID+ "tree-claim,connectorID:" + props.connectorID  + treeID} 
                    style={{display:'inline-block',color:claimColor,border:claimBorder}}
                    onClick={(e) => onClaimClick()}  
                >
                - {claims[props.claimID].content} -
                </div>    
            </div>
        )
     }

    const ConnectorContent = (props) =>
    {

        var isVisibleTemp = 'hidden';
        if(clickedConnector == props.connectorID){
            isVisibleTemp = '';
        }

        var connectorsClaims = props.connector.claims;
        var color = 'black';
        var width = CONNECTOR_WIDTH;
        var height = CONNECTOR_HEIGTH;
        var border ='groove'
        var originalColor = 'black';
        const [isVisible,setIsVisble] = useState(isVisibleTemp);

        if(!!logConnTypes[props.connector.type]){

            color = logConnTypes[props.connector.type].color;
            originalColor = color;
        }

        for(var ind01=0;ind01<connectorsOutOfFocus.length;ind01++){
            if (connectorsOutOfFocus[ind01] == props.connectorID)
            {
                color = '#9ba6a5';
                border = 'none';

            }
           
        }
        if(props.connector.claims.includes(clickedClaim.ID)){
            border = 'solid';
            color = 'black';
        }  
        if(props.connector.ID == clickedConnector){

            height*=2;
        }  
        var left ='0px';
        var top ='0px';
        if(!!connectorsLocations[props.connectorID]){
            left = connectorsLocations[props.connectorID].offsetLeft +'px'
            top = connectorsLocations[props.connectorID].offsetTop +'px';
        }
  
        return(
            <div style={{display:'inline-block',position:'absolute',left:left,top:top}}>
              
                <div className="tree-connector" 
                    id={treeID +"" +props.connectorID}
                    style={{
                        width:width,
                        height:height,
                        color:color,
                        border:border,
                        borderColor:color,
                    }}
                > 
                    <div style={{textAlign:'center', visibility:isVisible,position: 'absolute',top:'-50px',left:'1px',width:'100%'}}> 
                        <div className={'add-connector-tree-container'}>
                            <AddingConnector userID={props.userID} targetClaimID={clickedClaim.ID} connectorID={props.connectorID} scrollToConnector={scrollToConnector} reRenderTrees={props.reRenderTrees} treeID={treeID}/>
                        </div>
                    </div> 
                    <div style={{position:'relative',height:'100%',overflow:'hidden'}}>
                        {connectorsClaims.map((claimID,index)=>
                            <ConnectorsClaim 
                                key={index}
                                claimID={claimID} 
                                index={index} 
                                connectorID={props.connectorID} 
                                color={originalColor} 
                                userID={props.userID}
                            />
                        )} 
                    </div>
                            <div style={{position:'relative',textAlign:'center', visibility:isVisible}}> 
                                <div className={'add-connector-tree-container'} style={{position:'absolute',left:-(VOTING_BAR_WIDTH-CONNECTOR_WIDTH)/2}}>
                                    <VotingBar  userID={props.userID} claim={clickedClaim} votes={clickedClaim.votes} votingTypes={claimsVotesTypesObj} claimType ='tree-claim' updateVotes={manageData.updateVotes} status={clickedClaim.userVoteStatus}/>    
                                </div>
                            </div>
                </div>
            </div>    
        )
    }

    return(
        <div style={{position:'absolute'}}>
            {Object.keys(connectorsLocations).map((connectorID,index) => 
                <ConnectorContent key={index}  userID={userID}  connector={connectorsObj[connectorID]} connectorID={connectorID} reRenderTrees={props.reRenderTrees} clickedConnector={clickedConnector}/>
            )}
        </div>    
    )
}

export default Connectors;