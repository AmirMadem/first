import React, { useState, useEffect,useRef} from "react";
import getData from '../../getData.js';
import manageData from '../../manageData.js';
import ReactDOM from 'react-dom';
import SearchinBox from "../SearchinBox.js";
import Tree from "./Tree.js";
import FullClaim from "../FullClaim.js";
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-scroll';
import { useParams } from "react-router-dom";



const CONTRADICT = 0;
const WEEKEN = 1;
const APROVE = 2;
const SUPPORT =3;

const Trees = (props) =>{

    console.log("trees re renders !!@@!!")

    let { userIDTemp } = useParams();
    let { firstClaimIDTemp } = useParams();
    var userID = props.userID;
    var firstClaimID;
    if(!!firstClaimIDTemp){
         firstClaimID = JSON.parse(firstClaimIDTemp)
    }
  
    if(!!userIDTemp){
        userID = JSON.parse(userIDTemp);
    }

    var firstClaim = manageData.getSpceClaimVoted(firstClaimID);

    const [clickedTree,setClickedTree] = useState('tree0');
    const [clickedConnector,setClickedConnector] = useState(0);
    const [clickedClaimTrees,setClickedClaimTrees] = useState(firstClaim)
 

    var biggestRows = [];
    var currTree;
    var currConnectorObj;
    var allRows = 0;
    var allGens = 0;
    var generalBiggestRow=1;
    var generalBiggestGens=1;
    var usersTreeObjects =  manageData.getUsersTreeObjects(userID)
    var usersConnectors = usersTreeObjects['connectors'];
    var usersClaims= usersTreeObjects['claims'];



    const buildOneTree = (allConnectorsObj,allClaimsObj,firstClaimID) =>{
        var trees = [];
        var firstConnector ={
            ID:0,
            targetClaimID:'none',
            type:"claim",
            claims:[firstClaimID]
        }
        var tree = {}
        var tempConnectors = Object.assign({},allConnectorsObj)
        tempConnectors[0] = firstConnector;

        tree.connectorsObj = tempConnectors;
        tree.claims = allClaimsObj;
        trees.push(tree);

        return trees;
    }

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

    var trees = []
    if(!firstClaimID){
        trees = buildTrees(usersConnectors,usersClaims);
    }
    else{
        trees = buildOneTree(usersConnectors,usersClaims,firstClaimID)
    }

    const [allTrees,setAllTrees] = useState(trees)

    
    const reRenderTrees = (newConnectorID,treeID,claimID) =>{

        usersConnectors = manageData.getUsersTreeObjects(userID)['connectors'];
        usersClaims= manageData.getUsersTreeObjects(userID)['claims'];
        setClickedConnector(newConnectorID);
        setClickedTree(treeID);
        var allTreesTemp;
        if(!firstClaimID){
            allTreesTemp = (buildTrees(usersConnectors,usersClaims));
        }
        else{
            allTreesTemp = (buildOneTree(usersConnectors,usersClaims,firstClaimID));
        }
        setAllTrees(allTreesTemp)
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



    const Footer = (props) =>{

        const [searchValue,setSearchValue] = useState('');

        var claimsTemp = [];

        for(var claimID in props.claims){
            claimsTemp.push(props.claims[claimID])
        }
        const [claims,setClaims] = useState(claimsTemp);
        const [unFilteredClaims,setUnFilteredClaims] = useState(claims);
        

        const filterBySearch = (event) => {
            const query = event.target.value;
            setSearchValue(query);
            var updatedList = [...unFilteredClaims];
            updatedList = updatedList.filter((item) => {
            return item.content.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
            setClaims(updatedList);
        };

        const clickOnFooterClaim = (claimID) =>{
            var domClaims = document.getElementsByClassName('tree-claim');
            var clickedClaim;
            var numberID;
            for(var ind01=0;ind01<domClaims.length;ind01++){
                numberID = getNumberPart(domClaims[ind01].id);
                if(numberID == claimID){
                    clickedClaim = domClaims[ind01];
                    break;
                }
            }
            if(!!clickedClaim){

                clickedClaim.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                });
               clickedClaim.click();
            }
        };

        return(
            <div>

                    <div className="trees-footer">
                        <div className = "tree-footer-navigate">
                            <div style={{margin:'10px'}}>
                                <SearchinBox searchValue={searchValue} filterBySearch={filterBySearch}/>
                            </div>
                            <div className="tree-footer-navigate-claims">
                                {claims.map((claim,index)=>
                                    <div key={index} style={{display:'inline-block',marginRight:'15px' ,fontSize:'15px'}} onClick={() =>clickOnFooterClaim(claim.ID)}><a href='javascript:;'> - {claim.content} -</a></div>
                                )}
                            </div>
                            {!!clickedClaimTrees &&
                            <div className="tree-footer-clicked-claim">
                                <FullClaim 
                                    userID={props.userID} 
                                    claim ={props.clickedClaimTrees}
                                    isOpen = {true}
                                    isOnTree = {true}
                                />
                            </div>
                            }
                        </div>  
                    </div>
                
             </div>

        )
    }


    return(
        <div className="trees">
            <div>
                {allTrees.map((tree,index)=>
                     <div key={index} id={'tree'+index} style={{position:'relative'}}>
                        <Tree 
                            key = {index}
                            userID = {userID} 
                            claims = {tree.claims} 
                            connectorsObj = {tree.connectorsObj} 
                            treeID = {'tree'+index} 
                            firstClaimID = {tree.connectorsObj[0].claims[0]}
                            tree={tree}
                            reRenderTrees = {reRenderTrees}
                            clickedConnector ={clickedConnector}
                            clickedTree = {clickedTree}
                            setClickedClaimTrees = {setClickedClaimTrees}
                        />
                    </div>
                )}
            </div>  
            <Footer claims={usersClaims} clickedClaimTrees={clickedClaimTrees} userID={userID} /> 
                            
        </div>
    )
}

export default Trees;