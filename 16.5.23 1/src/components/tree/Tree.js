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




const CONTRADICT = 0;
const WEEKEN = 1;
const APROVE = 2;
const SUPPORT =3;

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

    console.log("tree props")
    console.log(props)

    var firstClaimVoted = manageData.getSpceClaimVoted(props.firstClaim,props.userID);
    var claimsLocations = {}; 
    var connectorsLocations = {};
    var currentTree;
    var firstClaimDomElement = document.getElementById(props.firstClaim+"tree-claim"+'0')
     
    const [linesDom,setLineDom] = useState([]);
    const [voteButtons,setVoteButtons] = useState([]);
    const [screenWidth,setScreenWidth] = useState(document.screenWidth)
    const [connectorsOutOfFocus,setConnectorsOutOfFocus] = useState([]);
    const [connectedClaims,setConnectedClaims] = useState([]);
    const [clickedClaim,setClickedClaim] = useState(firstClaimVoted);
    const [clickedConnector,setClickedConnector] = useState(0);

    var claims = props.claims;
    var connectorsObj = props.connectorsObj;
    connectorsObj = manageData.addVotesAndStatusToTreeConnectors(props.firstClaim,props.userID,connectorsObj)
    console.log("tree renders!")
    var treeID =props.treeID;

    //var connectorsObj = {};

    const buildRows = (curGen,curConnectorID,connectorsObj,rows,usedConnectors) =>{
        
        curConnectorID = parseInt(curConnectorID,10);

        if(!rows[curGen]){
            rows[curGen] = [];
        }
        var currConnector = connectorsObj[curConnectorID];

        if(!usedConnectors[curConnectorID]){
      
            usedConnectors[curConnectorID] = {curGen:curGen};

            var newConn = {
                ID:curConnectorID,
                gen:curGen
            }
            rows[curGen].push(newConn);
   
            for(var ind01=currConnector.claims.length-1;ind01>-1;ind01--){
                for(var connectorID in connectorsObj){
                    if(connectorsObj[connectorID].targetClaimID == currConnector.claims[ind01]){
                        buildRows(curGen+1,connectorID,connectorsObj,rows,usedConnectors);
                    }
                }
            }   
        }
   
        return rows;
    }



    var rows = buildRows(0,0,props.connectorsObj,[],[])
    rows = rows.reverse();

    const getBiggestRow = (rows) =>{
        var biggestRow = 1;
        for(var ind01=0;ind01<rows.length;ind01++){
            if(rows[ind01].length > biggestRow){
                biggestRow = rows[ind01].length;
            }
        }
        return biggestRow;
    }




    const getConnectedClaims =(claimID,claimGen) =>{
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


    const addTargetConnectors = () =>{
  
        var row;
        var connectorID;
        for(var ind01=0;ind01<rows.length;ind01++){
            row = rows[ind01];
            for(var ind02=0;ind02<row.length;ind02++){
                connectorID = row[ind02].ID;
                for(var connector in connectorsObj){
                    if(connectorsObj[connector].claims.includes(connectorsObj[connectorID].targetClaimID)){
                        connectorsObj[connectorID].targetConnectorID = connector;
                    }
                }
            }
        }
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

     const VoteButtons =(props) =>{

        var voteButtons = props.voteButtons;

        return(
            <div>
                {voteButtons.map((voteButton,index)=> 
                    <div 
                        style={{
                            position:'absolute',
                            top:voteButton.offsetTop+5,
                            left:voteButton.offsetLeft-10,
                        }}
                    >
                    {(!connectorsOutOfFocus.includes(voteButton.connectorID)) &&(voteButton.connectorID != 0) && (voteButton.connectorID != clickedConnector) && (!!props.connectorsObj[voteButton.connectorID]) &&

                        <ExpVotingBar 
                            userID={props.userID}
                            claim={voteButton.connector}
                            votes={voteButton.votes}
                            votingTypes={connectorsVotingTypesObj}
                            claimType ='tree-logconn' 
                            updateVotes={manageData.updateVotes}
                            status={props.connectorsObj[voteButton.connectorID].userVoteStatus} //bug
                        /> }
                    </div>
                 
                )}
            </div>
        )
     }

     const treeClaimClick = (claimID,gen,connectorID) =>{

        if(claimID != clickedClaim.ID){
            console.log("treeClaimClick")
            var claim = manageData.getSpceClaimVoted(claimID,props.userID);
        
            scrollToConnector(connectorID);
            var unConnectedConnectorsTemp =getConnectedClaims(claimID,gen).unConnectedConnectors;
            unConnectedConnectorsTemp.splice(unConnectedConnectorsTemp.indexOf(connectorID),1)
            setConnectorsOutOfFocus(unConnectedConnectorsTemp);
            setClickedClaim(claim);
            if(connectorID != clickedConnector){
      
                setClickedConnector(connectorID);
            }
            setConnectedClaims(getConnectedClaims(claimID,gen).connectedClaims)
        }
     }


     const ConnectorsClaim = (props) =>{

        var color;
        var clicked;
        if(props.connectorID == clickedConnector && props.claimID != clickedClaim.ID && !connectedClaims.includes(props.claimID)){
            color = '#c1c1c1';
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
            treeClaimClick(props.claimID,props.gen,props.connectorID)
        }
        const onAddConnectorClick = () =>{
            setIsAddCon(true)
        }
    
        return(
            <div>
                <div 
                    key={props.index} 
                    className="tree-claim" 
                    id={props.claimID+ "tree-claim" + props.connectorID} 
                    style={{display:'inline-block',color:claimColor,border:claimBorder}}
                    onClick={(e) => onClaimClick()}  
                >
                    - {claims[props.claimID].content} -
                </div>    
            </div>
        )
     }

     const ConnectorContent = (props) =>{

        var isVisibleTemp = 'hidden';
        if(clickedConnector == props.connectorID){
            isVisibleTemp = '';
        }

        var connectorsClaims = props.connector.claims;
        var color = 'black';
        var border ='groove'
        var originalColor = 'black';
        var claimPadding = '10px';
        var offsetHeight;
        var offsetTop;
        const [offsetTopAddCon,setOffsetTopAddCon] = useState();
        const [offsetwidth,setOffsetwidth] = useState();
        const [offsetLeft,setOffsetLeft] = useState();
        const [isVisible,setIsVisble] = useState(isVisibleTemp);

        var connectorDomElement = document.getElementById(treeID+''+props.connectorID)
        if(!!connectorDomElement){
             offsetHeight = connectorDomElement.offsetHeight
             offsetTop = connectorDomElement.offsetTop + offsetHeight ;
        }

        if(!!logConnTypes[props.connector.type]){

            color = logConnTypes[props.connector.type].color;
            originalColor = color;
        }

        for(var ind01=0;ind01<connectorsOutOfFocus.length;ind01++){
            if (connectorsOutOfFocus[ind01] == props.connectorID)
            {
                color = '#c1c1c1';
                border = 'none';

            }
           
        }
        if(props.connector.claims.includes(clickedClaim.ID)){
            border = 'solid';
            color = 'black';
        }  

  
        return(
            <div style={{display:'inline-block'}}>
                <div style={{position:'relative',textAlign:'center', visibility:isVisible}}> 
                    <div className={'add-connector-tree-container'}>
                        <AddingConnector userID={props.userID} targetClaimID={clickedClaim.ID} connectorID={props.connectorID} scrollToConnector={scrollToConnector} reRenderTrees={props.reRenderTrees} treeID={treeID}/>
                    </div>
                </div>
                <div className="tree-connector" 
                    id={treeID +"" +props.connectorID}
                    style={{color:color,border:border,borderColor:color,paddingTop:claimPadding,paddingBottom:claimPadding}}
                >
                    {connectorsClaims.map((claimID,index)=>
                        <ConnectorsClaim 
                            key={index}
                            claimID={claimID} 
                            index={index} 
                            connectorID={props.connectorID} 
                            gen={props.gen} 
                            color={originalColor} 
                            userID={props.userID}
                        />
                    )}                  
                </div>
                <div style={{position:'relative',textAlign:'center', visibility:isVisible}}> 
                    <div className={'add-connector-tree-container'}>
                         <VotingBar  userID={props.userID} claim={clickedClaim} votes={clickedClaim.votes} votingTypes={claimsVotesTypesObj} claimType ='tree-claim' updateVotes={manageData.updateVotes} status={clickedClaim.userVoteStatus}/>    
                    </div>
                </div>
            </div>    

        )
     }

    
     const ConnectorRow = (props) =>{

        var rows = [];
        rows =[...props.connRow]
        const [connectorsRow,setConnectorRow] = useState(rows)

        return(
            <div style={{minWidth:props.biggestRow*400}}>
                {connectorsRow.map((connector,index)=>
                    <ConnectorContent key={index} userID={props.userID} gen={props.gen} connector={connectorsObj[connector.ID]} connectorID={connector.ID} reRenderTrees={props.reRenderTrees}/>
                )}
            </div>
        )
     }
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
  
     const changeTreeWidth = () =>{

        var tree = currentTree.getElementsByClassName('tree')[0];
        tree.style.width = biggestRow*500 +'px'

     }

    addTargetConnectors();


    const myFunction = (pressedKey) =>{
        console.log(pressedKey);
        if(pressedKey == 'ArrowRight'){
       
        }
    }

    var usedConnectors = {};
    var biggestRow = 0;
    biggestRow = getBiggestRow(rows);

    useEffect(() => {


        console.log("useEffect useEffect useEffect useEffect useEffect ")

        currentTree = document.getElementById(props.treeID);

        changeTreeWidth();
        fillConnectorsLocation();
        fillClaimsLocation();

        var builtLinesTemp = buildLines();
        setLineDom(builtLinesTemp.lines);
        setVoteButtons(builtLinesTemp.voteButtons);
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
 
            <div className="tree">
                {rows.map((consRow,index) => 
                    <div key={index} className="cons-row">
                        <ConnectorRow userID={props.userID} connRow={consRow} gen={rows.length - index -1} biggestRow = {biggestRow} reRenderTrees={props.reRenderTrees}/>
                    </div>
                )}
                {!!claimsLocations &&
                    <div>
                        <div><Lines  lines={linesDom}/></div>
                        {true && <div><VoteButtons userID={props.userID} connectorsObj={connectorsObj} voteButtons={voteButtons} /></div>}
                    </div>
                }
            
            </div>

     )
}


export default Tree;