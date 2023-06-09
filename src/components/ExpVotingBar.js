import React, { useState, useEffect,useRef} from "react";
import manageData from '../manageData.js';
import VotingBar from './VotingBar.js'


import './expVotingBar.css';



const ExpVotingBar = (props) =>{

    const [isMouseOver,setIsMouseOver] = useState(false);
    const [status,setStatus] = useState();
    var color = 'black'

    const mouseOverVote = () =>{
        setIsMouseOver(true);
    }
    const mouseOutVote = () =>{
        setIsMouseOver(false)
    }
    if(!!props.votingTypes[status]){
        color = props.votingTypes[status].color
    }

    useEffect(() =>{
        setStatus(props.status)
    },[])

    return(
        <div className="vote-button-container" onMouseOver={()=>mouseOverVote()} onMouseOut={()=>mouseOutVote()}>
            <div className="vote-button2" style={{color:color}}> 
            </div>
            <div style={{position:'relative',right:'139px',width:'300px'}}>
                {!!isMouseOver && 
                    <div>
                        <VotingBar userID={props.userID} claim={props.claim} votes={props.votes} votingTypes={props.votingTypes} claimType ='tree-logconn' updateVotes={manageData.updateVotes} status={status}  setExpVStatus={setStatus}/>    
                    </div>
                }
            </div>
        </div>
    )
}

export default ExpVotingBar