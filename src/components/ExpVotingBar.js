import React, { useState, useEffect,useRef} from "react";
import manageData from '../manageData.js';
import VotingBar from './VotingBar.js'


import './expVotingBar.css';



const ExpVotingBar = (props) =>{

    const [isMouseOver,setIsMouseOver] = useState(false);
    const [backgroundColor,setBackgroundColor] = useState("#FFFFFFF");
    const [status,setStatus] = useState();

    var right;
    var bottom;
    var width;
    var claimType;
    var timer;
    
    var voteColor = "#787a7e"
    var color = voteColor
    var voteStatusName;
    

    if(!!props.votingTypes[status]){
        color = props.votingTypes[status].color
        voteStatusName = props.votingTypes[status].name;
    }
    if(!!props.isOnFeed){
        right= '0px'
        bottom='15px'
        width ='600px'
    }
    else{
        right = '139px';
        bottom='0'
        width='300px'
        claimType = 'tree-logconn'
    }
   if(!!props.isOnFooter){
        right= '150px'
        bottom='-55px' 
    }
  

    const mouseOverVoteButton = () =>{
        setBackgroundColor('#f0f2f5');
    }

    const mouseOutVoteButton = () =>{
        setBackgroundColor('white')
    }

    const mouseOverVote = () =>{
        clearTimeout(timer);
        timer = null;
        if(!!props.userID){
            timer = setTimeout(() => {
                setIsMouseOver(true);
            },500) 
        }
        
    }
    const mouseOutVote = () =>{

        clearTimeout(timer);
        timer = null;
        timer = setTimeout(() => {
            setIsMouseOver(false);
        }, 650);
            
    }
    const voteClick =(e) =>{
        e.stopPropagation();
        setIsMouseOver(false);
        if(status != 'UNENGAGED' && status != 0){
            manageData.updateVotes(props.claim.ID,props.userID,'remove',status,claimType,props.claim.claims);
            props.votes[status]--;
            setStatus('UNENGAGED');
        }
    }

    useEffect(() =>{
        setStatus(props.status)
    },[])

    return(
        <div className="vote-button-container" onMouseOver={()=>mouseOverVote()} onMouseOut={()=>mouseOutVote()} style={{width:'fit-content'}}>
            {!props.isOnFeed ?
                <div className="vote-button2" style={{color:color}}> 
                </div>
                :
                <div style={{color:color,width:'50%',textAlign:'center',backgroundColor:backgroundColor}} onMouseOver={()=>mouseOverVoteButton()} onMouseOut={()=>mouseOutVoteButton()} onClick={(event) =>voteClick(event)}>
                    {!!voteStatusName ?
                        <span>{voteStatusName}</span> 
                        :
                        <div><span >⚖️ </span><span>Vote</span></div>
                    }
                </div>   
            }
            <div style={{position:'relative',right:right,bottom:bottom,width:width}}>
                {!!isMouseOver && 
                    <div>
                        <VotingBar userID={props.userID} claim={props.claim} votes={props.votes} votingTypes={props.votingTypes} claimType ={claimType} updateVotes={manageData.updateVotes} status={status} setExpVStatus={setStatus} />    
                    </div>
                }
            </div>
        </div>
    )
}

export default ExpVotingBar