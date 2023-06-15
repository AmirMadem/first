
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


- {claims[props.claimID].content} -

position:'absolute',left:left,

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


            <View
                                style={[
                                
                                {
                                    height:lineWidth,
                                    width:lineWidth,
                                    overflow: 'hidden',
                                    borderTop:'solid',
                                    position:'relative',
                                    left:posLeft,
                                    top:posTop,

                                },
                                ]}>
                            </View>








                            <RotatedLine connectorLoc={connectorLoc} claimLoc={claimLoc} styles={styles}/>

                            function arcctg(x) { return Math.PI / 2 - Math.atan(x); }
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          overflow: 'hidden'
        },
        scrollContentContainer: {
          alignItems: 'center',
          paddingBottom: 60,
          overflow: 'hidden'
        },
        box: {
    
          overflow: 'hidden',
        },
        text: {
          fontSize: 14,
          fontWeight: 'bold',
          margin: 8,
          color: '#000',
          textAlign: 'center',
        },
      });
    
         const RotatedLine = (props) =>{
    
    
            var lineWidth;
            var posTop;
            var posLeft;
    
            var tan;
            var angel;
            var isDirectionLeft = false;
            if(props.claimLoc.left - props.connectorLoc.left < 0){
                isDirectionLeft = true;
            }
            var widthDistance = Math.abs(props.claimLoc.left - props.connectorLoc.left) ;
            var heigthDistance = Math.abs(props.claimLoc.top - props.connectorLoc.top) ;
    
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
    
            
    
            posTop = ((Math.sin(angel/57.2958)/2))*lineWidth 
            posLeft = Math.tan(angel/57.2958)*lineWidth/2;
    
            angel = angel +'deg';
    
       
    
            return(
    
                <div style={{position:'absolute',top:props.connectorLoc.top,left:props.connectorLoc.left,zIndex:999999,width:'fit-content',height:'fit-content'}}> 
                    <SafeAreaView >
                        <ScrollView style={{overflow: 'hidden',width:'fit-content',height:'fit-content'}}>
                            <View
                                style={{   
                                    height:lineWidth*2,
                                    width:lineWidth*2,
                                    overflow: 'hidden',
                                    borderBottom:'solid'
                                }}>
                                <View
                                    style={{   
                                        position:'relative',
                                        top:  posTop  ,
                                        left: - posLeft  ,
                                        height:1,
                                        width:lineWidth,
                                        overflow: 'hidden',
                                        transform: [{rotate: angel}],
                                        borderBottom:'solid',
                                    }}>                           
                                </View>                           
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </div>   
            )
         }



<div style={{position:'absolute',left:connectorLoc.left,top:connectorLoc.top}}>
                    <RotatedSquare connectorLoc={connectorLoc} claimLoc={claimLoc} />
                </div>


                - {claims[props.claimID].content} -


                <div><Lines2  lines={linesDom} style={{position:'absolute'}}/></div>


                <RotatedSquare connectorLoc={line.connectorLoc} claimLoc={line.claimLoc} color={lineColor} />

                <div style={{position:'absolute',top:420+rows.length*105}}><Lines2  lines={linesDom} /></div>


                <div style={{position:'absolute',top:450+rows.length*105}}>

                <Lines2 lines={tempLines.lines} />
                <div><VoteButtons userID={userID} connectorsObj={connectorsObj} voteButtons={tempLines.voteButtons} connectorsOutOfFocus={connectorsOutOfFocus}/></div>

                <Footer claims={usersClaims} /> 

                
                {rows.map((consRow,index) => 
                    <div key={index} className="cons-row">
                        <ConnectorRow userID={userID} connRow={consRow} gen={rows.length - index -1} biggestRow = {biggestRow} reRenderTrees={props.reRenderTrees}/>
                    </div>
                )}

                offsetLeft:connectorsLocations[currConnectorID].offsetLeft - factor*(ind01+1) ,
                offsetTop:connectorsLocations[currConnectorID].offsetTop - factor*(ind01)

                const correctClaimsLocatinsForStraightLines = (claimsLocations,connectorsObj) =>{

const flipClaimsOrder = (claims,claimsLocations) =>{
    for(var ind01=0;ind01<claims.length/2;ind01++){
        tempLoc = claimsLocations[claims[ind01]];
        claimsLocations[claims[ind01]] = claimsLocations[claims[claims.length-1-ind01]];
        claimsLocations[claims[claims.length-1-ind01]] = tempLoc;
    }
}

var claims;
var tempLoc;
for(var connectorID in connectorsObj){
    claims = connectorsObj[connectorID].claims;
    if(claims.length >1){
        flipClaimsOrder(claims,claimsLocations);
    }
}
}


<div>{!!votes[voteType] ? votes[voteType] : '0'}</div>

<Lines lines={connectorsLines} />
                            <div><VoteButtons userID={userID} connectorsObj={connectorsObj} voteButtons={voteButtons} connectorsOutOfFocus={connectorsOutOfFocus}/></div>


                            <div style={{position:'relative',textAlign:'center', visibility:isVisible}}> 
                                <div className={'add-connector-tree-container'} style={{position:'absolute',left:-(VOTING_BAR_WIDTH-CONNECTOR_WIDTH)/2}}>
                                    <VotingBar  
                                        userID={props.userID} 
                                        claim={clickedClaim} 
                                        votes={clickedClaim.votes} 
                                        votingTypes={claimsVotesTypesObj} 
                                        claimType ='tree-claim' 
                                        updateVotes={manageData.updateVotes} 
                                        status={clickedClaim.userVoteStatus}
                                    />    
                                </div>
                            </div>