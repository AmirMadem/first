import React from "react";
import { Chart } from "react-google-charts";
import {connectorsVotingTypesObj, claimsVotesTypesObj} from '../voteTypes.js';


export function PieChart(props) {

    const options = {
        legend:"none",
        pieSliceText:"none",
        pieHole: 0.4,
        Description:{
          text:"value"
        },
        slices: {
          0: { color: claimsVotesTypesObj[1].color },
          1: { color: claimsVotesTypesObj[2].color },
          2: { color: claimsVotesTypesObj[3].color },
          3: { color: claimsVotesTypesObj[4].color },
          4: { color: claimsVotesTypesObj[5].color },
          5: { color: claimsVotesTypesObj[6].color },
        }
      };

    const tempData = [
		["Task", "Hours per Day"],
		[claimsVotesTypesObj[1].name, props.votes[1]],
		[claimsVotesTypesObj[2].name, props.votes[2]],
		[claimsVotesTypesObj[3].name, props.votes[3]],
		[claimsVotesTypesObj[4].name, props.votes[4]],
		[claimsVotesTypesObj[5].name, props.votes[5]],
        [claimsVotesTypesObj[6].name, props.votes[6]],
	  ];
    console.log("props")
    console.log(props)

  return (
    <Chart
      chartType="PieChart"
      data={tempData}
      options={options}
      width={"100%"}
      height={"100px"}
    />
  );
}
