

var connectorsVotingTypesObj ={
    
    7:{ID:7,title:'',name:'False',color:'#dc2f2f',fullName:'False Claims and Wrong logical connection'},
    8:{ID:8,title:'',name:'FalseCorrect',color:'#f96d00',fullName:'False Claims but Correct logical connection'},
    9:{ID:9,title:'',name:'TrueWrong',color:'blue',fullName:'True Claims but Wrong logical connection'},
    10:{ID:10,title:'',name:'True',color:'green',fullName:'True Claims and Correct logical connection'}

}

var claimsVotesTypesObj ={
    1:{ID:1,title:'True',name:'True',color:'green',backgroundColor:'#d3f6d1',fullName:'100% true !'},
    2:{ID:2,title:'Mostly True',name:'Mostly True',color:'blue',backgroundColor:'#bbe4e9',fullName:'Mostly True...'},
    3:{ID:3,title:'Positive',name:'Positive',color:'#f0d43a',backgroundColor:'#fdffab',fullName:'Got a good feeling about it !'},
    4:{ID:4,title:'Undefined',name:'Undefined',color:'#ff347f',backgroundColor:'#f48db4',fullName:'Un clear or not specific enough'},
    5:{ID:5,title:'Mostly False',name:'Mostly False',color:'#f96d00',backgroundColor:'#f8f398',fullName:'Mostly wrong !'},
    6:{ID:6,title:'False',name:'False',color:'#dc2f2f',backgroundColor:'#e67a7a',fullName:'Complete Bullshit !'},
}

const connectorTypes ={
    0:{title:'Contradict',color:'#dc2f2f'},1:{title:'Weeken',color:'#ff347f'},2:{title:'Aprove',color:'green'},3:{title:'Enhance',color:'blue'}
};

export {connectorsVotingTypesObj};
export {claimsVotesTypesObj};
export {connectorTypes};