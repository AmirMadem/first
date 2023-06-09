import React, { useState, useEffect,useRef} from "react";
import getData from '../../getData.js';
import manageData from '../../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "../SearchinBox.js";
import Tree from "./Tree.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';


const CONTRADICT = 0;
const WEEKEN = 1;
const APROVE = 2;
const SUPPORT =3;

const Trees = (props) =>{

    console.log("trees re renders!!!!!!!");

    const [clickedTree,setClickedTree] = useState('tree0');
    const [clickedConnector,setClickedConnector] = useState(0);

    var biggestRows = [];
    var currTree;
    var currConnectorObj;
    var allRows = 0;
    var allGens = 0;
    var generalBiggestRow=1;
    var generalBiggestGens=1;
    var usersConnectors = manageData.getUsersTreeObjects(props.userID)['connectors'];
    var usersClaims= manageData.getUsersTreeObjects(props.userID)['claims'];

    const buildTrees = (allConnectorsObj,allClaimsObj) =>{
        var trees =[];
        var usedClaims ={};
        var firstClaim;
        var firstConnector;
        
        for(var connectorID in allConnectorsObj){

            for(var ind01=0;ind01<allConnectorsObj[connectorID].claims.length;ind01++){
                usedClaims[allConnectorsObj[connectorID].claims[ind01]] = true;
            }           
        }

        for(var claim in allClaimsObj){
            if(!usedClaims[claim]){
                firstClaim = claim;
                firstConnector ={
                    ID:0,
                    targetClaimID:'none',
                    type:"claim",
                    claims:[firstClaim]
                }
                var tree = {}
                var tempConnectors = Object.assign({},allConnectorsObj)
                tempConnectors[0] = firstConnector;
                var usedConnectors = {};

                tree.connectorsObj = tempConnectors;
                tree.claims = allClaimsObj;
                trees.push(tree);
            }
        }

        return trees;

    }

    const calculateWidth = () =>{

    }

	
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
    const getBiggestRow = (rows) =>{
        var biggestRow = 1;
        for(var ind01=0;ind01<rows.length;ind01++){
            if(rows[ind01].length > biggestRow){
                biggestRow = rows[ind01].length;
            }
        }
        return biggestRow;
    }



    const [allTrees,setAllTrees] = useState(buildTrees(usersConnectors,usersClaims))

    
    const reRenderTrees = (newConnectorID,treeID) =>{
        usersConnectors = manageData.getUsersTreeObjects(props.userID)['connectors'];
        usersClaims= manageData.getUsersTreeObjects(props.userID)['claims'];
        setClickedConnector(newConnectorID);
        setClickedTree(treeID);
        var allTreesTemp = (buildTrees(usersConnectors,usersClaims));
        setAllTrees(allTreesTemp)
    }


    return(
        <div className="trees" style={{minWidth:4400,minHeight:5000}}>
            <div>
                {allTrees.map((tree,index)=>
                     <div key={index} id={'tree'+index} style={{position:'relative', display:'inline-block',margin:'10px'}}>
                        <Tree 
                            key = {index}
                            userID = {props.userID} 
                            claims = {tree.claims} 
                            connectorsObj = {tree.connectorsObj} 
                            treeID = {'tree'+index} 
                            firstClaim = {tree.connectorsObj[0].claims[0]}
                            tree={tree}
                            reRenderTrees = {reRenderTrees}
                            clickedConnector ={clickedConnector}
                            clickedTree = {clickedTree}
                        />
                    </div>
                )}
            </div>                       
        </div>
    )
}

export default Trees;