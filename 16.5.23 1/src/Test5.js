
const Test = (props) =>{
	
	return(
		<div>test</div>
	)
}

export default Test;


<div id= {claimDomElementID} className= {!props.isOpen ? "claim-container" :"claim-container claim-container-pressed"} onClick={(event) => onClaimClick(event,props.claim.ID)}>




{Object.keys(claims).map((claim)=> <div style={{position:'absolute',bottom:150*(claims[claim].generation)+"px",left:200*(claims[claim].genCount)+"px"}}>{claims[claim].content}</div>)}


<div style ={{position:'absolute',bottom:200 + 120*connector.generation,right:400 + 150*connector.genCount}}>



{connectors.map((connector) => 
                <div style ={connector.styleObj}>
                    <ConnectorContent connector={connector}/>
                </div>
            )}


{lines.map((line)=>{
                <div className="connector-line" style={{position:'absolute',top:line.offsetTop,left:line.offsetLeft,heigth:line.heigth}}></div>
            })}


style={{position:'absolute',top:line.offsetTop,left:line.offsetLeft,heigth:line.heigth}}


<div style={{position:'absolute', bottom:50,right:600}}>{claims[1].content}</div>


<VotingBar  userID={props.userID} claim={clickedClaim} votes={clickedClaim.votes} votingTypes={votingTypes} claimType ='tree-claim' updateVotes={manageData.updateVotes} status={clickedClaim.userVoteStatus}/>


<VotingBar  userID={props.userID} claim={clickedConnector} votes={clickedClaim.votes} votingTypes={connectorVotesTypes} claimType ='tree-logconn' updateVotes={manageData.updateVotes} status={clickedClaim.userVoteStatus}/>    
<VotingBar  userID={props.userID} claim={props.connector} votes={props.connector.votes} votingTypes={connectorVotesTypes} claimType ='tree-logconn' updateVotes={manageData.updateVotes} status={props.connector.userVoteStatus}/>    



{(!!isClicked) &&
                    <div style={{display:'inline-block',position:'relative'}}>
                        <div style={{position:'absolute',left:'15px',bottom:-13,fontSize:30}} onClick={()=>onAddConnectorClick()}>   
                            <span> +</span>
                        </div>
                    </div>
                    }
                    {isAddCon &&
                        <div style={{position:'fixed',bottom:0,right:'50%'}}>
                            <AddingConnector userID={props.userID} targetClaimID={props.claimID} />
                        </div>
                    }


{(!connectorsOutOfFocus.includes(props.connectorID) && props.connectorID != 0 && props.connectorID != clickedConnector) &&
                       <div style={{position:'absolute',textAlign:'center',top:offsetTop+25,left:offsetLeft,width:offsetwidth}}> 
                            <ExpVotingBar  userID={props.userID} claim={props.connector} votes={props.connector.votes} votingTypes={connectorsVotingTypesObj} claimType ='tree-logconn' updateVotes={manageData.updateVotes} status={props.connector.userVoteStatus}/>    
                        </div>
                    } 
                    {(!!isClicked) &&

                        <div style={{display:'inline-block',position:'relative'}}>
                            <div style={{position:'absolute',left:'15px',bottom:-13,fontSize:30}} onClick={()=>onAddConnectorClick()}>   
                                <span> +</span>
                            </div>
                        </div>
                    }


newExpVotingBar ={
                offsetTop: connectorLocation.offsetTop +35,
                offsetLeft: connectorLocation.offsetLeft,
                connector: connectorsObj[connectorID],
                votes: connectorsObj[connectorID].votes
            }

<ExpVotingBar  userID={props.userID} claim={props.connector} votes={props.connector.votes} votingTypes={connectorsVotingTypesObj} claimType ='tree-logconn' updateVotes={manageData.updateVotes} status={props.connector.userVoteStatus}/>    


<ExpVotingBar 
                style={{
                    position:'absolute',
                    top:line.offsetTop+25,
                    left:line.offsetLeft,
                }}
                userID={props.userID}
                claim={connectorsObj[line.connectorID]}
                votes={connectorsObj[line.connectorID].votes}
                votingTypes={connectorsVotingTypesObj}
                claimType ='tree-logconn' 
                updateVotes={manageData.updateVotes}
                status={connectorsObj[line.connectorID].userVoteStatus}
              /> 


{(!connectorsOutOfFocus.includes(props.connectorID) && props.connectorID != 0 && props.connectorID != clickedConnector) &&
                        <div style={{position:'absolute',textAlign:'center',top:offsetTop+25,left:offsetLeft,width:offsetwidth}}> 
                        </div>
                    }  

{clickedConnector == props.connectorID &&
                         <div style={{position:'absolute',textAlign:'center',top:offsetTopAddCon,left:offsetLeft,width:offsetwidth}}> 
                            <div className={'add-connector-tree-container'}>
                                <AddingConnector userID={props.userID} targetClaimID={clickedClaim.ID} connectorID={props.connectorID} scrollToConnector={scrollToConnector} reRenderTrees={props.reRenderTrees} treeID={treeID}/>
                            </div>
                        </div>
                     }